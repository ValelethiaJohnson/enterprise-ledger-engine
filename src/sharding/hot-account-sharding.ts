import crypto from 'crypto';

export class HotAccountShardingEngine {
  public static resolveWriteShard(
    parentAccountId: string,
    idempotencyKey: string,
    shardCount = 16
  ): string {
    if (shardCount <= 1 || !Number.isInteger(shardCount)) {
      throw new Error('Shard count must be an integer greater than 1');
    }
    const digest = crypto.createHash('sha256').update(idempotencyKey, 'utf8').digest();
    const bucket = digest.readUInt32BE(0) % shardCount;
    const paddedBucket = bucket.toString().padStart(2, '0');
    return `${parentAccountId}#shard_${paddedBucket}`;
  }

  public static aggregateShardBalances(shardBalances: ReadonlyArray<bigint>): bigint {
    return shardBalances.reduce((acc, current) => acc + current, 0n);
  }
}
