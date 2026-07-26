---
title: Coding, Output, Bug-Finding, and Trick Questions
description: Hands-on React interview exercises covering render prediction, state queues, keys, Effects, closures, reducers, custom Hooks, performance bugs, async races, and architecture refactoring.
sidebar_position: 10
---

# Coding, Output, Bug-Finding, and Trick Questions

These exercises test whether you can **reason from React's model**, not merely repeat definitions.

## State and rendering

### 1. What does this render after one click?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer:** `1`, because all three updates use the same `count` snapshot (`0`) and request `1`.

### 2. How do you make the previous example increment by 3?

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

**Answer:** Updater functions consume the queued previous value in sequence.

### 3. What does this log?

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(1);
  console.log(count);
}
```

**Answer:** `0` in that handler execution. The handler sees the current render snapshot.

### 4. Find the bug.

```jsx
user.name = 'Ali';
setUser(user);
```

**Answer:** Direct mutation reuses the same object and changes an existing snapshot. Create a new object.

### 5. Fix it.

```jsx
setUser(prev => ({ ...prev, name: 'Ali' }));
```

### 6. Why can this state shape become inconsistent?

```jsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');
```

**Answer:** `fullName` is derivable from the other two values and can drift. Compute it during render.

### 7. Refactor the previous example.

```jsx
const fullName = `${firstName} ${lastName}`.trim();
```

### 8. What is wrong with this initialization?

```jsx
const [value, setValue] = useState(expensiveCalculation());
```

**Answer:** `expensiveCalculation()` runs on every render even though React uses the initial state only once. Use lazy initialization if the calculation is expensive:

```jsx
const [value, setValue] = useState(() => expensiveCalculation());
```

### 9. When would the lazy initializer still run more than once in development?

**Answer:** Strict Mode development checks may invoke initialization logic more than once to reveal impurity. It must be pure.

### 10. Why is this component type unstable?

```jsx
function Parent() {
  function Child() {
    const [count] = useState(0);
    return <div>{count}</div>;
  }

  return <Child />;
}
```

**Answer:** `Child` is a new function identity on every `Parent` render, which can cause remount/state reset. Define it outside.

## Keys and identity

### 11. Find the list bug.

```jsx
items.map((item, index) => (
  <Row key={index} item={item} />
));
```

**Answer:** If items reorder/insert/delete, index identity may attach row state to the wrong item. Use a stable item ID.

### 12. What happens here on every render?

```jsx
<Row key={Math.random()} item={item} />
```

**Answer:** React sees a new identity each render, causing remount and state loss.

### 13. Why can changing a key fix a form-reset requirement?

**Answer:** A new key intentionally creates a new component identity with fresh state.

### 14. Does a key need to be globally unique?

**Answer:** No, unique among siblings in the relevant list.

### 15. Is `key` available as `props.key`?

**Answer:** No. Pass the value separately if the child needs it.

## Effects

### 16. Find the unnecessary Effect.

```jsx
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);
```

**Answer:** `fullName` is derived. Compute it during render.

### 17. What causes the loop?

```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

**Answer:** The Effect updates `count`, which changes its dependency, which reruns the Effect indefinitely.

### 18. Why is this Effect suspicious?

```jsx
useEffect(() => {
  if (submitted) {
    sendAnalytics('form-submitted');
  }
}, [submitted]);
```

**Answer:** Submission analytics are caused by the submit event, so event-handler logic is usually clearer than deriving the event from state after render.

### 19. Find the stale closure.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

**Answer:** The interval captures initial `count`. Use a functional update if each tick means “increment previous count”:

```jsx
setCount(c => c + 1);
```

### 20. Why is adding `count` to the previous dependency array not always ideal?

**Answer:** It would recreate the interval on every count change. Correctness is possible, but the functional update expresses the actual transition without restarting the timer.

### 21. Find the subscription bug.

```jsx
useEffect(() => {
  socket.on('message', handleMessage);
}, [socket, handleMessage]);
```

**Answer:** Missing cleanup can accumulate listeners.

### 22. Fix it.

```jsx
useEffect(() => {
  socket.on('message', handleMessage);
  return () => socket.off('message', handleMessage);
}, [socket, handleMessage]);
```

### 23. Why might the fixed version still resubscribe every render?

**Answer:** If `handleMessage` is recreated and its identity is a true subscription dependency. Depending on semantics, move logic inside the Effect, stabilize it, or use an Effect Event for latest non-reactive logic.

### 24. What's wrong here?

```jsx
useEffect(async () => {
  const data = await load();
  setData(data);
}, []);
```

**Answer:** An Effect callback should not return a Promise. Create an async function inside and return synchronous cleanup/cancellation.

### 25. Find the race condition.

```jsx
useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser);
}, [id]);
```

**Answer:** A slower request for an old `id` may finish after the new request and overwrite current state. Cancel/ignore stale requests or use a data layer with request coordination.

### 26. Fix the race with AbortController.

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(error => {
      if (error.name !== 'AbortError') throw error;
    });

  return () => controller.abort();
}, [id]);
```

### 27. Why is this dependency suppression dangerous?

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => connect(roomId), []);
```

**Answer:** The Effect claims it does not depend on `roomId` while reading it. If room changes, synchronization becomes stale.

### 28. `useEffect` or `useLayoutEffect` for measuring a tooltip before paint?

**Answer:** `useLayoutEffect` when measurement must affect layout before the browser paints; otherwise prefer `useEffect`.

### 29. `useEffectEvent` trick: should this be in dependencies?

```jsx
const onConnected = useEffectEvent(() => {
  showNotification(theme);
});
```

**Answer:** No. Effect Events are intentionally excluded from dependency arrays and are meant to be invoked from Effects/Effect Events.

### 30. Can you pass `onConnected` from the previous example to a child button?

**Answer:** No. Use a regular event handler for user events.

## Refs

### 31. Why doesn't this update the UI?

```jsx
const countRef = useRef(0);
countRef.current++;
```

**Answer:** Ref mutation does not schedule a render.

### 32. State or ref for an interval ID?

**Answer:** Usually a ref because the ID must persist but does not affect render output.

### 33. State or ref for whether a dialog is open?

**Answer:** State, because it changes rendered UI.

### 34. What's risky here?

```jsx
ref.current = calculateSomething();
return <div />;
```

**Answer:** Arbitrary ref writes during render can make render impure/order-dependent. Keep mutable side effects outside render.

### 35. Why expose an imperative handle instead of the entire DOM node?

**Answer:** It narrows the component's public imperative contract and avoids coupling consumers to implementation details.

## Context and reducers

### 36. Find the Context performance issue.

```jsx
<AuthContext value={{ user, logout }}>
  {children}
</AuthContext>
```

**Answer:** The object identity changes every render. Whether this matters depends on provider renders and consumer cost. Better architecture/provider stability may help; don't automatically memoize without understanding updates.

### 37. What's wrong with this reducer?

```jsx
function reducer(state, action) {
  state.items.push(action.item);
  return state;
}
```

**Answer:** It mutates the existing state object/array. Return a new next state.

### 38. Fix it.

```jsx
function reducer(state, action) {
  return {
    ...state,
    items: [...state.items, action.item],
  };
}
```

### 39. Why might `{loading, success, error}` booleans be a bad async state model?

**Answer:** Impossible combinations are possible. Use an explicit discriminated state such as idle/loading/success/error.

### 40. What is wrong with a reducer dispatching a network request internally?

**Answer:** Reducers should be pure. Trigger side effects in event/action orchestration outside the reducer and dispatch results back as actions.

## Performance and memoization

### 41. Will `useCallback` make this faster by itself?

```jsx
const handleClick = useCallback(() => {
  setOpen(true);
}, []);
```

**Answer:** Not necessarily. It stabilizes identity; benefit depends on whether something meaningful consumes that identity.

### 42. Find the memoization failure.

```jsx
const List = memo(function List({ options }) { ... });

<List options={items.map(formatItem)} />
```

**Answer:** `items.map(...)` creates a new array each parent render, so shallow prop identity changes. Only optimize if profiling shows the child render is costly.

### 43. Why can custom `memo` comparison be dangerous?

**Answer:** Incorrect comparison can preserve stale props/closures and comparison itself may cost more than rendering.

### 44. Does React Compiler mean this code never rerenders?

**Answer:** No. Compiler can optimize memoization opportunities but state/context/input changes still cause necessary work. It is not a “render once” system.

### 45. What's the first step when a component renders 100 times?

**Answer:** Determine whether those renders are actually expensive or user-visible before optimizing the count.

## Suspense and concurrency

### 46. Why is this wrong for controlled input state?

```jsx
startTransition(() => {
  setText(e.target.value);
});
```

**Answer:** The input value update is urgent and should stay synchronized with typing. Transition expensive derived work instead.

### 47. Refactor it.

```jsx
setText(nextText);
startTransition(() => {
  setQuery(nextText);
});
```

### 48. What does `useDeferredValue` not do?

**Answer:** It does not debounce requests or make an expensive calculation cheaper; it lets rendered consumption lag behind urgent updates.

### 49. Suspense trick: does any Promise inside `useEffect` trigger Suspense fallback?

**Answer:** No. Suspense requires supported rendering-time resource integration; async Effect work does not automatically suspend render.

### 50. Why can one huge Suspense boundary produce poor UX?

**Answer:** One slow child can hold back an entire page behind a single fallback. Split boundaries around meaningful reveal units.

## SSR and RSC

### 51. Find the hydration mismatch.

```jsx
function Clock() {
  return <div>{Date.now()}</div>;
}
```

**Answer:** Server and client render at different times. Use a consistent server snapshot or defer changing time-dependent UI appropriately.

### 52. Find another hydration mismatch.

```jsx
return typeof window === 'undefined'
  ? <Desktop />
  : <Mobile />;
```

**Answer:** Initial server/client output can differ. Browser-only conditions need an architecture that preserves initial hydration consistency.

### 53. Why is `createRoot` wrong for server-rendered HTML?

**Answer:** It does not hydrate existing React HTML. Use `hydrateRoot`.

### 54. RSC trick: does `'use server'` mark a Server Component?

**Answer:** No. It marks Server Functions. Server Components have no `'use server'` component marker.

### 55. Can a Client Component receive Server Component JSX as `children`?

**Answer:** Yes, because the boundary is based on module dependency/execution, not simply rendered descendant shape.

### 56. Security bug: what is wrong here?

```jsx
'use server';

export async function deleteProject(projectId) {
  await db.project.delete({ where: { id: projectId } });
}
```

**Answer:** No authentication/authorization or runtime validation. A client can invoke the Server Function with arbitrary accessible serialized input.

### 57. Why is this client check insufficient?

```jsx
{user.isAdmin && <DeleteButton />}
```

**Answer:** It improves UX but does not authorize the server mutation. Server enforcement is required.

## Testing and accessibility

### 58. Which query is better?

```jsx
screen.getByTestId('submit')
```

or

```jsx
screen.getByRole('button', { name: /submit/i })
```

**Answer:** Role/name is usually better because it tests the accessible contract users rely on.

### 59. What's wrong with this custom button?

```jsx
<div onClick={save}>Save</div>
```

**Answer:** Missing native button semantics, keyboard activation, focusability, disabled behavior, and accessible role. Use `<button>` unless a custom pattern is genuinely required.

### 60. Why is this label incomplete?

```jsx
<span>Email</span>
<input id="email" />
```

**Answer:** The visible text is not programmatically associated. Use `<label htmlFor="email">Email</label>` or another valid accessible naming relationship.

### 61. Why can `aria-label="Close"` on an icon button be good?

**Answer:** It provides an accessible name when the button has no visible text. Prefer visible labels when appropriate, but icon-only controls need a meaningful name.

### 62. What should a modal restore after closing?

**Answer:** Usually focus to the trigger or another logical location.

## Architecture refactoring

### 63. You find 25 pieces of state in a page component. What do you do?

**Answer:** Do not automatically move everything to Redux. Classify state, identify feature owners, derive redundant values, localize interaction state, separate URL/server/external state, and split boundaries by responsibility.

### 64. A Context provider rerenders 300 consumers on every websocket message. Fix?

**Answer:** Move high-frequency data to a selective external store/subscription model or partition by update frequency; keep low-frequency dependency/config Context separate.

### 65. A team wants to wrap every component in `memo`. What do you say?

**Answer:** Profile first. React Compiler already handles many memoization opportunities, and blanket memoization adds comparisons/dependency complexity without guaranteed benefit.

### 66. A legacy app uses classes everywhere. Rewrite?

**Answer:** Not automatically. Classes remain supported. Prioritize removed API upgrades and product-risk areas, add tests, and migrate incrementally where functional patterns provide concrete value.

### 67. Your production UI sometimes shows an old search result. Where do you look?

**Answer:** Async request ordering/race conditions, cancellation, cache keys, stale closures, URL/query synchronization, and whether old responses can overwrite newer authority.

### 68. A modal works with mouse but not keyboard. What are likely issues?

**Answer:** Trigger semantics, initial focus, tab containment, Escape behavior, focus restoration, accessible name/role, and background interaction handling.

### 69. A render is slow only with 10,000 rows. First architectural option?

**Answer:** Virtualization/windowing and reducing rendered DOM, not only memoizing each row.

### 70. A build passes locally but hydration errors spike after deploy. What production causes would you investigate?

**Answer:** Mixed server/client asset versions, CDN cache skew, locale/config differences, feature flag inconsistency, server data snapshots, deployment order, or nondeterministic render values.

## Final rapid-fire traps

### 71. Does setting state immediately mutate state? — No.
### 72. Does a ref update cause render? — No.
### 73. Is Context a global store? — Not inherently.
### 74. Is Suspense a fetch API? — No.
### 75. Is concurrency multithreading? — No.
### 76. Does `memo` guarantee no render? — No.
### 77. Does `useCallback` make a function execute faster? — No.
### 78. Should `useId` be used as list key? — No.
### 79. Is `'use server'` a Server Component marker? — No.
### 80. Does TypeScript validate user input at runtime? — No.
### 81. Do Error Boundaries catch every JavaScript error? — No.
### 82. Are Effects lifecycle-method replacements? — No; think synchronization.
### 83. Should every shared value go into Context? — No.
### 84. Is index always an invalid key? — No, but it is unsafe for changing identity/order.
### 85. Should every function prop use `useCallback`? — No.
### 86. Does React Compiler remove the need to understand rendering? — No.
### 87. Can Server Components have interactive client state? — No.
### 88. Can Client Components render Server Component output passed through props? — Yes.
### 89. Is client-side authorization enough? — No.
### 90. Is fewer renders always better? — No.

## Final coding-interview rule

When solving React code questions, narrate this sequence:

```text
What render snapshot am I in?
  ↓
What identity does React preserve?
  ↓
What update is queued?
  ↓
What is derived vs stored?
  ↓
What external synchronization exists?
  ↓
What will commit?
  ↓
What cleanup/failure path exists?
```

That reasoning is more valuable than memorizing isolated output answers.