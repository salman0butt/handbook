---
title: Path, URL & Filesystem Semantics
---

# Path, URL & Filesystem Semantics

Filesystem paths and URLs are different namespaces. ESM module identity is URL-oriented; OS file APIs use platform path semantics.

```js
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

console.log(path.join('uploads', 'avatar.png'));
console.log(fileURLToPath(import.meta.url));
console.log(pathToFileURL('/tmp/report.txt'));
```

## `join` vs `resolve`

`path.join()` combines/normalizes segments. `path.resolve()` produces an absolute path by resolving from right to left and using the current working directory when needed. Do not substitute one for the other mechanically.

## Cross-platform behavior

Windows and POSIX have different separators, roots, drive/UNC behavior, and case rules. Use `path.win32`/`path.posix` when manipulating paths for a platform other than the current host.

## ESM paths

Current Node supports stable `import.meta.dirname` and `import.meta.filename` for file-backed modules. `import.meta.url` remains the general URL identity.

## Path traversal

Never trust `path.join(root, userInput)` alone as authorization. Normalize/resolve, verify containment against an allowed root, reject dangerous encodings/segments, and preferably map opaque IDs to server-owned paths.

```text
request path
   ↓ decode + validate
logical resource id
   ↓ authorization
server-owned filesystem path
```

A filesystem path is not a permission decision.
