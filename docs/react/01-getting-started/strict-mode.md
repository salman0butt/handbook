---
title: Strict Mode
description: Understand React StrictMode, development-only checks, repeated rendering, effect cleanup, and debugging implications.
sidebar_position: 4
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Strict Mode

`<StrictMode>` enables extra **development-only** checks that help surface React bugs early.

A common application root looks like:

```jsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Why does Strict Mode exist?

React wants components to be safe under rendering patterns where work can be repeated, interrupted, cleaned up, or restarted.

Strict Mode deliberately stresses assumptions that often hide bugs in ordinary development.

Mental model:

<VisualDiagram title="Strict Mode makes hidden assumptions visible" subtitle="The development checks expose bugs that repeated or restartable React work would otherwise reveal later.">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Component appears correct" wide>The happy path may hide impurity or incomplete cleanup.</DiagramNode>
    <DiagramArrow label="Strict Mode development checks" />
    <DiagramNode tone="orange" title="React stresses the assumptions" wide>Repeated render, setup/cleanup cycles, and ref callback checks make unsafe behavior reproducible.</DiagramNode>
    <DiagramArrow label="bug becomes observable" />
    <DiagramNode tone="red" title="Underlying issue is identified" wide>Impure render · missing cleanup · unsafe ref logic · misplaced side effect.</DiagramNode>
    <DiagramArrow label="fix the cause" />
    <DiagramNode tone="green" title="Component becomes restart-safe" wide>The same code is easier to reason about in production rendering architectures.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Strict Mode does not run these checks to make development annoying. It makes problems reproducible before production architecture makes them harder to diagnose.

## Development vs production

Strict Mode checks are development-only.

<VisualDiagram title="Strict Mode development checks vs production">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="Development" title="Strict Mode stress checks">
      Extra render checks · Effect setup/cleanup checks · ref callback checks · deprecation warnings.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Production" title="Normal production execution">
      Development-only Strict Mode stress checks are removed from the production build.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not remove Strict Mode merely because development logs or requests reveal duplicated behavior. First ask whether the code has correct cleanup and purity.

## Re-rendering to find impure render logic

React components should be pure calculations of UI from props, state, and Context.

Bad:

```jsx
function StoryTray({stories}) {
  stories.push({id: 'create', label: 'Create Story'});

  return stories.map((story) => (
    <Story key={story.id} story={story} />
  ));
}
```

The component mutates a prop array. If the render is repeated, another item is pushed again.

Better:

```jsx
function StoryTray({stories}) {
  const nextStories = [
    ...stories,
    {id: 'create', label: 'Create Story'},
  ];

  return nextStories.map((story) => (
    <Story key={story.id} story={story} />
  ));
}
```

The repeated render exposes the mutation bug; it does not create the bug.

## Effects and cleanup

An Effect synchronizes with an external system.

```jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

During development, Strict Mode can run an extra setup/cleanup cycle to reveal missing cleanup.

Useful reasoning:

<VisualDiagram title="Strict Mode Effect stress cycle" compact>
  <LifecycleBar
    items={[
      { label: 'setup', tone: 'blue' },
      { label: 'cleanup', tone: 'orange' },
      { label: 'setup again', tone: 'green' },
    ]}
  />
</VisualDiagram>

If that sequence breaks your integration, the Effect probably does not fully undo what it sets up.

## Ref callbacks

Ref callbacks can also receive extra development checks. If a ref callback registers something, its cleanup should correctly undo that registration.

This matters for cases such as:

- maintaining your own node collection;
- connecting observers;
- integrating imperative widgets.

## "My Effect runs twice"

Do not start with:

> How do I force this to run once?

Start with:

> Why is repeated setup revealing a problem?

Common causes include:

- no cleanup;
- cleanup does not reverse setup;
- an Effect is performing event logic that belongs in a click/submit handler;
- an Effect is being used to derive state that could be calculated during render;
- a request needs cancellation or deduplication in the application architecture.

The later Effects chapter will cover these cases in depth.

## Should I disable Strict Mode?

Usually, no.

Disabling the checks hides symptoms without improving the component model.

There can be migration situations involving old third-party integrations where Strict Mode exposes compatibility problems. Treat that as technical debt to understand, not as evidence that Strict Mode itself is incorrect.

## React 19 note

React 19 changed some Strict Mode development behavior. For example, memoized results from `useMemo` and `useCallback` are reused during the second development render, and ref callback checks were strengthened.

The enduring rule is more important than memorising the exact stress-test implementation:

> Write components so render is pure and synchronization has complete cleanup.

## Debugging checklist

When Strict Mode reveals duplicate-looking behavior:

1. identify whether it happens during render, an Effect, or a ref callback;
2. check whether render mutates props, state objects, module values, or external systems;
3. check Effect cleanup symmetry;
4. move user-event work into event handlers when appropriate;
5. remove unnecessary Effects;
6. confirm the behavior in a production build only after fixing the development warning.

## Exercise

Find the bug:

```jsx
function ChatRoom({roomId}) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Room {roomId}</h1>;
}
```

Questions:

- What external resource is created?
- What should cleanup do?
- Why is a repeated development setup useful here?

## Interview questions

### Junior

Does Strict Mode's extra development behavior also happen in the production build?

### Mid-level

Why can Strict Mode reveal a missing Effect cleanup?

### Senior

How are purity and cleanup related to React's ability to restart or discard rendering work safely?

## References

- https://react.dev/reference/react/StrictMode
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/learn/synchronizing-with-effects
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide

## Next

Continue with **[JSX](../02-fundamentals/jsx.md)**.