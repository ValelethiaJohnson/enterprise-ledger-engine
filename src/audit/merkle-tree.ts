import crypto from 'crypto';

export class LedgerMerkleTree {
  public static hashLeaf(entryString: string): string {
    return crypto.createHash('sha256').update(`0x00:${entryString}`, 'utf8').digest('hex');
  }

  public static hashNode(left: string, right: string): string {
    return crypto.createHash('sha256').update(`0x01:${left}:${right}`, 'utf8').digest('hex');
  }

  public static buildRoot(leaves: string[]): string {
    if (leaves.length === 0) {
      return crypto.createHash('sha256').update('GENESIS_BLOCK', 'utf8').digest('hex');
    }

    let layer = leaves.map(this.hashLeaf);
    while (layer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < layer.length; i += 2) {
        const left = layer[i];
        const right = i + 1 < layer.length ? layer[i + 1] : left;
        nextLayer.push(this.hashNode(left, right));
      }
      layer = nextLayer;
    }
    return layer[0];
  }
}
