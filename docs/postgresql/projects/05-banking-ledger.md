---
id: project-05-banking-ledger
title: Project 5 — Banking / Ledger System
---

# Project 5 — Banking / Ledger System

## Requirements

Model customers, accounts, journals/transfers, immutable ledger entries, currencies, and idempotent payment requests. Every posted journal balances by currency; account balances never derive from an unaudited mutable field alone.

## ER diagram

```text
Customer 1──< Account 1──< LedgerEntry >──1 Journal/Transfer
Currency 1──< Account
```

## Schema

```sql
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  currency char(3) NOT NULL,
  status text NOT NULL CHECK (status IN ('open','frozen','closed'))
);

CREATE TABLE journals (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  idempotency_key text NOT NULL UNIQUE,
  description text NOT NULL,
  posted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  journal_id uuid NOT NULL REFERENCES journals(id),
  line_no integer NOT NULL CHECK (line_no > 0),
  account_id uuid NOT NULL REFERENCES accounts(id),
  amount numeric(20,4) NOT NULL CHECK (amount <> 0),
  currency char(3) NOT NULL,
  PRIMARY KEY (journal_id, line_no)
);
CREATE INDEX ledger_account_posted_idx
ON ledger_entries(account_id, journal_id);
```

Use a posting function/procedure or application transaction that verifies all accounts/currencies, balances the sum per journal, writes journal+entries, and commits atomically. For strict DB enforcement of a cross-row balance invariant, design a deferred constraint-trigger strategy and test it carefully; otherwise encapsulate posting behind one transaction API plus immutable privileges.

## Seed / SQL

Seed multiple customers/accounts/currencies and transfers. Query account statement, running balance using a window function, monthly totals, reconciliation totals, and unmatched external transactions.

## Transactions and locking

For balance-limit/available-funds decisions, lock involved account rows in deterministic ID order. Ledger entries are append-only. Idempotency key protects duplicate transfer submission; external notifications use outbox.

## EXPLAIN

Analyze statement pagination by account/time, journal lookup by idempotency key, and monthly aggregates. Add a materialized/read-model balance only after measuring; reconcile it against ledger sum.

## Tests

Unbalanced journal rejected, mixed currency rejected, duplicate request idempotent, concurrent transfers cannot overspend according to chosen rule, rollback leaves no partial journal, closed/frozen-account policy enforced, decimal precision exact.

## Security review

Runtime posting role can insert through controlled API but cannot update/delete posted entries. Reporting role is read-only. Audit/PII access separated. TLS and credential rotation documented.

## Failure cases

Client timeout after commit, duplicate webhook, deadlock between opposing transfers, partial external payout, reconciliation mismatch, replica stale balance, accidental mutation attempt.

## Acceptance criteria

Double-entry invariants and immutability tests pass; transfer retries are safe; reconciliation is reproducible; plan evidence and restore drill recorded.

## Interview / senior review

Why immutable entries instead of only a balance column? How do you prevent double spending? Where does idempotency live? How do RPO/RTO and reconciliation affect payment architecture? How would you partition a billion-entry ledger without breaking audit queries?