import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImmutableLedgerService } from '../../src/services/ledger.service';

describe('ImmutableLedgerService - Zero-Sum & Cryptographic Chain Invariants', () => {
  let mockPrisma: any;
  let mockRedis: any;
  let ledgerService: ImmutableLedgerService;

  beforeEach(() => {
    mockPrisma = {
      $transaction: vi.fn(async (callback) => callback(mockPrisma)),
      $queryRaw: vi.fn().mockResolvedValue([{ id: 'acc-1', balance_minor: 0n }]),
      $executeRaw: vi.fn().mockResolvedValue(1),
      immutableLedgerEntry: {
        findFirst: vi.fn().mockResolvedValue({
          cryptographicHash: '0'.repeat(64),
        }),
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: 'entry-uuid-1',
          ...data,
        })),
      },
    };

    mockRedis = {
      set: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
    };

    ledgerService = new ImmutableLedgerService(mockPrisma, mockRedis);
  });

  it('should reject unbalanced journal entries violating the zero-sum invariant', async () => {
    await expect(
      ledgerService.postJournalTransaction({
        idempotencyKey: 'idem-unbalanced-001',
        transactionId: '550e8400-e29b-41d4-a716-446655440000',
        currency: 'USD',
        lines: [
          { accountId: 'acc-debit-1', direction: 'DEBIT', amountMinor: 15000n },
          { accountId: 'acc-credit-1', direction: 'CREDIT', amountMinor: 10000n },
        ],
      })
    ).rejects.toThrow('ZERO_SUM_INVARIANT_VIOLATION');
  });

  it('should post balanced double-entry legs and chain SHA-256 cryptographic hashes', async () => {
    const result = await ledgerService.postJournalTransaction({
      idempotencyKey: 'idem-balanced-002',
      transactionId: '550e8400-e29b-41d4-a716-446655440001',
      currency: 'USD',
      lines: [
        { accountId: 'acc-debit-1', direction: 'DEBIT', amountMinor: 25000n },
        { accountId: 'acc-credit-1', direction: 'CREDIT', amountMinor: 25000n },
      ],
    });

    expect(result.entriesCount).toBe(2);
    expect(result.terminalAuditHash).toMatch(/^[a-f0-9]{64}$/);
    expect(mockPrisma.immutableLedgerEntry.create).toHaveBeenCalledTimes(2);
  });
});
