import { createHash } from 'crypto';
import { PrismaClient, Prisma } from '@prisma/client';
import Redis from 'ioredis';

export interface JournalLineInput {
  accountId: string;
  direction: 'DEBIT' | 'CREDIT';
  amountMinor: bigint;
}

export interface PostTransactionCommand {
  idempotencyKey: string;
  transactionId: string;
  currency: string;
  lines: JournalLineInput[];
}

export class ImmutableLedgerService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis
  ) {}

  /**
   * Posts a balanced double-entry journal transaction with SHA-256 cryptographic chaining
   * and pessimistic row-level locking (FOR UPDATE NOWAIT).
   */
  public async postJournalTransaction(cmd: PostTransactionCommand) {
    this.verifyZeroSumInvariant(cmd.lines);

    const lockKey = `ledger:lock:${cmd.idempotencyKey}`;
    const acquired = await this.redis.set(lockKey, 'LOCKED', 'EX', 60, 'NX');
    if (!acquired) {
      throw new Error('CONCURRENT_LEDGER_OPERATION_IN_PROGRESS');
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          // 1. Acquire pessimistic row-level locks ordered by accountId to prevent deadlocks
          const sortedAccountIds = [...new Set(cmd.lines.map((l) => l.accountId))].sort();
          for (const accountId of sortedAccountIds) {
            await tx.$queryRaw`
              SELECT id, balance_minor
              FROM ledger_accounts
              WHERE id = ${accountId}::uuid
              FOR UPDATE NOWAIT
            `;
          }

          // 2. Fetch latest cryptographic hash in the chain for audit integrity
          const lastEntry = await tx.immutableLedgerEntry.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { cryptographicHash: true },
          });

          let previousHash = lastEntry?.cryptographicHash ?? '0'.repeat(64);
          const createdEntries = [];

          // 3. Append immutable ledger entries with chained SHA-256 hashes
          for (let i = 0; i < cmd.lines.length; i++) {
            const line = cmd.lines[i];
            const entryIdempotencyKey = `${cmd.idempotencyKey}:leg:${i}`;

            const currentHash = this.computeCryptographicHash({
              transactionId: cmd.transactionId,
              accountId: line.accountId,
              direction: line.direction,
              amountMinor: line.amountMinor,
              currency: cmd.currency,
              previousHash,
            });

            const entry = await tx.immutableLedgerEntry.create({
              data: {
                transactionId: cmd.transactionId,
                idempotencyKey: entryIdempotencyKey,
                accountId: line.accountId,
                direction: line.direction,
                amountMinor: line.amountMinor,
                currency: cmd.currency,
                previousHash,
                cryptographicHash: currentHash,
              },
            });

            const signedDelta =
              line.direction === 'CREDIT' ? line.amountMinor : -line.amountMinor;

            await tx.$executeRaw`
              UPDATE ledger_accounts
              SET balance_minor = balance_minor + ${signedDelta},
                  version = version + 1,
                  updated_at = NOW()
              WHERE id = ${line.accountId}::uuid
            `;

            previousHash = currentHash;
            createdEntries.push(entry);
          }

          return {
            transactionId: cmd.transactionId,
            terminalAuditHash: previousHash,
            entriesCount: createdEntries.length,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          timeout: 5000,
        }
      );
    } finally {
      await this.redis.del(lockKey);
    }
  }

  /**
   * Enforces strict Double-Entry Bookkeeping Zero-Sum Invariant: Sum(Debits) === Sum(Credits)
   */
  private verifyZeroSumInvariant(lines: JournalLineInput[]): void {
    if (lines.length < 2) {
      throw new Error('INVALID_JOURNAL_ENTRY_MINIMUM_TWO_LEGS_REQUIRED');
    }

    let totalDebits = 0n;
    let totalCredits = 0n;

    for (const line of lines) {
      if (line.amountMinor <= 0n) {
        throw new Error('NON_POSITIVE_LEDGER_AMOUNT_REJECTED');
      }
      if (line.direction === 'DEBIT') {
        totalDebits += line.amountMinor;
      } else {
        totalCredits += line.amountMinor;
      }
    }

    if (totalDebits !== totalCredits) {
      throw new Error(
        `ZERO_SUM_INVARIANT_VIOLATION: Debits (${totalDebits}) !== Credits (${totalCredits})`
      );
    }
  }

  private computeCryptographicHash(payload: {
    transactionId: string;
    accountId: string;
    direction: string;
    amountMinor: bigint;
    currency: string;
    previousHash: string;
  }): string {
    const rawData = [
      payload.transactionId,
      payload.accountId,
      payload.direction,
      payload.amountMinor.toString(),
      payload.currency,
      payload.previousHash,
    ].join('|');

    return createHash('sha256').update(rawData).digest('hex');
  }
}
