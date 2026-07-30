---
id: 82-90-wal-recovery-replication-ha
title: 82–90 — WAL, Checkpoints, Recovery, Backups, Replication & HA
---

# 82 — WAL

Write-Ahead Logging (WAL) records changes needed for crash recovery before corresponding data pages are considered safely persistent.

```text
transaction changes
      ↓
WAL records + LSNs
      ↓ flush before commit acknowledgement (per durability config)
durable WAL
      ↓
data pages written later
```

WAL is stored in segment files and addressed by **LSN** (Log Sequence Number). It underpins crash recovery, physical replication, WAL archiving/PITR, and logical decoding.

WAL volume rises with data changes, index changes, full-page images after checkpoints, and bulk operations. Monitor generation rate because it affects storage, replication bandwidth, archive capacity, and recovery time.

---

# 83 — Checkpoints

A checkpoint establishes a recovery point and coordinates flushing dirty buffers so recovery need not replay indefinitely from old WAL.

Too-frequent checkpoints can cause write bursts and more full-page-image WAL. Too-infrequent checkpoints can retain more WAL and increase recovery work. Settings such as `checkpoint_timeout`, `max_wal_size`, and `checkpoint_completion_target` shape behavior.

On standby recovery, **restartpoints** play a checkpoint-like role.

Do not tune checkpoint parameters in isolation; observe WAL rate, storage latency, checkpoint timing, backend writes, and recovery objectives.

---

# 84 — Crash Recovery

After an unclean shutdown, PostgreSQL starts from a checkpoint and replays WAL records needed to restore database consistency.

```text
last checkpoint
   ↓
WAL replay
   ↓
consistent page state
   ↓
server accepts normal work
```

Committed changes whose durable WAL was acknowledged can be reconstructed even if their heap/index pages were not yet written. Unlogged table data does not have the same crash-recovery guarantee and is reset after crash recovery as documented.

WAL protects against server/process/storage-write interruption within its assumptions; it is not a substitute for backups against operator error, corruption, region loss, or destructive logical changes.

---

# 85 — Backups

## Logical

`pg_dump` exports one database's logical schema/data. Custom/directory formats support selective/parallel restore with `pg_restore`.

```bash
pg_dump -Fc -d appdb -f appdb.dump
pg_restore --list appdb.dump
pg_restore -d restored_db appdb.dump
```

Useful modes include schema-only/data-only and parallel directory/custom workflows. `pg_dumpall` can capture cluster-wide globals such as roles and can dump all databases, but operational strategies often combine per-database dumps with explicit globals/config management.

## Physical

Physical/base backups copy PostgreSQL's storage state in a recovery-consistent way and combine naturally with WAL archiving/replication.

Choose logical vs physical based on restore granularity, database size, version migration, RPO/RTO, and operational architecture.

A backup is not proven until restoration is tested.

---

# 86 — Restore and Disaster Recovery

Define:

- **RPO:** maximum acceptable data loss measured in time/transactions;
- **RTO:** maximum acceptable service restoration time.

```text
backup without tested restore
=
unverified recovery strategy
```

Run restore drills that validate database startup, schema, row counts/checks, application health, permissions, extensions, configuration, and time to recover.

Scenario matrix should include accidental delete/drop, bad migration, host loss, disk failure, credential incident, corrupted backup, replica failure, and regional outage where relevant.

Keep a runbook with backup locations, encryption/key dependencies, commands, owners, escalation, expected timings, and post-restore verification.

---

# 87 — Point-in-Time Recovery

PITR combines a **base backup** with archived WAL so recovery can replay to a target time/LSN/transaction/timeline.

```text
base backup
  + WAL archive sequence
          ↓
restore base
          ↓
replay WAL
          ↓
stop at recovery target
```

`archive_mode` and a reliable archive command/library are part of this strategy. Archive success must be monitored; an archive command that silently stops uploading can invalidate the assumed RPO.

Timelines distinguish histories after recovery/promotion. Keep enough WAL/archive history to satisfy the recovery window and test recovery targets before an incident.

---

# 88 — Streaming Replication

Physical streaming replication sends WAL from a primary to standby servers.

```text
primary
  WAL sender ═══════ WAL stream ═══════> WAL receiver
                                      standby
```

A standby replays physical changes and can serve read-only queries in hot-standby mode.

**Asynchronous replication:** primary commit need not wait for standby; lower write latency but failover can lose not-yet-replicated commits.

**Synchronous replication:** configured commits wait for required standby acknowledgement stage(s); lower RPO but availability/latency now depends on synchronous standbys and network/storage health.

Replication lag has multiple dimensions: WAL generated but not sent, sent but not received/written/flushed/replayed. Monitor the stage that matters.

---

# 89 — Logical Replication

Logical replication publishes row-level table changes rather than physical pages.

```sql
CREATE PUBLICATION app_pub FOR TABLE customers, orders;
CREATE SUBSCRIPTION app_sub
CONNECTION '...'
PUBLICATION app_pub;
```

Concepts: publication, subscription, initial table synchronization, replication identity for updates/deletes, slots, conflicts, schema compatibility, and sequence/DDL handling.

Use cases include selective replication, near-zero-downtime version migration, data distribution/integration, and consolidating chosen tables. It is not automatic full-database HA: DDL, large objects, sequences and unsupported/conflicting operations need explicit planning.

---

# 90 — High Availability

HA is a system around replication, failure detection, leader election/promotion, fencing, routing, and application retry behavior.

```text
clients → router/service endpoint → primary
                              ↘ standby(s)
```

- **failover:** promote a standby after primary failure;
- **switchover:** planned role transition;
- **split brain:** multiple nodes accept incompatible writes;
- **fencing:** ensure an old primary cannot continue serving writes after leadership changes;
- **quorum:** require a threshold of standbys/participants for configured decisions/acks.

PostgreSQL provides replication/promotion primitives; production HA commonly adds orchestration and connection-routing tooling. Keep the architecture concepts vendor-neutral and test actual failure modes.

**Senior HA review:** specify failure detector assumptions, RPO, RTO, synchronous policy, promotion authority, fencing, DNS/proxy behavior, application connection retry, old-primary rejoin procedure, backup independence, and failover drills.