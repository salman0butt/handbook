/** JavaScript-specific navigation layered over the shared cleaned sidebars. */
const sidebars = require('./sidebars.clean.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `javascript/${id}`, label});

sidebars.javascriptSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version-baseline', 'ECMAScript 2026 Baseline'),
    doc('roadmap', 'Learning Roadmap'),
    doc('00-start-here', '00 · Start Here'),
  ], {collapsed: false}),
  category('Language Foundations', [
    doc('01-04-fundamentals-types-coercion', '01–04 · Fundamentals, Variables, Types & Coercion'),
    doc('05-08-equality-operators-control-iteration', '05–08 · Equality, Operators, Control Flow & Iteration'),
  ]),
  category('Functions & Scope', [
    doc('09-12-functions-scope-this', '09–12 · Functions, Scope & this'),
  ]),
  category('Objects & Prototypes', [
    doc('13-17-objects-prototypes-classes', '13–17 · Objects, Prototypes & Classes'),
  ]),
  category('Built-ins & Collections', [
    doc('18-22-arrays-text-numbers-dates', '18–22 · Arrays, Strings, Numbers, BigInt & Date'),
    doc('23-26-temporal-regex-symbols-collections', '23–26 · Temporal, RegExp, Symbols, Maps & Sets'),
  ]),
  category('Iteration & Generators', [
    doc('27-30-iteration-generators-binary-shared-memory', '27–30 · Iteration, Generators & Binary Memory'),
  ]),
  category('Async JavaScript', [
    doc('31-35-errors-promises-async-event-loop', '31–35 · Errors, Promises, Async/Await & Event Loop'),
  ]),
  category('Modules & Resources', [
    doc('36-37-modules-resource-management', '36–37 · Modules & Resource Management'),
  ]),
  category('Metaprogramming & Memory', [
    doc('38-42-proxy-reflect-metaprogramming-memory', '38–42 · Proxy, Reflect, Metaprogramming & Memory'),
    doc('43-47-destructuring-spread-json-intl', '43–47 · Destructuring, Spread, JSON & Intl'),
    doc('48-50-programming-paradigms-patterns', '48–50 · Paradigms & Patterns'),
  ]),
  category('Browser JavaScript · Web APIs', [
    doc('51-53-dom-model-selection-manipulation', '51–53 · DOM Model, Selection & Manipulation'),
    doc('54-56-events-forms-fetch', '54–56 · Events, Forms & Fetch'),
    doc('57-59-url-storage-timers', '57–59 · URL APIs, Storage & Timers'),
    doc('60-62-workers-clone-browser-security', '60–62 · Workers, Structured Clone & Security'),
  ]),
  category('Language Internals', [
    doc('63-67-execution-environments-realms', '63–67 · Execution, Environments, References & Realms'),
    doc('68-71-jobs-parsing-engines-jit', '68–71 · Jobs, Parsing, Engines & JIT'),
  ]),
  category('Performance & Debugging', [
    doc('72-74-performance-memory-debugging', '72–74 · Performance, Memory Leaks & Debugging'),
    doc('75-77-mistakes-antipatterns-style', '75–77 · Mistakes, Anti-Patterns & Style'),
  ]),
  category('Architecture & Production', [
    doc('78-81-modules-api-validation-typescript', '78–81 · Architecture, APIs, Validation & TypeScript Boundary'),
    doc('82-84-tooling-compatibility-testing', '82–84 · Tooling, Compatibility & Testing'),
    doc('85-87-concurrency-errors-large-apps', '85–87 · Concurrency, Error Architecture & Large Apps'),
    doc('88-91-library-framework-senior-staff', '88–91 · Library, Framework, Senior & Staff Architecture'),
  ]),
  category('Modern ECMAScript & Specification', [
    doc('92-94-history-es2026-tc39', '92–94 · History, ES2026 & TC39'),
    doc('95-97-legacy-spec-reading-case-studies', '95–97 · Legacy, Spec Reading & Case Studies'),
  ]),
  category('Projects', [
    doc('projects/01-javascript-utility-toolkit', '1 · JavaScript Utility Toolkit'),
    doc('projects/02-dom-task-manager', '2 · DOM Task Manager'),
    doc('projects/03-form-and-validation-engine', '3 · Form & Validation Engine'),
    doc('projects/04-api-data-dashboard', '4 · API Data Dashboard'),
    doc('projects/05-async-request-manager', '5 · Async Request Manager'),
    doc('projects/06-event-system-pub-sub-library', '6 · Event System / Pub-Sub Library'),
    doc('projects/07-javascript-sdk-library', '7 · JavaScript SDK / Library'),
    doc('projects/08-worker-powered-application', '8 · Worker-Powered Application'),
    doc('projects/09-mini-reactive-system', '9 · Mini Reactive System'),
    doc('projects/10-large-modular-javascript-application', '10 · Large Modular Application'),
    doc('projects/11-capstone-vanilla-javascript-application-platform', 'Capstone · Vanilla JavaScript Platform'),
  ]),
  category('Interview Mastery', [
    doc('interview-mastery/overview', 'Interview Mastery'),
  ]),
  category('Question Bank', [
    doc('interview-question-bank/overview', '384-Question Overview'),
    doc('interview-question-bank/01-q001-q020', 'Q001–Q020'),
    doc('interview-question-bank/02-q021-q200', 'Q021–Q200'),
    doc('interview-question-bank/03-q201-q376', 'Q201–Q376'),
    doc('interview-question-bank/04-output-prediction-q377-q384', 'Q377–Q384 · Output Prediction'),
  ]),
  category('Mock Interviews', [
    doc('mock-interview-practice/01-rounds-1-8', 'Rounds 1–8'),
    doc('mock-interview-practice/02-rounds-9-15', 'Rounds 9–15'),
  ]),
  category('Reference & Coverage', [
    doc('reference/api-coverage', 'API Coverage'),
    doc('reference/w3schools-coverage', 'W3Schools Coverage Audit'),
    doc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

module.exports = sidebars;
