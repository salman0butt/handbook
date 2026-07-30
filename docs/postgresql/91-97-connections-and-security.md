---
id: 91-97-connections-and-security
title: 91–97 — Connections, Roles, Authentication, TLS, RLS & SQL Injection
---

# 91 — Connection Management

PostgreSQL normally uses a backend process per client connection. Thousands of idle application connections consume memory/process slots and make connection storms dangerous even when query throughput is low.

```text
1000 HTTP requests
      ↓
application pool / queue
      ↓
20–50 database connections (workload-dependent)
      ↓
PostgreSQL
```

Pool sizing is a concurrency/admission-control problem, not “set pool = max_connections.” Leave headroom for administration, migrations, monitoring, replication, and failure recovery.

**Session pooling** keeps a client bound to a server session while checked out. **Transaction pooling** can move the next transaction to a different server connection, so session-local assumptions such as temp tables, prepared statements, advisory session locks, `SET` state, and LISTEN behavior need review. PgBouncer is a common external pooler.

Monitor pool wait time as well as database connection count; queuing before the database can be healthier than saturating it.

---

# 92 — Security Fundamentals

Security separates **authentication** (who are you?) from **authorization** (what can you do?). PostgreSQL authorization centers on roles, ownership, privileges, schemas, RLS, functions, and object-specific rules.

Use least privilege:

```text
admin/migration role → schema ownership + controlled DDL
application role     → only required DML/EXECUTE
read-only role       → selected SELECT
monitoring role      → approved statistics/monitoring access
```

Network controls and TLS protect transport/reachability; they do not replace database authorization. Backups and replicas contain sensitive data and need equivalent access control/encryption/retention policies.

---

# 93 — Roles and Privileges

PostgreSQL roles can represent users or groups. `LOGIN` makes a role directly usable for authentication.

```sql
CREATE ROLE app_rw LOGIN;
CREATE ROLE app_reader NOLOGIN;
GRANT app_reader TO app_rw;
```

Role membership and `INHERIT` determine whether privileges are automatically available; `SET ROLE` can assume a granted role explicitly.

```sql
GRANT USAGE ON SCHEMA app TO app_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.orders TO app_rw;
GRANT USAGE, SELECT ON SEQUENCE app.orders_id_seq TO app_rw;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

Ownership is stronger than ordinary grants: owners control their objects and can grant access. Avoid making runtime application roles schema/table owners.

`ALTER DEFAULT PRIVILEGES` affects objects created in the future by a specific creating role; it does not retroactively grant existing objects and is frequently misunderstood.

---

# 94 — Authentication

`pg_hba.conf` defines host-based authentication rules. PostgreSQL checks matching records in order; the first matching record determines the authentication method.

Methods/concepts include SCRAM password authentication, client certificates, GSS/SSPI, LDAP, peer authentication for local OS identities, OAuth, and `trust`.

**PostgreSQL 18:** OAuth authentication support is part of the production release. Integrate it with supported identity-provider/client behavior and still design database authorization roles carefully.

⛔ `trust` means matching connections do not need database authentication; restrict it to controlled development/bootstrapping contexts, never broad production networks.

Prefer SCRAM over legacy password mechanisms where password auth is used. Protect credential files/environment secrets and rotate credentials without embedding them in application source.

---

# 95 — TLS

TLS encrypts traffic in transit and can authenticate the server/client through certificates.

Client `sslmode` concepts range from allowing/prefering encryption to `verify-ca` and `verify-full`. Production clients should validate the server identity when the threat model requires it; encryption without identity verification can leave interception risks.

```text
application
  ↓ TLS + certificate validation
PostgreSQL endpoint
```

Certificate lifecycle matters: issuance, key permissions, hostname/SAN correctness, rotation, expiry monitoring, and connection-pool reload behavior.

TLS is one layer. Still enforce roles, network boundaries, injection prevention, backups, audit policy, and secret management.

---

# 96 — Row Level Security

RLS adds per-row policy enforcement after `ENABLE ROW LEVEL SECURITY`:

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_documents
ON documents
USING (tenant_id = current_setting('app.tenant_id')::uuid)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```

`USING` controls visibility/which existing rows can be targeted. `WITH CHECK` controls rows allowed after insert/update.

Policies combine according to permissive/restrictive semantics. Table owners and roles with `BYPASSRLS` can bypass policies in documented situations; `FORCE ROW LEVEL SECURITY` changes owner behavior.

## Pooling pitfall

If tenant identity is stored in session settings, a reused pooled connection can leak state unless it is set/reset transactionally and verified on every request.

```sql
BEGIN;
SET LOCAL app.tenant_id = '...';
-- tenant queries
COMMIT;
```

Use a runtime role without bypass privileges; test positive and negative tenant cases; qualify/security-harden policy helper functions; monitor policy performance and index tenant predicates.

---

# 97 — SQL Injection

Unsafe string concatenation mixes SQL program text with untrusted values:

```js
// unsafe
const sql = "SELECT * FROM users WHERE email = '" + email + "'";
```

Use bind parameters:

```js
const result = await client.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email]
)
```

Values and SQL syntax are now separate. Prepared statements/drivers encode parameters according to type instead of turning them into executable SQL text.

## Dynamic identifiers and ORDER BY

Parameters represent **values**, not arbitrary table/column/direction syntax:

```text
ORDER BY $1   -- does not safely mean “choose a column name”
```

Use an allowlist mapping:

```js
const columns = {created: 'created_at', price: 'price'}
const column = columns[input]
if (!column) throw new Error('invalid sort')
const sql = `SELECT ... ORDER BY ${column} DESC`
```

The dynamic fragment comes from trusted constants, not directly from user input.

Stored procedures/functions are not automatically injection-safe: dynamic `EXECUTE` string construction can be vulnerable. ORMs also become unsafe when raw SQL fragments are concatenated.

## Defense in depth

- parameterize values;
- allowlist unavoidable syntax/identifiers;
- least-privilege application role;
- do not expose schema-owner credentials;
- validate input for domain meaning, not as a substitute for parameterization;
- log safely without leaking secrets;
- review dynamic SQL in migrations/functions.

**Interview check:** Explain why escaping alone is weaker than parameters, and why parameterization does not solve authorization or tenant isolation.