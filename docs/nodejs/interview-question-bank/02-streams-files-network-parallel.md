---
title: Q065–Q128 — Streams, Files, Networking & Parallelism
---

# Q065–Q128 — Streams, Files, Networking & Parallelism

## Important question cards

### Q065. How does backpressure work in Node streams?

**Expected answer:** when a consumer cannot keep up, pressure signals cause upstream production to slow; for Writable streams, `write()` returning `false` means wait for `'drain'`.

**Senior answer:** connect backpressure to bounded memory, highWaterMark thresholds, async transforms, HTTP/TCP/file pipelines, cancellation, and overload behavior.

**Weak answer:** “Streams automatically make everything memory efficient.”

**Follow-up:** How can a stream pipeline still consume unbounded memory?

### Q066. When should you use worker threads?

**Expected answer:** for measured CPU-bound JavaScript that benefits from parallel execution and can be partitioned with acceptable messaging overhead.

**Senior answer:** use a bounded pool, consider CPU quota, clone/transfer cost, cancellation, crash replacement, queue limits, and compare with processes/native/Wasm.

**Weak answer:** “Use workers when async code is slow.”

**Follow-up:** Would workers improve a slow PostgreSQL query?

### Q067. Worker thread vs child process?

**Expected answer:** workers are separate JS isolates/threads in one process; child processes have separate OS process memory/failure boundaries and can run arbitrary executables.

**Senior answer:** discuss startup/IPC cost, transferable/shared memory, native crashes, security/resource isolation, deployment, and process fate.

**Weak answer:** “Workers are newer so always use them.”

**Follow-up:** Which would you use for invoking FFmpeg and why?

### Q068. Why can a Node service use 2 GB RSS while `heapUsed` is much smaller?

**Expected answer:** RSS includes V8 heap plus native allocations, Buffer/ArrayBuffer external memory, stacks, code, and mapped memory.

**Senior answer:** inspect `process.memoryUsage()`, queue/buffer cardinality, native dependencies, heap snapshots for reachable JS, and container limits.

**Weak answer:** “V8 garbage collection is broken.”

**Follow-up:** How would you distinguish a heap leak from retained Buffers?

## Questions

**Q069.** What is the relationship between `Buffer`, `Uint8Array`, and `ArrayBuffer`?

**Q070.** Why is byte length different from JavaScript string length for UTF-8 text?

**Q071.** When is `Buffer.allocUnsafe()` appropriate, and what is the security requirement?

**Q072.** How can Buffer views/slices affect memory retention and mutation?

**Q073.** What are Readable, Writable, Duplex, and Transform streams?

**Q074.** What is object mode and how does it change buffering semantics?

**Q075.** What is flowing vs paused mode on a Readable?

**Q076.** Why prefer `pipeline()` over manually chaining `.pipe()` for production flows?

**Q077.** What does `highWaterMark` mean, and why is it not simply a hard memory limit?

**Q078.** How does async iteration consume a Readable stream?

**Q079.** How do Node streams interoperate with Web Streams?

**Q080.** How should a stream pipeline respond when the HTTP client disconnects?

**Q081.** Why can a Transform stream still block the event loop?

**Q082.** When is synchronous filesystem I/O acceptable, and when is it dangerous?

**Q083.** How do Promise-based fs APIs differ from stream APIs?

**Q084.** Why should file handles be closed in `finally` blocks or equivalent ownership scopes?

**Q085.** What is an atomic file replacement pattern?

**Q086.** What is a TOCTOU race in filesystem code?

**Q087.** Why is “check whether a file exists, then open it” race-prone?

**Q088.** What limitations make filesystem watching unsuitable as a perfect event log?

**Q089.** What is the difference between `path.join()` and `path.resolve()`?

**Q090.** Why do POSIX and Windows path semantics require deliberate cross-platform handling?

**Q091.** How do `fileURLToPath` and `pathToFileURL` help ESM/filesystem interoperability?

**Q092.** Why is normalizing a user-supplied path insufficient to prevent path traversal?

**Q093.** How does `EventEmitter.emit()` invoke listeners?

**Q094.** Why is the `'error'` event special on EventEmitter?

**Q095.** What causes max-listener warnings, and why shouldn't you simply increase the limit?

**Q096.** EventEmitter vs EventTarget: when might each be appropriate?

**Q097.** Why is an in-process EventEmitter not a durable event architecture?

**Q098.** How do Node HTTP request and response bodies relate to streams?

**Q099.** Why must an HTTP server cap request body size before buffering?

**Q100.** What is HTTP keep-alive and why does connection reuse matter?

**Q101.** What role does an HTTP connection agent/pool play for outbound requests?

**Q102.** Why are header, body, application, upstream, idle, and shutdown timeouts different concerns?

**Q103.** How do you propagate request cancellation to downstream work?

**Q104.** What steps make an HTTP server shut down gracefully?

**Q105.** What does TLS provide, and what does a certificate chain validate?

**Q106.** What are SNI and ALPN?

**Q107.** What changes when TLS terminates at a reverse proxy rather than inside Node?

**Q108.** What multiplexing model does HTTP/2 introduce?

**Q109.** Why must proxy forwarding headers only be trusted from known infrastructure?

**Q110.** How is server-side `fetch()` similar to and different from browser fetch?

**Q111.** Why is CORS not a server authentication mechanism?

**Q112.** Why should large Fetch response bodies be streamed rather than always using `arrayBuffer()` or `text()`?

**Q113.** What is TCP's connection/byte-stream model?

**Q114.** Why does one TCP `write()` not equal one receiver `'data'` event?

**Q115.** How should a custom TCP protocol frame messages safely?

**Q116.** What is a half-open TCP connection?

**Q117.** TCP keepalive vs application timeout: what is the difference?

**Q118.** What delivery/ordering guarantees does UDP not provide?

**Q119.** What is the difference between `dns.lookup()` and `dns.resolve*()` APIs?

**Q120.** How can DNS become a production bottleneck or failure domain?

**Q121.** Compare `spawn`, `exec`, `execFile`, and `fork`.

**Q122.** Why is `exec()` especially risky with untrusted input and large output?

**Q123.** How can you prevent command injection when launching a child process?

**Q124.** How do structured clone, transferable objects, `SharedArrayBuffer`, and Atomics differ in worker communication?

**Q125.** Why should production CPU workers normally be pooled instead of created per request?

**Q126.** What is `cluster`, and when are external replicas preferable?

**Q127.** What are common causes of JavaScript memory leaks in Node?

**Q128.** What can V8 optimization/deoptimization concepts teach you without relying on unstable internals?
