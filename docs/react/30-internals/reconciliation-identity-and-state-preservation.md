---
title: Reconciliation, Identity, and State Preservation
description: A senior-level mental model for how React matches trees, preserves state, uses keys, and decides what to reuse or replace.
sidebar_position: 1
---

# Reconciliation, Identity, and State Preservation

React lets application code describe **what the UI should look like now**. React then has to compare that new description with the previous committed UI and decide what can be reused, what must change, and what must be removed.

That comparison process is commonly called **reconciliation**.

The most important senior-level lesson is not memorizing an internal diff algorithm. It is understanding the stable application-facing rules that fall out of reconciliation:

- component identity comes from **type + position + key**;
- state is associated with a position in React's render tree;
- changing identity resets state below that point;
- keys are identity hints, not list indexes or DOM IDs;
- rendering computes a candidate tree; committing applies accepted changes;
- React may start rendering work that never commits.

> **Stable contract vs implementation detail**
>
> The identity/state behavior documented by React is application-facing behavior. Internal data structures and exact reconciliation heuristics are implementation details and can change between React versions.

## Reconciliation is not "diffing the DOM"

A common oversimplification is:

> React builds a virtual DOM, compares it with the real DOM, then patches differences.

A better mental model is:

```text
previous committed React tree
          +
new render description
          ↓
React reconciliation
          ↓
accepted work
          ↓
commit to renderer
          ↓
DOM / native host changes
```

React first reasons about its own component/element tree. React DOM is one renderer that applies the resulting host updates to the browser DOM.

That distinction matters because:

- a component can render without causing a DOM mutation;
- a component can be replaced even if similar-looking DOM is produced;
- state preservation is based on React tree identity, not DOM node resemblance;
- React Native shares reconciliation concepts without using the browser DOM.

## Identity is the heart of state preservation

React state does not conceptually live inside a JSX tag.

Instead, React associates state with a component identity at a position in the render tree.

Consider:

```jsx
function App({ showProfile }) {
  return (
    <main>
      {showProfile ? <Profile /> : <Profile />}
    </main>
  );
}
```

Even though there are two JSX expressions in the source, they occupy the same rendered position and have the same component type. React can treat them as the same component identity and preserve state.

Now change the type:

```jsx
function App({ editing }) {
  return (
    <main>
      {editing ? <Editor /> : <Profile />}
    </main>
  );
}
```

`Editor` and `Profile` are different component types. The subtree identity changes, so state below that point resets.

## Type matters

When React sees the same component type in the same logical position, state can be preserved.

```jsx
function Panel({ compact }) {
  return compact ? (
    <Card density="compact" />
  ) : (
    <Card density="comfortable" />
  );
}
```

Both branches render `Card` in the same position.

Changing only props does not create a new component identity.

```text
Card density="compact"
        ↓ props update
Card density="comfortable"
```

The existing `Card` state remains associated with that identity.

## Position matters

React also cares where a child appears under its parent.

```jsx
function Layout({ swap }) {
  if (swap) {
    return (
      <>
        <Sidebar />
        <Editor />
      </>
    );
  }

  return (
    <>
      <Editor />
      <Sidebar />
    </>
  );
}
```

Without stable keys, reordering sibling identities can cause React to associate state with positions in ways that do not match your domain intent.

This is one reason list keys are correctness tools, not merely performance hints.

## Keys are explicit identity

A key lets you tell React which logical child a rendered element represents among siblings.

```jsx
{messages.map(message => (
  <Message
    key={message.id}
    message={message}
  />
))}
```

A good key is:

- stable across renders;
- unique among siblings;
- derived from domain identity;
- independent of presentation order.

Good:

```jsx
key={message.id}
```

Usually bad for reorderable data:

```jsx
key={index}
```

Almost always bad:

```jsx
key={Math.random()}
```

A random key says:

> This is a brand-new identity every render.

That forces remounting and destroys local state.

## Keys are scoped to siblings

Keys do not need to be globally unique.

This is fine:

```jsx
<ul>
  {users.map(user => (
    <UserRow key={user.id} user={user} />
  ))}
</ul>

<ul>
  {projects.map(project => (
    <ProjectRow key={project.id} project={project} />
  ))}
</ul>
```

The two lists have independent sibling namespaces.

## Keys can intentionally reset state

Keys are useful outside lists too.

```jsx
<Chat key={recipient.id} recipient={recipient} />
```

Changing `recipient.id` gives the `Chat` subtree a new identity.

This is often cleaner than imperatively clearing many pieces of local state.

Use this deliberately when the domain says:

> This is no longer the same logical screen/component instance.

Examples:

- switching between users in an editor;
- changing a form from one record to another;
- resetting an onboarding flow;
- restarting an embedded game/session;
- resetting an Error Boundary via a new boundary key.

## State reset is transitive through the subtree

If React replaces a component identity, state below it is also recreated.

```text
OldEditor key=A
├── Toolbar state
├── Draft state
└── Preview state

key changes

NewEditor key=B
├── new Toolbar state
├── new Draft state
└── new Preview state
```

This makes key placement architectural.

A key too high in the tree may reset more state than intended.

A key too low may preserve stale state that should have been recreated.

## Nested component definitions create new component types

This is a classic identity bug:

```jsx
function Dashboard() {
  function SearchBox() {
    const [query, setQuery] = useState('');
    return <input value={query} onChange={e => setQuery(e.target.value)} />;
  }

  return <SearchBox />;
}
```

Every `Dashboard` render creates a new `SearchBox` function object.

React sees a different component type and can reset the child subtree.

Prefer:

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

function Dashboard() {
  return <SearchBox />;
}
```

This also improves Compiler compatibility and static component identity.

## Same DOM does not imply same React identity

These components might produce visually identical markup:

```jsx
function A() {
  return <button>Save</button>;
}

function B() {
  return <button>Save</button>;
}
```

But switching from `<A />` to `<B />` changes component identity.

React does not preserve `A`'s component state just because the host output looks similar.

## Same component identity does not imply no work

State preservation and rendering are separate questions.

A component can keep its identity and state while still re-rendering:

```jsx
<Card theme="dark" />
// later
<Card theme="light" />
```

The `Card` identity remains the same, but React may call the component again to calculate the updated output.

Memoization can reduce some work, but it does not redefine component identity.

## Bailouts are optimization, not identity semantics

If React or React Compiler can prove work does not need to be repeated, it may skip some computation.

You should not write correctness-sensitive logic that assumes:

- a component always renders when its parent renders;
- memoized calculations always execute;
- an abandoned render commits;
- a particular bailout path will always exist.

Correct code must work whether React performs the optimization or not.

## Reconciliation and immutability

Immutability helps React and your own architecture answer:

> Did this value change?

Instead of mutating an object in place:

```jsx
user.name = 'Amina';
setUser(user);
```

create a new state snapshot:

```jsx
setUser(prev => ({
  ...prev,
  name: 'Amina',
}));
```

This preserves React's snapshot model and makes equality-based optimizations useful.

## Reconciliation and controlled inputs

Accidental identity changes are especially visible in forms.

Symptoms include:

- input text unexpectedly clears;
- focus disappears;
- cursor position resets;
- local validation state vanishes;
- a controlled field appears to "remount".

Debugging checklist:

1. Did the component type change?
2. Did its key change?
3. Did a parent key change?
4. Was the component moved to a different sibling position?
5. Is the component function defined inside another component?
6. Is a list using unstable/index/random keys?

## Reconciliation and Suspense

Suspense adds another important distinction:

```text
render attempt
  ↓
may suspend
  ↓
React may retry later
  ↓
only committed result becomes visible
```

If a component suspends before its first successful mount, React can retry that work rather than preserving state from an uncommitted attempt.

For already visible trees, Transitions and deferred values can let React preserve currently revealed content while preparing a new result.

Do not reduce these behaviors to "React hides and shows DOM." The deeper model is that React is coordinating tree identity, pending work, and commits.

## Reconciliation and Error Boundaries

If rendering fails, React can abandon the failed work and let the nearest Error Boundary render fallback UI.

Changing the Error Boundary's key is one common way to reset its local error state:

```jsx
<ErrorBoundary key={documentId} fallback={<CrashPanel />}>
  <DocumentEditor id={documentId} />
</ErrorBoundary>
```

The key communicates that a new document should get a fresh boundary identity.

## Do not couple application code to internal Fiber fields

Senior engineers should understand that modern React uses an internal Fiber architecture, but application code should never depend on internal fields such as:

- fiber tags;
- flags;
- lane bitmasks;
- alternate pointers;
- effect lists;
- internal update queues.

These details are not public API.

A useful mental model is enough:

```text
React maintains internal work records for tree nodes
→ can compare previous and next work
→ can schedule/retry/abandon render work
→ commits accepted changes atomically
```

The next chapter goes deeper into that render-work architecture without turning implementation details into application contracts.

## Production debugging pattern: identity before memoization

When a UI unexpectedly resets or rerenders, engineers often start adding `memo`.

That can hide the actual problem.

Investigate in this order:

```text
1. Is identity correct?
2. Is state owned at the correct level?
3. Are keys stable?
4. Are props/context changing unnecessarily?
5. Is the render actually expensive?
6. Only then consider memoization.
```

## Senior review questions

### Why did this input reset?

Look for identity changes: key, component type, parent key, or tree position.

### Why is using the array index as a key risky?

Because order and domain identity are different concepts. Reordering can cause state to follow a position rather than the logical item.

### Does a key improve render performance?

Its primary role is identity. A correct key can improve reconciliation quality, but keys should be chosen for correctness first.

### Does React preserve state because the DOM node is reused?

No. State is tied to React tree identity, not DOM resemblance.

### Can React render work that never becomes visible?

Yes. Concurrent rendering, Suspense, interruptions, and errors can produce render attempts that are abandoned before commit.

## Exercise

Build a reorderable list of editable rows.

Requirements:

1. each row has local draft state;
2. rows can move up/down;
3. drafts must follow the logical record;
4. switching to a completely different dataset resets all drafts;
5. explain where keys belong and why.

Then intentionally replace stable IDs with array indexes and document the bug you observe.

## References

- https://react.dev/learn/preserving-and-resetting-state
- https://react.dev/learn/rendering-lists
- https://react.dev/learn/managing-state
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
