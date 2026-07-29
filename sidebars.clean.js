/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const legacySidebars = require('./sidebars.js');

const stripNumberPrefix = (label) =>
  label.replace(/^\d+(?:[A-F])?(?:\s*[–-]\s*\d+)?\s*·\s*/, '');

const typescriptDocLabels = {
  'typescript/01-05-foundations-to-unions': 'Foundations → Unions & Intersections',
  'typescript/06-10-narrowing-functions-safety-literals': 'Narrowing → Literals / as const / satisfies',
  'typescript/11-16-generics-and-type-manipulation': 'Generics & Type Manipulation',
  'typescript/17-25-classes-compatibility-inference-nullability-functions': 'Classes, Compatibility, Variance, Inference & Advanced Functions',
  'typescript/26-31-modules-tsconfig-monorepos-declarations-libraries-js': 'Modules, TSConfig, Monorepos, Declarations & Libraries',
  'typescript/32-39-runtime-validation-errors-async-decorators-jsx-react-node': 'Runtime Validation, Errors, Async, Decorators, JSX, React & Node',
  'typescript/40-49-backends-architecture-domain-type-level-compiler-performance-debugging': 'Backends, Architecture, Domain, Type-Level, Compiler, Performance & Debugging',
  'typescript/50-59-testing-linting-build-security-production-migration-patterns-staff': 'Testing, Linting, Build, Security, Production, Migration & Staff Architecture',
};

const cleanItem = (item) => {
  if (typeof item === 'string') {
    const label = typescriptDocLabels[item];
    return label ? {type: 'doc', id: item, label} : item;
  }
  if (!item || typeof item !== 'object') return item;

  if (item.type === 'category') {
    return {
      ...item,
      label: stripNumberPrefix(item.label),
      items: item.items.map(cleanItem),
    };
  }

  return item;
};

const cleanItems = (items) => items.map(cleanItem);
const handbookRoot = legacySidebars.handbookSidebar;

const reactItems = handbookRoot[0].items;
const nextjsItems = handbookRoot[1].items;
const typescriptItems = handbookRoot[2].items;

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const nodeDoc = (id, label) => ({type: 'doc', id: `nodejs/${id}`, label});

const nodejsItems = [
  category('Start Here', [
    nodeDoc('intro', 'Introduction'),
    nodeDoc('version-baseline', 'Current Release & LTS Baseline'),
    nodeDoc('roadmap', 'Learning Roadmap'),
    nodeDoc('00-start-here', 'Prerequisites & Runtime Mental Model'),
  ], {collapsed: false}),
  nodeDoc('01-foundations', 'Foundations'),
  nodeDoc('02-process-runtime-globals', 'Runtime & Process'),
  nodeDoc('03-modules-esm-commonjs', 'Modules — ESM & CommonJS'),
  nodeDoc('04-npm-package-management', 'npm & Package Management'),
  nodeDoc('05-event-loop', 'Event Loop'),
  nodeDoc('06-async-io-libuv', 'Async I/O & libuv'),
  nodeDoc('07-callbacks-promises-async-await', 'Promises & async/await'),
  nodeDoc('08-timers-scheduling', 'Timers & Scheduling'),
  nodeDoc('09-buffers-binary-data', 'Buffers & Binary Data'),
  nodeDoc('10-streams', 'Streams'),
  nodeDoc('11-file-system', 'File System'),
  nodeDoc('12-path-url-filesystem-semantics', 'Path & URL'),
  nodeDoc('13-events-eventemitter', 'Events & EventEmitter'),
  nodeDoc('14-http-fundamentals', 'HTTP'),
  nodeDoc('15-https-http2-tls', 'HTTPS / HTTP2 / TLS'),
  nodeDoc('16-fetch-modern-web-apis', 'Fetch & Web APIs'),
  nodeDoc('17-tcp-udp-networking', 'TCP, UDP & Networking'),
  nodeDoc('18-dns', 'DNS'),
  nodeDoc('19-child-processes', 'Child Processes'),
  nodeDoc('20-worker-threads', 'Worker Threads'),
  nodeDoc('21-processes-cluster-parallelism', 'Processes, Cluster & Parallelism'),
  nodeDoc('22-memory-management', 'Memory Management'),
  nodeDoc('23-v8-mental-models', 'V8 Mental Models'),
  nodeDoc('24-error-handling', 'Error Handling'),
  nodeDoc('25-logging', 'Logging'),
  nodeDoc('26-configuration-environment', 'Configuration & Environment'),
  nodeDoc('27-runtime-validation', 'Runtime Validation'),
  nodeDoc('28-rest-api-engineering', 'REST API Engineering'),
  nodeDoc('29-express-integration', 'Express'),
  nodeDoc('30-fastify-integration', 'Fastify'),
  nodeDoc('31-nestjs-integration', 'NestJS'),
  nodeDoc('32-databases', 'Databases'),
  nodeDoc('33-postgresql-integration', 'PostgreSQL'),
  nodeDoc('34-mongodb-integration', 'MongoDB'),
  nodeDoc('35-redis-caching', 'Redis & Caching'),
  nodeDoc('36-queues-background-jobs', 'Queues & Background Jobs'),
  nodeDoc('37-messaging-event-driven', 'Messaging & Event-Driven Architecture'),
  nodeDoc('38-websockets-real-time', 'WebSockets & Real-Time Systems'),
  nodeDoc('39-authentication', 'Authentication'),
  nodeDoc('40-authorization', 'Authorization'),
  nodeDoc('41-security', 'Security'),
  nodeDoc('42-cryptography', 'Cryptography'),
  nodeDoc('43-testing-fundamentals', 'Testing Fundamentals'),
  nodeDoc('44-node-test-runner', 'Node.js Test Runner'),
  nodeDoc('45-api-testing', 'API Testing'),
  nodeDoc('46-typescript-with-node', 'TypeScript Integration'),
  nodeDoc('47-cli-applications', 'CLI Applications'),
  nodeDoc('48-diagnostics', 'Diagnostics'),
  nodeDoc('49-performance', 'Performance'),
  nodeDoc('50-observability', 'Observability'),
  nodeDoc('51-graceful-shutdown', 'Graceful Shutdown'),
  nodeDoc('52-resilience', 'Resilience'),
  nodeDoc('53-concurrency-control', 'Concurrency Control'),
  nodeDoc('54-distributed-systems', 'Distributed Systems'),
  nodeDoc('55-api-architecture', 'API Architecture'),
  nodeDoc('56-domain-modeling', 'Domain Modeling'),
  nodeDoc('57-microservices', 'Microservices'),
  nodeDoc('58-modular-monoliths', 'Modular Monolith'),
  nodeDoc('59-serverless-node', 'Serverless Node.js'),
  nodeDoc('60-containers-docker', 'Containers & Docker'),
  nodeDoc('61-kubernetes-integration', 'Kubernetes'),
  nodeDoc('62-ci-cd', 'CI/CD'),
  nodeDoc('63-production-operations', 'Production Operations'),
  nodeDoc('64-node-internals', 'Node.js Internals'),
  nodeDoc('65-native-addons-node-api', 'Native Addons & Node-API'),
  nodeDoc('66-webassembly', 'WebAssembly'),
  nodeDoc('67-permissions-runtime-hardening', 'Permissions & Runtime Hardening'),
  nodeDoc('68-supply-chain-security', 'Dependency & Supply-Chain Security'),
  nodeDoc('69-scaling-node', 'Scaling Node.js'),
  nodeDoc('70-load-testing', 'Load Testing'),
  nodeDoc('71-production-debugging', 'Production Debugging'),
  nodeDoc('72-common-failure-modes', 'Common Failure Modes'),
  nodeDoc('73-anti-patterns', 'Anti-Patterns'),
  nodeDoc('74-senior-backend-patterns', 'Senior Backend Design Patterns'),
  nodeDoc('75-staff-level-architecture', 'Staff-Level Architecture'),
  category('Projects', [
    nodeDoc('projects/01-production-rest-api', 'Production REST API'),
    nodeDoc('projects/02-streaming-file-processor', 'Streaming File Processor'),
    nodeDoc('projects/03-background-job-system', 'Background Job System'),
    nodeDoc('projects/04-realtime-websocket-platform', 'Real-Time WebSocket Platform'),
    nodeDoc('projects/05-worker-thread-cpu-service', 'Worker Thread CPU Service'),
    nodeDoc('projects/06-cli-tool', 'CLI Tool'),
    nodeDoc('projects/07-node-sdk-library', 'Node.js SDK / Library'),
    nodeDoc('projects/08-microservice-system', 'Microservice System'),
    nodeDoc('projects/09-modular-monolith', 'Modular Monolith Project'),
    nodeDoc('projects/10-large-node-platform', 'Large Node Platform'),
    nodeDoc('projects/11-capstone-production-platform', 'Capstone — Production Node.js Platform'),
  ]),
  category('Interview Mastery', [
    nodeDoc('interview-mastery/00-overview', 'Overview & Progression'),
    nodeDoc('interview-mastery/01-runtime-event-loop-async', 'Runtime, Event Loop & Async'),
    nodeDoc('interview-mastery/02-streams-networking-performance', 'Streams, Networking & Performance'),
    nodeDoc('interview-mastery/03-security-architecture-distributed', 'Security, Architecture & Distributed Systems'),
    nodeDoc('interview-mastery/04-incidents-migrations-behavioral', 'Incidents, Migrations & Behavioural'),
  ]),
  category('Interview Question Bank', [
    nodeDoc('interview-question-bank/00-overview', '320-Question Overview'),
    nodeDoc('interview-question-bank/01-core-runtime-modules-async', 'Q001–Q064 — Core Runtime, Modules & Async'),
    nodeDoc('interview-question-bank/02-streams-files-network-parallel', 'Q065–Q128 — Streams, Files, Networking & Parallelism'),
    nodeDoc('interview-question-bank/03-backend-data-security', 'Q129–Q192 — Backend, Data, Auth & Security'),
    nodeDoc('interview-question-bank/04-testing-production-runtime', 'Q193–Q256 — Testing, Production & Runtime Hardening'),
    nodeDoc('interview-question-bank/05-architecture-senior-system-design', 'Q257–Q320 — Architecture, Senior Reasoning & System Design'),
  ]),
  category('Mock Interview Practice', [
    nodeDoc('mock-interview-practice/00-overview', 'Overview & Scoring'),
    nodeDoc('mock-interview-practice/01-screens-backend-rounds', 'Screen, Backend, Senior & Full-Stack Rounds'),
    nodeDoc('mock-interview-practice/02-runtime-security-performance-rounds', 'Runtime, Streams, Performance & Security Rounds'),
    nodeDoc('mock-interview-practice/03-architecture-incident-specialized-rounds', 'Architecture, Distributed, Incident & Specialized Rounds'),
  ]),
  category('Reference & Coverage', [
    nodeDoc('reference/api-coverage', 'API & Handbook Coverage'),
    nodeDoc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

const generated = (dirName) => [{type: 'autogenerated', dirName}];

module.exports = {
  reactSidebar: cleanItems(reactItems),
  nextjsSidebar: cleanItems(nextjsItems),
  typescriptSidebar: cleanItems(typescriptItems),
  javascriptSidebar: generated('javascript'),
  nodejsSidebar: cleanItems(nodejsItems),
  databasesSidebar: generated('databases'),
  systemDesignSidebar: generated('system-design'),
  devopsSidebar: generated('devops'),
  wordpressSidebar: generated('wordpress'),
  aiEngineeringSidebar: generated('ai-engineering'),
};
