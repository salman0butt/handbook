---
id: intro
title: React Handbook
description: Learn React from first principles to advanced architecture, modern React 19+, performance, and internals.
slug: /react/intro
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# React Handbook

> **Docs target: React 19.2**  
> **Latest stable package verified: React 19.2.8**  
> **Last verified: 2026-07-26**

A practical React handbook built to move from **zero React knowledge → real applications → modern React → advanced engineering → senior-level decision making**.

This is not a list of APIs to memorise. The goal is to understand how React behaves, why its APIs exist, how to choose between competing approaches, how to debug failures, and how production architecture changes the trade-offs.

Start with the **[version policy](./version.md)** when you want to know which React release the handbook targets, or use the **[learning roadmap](./roadmap.md)** to see the complete zero-to-senior curriculum.

## The core mental model

React becomes easier when you stop thinking of it as a collection of Hooks and start with one idea:

<VisualDiagram
  title="React's core render loop"
  subtitle="Current inputs are used to calculate UI; React coordinates only the host changes that are needed."
>
  <DiagramStack align="center">
    <DiagramNode title="Current inputs" tone="blue" wide>
      props + state + context
    </DiagramNode>
    <DiagramArrow label="render" />
    <DiagramNode title="Component calculates UI" tone="purple" wide>
      Function components describe the next interface for this render.
    </DiagramNode>
    <DiagramArrow label="reconcile" />
    <DiagramNode title="React coordinates rendering" tone="cyan" wide>
      React compares identities and determines what host work is necessary.
    </DiagramNode>
    <DiagramArrow label="commit" />
    <DiagramNode title="Necessary changes are committed" tone="green" wide>
      DOM or other host changes happen only where the result actually differs.
    </DiagramNode>
    <DiagramArrow label="paint" />
    <DiagramNode title="Browser displays the result" tone="orange" wide>
      The browser paints the committed interface.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

From there, the handbook builds the models for state snapshots, identity, Effects, refs, Context, Suspense, transitions, server rendering, and React internals.

## Learning path

<VisualDiagram title="Zero → senior React learning path" subtitle="Build mental models first, then layer production architecture on top.">
  <LifecycleBar
    items={[
      { label: 'JavaScript for React', tone: 'slate' },
      { label: 'React mental model', tone: 'blue' },
      { label: 'JSX + components', tone: 'purple' },
      { label: 'Rendering + events + state', tone: 'cyan' },
      { label: 'Forms + lists + keys', tone: 'green' },
      { label: 'Effects + refs + custom Hooks', tone: 'orange' },
      { label: 'Context + reducers + state architecture', tone: 'purple' },
      { label: 'Modern React 19+', tone: 'blue' },
      { label: 'Suspense + concurrency', tone: 'cyan' },
      { label: 'SSR + Server Components', tone: 'green' },
      { label: 'Compiler + Rules of React', tone: 'orange' },
      { label: 'TypeScript + testing + accessibility', tone: 'purple' },
      { label: 'Performance + architecture', tone: 'blue' },
      { label: 'Internals + senior decisions', tone: 'slate' },
    ]}
  />
</VisualDiagram>

## What this handbook covers

### Foundation

- JavaScript concepts that React code relies on;
- what React is and the problem it solves;
- declarative UI and UI as a function of state;
- `createRoot` and the client entry point;
- JSX, React elements, components, props, state, and events;
- render, commit, and browser paint;
- lists, keys, identity, and state preservation;
- forms and controlled/uncontrolled inputs.

### Hooks and state architecture

- state ownership and lifting state;
- `useState` and `useReducer`;
- Context and provider design;
- Effects as synchronization with external systems;
- dependency reasoning, cleanup, race conditions, and stale closures;
- refs and imperative escape hatches;
- custom Hook API design;
- every current stable built-in Hook.

### Modern React

The handbook deliberately teaches modern React rather than ending at React 18-era patterns.

Topics include:

- Actions;
- `useActionState`;
- `useOptimistic`;
- `useFormStatus`;
- `use`;
- ref as a prop;
- modern Context provider syntax;
- `<Activity>`;
- `useEffectEvent`;
- transitions and deferred values;
- Suspense;
- React Compiler 1.0;
- current React DOM resource and server APIs.

Version-specific material is labelled, and Canary/Experimental APIs are never silently presented as stable.

### Production React

- TypeScript;
- testing strategy and React Testing Library;
- accessibility;
- frontend security;
- authentication and authorization boundaries;
- performance profiling before optimization;
- React DevTools Profiler and Performance Tracks;
- feature architecture and dependency direction;
- design systems;
- deployment, observability, and rollback thinking.

### Advanced and senior topics

- component API design and composition;
- state ownership and boundaries;
- reconciliation and identity;
- Suspense and concurrent rendering concepts;
- React Fiber, scheduling, priorities, and update queues at a conceptual level;
- server rendering, hydration, streaming, and Server Components;
- framework vs React-core responsibilities;
- architecture trade-offs and engineering decisions;
- public React contracts vs unstable implementation details.

## React core vs ecosystem

React is the UI library. Many production applications also use tools around it.

<VisualDiagram title="React core vs ecosystem" subtitle="Know which guarantees come from React and which come from surrounding application tooling.">
  <DiagramGrid columns={2}>
    <DiagramNode title="React core" tone="blue">
      Components · Hooks · Context · Suspense · transitions · React DOM APIs
    </DiagramNode>
    <DiagramNode title="Ecosystem / application tooling" tone="purple">
      Vite · React Router · TanStack Query · Redux Toolkit · Zustand · React Hook Form · frameworks
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The handbook labels ecosystem libraries clearly so you learn what React itself guarantees and what comes from surrounding tools.

## Modern React vs legacy React

New chapters use function components and current stable APIs as the default model.

Older patterns still matter when maintaining existing applications, so the handbook later covers them as **LEGACY / MAINTENANCE KNOWLEDGE**, including:

- class components and lifecycle methods;
- HOCs and render props in historical context;
- `forwardRef` as pre-React-19 ref architecture;
- removed `ReactDOM.render` / `ReactDOM.hydrate` APIs;
- old Context and other removed APIs.

Legacy material is useful knowledge, but it should not be confused with the recommended starting point for new React 19 code.

## How to study each topic

Most important chapters follow the same reasoning sequence:

<VisualDiagram title="How to study a React topic" subtitle="Move from definition to production reasoning instead of memorising syntax in isolation.">
  <LifecycleBar
    items={[
      { label: 'What?', tone: 'blue' },
      { label: 'Why?', tone: 'cyan' },
      { label: 'Mental model', tone: 'purple' },
      { label: 'Syntax', tone: 'green' },
      { label: 'Small example', tone: 'orange' },
      { label: 'Behaviour', tone: 'blue' },
      { label: 'Real example', tone: 'cyan' },
      { label: 'Mistakes', tone: 'red' },
      { label: 'Debugging', tone: 'orange' },
      { label: 'Trade-offs', tone: 'purple' },
      { label: 'Production pattern', tone: 'green' },
      { label: 'Exercise', tone: 'blue' },
      { label: 'Interview reasoning', tone: 'slate' },
    ]}
  />
</VisualDiagram>

1. **What is it?** — establish the simplest accurate model.
2. **Why does it exist?** — understand the problem being solved.
3. **Mental model** — visualize what React or JavaScript is doing.
4. **Basic syntax** — learn the smallest useful form.
5. **Step-by-step behavior** — reason through the code.
6. **Real example** — apply it to an application problem.
7. **Common mistakes** — understand failure modes.
8. **Debugging** — move from symptom to cause.
9. **Best practices and trade-offs** — understand when the rule applies.
10. **Production pattern** — see how decisions change at scale.
11. **Exercise** — practise the idea instead of only reading it.
12. **Interview reasoning** — explain behavior, not definitions.

:::tip The goal
Don't aim to remember every React API. Aim to understand React well enough that unfamiliar APIs make sense when you encounter them.
:::

## How to start

<DecisionTree
  question="Where should I begin?"
  items={[
    { label: 'Arrays, objects, destructuring, closures, async code still feel shaky', value: 'Start with JavaScript for React' },
    { label: 'Those JavaScript concepts already feel comfortable', value: 'Continue with What is React?' },
  ]}
/>

If JavaScript arrays, objects, destructuring, immutability, closures, and async code are not yet comfortable, begin with **[JavaScript for React](./00-prerequisites/javascript-for-react.md)**.

If those concepts are already familiar, continue with **[What is React?](./01-getting-started/what-is-react.md)**.

## Handbook maintenance

The handbook has an explicit **[official API coverage audit](./reference/api-coverage.md)**. Whenever React publishes a new stable release, the version page and audit should be reviewed before version-specific claims are updated elsewhere.

## References

- https://react.dev/learn
- https://react.dev/reference/react
- https://react.dev/reference/react-dom
- https://react.dev/versions
- https://react.dev/blog
