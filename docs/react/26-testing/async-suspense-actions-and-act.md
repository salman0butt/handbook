---
title: Async React Testing — act, Suspense, Actions, and Transitions
description: Test asynchronous React behavior, Suspense, transitions, Actions, pending UI, and disappearing content without race-prone timing hacks.
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

# Async React Testing — `act`, Suspense, Actions, and Transitions

Modern React can schedule work across Promises, Suspense, Transitions, form Actions, optimistic updates, and Effects. Tests should wait for **observable states**, not guessed amounts of time.

<VisualDiagram title="Async test loop">
  <LifecycleBar items={[
    { label: 'Trigger one unit of user work', tone: 'blue' },
    { label: 'React schedules / flushes related updates', tone: 'purple' },
    { label: 'Await the observable condition', tone: 'orange' },
    { label: 'Assert committed UI', tone: 'green' },
  ]} />
</VisualDiagram>

## What `act` does

`act` lets React process updates associated with a unit of test work before assertions run.

```tsx
await act(async () => {
  root.render(<App />);
});
```

Current React guidance prefers the async form:

```tsx
await act(async () => {
  // render or trigger updates
});
```

Application tests using Testing Library usually do not need to wrap every operation manually because its helpers integrate with `act`.

<DecisionTree
  question="Should this test call act directly?"
  items={[
    { label: 'Using Testing Library render/user-event normally', value: 'Usually no; await the library helper and observable state' },
    { label: 'Using createRoot or low-level React test infrastructure', value: 'Yes, direct act may be appropriate' },
    { label: 'Manually advancing an external update source/timer', value: 'Possibly; integrate advancement with the test framework and React flush' },
  ]}
/>

## Do not solve async tests with arbitrary sleeps

Avoid:

```tsx
await new Promise(resolve => setTimeout(resolve, 500));
expect(screen.getByText('Saved')).toBeVisible();
```

Prefer the state you actually expect:

```tsx
expect(await screen.findByText('Saved')).toBeVisible();
```

or:

```tsx
await waitFor(() => {
  expect(saveRequest).toHaveBeenCalledTimes(1);
});
```

<VisualDiagram title="Timing guess vs deterministic wait">
  <DiagramGrid columns={2}>
    <DiagramNode title="Arbitrary delay" tone="red">Hope enough time elapsed → slow + flaky</DiagramNode>
    <DiagramNode title="Observable wait" tone="green">Wait until promised UI/condition exists</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## `findBy`, `waitFor`, and disappearance

<DiagramGrid columns={3}>
  <DiagramNode title="findBy" tone="teal">An element should appear asynchronously.</DiagramNode>
  <DiagramNode title="waitFor" tone="purple">A condition/side effect should eventually become true.</DiagramNode>
  <DiagramNode title="waitForElementToBeRemoved" tone="orange">Known content should disappear.</DiagramNode>
</DiagramGrid>

```tsx
expect(await screen.findByRole('heading', { name: 'Aisha' })).toBeVisible();

await waitFor(() => {
  expect(onSuccess).toHaveBeenCalledWith(expectedUser);
});

const spinner = screen.getByRole('status', { name: 'Loading profile' });
await waitForElementToBeRemoved(spinner);
```

## Protect meaningful async state sequences

For a save flow, both pending and completion can be part of the contract:

```tsx
await user.click(screen.getByRole('button', { name: 'Save' }));

expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
expect(await screen.findByText('Saved successfully')).toBeVisible();
```

<VisualDiagram title="Mutation UI contract">
  <DiagramRow>
    <DiagramNode title="Intent" tone="blue">Save</DiagramNode>
    <DiagramArrow direction="right" label="starts" />
    <DiagramNode title="Pending" tone="orange">Disabled / progress UI</DiagramNode>
    <DiagramArrow direction="right" label="settles" />
    <DiagramNode title="Outcome" tone="green">Success or useful error</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Suspense: assert the boundary contract

```tsx
render(
  <Suspense fallback={<p role="status">Loading user…</p>}>
    <UserDetails userPromise={userPromise} />
  </Suspense>,
);

expect(screen.getByRole('status', { name: 'Loading user…' })).toBeVisible();

resolveUser({ id: '42', name: 'Aisha' });

expect(await screen.findByRole('heading', { name: 'Aisha' })).toBeVisible();
```

<VisualDiagram title="Test Suspense from the user's perspective">
  <DiagramStack>
    <DiagramNode title="Child cannot finish" tone="orange">Compatible resource is pending</DiagramNode>
    <DiagramArrow label="nearest boundary" />
    <DiagramNode title="Fallback is visible" tone="blue">Assert meaningful loading UI</DiagramNode>
    <DiagramArrow label="resource resolves" />
    <DiagramNode title="Boundary retries and reveals" tone="green">Assert final content</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Do not make “a Promise was thrown” the main application-test contract.

## Transitions: protect responsiveness and eventual UI

```tsx
await user.type(screen.getByRole('searchbox'), 'react');
expect(screen.getByRole('searchbox')).toHaveValue('react');
expect(await screen.findByRole('heading', { name: 'Results for react' })).toBeVisible();
```

<VisualDiagram title="Urgent and transition work have different observable promises">
  <DiagramRow>
    <DiagramNode title="Urgent" tone="blue">Input reflects typing immediately</DiagramNode>
    <DiagramArrow direction="right" label="while" />
    <DiagramNode title="Transition" tone="purple">Expensive result work may lag / restart</DiagramNode>
    <DiagramArrow direction="right" label="eventually" />
    <DiagramNode title="Committed result" tone="green">Assert final content</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Avoid scheduler implementation assertions and exact render counts.

## Pending navigation

```tsx
await user.click(screen.getByRole('link', { name: 'Billing' }));
expect(screen.getByText('Loading Billing…')).toBeVisible();
expect(await screen.findByRole('heading', { name: 'Billing' })).toBeVisible();
```

If the product preserves the previous page instead of showing a global fallback, assert that product contract instead.

## `useDeferredValue`: test stale UI, not Hook internals

```tsx
expect(screen.getByText('Result for rea')).toBeVisible();
await user.type(screen.getByRole('searchbox'), 'ct');

expect(screen.getByRole('searchbox')).toHaveValue('react');
expect(screen.getByText('Result for rea')).toBeVisible();
expect(await screen.findByText('Result for react')).toBeVisible();
```

<VisualDiagram title="Deferred UI contract">
  <DiagramRow>
    <DiagramNode title="Canonical input" tone="blue">react</DiagramNode>
    <DiagramNode title="Stale results" tone="orange">Previous committed result can remain visible</DiagramNode>
    <DiagramNode title="Deferred catch-up" tone="green">New result eventually commits</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Form Actions, `useActionState`, and `useFormStatus`

Test through the rendered form workflow:

```tsx
await user.type(screen.getByLabelText('Display name'), 'Aisha');
await user.click(screen.getByRole('button', { name: 'Save profile' }));

expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
expect(await screen.findByText('Profile saved')).toBeVisible();
```

Error state:

```tsx
await user.click(screen.getByRole('button', { name: 'Create account' }));
expect(await screen.findByRole('alert')).toHaveTextContent(
  'Email is already registered',
);
```

Do not reach into Hook tuples just to assert private pending/result values.

## Optimistic UI must test convergence and rollback

```tsx
await user.type(screen.getByLabelText('Message'), 'Hello');
await user.click(screen.getByRole('button', { name: 'Send' }));

expect(screen.getByText('Hello')).toHaveTextContent('Sending');
```

Then resolve the canonical result and assert convergence.

<VisualDiagram title="Complete optimistic test">
  <LifecycleBar items={[
    { label: 'User mutation intent', tone: 'blue' },
    { label: 'Optimistic projection appears', tone: 'orange' },
    { label: 'Server/request settles', tone: 'purple' },
    { label: 'Converge to canonical result OR rollback', tone: 'green' },
  ]} />
</VisualDiagram>

A happy-path-only optimistic test is incomplete if failure recovery is part of the product contract.

## Error Boundaries

```tsx
render(
  <ErrorBoundary fallback={<p role="alert">Something went wrong</p>}>
    <BrokenWidget />
  </ErrorBoundary>,
);

expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
```

Suppress expected console noise narrowly if the environment reports the deliberately triggered error. Never globally hide unexpected errors.

## Effects and cleanup

```tsx
const unsubscribe = vi.fn();
subscribe.mockReturnValue(unsubscribe);

const { unmount } = render(<OnlineIndicator />);
expect(subscribe).toHaveBeenCalled();

unmount();
expect(unsubscribe).toHaveBeenCalled();
```

Under Strict Mode, focus on the invariant: every committed subscription has matching cleanup.

## Timers and controlled Promises

Fake timers can be useful for debounce, polling, delayed tooltips, and timeout-driven retries. Timer advancement that causes React updates must cooperate with the test framework's async/`act` behavior.

When possible, a controlled Promise is stronger than guessing timing:

```tsx
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
```

## Do not over-assert intermediate renders

Concurrent rendering may restart or abandon work before it commits.

<VisualDiagram title="Render attempts are not user-visible history">
  <DiagramRow>
    <DiagramNode title="Attempt A" tone="gray">May be discarded</DiagramNode>
    <DiagramNode title="Attempt B" tone="gray">May be interrupted</DiagramNode>
    <DiagramArrow direction="right" label="chosen result" />
    <DiagramNode title="Commit" tone="green">Assert states the product promises</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Flaky async test checklist

1. Remove arbitrary sleeps.
2. Identify the observable state that should be awaited.
3. Await user interactions.
4. Control network/Promise boundaries deterministically.
5. Avoid exact render-count assertions.
6. Integrate fake timers correctly with React updates.
7. Prevent state leakage between tests.
8. Keep each test focused on one behavior sequence.

## Interview questions

1. What problem does `act` solve?
2. Why should app tests usually prefer Testing Library helpers over direct `act`?
3. What is the difference between `findBy` and `waitFor`?
4. How should Suspense be tested without coupling to internal Promise mechanics?
5. How do you test `useDeferredValue` from the user's perspective?
6. Which states should an optimistic mutation test cover?
7. Why are exact render-count assertions fragile in concurrent React?

## References

- https://react.dev/reference/react/act
- https://testing-library.com/docs/dom-testing-library/api-async/
- https://testing-library.com/docs/react-testing-library/intro/
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
