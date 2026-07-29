---
title: Project 2 — Streaming File Processor
---

# Project 2 — Streaming File Processor

Build a service/CLI that ingests multi-gigabyte CSV/NDJSON files, validates records, transforms them, and writes compressed output without buffering the dataset.

## Requirements

Use `createReadStream`, a parser Transform, validation Transform, metrics Transform, output serializer, compression, and `pipeline()` from `node:stream/promises`. Support `AbortSignal`, max record size, malformed-row policy, progress metrics, temp output + atomic rename, and test fixtures.

## Architecture

```text
file source
  ↓
parse Transform
  ↓
validate/normalize
  ↓
async enrichment (bounded)
  ↓
serialize
  ↓
compress
  ↓
temp file → atomic replace
```

## Runtime model

File operations use Node/libuv/OS facilities; Transform JavaScript executes on the main thread; compression may use native/libuv resources; async enrichment waits on external services. Backpressure must flow end to end.

## Milestones

1. byte stream + line framing;
2. parser + max line size;
3. validation and error report;
4. bounded async enrichment;
5. gzip output + abort cleanup;
6. metrics + tests + load/memory profiling.

## Acceptance criteria

Processing a 10 GB synthetic input has bounded RSS; slowing the sink slows the source; abort removes incomplete temp output; a malformed record follows configured skip/fail policy; output is atomically promoted only after successful pipeline completion.

## Security

Resolve input/output inside authorized roots, prevent traversal/symlink surprises where relevant, cap record/field sizes, avoid CSV formula hazards when output targets spreadsheets, and never trust filename metadata.

## Performance

Measure throughput, RSS, event-loop delay, transform CPU, compression CPU, and highWaterMark changes. Do not increase buffers until measurements show a benefit.

## Testing

Chunk-boundary tests (split UTF-8/records at awkward points), slow writable for backpressure, abort midstream, disk-full/write error, malformed encoding, enrichment timeout, and 100k-record property/fuzz-like input.

## Failure modes

Source disappears, permission denied, disk full, record too large, parser throws, downstream API slow, output close fails, process receives SIGTERM.

## Observability

Bytes read/written, records valid/invalid, current throughput, enrichment latency/errors, pipeline duration, abort reason, RSS, event-loop delay.

## Deployment

Run as CLI worker/job with ephemeral scratch space sized explicitly; persist output to durable storage only after success.

## Common mistakes

`readFile()` entire input, collecting parsed rows into array, ignoring `write()` pressure, parallelizing enrichment without bound, renaming partial output.

## Stretch goals

Web Streams interop, worker-thread CPU transform, resumable checkpoints, object-storage streaming, dynamic concurrency controller.

## Interview questions

Explain how backpressure reduces memory, why a Transform can still block the event loop, and when worker threads improve this pipeline.

## Design review

Show memory math for every buffer/concurrency stage and prove cancellation closes every owned resource.
