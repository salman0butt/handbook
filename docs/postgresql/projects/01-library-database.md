---
id: project-01-library-database
title: Project 1 — Library Database
---

# Project 1 — Library Database

## Requirements

Model members, authors, books, physical copies, loans, and returns. A copy can have at most one active loan; a member may borrow up to five active copies; book metadata survives individual-copy retirement.

## ER diagram

```text
Author >──< Book 1──< BookCopy 1──< Loan >──1 Member
```

## Schema

```sql
CREATE TABLE members (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE books (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isbn text NOT NULL UNIQUE,
  title text NOT NULL
);
CREATE TABLE authors (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE book_authors (
  book_id bigint REFERENCES books(id) ON DELETE CASCADE,
  author_id bigint REFERENCES authors(id) ON DELETE RESTRICT,
  PRIMARY KEY (book_id, author_id)
);
CREATE TABLE book_copies (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id bigint NOT NULL REFERENCES books(id),
  barcode text NOT NULL UNIQUE,
  retired_at timestamptz
);
CREATE TABLE loans (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  copy_id bigint NOT NULL REFERENCES book_copies(id),
  member_id bigint NOT NULL REFERENCES members(id),
  borrowed_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz NOT NULL,
  returned_at timestamptz,
  CHECK (due_at > borrowed_at),
  CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);
CREATE UNIQUE INDEX loans_one_active_copy
ON loans(copy_id) WHERE returned_at IS NULL;
CREATE INDEX loans_active_member
ON loans(member_id, due_at) WHERE returned_at IS NULL;
```

## Seed data

Insert three members, five books with multiple authors, eight copies, two active loans and one returned loan. Include one member with no loans to test outer joins.

## SQL implementation

Practice CRUD plus:

```sql
SELECT b.title, m.name, l.due_at
FROM loans l
JOIN book_copies c ON c.id = l.copy_id
JOIN books b ON b.id = c.book_id
JOIN members m ON m.id = l.member_id
WHERE l.returned_at IS NULL
ORDER BY l.due_at;
```

Borrow inside a transaction after locking/counting active member loans; the partial unique index arbitrates concurrent claims of one copy.

## Concurrency

Two patrons racing for the same copy cannot both create active loans because `loans_one_active_copy` is unique. The five-loan member limit is a cross-row invariant: lock a member row before count+insert, or use Serializable with retry.

## EXPLAIN analysis

Run `EXPLAIN (ANALYZE, BUFFERS)` on active-loans-by-member and overdue-loans queries before/after the partial index. Verify row estimates and whether the small seed still sensibly chooses a Seq Scan.

## Tests

Reject duplicate ISBN/barcode, dangling FKs, invalid dates, second active loan for one copy, and >5 concurrent loans. Test returned loan then reborrow.

## Security review

Runtime role receives CRUD on library tables but no schema ownership. Reporting role gets SELECT only. Parameterize member search values.

## Failure cases

Client disconnect mid-borrow, duplicate retry, overdue-job reprocessing, retired copy with active loan, long transaction blocking another checkout.

## Acceptance criteria

All invariants pass under two concurrent sessions; common queries are deterministic; schema restores from a dump; project README documents transaction boundaries.

## Interview questions

Why a partial unique index instead of an `is_available` boolean? Why is author/book many-to-many? How would you enforce the five-loan limit?

## Senior design review

Discuss fines/history, immutable loan events, reservation queues, multi-branch inventory, keyset pagination, and migration strategy for adding `branch_id` without downtime.