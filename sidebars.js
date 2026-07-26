/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
// The React curriculum is expanded in high-quality phases; keep document IDs build-verified.
const sidebars = {
  handbookSidebar: [
    {
      type: 'category',
      label: '⚛️ React Handbook',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '00 · Start Here',
          collapsed: false,
          items: [
            'react/intro',
            'react/version',
            'react/roadmap',
          ],
        },
        {
          type: 'category',
          label: '01 · JavaScript Prerequisites',
          items: ['react/prerequisites/javascript-for-react'],
        },
        {
          type: 'category',
          label: '02 · Getting Started',
          items: [
            'react/getting-started/what-is-react',
            'react/getting-started/setup-with-vite',
            'react/getting-started/rendering-a-react-app',
            'react/getting-started/strict-mode',
          ],
        },
        {
          type: 'category',
          label: '03 · JSX',
          items: ['react/fundamentals/jsx'],
        },
        {
          type: 'category',
          label: '04 · Components',
          items: ['react/components/components-and-props'],
        },
        {
          type: 'category',
          label: '05 · Rendering',
          items: ['react/rendering/render-cycle'],
        },
        {
          type: 'category',
          label: '06 · Events',
          items: ['react/events/responding-to-events'],
        },
        {
          type: 'category',
          label: '07 · State',
          items: [
            'react/hooks/use-state',
            'react/state/state-snapshots-and-queues',
            'react/state/choosing-and-sharing-state',
            'react/state/preserving-and-resetting-state',
          ],
        },
        {
          type: 'category',
          label: '08 · Conditional Rendering',
          items: ['react/conditional-rendering/conditional-rendering'],
        },
        {
          type: 'category',
          label: '09 · Lists & Keys',
          items: ['react/lists/lists-and-keys'],
        },
        {
          type: 'category',
          label: '10 · Forms',
          items: ['react/forms/forms'],
        },
        {
          type: 'category',
          label: '11 · Effects',
          items: [
            'react/effects/use-effect',
            'react/effects/you-might-not-need-an-effect',
            'react/effects/effect-lifecycle-and-dependencies',
            'react/effects/use-effect-event',
          ],
        },
        {
          type: 'category',
          label: '12 · Refs',
          items: [
            'react/refs/use-ref',
            'react/refs/dom-refs-and-imperative-handles',
          ],
        },
        {
          type: 'category',
          label: '13 · Custom Hooks',
          items: ['react/custom-hooks/custom-hooks'],
        },
        {
          type: 'category',
          label: '14 · Context',
          items: [
            'react/context/context-and-use-context',
            'react/context/context-architecture-and-performance',
          ],
        },
        {
          type: 'category',
          label: '15 · Reducers',
          items: [
            'react/reducers/use-reducer-and-reducer-design',
            'react/reducers/reducer-with-context',
          ],
        },
        {
          type: 'category',
          label: '16 · State Architecture',
          items: [
            'react/state-architecture/state-categories',
            'react/state-architecture/use-sync-external-store',
          ],
        },
        {
          type: 'category',
          label: '17 · Modern React 19+',
          items: [
            'react/modern-react/actions-and-async-transitions',
            'react/modern-react/use-action-state',
            'react/modern-react/form-actions-and-use-form-status',
            'react/modern-react/use-optimistic',
            'react/modern-react/use-api-and-resources',
            'react/modern-react/activity',
            'react/modern-react/metadata-and-resources',
            'react/modern-react/react-19-migration',
          ],
        },
        {
          type: 'category',
          label: '18 · Suspense',
          items: [
            'react/suspense/suspense-boundaries',
            'react/suspense/lazy-and-code-splitting',
            'react/suspense/loading-and-navigation-architecture',
          ],
        },
        {
          type: 'category',
          label: '19 · Concurrency',
          items: [
            'react/concurrency/use-transition-and-start-transition',
            'react/concurrency/use-deferred-value',
            'react/concurrency/concurrent-rendering-mental-model',
          ],
        },
        {
          type: 'category',
          label: '20 · React DOM',
          items: [
            'react/react-dom/portals-and-flush-sync',
            'react/react-dom/dom-components-custom-elements-and-svg',
          ],
        },
        {
          type: 'category',
          label: '21 · Server Rendering',
          items: [
            'react/server-rendering/hydration-and-hydrate-root',
            'react/server-rendering/streaming-ssr',
            'react/server-rendering/static-rendering-and-partial-prerendering',
          ],
        },
        {
          type: 'category',
          label: '22 · Server Components',
          items: [
            'react/server-components/server-components-and-client-boundaries',
            'react/server-components/server-functions-and-directives',
            'react/server-components/cache-and-cache-signal',
          ],
        },
        {
          type: 'category',
          label: '23 · React Compiler',
          items: [
            'react/react-compiler/compiler-mental-model-and-setup',
            'react/react-compiler/automatic-memoization-and-manual-memoization',
            'react/react-compiler/adoption-configuration-and-directives',
            'react/react-compiler/libraries-debugging-and-production-rollout',
          ],
        },
        {
          type: 'category',
          label: '24 · Rules of React',
          items: [
            'react/rules-of-react/purity-immutability-and-render-safety',
            'react/rules-of-react/rules-of-hooks-and-eslint',
          ],
        },
        {
          type: 'category',
          label: '25 · TypeScript',
          items: [
            'react/typescript/typescript-components-and-props',
            'react/typescript/typing-hooks-context-reducers-and-refs',
            'react/typescript/advanced-component-api-design',
          ],
        },
        {
          type: 'category',
          label: '26 · Testing',
          items: [
            'react/testing/testing-library-and-user-behavior',
            'react/testing/async-suspense-actions-and-act',
            'react/testing/production-testing-strategy',
          ],
        },
        {
          type: 'category',
          label: '27 · Accessibility',
          items: [
            'react/accessibility/semantics-use-id-and-accessible-names',
            'react/accessibility/keyboard-focus-forms-dialogs-and-dynamic-ui',
          ],
        },
        {
          type: 'category',
          label: '28 · Performance',
          items: [
            'react/performance/measure-before-optimizing',
            'react/performance/memo-usememo-and-usecallback',
            'react/performance/profiler-and-performance-tracks',
            'react/performance/layout-insertion-and-debug-hooks',
            'react/performance/render-cost-state-placement-and-scheduling',
          ],
        },
        {
          type: 'category',
          label: '29 · Architecture & Patterns',
          items: [
            'react/architecture/component-and-state-architecture',
            'react/architecture/design-systems-and-component-apis',
            'react/architecture/advanced-composition-patterns',
          ],
        },
        {
          type: 'category',
          label: '📋 Reference & Coverage',
          items: ['react/reference/api-coverage'],
        },
      ],
    },
    {
      type: 'category',
      label: '📚 More Handbooks',
      items: [
        'javascript/intro',
        'typescript/intro',
        'nextjs/intro',
        'nodejs/intro',
        'databases/intro',
        'system-design/intro',
        'devops/intro',
        'wordpress/intro',
        'ai-engineering/intro',
      ],
    },
  ],
};

module.exports = sidebars;
