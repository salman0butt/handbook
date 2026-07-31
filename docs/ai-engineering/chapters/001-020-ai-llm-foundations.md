---
id: chapters-001-020
title: 001–020 — AI & LLM Foundations
---

# 001 — AI, Machine Learning, Deep Learning & Generative AI

**Problem.** “AI” is too broad to guide architecture. A rules engine, classifier, vision model, and LLM have different failure modes.

**Mental model.** AI is the umbrella; machine learning learns patterns from data; deep learning uses layered neural networks; generative AI models a distribution over outputs such as text, images, or audio. LLMs are generative models specialized around token sequences.

**Production lens.** Choose the narrowest technique that solves the task. A deterministic parser can outperform an LLM on stable syntax because it is cheaper, faster, and predictable. Use generative models where ambiguity or open-ended language makes that flexibility valuable.

**Interview lens.** Explain the problem class and trade-offs, not just definitions.

# 002 — What an LLM Actually Does

**Problem.** Developers often treat an LLM as a database or reasoning oracle.

**Mental model.** At generation time a language model repeatedly estimates a probability distribution over the next token conditioned on the tokens currently in context.

```text
prompt → model → logits → probabilities → choose token
                         ↑                 ↓
                         └──── append token
```

The model can encode impressive learned representations and perform multi-step tasks, but the interface is still probabilistic generation. It does not automatically know current private data, execute tools, or guarantee factuality.

**Production lens.** Add retrieval for changing knowledge, tools for external actions, schemas for machine-readable boundaries, and evals for quality.

# 003 — Neural Networks: The Minimum Useful Model

**Problem.** You need enough neural-network intuition to understand transformers without becoming a research mathematician.

**Mental model.** A neural network applies parameterized transformations to inputs. Training adjusts weights to reduce a loss function over examples. Deep networks compose many transformations, learning internal representations useful for prediction.

```text
input → layer → activation → layer → ... → output
             weights updated during training
```

**Production lens.** Parameters are learned state, not application memory. Sending a new chat message does not permanently update model weights. Distinguish inference-time context from training/fine-tuning.

# 004 — Transformer Architecture

**Problem.** Why can modern LLMs connect information across long sequences efficiently?

**Mental model.** A transformer maps token representations through repeated blocks containing attention and feed-forward transformations, with normalization/residual connections around them. Attention lets token positions condition on other relevant positions.

```text
tokens → embeddings + position
              ↓
      transformer block × N
       attention + MLP
              ↓
          final states
              ↓
            logits
```

**Production lens.** You rarely implement blocks yourself, but transformer properties explain context limits, attention cost, tokenization effects, and why prompt position/structure can affect results.

# 005 — Attention

**Problem.** A token should not treat every earlier token as equally relevant.

**Mental model.** Attention computes compatibility between a query representation and key representations, then uses normalized weights to combine value representations. Multi-head attention learns several relationship patterns in parallel.

**How it works.** Conceptually: `score(Q,K) → softmax → weighted values`. The exact implementation may use optimized kernels, sparse strategies, or architectural variations.

**Production lens.** “The model attends to X” is an intuition, not an authorization guarantee. Important constraints can still be ignored. Enforce invariants outside the model.

# 006 — Self-Attention, Causal Masking & Context

**Problem.** During next-token generation, a model must not read future output tokens.

**Mental model.** Self-attention derives Q/K/V from the same sequence. Autoregressive language models use causal masking so a position can attend only to allowed earlier/current positions.

**Production lens.** The complete usable context includes instructions, messages, tool definitions/results, retrieved documents, and prior generated tokens. Every token consumes a finite context budget and can influence later output.

# 007 — Positional Information

**Problem.** Pure attention does not inherently know sequence order.

**Mental model.** Transformers introduce positional information so “dog bites man” differs from “man bites dog.” Architectures may use learned positions, sinusoidal encodings, rotary position embeddings, or other methods.

**Production lens.** Long-context capability is not simply “maximum token count.” Quality can vary with distance and ordering. Retrieval and context construction still matter even when the advertised context window is large.

# 008 — Tokens & Tokenization

**Problem.** APIs charge and limit work in tokens, not characters.

**Mental model.** A tokenizer maps text to token IDs from a vocabulary. Tokens may be whole words, word pieces, punctuation, whitespace patterns, or bytes depending on the tokenizer.

```text
text → tokenizer → token IDs → model
model token IDs → decoder → text
```

**Production lens.** Never assume “one word equals one token.” Different languages, code, JSON, and unusual strings tokenize differently. Measure usage with provider/tokenizer tooling when cost or context limits matter.

# 009 — Vocabulary & Special Tokens

**Problem.** Models need a finite discrete interface to raw text and protocol structure.

**Mental model.** The vocabulary maps token IDs to token pieces. Special tokens may represent boundaries or protocol/control concepts. Chat APIs usually abstract provider-specific formatting.

**Production lens.** Avoid manually reproducing hidden chat templates unless a local/open model deployment explicitly requires it. Use the supported API so role/tool formatting stays compatible with the model family.

# 010 — Embeddings as Learned Representations

**Problem.** Applications need a numeric representation for semantic comparison.

**Mental model.** An embedding is a dense vector whose geometry captures learned relationships useful for a task. Similar concepts can have nearby vectors even when words differ.

```text
"reset my password" ─┐
                      ├─ nearby
"can't log in" ──────┘

"invoice tax code" ───────── farther
```

**Production lens.** Embeddings are model-version-dependent data. Store model/version metadata so re-embedding and index migration are possible.

# 011 — Parameters, Weights & Model Size

**Problem.** “Bigger model” is often used as a proxy for “better product.”

**Mental model.** Parameters are learned numeric values transformed during training. Parameter count influences capacity and infrastructure cost but is not a direct product-quality metric across different architectures/training regimes.

**Production lens.** Select models using task evals, latency, cost, modality, context, reliability, and operational constraints. A smaller model may dominate for extraction/routing while a larger reasoning model handles hard cases.

# 012 — Pretraining

**Problem.** Where does general language capability come from?

**Mental model.** During pretraining, models learn from very large datasets using objectives such as next-token prediction. This builds broad representations and language/task capabilities.

**Production lens.** Pretraining knowledge is neither guaranteed current nor guaranteed correct. Treat it as model behavior, not your source of truth for time-sensitive/private business data.

# 013 — Fine-Tuning, Instruction Tuning & Preference Optimization

**Problem.** Base next-token models are not automatically optimized for following user instructions.

**Mental model.** Supervised/instruction tuning teaches desired response patterns. Preference methods optimize toward preferred outputs using human or synthetic comparisons; RLHF is one family of approaches, while direct preference optimization and related methods offer alternatives.

**Production lens.** Fine-tuning changes behavior/style/task specialization; it is not the default solution for frequently changing factual knowledge. Compare prompting, RAG, tools, and fine-tuning against the actual failure.

# 014 — Inference

**Problem.** Training and serving are fundamentally different workloads.

**Mental model.** Inference runs the trained model to produce outputs. For autoregressive generation, prompt processing is followed by iterative decoding of output tokens. Providers optimize this with batching, caching, parallelism, quantization, and specialized hardware.

**Production lens.** Track time-to-first-token, output tokens/second, total latency, queueing, and provider errors separately. Streaming improves perceived latency but does not necessarily reduce compute.

# 015 — Logits, Probabilities & Sampling

**Problem.** Why can the same prompt produce different answers?

**Mental model.** The model outputs logits for candidate tokens. A normalization step yields a distribution, then a decoding/sampling strategy selects the next token.

**Production lens.** Even low-randomness generation is not a database constraint. Use deterministic parsers/validators and evals when exactness matters.

# 016 — Temperature & Top-p

**Problem.** Sampling controls are frequently misunderstood as “creativity knobs.”

**Mental model.** Temperature reshapes relative token probabilities; top-p (nucleus sampling) restricts selection to a probability mass. Provider/model support differs, especially for reasoning models.

**Production lens.** Do not cargo-cult settings. Establish a model-specific baseline, then evaluate changes on the task dataset. For extraction, schema enforcement matters more than hoping a temperature value makes output valid.

# 017 — Context Windows

**Problem.** Every model call has a finite working set.

**Mental model.** The context window contains the input plus generated/tool interaction tokens allowed by the API/model. Longer context increases the amount of possible evidence but also cost, latency, and distraction.

**Production lens.** Use retrieval, summarization, selective memory, and context budgets. Handle overflow explicitly. Do not silently truncate security-critical instructions or tool results.

# 018 — Roles, Instructions & Message Hierarchy

**Problem.** Applications combine platform instructions, product policy, user requests, tool outputs, and retrieved data.

**Mental model.** Modern model APIs distinguish instruction/message roles and other structured inputs. Higher-priority application instructions define behavior; untrusted user/retrieved/tool content remains data, even when it contains instructions.

**Production lens.** Instruction hierarchy reduces ambiguity but does not replace policy enforcement. Treat indirect prompt injection as hostile data crossing a trust boundary.

# 019 — Reasoning Models

**Problem.** Some tasks need more deliberate internal computation than straightforward generation.

**Mental model.** Reasoning-oriented models may allocate internal reasoning effort before producing the answer and can perform better on planning, math, coding, and multi-step tasks. APIs can expose reasoning controls or summaries without exposing private hidden reasoning.

**Production lens.** Route reasoning models to tasks where eval gains justify higher latency/cost. Design explanations around verifiable evidence and outputs rather than depending on hidden chain-of-thought.

# 020 — Multimodal Models & Model Selection

**Problem.** Production requests can include text, images, audio, documents, and generated media.

**Mental model.** Multimodal models map multiple input/output modalities into compatible learned representations and generation pipelines. Capability varies by model and API.

**Production lens.** Choose by evaluated task quality, supported modalities, latency, cost, context, privacy, region, rate limits, structured/tool support, and failure behavior. Encapsulate providers so business policy survives model changes.

```text
request → classify needs → candidate models → eval/cost/latency policy → selected model
```

**Interview lens.** The strongest answer names decision criteria and fallback behavior rather than a favorite model.
