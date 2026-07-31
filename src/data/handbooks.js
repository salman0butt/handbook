export const handbookData = {
  react: {
    name: 'React', icon: '⚛️', status: 'Complete', intro: '/docs/react/intro',
    description: 'A production-focused React handbook covering fundamentals, state architecture, React 19+, performance, internals, testing, projects, and senior interview reasoning.',
    highlights: [
      {label: 'Core', title: 'Components, state & hooks', description: 'Build the right mental models for rendering, state, effects, refs, reducers, context, and custom hooks.', href: '/docs/react/state/state-snapshots-and-queues'},
      {label: 'Modern React', title: 'React 19+, Suspense & concurrency', description: 'Understand modern async UI, transitions, Actions, Suspense, Server Components, and the React Compiler.', href: '/docs/react/modern-react/actions-and-async-transitions'},
      {label: 'Senior', title: 'Architecture, performance & internals', description: 'Design scalable component APIs, diagnose rendering cost, and reason about reconciliation and Fiber.', href: '/docs/react/architecture/component-and-state-architecture'},
    ],
    studyPath: ['Foundations', 'State & effects', 'Modern React', 'Testing & performance', 'Architecture', 'Interview mastery'],
  },
  nextjs: {
    name: 'Next.js', icon: '▲', status: 'Complete', intro: '/docs/nextjs/intro',
    description: 'An App Router handbook for routing, Server and Client Components, caching, data, mutations, security, deployment, architecture, internals, and interviews.',
    highlights: [
      {label: 'App Router', title: 'Routing & rendering', description: 'Learn layouts, navigation, RSC boundaries, streaming, Suspense, and route architecture.', href: '/docs/nextjs/app-router-and-layouts/route-tree-pages-and-layouts'},
      {label: 'Data', title: 'Fetching, caching & mutations', description: 'Reason about server data ownership, cache components, revalidation, forms, and Server Functions.', href: '/docs/nextjs/data-fetching/async-server-components-and-data-ownership'},
      {label: 'Production', title: 'Security, operations & architecture', description: 'Ship secure, observable, scalable Next.js systems with deliberate production boundaries.', href: '/docs/nextjs/architecture-and-large-applications/architecture-mental-model-boundaries-ownership-and-dependency-direction'},
    ],
    studyPath: ['App Router', 'Server/client boundaries', 'Data & caching', 'Security & testing', 'Production', 'System design'],
  },
  typescript: {
    name: 'TypeScript', icon: 'TS', status: 'Complete', intro: '/docs/typescript/intro',
    description: 'From JavaScript developer to staff-level TypeScript reasoning: inference, assignability, generics, modules, TSConfig, libraries, architecture, compiler mental models, and interviews.',
    highlights: [
      {label: 'Type system', title: 'Inference, narrowing & generics', description: 'Understand how the compiler reasons about values, relationships, control flow, constraints, and transformations.', href: '/docs/typescript/11-16-generics-and-type-manipulation'},
      {label: 'Production', title: 'Modules, TSConfig & libraries', description: 'Configure real applications and libraries across Node, bundlers, declarations, monorepos, and publishing.', href: '/docs/typescript/26-31-modules-tsconfig-monorepos-declarations-libraries-js'},
      {label: 'Senior', title: 'Architecture, compiler & soundness', description: 'Reason about domain modelling, API design, compiler behaviour, performance, limits, and organisation-wide governance.', href: '/docs/typescript/40-49-backends-architecture-domain-type-level-compiler-performance-debugging'},
    ],
    studyPath: ['Foundations', 'Type manipulation', 'Compatibility & inference', 'Modules & libraries', 'Architecture & compiler', 'Interview mastery'],
  },
  javascript: {
    name: 'JavaScript', icon: 'JS', status: 'Complete', intro: '/docs/javascript/intro',
    description: 'From ECMAScript fundamentals and runtime semantics to browser engineering, performance, security, architecture, specification reasoning, projects, and interview mastery.',
    highlights: [
      {label: 'Understand', title: 'Language foundations & runtime semantics', description: 'Master bindings, coercion, functions, closures, this, objects, prototypes, built-ins, iteration, modules, and specification-level mental models.', href: '/docs/javascript/01-04-fundamentals-types-coercion'},
      {label: 'Engineer', title: 'Async, browser APIs & production debugging', description: 'Reason about Promises, async/await, Jobs versus host tasks, DOM/events/fetch, security, memory, performance, and debugging.', href: '/docs/javascript/31-35-errors-promises-async-event-loop'},
      {label: 'Master', title: 'Architecture, projects & 384 interview questions', description: 'Progress through library/framework authoring and staff architecture, then build the project ladder and practice senior JavaScript interviews.', href: '/docs/javascript/interview-question-bank/overview'},
    ],
    studyPath: ['Start Here', 'Language foundations', 'Async & modules', 'Browser JavaScript', 'Internals & performance', 'Architecture', 'Projects & interviews'],
  },
  nodejs: {
    name: 'Node.js', icon: '⬢', status: 'Complete', intro: '/docs/nodejs/intro',
    description: 'A production Node.js handbook from runtime internals and async I/O to APIs, databases, security, distributed systems, platform engineering, projects, and interview mastery.',
    highlights: [
      {label: 'Runtime', title: 'Event loop, libuv & streams', description: 'Reason about the main JavaScript thread, async I/O, scheduling, backpressure, workers, memory, networking, and Node internals.', href: '/docs/nodejs/event-loop'},
      {label: 'Build', title: 'Production project ladder', description: 'Apply the runtime model in REST APIs, streaming processors, queues, WebSockets, workers, SDKs, services, modular monoliths, and the capstone platform.', href: '/docs/nodejs/projects/production-rest-api'},
      {label: 'Master', title: '320 interview questions & mock rounds', description: 'Practice runtime mechanisms, backend architecture, security, incidents, migrations, distributed systems, live coding, and staff-level reasoning.', href: '/docs/nodejs/interview-question-bank/overview'},
    ],
    studyPath: ['Runtime foundations', 'Async I/O & networking', 'Backend data & security', 'Production engineering', 'Distributed architecture', 'Projects & interview mastery'],
  },
  postgresql: {
    name: 'SQL & PostgreSQL', icon: 'PG', status: 'In Review', intro: '/docs/postgresql/intro',
    description: 'A production-focused SQL and PostgreSQL handbook from relational fundamentals and query design through MVCC, indexing, execution plans, WAL, recovery, replication, operations, internals, and staff-level database architecture.',
    highlights: [
      {label: 'SQL & modelling', title: 'Querying, constraints & schema design', description: 'Build strong relational models, write expressive SQL, enforce invariants, and choose data types and constraints deliberately.', href: '/docs/postgresql/24-27-select-filter-sort-pagination'},
      {label: 'Performance', title: 'Indexes, EXPLAIN, MVCC & storage', description: 'Reason about index design, planner choices, transaction visibility, vacuum, buffers, locks, and production query performance.', href: '/docs/postgresql/68-74-query-planning-explain-performance'},
      {label: 'Production', title: 'WAL, recovery, HA & architecture', description: 'Operate PostgreSQL through backups, recovery, replication, security, observability, failure handling, scaling, and architecture trade-offs.', href: '/docs/postgresql/82-90-wal-recovery-replication-ha'},
    ],
    studyPath: ['SQL foundations', 'Data modelling', 'Indexes & performance', 'Transactions & MVCC', 'Operations & reliability', 'Internals & architecture', 'Projects & interviews'],
  },
  reactNative: {
    name: 'React Native', icon: 'RN', status: 'Complete', intro: '/docs/react-native/intro',
    description: 'A Community CLI-first React Native handbook for native Android and iOS engineering, from components and mobile UX through Metro, Hermes, Fabric, TurboModules, Codegen, native integration, performance, releases, projects, and staff-level architecture.',
    highlights: [
      {label: 'Build native apps', title: 'Android + iOS with Community CLI', description: 'Own the generated native projects, navigation, data, permissions, device APIs, Gradle, Xcode, CocoaPods, signing, and store release workflows.', href: '/docs/react-native/chapters/chapters-121-140'},
      {label: 'Understand internals', title: 'Hermes, Fabric, JSI & TurboModules', description: 'Reason from React through the renderer, Shadow Tree, Yoga, Codegen and New Architecture native boundaries instead of treating mobile as a black box.', href: '/docs/react-native/chapters/chapters-141-160'},
      {label: 'Production mastery', title: 'Performance, architecture & interviews', description: 'Diagnose real failures, build production projects, practice 300 exercises and 400 interview questions, and design platforms for many teams.', href: '/docs/react-native/chapters/chapters-181-200'},
    ],
    studyPath: ['Community CLI & fundamentals', 'Mobile UI & state', 'Android & iOS', 'Metro & New Architecture', 'Production & release', 'Projects & interview mastery'],
  },
  databases: {
    name: 'Databases', icon: 'DB', intro: '/docs/databases/intro',
    description: 'Data modelling, SQL, indexes, transactions, query optimisation, storage trade-offs, and distributed data concepts.',
    highlights: [
      {title: 'Data modelling', description: 'Design schemas around invariants, access patterns, relationships, and ownership.'},
      {title: 'Queries & indexes', description: 'Understand execution cost, indexes, plans, and practical performance tuning.'},
      {title: 'Transactions & scale', description: 'Reason about consistency, concurrency, replication, partitioning, and failure.'},
    ],
    studyPath: ['Modelling', 'SQL', 'Indexes', 'Transactions', 'Distributed data'],
  },
  'system-design': {
    name: 'System Design', icon: 'SD', intro: '/docs/system-design/intro',
    description: 'Scalability, caching, queues, storage, distributed systems, reliability, trade-offs, and system-design interviews.',
    highlights: [
      {title: 'Core building blocks', description: 'Load balancing, caching, queues, storage, APIs, and asynchronous workflows.'},
      {title: 'Distributed reasoning', description: 'Partitioning, replication, consistency, failure modes, and reliability.'},
      {title: 'Design interviews', description: 'Turn vague requirements into explicit constraints, architecture, trade-offs, and evolution.'},
    ],
    studyPath: ['Requirements', 'Building blocks', 'Data & consistency', 'Reliability', 'Design practice'],
  },
  devops: {
    name: 'DevOps', icon: '∞', intro: '/docs/devops/intro',
    description: 'Docker, CI/CD, infrastructure, deployments, observability, reliability, and repeatable software delivery.',
    highlights: [
      {title: 'Build & CI', description: 'Create repeatable builds, automated quality gates, and dependable pipelines.'},
      {title: 'Infrastructure & deployment', description: 'Containers, environments, configuration, rollout strategies, and rollback.'},
      {title: 'Observability & reliability', description: 'Logs, metrics, traces, alerting, incidents, and operational feedback loops.'},
    ],
    studyPath: ['Build', 'CI/CD', 'Containers', 'Deployment', 'Observability'],
  },
  wordpress: {
    name: 'WordPress', icon: 'WP', intro: '/docs/wordpress/intro',
    description: 'WordPress core concepts, plugin and theme engineering, Gutenberg, performance, security, and maintainable architecture.',
    highlights: [
      {title: 'WordPress foundations', description: 'Understand hooks, data, templates, plugins, themes, and request lifecycle.'},
      {title: 'Modern editor development', description: 'Build with Gutenberg, blocks, React-based editor APIs, and extensibility.'},
      {title: 'Production engineering', description: 'Security, performance, migrations, compatibility, and operational maintenance.'},
    ],
    studyPath: ['Core', 'Plugins & themes', 'Blocks', 'Security', 'Performance'],
  },
  'ai-engineering': {
    name: 'AI Engineering', icon: 'AI', intro: '/docs/ai-engineering/intro',
    description: 'LLMs, prompting, retrieval, agents, tool use, evaluation, observability, safety, and production AI architecture.',
    highlights: [
      {title: 'LLM application foundations', description: 'Prompts, structured outputs, model behaviour, context, and application boundaries.'},
      {title: 'RAG & agents', description: 'Retrieval, embeddings, tools, workflows, state, MCP, and agent architecture.'},
      {title: 'Production AI', description: 'Evaluation, observability, permissions, failure handling, security, cost, and reliability.'},
    ],
    studyPath: ['LLM foundations', 'RAG', 'Agents & tools', 'Evals', 'Production architecture'],
  },
};
