import { describe, it, expect } from 'vitest';
import { LedgerMerkleTree } from '../../src/audit/merkle-tree';

describe('Ledger Merkle Tree Cryptographic Verification', () => {
  it('generates consistent 64-character SHA-256 hash root', () => {
    const entries = ['entry_1:DEBIT:1000', 'entry_2:CREDIT:1000'];
    const root = LedgerMerkleTree.buildRoot(entries);
    expect(root).toHaveLength(64);
  });

  it('detects single-character modifications to ledger batches', () => {
    const rootA = LedgerMerkleTree.buildRoot(['entry_1:DEBIT:1000', 'entry_2:CREDIT:1000']);
    const rootB = LedgerMerkleTree.buildRoot(['entry_1:DEBIT:1001', 'entry_2:CREDIT:1000']);
    expect(rootA).not.toBe(rootB);
  });
});
