# Enterprise Immutable Ledger Architecture

## 1. Mathematical Zero-Sum Invariant
Every financial mutation consists of $N \ge 2$ journal postings where:
$$\sum_{i=1}^{N} \text{Debit}_i - \sum_{j=1}^{M} \text{Credit}_j = 0$$
All values are represented strictly as 64-bit signed integers (`BigInt`) in ISO-4217 minor currency units.

## 2. Concurrency & Hot-Account Sharding
* **Deterministic Lock Ordering:** Participating `account_id` UUIDs are sorted lexicographically prior to executing `SELECT ... FOR UPDATE NOWAIT`, mathematically eliminating circular wait deadlocks.
* **Virtual Sub-Account Sharding:** High-contention platform fee and clearing accounts are partitioned across $K$ virtual shards (`acc_platform_fee#shard_01..16`) during ingestion and aggregated dynamically during read queries.

## 3. Two-Phase Hold & Capture (Escrow)
Funds transition deterministically across `AVAILABLE`, `ENCUMBERED` (Hold), and `SETTLED` sub-balances without violating double-entry conservation laws.
