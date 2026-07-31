---
id: multimodal-generation
title: Multimodal Generative AI
---

# Multimodal Generative AI

Multimodal systems work across more than one representation: text, images, audio, video, documents, diagrams, UI screenshots, sensor data, or generated media.

The key engineering shift is that inputs are no longer just strings.

## Multimodal request model

```text
text ---------+
image --------+
audio --------+--> multimodal processor/model --> text / audio / image / action
video --------+
document -----+
```

A model may accept several modalities but produce only one. Capability must be checked per model rather than inferred from the word "multimodal."

## How multimodal inputs become model representations

A simplified architecture:

```text
text -> tokenizer ------------------+
                                     |
image -> image processor -> vision --+--> shared model / cross-attention -> output
                                     |
audio -> feature extractor ----------+
                                     |
video -> frame/video processor -------+
```

Current Transformers processors combine a tokenizer with modality-specific processors and can merge text, image, video, or audio inputs into one model input structure.

## Vision-language models

A vision-language model connects visual representations with language representations.

```text
image -> vision encoder -> visual features --+
                                             +--> language / multimodal model -> response
text --------------------> text features -----+
```

Typical tasks:

- image description;
- visual question answering;
- screenshot understanding;
- OCR-assisted reasoning;
- chart interpretation;
- product/image classification;
- visual grounding;
- document analysis.

## Multimodal generation versus multimodal understanding

These are different capabilities:

```text
image + question -> text answer          understanding
text prompt      -> image                generation
image + prompt   -> edited image         understanding + generation
speech + tools   -> spoken response      multimodal + agentic
```

A model that can understand images is not necessarily an image generator.

## Image input detail and preprocessing

Image quality can be lost before the model sees the content because of:

- aggressive resize;
- crop strategy;
- compression;
- wrong orientation;
- removing transparency;
- converting multi-page documents to poor screenshots.

Production pipeline:

```text
upload
  |
  +--> validate MIME / size
  +--> malware scan
  +--> orientation normalize
  +--> optional resize / tiling
  +--> preserve original securely
  |
  v
model-ready representation
```

Keep original assets separately from model-optimized derivatives.

## Document understanding

A document is not simply "an image."

```text
PDF
 |
 +--> text extraction
 +--> layout / page images
 +--> tables
 +--> metadata
 +--> OCR fallback
       |
       v
structured document representation
       |
       v
retrieval / multimodal reasoning
```

Use native text where available; OCR should be a fallback or complement rather than the default for digitally generated PDFs.

## Charts and diagrams

For charts, the model should not be trusted merely because it can "see" the image.

Better pipeline:

```text
chart image + question
       |
       +--> visual model interpretation
       +--> source data / structured values if available
                    |
                    v
               cross-check
```

When source data exists, use it. Visual interpretation is valuable for screenshots or unknown documents, but structured values are usually a stronger source of truth.

## Visual grounding

Grounding connects language to a region or object.

```text
"the red button"
      |
      v
visual grounding
      |
      v
bounding box / region / object id
```

Grounding supports:

- UI agents;
- image editing;
- robotic perception;
- moderation review;
- document extraction;
- region-specific explanations.

Coordinates from a model should be validated against the actual image dimensions and interface state before an action is executed.

## Multimodal RAG

RAG can retrieve more than text chunks.

```text
query
  |
  v
multimodal retriever
  |
  +--> text chunk
  +--> table
  +--> image
  +--> chart
  +--> video segment
       |
       v
context construction
       |
       v
multimodal model
```

Metadata becomes especially important:

```ts
export interface RetrievedAsset {
  id: string
  modality: 'text' | 'image' | 'table' | 'audio' | 'video'
  sourceId: string
  page?: number
  startSeconds?: number
  endSeconds?: number
  acl: string[]
}
```

Never drop access-control metadata when converting media to embeddings or derived representations.

## Multimodal embeddings

Some embedding spaces represent text and images in compatible geometry.

```text
"red running shoe" -> vector ----+
                                  +--> similarity search
shoe image ---------> vector -----+
```

Applications include:

- text-to-image search;
- duplicate/near-duplicate discovery;
- semantic asset libraries;
- recommendation;
- cross-modal retrieval.

Evaluation must use real user queries because "semantic similarity" is task-dependent.

## TypeScript multimodal message model

```ts
type InputPart =
  | { type: 'text'; text: string }
  | { type: 'image'; assetId: string }
  | { type: 'audio'; assetId: string }
  | { type: 'video'; assetId: string; startSeconds?: number; endSeconds?: number }

export interface MultimodalRequest {
  tenantId: string
  parts: InputPart[]
  task: 'describe' | 'extract' | 'answer' | 'generate' | 'edit'
}
```

Resolve assets server-side:

```ts
async function resolveRequest(input: MultimodalRequest) {
  const resolved = []

  for (const part of input.parts) {
    if (part.type === 'text') {
      resolved.push(part)
      continue
    }

    const asset = await assetStore.getAuthorized(input.tenantId, part.assetId)
    resolved.push({ ...part, asset })
  }

  return resolved
}
```

Do not accept arbitrary provider URLs from an LLM and fetch them with privileged network access.

## Context budgeting

Multimodal inputs consume context or compute differently from plain text. Build an explicit budget:

```text
request budget
  |
  +--> instructions
  +--> conversation
  +--> image inputs
  +--> audio/video segment
  +--> retrieved evidence
  +--> output allowance
```

For long videos/documents, use staged processing rather than dumping everything into one call.

## Long-video reasoning

A scalable approach:

```text
video
  |
  +--> scene detection / segmentation
  +--> audio transcript
  +--> sampled keyframes
  +--> clip-level summaries
       |
       v
searchable timeline index
       |
       v
question -> retrieve relevant segments -> multimodal reasoning
```

This is usually cheaper and more inspectable than sending the entire video for every question.

## UI and computer-use systems

A visual agent may reason over screenshots and propose actions.

```text
screenshot -> model -> proposed action -> policy check -> browser/device action
```

Never collapse those last two steps.

```text
model says: click "Delete workspace"
             |
             v
application policy: destructive action requires approval
             |
             v
human approval / deny
```

Visual understanding does not grant authority.

## Multimodal failure modes

- wrong image associated with the current message;
- stale screenshot after UI changed;
- incorrect page coordinates;
- OCR mistakes propagated as facts;
- chart labels hallucinated;
- audio/video segment boundaries wrong;
- private image retrieved for the wrong tenant;
- low-resolution preprocessing hides required evidence;
- model describes content outside the visible frame.

Record source identifiers so a trace shows exactly which media was sent to the model.

## Evaluation

Use modality-specific and cross-modal checks:

```text
image QA: answer correctness + region evidence
OCR: field-level precision/recall
chart QA: numerical correctness
visual grounding: box/region overlap
multimodal RAG: retrieval relevance + answer correctness
UI agent: action success + safety + recovery
video QA: temporal localization + answer correctness
```

Human review remains important for subjective visual/audio quality.

## Official references

- Transformers multimodal processing: https://huggingface.co/docs/transformers/multimodal_processing
- Diffusers pipeline catalog: https://huggingface.co/docs/diffusers/api/pipelines/overview
- OpenAI current model catalog for modality capability examples: https://developers.openai.com/api/docs/models
