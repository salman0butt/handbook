---
title: File System
---

# File System

Node provides callback, synchronous, Promise, stream, and file-handle filesystem APIs. The right choice depends on lifecycle and workload.

```js
import { open, rename } from 'node:fs/promises';

const handle = await open('data.txt', 'r');
try {
  const stat = await handle.stat();
  console.log(stat.size);
} finally {
  await handle.close();
}
```

## Sync vs async

Synchronous file APIs block the main JavaScript thread. They are reasonable during controlled startup scripts/short CLIs but usually wrong on a concurrent request path.

## Atomic replacement pattern

For configuration/state files, write a temporary file in the same filesystem, flush when durability matters, then rename into place. “Atomic” depends on filesystem/operation semantics; it does not mean every multi-step workflow is transaction-safe.

## Race conditions and TOCTOU

Do not “check then use” a path as if the world freezes between operations.

```text
check permissions/existence
        ↓ attacker/process changes path
open path
```

Prefer performing the intended operation and handling its result. When security matters, operate on file descriptors/handles and constrain allowed roots.

## Watching

Filesystem watch APIs vary by platform and can coalesce/drop/represent events differently. Treat them as change hints; robust sync systems re-scan/reconcile desired state.

## Performance

- stream large files;
- bound concurrent file operations;
- close descriptors promptly;
- avoid repeated stat/read cycles when one operation suffices;
- understand that selected fs operations use shared libuv worker-pool capacity.
