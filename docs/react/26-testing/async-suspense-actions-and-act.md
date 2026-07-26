---
title: Async React Testing — act, Suspense, Actions, and Transitions
description: Test asynchronous React behavior, Suspense, transitions, Actions, pending UI, and disappearing content without race-prone timing hacks.
sidebar_position: 2
---

# Async React Testing — act, Suspense, Actions, and Transitions

Modern React can schedule work across async boundaries, Suspense boundaries, Transitions, form Actions, optimistic updates, and Effects. Tests need to wait for **observable states**, not guessed amounts of time.

> **Mental model:** perform one unit of user-visible work, let React flush the related updates, then assert the resulting DOM state.

## 1. What `act` does

React's `act` helper ensures React updates associated with a unit of test work are processed before you assert on the result.

```tsx
await act(async () => {
  root.render(<App />);
});
```

React's current guidance recommends the async form:

```tsx
await act(async () => {
  // render or trigger updates
});
```

The synchronous form is less reliable across scheduling behavior and is planned for removal in the future.

## 2. Prefer Testing Library helpers over manual `act`

React Testing Library's rendering and interaction helpers are designed to integrate with `act`, so most application tests should not need to wrap every operation manually.

Typical test:

```tsx
const user = userEvent.setup();
render(<Counter />);

await user.click(screen.getByRole('button', { name: 'Increment' }));
expect(screen.getByText('Count: 1')).toBeVisible();
```

Reach for direct `act` when:

- testing low-level React integration;
- using `createRoot` directly;
- manually advancing a source of updates outside Testing Library helpers;
- writing library infrastructure where you are responsible for React update flushing.

## 3. Never solve async React tests with arbitrary sleep

Avoid:

```tsx
await new Promise((resolve) => setTimeout(resolve, 500));
expect(screen.getByText('Saved')).toBeVisible();
```

This is slow and race-prone.

Prefer waiting for the state you actually expect:

```tsx
expect(await screen.findByText('Saved')).toBeVisible();
```

or:

```tsx
await waitFor(() => {
  expect(saveRequest).toHaveBeenCalledTimes(1);
});
```

## 4. `findBy` for content that should appear

```tsx
render(<UserProfile userId="42" />);

expect(await screen.findByRole('heading', { name: 'Aisha' })).toBeVisible();
```

`findBy` is ideal when an element should appear after asynchronous work.

## 5. `waitFor` for a condition or side effect

```tsx
await waitFor(() => {
  expect(onSuccess).toHaveBeenCalledWith(expectedUser);
});
```

The callback must throw while the condition is not satisfied. A falsy return value alone does not trigger another retry.

Do not put large amounts of interaction inside `waitFor`; keep it focused on the condition being awaited.

## 6. Waiting for disappearance

```tsx
const spinner = screen.getByRole('status', { name: 'Loading profile' });

await waitForElementToBeRemoved(spinner);
```

Then assert the final UI:

```tsx
expect(screen.getByRole('heading', { name: 'Profile' })).toBeVisible();
```

## 7. Test the full async state sequence when it matters

For a save flow:

```tsx
await user.click(screen.getByRole('button', { name: 'Save' }));

expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();

expect(await screen.findByText('Saved successfully')).toBeVisible();
```

This protects both pending and completion behavior.

## 8. Suspense: assert fallback and revealed content

Given a Suspense-enabled resource:

```tsx
render(
  <Suspense fallback={<p role="status">Loading user…</p>}>
    <UserDetails userPromise={userPromise} />
  </Suspense>,
);

expect(screen.getByRole('status', { name: 'Loading user…' })).toBeVisible();
```

Resolve the resource through your test boundary, then assert the reveal:

```tsx
resolveUser({ id: '42', name: 'Aisha' });

expect(await screen.findByRole('heading', { name: 'Aisha' })).toBeVisible();
```

The exact resource setup depends on your framework/data layer. Do not recreate React's internal Suspense protocol in application tests.

## 9. Test the closest boundary behavior, not internal suspension

A useful Suspense test asks:

- which fallback appears;
- whether already-visible content stays visible;
- what reveals after data becomes ready;
- whether errors go to the intended Error Boundary.

It should not assert that "a Promise was thrown" as the primary UI contract.

## 10. Transitions: urgent input should remain responsive

Suppose a search input updates urgently while results are deferred through a Transition.

Test the behavior:

```tsx
await user.type(screen.getByRole('searchbox'), 'react');

expect(screen.getByRole('searchbox')).toHaveValue('react');
```

Then assert eventual results:

```tsx
expect(await screen.findByRole('heading', { name: 'Results for react' })).toBeVisible();
```

Do not test scheduler implementation details or exact render counts.

## 11. Pending navigation

For a Transition-driven navigation UI:

```tsx
await user.click(screen.getByRole('link', { name: 'Billing' }));

expect(screen.getByText('Loading Billing…')).toBeVisible();
expect(await screen.findByRole('heading', { name: 'Billing' })).toBeVisible();
```

If the product intentionally preserves the previous screen instead of showing a global fallback, assert that contract.

## 12. `useDeferredValue`: test stale content behavior

Suppose the design keeps previous results visible while new results render.

```tsx
expect(screen.getByText('Result for rea')).toBeVisible();

await user.type(screen.getByRole('searchbox'), 'ct');

expect(screen.getByRole('searchbox')).toHaveValue('react');
expect(screen.getByText('Result for rea')).toBeVisible();

expect(await screen.findByText('Result for react')).toBeVisible();
```

This tests the UX contract instead of the deferred value variable itself.

## 13. Form Actions

For a function-valued form Action:

```tsx
const user = userEvent.setup();
render(<ProfileForm />);

await user.type(screen.getByLabelText('Display name'), 'Aisha');
await user.click(screen.getByRole('button', { name: 'Save profile' }));
```

Assert meaningful states:

```tsx
expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
expect(await screen.findByText('Profile saved')).toBeVisible();
```

## 14. `useActionState`

Test the state returned by the Action through the rendered UI.

Error example:

```tsx
await user.click(screen.getByRole('button', { name: 'Create account' }));

expect(await screen.findByRole('alert')).toHaveTextContent(
  'Email is already registered',
);
```

Do not reach into the Hook tuple and assert its internal state directly in a component test.

## 15. `useFormStatus`

Test the descendant form UI that consumes the status:

```tsx
await user.click(screen.getByRole('button', { name: 'Submit order' }));

expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
```

This proves the status context is wired correctly inside the intended form.

## 16. Optimistic UI

A useful optimistic test proves both the immediate projection and eventual result.

```tsx
await user.type(screen.getByLabelText('Message'), 'Hello');
await user.click(screen.getByRole('button', { name: 'Send' }));

expect(screen.getByText('Hello')).toHaveTextContent('Sending');
```

Then complete the request:

```tsx
resolveSend({ id: 'server-42', text: 'Hello' });

await waitFor(() => {
  expect(screen.getByText('Hello')).not.toHaveTextContent('Sending');
});
```

## 17. Optimistic rollback

When a mutation fails:

```tsx
rejectSend(new Error('Network unavailable'));

expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable');
```

If the product contract removes or reverts the optimistic item, assert that too.

Optimistic tests are incomplete if they only test the happy path.

## 18. Error Boundaries

For a component that fails during rendering, test the boundary fallback:

```tsx
render(
  <ErrorBoundary fallback={<p role="alert">Something went wrong</p>}>
    <BrokenWidget />
  </ErrorBoundary>,
);

expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
```

In real test suites, suppress expected console noise carefully if the test environment reports the deliberately triggered error. Do not globally hide unexpected errors.

## 19. Effects and async cleanup

For subscription behavior, assert the external contract.

```tsx
const unsubscribe = vi.fn();
subscribe.mockReturnValue(unsubscribe);

const { unmount } = render(<OnlineIndicator />);

expect(subscribe).toHaveBeenCalled();

unmount();

expect(unsubscribe).toHaveBeenCalled();
```

When the number of setup calls varies under Strict Mode, focus on the invariant: every committed subscription has a matching cleanup.

## 20. Timers

Fake timers can be useful for:

- debounce behavior;
- polling intervals;
- delayed tooltips;
- timeout-based retry logic.

But timer advancement that causes React updates may need to be integrated with the test framework's async/`act` behavior.

Avoid fake timers when real asynchronous state can be tested deterministically through a controlled Promise or network mock instead.

## 21. Promise control beats timing guesses

A deferred helper makes async state deterministic:

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

Then tests decide exactly when async work completes.

## 22. Do not over-assert intermediate states

Concurrency means React may skip intermediate renders that are not part of the user-visible contract.

Avoid assumptions like:

```text
render A
render B
render C
commit C
```

The scheduler may interrupt or abandon work.

Assert committed states the product promises users.

## 23. Flaky async test checklist

When a test flakes:

1. remove arbitrary sleeps;
2. find the observable state that should be awaited;
3. use `findBy`, `waitFor`, or removal helpers appropriately;
4. ensure user interactions are awaited;
5. control the network/Promise boundary deterministically;
6. avoid asserting exact render counts;
7. verify timers are advanced through the test framework correctly;
8. ensure expected errors are not being swallowed;
9. check for state leakage between tests;
10. keep each test focused on one behavior sequence.

## Exercise

Test a search screen that uses:

- an urgent controlled input;
- `useDeferredValue` for results;
- Suspense fallback for first load;
- stale previous results during subsequent searches;
- a retryable error boundary;
- an optimistic "save search" Action.

The tests must not use arbitrary timeouts or inspect Hook internals.

## Interview questions

1. What problem does `act` solve in React tests?
2. Why does React recommend async `act`?
3. When should application tests call `act` directly?
4. What is the difference between `findBy` and `waitFor`?
5. How should you test Suspense without coupling to its internal Promise mechanics?
6. How do you test `useDeferredValue` from the user's perspective?
7. What states should an optimistic mutation test cover?
8. Why are exact render-count assertions fragile with concurrent rendering?

## References

- https://react.dev/reference/react/act
- https://testing-library.com/docs/dom-testing-library/api-async/
- https://testing-library.com/docs/react-testing-library/intro/
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
