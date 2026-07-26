---
title: State Architecture Visual Mental Model
description: Visualize local, shared client, server, URL, external, and derived state so ownership decisions come before library choices.
sidebar_position: 0
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
} from '@site/src/components/handbook/VisualDiagram';

# State architecture visual mental model

Senior React state management starts by classifying **what kind of state you have**, not by picking a library.

<VisualDiagram title="State categories in a React application">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Local UI state">
      modal open · active tab · hover/selection · local draft
    </DiagramNode>
    <DiagramNode tone="green" title="Shared client state">
      coordinated workflow state shared across a feature or app boundary
    </DiagramNode>
    <DiagramNode tone="purple" title="Server state">
      remote records, cache freshness, invalidation, retries, pagination
    </DiagramNode>
    <DiagramNode tone="amber" title="URL state">
      route · filter · sort · page · shareable navigation choices
    </DiagramNode>
    <DiagramNode tone="cyan" title="External state">
      browser APIs · third-party stores · subscription-driven sources
    </DiagramNode>
    <DiagramNode tone="slate" title="Derived data">
      values calculated from current authoritative inputs
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Choose one owner per fact

<VisualDiagram title="Ownership prevents synchronization bugs">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="One authoritative fact" />
    <DiagramArrow label="owned by" />
    <DiagramNode tone="green" title="One correct source of truth" />
    <DiagramArrow label="other layers may" />
    <DiagramRow>
      <DiagramNode tone="purple" title="derive" />
      <DiagramNode tone="amber" title="display" />
      <DiagramNode tone="cyan" title="subscribe" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

The danger begins when several layers independently mutate copies of the same fact.

## State scope ladder

<VisualDiagram title="Escalate ownership only as far as necessary">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="One component">
      keep state local
    </DiagramNode>
    <DiagramArrow label="siblings need coordination" />
    <DiagramNode tone="green" title="Closest common parent">
      lift state
    </DiagramNode>
    <DiagramArrow label="distant subtree needs shared access" />
    <DiagramNode tone="purple" title="Context / reducer + Context">
      subtree distribution and shared feature ownership
    </DiagramNode>
    <DiagramArrow label="selector granularity / external store requirements" />
    <DiagramNode tone="amber" title="External client store">
      Redux Toolkit · Zustand · other deliberately chosen store
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Server state is a different lifecycle

<VisualDiagram title="Why remote data is not just another useState value">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Client-owned state">
      Your UI is authoritative for the current value and transition rules.
    </DiagramNode>
    <DiagramNode tone="purple" title="Server-owned state">
      The server remains authoritative; the client holds snapshots with freshness, retry, invalidation, and synchronization concerns.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## URL state deserves first-class ownership

<VisualDiagram title="Shareable navigation choices belong in the URL">
  <DiagramStack align="center">
    <DiagramNode tone="amber" title="URL">
      `?page=2&sort=price`
    </DiagramNode>
    <DiagramArrow label="authoritative navigation state" />
    <DiagramRow>
      <DiagramNode tone="blue" title="Filters UI" />
      <DiagramNode tone="green" title="Results" />
      <DiagramNode tone="purple" title="Back/forward & sharing" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

Avoid a second synchronized copy in component or global state unless there is a clear lifecycle reason.

## External stores and useSyncExternalStore

<VisualDiagram title="React integrates with an external source through a subscription contract">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="External store / browser source" />
    <DiagramArrow label="subscribe + getSnapshot" />
    <DiagramNode tone="green" title="useSyncExternalStore" />
    <DiagramArrow label="React receives a consistent snapshot" />
    <DiagramNode tone="blue" title="Component renders" />
  </DiagramStack>
</VisualDiagram>

<DecisionTree
  question="Where should this state live?"
  items={[
    { label: 'Can it be calculated now?', value: 'Derived value — do not store another copy' },
    { label: 'Only one local subtree needs it?', value: 'Local state / reducer' },
    { label: 'Shared across a subtree?', value: 'Lift state or Context' },
    { label: 'High-frequency shared client state with selective subscriptions?', value: 'External store may fit' },
    { label: 'Owned by a remote API/database?', value: 'Server-state architecture' },
    { label: 'Should survive refresh/share/back-forward?', value: 'URL' },
  ]}
/>

## Architecture rule

<VisualDiagram title="Classify before choosing a tool" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Classify" />
    <DiagramNode tone="green" title="Choose owner" />
    <DiagramNode tone="purple" title="Define lifetime" />
    <DiagramNode tone="amber" title="Define consumers" />
    <DiagramNode tone="cyan" title="Choose smallest fitting tool" />
  </DiagramRow>
</VisualDiagram>

Continue with **[State Categories](./state-categories.md)** and **[useSyncExternalStore](./use-sync-external-store.md)** before moving into the ecosystem-specific sections 16A–16F.
