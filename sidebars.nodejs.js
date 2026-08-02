const category = (label, items, linkId) => ({
  type: 'category',
  label,
  items,
  collapsed: true,
  link: {type: 'doc', id: `nodejs/${linkId}`},
});

const doc = (id, label) => ({type: 'doc', id: `nodejs/${id}`, label});

const focusedNodejsCategories = [
  category('Start Here: Decisions', [
      doc('version', 'Version and Platform Support'),
      doc('start-here/nodejs-vs-browser', 'Node.js vs Browser JavaScript'),
      doc('start-here/nodejs-vs-deno-vs-bun', 'Node.js vs Deno vs Bun'),
      doc('start-here/use-cases-and-decision-guide', 'Use Cases and Decision Guide'),
  ], 'version'),
  category('Runtime and Process', [
      doc('runtime/nodejs-architecture', 'Node.js Architecture'),
      doc('runtime/runtime-lifecycle-process-signals', 'Runtime Lifecycle, Process and Signals'),
      doc('runtime/cli-repl-stdio-environment', 'CLI, REPL, Standard Streams and Environment'),
  ], 'runtime/nodejs-architecture'),
  category('Event Loop and Async Internals', [
      doc('event-loop/event-loop-phases', 'Event Loop Phases'),
      doc('event-loop/microtasks-nexttick-timers', 'Microtasks, nextTick and Timers'),
      doc('event-loop/libuv-thread-pool', 'libuv Thread Pool'),
      doc('async/promises-and-async-await', 'Promises and async/await'),
      doc('event-loop/async-context-cancellation-concurrency', 'Async Context, Cancellation and Concurrency'),
  ], 'event-loop/event-loop-phases'),
  category('Modules and Package Management', [
      doc('modules/commonjs-and-es-modules', 'CommonJS and ES Modules'),
      doc('modules/package-resolution-exports-imports', 'Package Resolution, Exports and Imports'),
      doc('modules/npm-workspaces-publishing-supply-chain', 'npm, Workspaces and Supply Chain'),
  ], 'modules/commonjs-and-es-modules'),
  category('TypeScript with Node.js', [
      doc('typescript/typescript-project-setup', 'TypeScript Project Setup'),
      doc('typescript/nodenext-esm-and-native-type-stripping', 'NodeNext, ESM and Native Type Stripping'),
      doc('typescript/runtime-validation-and-api-contracts', 'Runtime Validation and API Contracts'),
  ], 'typescript/typescript-project-setup'),
  category('Core Node.js APIs', [
      doc('core-apis/files-path-url-process-os-util', 'Files, Paths, URLs, Process, OS and Util'),
      doc('core-apis/events-buffer-stream-crypto', 'Events, Buffers, Streams and Crypto'),
      doc('core-apis/http-networking-compression-readline', 'HTTP, Networking, Compression and Readline'),
      doc('core-apis/workers-processes-diagnostics-test-vm-v8-module', 'Workers, Processes, Diagnostics, Tests, VM and V8'),
  ], 'core-apis/files-path-url-process-os-util'),
  category('Binary Data, Streams, Files and Events', [
      doc('buffers/binary-data-and-encoding', 'Buffers, Binary Data and Encoding'),
      doc('streams/stream-backpressure', 'Stream Backpressure'),
      doc('filesystem/secure-file-processing', 'Secure File Processing'),
      doc('events/event-driven-design', 'Event-Driven Design'),
  ], 'buffers/binary-data-and-encoding'),
  category('HTTP and Networking', [
      doc('http/http-server', 'HTTP Server with Node.js Core'),
      doc('http/networking-tls-http2-realtime', 'Networking, TLS, HTTP/2 and Realtime'),
  ], 'http/http-server'),
  category('Frameworks', [
      doc('frameworks/express-production-guide', 'Production Express Guide'),
      doc('frameworks/fastify-production-guide', 'Production Fastify Guide'),
      doc('frameworks/nestjs-enterprise-guide', 'Production NestJS Guide'),
      doc('frameworks/framework-decision-guide', 'Express vs Fastify vs NestJS'),
  ], 'frameworks/express-production-guide'),
  category('API Design', [
      doc('api-design/production-api-design', 'Production API Design'),
  ], 'api-design/production-api-design'),
  category('Databases and Data Access', [
      doc('databases/postgresql-mongodb-redis', 'PostgreSQL, MongoDB and Redis'),
      doc('databases/data-access-patterns', 'Data Access Patterns and Transactions'),
  ], 'databases/postgresql-mongodb-redis'),
  category('Authentication and Security', [
      doc('security/security-overview', 'Security Overview'),
      doc('security/authentication-authorization-oauth', 'Authentication, Authorization, OAuth and OIDC'),
      doc('security/nodejs-threat-catalog', 'Node.js Threat Catalog'),
  ], 'security/security-overview'),
  category('Errors and Reliability', [
      doc('reliability/errors-timeouts-retries-circuit-breakers', 'Errors, Timeouts, Retries and Circuits'),
      doc('reliability/health-graceful-degradation-process-crash', 'Health, Degradation and Crash Strategy'),
  ], 'reliability/errors-timeouts-retries-circuit-breakers'),
  category('Workers and Parallelism', [
      doc('parallelism/workers-child-processes-cluster', 'Workers, Child Processes and Cluster'),
  ], 'parallelism/workers-child-processes-cluster'),
  category('Queues and Caching', [
      doc('queues/background-jobs-message-brokers', 'Background Jobs and Message Brokers'),
      doc('caching/distributed-caching', 'Distributed Caching'),
  ], 'queues/background-jobs-message-brokers'),
  category('Testing and Debugging', [
      doc('testing/testing-overview', 'Testing Overview'),
      doc('debugging/diagnostics-and-production-debugging', 'Diagnostics and Production Debugging'),
  ], 'testing/testing-overview'),
  category('Observability and Performance', [
      doc('observability/logging-metrics-tracing', 'Logging, Metrics and Tracing'),
      doc('performance/performance-overview', 'Performance Overview'),
      doc('performance/memory-gc-profiling-capacity', 'Memory, GC, Profiling and Capacity'),
  ], 'observability/logging-metrics-tracing'),
  category('Configuration and Deployment', [
      doc('configuration/configuration-and-secrets', 'Configuration and Secrets'),
      doc('deployment/deployment-overview', 'Deployment Overview'),
      doc('deployment/docker-kubernetes-ci-cd', 'Docker, Kubernetes and CI/CD'),
  ], 'configuration/configuration-and-secrets'),
  category('Architecture and Distributed Systems', [
      doc('architecture/modular-monolith', 'Modular Monolith'),
      doc('architecture/clean-hexagonal-vertical-slices', 'Clean, Hexagonal and Vertical Slices'),
      doc('architecture/microservices-serverless-bff', 'Microservices, Serverless and BFF'),
      doc('distributed/distributed-systems', 'Distributed Systems'),
      doc('realtime/realtime-systems', 'Realtime Systems'),
  ], 'architecture/modular-monolith'),
  category('Production Integrations and Internals', [
      doc('integrations/production-integrations', 'Production Integrations'),
      doc('internals/v8-libuv-node-api-permission-model', 'V8, libuv, Node-API and Permissions'),
      doc('migrations/upgrades-and-migrations', 'Upgrades and Migrations'),
  ], 'integrations/production-integrations'),
  category('Focused Interview Mastery', [
      doc('interviews/interview-mastery', 'Interview Mastery'),
  ], 'interviews/interview-mastery'),
  category('Required Capstone Architectures', [
      doc('capstones/node-core-rest-api', 'REST API with Node.js Core'),
      doc('capstones/production-api', 'Production Express API'),
      doc('capstones/fastify-api-platform', 'Fastify API Platform'),
      doc('capstones/auth-service', 'Authentication and Authorization Service'),
      doc('capstones/ecommerce-backend', 'E-Commerce Backend'),
      doc('capstones/multi-tenant-saas', 'Multi-Tenant SaaS Backend'),
      doc('capstones/realtime-collaboration', 'Realtime Collaboration System'),
      doc('capstones/job-workflow-platform', 'Job and Workflow Platform'),
      doc('capstones/file-media-service', 'File and Media Service'),
      doc('capstones/ai-powered-backend', 'AI-Powered Backend'),
  ], 'capstones/node-core-rest-api'),
  category('2026 Coverage', [
      doc('reference/specification-coverage-2026', 'Specification Coverage'),
  ], 'reference/specification-coverage-2026'),
];

function appendNodejsSidebar(existingSidebar = []) {
  const projectsIndex = existingSidebar.findIndex(
    (item) => item && typeof item === 'object' && item.type === 'category' && item.label === 'Projects',
  );

  if (projectsIndex === -1) return [...existingSidebar, ...focusedNodejsCategories];

  return [
    ...existingSidebar.slice(0, projectsIndex),
    ...focusedNodejsCategories,
    ...existingSidebar.slice(projectsIndex),
  ];
}

module.exports = {appendNodejsSidebar, focusedNodejsCategories};