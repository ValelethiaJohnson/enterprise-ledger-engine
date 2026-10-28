import { describe, it, expect } from 'vitest';
import { HotAccountShardingEngine } from '../../src/sharding/hot-account-sharding';

describe('Hot-Account Virtual Sharding Suite', () => {
  it('routes idempotency keys deterministically and aggregates shard balances accurately', () => {
    const shardA = HotAccountShardingEngine.resolveWriteShard('acc_fee', 'idem_001', 16);
    const shardB = HotAccountShardingEngine.resolveWriteShard('acc_fee', 'idem_001', 16);

    expect(shardA).toBe(shardB);
    expect(shardA).toMatch(/^acc_fee#shard_\d{2}$/);

    const total = HotAccountShardingEngine.aggregateShardBalances([10500n, 20300n, 9200n]);
    expect(total).toBe(40000n);
  });
});
