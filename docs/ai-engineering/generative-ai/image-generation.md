---
id: image-generation
title: Image Generation & Editing
---

# Image Generation & Editing

Image generation is more than "send a prompt and receive a PNG." Production systems must understand the generation pipeline, conditioning, editing, reproducibility, asset storage, safety, latency, and cost.

## Text-to-image mental model

A common latent generation pipeline looks like this:

```text
text prompt
    |
    v
text encoder -----> text embeddings
                       |
random noise ----------+-------------------+
                       v                   |
                denoising model            |
                UNet / DiT                 |
                       |                   |
                 scheduler / solver -------+
                       |
                 image latents
                       |
                       v
                    decoder
                       |
                       v
                 generated image
```

The exact components vary by model family. The useful engineering idea is that the application sends conditioning information into a generation pipeline and receives a probabilistic asset.

## Latent diffusion

Generating every pixel directly is expensive. Latent diffusion compresses images into a smaller latent representation and performs iterative generation there.

```text
pixel space                     latent space
1024 x 1024 image -> encoder -> compact representation
                                      |
                                denoise repeatedly
                                      |
1024 x 1024 image <- decoder <- generated latent
```

This explains why an autoencoder/VAE component can matter even when the user only sees a single image-generation API.

## Denoising steps and schedulers

During iterative generation, a scheduler or solver determines how the sample moves between noise levels.

```text
noise z_T
   |
 step T
   v
 z_T-1
   |
 step T-1
   v
  ...
   |
   v
 clean latent z_0
```

More steps do **not** automatically mean a proportionally better image. Some models are trained or distilled for fewer steps. Current Diffusers exposes multiple schedulers, including FlowMatch-specific schedulers, because speed/quality trade-offs depend on the model.

**Production rule:** benchmark scheduler + step-count combinations on your own prompt set instead of copying one community setting.

## Guidance

Many conditional generators expose a guidance mechanism that controls how strongly generation follows the conditioning signal.

```text
low guidance  -> more freedom / weaker prompt alignment
high guidance -> stronger alignment / risk of artifacts or reduced diversity
```

Do not expose arbitrary guidance controls to end users unless the product benefits from them. Most users want semantic controls such as "more realistic" or "preserve layout" rather than sampler terminology.

## Seeds and reproducibility

A seed can make stochastic generation **more reproducible**, but complete determinism can still depend on:

- model revision;
- scheduler;
- inference library version;
- hardware/kernel behavior;
- precision;
- prompt preprocessing;
- adapter versions;
- safety preprocessing/postprocessing.

Store generation metadata with every asset:

```ts
export interface ImageGenerationRecord {
  id: string
  prompt: string
  model: string
  modelRevision?: string
  seed?: number
  width: number
  height: number
  adapterVersions: string[]
  createdAt: string
}
```

## Negative prompts

Some model families support negative conditioning such as "do not include text" or "avoid blur." Treat negative prompts as model-specific controls, not portable business semantics.

A portable application API should describe desired constraints explicitly:

```ts
interface VisualIntent {
  subject: string
  style?: string
  mustInclude?: string[]
  mustAvoid?: string[]
  preserveIdentity?: boolean
  preserveLayout?: boolean
}
```

The provider adapter can translate this intent into prompt text, negative conditioning, reference images, masks, or control signals.

## Image-to-image

Image-to-image starts from an existing image and generates a transformed result.

```text
source image -> encode -> add controlled noise -> denoise with prompt -> output
```

A **strength**-like parameter usually controls how much the output may diverge from the source.

Use cases:

- style transfer;
- product mockups;
- environment changes;
- color/material variants;
- concept iteration.

## Inpainting

Inpainting regenerates a masked region while trying to preserve the rest.

```text
original image
+ mask
+ instruction
    |
    v
 regenerate masked area
 preserve protected area
```

Example product flow:

```text
user selects wall
      |
      v
mask segmentation
      |
      v
"make wall dark green"
      |
      v
inpainting model
      |
      v
visual diff + approval
```

**Production check:** compare protected pixels/regions and reject outputs that alter areas the user asked to preserve beyond a tolerated threshold.

## Outpainting

Outpainting expands beyond the original canvas.

```text
+------------------------------+
| generated continuation       |
|    +--------------------+    |
|    | original image     |    |
|    +--------------------+    |
| generated continuation       |
+------------------------------+
```

This is useful for banner aspect ratios, background expansion, and converting portrait assets into wide layouts.

## Structural control with ControlNet-style conditioning

A control model can guide generation using structured visual signals such as edges, depth, pose, segmentation, or sketches.

```text
text prompt -----------+
                       |
pose / depth / edges --+--> controlled generator --> image
```

This is a major distinction:

- text prompting says **what** you want;
- structural conditioning can say **where/how** it should be arranged.

## Reference-image control with IP-Adapter-style systems

Image-prompt adapters use image features as conditioning, often alongside text.

```text
reference image -> image encoder ----+
                                    |
text prompt -> text encoder ---------+--> generator
```

Useful cases include preserving visual style, product identity, composition, or subject similarity.

## LoRA for image models

LoRA adapters can specialize a base image model without storing a complete duplicate of all base weights.

```text
base model + brand-style LoRA -> branded generation
base model + product LoRA     -> product-specific generation
```

Keep adapter identity/version in the generation record. "Same base model" does not mean "same behavior" when adapters differ.

## Prompt architecture for image generation

A useful prompt can separate semantic dimensions:

```text
SUBJECT: ceramic coffee cup on walnut desk
COMPOSITION: centered, close product shot, 3/4 angle
LIGHTING: soft window light from left
STYLE: premium ecommerce photography
BACKGROUND: warm neutral studio
CONSTRAINTS: no logo, no text, one cup only
```

Do not assume every provider interprets prompt syntax identically. The value is in explicit intent, not magic punctuation.

## TypeScript image-generation service

```ts
export interface ImageJobInput {
  tenantId: string
  prompt: string
  width: number
  height: number
  referenceAssetIds?: string[]
  maskAssetId?: string
}

export interface ImageJob {
  id: string
  state: 'queued' | 'running' | 'completed' | 'failed'
  outputAssetId?: string
  errorCode?: string
}

export interface ImageGenerator {
  createJob(input: ImageJobInput): Promise<ImageJob>
  getJob(id: string): Promise<ImageJob>
}
```

Application orchestration:

```ts
async function submitImageGeneration(input: ImageJobInput) {
  await authorizeTenant(input.tenantId)
  await enforceImageQuota(input.tenantId)
  await validateReferencedAssets(input)
  await moderateVisualPrompt(input.prompt)

  const job = await imageGenerator.createJob(input)
  await imageJobRepository.save(job)
  return job
}
```

The UI should poll or subscribe to job state instead of keeping an HTTP request open for long-running generations.

## Asynchronous architecture

```text
web / mobile client
       |
       v
POST /image-jobs
       |
       v
API -> DB -> queue -> media worker -> provider/model
                         |
                         v
                    object storage
                         |
                         v
                    job completed
                         |
             websocket / polling / webhook
                         |
                         v
                       client
```

Benefits:

- retries do not block the request server;
- generation can be rate-limited independently;
- expensive workloads can use dedicated workers;
- failed media does not disappear with a request timeout;
- job history is auditable.

## Safety and provenance

For production image systems consider:

- prompt/input moderation;
- generated-output moderation;
- consent and identity policies;
- private-reference-image handling;
- tenant isolation;
- asset retention and deletion;
- EXIF/metadata handling;
- provenance/content credentials where supported;
- abuse-rate monitoring.

Never rely on the generator itself to enforce application authorization.

## Evaluation

Create a fixed image-eval set with prompts representing real usage.

Score dimensions independently:

```text
prompt alignment
composition
text rendering, if required
identity preservation
edit-region correctness
protected-region preservation
visual artifacts
policy safety
latency
cost per accepted image
```

For editing, include **before/after region checks**. A beautiful image is still wrong if it changed the product logo or person's face when those regions were meant to remain fixed.

## Official references

- Diffusers pipelines: https://huggingface.co/docs/diffusers/api/pipelines/overview
- Diffusers schedulers: https://huggingface.co/docs/diffusers/using-diffusers/schedulers
- ControlNet pipelines: https://huggingface.co/docs/diffusers/main/en/api/pipelines/controlnet
- IP-Adapter: https://huggingface.co/docs/diffusers/main/api/loaders/ip_adapter
- LoRA loaders: https://huggingface.co/docs/diffusers/api/loaders/lora
- OpenAI image model catalog example: https://developers.openai.com/api/docs/models/gpt-image-2
