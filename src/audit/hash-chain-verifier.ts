import crypto from 'crypto';

export interface ChainedJournalBlock {
  sequenceNumber: bigint;
  transactionId: string;
  payloadCanonical: string;
  previousHash: string;
  currentHash: string;
}

export class CryptographicHashChainVerifier {
  public static computeEntryHash(
    sequenceNumber: bigint,
    transactionId: string,
    payloadCanonical: string,
    previousHash: string
  ): string {
    const raw = `${sequenceNumber.toString()}|${transactionId}|${payloadCanonical}|${previousHash}`;
    return crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
  }

  public static verifyChainContinuity(chain: ReadonlyArray<ChainedJournalBlock>): boolean {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];
      const expectedHash = this.computeEntryHash(
        block.sequenceNumber,
        block.transactionId,
        block.payloadCanonical,
        block.previousHash
      );
      if (block.currentHash !== expectedHash) {
        return false;
      }
      if (i > 0 && block.previousHash !== chain[i - 1].currentHash) {
        return false;
      }
    }
    return true;
  }
}
