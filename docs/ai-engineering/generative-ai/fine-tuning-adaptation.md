---
id: fine-tuning-adaptation
title: Fine-Tuning, LoRA & Model Adaptation
---

# Fine-Tuning, LoRA & Model Adaptation

Model adaptation changes model behavior by training on new data or attaching learned components. It should be used only after identifying the failure you actually need to solve.

## Adaptation decision tree

```text
model fails requirement
      |
      +--> facts are missing/current? --------> RAG / tools
      |
      +--> output format is unstable? --------> schema / constrained output
      |
      +--> instructions are misunderstood? ---> prompt + examples
      |
      +--> domain behavior remains weak? -----> fine-tune / PEFT
      |
      +--> model is too large/slow? ----------> distill / quantize / smaller model
      |
      +--> visual control is weak? -----------> LoRA / ControlNet / reference adapter
```

Fine-tuning is not a database update mechanism. If facts change daily, retrieval is usually the better tool.

## Full fine-tuning

Full fine-tuning updates most or all model parameters.

```text
pretrained model weights
        |
training data + optimizer
        |
        v
updated model weights
```

Advantages:

- maximum flexibility;
- can strongly alter model behavior;
- suitable when substantial domain adaptation is required.

Costs:

- high training memory/compute;
- larger checkpoint storage;
- harder multi-tenant specialization;
- higher operational burden;
- regression risk outside the training distribution.

## Supervised fine-tuning

SFT trains a model on input/output examples.

```text
input / instruction -> desired response
input / instruction -> desired response
input / instruction -> desired response
```

Quality depends heavily on dataset quality. Ten thousand weak examples can be worse than a smaller set of carefully reviewed examples.

## Preference optimization

Preference methods train from comparisons or preference signals.

```text
prompt
  |
  +--> candidate A  <- preferred
  +--> candidate B
```

Families include RLHF-style approaches and direct preference optimization approaches. The engineering lesson is to separate:

- task correctness;
- style preference;
- safety policy;
- product preference.

Do not hide factual correctness behind "users preferred this answer."

## Parameter-efficient fine-tuning

PEFT updates a small subset of trainable parameters instead of all base weights.

```text
frozen base model
   |
   +--> small trainable adapter parameters
                |
                v
         specialized behavior
```

Current Hugging Face PEFT supports many adapter methods and integrates with Transformers and Diffusers.

## LoRA mental model

LoRA approximates a weight update with low-rank matrices.

Conceptually:

```text
original weight W
       +
learned low-rank update A x B
       =
adapted effective weight
```

Instead of storing a full new model for every specialization, you can store a small adapter relative to a shared base model.

Operationally:

```text
base model v1
  + support-domain LoRA v3
  + finance-tone LoRA v2
  + brand-image LoRA v8
```

Every adapter is a deployable artifact and must be versioned, evaluated, permissioned, and rollback-capable.

## QLoRA

QLoRA-style training combines quantized base-model weights with trainable LoRA adapters so large models can be adapted with lower memory requirements.

```text
quantized frozen base model
          +
     trainable LoRA
          |
          v
 lower-memory adaptation
```

Do not assume quantization is free. Evaluate quality, throughput, training stability, and hardware compatibility.

## Prompt tuning and soft prompts

Prompt-based PEFT methods train learned vectors that influence the model without updating all base parameters.

```text
learned virtual prompt vectors + user tokens -> frozen model
```

These methods can be useful when you need lightweight specialization, but operational tooling and model support vary.

## Image-model adaptation

Generative media adds adaptation patterns such as:

- LoRA for style/subject/domain specialization;
- DreamBooth-style subject adaptation;
- ControlNet-style structural control training;
- IP-Adapter-style image conditioning;
- textual inversion and learned embeddings;
- domain-specific continued training.

The important architecture distinction:

```text
style specialization   -> adapter may be enough
exact structural layout -> control signal may be stronger
changing source facts   -> adaptation is the wrong tool
```

## Training data pipeline

```text
raw examples
   |
   +--> licensing / consent check
   +--> deduplicate
   +--> remove secrets / PII if required
   +--> normalize format
   +--> quality review
   +--> split train / validation / holdout
   |
   v
versioned training dataset
```

Never build a fine-tuning pipeline where a user can accidentally train on data from another tenant.

## TypeScript training-manifest model

The actual training runtime may be Python/GPU-centric, but platform orchestration can still be TypeScript-first.

```ts
export interface TrainingManifest {
  id: string
  tenantId: string
  baseModel: string
  baseRevision: string
  datasetVersion: string
  method: 'sft' | 'lora' | 'qlora' | 'preference'
  hyperparameters: Record<string, string | number | boolean>
  createdAt: string
}

export interface TrainedArtifact {
  manifestId: string
  artifactUri: string
  evalSuiteVersion: string
  status: 'candidate' | 'approved' | 'rejected' | 'retired'
}
```

A training job should not automatically become production-approved.

## Evaluation gate

```text
training complete
      |
      v
candidate artifact
      |
      +--> task evals
      +--> regression evals
      +--> safety evals
      +--> latency / memory evals
      |
      v
approval decision
      |
      +--> reject
      +--> canary
      +--> production
```

Compare against the base model and the current production model, not just against an old benchmark.

## Regression testing

Adaptation can improve one skill and damage another.

Example matrix:

| Eval set | Base | Candidate | Decision |
|---|---:|---:|---|
| Domain extraction | 82% | 94% | improved |
| General instruction following | 91% | 89% | small regression |
| Safety refusal | 98% | 91% | reject |
| Latency p95 | 1.2s | 1.3s | acceptable |

One headline score is not enough.

## Catastrophic forgetting

A fine-tune may over-specialize and reduce broader capabilities. Mitigations include:

- representative training mixture;
- smaller learning rates;
- fewer steps;
- parameter-efficient adaptation;
- regularization;
- explicit regression suites;
- routing specialized workloads to the adapter only when needed.

## Data leakage and memorization

Risks include:

- secrets copied into training data;
- private records memorized;
- copyrighted content without appropriate rights;
- one tenant's data affecting another tenant's model;
- evaluation examples included in training.

Maintain data lineage:

```text
source -> ingestion -> cleaned dataset -> training run -> model artifact -> deployment
```

Every arrow should be auditable.

## Adapter registry

```ts
export interface AdapterVersion {
  name: string
  version: string
  baseModel: string
  baseRevision: string
  artifactUri: string
  evalReportId: string
  status: 'testing' | 'approved' | 'retired'
}
```

The serving layer should reject incompatible base-model/adapter combinations.

## Multi-tenant adaptation

Bad pattern:

```text
all customer examples -> one shared fine-tune -> every customer
```

Better choices depend on product requirements:

```text
shared base model
  |
  +--> prompt / RAG per tenant
  +--> isolated adapter per tenant
  +--> shared domain adapter + tenant-specific retrieval
```

Default toward architectures that minimize cross-tenant learned-state coupling.

## When not to fine-tune

Avoid fine-tuning when:

- the requirement is simply to inject current facts;
- deterministic rules can solve the task;
- you have no reliable eval set;
- dataset rights are unclear;
- you cannot reproduce or rollback training;
- prompts/examples already meet the requirement;
- a smaller/routed model solves the cost problem better.

## Official references

- Hugging Face PEFT: https://huggingface.co/docs/peft/
- Diffusers LoRA loaders: https://huggingface.co/docs/diffusers/api/loaders/lora
- Diffusers adapter loading: https://huggingface.co/docs/diffusers/main/using-diffusers/loading_adapters
- Transformers quantization: https://huggingface.co/docs/transformers/quantization/overview
