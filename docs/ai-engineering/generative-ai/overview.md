---
id: overview
title: Generative AI Foundations
---

# Generative AI Foundations

Generative AI is the part of machine learning that learns enough structure from data to **create new outputs**: text, code, images, speech, music, video, 3D assets, molecules, structured records, or combinations of modalities.

An LLM is one important kind of generative model, but **Generative AI is larger than LLMs**. A production AI engineer should know the major model families, what they optimize, where they fail, and how they are combined into applications.

## The Generative AI landscape

```text
                         Generative AI
                              |
          +-------------------+-------------------+
          |                   |                   |
       Sequence            Continuous          Hybrid / multimodal
       generation          generation           generation
          |                   |                   |
   autoregressive        diffusion /          text + image +
   transformers          flow matching        audio + video
          |                   |                   |
   text, code,           images, audio,       assistants, media
   structured data       video, 3D            editors, agents
```

A useful architecture question is not "Which AI model should I use?" but:

> What representation must be generated, what constraints matter, and which model family gives the best quality/cost/control trade-off?

## Major generative model families

### Autoregressive models

Autoregressive models generate one element conditioned on the elements before it.

```text
context -> token 1 -> token 2 -> token 3 -> ... -> stop
```

For language, the generated elements are usually tokens. Similar autoregressive ideas can be used for image, audio, and multimodal token sequences.

**Strengths**

- natural fit for text and code;
- strong conditional generation;
- can expose streaming output;
- works well with structured outputs and tool calling.

**Weaknesses**

- generation is sequential;
- long outputs accumulate latency;
- probabilistic decoding can violate business constraints;
- next-token prediction does not automatically produce factual truth.

### Variational Autoencoders

A VAE learns to encode an input into a compact latent representation and decode a latent representation back into the data space.

```text
image -> encoder -> latent z -> decoder -> reconstructed image
```

Modern image, audio, and video systems often use an autoencoder-like component so expensive generation happens in a compressed latent space instead of directly over every pixel or waveform sample.

The latent representation is **not application memory**. It is a learned mathematical representation of the generated data.

### GANs

A Generative Adversarial Network trains two models against one another:

```text
noise -> generator -> candidate sample -> discriminator -> real / generated
                                      ^                     |
                                      +------ training ------+
```

GANs historically produced high-quality images and remain relevant for understanding adversarial training, super-resolution, style transfer, and specialized generators. Typical problems include unstable training and mode collapse.

### Diffusion models

Diffusion-style models learn to reverse a corruption process. Conceptually, training teaches the model how noise relates to data; inference starts from noise and repeatedly moves toward a clean sample.

```text
training:    clean sample -> add noise -> noisy sample -> learn denoising signal

inference:   random noise -> denoise -> denoise -> denoise -> generated sample
```

In real systems, a pipeline may contain a text encoder, a latent autoencoder, a denoising network such as a UNet or diffusion transformer, and a scheduler/sampler.

Diffusion libraries expose different schedulers because the update rule and timestep schedule affect quality, speed, and reproducibility.

### Flow matching

Flow-matching models learn a continuous vector field that transports samples from a simple distribution toward the data distribution.

```text
simple distribution ------------------------------> data distribution
                       learned flow over time
```

From an application engineer's perspective, flow matching belongs in the same operational conversation as diffusion: iterative generation, scheduler/solver choices, latent representations, accelerators, guidance, and quality-versus-latency trade-offs. Current Diffusers exposes FlowMatch schedulers for models that use this formulation.

### Energy-based and other families

Research includes energy-based models, normalizing flows, discrete diffusion, masked generative models, state-space generators, and hybrids. You do not need to force every production problem into one family. New architectures often reuse familiar engineering concerns: conditioning, sampling, adaptation, evaluation, serving, and safety.

## Conditioning: how generation is controlled

A generative model rarely generates in a vacuum. It receives **conditioning information**.

```text
user intent
   |
   +--> text prompt
   +--> reference image
   +--> mask / bounding box / pose
   +--> audio reference
   +--> retrieved context
   +--> style / adapter
   +--> control signal
             |
             v
        generative model
             |
             v
          output
```

Conditioning may be represented through tokens, embeddings, cross-attention, adapters, latent inputs, control networks, or model-specific mechanisms.

## Generation is not retrieval

These are different operations:

```text
retrieval:   query -> find existing information

generation: context -> create new output
```

A RAG system combines both:

```text
question -> retrieve evidence -> generate grounded response
```

An image editing workflow may also combine both:

```text
asset id -> retrieve original image -> generate edited version
```

Keeping retrieval and generation separate makes systems easier to secure, evaluate, cache, and debug.

## Foundation models and specialized models

A foundation model is pretrained broadly enough to be adapted to many downstream tasks. Specialization can happen through:

- prompting;
- structured context;
- retrieval;
- tools;
- fine-tuning;
- LoRA or other parameter-efficient adapters;
- control models;
- distillation;
- domain-specific continued training.

Do not fine-tune by reflex. First identify the failure.

```text
wrong current facts?        -> retrieval / tools
wrong output shape?         -> schema / constrained generation
wrong domain behaviour?     -> prompting, examples, then adaptation
too expensive?              -> smaller model, distillation, routing, quantization
wrong visual composition?   -> stronger conditioning / control
```

## Training versus inference versus adaptation

```text
PRETRAINING
large dataset -> train many/all parameters -> foundation model

ADAPTATION
smaller task/domain data -> update some or all parameters -> specialized model

INFERENCE
request + conditioning -> frozen model/adapters -> generated output
```

Most application engineers spend most of their time on inference architecture, evaluation, data pipelines, orchestration, and product controls rather than foundation-model pretraining.

## A provider-neutral TypeScript boundary

The business layer should not depend directly on one provider's media API.

```ts
export type Modality = 'text' | 'image' | 'audio' | 'video'

export interface GenerationRequest {
  modality: Modality
  prompt: string
  referenceAssetIds?: string[]
  metadata?: Record<string, string>
}

export interface GenerationResult {
  id: string
  modality: Modality
  status: 'completed' | 'queued'
  assetUrl?: string
  text?: string
  providerModel: string
}

export interface GenerativeModel {
  generate(input: GenerationRequest): Promise<GenerationResult>
}
```

Now policy and authorization can live outside provider adapters:

```ts
async function generateForTenant(
  tenantId: string,
  request: GenerationRequest,
  model: GenerativeModel,
) {
  await authorizeGeneration(tenantId, request)
  await validatePromptPolicy(request)

  const result = await model.generate(request)
  await recordGenerationAudit(tenantId, request, result)
  return result
}
```

The model proposes or creates content; application code still owns authorization, quotas, data policy, moderation, storage, retention, and audit trails.

## What to measure

Generative systems need more than an "accuracy" number.

| Dimension | Example measurement |
|---|---|
| Prompt alignment | Does output satisfy requested content and constraints? |
| Quality | Human rubric, pairwise preference, task-specific score |
| Grounding | Are claims supported by evidence? |
| Diversity | Do repeated generations collapse to the same pattern? |
| Safety | Policy violation and adversarial test rate |
| Latency | Queue time, time-to-first-output, total completion time |
| Cost | Cost per accepted generation, not merely per request |
| Reliability | Success rate, retries, provider failures, corrupted assets |
| Edit fidelity | Did requested changes occur while preserving protected regions? |
| Temporal consistency | For video/audio, does quality remain coherent over time? |

## Engineering principles

1. **Model output is untrusted data.** Parse, validate, moderate, and enforce business rules outside the model.
2. **Evaluate the complete pipeline.** A better base model can still create a worse product if retrieval, conditioning, latency, or UX regresses.
3. **Use the least-complex architecture that passes evals.** A prompt may beat an agent; an adapter may beat a full fine-tune; a deterministic transform may beat generation.
4. **Version everything.** Model, prompt, adapter, preprocessing, scheduler, generation parameters, and evaluator versions all affect reproducibility.
5. **Design asynchronous media workflows.** Image, audio, and video generation often have very different latency and resource profiles from text generation.

## Official references

- Hugging Face Diffusers: https://huggingface.co/docs/diffusers/
- Hugging Face PEFT: https://huggingface.co/docs/peft/
- Hugging Face Transformers multimodal processing: https://huggingface.co/docs/transformers/multimodal_processing
- Hugging Face Transformers quantization: https://huggingface.co/docs/transformers/quantization/overview
- OpenAI model catalog and modality capabilities: https://developers.openai.com/api/docs/models

Continue with **Image Generation & Editing** to see how these concepts become a real media pipeline.