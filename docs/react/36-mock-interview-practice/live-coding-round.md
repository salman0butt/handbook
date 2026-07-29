---
title: React Live Coding Round
sidebar_position: 7
description: A realistic React live coding interview with progressively changing requirements, debugging tasks, testing prompts, and scoring criteria.
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

# React Live Coding Round

Live coding evaluates how you clarify, model state, choose semantics, narrate trade-offs, debug, adapt requirements, and preserve testability—not only whether the final component renders.

## Round format

<LifecycleBar items={[
  { label: '0–5 clarify', tone: 'blue' },
  { label: '5–25 implement', tone: 'cyan' },
  { label: '25–40 change requirements', tone: 'purple' },
  { label: '40–50 debug edge cases', tone: 'orange' },
  { label: '50–60 tests/design', tone: 'green' },
]} />

## Task 1 — searchable user list

Build a labeled search input, user list with stable IDs, empty state, and name/email filtering.

<DecisionTree
  question="How should the first implementation handle search?"
  items={[
    { label: 'Small in-memory list', value: 'query state + derive filtered users during render' },
    { label: '50,000 users and measured rendering is slow', value: 'Profile, then virtualization/server search/deferred rendering as appropriate' },
    { label: 'Search moves to API', value: 'Add data-layer loading/error/race/cancellation and optional network debounce' },
  ]}
/>

Do not create Effect-synchronized filtered state merely to store a derived list.

## Task 2 — editable todo list

Implement add/toggle/delete/edit plus all/active/completed filtering.

<VisualDiagram title="Keep one canonical todo model and derive views">
  <DiagramRow>
    <DiagramNode title="Canonical todos" tone="blue">IDs · title · completed</DiagramNode>
    <DiagramArrow direction="right" label="derive" />
    <DiagramNode title="Visible todos" tone="green">filter-dependent projection</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A late “undo last action” requirement is a good reason to reconsider transition modeling and possibly introduce reducer/history state rather than stacking unrelated variables.

## Task 3 — reusable dialog

Requirements include portal rendering, accessible title, Escape, focus entry, focus restoration, backdrop behavior, and controlled/uncontrolled API discussion.

<VisualDiagram title="A dialog implementation is a full focus/interaction lifecycle">
  <LifecycleBar items={[
    { label: 'Trigger activated', tone: 'blue' },
    { label: 'Dialog commits', tone: 'purple' },
    { label: 'Focus enters', tone: 'cyan' },
    { label: 'Modal interaction', tone: 'orange' },
    { label: 'Close/Escape', tone: 'red' },
    { label: 'Focus restored', tone: 'green' },
  ]} />
</VisualDiagram>

Discuss what belongs in the design-system primitive versus the product consumer.

## Task 4 — diagnose request-race code

```tsx
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return user ? <ProfileView user={user} /> : null;
}
```

<DecisionTree
  question="What should you notice before rewriting it?"
  items={[
    { label: 'Older request can finish after newer userId', value: 'Race/order handling is missing' },
    { label: 'Request can fail', value: 'Error state/behavior is missing' },
    { label: 'Old profile disappears during refresh', value: 'Clarify desired stale/pending UX' },
    { label: 'Fetching is owned by Effect', value: 'Ask whether target architecture has a better data layer/framework owner' },
  ]}
/>

If the product later wants stale content to remain visible, model that UX intentionally rather than clearing state by reflex.

## Task 5 — form mutation

Build title input, validation, pending, server error, success, and accessible feedback.

<VisualDiagram title="A production form crosses UX and server correctness layers">
  <DiagramGrid columns={3}>
    <DiagramNode title="Client UX" tone="blue">labels · draft · helpful validation</DiagramNode>
    <DiagramNode title="Server trust" tone="red">runtime validation · authorization · duplicate protection</DiagramNode>
    <DiagramNode title="Recovery" tone="green">pending · error summary · focus · success</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Debugging mini-round

Given a draft reset Effect depending on a whole `document` object, ask whether object identity is semantically meaningful, whether `document.id` is the real identity, or whether a keyed editor better expresses “new document means fresh draft.”

## Late requirement changes

A strong interviewer changes one condition: keyboard support, controlled mode, server persistence, optimistic updates, 100k rows, hidden-view state preservation, SSR/hydration, analytics, or testability.

<VisualDiagram title="The goal is to see whether architecture bends or breaks">
  <DiagramRow>
    <DiagramNode title="Initial simple design" tone="blue">correct for known requirements</DiagramNode>
    <DiagramArrow direction="right" label="new constraint" />
    <DiagramNode title="Re-evaluate ownership/boundaries" tone="purple">adapt, do not defend sunk cost</DiagramNode>
    <DiagramArrow direction="right" label="evolve" />
    <DiagramNode title="Still understandable" tone="green">minimal new complexity</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Scoring rubric

| Dimension | Weight |
| --- | ---: |
| Correctness | 25% |
| State model | 20% |
| React reasoning | 15% |
| Accessibility | 10% |
| Debugging | 10% |
| Communication | 10% |
| Adaptability | 10% |

## Strong behavior

<LifecycleBar items={[
  { label: 'Clarify', tone: 'blue' },
  { label: 'Start simple', tone: 'cyan' },
  { label: 'Narrate ownership', tone: 'purple' },
  { label: 'Test risky paths', tone: 'orange' },
  { label: 'Adapt constraints', tone: 'red' },
  { label: 'Explain production next steps', tone: 'green' },
]} />

Avoid synchronized state copies, Effect-hidden business logic, inaccessible custom controls, automatic memoization everywhere, and silent coding with no explanation of decisions.
