---
id: serving-optimization-safety
title: Generative AI Serving, Optimization & Safety
---

# Generative AI Serving, Optimization & Safety

A generative model becomes a production system only after it is wrapped with routing, capacity management, caching, safety, versioning, observability, storage, retries, and release controls.

## Serving architecture

```text
client
  |
  v
API gateway
  |
  +--> authentication
  +--> tenant / quota policy
  +--> moderation / input validation
  |
  v
model router
  |
  +--> hosted provider
  +--> self-hosted text model
  +--> GPU media worker
  +--> fallback model
  |
  v
post-processing
  |
  +--> schema validation
  +--> output moderation
  +--> provenance metadata
  +--> storage
  |
  v
response / job completion
```

The model is only one dependency in the system.

## Hosted versus self-hosted models

### Hosted providers

Advantages:

- low infrastructure burden;
- rapid access to new models;
- managed scaling;
- provider optimizations.

Trade-offs:

- external latency and rate limits;
- pricing changes;
- data-governance constraints;
- model deprecations;
- less control over hardware/runtime.

### Self-hosted models

Advantages:

- runtime/hardware control;
- custom quantization/adapters;
- data locality;
- potentially lower marginal cost at sufficient scale.

Trade-offs:

- GPU capacity planning;
- model loading and memory management;
- autoscaling complexity;
- upgrades and security patches;
- observability and failover ownership.

Use measured workload economics rather than ideology.

## Model routing

Not every request needs the strongest model.

```text
request
  |
  v
classifier / policy
  |
  +--> simple extraction -> small fast model
  +--> difficult reasoning -> larger model
  +--> image generation -> media model
  +--> realtime voice -> realtime model
  +--> unsupported / risky -> reject or human review
```

A router must itself be evaluated because incorrect routing can silently reduce quality.

## Quantization

Quantization represents weights and sometimes activations with lower precision.

```text
FP32 / BF16 / FP16
        |
        v
 INT8 / INT4 / lower precision
        |
        v
lower memory use, possible speed gain, possible quality loss
```

Current Transformers supports multiple quantization backends and explicitly frames quantization as a memory/compute trade-off that must preserve acceptable quality.

Measure:

- task quality;
- GPU memory;
- tokens/second or samples/second;
- load time;
- latency distribution;
- hardware compatibility.

## Distillation

Distillation can reduce serving cost by training a smaller student from stronger teacher outputs or signals.

```text
large teacher -> curated behavior -> smaller student -> production
```

Distillation and quantization solve related but different problems:

- distillation changes the learned model;
- quantization changes numerical representation.

They can be combined.

## Batching

Batching combines multiple requests into a model execution window.

```text
req A --+
req B --+--> batch -> GPU -> outputs
req C --+
```

Batching can improve throughput but increase queue delay. Tune by workload:

```text
interactive chat -> prioritize latency
batch extraction -> prioritize throughput
image/video jobs -> queue-based GPU utilization
```

## Continuous batching

Text generation requests have different output lengths. Continuous batching allows completed sequences to leave while new work enters, improving accelerator utilization for LLM serving.

The application layer should still enforce per-tenant fairness so one heavy tenant does not monopolize capacity.

## KV cache

Autoregressive serving can cache key/value attention state for processed tokens.

```text
prompt tokens -> compute attention state -> KV cache
                                      |
next token generation ----------------+
```

KV cache reduces repeated work within generation but consumes accelerator memory. Long context can become a memory-capacity problem even before compute becomes the bottleneck.

## Prompt caching

If a provider/runtime supports prompt-prefix caching, stable prefixes can reduce repeated preprocessing work.

```text
stable system instructions + tool definitions + changing user request
             ^ reusable prefix
```

Do not distort architecture merely to chase caching. First keep prompts semantically correct, then measure cache benefits.

## Media-generation optimization

Image/audio/video pipelines have different controls:

- inference step count;
- scheduler/solver;
- resolution;
- duration;
- number of candidates;
- latent precision;
- model offloading;
- quantization;
- adapter loading/unloading;
- compile/runtime acceleration.

Current Diffusers documents schedulers, offloading, quantization, adapters, and compiled execution as separate optimization mechanisms.

## GPU memory model

A useful mental model:

```text
GPU memory = model weights
           + activations
           + KV cache / latents
           + adapter weights
           + runtime overhead
           + batch working memory
```

OOM failures are architecture signals. Measure peak memory under realistic batch/context/resolution settings.

## Cold starts and model loading

Large models can take significant time to load.

Mitigations:

- keep hot pools;
- preload common adapters;
- lazy-load uncommon adapters;
- use model residency policies;
- keep separate worker pools by model family;
- avoid loading several giant models into one process without memory planning.

## Backpressure

When incoming work exceeds capacity:

```text
incoming jobs > worker capacity
       |
       v
bounded queue
  |          |
accept     reject / delay
```

Do not allow unbounded queues. Track queue age and define deadlines.

```ts
export interface GenerationJobPolicy {
  maxQueueAgeMs: number
  maxAttempts: number
  deadlineMs: number
}
```

## Retries

Retry only failures that are likely transient.

```text
rate limit / timeout / temporary capacity -> retry with backoff
invalid request / policy rejection --------> do not retry
model safety refusal -----------------------> do not blindly retry
```

For expensive media jobs, persist provider job IDs before retrying so duplicate submissions do not multiply cost.

## Circuit breakers and fallbacks

```text
primary model failures spike
        |
        v
circuit opens
        |
        +--> fallback model
        +--> degraded feature
        +--> queue for later
        +--> explicit error
```

Fallbacks should have their own evals. "Any answer" is not better than a controlled failure.

## Cost model

For text:

```text
cost ≈ input tokens + output tokens + tool/media fees + retries
```

For media:

```text
cost ≈ generations x resolution/duration/quality tier
     + storage
     + transcoding
     + retries
     + rejected outputs
```

Track cost per successful business outcome.

## TypeScript model router

```ts
export interface ModelCandidate {
  id: string
  modalities: Set<'text' | 'image' | 'audio' | 'video'>
  supportsTools: boolean
  costTier: 'low' | 'medium' | 'high'
  latencyTier: 'realtime' | 'interactive' | 'batch'
}

export function chooseModel(
  candidates: ModelCandidate[],
  requirement: {
    modality: 'text' | 'image' | 'audio' | 'video'
    tools: boolean
    maxCostTier: ModelCandidate['costTier']
  },
) {
  return candidates.find(candidate =>
    candidate.modalities.has(requirement.modality) &&
    (!requirement.tools || candidate.supportsTools),
  )
}
```

In production, route using evaluated quality constraints as well as capability metadata.

## Safety architecture

Safety must surround generation.

```text
user input
  |
  +--> auth / age / tenant policy
  +--> prompt/input moderation
  +--> asset rights / consent checks
  |
  v
generative model
  |
  +--> output moderation
  +--> schema/business validation
  +--> provenance / audit
  |
  v
publish / execute / store
```

Do not ask the same model that generated risky output to be the sole enforcement mechanism.

## Prompt injection in generative systems

Prompt injection is not limited to text chat. Untrusted instructions can appear in:

- documents;
- images containing text;
- web pages;
- audio transcripts;
- QR codes;
- tool output;
- metadata;
- retrieved content.

```text
untrusted content -> model interprets instruction
                            |
                            v
                   proposed privileged action
                            |
                            v
                  external policy enforcement
```

Treat external content as data, not authority.

## Media-specific safety

Image/video/audio systems need additional controls around:

- identity and likeness;
- impersonation;
- non-consensual intimate content;
- minors;
- deceptive media;
- voice cloning;
- private reference assets;
- provenance;
- watermark/content-credential support;
- rights/licensing.

Policies vary by jurisdiction and provider, so application-level rules should be configurable and versioned.

## Audit record

```ts
export interface GenerationAuditEvent {
  tenantId: string
  userId: string
  requestId: string
  model: string
  modelRevision?: string
  promptVersion: string
  adapterVersions: string[]
  policyVersion: string
  outcome: 'allowed' | 'blocked' | 'failed' | 'completed'
  createdAt: string
}
```

Avoid storing raw sensitive prompts by default if hashes, redacted forms, or structured metadata meet the audit requirement.

## Release strategy

```text
candidate model/config
       |
       v
 offline eval
       |
       v
 shadow / replay
       |
       v
 small canary
       |
       v
 progressive rollout
       |
       +--> continue
       +--> rollback
```

Version model + prompt + retrieval + adapter + policy together. A model upgrade is a software release.

## Observability

Track per request/job:

- selected model and revision;
- prompt/template version;
- input/output modality;
- token/media usage;
- queue time;
- model latency;
- first-token/frame/audio latency;
- retry count;
- fallback use;
- moderation decisions;
- cost;
- user acceptance/regeneration signal.

Trace tool calls and retrieval separately so model latency is not blamed for every slow request.

## Official references

- Transformers quantization: https://huggingface.co/docs/transformers/quantization/overview
- Diffusers overview and optimization surface: https://huggingface.co/docs/diffusers/
- Diffusers schedulers: https://huggingface.co/docs/diffusers/using-diffusers/schedulers
- PEFT: https://huggingface.co/docs/peft/
