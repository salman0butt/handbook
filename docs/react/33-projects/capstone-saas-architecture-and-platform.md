---
title: Capstone — SaaS Architecture and Platform Engineering
description: A staff-oriented React capstone covering domain boundaries, state architecture, server/client separation, design systems, performance budgets, observability, migration, and team ownership.
sidebar_position: 4
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Capstone — SaaS architecture and platform engineering

Design a multi-tenant B2B SaaS product with authentication, workspaces, permissions, analytics, large tables, editable workflows, notifications, billing/settings, live updates, SSR/RSC-capable infrastructure, and several frontend teams shipping independently.

The deliverable is an architecture proposal plus a thin vertical slice that proves the design.

## Start with domains, not folders

<VisualDiagram title="The application is composed from owned domains">
  <DiagramStack>
    <DiagramNode title="App shell" tone="slate">routing · session · navigation · platform concerns</DiagramNode>
    <DiagramGrid columns={3}>
      <DiagramNode title="Identity" tone="blue">authentication/session facade</DiagramNode>
      <DiagramNode title="Workspace" tone="cyan">tenant context</DiagramNode>
      <DiagramNode title="Dashboard" tone="purple">analytics</DiagramNode>
      <DiagramNode title="Operations" tone="green">core workflow</DiagramNode>
      <DiagramNode title="Billing" tone="orange">commercial domain</DiagramNode>
      <DiagramNode title="Settings/Notifications" tone="red">supporting domains</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Each domain owns its components, local state, types, data adapters, mutation logic, tests, and intentional public exports. Consumers should use feature entry points rather than deep imports into internals.

## State architecture matrix

| Category | Example | Owner |
| --- | --- | --- |
| Local UI | dropdown open state | component |
| Feature state | selected operation | feature boundary |
| URL state | filters/page/sort | router/URL |
| Server state | records/permissions | server/data layer |
| External state | live connection | external store |
| App-shell state | theme/workspace facade | narrow provider/store |
| Derived state | visible totals | render calculation |

<DecisionTree
  question="Should this go into one global store?"
  items={[
    { label: 'It has a clearer local/URL/server/form/external owner', value: 'No — keep the real source of truth' },
    { label: 'Cross-feature client workflow genuinely needs one owner', value: 'Maybe — document scope, lifetime, writes, subscriptions' },
    { label: 'Reason is only that the application is large', value: 'No — size does not imply centralization' },
  ]}
/>

## Multi-tenant trust boundary

<VisualDiagram title="Tenant identity must participate in every privileged server boundary">
  <DiagramRow>
    <DiagramNode title="Client workspace selection" tone="blue">workspaceId is caller-controlled input</DiagramNode>
    <DiagramArrow direction="right" label="request" />
    <DiagramNode title="Server policy" tone="red">authenticated user + tenant membership + resource authorization</DiagramNode>
    <DiagramArrow direction="right" label="scoped access" />
    <DiagramNode title="Tenant data" tone="green">DB/cache/job/search keys include correct scope</DiagramNode>
  </DiagramRow>
</VisualDiagram>

UI hiding improves UX; it never replaces server authorization.

## Permission model

Prefer a domain policy such as:

```ts
can(currentUser, 'operation:update', operation)
```

over scattered role-string checks. The client model can keep UI consistent, while the server remains authoritative.

## Server/Client architecture

<VisualDiagram title="Default server-friendly regions to server execution; add interaction deliberately">
  <DiagramStack>
    <DiagramNode title="DashboardPage — Server" tone="green">workspace/data-aware composition</DiagramNode>
    <DiagramGrid columns={3}>
      <DiagramNode title="SummaryCards" tone="green">server/read-only</DiagramNode>
      <DiagramNode title="OperationsWorkspace" tone="blue">client island for filters/table/details</DiagramNode>
      <DiagramNode title="BillingSummary" tone="green">server/read-only when possible</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Justify boundaries using execution, data access, serialization, interactivity, bundle cost, and framework/runtime constraints.

## Data access direction

<VisualDiagram title="Components depend on application contracts, not every transport detail">
  <LifecycleBar items={[
    { label: 'UI intent/read', tone: 'blue' },
    { label: 'Feature controller/hook', tone: 'cyan' },
    { label: 'Data adapter', tone: 'purple' },
    { label: 'HTTP/RSC/Server Function', tone: 'orange' },
    { label: 'Backend/domain', tone: 'green' },
  ]} />
</VisualDiagram>

This lets transport evolve without rewriting every component.

## Mutation architecture

<LifecycleBar items={[
  { label: 'Intent', tone: 'blue' },
  { label: 'Client UX validation', tone: 'cyan' },
  { label: 'Server authorization + validation', tone: 'red' },
  { label: 'Transaction/idempotency', tone: 'purple' },
  { label: 'Canonical result', tone: 'green' },
  { label: 'Cache/live reconciliation', tone: 'orange' },
]} />

Document retries, duplicate submissions, stale/conflicting edits, optimistic rollback, and live-event convergence.

## Failure and reveal maps

<VisualDiagram title="Error boundaries should follow independent recovery units">
  <DiagramStack>
    <DiagramNode title="Root boundary" tone="red">whole-app initialization</DiagramNode>
    <DiagramNode title="App shell" tone="blue">stable platform frame</DiagramNode>
    <DiagramGrid columns={3}>
      <DiagramNode title="Dashboard" tone="purple">feature recovery</DiagramNode>
      <DiagramNode title="Billing" tone="orange">independent domain failure</DiagramNode>
      <DiagramNode title="Settings" tone="cyan">independent domain failure</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Expected mutation errors remain normal UI state. Unexpected rendering failures use Error Boundaries.

Suspense boundaries should preserve the stable shell and reveal content in groups aligned with user tasks.

## Design system as platform infrastructure

<DiagramGrid columns={2}>
  <DiagramNode title="Shared primitive contract" tone="green">semantics · focus · keyboard · variants · tokens · refs · composition · form/error relationships</DiagramNode>
  <DiagramNode title="Domain feature" tone="blue">business state · tenant rules · workflow policy</DiagramNode>
</DiagramGrid>

Shared primitives require tests, versioning, deprecation policy, migration guidance, and ownership.

## Performance budgets

<VisualDiagram title="Budgets make performance an owned system property">
  <DiagramGrid columns={3}>
    <DiagramNode title="Load" tone="blue">critical route JS · network count · hydration</DiagramNode>
    <DiagramNode title="Interaction" tone="purple">response latency · non-urgent scheduling</DiagramNode>
    <DiagramNode title="Scale" tone="orange">table/render/list strategy</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

For high-cost features ask whether work can stay server-side, update scope can shrink, lists can be paginated/windowed, code can split, waterfalls can disappear, or non-urgent work can defer. Add manual memoization only after measurement.

## Observability standard

<VisualDiagram title="Every team should emit interoperable production context">
  <DiagramGrid columns={3}>
    <DiagramNode title="Errors" tone="red">caught · uncaught · recoverable · mutation/data failures</DiagramNode>
    <DiagramNode title="Performance" tone="orange">route · interaction · long task · server/mutation latency</DiagramNode>
    <DiagramNode title="Correlation" tone="blue">release · feature · sanitized tenant/user ID · trace ID</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Track outcomes, not sensitive payloads.

## Team ownership and dependency direction

<VisualDiagram title="Platform provides paved roads; product domains retain business ownership">
  <DiagramStack>
    <DiagramNode title="Platform / design system" tone="slate">shell · auth primitives · telemetry · build/test conventions</DiagramNode>
    <DiagramArrow label="stable contracts" />
    <DiagramNode title="Domain features" tone="blue">business workflows + owned data/state</DiagramNode>
    <DiagramArrow label="composed by" />
    <DiagramNode title="Routes/product journeys" tone="green">user-facing integration</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Use CODEOWNERS/package ownership/ADRs so shared changes have visible responsibility and migration paths.

## CI and rollout quality gates

<LifecycleBar items={[
  { label: 'Type/lint', tone: 'blue' },
  { label: 'Unit/integration', tone: 'cyan' },
  { label: 'Accessibility/security', tone: 'red' },
  { label: 'Build/performance budgets', tone: 'orange' },
  { label: 'E2E critical journeys', tone: 'purple' },
  { label: 'Staged rollout + telemetry', tone: 'green' },
]} />

## Capstone evidence

A strong submission includes a domain/ownership map, state matrix, server/client/trust boundaries, mutation contract, error/Suspense map, design-system contract, performance budget, testing strategy, observability model, ADRs, and a rollback/migration plan.

The staff-level skill is not drawing the most boxes. It is designing boundaries that let multiple teams change a production system safely.
