---
title: Events and Event-Driven Design
description: Event targets, emitters, pub/sub, cleanup, backpressure and coupling trade-offs.
---

# Events and Event-Driven Design

An event announces that something happened. Commands request work; events describe facts. Confusing them leads to unclear ownership and error handling.

## Browser events

EventTarget dispatch is synchronous: listeners run during `dispatchEvent`. Native browser events are scheduled by the host, but dispatch itself follows event propagation rules. `once`, `passive`, capture and AbortSignal options make listener policy explicit.

```javascript
const controller = new AbortController()
button.addEventListener('click', handleClick, {signal: controller.signal})
// later
controller.abort()
```

CustomEvent can carry detail within one trust boundary. Do not expose secrets in globally observable events.

## Emitters and pub/sub

An emitter couples producers and subscribers through a named contract. Pub/sub introduces a mediator or bus. It can remove direct imports, but it also hides control flow, ordering and failure paths.

```javascript
class EventBus {
  #listeners = new Map()
  on(type, listener) {
    const set = this.#listeners.get(type) ?? new Set()
    set.add(listener)
    this.#listeners.set(type, set)
    return () => set.delete(listener)
  }
  emit(type, payload) {
    for (const listener of [...(this.#listeners.get(type) ?? [])]) listener(payload)
  }
}
```

Specify whether dispatch is synchronous, whether listener errors stop other listeners, whether registration changes affect the current emission, and how once-only listeners are cleaned.

## Observer pattern

The subject knows its observers or their interface. Pub/sub normally routes through a broker. Browser event delegation is different again: one ancestor listener handles descendant events using propagation.

## Event storms and backpressure

High-frequency producers can overwhelm consumers. Coalesce state updates, sample telemetry, debounce user intent, throttle rendering, or move to a bounded queue/stream with explicit pressure. Never allow an unbounded event backlog by accident.

## Memory leaks

Listeners retain their callback and reachable graph. Return an unsubscribe function, accept an AbortSignal, remove observers during lifecycle cleanup, and avoid anonymous callbacks that cannot be matched for removal.

## Distributed events

Across processes, delivery can be duplicated, delayed, reordered or lost. Include identifiers, versions and timestamps; make handlers idempotent; persist before publishing where required; and distinguish integration events from internal in-memory notifications.

## Decision guide

Use a direct call when the caller needs a result and knows the collaborator. Use events when multiple independent reactions are legitimate and eventual handling is acceptable. Do not use a global bus to avoid designing module boundaries.

## Primary references

- [DOM events](https://dom.spec.whatwg.org/#events)
- [MDN EventTarget](https://developer.mozilla.org/docs/Web/API/EventTarget)
