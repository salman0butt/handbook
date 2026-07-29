---
title: 48–62 — Programming Paradigms, Patterns & Browser JavaScript
---

# 48–62 — Programming Paradigms, Patterns & Browser JavaScript

## 48 — Functional Programming in JavaScript

JavaScript's first-class functions, closures, arrays, and immutable-style copying make functional techniques natural without requiring an all-functional codebase.

```js
const activeNames = users
  .filter(user => user.active)
  .map(user => user.name);
```

A **pure function** depends only on inputs and has no observable side effects. Referential transparency means an expression can be replaced by its value without changing behavior—a useful design ideal, not something JavaScript enforces.

Composition:

```js
const pipe = (...fns) => input => fns.reduce((value, fn) => fn(value), input);
const normalize = pipe(trim, lowercase, validate);
```

Currying transforms a multi-argument function into nested unary functions; partial application fixes some arguments. `bind` can partially apply ordinary functions, but closures are often clearer.

Prefer functional transformations when they clarify data flow. Avoid long clever point-free chains, repeated full-array allocations in hot paths, or pretending I/O/state do not exist. A strong production model is **functional core, imperative shell**.

---

## 49 — Object-Oriented JavaScript

OOP in JavaScript can use prototype delegation, classes, closures, factories, and composition.

```js
class Cart {
  #items = [];
  add(item) { this.#items.push(item); }
  total() { return this.#items.reduce((s, x) => s + x.price, 0); }
}
```

Encapsulation means controlling access to state/behavior, not merely using `class`. Polymorphism can be structural: any object implementing the required capability may work.

```js
function save(repository, entity) {
  return repository.save(entity);
}
```

Composition often scales better than deep inheritance:

```js
const service = createService({logger, repository, clock});
```

Object-capability thinking emphasizes passing references that grant only necessary authority. This can improve testability/security compared with global service access.

---

## 50 — JavaScript Design Patterns

Patterns are reusable trade-off vocabulary, not a checklist.

- **Module** — lexical encapsulation/public exports.
- **Factory** — construct objects without exposing construction details.
- **Builder** — accumulate complex configuration before producing a value.
- **Strategy** — inject interchangeable behavior.
- **Observer** — subscribers observe a subject/event source.
- **Pub/sub** — producers/consumers communicate through topics/broker.
- **Adapter** — translate one interface to another.
- **Facade** — provide a simpler boundary over subsystem complexity.
- **Decorator pattern** — wrap behavior dynamically; do not confuse with decorator syntax proposals.
- **Command** — represent an action as data/object/function.
- **State** — model behavior by explicit state transitions.
- **Dependency injection** — pass dependencies rather than importing hidden globals.
- **Middleware** — compose processing steps around a next continuation.
- **Plugin architecture** — stable host contract + independently supplied extensions.

Choose a pattern because it solves forces such as replaceability, lifecycle, isolation, extension, or testability—not because a GoF name sounds senior.

---

# Browser JavaScript boundary

Everything in chapters 51–62 below is primarily **host environment / Web API** material. ECMAScript provides the language used to call these APIs; web standards and browser implementations provide the APIs themselves.

## 51 — DOM Mental Model

```text
HTML source
   ↓ HTML parser
DOM tree (host objects)
   ↓ JavaScript DOM APIs
mutations
   ↓ style/layout/paint/compositing work as needed
rendered page
```

The DOM is not “JavaScript.” `document`, `Element`, and `Node` are browser Web API objects exposed to JavaScript.

A DOM tree models document nodes; rendering uses additional browser-internal structures and can differ from the DOM. A DOM mutation may invalidate style/layout/paint work, but browsers optimize and batch many operations.

---

## 52 — DOM Selection and Traversal

```js
const form = document.querySelector('#signup');
const buttons = document.querySelectorAll('button[data-action]');
const byId = document.getElementById('signup');
```

`querySelector` returns the first matching Element or `null`; `querySelectorAll` returns a static `NodeList` in modern browser semantics.

Traversal:

```js
element.children;          // HTMLCollection of element children
node.childNodes;           // NodeList including text/comment nodes
node.parentElement;
element.previousElementSibling;
element.nextElementSibling;
element.closest('[data-card]');
element.matches('.active');
```

Some DOM collections are **live** (update as DOM changes) while others are static. Know the specific API; mutation while iterating a live collection can skip/revisit items.

---

## 53 — DOM Manipulation

Prefer text-safe APIs for text:

```js
const title = document.createElement('h2');
title.textContent = userProvidedTitle;
container.append(title);
```

`innerHTML` parses HTML and is an XSS sink when fed untrusted strings.

```js
// dangerous if comment is untrusted
container.innerHTML = `<p>${comment}</p>`;
```

Use `createElement`, `textContent`, attributes/properties, and trusted templating/sanitization strategies.

Core APIs:

```js
element.append(node, 'text');
element.prepend(node);
element.before(node);
element.after(node);
element.replaceWith(node);
element.remove();
element.cloneNode(true);
element.classList.add('active');
element.setAttribute('aria-expanded', 'true');
element.dataset.state = 'open';
element.style.display = 'none';
```

`DocumentFragment` can assemble/move node batches; `<template>` stores inert template content that can be cloned. Performance gains depend on overall rendering behavior; measure rather than assuming fragments solve every DOM bottleneck.

---

## 54 — Browser Events

`EventTarget` provides `addEventListener`/`removeEventListener`.

```js
function onClick(event) {
  console.log(event.target, event.currentTarget);
}
button.addEventListener('click', onClick);
button.removeEventListener('click', onClick);
```

Event flow for bubbling events:

```text
ancestor capture
      ↓
target phase
      ↓
ancestor bubble
```

`event.target` is the original dispatch target (subject to retargeting rules such as Shadow DOM). `event.currentTarget` is the listener target currently running.

`preventDefault()` asks to prevent a cancelable event's default action. `stopPropagation()` stops further capture/bubble propagation; `stopImmediatePropagation()` also prevents later listeners on the same target.

Listener options include `capture`, `once`, `passive`, and `signal` in modern browsers. `AbortSignal`-based listener cleanup is useful:

```js
const controller = new AbortController();
window.addEventListener('resize', onResize, {signal: controller.signal});
controller.abort();
```

### Delegation

```js
list.addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button || !list.contains(button)) return;
  removeItem(button.dataset.delete);
});
```

Delegation reduces listener count and naturally handles dynamic descendants. Validate the matched element is inside the intended boundary.

Browser event families include keyboard, pointer, mouse, input, focus, form, lifecycle, drag/drop, touch (legacy/specific use), and custom events. Prefer Pointer Events for unified pointer input where appropriate; design keyboard/accessibility behavior explicitly.

```js
element.dispatchEvent(new CustomEvent('cartchange', {detail: cartSnapshot}));
```

---

## 55 — Forms and Validation

Use semantic form controls and the browser's built-in accessibility behavior before inventing custom widgets.

```js
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
});
```

HTML constraint validation exposes `checkValidity`, `reportValidity`, `validity`, and `setCustomValidity`.

```js
email.setCustomValidity(email.value.endsWith('@example.com') ? '' : 'Use company email');
```

Client validation improves UX but is never a security boundary; validate again on the server/trusted backend. Associate labels/errors accessibly, preserve focus, and do not communicate validation only with color.

---

## 56 — Browser Fetch and HTTP Client JavaScript

`fetch`, `Request`, `Response`, and `Headers` are Web APIs, not core ECMAScript.

```js
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {'Accept': 'application/json'},
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
const users = await response.json();
```

Fetch normally rejects for network-level failures/abort, **not** merely because the HTTP status is 404/500. Check `response.ok` or `status` according to your contract.

### JSON request

```js
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(task),
  signal,
});
```

Validate response data after parsing; TypeScript types do not validate runtime JSON.

### Abort and timeout

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);
try {
  return await fetch(url, {signal: controller.signal});
} finally {
  clearTimeout(timer);
}
```

Where available, use standardized AbortSignal timeout/composition helpers supported by your target host. A Promise-only timeout that never aborts fetch can leave the request running.

### Credentials/CORS

CORS is a browser policy controlling whether script can access cross-origin responses; it is **not authentication** and does not stop a server from receiving cross-origin requests. Credentials mode, cookie attributes, server CORS headers, preflight rules, and SameSite/CSRF protections must be designed together.

### Retries/idempotency

Retry only failures that are plausibly transient and safe. Backoff/jitter and a retry limit are essential. Retrying a non-idempotent payment/order request can duplicate side effects unless the API provides idempotency keys/semantics.

### Request races

If search query B starts after A but A finishes last, stale A must not overwrite B's UI. Abort old requests or tag responses with request identity/generation.

---

## 57 — URL APIs

```js
const url = new URL('/search', location.origin);
url.searchParams.set('q', query);
url.searchParams.append('tag', 'js');
```

`URL` provides standards-based parsing/resolution; `URLSearchParams` handles query parameters. Do not hand-concatenate query strings.

`encodeURIComponent` encodes a component; `encodeURI` is intended for a broader URI and leaves structural characters unescaped. Modern URL APIs are usually safer than manually combining these functions.

Treat URLs as untrusted input at navigation/fetch boundaries. Validate protocols/origins and avoid open redirects such as blindly navigating to a user-controlled `next` URL.

---

## 58 — Browser Storage

- `localStorage` — synchronous origin-scoped string key/value storage persisted across sessions.
- `sessionStorage` — per-tab/session-style storage with browser-defined lifetime.
- Cookies — HTTP/browser state with security attributes; JavaScript may not see `HttpOnly` cookies.
- IndexedDB — asynchronous structured client database.
- Cache API — request/response caching surface often used by Service Workers/web apps.

```js
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
```

Storage quotas and eviction policies vary. Web Storage is synchronous and can block on large/abusive operations. Do not store long-lived secrets as if browser storage were a vault; any XSS executing in your origin can often access JS-readable storage.

Cross-tab coordination can use the `storage` event, BroadcastChannel, or higher-level state protocols; concurrent tabs create race/last-write issues.

---

## 59 — Browser Timers and Scheduling

`setTimeout`, `setInterval`, `queueMicrotask`, and `requestAnimationFrame` are host APIs.

```js
const id = setTimeout(run, 100);
clearTimeout(id);
```

Timer delays are minimum eligibility hints subject to clamping, throttling, task queues, background-tab policy, and main-thread load.

Prefer recursive timeout when work duration matters:

```js
async function poll() {
  await refresh();
  setTimeout(poll, 5000);
}
poll();
```

`requestAnimationFrame` schedules a callback around the browser's rendering opportunity and is appropriate for visual updates/animations; it is not a general background scheduler.

`queueMicrotask` runs at a microtask checkpoint and can starve tasks/rendering if recursively abused.

---

## 60 — Web Workers

Workers run JavaScript in separate worker agents/threads managed by the browser host. Dedicated Workers communicate through messages.

```js
const worker = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
worker.postMessage({numbers});
worker.addEventListener('message', event => render(event.data));
```

Worker code does not have direct DOM access. Values are normally sent using the structured clone algorithm; transferable objects can transfer ownership to avoid copying large buffers.

```js
worker.postMessage(buffer, [buffer]);
```

After transfer, the sending side's transferable buffer can become detached.

Use Workers for CPU-heavy computation that would otherwise block responsiveness: parsing, image/data transforms, search indexing, simulation, compression where suitable. Network I/O alone usually does not require a Worker because browser APIs are already asynchronous.

SharedArrayBuffer/Atomics enable shared memory but add synchronization complexity/security deployment requirements.

---

## 61 — Structured Clone

`structuredClone` is a host/global API based on the structured clone algorithm used by browser messaging/storage surfaces.

```js
const original = {
  map: new Map([['a', 1]]),
  set: new Set([1, 2]),
};
const copy = structuredClone(original);
```

It supports cycles and many structured built-ins that JSON cannot preserve.

```js
const a = {};
a.self = a;
const b = structuredClone(a);
b.self === b; // true
```

Transferable objects can be moved rather than copied:

```js
const cloned = structuredClone(buffer, {transfer: [buffer]});
```

Structured cloning does not clone arbitrary functions/closures and does not preserve every custom-object behavior/prototype in the way application authors may expect. Consult host compatibility for exact supported platform types.

---

## 62 — Browser Security for JavaScript Developers

### XSS / DOM XSS

Treat data as text unless it is explicitly trusted HTML.

```js
output.textContent = untrusted;
```

Avoid constructing HTML/JS/URLs from untrusted strings. If rich HTML is a requirement, use a well-reviewed sanitizer and consider Trusted Types/CSP.

### `eval` and Function constructor

They convert strings to code, complicate CSP, optimization, auditing, scope reasoning, and injection prevention. Do not use them for parsing data/configuration.

### Prototype pollution

Validate object paths/keys and use patched merge libraries. Avoid inheritance-sensitive authorization checks.

### CSRF vs CORS

CSRF is unwanted authenticated state-changing requests using a victim's browser credentials. CORS controls JavaScript access to cross-origin responses; it is not a CSRF defense by itself. Use SameSite cookies, CSRF tokens/origin checks as appropriate, and safe API semantics.

### CSP and Trusted Types

Content Security Policy limits script/style/resource execution sources and can reduce XSS impact. Trusted Types can force dangerous DOM sinks to receive policy-created trusted values. They complement—not replace—output encoding/sanitization and secure design.

### Secrets and tokens

Anything shipped to browser JavaScript is observable by the user and potentially by successful XSS/compromised extensions. Do not embed server secrets/API private keys. Token storage strategy is an architecture decision balancing XSS, CSRF, refresh, scope, and backend capabilities.

### Third-party/dependency risk

Third-party scripts execute with origin privileges unless isolated. Minimize them, pin/review dependencies, use SRI where applicable for static third-party resources, maintain CSP, and monitor supply-chain changes.

### URL/open redirect

Validate navigation destinations. Prefer relative application routes or allowlisted origins/protocols; never pass attacker-controlled `javascript:`/unexpected schemes into dangerous navigation/HTML contexts.

### Interview checks for 48–62

1. What is functional core / imperative shell?
2. How does composition differ from inheritance?
3. Why is the DOM a host API?
4. `target` vs `currentTarget`?
5. Why must server validation exist after client validation?
6. Why doesn't fetch reject on every HTTP 500?
7. Why is CORS not authentication or CSRF protection?
8. Why is localStorage unsuitable as a generic secret vault?
9. What does timer delay actually guarantee?
10. When should work move to a Worker?
11. Why is structuredClone different from JSON cloning?
12. What is the safest default for untrusted text insertion?
