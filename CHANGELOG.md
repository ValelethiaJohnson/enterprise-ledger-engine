# Changelog

All notable architectural evolutions of the **Enterprise Immutable Ledger Engine** are documented in this file.

## [1.1.0] - 2026-10-28
### Added
- Deterministic lexicographical account lock manager (`src/concurrency/lock-manager.ts`).
- High-contention virtual account sharding engine (`src/sharding/hot-account-sharding.ts`).
- Two-phase escrow hold, partial capture, and void engine (`src/escrow/hold-capture-engine.ts`).
- Multi-currency mark-to-market FX revaluation engine (`src/fx/multi-currency-revaluation.ts`).
- End-of-Day (EOD) trial balance certification and three-way PSP settlement matcher.
- Cryptographic SHA-256 hash-chain verifier and Merkle tree batch sealer.
- Zero-trust Kubernetes manifests (`k8s/`), Chaos Mesh fault injection (`chaos/`), and ADRs 0001–0003.

## [1.0.0] - 2026-10-18
### Added
- Initial double-entry bookkeeping schema, BigInt zero-sum invariant checks, and PostgreSQL Serializable transaction pipeline.
