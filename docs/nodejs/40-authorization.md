---
title: Authorization
---

# Authorization

```text
authentication → who are you?
authorization  → may you perform this action on this resource now?
```

A valid token does not authorize every route.

## Models

- **RBAC:** roles map to permissions;
- **ABAC:** attributes of caller/resource/context drive policy;
- **ownership:** caller may act on resources they own;
- **policy-based:** explicit rules combine permissions and domain conditions.

## Resource-level checks

```js
const project = await projects.get(id);
if (!project) return notFound();
if (!policy.canEdit(actor, project)) return forbidden();
```

Avoid trusting a client-provided `ownerId` or tenant ID as authorization proof.

## Multi-tenant isolation

Tenant boundaries belong in every data access path. Prefer designs where tenant identity is injected from trusted authentication context and repositories require it structurally.

```text
request credential
      ↓ trusted tenant identity
application policy
      ↓
tenant-scoped repository query
```

A missing `WHERE tenant_id = ?` is a data breach, so reinforce isolation with DB policies/constraints where practical.

## Service boundaries

Internal traffic still requires identity and authorization where actions are sensitive. Network location is not a permission model.

## Testing

Create a permission matrix: role/attribute × resource ownership/tenant × action. Test denies as aggressively as allows.
