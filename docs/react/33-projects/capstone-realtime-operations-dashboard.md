---
title: Capstone — Real-Time Operations Dashboard
description: A senior React capstone covering live data, state ownership, external stores, accessibility, performance, testing, observability, and failure recovery.
sidebar_position: 2
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

# Capstone — real-time operations dashboard

Build an operations dashboard for live orders, incidents, devices, jobs, or transactions. Users should filter/search, open details, mutate status, receive live updates, understand connection health, preserve navigational filters, recover from failures, and complete the primary flow by keyboard.

## Architecture target

<VisualDiagram title="Keep transport, live subscriptions, feature state, and React UI as separate responsibilities">
  <DiagramStack>
    <DiagramNode title="Server / API" tone="green">authoritative records + permissions</DiagramNode>
    <DiagramArrow label="request/cache + live events" />
    <DiagramNode title="Data adapter / external store" tone="purple">normalize · subscribe · snapshot · reconnect</DiagramNode>
    <DiagramArrow label="feature contract" />
    <DiagramNode title="Feature ownership" tone="blue">selection · workflow · URL coordination</DiagramNode>
    <DiagramArrow label="render" />
    <DiagramNode title="React UI" tone="cyan">filters · table · details · mutation feedback</DiagramNode>
  </DiagramStack>
</VisualDiagram>

The primary design question is: **which system owns each value, and who should subscribe to it?**

## State inventory

<DecisionTree
  question="Which system owns this dashboard value?"
  items={[
    { label: 'Search/filter/date/sort that should survive history/share', value: 'URL' },
    { label: 'Popover/editor/focus/draft state', value: 'Local UI state' },
    { label: 'Selected record or bulk workflow', value: 'Feature-scoped client state' },
    { label: 'Records/details/totals/permissions', value: 'Server/data-cache state' },
    { label: 'Socket health/cursor/live snapshot', value: 'External live store' },
  ]}
/>

Avoid one mega Context that mixes all update frequencies and ownership categories.

## Live connection adapter

```ts
type ConnectionState =
  | { status: 'connecting' }
  | { status: 'connected'; lastEventAt: number }
  | { status: 'reconnecting'; attempt: number }
  | { status: 'offline'; reason?: string };
```

<VisualDiagram title="Components should consume a stable live-data contract">
  <DiagramRow>
    <DiagramNode title="WebSocket/EventSource" tone="orange">transport details</DiagramNode>
    <DiagramArrow direction="right" label="adapter" />
    <DiagramNode title="External store" tone="purple">subscribe · getSnapshot · normalize · reconnect</DiagramNode>
    <DiagramArrow direction="right" label="React subscription" />
    <DiagramNode title="UI" tone="green">connection state + records</DiagramNode>
  </DiagramRow>
</VisualDiagram>

This is a good `useSyncExternalStore` exercise when the live state truly exists outside React.

## Identity under live reordering

```tsx
{records.map(record => (
  <RecordRow key={record.id} record={record} />
))}
```

Use persistent record IDs. Test that an inline editor stays attached to the same record while live events insert, remove, sort, or filter rows.

## Responsive search

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
```

<VisualDiagram title="Separate input urgency from expensive downstream rendering">
  <DiagramRow>
    <DiagramNode title="query" tone="blue">urgent controlled input</DiagramNode>
    <DiagramArrow direction="right" label="defer rendering value" />
    <DiagramNode title="deferredQuery" tone="purple">large result tree may lag</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Deferral does not cancel remote requests. The data layer still owns stale-response/cancellation behavior.

## Scaling the list

<DecisionTree
  question="What is actually limiting the list?"
  items={[
    { label: 'Too many records transferred/filtered client-side', value: 'Server pagination/filtering/sorting' },
    { label: 'Too many mounted DOM rows', value: 'Windowing/virtualization' },
    { label: 'Every live tick updates broad consumers', value: 'Narrow subscriptions/state ownership' },
    { label: 'Row rendering is measured as expensive', value: 'Optimize the verified row/update path' },
  ]}
/>

Measure before choosing.

## Status mutation flow

Model a status sequence such as `Open → Investigating → Resolved`.

<LifecycleBar items={[
  { label: 'User intent', tone: 'blue' },
  { label: 'Pending / optimistic projection', tone: 'purple' },
  { label: 'Server validation + authorization', tone: 'red' },
  { label: 'Canonical result', tone: 'green' },
  { label: 'Reconcile / rollback', tone: 'orange' },
  { label: 'Live event convergence', tone: 'cyan' },
]} />

Protect duplicate submissions, runtime input validation, authorization, rollback, and accessible error feedback. The server record remains canonical.

## Error and loading architecture

<VisualDiagram title="Different failures deserve different containment">
  <DiagramGrid columns={3}>
    <DiagramNode title="Data/live failure" tone="orange">local retry/reconnect UI</DiagramNode>
    <DiagramNode title="Render failure" tone="red">feature-level Error Boundary</DiagramNode>
    <DiagramNode title="Shell failure" tone="slate">root fallback only when app is unusable</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<VisualDiagram title="Keep a stable dashboard shell while independent regions load">
  <DiagramStack>
    <DiagramNode title="Dashboard shell" tone="blue">orientation + filters</DiagramNode>
    <DiagramGrid columns={3}>
      <DiagramNode title="Summary" tone="cyan">independent reveal</DiagramNode>
      <DiagramNode title="Results" tone="purple">table/list boundary</DiagramNode>
      <DiagramNode title="Details" tone="green">record detail boundary</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Accessibility contract

Connection health must not rely on color alone. Filters need visible labels. Row actions need meaningful names. Keyboard users must reach details and restore focus appropriately. Loading and live announcements should preserve orientation and avoid noisy live regions. A virtualized grid still needs a documented accessibility strategy.

## Testing portfolio

<DiagramGrid columns={3}>
  <DiagramNode title="Unit" tone="blue">reducers · event normalization · permissions · URL serialization</DiagramNode>
  <DiagramNode title="Integration" tone="purple">filters · deferred search · details · optimistic success/rollback · reconnect · keyboard</DiagramNode>
  <DiagramNode title="E2E" tone="green">primary mutation flow · reconnect · unauthorized mutation · keyboard-only journey</DiagramNode>
</DiagramGrid>

## Performance investigation

Intentionally create a broad live update, unstable row props, and expensive formatting, then follow an evidence loop:

<LifecycleBar items={[
  { label: 'Reproduce', tone: 'red' },
  { label: 'Profile', tone: 'blue' },
  { label: 'Find dominant cost', tone: 'orange' },
  { label: 'Narrow ownership/work', tone: 'purple' },
  { label: 'Measure again', tone: 'green' },
]} />

## Production evidence

Instrument release IDs, connection failures, mutation failures, latency, retry/reconnect frequency, and trace IDs without logging sensitive record payloads.

A strong capstone explains not merely that the dashboard works, but **why its ownership, subscription, failure, and scaling boundaries remain understandable under live production pressure**.
