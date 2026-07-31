---
id: generative-ai-coverage
title: Generative AI Coverage Audit
---

# Generative AI Coverage Audit

This audit maps the dedicated Generative AI track to the topics a production AI engineer should understand beyond LLM-only application development.

## Core generative model families

| Topic | Coverage |
|---|---|
| Autoregressive generation | `generative-ai/overview` + LLM foundations |
| Variational autoencoders / latent representations | `generative-ai/overview`, `generative-ai/image-generation` |
| GANs and adversarial training mental model | `generative-ai/overview` |
| Diffusion models | `generative-ai/overview`, `generative-ai/image-generation` |
| Diffusion Transformers / DiT | `generative-ai/advanced-generative-systems` |
| Flow matching / rectified-flow mental model | `generative-ai/overview`, `generative-ai/advanced-generative-systems` |
| Conditioning / guidance | `generative-ai/overview`, image/audio/video guides |
| Schedulers / sampling steps | `generative-ai/image-generation`, `generative-ai/serving-optimization-safety` |
| Seeds and reproducibility | `generative-ai/image-generation` |

## Image generation and editing

| Topic | Coverage |
|---|---|
| Text-to-image | `generative-ai/image-generation` |
| Latent diffusion | `generative-ai/image-generation` |
| Image-to-image | `generative-ai/image-generation` |
| Inpainting | `generative-ai/image-generation` |
| Outpainting | `generative-ai/image-generation` |
| Negative conditioning | `generative-ai/image-generation` |
| ControlNet-style structural control | `generative-ai/image-generation` |
| IP-Adapter-style reference control | `generative-ai/image-generation` |
| Image LoRA | `generative-ai/image-generation`, `generative-ai/fine-tuning-adaptation` |
| Async image job architecture | `generative-ai/image-generation` |
| Image quality and edit-fidelity evals | `generative-ai/image-generation`, `generative-ai/synthetic-data-evaluation` |

## Audio and speech

| Topic | Coverage |
|---|---|
| Text-to-speech | `generative-ai/audio-speech-generation` |
| Audio token mental model | `generative-ai/audio-speech-generation` |
| Latent/diffusion audio | `generative-ai/audio-speech-generation` |
| Speech-to-speech | `generative-ai/audio-speech-generation` |
| Realtime audio sessions | `generative-ai/audio-speech-generation` |
| VAD / turn detection | `generative-ai/audio-speech-generation` |
| Barge-in / cancellation | `generative-ai/audio-speech-generation` |
| Voice cloning consent and safety | `generative-ai/audio-speech-generation` |
| Music / sound-effect generation | `generative-ai/audio-speech-generation` |
| Audio evals | `generative-ai/audio-speech-generation`, `generative-ai/synthetic-data-evaluation` |

## Video generation

| Topic | Coverage |
|---|---|
| Text-to-video | `generative-ai/video-generation` |
| Image-to-video | `generative-ai/video-generation` |
| Video-to-video / editing | `generative-ai/video-generation` |
| Temporal consistency | `generative-ai/video-generation` |
| Identity continuity | `generative-ai/video-generation` |
| Camera and motion prompting | `generative-ai/video-generation` |
| Storyboards / shot generation | `generative-ai/video-generation` |
| Audio/video composition boundary | `generative-ai/video-generation` |
| Async jobs / retries / idempotency | `generative-ai/video-generation` |
| Video evaluation | `generative-ai/video-generation`, `generative-ai/synthetic-data-evaluation` |

## Multimodal AI

| Topic | Coverage |
|---|---|
| Multimodal processors | `generative-ai/multimodal-generation` |
| Vision-language models | `generative-ai/multimodal-generation` |
| Understanding vs generation | `generative-ai/multimodal-generation` |
| Document multimodality | `generative-ai/multimodal-generation` |
| Charts and diagrams | `generative-ai/multimodal-generation` |
| Visual grounding | `generative-ai/multimodal-generation` |
| Multimodal RAG | `generative-ai/multimodal-generation` |
| Multimodal embeddings | `generative-ai/multimodal-generation` |
| Long-video reasoning | `generative-ai/multimodal-generation` |
| UI/computer-use safety boundary | `generative-ai/multimodal-generation` |

## Adaptation and training

| Topic | Coverage |
|---|---|
| Full fine-tuning | `generative-ai/fine-tuning-adaptation` |
| SFT | `generative-ai/fine-tuning-adaptation` |
| Preference optimization | `generative-ai/fine-tuning-adaptation` |
| PEFT | `generative-ai/fine-tuning-adaptation` |
| LoRA | `generative-ai/fine-tuning-adaptation` |
| QLoRA | `generative-ai/fine-tuning-adaptation` |
| Prompt/soft-prompt tuning | `generative-ai/fine-tuning-adaptation` |
| DreamBooth-style subject adaptation | `generative-ai/fine-tuning-adaptation` |
| Adapter registry / compatibility | `generative-ai/fine-tuning-adaptation` |
| Catastrophic forgetting | `generative-ai/fine-tuning-adaptation` |
| Data lineage / leakage | `generative-ai/fine-tuning-adaptation` |

## Synthetic data and evaluation

| Topic | Coverage |
|---|---|
| Synthetic training examples | `generative-ai/synthetic-data-evaluation` |
| Seeded scenario generation | `generative-ai/synthetic-data-evaluation` |
| Distillation | `generative-ai/synthetic-data-evaluation`, serving guide |
| Self-instruction / bootstrapping | `generative-ai/synthetic-data-evaluation` |
| Dataset contamination | `generative-ai/synthetic-data-evaluation` |
| Provenance | `generative-ai/synthetic-data-evaluation` |
| Judge-model bias | `generative-ai/synthetic-data-evaluation` |
| Pairwise evaluation | `generative-ai/synthetic-data-evaluation` |
| Text/image/audio/video eval dimensions | `generative-ai/synthetic-data-evaluation` |
| Cost per accepted generation | `generative-ai/synthetic-data-evaluation` |

## Serving and optimization

| Topic | Coverage |
|---|---|
| Hosted vs self-hosted | `generative-ai/serving-optimization-safety` |
| Model routing | `generative-ai/serving-optimization-safety` |
| Quantization | `generative-ai/serving-optimization-safety` |
| Distillation | `generative-ai/serving-optimization-safety` |
| Batching / continuous batching | `generative-ai/serving-optimization-safety` |
| KV cache / prompt caching | `generative-ai/serving-optimization-safety` |
| Media inference optimization | `generative-ai/serving-optimization-safety` |
| GPU memory / cold starts | `generative-ai/serving-optimization-safety` |
| Backpressure / retries / fallbacks | `generative-ai/serving-optimization-safety` |
| Cost and observability | `generative-ai/serving-optimization-safety` |

## Safety and governance

| Topic | Coverage |
|---|---|
| Input/output moderation | `generative-ai/serving-optimization-safety` |
| Prompt injection across modalities | `generative-ai/serving-optimization-safety` |
| Likeness / impersonation | image, audio, video, serving guides |
| Voice cloning consent | audio guide |
| Private reference assets | image, multimodal, serving guides |
| Provenance / content credentials concept | image/video/serving guides |
| Tenant isolation | adaptation, multimodal, serving guides |
| Release / rollback | adaptation and serving guides |

## Emerging modalities

| Topic | Coverage |
|---|---|
| 3D generation | `generative-ai/advanced-generative-systems` |
| World models | `generative-ai/advanced-generative-systems` |
| Generative simulation | `generative-ai/advanced-generative-systems` |
| Generative design | `generative-ai/advanced-generative-systems` |
| Scientific generation | `generative-ai/advanced-generative-systems` |
| Code generation validation pattern | `generative-ai/advanced-generative-systems` |
| Multi-model media workflows | `generative-ai/advanced-generative-systems` |
| Creative asset lineage | `generative-ai/advanced-generative-systems` |

## Official documentation baseline

The expansion was reviewed against current documentation on July 31, 2026, including:

- Hugging Face Diffusers pipeline, scheduler, adapter, image/video/audio and DiT documentation;
- Hugging Face PEFT for LoRA and parameter-efficient adaptation;
- Hugging Face Transformers multimodal processing and quantization documentation;
- OpenAI current model catalog for modern image/audio/realtime capability examples.

Provider-specific examples are used to illustrate current capabilities; the handbook architecture remains provider-neutral.
