# Security Policy & Cryptographic Ledger Governance

## Supported Versions
| Version | Supported | Compliance Level |
| :--- | :--- | :--- |
| `1.1.x` | ✅ Yes | SOX & PCI-DSS Level 1 |
| `< 1.0` | ❌ No | Deprecated |

## Cryptographic & Accounting Integrity Controls
* **Immutable Append-Only Storage:** Direct `UPDATE` and `DELETE` statements are revoked at the PostgreSQL role level.
* **Tamper-Evident Sealing:** Every journal batch is cryptographically anchored via `SHA-256` hash chaining and Merkle tree roots.
* **Deadlock-Free Serialization:** Multi-account locks are acquired in strict lexicographical UUID order under `SERIALIZABLE` isolation.

## Reporting a Vulnerability
Please report suspected ledger integrity or cryptographic vulnerabilities privately via GitHub Security Advisories. Do not open public issues for zero-day disclosures.
