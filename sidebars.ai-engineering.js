/** AI Engineering-specific navigation layered over all existing handbook sidebars. */
const sidebars = require('./sidebars.react-native.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `ai-engineering/${id}`, label});

sidebars.aiEngineeringSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version-baseline', 'Version Baseline'),
    doc('00-start-here', '00 · Start Here'),
  ], {collapsed: false}),
  category('AI & LLM Foundations', [
    doc('chapters/001-020-ai-llm-foundations', '001–020 · AI & LLM Foundations'),
  ]),
  category('Prompting & Model Interaction', [
    doc('chapters/021-040-prompting-model-interaction', '021–040 · Prompt Engineering & Model APIs'),
  ]),
  category('Structured Outputs, Tools & Streaming', [
    doc('chapters/041-060-structured-outputs-tools-streaming', '041–060 · Structured Outputs, Tools & Streaming'),
  ]),
  category('Embeddings & Vector Search', [
    doc('chapters/061-080-embeddings-vector-search', '061–080 · Embeddings, Semantic Search & Vector DBs'),
  ]),
  category('RAG', [
    doc('chapters/081-100-rag-foundations', '081–100 · RAG Foundations'),
    doc('chapters/101-110-advanced-rag-evaluation', '101–110 · Advanced RAG & Evaluation'),
  ]),
  category('LangChain TypeScript', [
    doc('chapters/111-130-langchain-typescript', '111–130 · LangChain TypeScript'),
  ]),
  category('LangGraph TypeScript', [
    doc('chapters/131-145-langgraph-state-graphs', '131–145 · State, Nodes & Control Flow'),
    doc('chapters/146-155-langgraph-durable-hitl', '146–155 · Durability, Persistence & HITL'),
  ]),
  category('Agents & Multi-Agent Systems', [
    doc('chapters/156-170-agents-multi-agent-memory-hitl', '156–170 · Agents, Multi-Agent, Memory & HITL'),
  ]),
  category('MCP, OAuth & Permissions', [
    doc('chapters/171-180-mcp-tools-oauth', '171–180 · MCP, OAuth & Permissions'),
  ]),
  category('Evals, Observability & Security', [
    doc('chapters/181-190-evals-observability-security', '181–190 · Evals, Observability & Security'),
  ]),
  category('Production & Staff Engineering', [
    doc('chapters/191-200-production-staff-engineering', '191–200 · Production Architecture & Staff Engineering'),
  ]),
  category('Projects', [
    doc('projects/projects-01-05', 'Projects 01–05'),
    doc('projects/projects-06-10', 'Projects 06–10'),
    doc('projects/projects-11-15', 'Projects 11–15'),
    doc('projects/capstone-production-multi-tenant-agent-platform', 'Capstone · Multi-Tenant AI Agent Platform'),
  ]),
  category('Exercises', [
    doc('exercises/exercises-beginner-001-060', '001–060 · Beginner'),
    doc('exercises/exercises-intermediate-061-120', '061–120 · Intermediate'),
    doc('exercises/exercises-advanced-121-180', '121–180 · Advanced'),
    doc('exercises/exercises-senior-181-240', '181–240 · Senior'),
    doc('exercises/exercises-production-241-300', '241–300 · Production'),
  ]),
  category('Interview Question Bank', [
    doc('interview-question-bank/interview-questions-beginner-001-080', 'Q001–Q080 · Beginner'),
    doc('interview-question-bank/interview-questions-intermediate-081-160', 'Q081–Q160 · Intermediate'),
    doc('interview-question-bank/interview-questions-advanced-161-240', 'Q161–Q240 · Advanced'),
    doc('interview-question-bank/interview-questions-senior-241-320', 'Q241–Q320 · Senior'),
    doc('interview-question-bank/interview-questions-staff-321-400', 'Q321–Q400 · Staff'),
  ]),
  category('Interview Mastery', [
    doc('mock-interview-practice/mock-interviews-01-15', '15 Mock Interview Rounds'),
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
