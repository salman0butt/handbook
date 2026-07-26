/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const category = (label, items, extra = {}) => ({ type: 'category', label, items, ...extra });

const reactItems = [
  category('00 · Start Here', ['react/intro', 'react/version', 'react/roadmap'], { collapsed: false }),
  category('01 · JavaScript Prerequisites', ['react/prerequisites/javascript-for-react']),
  category('02 · Getting Started', ['react/getting-started/what-is-react', 'react/getting-started/setup-with-vite', 'react/getting-started/rendering-a-react-app', 'react/getting-started/strict-mode']),
  category('03 · JSX', ['react/fundamentals/jsx']),
  category('04 · Components', ['react/components/components-and-props']),
  category('05 · Rendering', ['react/rendering/render-cycle']),
  category('06 · Events', ['react/events/responding-to-events']),
  category('07 · State', ['react/hooks/use-state', 'react/state/state-snapshots-and-queues', 'react/state/choosing-and-sharing-state', 'react/state/preserving-and-resetting-state']),
  category('08 · Conditional Rendering', ['react/conditional-rendering/conditional-rendering']),
  category('09 · Lists & Keys', ['react/lists/lists-and-keys']),
  category('10 · Forms', ['react/forms/forms']),
  category('11 · Effects', ['react/effects/use-effect', 'react/effects/you-might-not-need-an-effect', 'react/effects/effect-lifecycle-and-dependencies', 'react/effects/use-effect-event']),
  category('12 · Refs', ['react/refs/use-ref', 'react/refs/dom-refs-and-imperative-handles']),
  category('13 · Custom Hooks', ['react/custom-hooks/custom-hooks']),
  category('14 · Context', ['react/context/context-and-use-context', 'react/context/context-architecture-and-performance']),
  category('15 · Reducers', ['react/reducers/use-reducer-and-reducer-design', 'react/reducers/reducer-with-context']),
  category('16 · State Architecture', ['react/state-architecture/state-categories', 'react/state-architecture/use-sync-external-store']),
  category('17 · Modern React 19+', ['react/modern-react/actions-and-async-transitions', 'react/modern-react/use-action-state', 'react/modern-react/form-actions-and-use-form-status', 'react/modern-react/use-optimistic', 'react/modern-react/use-api-and-resources', 'react/modern-react/activity', 'react/modern-react/metadata-and-resources', 'react/modern-react/react-19-migration']),
  category('18 · Suspense', ['react/suspense/suspense-boundaries', 'react/suspense/lazy-and-code-splitting', 'react/suspense/loading-and-navigation-architecture']),
  category('19 · Concurrency', ['react/concurrency/use-transition-and-start-transition', 'react/concurrency/use-deferred-value', 'react/concurrency/concurrent-rendering-mental-model']),
  category('20 · React DOM', ['react/react-dom/portals-and-flush-sync', 'react/react-dom/dom-components-custom-elements-and-svg']),
  category('21 · Server Rendering', ['react/server-rendering/hydration-and-hydrate-root', 'react/server-rendering/streaming-ssr', 'react/server-rendering/static-rendering-and-partial-prerendering']),
  category('22 · Server Components', ['react/server-components/server-components-and-client-boundaries', 'react/server-components/server-functions-and-directives', 'react/server-components/cache-and-cache-signal']),
  category('23 · React Compiler', ['react/react-compiler/compiler-mental-model-and-setup', 'react/react-compiler/automatic-memoization-and-manual-memoization', 'react/react-compiler/adoption-configuration-and-directives', 'react/react-compiler/libraries-debugging-and-production-rollout']),
  category('24 · Rules of React', ['react/rules-of-react/purity-immutability-and-render-safety', 'react/rules-of-react/rules-of-hooks-and-eslint']),
  category('25 · TypeScript', ['react/typescript/typescript-components-and-props', 'react/typescript/typing-hooks-context-reducers-and-refs', 'react/typescript/advanced-component-api-design']),
  category('26 · Testing', ['react/testing/testing-library-and-user-behavior', 'react/testing/async-suspense-actions-and-act', 'react/testing/production-testing-strategy']),
  category('27 · Accessibility', ['react/accessibility/semantics-use-id-and-accessible-names', 'react/accessibility/keyboard-focus-forms-dialogs-and-dynamic-ui']),
  category('28 · Performance', ['react/performance/measure-before-optimizing', 'react/performance/memo-usememo-and-usecallback', 'react/performance/profiler-and-performance-tracks', 'react/performance/layout-insertion-and-debug-hooks', 'react/performance/render-cost-state-placement-and-scheduling']),
  category('29 · Architecture & Patterns', ['react/architecture/component-and-state-architecture', 'react/architecture/design-systems-and-component-apis', 'react/architecture/advanced-composition-patterns']),
  category('30 · Internals', ['react/internals/reconciliation-identity-and-state-preservation', 'react/internals/fiber-render-work-and-scheduling']),
  category('31 · Debugging', ['react/debugging/error-boundaries-owner-stacks-and-root-errors', 'react/debugging/production-observability-and-failure-triage']),
  category('32 · Production Engineering', ['react/production-engineering/security-and-trust-boundaries', 'react/production-engineering/legacy-react-maintenance-and-migration', 'react/production-engineering/large-team-react-engineering', 'react/production-engineering/senior-architectural-decision-making']),
  category('33 · Projects', ['react/projects/project-ladder-and-delivery-standards', 'react/projects/capstone-realtime-operations-dashboard', 'react/projects/capstone-commerce-and-mutation-workflows', 'react/projects/capstone-saas-architecture-and-platform']),
  category('34 · Interview Mastery', ['react/interview-mastery/fundamentals-to-senior-react-interview', 'react/interview-mastery/debugging-performance-and-security-scenarios', 'react/interview-mastery/react-system-design-and-tradeoff-drills', 'react/interview-mastery/staff-level-architecture-and-leadership']),
  category('📋 Reference & Coverage', ['react/reference/api-coverage', 'react/reference/final-completeness-audit']),
];

const sidebars = {
  handbookSidebar: [
    category('⚛️ React Handbook', reactItems, { collapsed: false }),
    category('📚 More Handbooks', ['javascript/intro', 'typescript/intro', 'nextjs/intro', 'nodejs/intro', 'databases/intro', 'system-design/intro', 'devops/intro', 'wordpress/intro', 'ai-engineering/intro']),
  ],
};

module.exports = sidebars;
