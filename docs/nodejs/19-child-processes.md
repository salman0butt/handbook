---
title: Child Processes
---

# Child Processes

Child processes create separate OS processes with their own memory and failure boundaries. Use them for external executables, isolation, or process-level parallelism—not as a default async primitive.

## API choices

- `spawn()`: stream stdin/stdout/stderr; best for large/long-running output.
- `exec()`: runs through a shell and buffers output; convenient but higher injection and memory risk.
- `execFile()`: executes a program directly without a shell by default.
- `fork()`: starts another Node process with an IPC channel.

```js
import { spawn } from 'node:child_process';

const child = spawn('git', ['status', '--porcelain'], {
  stdio: ['ignore', 'pipe', 'inherit'],
});

for await (const chunk of child.stdout) process.stdout.write(chunk);
```

## Shell injection

Never build a shell command from untrusted text.

```js
// dangerous
exec(`convert ${userFilename} out.png`);

// safer shape: fixed executable + separate arguments
spawn('convert', [validatedPath, 'out.png']);
```

Even without a shell, arguments can be dangerous if the target program interprets options or paths specially. Validate at the application boundary.

## Buffering

`exec()` has output buffering limits; a noisy child can fail or consume large memory. Stream when output size is not tightly bounded.

## Lifecycle

Own cancellation, signals, timeout, exit code, stderr, and orphan cleanup. A parent crash does not magically guarantee child cleanup on every platform.

## IPC

`fork()` can exchange structured messages. Validate IPC payloads just like queue/network input; a type annotation does not validate runtime messages.

## Worker thread vs child process

Choose a worker thread when you need in-process JS CPU parallelism with lower communication overhead and can tolerate shared-process fate. Choose a process when you need executable compatibility, stronger resource/failure separation, or OS-level isolation.
