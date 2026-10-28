export interface AccountLockTarget {
  accountId: string;
  lockMode: 'FOR_UPDATE_NOWAIT' | 'FOR_SHARE';
}

export class DeterministicLockManager {
  public static computeCanonicalLockOrder(accountIds: string[]): string[] {
    const deduplicated = Array.from(new Set(accountIds.map((id) => id.trim())));
    if (deduplicated.length === 0) {
      throw new Error('Cannot acquire ledger locks on an empty account set');
    }
    return deduplicated.sort((a, b) => a.localeCompare(b));
  }

  public static buildLockAcquisitionPlan(accountIds: string[]): AccountLockTarget[] {
    const orderedIds = this.computeCanonicalLockOrder(accountIds);
    return orderedIds.map((accountId) => ({
      accountId,
      lockMode: 'FOR_UPDATE_NOWAIT',
    }));
  }
}
