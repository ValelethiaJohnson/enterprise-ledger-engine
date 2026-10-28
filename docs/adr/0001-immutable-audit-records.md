# ADR 0001: Append-Only Immutable Records and Cryptographic Sealing

* **Status:** Accepted
* **Date:** 2026-10-15
* **Decision Maker:** Valelethia Johnson (Principal FinTech Architect)

## Context
Financial compliance frameworks (SOX, PCI-DSS) strictly forbid mutable updates to accounting ledgers due to risks of undetected fraud and balance alterations.

## Decision
The `enterprise-ledger-engine` enforces a zero-update, zero-delete persistence guarantee. All accounting adjustments occur via explicit reversal journal entries, and all committed batches are sealed using SHA-256 Merkle tree roots.

## Consequences
* **Positive:** Complete cryptographic audit trail and zero risk of silent database tampering.
* **Negative:** Increased storage volume requiring automated historical table partitioning.
