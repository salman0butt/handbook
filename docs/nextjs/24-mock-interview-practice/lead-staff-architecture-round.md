---
title: Lead / Staff Architecture Round
sidebar_position: 5
description: A staff-level mock round on architecture, platform standards, migrations, team ownership, technical debt, incidents, and organizational trade-offs.
---

# Lead / Staff Architecture Round

## 0–10 — Ambiguous architecture

**Prompt:** A Next.js product grew from one team to six. Releases are slow and teams constantly modify each other’s code. What do you change?

Strong answer begins with capability/module ownership, explicit package/public APIs, CODEOWNERS/fitness functions and deployment evidence before proposing microservices or Multi-Zones.

## 10–20 — Standardization

**Prompt:** Teams disagree on Server Actions vs Route Handlers.

Expected staff approach:

```text
identify use cases
create decision criteria
define golden paths
provide examples/tooling
allow documented exceptions
measure adoption/problems
```

Not: “mandate my preferred API everywhere.”

## 20–30 — Major migration

**Prompt:** Lead an upgrade from a legacy client-heavy app to current App Router architecture.

Candidate should cover:

```text
inventory
pilot route
compatibility window
codemods
server/client/auth/data standards
team migration ownership
CI gates
canary/telemetry
rollback
legacy deletion
```

## 30–40 — Reliability/incident leadership

**Scenario:** A shared cache key bug exposes tenant data.

Expected order:

```text
contain/disable unsafe cache
security incident process
identify affected scope
communicate appropriately
repair identity/auth contract
invalidate contamination
negative tests/fitness function
post-incident follow-up
```

Score poorly if performance preservation is prioritized over containment.

## 40–50 — Platform/team boundary

**Prompt:** What should a frontend/platform team own versus product teams?

Good platform candidates:

```text
CI templates
deployment foundations
observability primitives
auth foundation
design-system primitives
architecture checks
```

Product teams retain business rules, user journeys and capability-specific data/mutations.

## 50–60 — Executive trade-off

**Prompt:** Leadership wants microfrontends because “teams need autonomy.” What do you recommend?

Strong answer asks for evidence:

```text
release contention
ownership collisions
failure isolation needs
independent scaling
technology/runtime differences
```

Then compare modular monolith/packages vs Multi-Zones, including hard navigation, asset/auth/version costs.

## Scorecard

0–3 each:

```text
architecture judgement
reversibility
migration leadership
security/reliability
platform thinking
team ownership
communication
business prioritization
```

Staff pass requires technical depth plus a credible way to improve how multiple teams make decisions.