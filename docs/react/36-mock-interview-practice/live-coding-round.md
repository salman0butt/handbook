---
title: React Live Coding Round
sidebar_position: 7
description: A realistic React live coding interview with progressively changing requirements, debugging tasks, testing prompts, and scoring criteria.
---

# React Live Coding Round

This round tests how you think while writing code.

The interviewer is evaluating more than whether the final component works.

They also observe:

- how you clarify requirements;
- how you model state;
- whether you choose semantic HTML;
- whether you narrate trade-offs;
- how you debug;
- how you respond to changing requirements;
- whether your code remains testable.

## Round format

```text
0–5 min    clarify requirements
5–25 min   initial implementation
25–40 min  changing requirements
40–50 min  debugging + edge cases
50–60 min  test/design discussion
```

## Task 1 — searchable user list

Build a component that:

- accepts a list of users;
- renders name and email;
- provides a search input;
- filters by name or email;
- shows an empty state;
- remains accessible.

### What the interviewer watches

Strong candidate:

- asks about case sensitivity and expected scale;
- keeps query as state;
- derives filtered users during render;
- does not introduce an Effect to synchronize filtered state;
- uses a real `<label>` and `<input>`;
- uses stable user IDs as keys.

### Follow-up 1

**The list has 50,000 users and typing feels slow. What do you do?**

Expected reasoning:

- measure first;
- determine whether filtering, rendering, or both are expensive;
- consider virtualization for large rendered lists;
- consider server search for truly large datasets;
- `useDeferredValue` may help keep input responsive when result rendering is expensive;
- memoization should target measured work rather than be added reflexively.

### Follow-up 2

**Search now comes from an API.**

Candidate should discuss:

- loading/error/empty states;
- request race handling;
- cancellation/ignore semantics;
- debounce if product/network behavior warrants it;
- server-state/data tooling where appropriate;
- distinction between debounce and deferred rendering.

## Task 2 — editable todo list

Requirements:

- add todo;
- toggle complete;
- delete todo;
- edit title;
- filter all/active/completed.

### Evaluation

Watch for:

- immutable updates;
- stable keys;
- minimal state;
- filter derived from canonical todos;
- clean event handlers;
- accessibility of controls;
- no unnecessary reducer unless complexity justifies it.

### Change request

Add undo for the last action.

A strong candidate may reconsider state modeling and introduce a reducer/history model instead of layering ad hoc state variables.

## Task 3 — reusable modal/dialog

Requirements:

- open/close state;
- portal rendering;
- accessible title;
- Escape closes;
- focus moves into dialog;
- focus returns to trigger;
- backdrop click closes;
- clicks inside content do not close.

### Follow-ups

1. Controlled vs uncontrolled API?
2. How would multiple dialogs interact?
3. What should a design-system primitive own?
4. What should consumers own?
5. How do you test keyboard behavior?

## Task 4 — fix the bug

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

Ask candidate to identify:

- request race;
- missing error handling;
- stale old data UX question;
- cancellation/ignore strategy;
- whether an Effect should own fetching at all in the target architecture.

### Pressure change

The product now wants stale content to remain visible while a new profile loads.

Candidate should reason about pending/stale UI intentionally rather than blindly clearing state.

## Task 5 — form mutation

Build a form with:

- title field;
- validation;
- submit pending state;
- server error;
- success state;
- accessible error messages.

Strong candidate should distinguish:

- client validation for UX;
- server validation for trust;
- disabled/pending behavior;
- duplicate submission concerns;
- focus/error summary where useful.

## Debugging mini-round

Give one broken snippet.

### Broken dependency

```tsx
function Editor({ document }) {
  const [draft, setDraft] = useState(document.text);

  useEffect(() => {
    setDraft(document.text);
  }, [document]);
}
```

Ask:

- what happens if parent creates a new `document` object every render?
- should draft reset whenever object identity changes?
- would `document.id` be a better semantic dependency?
- would keyed component identity better express “new document means new editor state”?

## Interviewer requirement changes

A strong live-coding interviewer should change one requirement late:

- add keyboard support;
- support controlled mode;
- persist to server;
- add optimistic updates;
- handle 100k rows;
- preserve state across hidden views;
- support SSR/hydration;
- add analytics;
- make feature testable without mocking React internals.

The goal is to see whether architecture bends or breaks.

## Scoring rubric

### Correctness — 25%

Does it work under normal and edge conditions?

### State model — 20%

Is state minimal, canonical, and owned in the right place?

### React reasoning — 15%

Does the candidate understand snapshots, identity, Effects, refs, and render behavior?

### Accessibility — 10%

Are native semantics, keyboard behavior, focus, labels, and errors handled?

### Debugging — 10%

Do they isolate and reason from evidence?

### Communication — 10%

Do they explain choices and clarify requirements?

### Adaptability — 10%

Can they evolve the solution when constraints change?

## Strong live-coding behavior

- starts simple;
- says assumptions aloud;
- keeps data flow visible;
- catches own mistakes;
- does not panic when requirements change;
- tests the riskiest paths first;
- explains what would change in production.

## Weak behavior

- over-engineers before requirements are clear;
- creates multiple synchronized state copies;
- hides logic in Effects;
- ignores accessibility;
- adds memoization everywhere;
- refuses to revisit initial architecture;
- codes silently without explaining trade-offs.