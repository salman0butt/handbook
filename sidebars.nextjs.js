/** Gap-closing Next.js navigation layered over the existing focused curriculum. */
const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `nextjs/complete-handbook/${id}`, label});

const baseline = category('Version, Roadmap & Coverage', [
  doc('version', 'Version Baseline'),
  doc('roadmap', 'Learning Roadmap'),
  doc('index', 'Complete Handbook Coverage'),
  doc('reference/index', 'Reference & Coverage'),
  doc('reference/completion-matrix', 'Completion Matrix'),
], {collapsed: false});

const extensions = [
  category('Installation & Project Setup', [
    doc('setup/index', 'Overview'),
    doc('setup/create-next-app', 'Creating a Next.js Project'),
    doc('setup/manual-and-tooling', 'Manual Installation & Tooling'),
  ]),
  category('Styling', [
    doc('styling/index', 'Overview'),
    doc('styling/css-tailwind-design-systems', 'CSS, Tailwind, Sass & Design Systems'),
    doc('styling/css-in-js-hydration', 'CSS-in-JS & Hydration'),
  ]),
  category('State Management', [
    doc('state-management/index', 'Overview'),
    doc('state-management/state-taxonomy', 'Server, URL, Local & Shared State'),
    doc('state-management/tool-selection', 'Zustand, Redux Toolkit, TanStack Query & SWR'),
  ]),
  category('Request Data & Configuration', [
    doc('request-and-configuration/index', 'Overview'),
    doc('request-and-configuration/cookies-headers-request-data', 'Cookies, Headers & Request Data'),
    doc('request-and-configuration/environment-and-next-config', 'Environment & next.config'),
  ]),
  category('Database & API Integration', [
    doc('data-platform/index', 'Overview'),
    doc('data-platform/database-integration', 'Database Integration'),
    doc('data-platform/api-realtime-ai-integration', 'External APIs, Realtime & AI'),
  ]),
  category('TypeScript & Accessibility', [
    doc('typescript-accessibility/index', 'Overview'),
    doc('typescript-accessibility/typescript', 'TypeScript with Next.js'),
    doc('typescript-accessibility/accessibility', 'Accessibility'),
  ]),
  category('Platform Patterns', [
    doc('platform-patterns/index', 'Overview'),
    doc('platform-patterns/edge-runtime', 'Edge Runtime'),
    doc('platform-patterns/internationalization', 'Internationalization'),
    doc('platform-patterns/multi-tenant', 'Multi-Tenant Applications'),
    doc('platform-patterns/monorepos', 'Monorepos'),
  ]),
  category('Pages Router Compatibility & Migration', [
    doc('pages-router-and-migration/index', 'Overview'),
    doc('pages-router-and-migration/pages-router-compatibility', 'Pages Router Compatibility'),
    doc('pages-router-and-migration/spa-vite-cra-migration', 'React SPA, Vite & CRA Migration'),
    doc('pages-router-and-migration/pages-to-app-router', 'Pages Router to App Router'),
    doc('pages-router-and-migration/upgrades-rollbacks', 'Upgrades, Codemods & Rollbacks'),
  ]),
  category('Production Patterns', [
    doc('production-patterns/index', 'Overview'),
    doc('production-patterns/jobs-webhooks-files-email-payments', 'Jobs, Webhooks, Files, Email & Payments'),
    doc('production-patterns/feature-flags-search-ai-audit', 'Feature Flags, Search, AI & Audit Logs'),
  ]),
  category('Capstone Projects', [
    doc('capstones/index', 'Overview'),
    doc('capstones/marketing-website', 'Marketing Website'),
    doc('capstones/technical-blog', 'Technical Blog'),
    doc('capstones/ecommerce-store', 'E-commerce Store'),
    doc('capstones/saas-dashboard', 'SaaS Dashboard'),
    doc('capstones/authentication-system', 'Authentication System'),
    doc('capstones/multi-tenant-saas', 'Multi-Tenant SaaS'),
    doc('capstones/admin-dashboard', 'Admin Dashboard'),
    doc('capstones/realtime-application', 'Real-Time Application'),
    doc('capstones/ai-powered-application', 'AI-Powered Application'),
    doc('capstones/production-api-platform', 'Production API Platform'),
  ]),
];

function appendNextjsSidebar(existingSidebar) {
  if (!Array.isArray(existingSidebar) || existingSidebar.length === 0) {
    return [baseline, ...extensions];
  }
  return [existingSidebar[0], baseline, ...existingSidebar.slice(1), ...extensions];
}

module.exports = {appendNextjsSidebar};
