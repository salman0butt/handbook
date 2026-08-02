---
title: "Core APIs: Files, Paths, URLs, Process, OS and Util"
description: Node core modules expose portable filesystem, path, URL, process, operating-system, and utility primitives.
---

# Core APIs: Files, Paths, URLs, Process, OS and Util

## Concept

Node core modules expose portable filesystem, path, URL, process, operating-system, and utility primitives.

## Why It Exists

Using core APIs directly clarifies platform behavior and avoids dependencies for stable runtime capabilities.

## Mental Model

```mermaid
flowchart LR
  A["Application"]
  B["node core API"]
  C["Native binding"]
  D["OS resource"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
console.log({here, tempExample: join(tmpdir(), 'app.tmp')});
console.log((await readFile(new URL(import.meta.url), 'utf8')).slice(0, 40));
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use file URLs in ESM, normalize user-independent paths, close file handles, and wrap process metadata behind deliberate configuration and diagnostics boundaries.

## Security

Prevent traversal and symlink surprises, apply least filesystem permission, avoid shell interpolation, and redact environment and host details.

## Performance

Prefer streaming for large files, async APIs in servers, and bounded file concurrency. Cache only metadata proven stable.

## Common Mistakes

- Joining an absolute user path and assuming it remains under a root.
- Using synchronous filesystem APIs in hot request paths.
- Assuming POSIX path rules on Windows.

## Debugging

Log normalized paths safely, inspect permissions and file descriptors, and reproduce on the target operating system.

## Testing

Test Windows/POSIX separators, Unicode names, permissions, missing files, races, and temporary cleanup.

## When Not to Use It

Do not use local disk for durable shared state across ephemeral or horizontally scaled instances.

## Interview Questions

- Why prefer file URLs in ESM?
- How do you prevent path traversal?
- When are synchronous filesystem APIs acceptable?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
