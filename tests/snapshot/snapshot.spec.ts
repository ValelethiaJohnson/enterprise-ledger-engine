import { describe, it, expect } from 'vitest';
import { AccountSnapshotEngine, BalanceSnapshot } from '../../src/snapshot/snapshot-service';

describe('Balance Snapshot Engine Suite', () => {
  it('correctly folds journal entries on top of checkpoint snapshots', () => {
    const baseSnapshot: BalanceSnapshot = {
      accountId: 'acc_merchant_01',
      balanceMinorUnits: 50000n,
      lastSequenceNumber: 100n,
      snapshotTimestamp: '2026-10-01T00:00:00.000Z',
    };

    const newPostings = [
      { direction: 'CREDIT' as const, amountMinorUnits: 15000n, sequenceNumber: 101n },
      { direction: 'DEBIT' as const, amountMinorUnits: 5000n, sequenceNumber: 102n },
    ];

    const result = AccountSnapshotEngine.calculateRunningBalance(baseSnapshot, newPostings);
    expect(result.balanceMinorUnits).toBe(60000n);
    expect(result.lastSequenceNumber).toBe(102n);
  });
});
