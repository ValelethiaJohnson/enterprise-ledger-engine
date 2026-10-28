import crypto from 'crypto';

export class LedgerIdempotencyGuard {
  public static hashJournalPayload(
    idempotencyKey: string,
    currency: string,
    legs: ReadonlyArray<{ accountId: string; direction: string; amountMinorUnits: bigint }>
  ): string {
    const normalizedLegs = legs
      .map((l) => `${l.accountId}:${l.direction}:${l.amountMinorUnits.toString()}`)
      .join(';');
    return crypto
      .createHash('sha256')
      .update(`${idempotencyKey}|${currency}|${normalizedLegs}`, 'utf8')
      .digest('hex');
  }

  public static assertDeterministicReplay(storedHash: string, incomingHash: string): void {
    if (storedHash !== incomingHash) {
      throw new Error('Idempotency conflict: key reused with mutated journal legs');
    }
  }
}
