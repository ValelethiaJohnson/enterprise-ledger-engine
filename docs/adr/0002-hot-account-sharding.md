# ADR 0002: Deterministic Virtual Sharding for High-Contention Ledger Accounts

* **Status:** Accepted
* **Date:** 2026-10-22
* **Decision Maker:** Valelethia Johnson (Principal FinTech Architect)

## Context
Every marketplace checkout credits a small fraction of platform fees to a single central revenue account (`acc_platform_revenue`). Under `SERIALIZABLE` or row-level `FOR UPDATE` locking, this single row becomes a global serialization bottleneck limiting throughput.

## Decision
We partition high-contention internal accounts into $K = 16$ virtual sub-account shards (`#shard_00` to `#shard_15`) selected deterministically by hashing the transaction `Idempotency-Key`.

## Consequences
* **Positive:** Increases concurrent write throughput on platform clearing accounts by $16\times$ with zero lock contention.
* **Negative:** Point-in-time balance queries must sum across all $K$ shards.
