---
id: project-06-multi-tenant-saas
title: "Project 6 — Multi-Tenant SaaS"
---

# Project 6 — Multi-Tenant SaaS

## Requirements

Organizations own projects/tasks; users join organizations through memberships with roles. Tenant isolation must be enforced in keys, relationships, queries, and RLS. Slugs/names are unique within one tenant.

## ER diagram

```text
User >──< Membership >── Organization 1──< Project 1──< Task
Organization 1──< ApiKey
```

## Schema

Use UUIDv7 tenant/entity IDs. Composite tenant-aware uniqueness/FKs prevent cross-tenant references:

```sql
CREATE TABLE projects (
  tenant_id uuid NOT NULL REFERENCES organizations(id),
  id uuid NOT NULL DEFAULT uuidv7(),
  slug text NOT NULL,
  name text NOT NULL,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE tasks (
  tenant_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuidv7(),
  project_id uuid NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('todo','doing','done')),
  PRIMARY KEY (tenant_id, id),
  FOREIGN KEY (tenant_id, project_id)
    REFERENCES projects(tenant_id, id)
);
CREATE INDEX tasks_tenant_project_status_idx
ON tasks(tenant_id, project_id, status, id);
```

## RLS

Enable RLS on tenant-owned tables and use a transaction-local tenant context:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY project_tenant ON projects
USING (tenant_id = current_setting('app.tenant_id')::uuid)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```

Runtime role cannot bypass RLS or own tables. Migration role is separate.

## Seed / SQL

Seed 5 tenants with overlapping slugs and varied size. Implement tenant dashboard, project/task pagination, membership role query, active user count, and cross-tenant admin reporting via a controlled privileged path.

## Transactions/concurrency

Membership invitations use tenant-scoped unique keys; accepting invitation is idempotent. Project slug creation relies on unique constraint. Set tenant context with `SET LOCAL` inside each checked-out transaction so pool reuse cannot leak state.

## EXPLAIN / tests / security

Verify tenant-first composite indexes. Test every query under tenant A cannot see/write tenant B, including joins, subqueries, functions, imports, and owner/bypass roles. Test stale pool state and failed transaction reset.

## Failure cases

Missing tenant context, RLS policy accidentally disabled, background job runs with wrong tenant, cross-tenant FK attempt, one huge tenant dominates shared index/table, restore of one tenant required.

## Acceptance criteria

Automated isolation suite proves negative access; tenant-scoped uniqueness works; plans remain efficient across small/large tenants; roles documented; backup/restore and data-export policy defined.

## Interview / senior review

Compare shared schema vs schema/database per tenant; explain RLS owner behavior, noisy neighbors, tenant-aware FKs, per-tenant restore challenges, migration fleet cost, and when to move a tenant to an isolated database.