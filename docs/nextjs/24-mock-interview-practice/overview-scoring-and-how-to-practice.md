---
title: Overview, Scoring & How to Practice
sidebar_position: 1
description: Run repeatable Next.js mock interviews with timed rounds, evidence-based scoring, follow-up pressure, and deliberate weak-area review.
---

# Mock Interview Practice — Overview, Scoring & How to Practice

The mock system turns the handbook into interview performance.

## Core rules

```text
answer aloud
use a timer
draw when useful
accept follow-up pressure
score evidence, not confidence
record weak areas
repeat after review
```

## Scoring

Score each dimension 0–3:

```text
accuracy
clarity
mental model
trade-offs
security/correctness
performance/failure
production evidence
communication
```

### 0 — incorrect
Cannot explain the concept or gives unsafe advice.

### 1 — surface
Definition is mostly right but lacks lifecycle/production depth.

### 2 — strong
Correct mental model, example and useful trade-offs.

### 3 — senior
Explains boundaries, failure/security/performance, evidence and production decisions clearly.

## Interviewer follow-up ladder

After any answer, ask:

```text
Why?
When would you not use it?
What fails?
How would you test it?
How does it change at scale?
What changed in modern Next.js?
```

## Round types

1. **20-minute screen** — fast fundamentals and one applied scenario.
2. **60-minute senior round** — deep App Router, data/cache, security, debugging.
3. **Full-stack round** — Next.js + data/HTTP/jobs/deployment.
4. **Lead/staff architecture round** — ambiguity, trade-offs, team/platform design.
5. **Live coding/debugging/system design** — implementation under pressure.
6. **Behavioral/production round** — incidents, migrations, ownership and leadership.

## Practice workflow

```text
run round cold
→ score each section
→ classify missed concept
→ review handbook chapter
→ rewrite answer in own words
→ rerun only weak section
→ rerun whole round later
```

## Good answer structure

Technical:

```text
definition
→ lifecycle/boundary
→ example
→ trade-off
→ production failure/test
```

Debugging:

```text
reproduce
→ classify layer
→ evidence
→ hypothesis
→ experiment
→ fix
→ regression guard
```

System design:

```text
requirements
→ capabilities/routes
→ data
→ reads/writes
→ auth
→ cache
→ jobs
→ observability
→ deployment
→ failure/rollback
```

## Red flags

```text
framework trivia without reasoning
historical behavior presented as current
Proxy as sole authorization
cache before identity/freshness
performance advice without measurement
microservices by default
private internals treated as APIs
no rollback/failure thinking
```

## Pass thresholds

Suggested senior readiness:

```text
screen average ≥ 2.3
senior round average ≥ 2.2
no security/correctness score below 2
system design covers all major boundaries
behavioral stories include measurable outcomes and reflection
```

## Recording sheet

For every mock keep:

```text
date
round
total score
weakest 3 topics
best production story
most dangerous misconception
one practice action before next round
```

The goal is not perfect phrasing. It is repeatable, visible engineering reasoning.