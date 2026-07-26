---
title: 30-Minute React Technical Screen
sidebar_position: 2
description: A timed React technical screen with fundamentals, Hooks, debugging, coding, follow-ups, and scoring guidance.
---

# 30-Minute React Technical Screen

Use this round for a fast technical screen before a longer engineering interview.

## Interview plan

```text
0–5 min    React fundamentals
5–12 min   state, rendering, and Hooks
12–20 min  debugging
20–27 min  coding/design task
27–30 min  candidate questions
```

Do not read the evaluation notes until after answering.

## Round 1 — fundamentals

### Question 1

**What causes a React component to render?**

A strong answer should mention:

- initial render;
- state updates;
- parent rendering can cause children to render;
- Context value updates for consumers;
- subscribed external-store updates where applicable;
- rendering does not necessarily mean DOM mutation.

**Follow-up:** If a parent renders, does every child necessarily commit DOM changes?

Expected: no. React can render components and then determine that host output does not require a DOM change.

### Question 2

**What does “state is a snapshot” mean?**

Strong answer:

- each render observes fixed state values;
- event handlers close over values from the render that created them;
- calling a setter schedules another render rather than mutating the current render's state variable;
- functional updates are useful when next state depends on previous queued state.

**Pressure follow-up:** Why can three `setCount(count + 1)` calls result in one increment?

### Question 3

**Why are keys important?**

Strong answer:

- keys identify siblings across renders;
- stable identity affects state preservation;
- index keys can be unsafe when list ordering/insertion/removal changes;
- keys are not passed as ordinary props.

## Round 2 — Hooks and state

### Question 4

**When should you use `useEffect`?**

Strong answer:

> Use an Effect to synchronize React with an external system after commit.

Examples:

- subscriptions;
- timers;
- imperative browser APIs;
- third-party widgets;
- network synchronization when framework/data tooling does not own it.

Weak answer:

> “Whenever something changes.”

### Follow-up

**Give three examples of logic that should usually not be in an Effect.**

Good examples:

- deriving values from props/state;
- transforming data for rendering;
- handling user actions that can happen directly in the event handler;
- resetting state where identity or state design can solve the problem;
- notifying parent state through unnecessary synchronization loops.

### Question 5

**What is the difference between `useRef` and state?**

Strong answer:

- state participates in rendering;
- changing a ref does not request a render;
- refs store mutable values across renders;
- DOM access is a common use;
- refs are an escape hatch and should not replace visible state.

### Question 6

**Context vs a global state store: are they the same thing?**

Strong answer:

No. Context is a mechanism for making a value available through a subtree without manually passing it through every intermediate component. It does not by itself provide reducer semantics, selective subscriptions, persistence, async caching, or normalized state management.

## Round 3 — debugging

### Scenario 1: infinite Effect loop

```tsx
function Search({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(filterItems(query));
  }, [query, results]);

  return <Results items={results} />;
}
```

**Prompt:** What is wrong, and how would you redesign it?

Strong answer:

- the Effect updates `results`;
- `results` is also a dependency;
- each update can trigger the Effect again;
- more importantly, if `results` is purely derived from `query`, it likely should not be state at all;
- derive `const results = filterItems(query)` during render;
- optimize only if measurement justifies it.

### Scenario 2: stale closure

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleLater() {
    setTimeout(() => {
      alert(count);
    }, 3000);
  }

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={handleLater}>Alert later</button>
    </>
  );
}
```

**Prompt:** Why might the alert display an older value?

Expected reasoning:

- callback closes over the `count` snapshot from the render where `handleLater` ran;
- this is normal JavaScript closure behavior combined with React snapshots;
- whether to use a ref, restructure logic, or intentionally preserve the snapshot depends on desired semantics.

## Round 4 — coding task

### Task: accessible search input with deferred expensive results

Build a component with:

- controlled search input;
- expensive result rendering;
- responsive typing;
- an accessible label;
- empty state;
- no unnecessary Effect.

A strong direction may use `useDeferredValue` to let the result view lag behind urgent input updates when rendering is actually expensive.

### Evaluation checklist

- Is the input controlled correctly?
- Is state minimal?
- Is filtering derived instead of synchronized with Effect?
- Is the label associated with the input?
- Is `useDeferredValue` used for rendering priority rather than debounce semantics?
- Does the candidate mention measuring before adding optimization?

## Pressure follow-ups

Ask one or two:

1. How is deferred rendering different from debouncing?
2. What if the API request itself must be cancelled?
3. How would you test this component?
4. What if the result list has 50,000 rows?
5. When would URL state be better than local input state?
6. Would React Compiler solve the expensive list automatically?

## Scoring rubric

### 1–2

Candidate has major gaps in state snapshots, Effects, identity, or debugging.

### 3

Candidate can build normal React features and debug common Hook problems.

### 4

Candidate reasons clearly about derived state, closures, identity, accessibility, and performance trade-offs.

### 5

Candidate gives concise answers, distinguishes scheduling from networking, discusses measurement and test strategy, and adapts architecture when constraints change.

## Pass signal

A strong mid/senior candidate should not merely fix the infinite loop by deleting `results` from the dependency array. They should question why the Effect exists.