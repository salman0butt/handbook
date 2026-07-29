---
title: Feature Flags, Configuration, State & Cross-Cutting Governance
sidebar_position: 7
description: Govern feature flags, configuration, shared state, experimentation, permissions, telemetry, and cross-cutting concerns without creating global coupling.
---

# Feature Flags, Configuration, State & Cross-Cutting Governance

Large applications accumulate cross-cutting concerns:

```text
feature flags
configuration
experiments
permissions
analytics
localisation
logging
error policy
```

The architectural risk is turning each one into global ambient state that every module can read and mutate freely.

## 1. Configuration is not one thing

Separate:

```text
build configuration
runtime infrastructure configuration
product configuration
tenant configuration
user preferences
feature flags
secrets
```

They have different owners, lifetimes, and security rules.

## 2. Parse configuration at boundaries

Instead of repeated raw environment access:

```ts
process.env.PAYMENTS_URL
process.env.PAYMENTS_URL
```

create a validated server config owner:

```ts
export const config = {
  paymentsUrl: requireUrl('PAYMENTS_URL'),
}
```

Fail startup/build deliberately when a required value is invalid.

## 3. Do not expose server config through generic client config

Client-visible configuration should be an explicit allow-list.

```ts
export type PublicConfig = {
  docsUrl: string
  supportEmail: string
}
```

Never serialize a whole environment/config object to the browser.

## 4. Feature flags should answer a product question

Good:

```text
advanced_reporting enabled for tenant T?
```

Less useful:

```text
newCodePath2 = true
```

Flags should have:

```text
owner
purpose
audience
creation date
expected removal date
fallback behaviour
```

## 5. Separate release flags from entitlement

Release flag:

```text
Should the new reports implementation be active?
```

Entitlement:

```text
Is this tenant allowed to use advanced reports?
```

Permission:

```text
Can this user export this report?
```

These are different decisions.

A user may be entitled but not authorised; a feature may be authorised but not released yet.

## 6. Evaluate security decisions server-side

Client flags can control presentation.

They must not be the only gate for:

```text
paid feature access
admin operation
sensitive data
write permission
```

The authoritative server operation checks entitlement/authorization again.

## 7. Take a consistent flag snapshot when needed

One request rendering several components can become inconsistent if each remote flag lookup sees a different state.

A request-scoped snapshot can provide:

```text
same tenant/user context
same release decision
same experiment assignment
```

Pass the resulting decisions to feature modules rather than letting every component call a flag provider independently.

## 8. Flags have performance cost

Remote flag evaluation can add latency and availability coupling.

Consider:

```text
local SDK cache
request memoization
startup snapshot
bounded timeout
safe default
```

according to the provider and correctness requirement.

Do not let an optional experiment service take down checkout.

## 9. Remove stale flags

Every permanent flag creates two systems:

```text
flag on
flag off
```

That multiplies tests and reasoning.

After rollout:

```text
choose winning path
remove old path
remove flag
remove obsolete tests/config
```

Flag cleanup is architecture maintenance.

## 10. Experiments need stable assignment

If an A/B test should keep a user in one cohort, assignment must use a stable identity and documented lifetime.

Do not accidentally re-randomise on every Server Component render.

Also separate analytics assignment from authorization.

## 11. Shared application state should have a clear category

Before adding a global store, classify the state:

```text
server data
URL state
form state
local UI state
shared client UI state
persistent user preference
```

Use the lowest-scope owner that fits.

Many large apps become simpler when server data remains server-owned and filtering/pagination remains URL-owned.

## 12. Avoid duplicating server truth in global client state

Bad architecture:

```text
Server Component fetches project
→ client copies project into global store
→ mutations update one copy
→ Router refresh updates another copy
```

Now the app has competing freshness models.

Use a client cache/store only when the interaction model truly requires it, and define reconciliation explicitly.

## 13. Context should not become a service locator

Global React Context such as:

```text
AppContext = {
  db?
  user
  tenant
  flags
  billing
  logger
  analytics
  router helpers
  everything...
}
```

creates broad rerender and ownership coupling.

Use narrow providers for genuinely client-shared concerns.

Server code can obtain request context at server boundaries without pushing it through one giant client provider.

## 14. Telemetry schemas should have product owners

A central telemetry platform can own mechanics:

```text
send event
trace span
redact fields
attach release
```

Feature modules own semantic events:

```text
project.created
invoice.failed
report.exported
```

This prevents analytics naming from becoming an unreviewed global free-for-all.

## 15. Errors need a classification contract

Large apps benefit from shared categories:

```text
validation
not found
forbidden
conflict
quota
transient provider failure
unexpected bug
```

Each transport adapts them appropriately.

Do not force every feature to invent unrelated HTTP/error semantics.

## 16. Localisation should have stable ownership

Separate:

```text
locale selection/routing
translation resource ownership
number/date formatting
product content
```

Feature teams can own their translation keys/content while shared localisation infrastructure owns mechanics.

## 17. Cross-cutting wrappers should remain thin

A request helper that adds:

```text
tracing
timeout
retry policy
headers
```

can be useful.

But do not hide business behaviour in invisible middleware stacks.

Critical authorization and domain decisions should remain explicit and testable.

## 18. Global middleware/proxy is expensive architecture

Proxy applies before routes and can become a tempting place for:

```text
auth
flags
localisation
analytics
rewrites
rate limits
experiments
```

Keep it focused on request-front-door concerns.

Do not move deep resource authorization or expensive data access there simply because it is global.

## 19. Configuration changes are releases

A configuration change can break production without a code commit.

Treat important runtime config with:

```text
schema validation
change audit
staged rollout
rollback value
owner
telemetry correlation
```

Secrets/config are part of the release system.

## 20. Feature flags across multiple deployments

In a monorepo, Multi-Zone, or service architecture, several deployments may evaluate the same flag.

Define:

```text
shared flag name/semantics
compatible rollout order
fallback if one app is old
whether assignment must be globally consistent
```

A flag does not remove API/schema compatibility requirements.

## 21. Flags around schema changes need expand/contract

Bad:

```text
flag on → new code expects new DB column immediately
```

Safer rollout:

```text
add compatible schema
→ deploy code that supports both
→ enable flag gradually
→ migrate data
→ remove old path later
```

Feature rollout and database rollout are separate dimensions.

## 22. Kill switches should be designed before incidents

For risky integrations/features, define a safe degraded mode.

Example:

```text
recommendation provider failing
→ disable recommendations
→ preserve core purchase flow
```

A kill switch is useful only if the fallback path is tested.

## 23. Governance should be automated where possible

Examples:

```text
flag registry lint
stale-flag report
config schema tests
forbidden client imports
architecture dependency checks
telemetry schema validation
CODEOWNERS
```

Human conventions alone degrade as team count grows.

## 24. Senior review questions

### Should every flag be evaluated in the browser?

No. Server-side evaluation is preferable for authoritative business/security decisions and can avoid exposing targeting rules.

### Why is a global store often unnecessary in App Router?

Because much application state can remain server-owned, route/URL-owned, form-local, or component-local. Global stores should solve genuine client-shared state, not duplicate every server value.

### What makes configuration an architecture concern?

It changes runtime behaviour, trust boundaries, deployment compatibility, and incident response even without source changes.

## Production checklist

- [ ] configuration categories and owners are explicit
- [ ] required config is validated
- [ ] public config is allow-listed
- [ ] release flags, entitlement, and authorization are distinct
- [ ] authoritative decisions are server-enforced
- [ ] flag providers have latency/failure strategy
- [ ] stale flags are removed
- [ ] global client state does not duplicate server truth unnecessarily
- [ ] cross-cutting telemetry/error/localisation contracts have owners
- [ ] important config/flag changes are auditable and rollbackable

## Exercise

Design rollout of a new AI reporting feature for 5% of eligible enterprise tenants.

Define:

1. entitlement
2. authorization
3. release flag
4. stable experiment assignment
5. server/client evaluation
6. DB compatibility
7. provider outage fallback
8. telemetry
9. rollback
10. flag removal plan
