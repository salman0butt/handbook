/** JavaScript-specific navigation layered over the shared cleaned sidebars. */
const sidebars = require('./sidebars.clean.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `javascript/${id}`, label});

sidebars.javascriptSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version', 'Version and Platform Support'),
    doc('version-baseline', 'Detailed ECMAScript 2026 Baseline'),
    doc('roadmap', 'Learning Roadmap'),
    doc('00-start-here', 'How to Use the Handbook'),
  ], {collapsed: false}),

  category('Programming Foundations', [
    doc('fundamentals/variables-and-values', 'Variables and Values'),
    doc('fundamentals/operators-and-expressions', 'Operators and Expressions'),
    doc('fundamentals/control-flow', 'Control Flow'),
  ]),
  category('Values and Types', [
    doc('types/type-system', 'JavaScript Type System'),
  ]),
  category('Functions, Scope and this', [
    doc('functions/functions', 'Functions'),
    doc('scope/scope-and-closures', 'Scope and Closures'),
    doc('this/this-call-apply-bind', 'this, call, apply and bind'),
  ]),
  category('Objects, Prototypes and Classes', [
    doc('objects/objects', 'Objects'),
    doc('prototypes/prototypes-and-inheritance', 'Prototypes and Inheritance'),
    doc('classes/classes', 'Classes'),
  ]),
  category('Collections and Built-ins', [
    doc('arrays/arrays-and-collections', 'Arrays and Collections'),
    doc('built-ins/strings-numbers-dates-regexp', 'Strings, Numbers, Dates and Regular Expressions'),
  ]),
  category('Iteration', [
    doc('iteration/iterators-and-generators', 'Iterators and Generators'),
  ]),
  category('Errors and Reliability', [
    doc('errors/error-handling', 'Error Handling'),
  ]),
  category('Asynchronous JavaScript', [
    doc('async/promises-and-async-await', 'Promises and Async/Await'),
    doc('async/concurrency-cancellation-streams', 'Concurrency, Cancellation and Streams'),
    doc('event-loop/event-loop', 'Event Loop and Scheduling'),
  ]),
  category('Modules and Packages', [
    doc('modules/es-modules', 'ES Modules and Package Management'),
  ]),
  category('Browser JavaScript', [
    doc('dom/dom-fundamentals', 'DOM Fundamentals'),
    doc('browser/browser-apis', 'Browser APIs'),
    doc('events/event-driven-design', 'Events and Event-Driven Design'),
  ]),
  category('Programming Paradigms', [
    doc('paradigms/functional-programming', 'Functional Programming'),
    doc('paradigms/object-oriented-programming', 'Object-Oriented Programming'),
  ]),
  category('Metaprogramming', [
    doc('metaprogramming/metaprogramming', 'Metaprogramming and Advanced Objects'),
  ]),
  category('Memory and Internals', [
    doc('internals/execution-context', 'Execution Contexts and Environments'),
    doc('internals/memory-and-garbage-collection', 'Memory and Garbage Collection'),
    doc('internals/javascript-engine-internals', 'JavaScript Engine Internals'),
  ]),
  category('Performance and Security', [
    doc('performance/performance-overview', 'JavaScript Performance'),
    doc('security/javascript-security', 'JavaScript Security'),
  ]),
  category('Testing and Debugging', [
    doc('testing/testing-javascript', 'Testing JavaScript'),
    doc('debugging/debugging-javascript', 'Debugging JavaScript'),
  ]),
  category('Code Quality and Tooling', [
    doc('tooling/code-quality-and-tooling', 'Code Quality and Tooling'),
  ]),
  category('Patterns and Architecture', [
    doc('patterns/design-patterns', 'Design Patterns'),
    doc('architecture/application-architecture', 'Application Architecture'),
  ]),
  category('Data Structures and Algorithms', [
    doc('algorithms/data-structures-and-algorithms', 'Data Structures and Algorithms in JavaScript'),
  ]),

  category('Logic-Building Exercises', [
    doc('exercises/overview', 'Exercise Track Overview'),
    doc('exercises/beginner-001-100', 'Beginner Problems'),
    doc('exercises/intermediate-101-200', 'Intermediate Problems'),
    doc('exercises/advanced-201-300', 'Advanced Problems'),
  ]),

  category('Production Projects', [
    doc('projects/javascript-projects', 'JavaScript Projects'),
    doc('projects/vanilla-javascript-task-manager', 'Vanilla JavaScript Task Manager'),
    doc('projects/accessible-autocomplete-search', 'Accessible Autocomplete Search'),
    doc('projects/data-dashboard-filtering-pagination', 'Data Dashboard with Filtering and Pagination'),
    doc('projects/offline-first-notes-application', 'Offline-First Notes Application'),
    doc('projects/realtime-chat-client', 'Realtime Chat Client'),
    doc('projects/form-validation-library', 'JavaScript Form and Validation Library'),
    doc('projects/event-state-management-library', 'Custom Event and State Management Library'),
    doc('projects/promise-task-queue', 'Promise-Based Task Queue'),
    doc('projects/file-processing-streaming-tool', 'File Processing and Streaming Tool'),
    doc('projects/modular-ecommerce-frontend', 'Modular E-Commerce Frontend'),
  ]),

  category('Interview Mastery', [
    doc('interviews/interview-mastery', 'Focused Interview Mastery'),
    doc('interview-mastery/overview', 'Complete Interview Mastery'),
  ]),
  category('Question Bank', [
    doc('interview-question-bank/overview', 'Question Bank Overview'),
    doc('interview-question-bank/01-q001-q020', 'Foundation Questions'),
    doc('interview-question-bank/02-q021-q200', 'Intermediate and Advanced Questions'),
    doc('interview-question-bank/03-q201-q376', 'Senior and Architecture Questions'),
    doc('interview-question-bank/04-output-prediction-q377-q384', 'Output-Prediction Questions'),
  ]),
  category('Mock Interviews', [
    doc('mock-interview-practice/01-rounds-1-8', 'Mock Rounds One through Eight'),
    doc('mock-interview-practice/02-rounds-9-15', 'Mock Rounds Nine through Fifteen'),
  ]),

  category('Comprehensive Legacy Curriculum', [
    doc('01-04-fundamentals-types-coercion', 'Fundamentals, Variables, Types and Coercion'),
    doc('05-08-equality-operators-control-iteration', 'Equality, Operators, Control Flow and Iteration'),
    doc('09-12-functions-scope-this', 'Functions, Scope and this'),
    doc('13-17-objects-prototypes-classes', 'Objects, Prototypes and Classes'),
    doc('18-22-arrays-text-numbers-dates', 'Arrays, Strings, Numbers, BigInt and Date'),
    doc('23-26-temporal-regex-symbols-collections', 'Temporal, RegExp, Symbols, Maps and Sets'),
    doc('27-30-iteration-generators-binary-shared-memory', 'Iteration, Generators and Binary Memory'),
    doc('31-35-errors-promises-async-event-loop', 'Errors, Promises, Async/Await and Event Loop'),
    doc('36-37-modules-resource-management', 'Modules and Resource Management'),
    doc('38-42-proxy-reflect-metaprogramming-memory', 'Proxy, Reflect, Metaprogramming and Memory'),
    doc('43-47-destructuring-spread-json-intl', 'Destructuring, Spread, JSON and Intl'),
    doc('48-50-programming-paradigms-patterns', 'Programming Paradigms and Patterns'),
    doc('51-53-dom-model-selection-manipulation', 'DOM Model, Selection and Manipulation'),
    doc('54-56-events-forms-fetch', 'Events, Forms and Fetch'),
    doc('57-59-url-storage-timers', 'URL APIs, Storage and Timers'),
    doc('60-62-workers-clone-browser-security', 'Workers, Structured Clone and Browser Security'),
    doc('63-67-execution-environments-realms', 'Execution, Environments, References and Realms'),
    doc('68-71-jobs-parsing-engines-jit', 'Jobs, Parsing, Engines and JIT'),
    doc('72-74-performance-memory-debugging', 'Performance, Memory Leaks and Debugging'),
    doc('75-77-mistakes-antipatterns-style', 'Mistakes, Anti-Patterns and Style'),
    doc('78-81-modules-api-validation-typescript', 'Architecture, APIs, Validation and TypeScript Boundary'),
    doc('82-84-tooling-compatibility-testing', 'Tooling, Compatibility and Testing'),
    doc('85-87-concurrency-errors-large-apps', 'Concurrency, Error Architecture and Large Applications'),
    doc('88-91-library-framework-senior-staff', 'Library, Framework, Senior and Staff Architecture'),
    doc('92-94-history-es2026-tc39', 'JavaScript History, ECMAScript 2026 and TC39'),
    doc('95-97-legacy-spec-reading-case-studies', 'Legacy JavaScript, Specification Reading and Case Studies'),
  ]),

  category('Existing Project Archive', [
    doc('projects/01-javascript-utility-toolkit', 'JavaScript Utility Toolkit'),
    doc('projects/02-dom-task-manager', 'DOM Task Manager'),
    doc('projects/03-form-and-validation-engine', 'Form and Validation Engine'),
    doc('projects/04-api-data-dashboard', 'API Data Dashboard'),
    doc('projects/05-async-request-manager', 'Async Request Manager'),
    doc('projects/06-event-system-pub-sub-library', 'Event System and Pub/Sub Library'),
    doc('projects/07-javascript-sdk-library', 'JavaScript SDK and Library'),
    doc('projects/08-worker-powered-application', 'Worker-Powered Application'),
    doc('projects/09-mini-reactive-system', 'Mini Reactive System'),
    doc('projects/10-large-modular-javascript-application', 'Large Modular JavaScript Application'),
    doc('projects/11-capstone-vanilla-javascript-application-platform', 'Vanilla JavaScript Application Platform Capstone'),
  ]),

  category('Reference and Coverage', [
    doc('reference/specification-coverage-2026', 'Specification Coverage 2026'),
    doc('reference/generation-record', 'Generation Record'),
    doc('reference/api-coverage', 'API Coverage'),
    doc('reference/w3schools-coverage', 'Curriculum Coverage Audit'),
    doc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

module.exports = sidebars;
