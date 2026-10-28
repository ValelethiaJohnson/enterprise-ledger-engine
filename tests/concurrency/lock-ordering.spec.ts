import { describe, it, expect } from 'vitest';
import { DeterministicLockManager } from '../../src/concurrency/lock-manager';

describe('Deterministic Lexicographical Lock Ordering Suite', () => {
  it('sorts arbitrary account UUID permutations into identical lock acquisition sequences', () => {
    const txA = ['acc_zeta', 'acc_alpha', 'acc_omega', 'acc_alpha'];
    const txB = ['acc_omega', 'acc_zeta', 'acc_alpha'];

    const orderA = DeterministicLockManager.computeCanonicalLockOrder(txA);
    const orderB = DeterministicLockManager.computeCanonicalLockOrder(txB);

    expect(orderA).toEqual(['acc_alpha', 'acc_omega', 'acc_zeta']);
    expect(orderA).toEqual(orderB);
  });
});
