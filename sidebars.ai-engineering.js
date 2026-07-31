/** AI Engineering-specific navigation layered over all existing handbook sidebars. */
const sidebars = require('./sidebars.react-native.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `ai-engineering/${id}`, label});

sidebars.aiEngineeringSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version-baseline', 'Version Baseline'),
    doc('00-start-here', 'Start Here'),
  ], {collapsed: false}),

  category('AI & LLM Foundations', [
    category('AI Basics', [
      doc('foundations/what-is-ai', 'What Is Artificial Intelligence?'),
      doc('foundations/ml-deep-learning-generative-ai', 'Machine Learning, Deep Learning & Generative AI'),
      doc('foundations/neural-networks', 'Neural Networks'),
      doc('foundations/vectors-matrices-tensors', 'Vectors, Matrices & Tensors'),
      doc('foundations/training-pretraining-posttraining', 'Training, Pretraining & Post-Training'),
      doc('foundations/foundation-models', 'Foundation Models'),
      doc('foundations/what-is-generative-ai', 'What Is Generative AI?'),
      doc('foundations/nlp-language-modeling', 'NLP & Language Modeling'),
    ], {collapsed: false}),
    category('LLM Basics', [
      doc('foundations/what-is-llm', 'What Is a Large Language Model?'),
      doc('foundations/model-parameters', 'Model Parameters, Weights & Model Size'),
      doc('foundations/what-is-a-token', 'What Is a Token?'),
      doc('foundations/tokenization', 'Tokenization'),
      doc('foundations/embeddings', 'Embeddings'),
      doc('foundations/transformers', 'Transformers'),
      doc('foundations/attention', 'Attention, Queries, Keys & Values'),
      doc('foundations/context-window', 'Context Window & Token Budget'),
      doc('foundations/prompt-context-memory', 'Prompt, Context, Conversation & Memory'),
    ], {collapsed: false}),
    category('Generation & Reliability', [
      doc('foundations/inference-generation', 'Inference & Autoregressive Generation'),
      doc('foundations/logits-softmax-probabilities', 'Logits, Softmax & Token Probabilities'),
      doc('foundations/sampling-temperature-top-p', 'Sampling, Temperature, Top-p & Top-k'),
      doc('foundations/reasoning-models', 'Reasoning Models & Reasoning Effort'),
      doc('foundations/hallucinations-grounding', 'Hallucinations, Grounding & Uncertainty'),
      doc('foundations/model-selection', 'Model Selection'),
    ]),
    category('Caching & Performance Basics', [
      doc('foundations/kv-cache', 'KV Cache'),
      doc('foundations/prompt-cache', 'Prompt Caching'),
      doc('foundations/response-cache', 'Response Caching'),
      doc('foundations/token-cost-latency', 'Tokens, Cost, Latency & Throughput'),
    ]),
  ], {collapsed: false}),

  category('Neural Network Training', [
    doc('zero-to-hero/neural-networks/forward-pass-loss', 'Forward Pass & Loss Functions'),
    doc('zero-to-hero/neural-networks/gradients-backprop', 'Gradients & Backpropagation'),
    doc('zero-to-hero/neural-networks/gradient-descent-optimizers', 'Gradient Descent & Optimizers'),
    doc('zero-to-hero/neural-networks/batches-epochs-learning-rate', 'Batches, Epochs & Learning Rate'),
    doc('zero-to-hero/neural-networks/train-validation-test', 'Training, Validation & Test Sets'),
    doc('zero-to-hero/neural-networks/overfitting-regularization', 'Overfitting & Regularization'),
    doc('zero-to-hero/neural-networks/training-loop', 'The Complete Training Loop'),
    doc('zero-to-hero/neural-networks/precision-hardware', 'Numerical Precision & AI Accelerators'),
  ]),

  category('Tokenizers & Chat Model Internals', [
    doc('zero-to-hero/tokenizers/vocabulary-special-tokens', 'Vocabulary, Token IDs & Special Tokens'),
    doc('zero-to-hero/tokenizers/bpe-wordpiece-unigram', 'BPE, WordPiece & Unigram Tokenization'),
    doc('zero-to-hero/tokenizers/padding-truncation-masks', 'Padding, Truncation & Attention Masks'),
    doc('zero-to-hero/tokenizers/chat-templates', 'Chat Templates & Control Tokens'),
    doc('zero-to-hero/tokenizers/tokenizer-training', 'Training & Evaluating a Tokenizer'),
    doc('zero-to-hero/tokenizers/token-efficiency', 'Token Efficiency, Cost & Multilingual Effects'),
  ]),

  category('Transformer Internals', [
    doc('zero-to-hero/transformers/transformer-block', 'Inside a Transformer Block'),
    doc('zero-to-hero/transformers/residuals-normalization', 'Residual Connections, LayerNorm & RMSNorm'),
    doc('zero-to-hero/transformers/mlp-activations', 'Feed-Forward Networks, GELU & SwiGLU'),
    doc('zero-to-hero/transformers/positional-encoding-rope', 'Positional Encoding & RoPE'),
    doc('zero-to-hero/transformers/mha-mqa-gqa', 'Multi-Head, Multi-Query & Grouped-Query Attention'),
    doc('zero-to-hero/transformers/causal-masking', 'Causal Masking & Autoregressive Attention'),
    doc('zero-to-hero/transformers/mixture-of-experts', 'Mixture of Experts'),
    doc('zero-to-hero/transformers/encoder-decoder-architectures', 'Encoder, Decoder & Encoder-Decoder Models'),
  ]),

  category('Language Modeling & Decoding', [
    doc('zero-to-hero/language-modeling/causal-objective', 'Causal Language Modeling Objective'),
    doc('zero-to-hero/language-modeling/cross-entropy-perplexity', 'Cross-Entropy, Log Likelihood & Perplexity'),
    doc('zero-to-hero/language-modeling/base-instruct-chat', 'Base, Instruct & Chat Models'),
    doc('zero-to-hero/language-modeling/decoding-strategies', 'Greedy, Sampling & Beam Decoding'),
    doc('zero-to-hero/language-modeling/logprobs-stop-controls', 'Logprobs, Stop Sequences & Repetition Controls'),
    doc('zero-to-hero/language-modeling/speculative-decoding', 'Speculative Decoding'),
  ]),

  category('Generative AI', [
    doc('generative-ai/overview', 'Foundations & Model Families'),
    doc('generative-ai/image-generation', 'Image Generation & Editing'),
    doc('generative-ai/audio-speech-generation', 'Audio, Speech & Realtime'),
    doc('generative-ai/video-generation', 'Video Generation & Temporal Systems'),
    doc('generative-ai/multimodal-generation', 'Multimodal Generative AI'),
    doc('generative-ai/fine-tuning-adaptation', 'Fine-Tuning, LoRA & Adaptation'),
    doc('generative-ai/synthetic-data-evaluation', 'Synthetic Data, Distillation & Evaluation'),
    doc('generative-ai/serving-optimization-safety', 'Serving, Optimization & Safety'),
    doc('generative-ai/advanced-generative-systems', 'Advanced & Emerging Generative Systems'),
  ]),

  category('Prompt Engineering', [
    category('Prompt Foundations', [
      doc('prompt-engineering/what-is-prompt-engineering', 'What Is Prompt Engineering?'),
      doc('prompt-engineering/prompt-anatomy', 'Prompt Anatomy'),
      doc('prompt-engineering/types-of-prompting', 'Types of Prompting'),
      doc('prompt-engineering/instruction-prompting', 'Instruction Prompting'),
      doc('prompt-engineering/context-prompting', 'Context Prompting'),
      doc('prompt-engineering/constraint-prompting', 'Constraint Prompting'),
      doc('prompt-engineering/role-prompting', 'Role & Persona Prompting'),
    ], {collapsed: false}),
    category('Examples & Demonstrations', [
      doc('prompt-engineering/zero-shot-prompting', 'Zero-Shot Prompting'),
      doc('prompt-engineering/one-shot-few-shot-prompting', 'One-Shot & Few-Shot Prompting'),
    ]),
    category('Complex Tasks', [
      doc('prompt-engineering/task-decomposition', 'Task Decomposition'),
      doc('prompt-engineering/prompt-chaining', 'Prompt Chaining'),
      doc('prompt-engineering/reasoning-model-prompting', 'Prompting Reasoning Models'),
      doc('prompt-engineering/critique-revision', 'Critique & Revision Prompting'),
    ]),
    category('Context, Modalities & Safety', [
      doc('prompt-engineering/long-context-prompting', 'Long-Context Prompting'),
      doc('prompt-engineering/multimodal-prompting', 'Multimodal Prompting'),
      doc('prompt-engineering/prompt-injection-defense', 'Prompt Injection & Defense'),
    ]),
    category('Evaluation & Delivery', [
      doc('prompt-engineering/prompt-evals-versioning', 'Prompt Evals, Versioning & Rollout'),
    ]),
  ], {collapsed: false}),

  category('Context Engineering', [
    doc('zero-to-hero/context-engineering/context-engineering-overview', 'What Is Context Engineering?'),
    doc('zero-to-hero/context-engineering/context-budgets-selection', 'Context Budgets & Selection'),
    doc('zero-to-hero/context-engineering/history-trimming', 'Conversation History & Trimming'),
    doc('zero-to-hero/context-engineering/compaction-compression', 'Context Compaction & Semantic Compression'),
    doc('zero-to-hero/context-engineering/memory-vs-context', 'Memory vs Context vs Application State'),
    doc('zero-to-hero/context-engineering/long-context-engineering', 'Long-Context Engineering'),
    doc('zero-to-hero/context-engineering/context-security-evals', 'Context Poisoning, Injection & Evaluation'),
  ]),

  category('LLM API Integration', [
    doc('zero-to-hero/llm-integration/llm-first-request', 'Your First Production LLM Request'),
    doc('zero-to-hero/llm-integration/request-response-lifecycle', 'Request, Response & Item Lifecycle'),
    doc('zero-to-hero/llm-integration/conversation-state', 'Stateless vs Stateful Conversations'),
    doc('zero-to-hero/llm-integration/llm-streaming', 'Streaming Responses & Event Handling'),
    doc('zero-to-hero/llm-integration/background-webhooks-batch', 'Background Runs, Webhooks & Batch Processing'),
    doc('zero-to-hero/llm-integration/realtime-llm-integration', 'Realtime LLM Integration'),
    doc('zero-to-hero/llm-integration/multimodal-llm-inputs', 'Images, PDFs, Audio & Video Inputs'),
    doc('zero-to-hero/llm-integration/llm-api-reliability', 'Rate Limits, Timeouts, Retries & Circuit Breakers'),
    doc('zero-to-hero/llm-integration/provider-abstraction', 'Provider Abstraction, Routing & Fallbacks'),
  ]),

  category('Multimodal Understanding', [
    doc('zero-to-hero/multimodal-understanding/multimodal-vision-models', 'Vision-Language Models & Image Understanding'),
    doc('zero-to-hero/multimodal-understanding/documents-ocr-layout', 'PDFs, OCR & Layout-Aware Documents'),
    doc('zero-to-hero/multimodal-understanding/charts-diagrams-understanding', 'Charts, Tables & Diagram Understanding'),
    doc('zero-to-hero/multimodal-understanding/audio-understanding', 'Speech & Audio Understanding'),
    doc('zero-to-hero/multimodal-understanding/video-understanding', 'Video Understanding & Temporal Reasoning'),
    doc('zero-to-hero/multimodal-understanding/multimodal-security-evals', 'Multimodal Security & Evaluation'),
  ]),

  category('Structured Outputs, Tools & Streaming', [
    doc('chapters/chapters-041-060', 'Structured Outputs, Tools & Streaming'),
  ]),

  category('Training & Post-Training', [
    doc('zero-to-hero/training/training-data-curation', 'Training Data Curation, Cleaning & Deduplication'),
    doc('zero-to-hero/training/pretraining-pipeline', 'LLM Pretraining Pipeline'),
    doc('zero-to-hero/training/supervised-fine-tuning', 'Supervised Fine-Tuning'),
    doc('zero-to-hero/training/preference-dpo', 'Preference Data & Direct Preference Optimization'),
    doc('zero-to-hero/training/rlhf-rlaif', 'RLHF, RLAIF & Reward Models'),
    doc('zero-to-hero/training/reinforcement-fine-tuning', 'Reinforcement Fine-Tuning & Grader Design'),
    doc('zero-to-hero/training/lora-qlora-internals', 'LoRA & QLoRA Internals'),
    doc('zero-to-hero/training/eval-contamination-lineage', 'Training Evaluation, Contamination & Lineage'),
  ]),

  category('Embeddings & Vector Search', [
    doc('chapters/chapters-061-080', 'Embeddings, Semantic Search & Vector Databases'),
  ]),
  category('RAG', [
    doc('chapters/chapters-081-100', 'RAG Foundations'),
    doc('chapters/chapters-101-110', 'Advanced RAG & Evaluation'),
  ]),
  category('Advanced RAG Architectures', [
    doc('zero-to-hero/advanced-rag/late-interaction-colbert', 'Late Interaction & ColBERT-Style Retrieval'),
    doc('zero-to-hero/advanced-rag/multi-vector-retrieval', 'Multi-Vector Retrieval'),
    doc('zero-to-hero/advanced-rag/retrieval-fusion', 'Retrieval Fusion & Reciprocal Rank Fusion'),
    doc('zero-to-hero/advanced-rag/graph-rag', 'GraphRAG & Knowledge-Graph Retrieval'),
    doc('zero-to-hero/advanced-rag/sql-code-rag', 'SQL RAG & Code RAG'),
    doc('zero-to-hero/advanced-rag/multimodal-rag-advanced', 'Multimodal RAG'),
    doc('zero-to-hero/advanced-rag/adaptive-corrective-self-rag', 'Adaptive, Corrective & Self-Reflective RAG'),
    doc('zero-to-hero/advanced-rag/rag-index-migration', 'Embedding & Index Migration'),
  ]),

  category('Self-Hosted LLMs & Inference', [
    doc('zero-to-hero/inference/hosted-vs-self-hosted', 'Hosted APIs vs Self-Hosted Models'),
    doc('zero-to-hero/inference/huggingface-transformers-inference', 'Local Inference with Hugging Face Transformers'),
    doc('zero-to-hero/inference/llama-cpp-gguf', 'llama.cpp, GGUF & Edge Inference'),
    doc('zero-to-hero/inference/vllm-serving', 'vLLM Serving Architecture'),
    doc('zero-to-hero/inference/prefill-vs-decode', 'Prefill, Decode, TTFT & TPOT'),
    doc('zero-to-hero/inference/pagedattention-continuous-batching', 'PagedAttention & Continuous Batching'),
    doc('zero-to-hero/inference/inference-quantization', 'Quantization & Low-Precision Inference'),
    doc('zero-to-hero/inference/distributed-parallelism', 'Distributed Inference Parallelism'),
    doc('zero-to-hero/inference/inference-capacity-observability', 'Capacity Planning & Inference Observability'),
  ]),

  category('LangChain TypeScript', [
    doc('chapters/chapters-111-130', 'LangChain TypeScript'),
  ]),
  category('LangGraph TypeScript', [
    doc('chapters/chapters-131-145', 'State, Nodes & Control Flow'),
    doc('chapters/chapters-146-155', 'Durability, Persistence & Human-in-the-Loop'),
  ]),

  category('OpenAI Agents SDK TypeScript', [
    doc('zero-to-hero/openai-agents-sdk/openai-agents-sdk-overview', 'Agents SDK Fundamentals'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-tools-output', 'Function Tools & Structured Output'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-guardrails', 'Input, Output & Tool Guardrails'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-handoffs', 'Handoffs, Agents as Tools & Managers'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-sessions-hitl', 'Sessions, Memory & Human-in-the-Loop'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-sandbox', 'Sandbox Agents'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-tracing-evals', 'Agent Tracing, Results & Evals'),
    doc('zero-to-hero/openai-agents-sdk/agents-sdk-realtime-mcp', 'Realtime Agents & MCP Integration'),
  ]),

  category('Agents & Multi-Agent Systems', [
    doc('chapters/chapters-156-170', 'Agents, Multi-Agent Systems, Memory & Human-in-the-Loop'),
  ]),

  category('MCP, OAuth & Permissions', [
    doc('zero-to-hero/mcp/mcp-architecture-current', 'MCP Architecture: Host, Client & Server'),
    doc('zero-to-hero/mcp/mcp-stateless-capabilities', 'Stateless Requests & Per-Request Capabilities'),
    doc('zero-to-hero/mcp/mcp-server-discovery', 'Server Discovery & Protocol Negotiation'),
    doc('zero-to-hero/mcp/mcp-transports-subscriptions', 'stdio, Streamable HTTP & Subscriptions'),
    doc('zero-to-hero/mcp/mcp-tools-current', 'MCP Tools'),
    doc('zero-to-hero/mcp/mcp-resources-current', 'MCP Resources & Cache Hints'),
    doc('zero-to-hero/mcp/mcp-prompts-current', 'MCP Prompts'),
    doc('zero-to-hero/mcp/mcp-elicitation-mrtr', 'Elicitation & Multi Round-Trip Requests'),
    doc('zero-to-hero/mcp/mcp-tasks-extension', 'Tasks Extension'),
    doc('zero-to-hero/mcp/mcp-skills-apps', 'Skills over MCP & MCP Apps'),
    doc('zero-to-hero/mcp/mcp-oauth-security-current', 'OAuth, Consent & Authorization Security'),
    doc('zero-to-hero/mcp/mcp-deprecations-migration', 'Migration from the Previous MCP Architecture'),
  ]),

  category('Agent-to-Agent Interoperability', [
    doc('zero-to-hero/a2a/a2a-overview', 'Agent-to-Agent Protocol Fundamentals'),
    doc('zero-to-hero/a2a/a2a-agent-cards', 'Agent Cards, Skills & Discovery'),
    doc('zero-to-hero/a2a/a2a-tasks-messages-artifacts', 'Messages, Tasks, Parts & Artifacts'),
    doc('zero-to-hero/a2a/a2a-streaming-async', 'Streaming, Push Notifications & Long-Running Tasks'),
    doc('zero-to-hero/a2a/mcp-vs-a2a', 'MCP vs Agent-to-Agent Interoperability'),
    doc('zero-to-hero/a2a/a2a-security-multitenancy', 'Authentication, Authorization & Multi-Tenancy'),
  ]),

  category('Evals, Observability & Security', [
    doc('chapters/chapters-181-190', 'Evals, Observability & Security'),
  ]),

  category('Privacy & Governance', [
    doc('zero-to-hero/privacy/ai-data-flow-mapping', 'AI Data-Flow Mapping & Trust Boundaries'),
    doc('zero-to-hero/privacy/retention-zdr', 'Data Retention & Zero Data Retention'),
    doc('zero-to-hero/privacy/files-caches-state-privacy', 'Privacy of Files, Caches & Conversation State'),
    doc('zero-to-hero/privacy/tenant-isolation-regions', 'Tenant Isolation, Residency & Regional Processing'),
    doc('zero-to-hero/privacy/pii-secrets-redaction', 'PII, Secrets & Redaction'),
    doc('zero-to-hero/privacy/model-supply-chain-governance', 'Model Supply Chain, Governance & Auditability'),
  ]),

  category('Production & Staff Engineering', [
    doc('chapters/chapters-191-200', 'Production Architecture & Staff Engineering'),
  ]),
  category('Projects', [
    doc('projects/projects-01-05', 'Foundation Projects'),
    doc('projects/projects-06-10', 'Applied Projects'),
    doc('projects/projects-11-15', 'Production Projects'),
    doc('projects/capstone-production-multi-tenant-agent-platform', 'Multi-Tenant AI Agent Platform Capstone'),
  ]),
  category('Exercises', [
    doc('exercises/exercises-beginner-001-060', 'Beginner'),
    doc('exercises/exercises-intermediate-061-120', 'Intermediate'),
    doc('exercises/exercises-advanced-121-180', 'Advanced'),
    doc('exercises/exercises-senior-181-240', 'Senior'),
    doc('exercises/exercises-production-241-300', 'Production'),
  ]),
  category('Interview Question Bank', [
    doc('interview-question-bank/interview-questions-beginner-001-080', 'Beginner'),
    doc('interview-question-bank/interview-questions-intermediate-081-160', 'Intermediate'),
    doc('interview-question-bank/interview-questions-advanced-161-240', 'Advanced'),
    doc('interview-question-bank/interview-questions-senior-241-320', 'Senior'),
    doc('interview-question-bank/interview-questions-staff-321-400', 'Staff'),
  ]),
  category('Interview Mastery', [
    doc('mock-interview-practice/mock-interviews-01-15', 'Mock Interview Rounds'),
    doc('interview-mastery/live-coding-exercises', 'Live Coding Exercises'),
    doc('interview-mastery/production-incidents', 'Production Incident Drills'),
  ]),
  category('Reference & Coverage', [
    doc('reference/official-docs-coverage', 'Official Docs Coverage'),
    doc('reference/zero-to-hero-gap-closure', 'Zero-to-Hero Gap Closure'),
    doc('reference/generative-ai-coverage', 'Generative AI Coverage'),
    doc('reference/openai-api-coverage', 'OpenAI API Coverage'),
    doc('reference/rag-coverage', 'RAG Coverage'),
    doc('reference/langchain-coverage', 'LangChain Coverage'),
    doc('reference/langgraph-coverage', 'LangGraph Coverage'),
    doc('reference/agents-coverage', 'Agents Coverage'),
    doc('reference/mcp-coverage', 'MCP Coverage'),
    doc('reference/security-coverage', 'Security Coverage'),
    doc('reference/evals-observability-coverage', 'Evals & Observability Coverage'),
    doc('reference/production-ai-coverage', 'Production AI Coverage'),
    doc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

module.exports = sidebars;
