---
title: React Interview Question Bank — Overview and Study Plan
description: Comprehensive React interview preparation from fundamentals through staff-level architecture, including answer expectations, follow-ups, traps, coding tasks, and system design.
sidebar_position: 1
---

# React Interview Question Bank

This section is the **large reusable interview bank** for the React handbook.

The earlier Interview Mastery section teaches how to reason through selected scenarios. This section is different: it aims to collect the **widest practical set of React interview questions** you may face across frontend, full-stack, senior, lead, and staff interviews.

> No finite list can literally contain every wording an interviewer may invent. The goal here is comprehensive **topic coverage and question-pattern coverage** so that unfamiliar wording still maps to a mental model you already understand.

## Current React line

This bank targets the stable React **19.2 documentation line** and keeps Canary/Experimental material separate.

Important modern topics include:

- React 19 Actions;
- `useActionState`;
- `useOptimistic`;
- `useFormStatus`;
- `use`;
- ref as a prop;
- modern Context provider syntax;
- React 19.2 `<Activity>`;
- `useEffectEvent`;
- `cacheSignal`;
- React Performance Tracks;
- React Compiler 1.0;
- Server Components and Server Functions;
- streaming SSR and hydration;
- Partial Pre-rendering concepts;
- Error Boundaries and root error callbacks;
- Owner Stacks / `captureOwnerStack`.

## How each question is structured

Most entries use this format:

### Question

The interview prompt.

**Strong answer:** what a good answer should explain.

**Follow-ups:** questions an interviewer may ask next.

**Watch for:** common misconceptions, weak answers, or traps.

For senior/staff questions, expect an additional emphasis on:

- trade-offs;
- failure modes;
- production behavior;
- observability;
- reversibility;
- team boundaries;
- migration cost.

## Question-bank map

### 01 — Fundamentals, JSX, Components, Rendering

Topics:

- declarative UI;
- elements vs components;
- JSX;
- props;
- composition;
- render triggers;
- render vs commit;
- Strict Mode;
- identity;
- keys;
- controlled trees;
- purity.

### 02 — State, Events, Lists, Forms

Topics:

- state snapshots;
- update queues;
- batching;
- derived state;
- lifting state;
- events;
- list identity;
- controlled/uncontrolled forms;
- validation;
- form Actions.

### 03 — Hooks, Effects, Refs, Custom Hooks

Topics:

- Rules of Hooks;
- effect synchronization;
- dependencies;
- stale closures;
- cleanup;
- race conditions;
- `useEffectEvent`;
- layout/insertion Effects;
- refs;
- imperative handles;
- custom Hooks.

### 04 — Context, Reducers, State Architecture

Topics:

- Context mental model;
- provider placement;
- Context performance;
- reducers;
- reducer + Context;
- local vs shared vs server vs URL state;
- external stores;
- `useSyncExternalStore`.

### 05 — Performance, Compiler, Suspense, Concurrency

Topics:

- profiling;
- `memo`;
- `useMemo`;
- `useCallback`;
- React Compiler;
- `useTransition`;
- `startTransition`;
- `useDeferredValue`;
- Suspense;
- lazy loading;
- Activity;
- scheduling mental models.

### 06 — React DOM, SSR, Hydration, RSC, React 19+

Topics:

- `createRoot`;
- `hydrateRoot`;
- portals;
- `flushSync`;
- streaming SSR;
- static rendering;
- partial pre-rendering concepts;
- Server Components;
- Client Components;
- Server Functions;
- `use client` / `use server`;
- cache APIs;
- React 19 migration.

### 07 — TypeScript, Testing, Accessibility

Topics:

- typing props/events/refs;
- discriminated unions;
- generic component APIs;
- React Testing Library;
- async `act`;
- Suspense/Action testing;
- semantic HTML;
- accessible names;
- `useId`;
- keyboard/focus/dialogs.

### 08 — Debugging, Security, Production, System Design

Topics:

- Error Boundaries;
- root error callbacks;
- Owner Stacks;
- hydration failures;
- production observability;
- XSS;
- Server Function trust boundaries;
- large-team architecture;
- frontend system design;
- migration strategy.

### 09 — Coding, Output, Bug-Finding, Trick Questions

Topics:

- predict-the-render exercises;
- stale closure bugs;
- key bugs;
- Effect loops;
- memoization traps;
- race conditions;
- reducers;
- custom Hooks;
- coding tasks;
- debugging exercises.

## Recommended study order

Use four passes.

### Pass 1 — Explain

Answer each question aloud without notes.

If you cannot explain it in simple language, mark it.

### Pass 2 — Code

For code-related questions, write the answer from memory.

Avoid only reading solutions.

### Pass 3 — Follow-up pressure

For every question ask:

- Why?
- What breaks?
- When would you not use this?
- How would you test it?
- How would you debug it in production?

### Pass 4 — System reasoning

For senior/staff preparation, connect the answer to:

- ownership;
- boundaries;
- failure modes;
- performance;
- security;
- rollout;
- observability.

## Interview answer framework

For conceptual questions, a strong structure is:

```text
Definition
  ↓
Mental model
  ↓
Small example
  ↓
Common mistake
  ↓
Trade-off
  ↓
Production implication
```

For debugging questions:

```text
Symptom
  ↓
Possible causes
  ↓
Evidence to collect
  ↓
Narrow hypothesis
  ↓
Fix
  ↓
Regression prevention
```

For architecture questions:

```text
Requirements
  ↓
Constraints
  ↓
State/data ownership
  ↓
Boundaries
  ↓
Failure/performance/security model
  ↓
Trade-offs
  ↓
Rollout + observability
```

## Level expectations

### Junior

Expected to understand:

- components;
- JSX;
- props;
- state;
- events;
- lists/keys;
- forms;
- common Hooks;
- basic Effects.

### Mid-level

Expected to reason about:

- state ownership;
- Effects and cleanup;
- reusable Hooks;
- Context/reducers;
- testing;
- TypeScript;
- performance basics;
- data flow.

### Senior

Expected to reason about:

- architecture;
- async UI;
- Suspense/concurrency;
- React 19 patterns;
- performance evidence;
- SSR/hydration/RSC;
- failure handling;
- security;
- migration.

### Staff / Lead

Expected to reason about:

- multi-team boundaries;
- platform contracts;
- architecture governance;
- observability standards;
- design-system strategy;
- migration programs;
- rollout/reversibility;
- organizational trade-offs.

## How to know you are interview-ready

You should be able to:

1. explain React without saying “virtual DOM makes it fast” as the entire answer;
2. reason about renders from state/props/context changes;
3. diagnose state reset from identity/key changes;
4. explain why an Effect exists;
5. remove an unnecessary Effect;
6. design state ownership deliberately;
7. explain Suspense vs Transition vs deferred rendering;
8. profile before memoizing;
9. explain React Compiler without claiming manual memoization is impossible;
10. explain SSR vs hydration vs RSC;
11. design accessible interactive components;
12. test behavior rather than implementation details;
13. describe production debugging evidence;
14. explain Server Function trust boundaries;
15. defend a frontend architecture with trade-offs.

## Important principle

Do not memorize only the **sentence** answer.

Interviewers often change wording while testing the same mental model.

For example:

- “Why does this component reset?”
- “Why did input state disappear?”
- “What does changing a key do?”
- “How does React decide whether state belongs to the same component?”

All test **identity and state preservation**.

The goal of this bank is to make those connections automatic.