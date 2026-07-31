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
    doc('chapters/chapters-001-020', 'AI & LLM Foundations'),
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
  category('Prompting & Model Interaction', [
    doc('chapters/chapters-021-040', 'Prompt Engineering & Model APIs'),
  ]),
  category('Structured Outputs, Tools & Streaming', [
    doc('chapters/chapters-041-060', 'Structured Outputs, Tools & Streaming'),
  ]),
  category('Embeddings & Vector Search', [
    doc('chapters/chapters-061-080', 'Embeddings, Semantic Search & Vector Databases'),
  ]),
  category('RAG', [
    doc('chapters/chapters-081-100', 'RAG Foundations'),
    doc('chapters/chapters-101-110', 'Advanced RAG & Evaluation'),
  ]),
  category('LangChain TypeScript', [
    doc('chapters/chapters-111-130', 'LangChain TypeScript'),
  ]),
  category('LangGraph TypeScript', [
    doc('chapters/chapters-131-145', 'State, Nodes & Control Flow'),
    doc('chapters/chapters-146-155', 'Durability, Persistence & Human-in-the-Loop'),
  ]),
  category('Agents & Multi-Agent Systems', [
    doc('chapters/chapters-156-170', 'Agents, Multi-Agent Systems, Memory & Human-in-the-Loop'),
  ]),
  category('MCP, OAuth & Permissions', [
    doc('chapters/chapters-171-180', 'MCP, OAuth & Permissions'),
  ]),
  category('Evals, Observability & Security', [
    doc('chapters/chapters-181-190', 'Evals, Observability & Security'),
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
