---
title: Lead / Staff React Architecture Interview
sidebar_position: 6
description: A lead and staff-level mock interview focused on architecture, platform strategy, migration, governance, observability, and technical leadership.
---

# Lead / Staff React Architecture Interview

This round evaluates whether you can improve systems larger than a single feature or team.

## Interview plan

```text
0–15 min   architecture diagnosis
15–35 min  platform/system design
35–50 min  migration strategy
50–65 min  performance/reliability governance
65–80 min  organizational trade-offs
80–90 min  leadership scenarios
```

## Architecture diagnosis

### Scenario

A React application has:

- 12 frontend teams;
- one shared global store;
- 400+ shared components;
- frequent regressions after shared-package releases;
- slow local development;
- duplicated fetching logic;
- inconsistent accessibility;
- no frontend performance budgets;
- inconsistent error telemetry.

**Question:** What do you change first?

Strong staff answer does **not** propose a rewrite.

It should first establish evidence:

- dependency graph;
- ownership map;
- change failure rate;
- shared-package coupling;
- performance baselines;
- common incident classes;
- design-system adoption gaps;
- data/state ownership inconsistencies.

Then prioritize changes by leverage and reversibility.

## Platform design prompt

Design a frontend platform for multiple product teams.

Possible platform responsibilities:

- application shell;
- routing conventions;
- authentication/session boundary;
- observability SDK;
- design-system primitives;
- accessibility contracts;
- error/loading boundary patterns;
- API/data access conventions;
- feature flagging;
- testing utilities;
- build/deploy tooling;
- performance budgets.

### Follow-up

**What should the platform team *not* own?**

Strong answer avoids centralizing domain logic. Product teams should retain ownership of business behavior and feature-specific decisions within well-defined platform contracts.

## Migration scenario

A large React 17 application must move to modern React while continuing weekly releases.

Candidate should discuss:

- characterization tests;
- dependency compatibility audit;
- root API migration;
- Strict Mode findings;
- legacy Context/refs/test tooling;
- incremental package/feature migration;
- compiler adoption as a separate decision;
- production telemetry;
- rollback strategy;
- avoiding simultaneous architecture rewrite + version migration unless justified.

## Shared state governance

**Question:** How would you stop every team from adding more state to the global store?

Strong answer can include:

- published state taxonomy;
- local/URL/server/external/shared-client categories;
- architectural review for global ownership;
- selective subscription patterns;
- feature-module boundaries;
- examples and tooling;
- migration plan for existing over-globalized state.

## Design-system governance

Scenario:

Teams bypass the design system because shared components are too rigid.

Ask:

- how do you determine whether the problem is adoption, API design, process, or missing primitives?
- when should a component be primitive, compound, headless, or feature-owned?
- how do you evolve contracts without breaking dozens of teams?

Strong answers include:

- usage data;
- RFC/ADR process;
- deprecation windows;
- codemods where useful;
- accessibility tests;
- versioning/change communication;
- escape hatches with governance.

## Reliability scenario

A release causes a 5% increase in blank-page sessions, but no single error dominates.

Staff-level investigation:

- release correlation;
- root-level error telemetry;
- chunk-loading/network failures;
- hydration recoverable errors;
- browser/locale/device segmentation;
- third-party failures;
- feature flags;
- rollback/disable criteria;
- source maps and traces.

## Performance governance

**Question:** How do you make frontend performance an organizational capability instead of one optimization sprint?

Strong answer:

- define representative user journeys;
- collect field metrics;
- set budgets/guardrails;
- integrate regression checks into CI where appropriate;
- use ownership dashboards;
- profile before optimization;
- establish bundle/data/render cost visibility;
- create escalation process for exceptions;
- review architecture causing repeated regressions.

## Server Components architecture prompt

A company wants to adopt Server Components across all products because leadership heard they improve performance.

Strong answer should challenge the premise:

- identify current bottlenecks;
- distinguish RSC from SSR;
- assess framework/tooling compatibility;
- consider server/client boundaries and serialization;
- consider caching/data ownership;
- migration complexity;
- team knowledge;
- observability/testing changes;
- pilot in a suitable area before organization-wide policy.

## Organizational scenario

Two teams need incompatible changes to the same shared table component.

Weak answer:

> “Make the component support both.”

Strong answer asks:

- are both needs truly primitive concerns?
- should shared behavior be decomposed?
- should feature-specific wrappers own differences?
- would a headless primitive reduce coupling?
- what is the long-term public contract?

## Leadership questions

1. Tell me about an architecture decision you reversed.
2. How do you disagree with another senior engineer?
3. How do you balance local team speed with platform consistency?
4. How do you decide when technical debt becomes a roadmap item?
5. How do you mentor engineers without becoming a decision bottleneck?
6. What should require an RFC vs an ordinary pull request?
7. How do you handle a migration that teams keep postponing?
8. How do you measure whether a platform investment actually worked?

## Staff scoring signals

### Strong

- diagnoses before prescribing;
- makes ownership explicit;
- separates platform from domain concerns;
- prefers incremental/reversible migrations;
- uses telemetry and measurable outcomes;
- understands organizational cost as part of architecture;
- creates paved roads without blocking legitimate exceptions;
- plans deprecation and rollout, not just target architecture.

### Weak

- proposes rewrites quickly;
- treats architecture as folder structure;
- centralizes all decisions;
- cannot define success metrics;
- ignores migration cost;
- optimizes technical elegance over team/product constraints.

## Final exercise

Give the candidate this statement:

> “We need one standard React architecture for every frontend team.”

Ask them to respond.

A strong staff answer should seek **standard principles and contracts** while allowing domain-specific implementation choices where variation is useful.