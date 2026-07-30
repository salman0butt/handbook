---
id: project-04-booking-system
title: Project 4 — Booking System
---

# Project 4 — Booking System

## Requirements

Model resources, availability, bookings, holds, customers, and cancellations. Two confirmed/held bookings must never overlap for one resource. Time zones must preserve real instants; retries must be idempotent.

## ER diagram

```text
Resource 1──< Booking >──1 Customer
Resource 1──< AvailabilityWindow
Booking 1──< BookingEvent
```

## Schema

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE resources (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  resource_id bigint NOT NULL REFERENCES resources(id),
  customer_id bigint NOT NULL REFERENCES customers(id),
  period tstzrange NOT NULL,
  status text NOT NULL CHECK (status IN ('held','confirmed','cancelled')),
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT isempty(period))
);

ALTER TABLE bookings ADD CONSTRAINT resource_booking_no_overlap
EXCLUDE USING gist (
  resource_id WITH =,
  period WITH &&
) WHERE (status IN ('held','confirmed'));

CREATE INDEX bookings_customer_time_idx
ON bookings(customer_id, lower(period) DESC, id DESC);
```

## Seed data and SQL

Seed rooms/resources in multiple business time zones and bookings at boundary/DST dates. Implement availability search with range overlap, booking history, upcoming bookings, and expired-hold cleanup.

## Transaction / concurrency

Do **not** `SELECT` for overlap then insert. The exclusion constraint is the final arbiter under concurrent inserts. Checkout can create a short hold transaction; payment occurs outside the DB transaction; confirmation is an idempotent state transition. Expiration worker uses `FOR UPDATE SKIP LOCKED` batches.

## EXPLAIN analysis

Inspect GiST overlap query plans and customer B-tree pagination. Compare candidate-resource prefiltering with overlap checks. Explain why a large broad time range may legitimately scan many index matches.

## Tests

Adjacent `[)` ranges allowed; true overlaps rejected; concurrent same-slot attempts produce one success; cancelled booking frees slot; DST ambiguous local input normalized correctly; duplicate idempotency request returns prior logical booking.

## Security review

Customer queries are ownership-scoped. Staff/admin changes use separate authorization. Parameterize all timestamps/IDs; no dynamic resource table names.

## Failure cases

Payment succeeds after hold expires, worker crashes while expiring, clock/time-zone display mismatch, long transaction holds slot, exclusion conflict surfaced as generic 500, replica stale availability.

## Acceptance criteria

No double booking under a 50-client race test; slot boundaries documented; plan evidence recorded; hold recovery/idempotency proven; restore recreates extension + constraint.

## Interview / senior review

Explain range bounds, exclusion constraints vs application checks, hold/payment saga, Serializable alternative, multi-region booking ownership, and how to migrate from `(start_at,end_at)` columns to `tstzrange` safely.