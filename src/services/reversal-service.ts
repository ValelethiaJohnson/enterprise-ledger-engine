export interface JournalEntry {
  id: string;
  accountId: string;
  direction: 'DEBIT' | 'CREDIT';
  amount: bigint;
}

export class ReversalTransactionEngine {
  public static createExactReversal(
    originalTransactionId: string,
    originalEntries: JournalEntry[],
    reason: string
  ): Array<Omit<JournalEntry, 'id'> & { referenceTransactionId: string; reversalReason: string }> {
    return originalEntries.map((entry) => ({
      accountId: entry.accountId,
      direction: entry.direction === 'DEBIT' ? 'CREDIT' : 'DEBIT',
      amount: entry.amount,
      referenceTransactionId: originalTransactionId,
      reversalReason: reason,
    }));
  }
}
