export interface BalanceSnapshot {
  accountId: string;
  balanceMinorUnits: bigint;
  lastSequenceNumber: bigint;
  snapshotTimestamp: string;
}

export class AccountSnapshotEngine {
  public static calculateRunningBalance(
    previousSnapshot: BalanceSnapshot,
    recentPostings: Array<{ direction: 'DEBIT' | 'CREDIT'; amountMinorUnits: bigint; sequenceNumber: bigint }>
  ): BalanceSnapshot {
    let newBalance = previousSnapshot.balanceMinorUnits;
    let maxSequence = previousSnapshot.lastSequenceNumber;

    for (const posting of recentPostings) {
      if (posting.sequenceNumber <= previousSnapshot.lastSequenceNumber) {
        continue;
      }
      newBalance = posting.direction === 'CREDIT' 
        ? newBalance + posting.amountMinorUnits 
        : newBalance - posting.amountMinorUnits;

      if (posting.sequenceNumber > maxSequence) {
        maxSequence = posting.sequenceNumber;
      }
    }

    return {
      accountId: previousSnapshot.accountId,
      balanceMinorUnits: newBalance,
      lastSequenceNumber: maxSequence,
      snapshotTimestamp: new Date().toISOString(),
    };
  }
}
