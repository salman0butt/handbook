const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Salman's Developer Handbook",
  tagline: 'Practical software engineering notes from fundamentals to advanced concepts',
  url: 'https://salman0butt.github.io',
  baseUrl: '/handbook/',
  organizationName: 'salman0butt',
  projectName: 'handbook',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    require.resolve('./plugins/handbook-ux'),
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/nextjs/intro',
            from: ['/nextjs', '/nextjs/intro'],
          },
          {
            to: '/docs/nextjs/complete-handbook/version',
            from: '/nextjs/version',
          },
          {
            to: '/docs/nextjs/complete-handbook/roadmap',
            from: '/nextjs/roadmap',
          },
          {
            to: '/docs/nextjs/complete-handbook',
            from: '/nextjs/complete-handbook',
          },
          {
            to: '/docs/nextjs/app-router-and-layouts/route-tree-pages-and-layouts',
            from: '/docs/nextjs/app-router/app-directory',
          },
          {
            to: '/docs/nextjs/app-router-and-layouts/dynamic-segments-and-async-params',
            from: '/docs/nextjs/routing/dynamic-routes',
          },
          {
            to: '/docs/nextjs/server-and-client-components/server-components-default-and-rendering-model',
            from: '/docs/nextjs/server-components/server-components',
          },
          {
            to: '/docs/nextjs/caching-rendering-and-revalidation/cache-model-and-rendering-decision-tree',
            from: [
              '/docs/nextjs/caching/cache-layers',
              '/docs/nextjs/rendering/static-rendering',
            ],
          },
          {
            to: '/docs/nextjs/mutations-forms-and-server-functions/server-functions-actions-and-use-server',
            from: '/docs/nextjs/server-functions/server-actions',
          },
          {
            to: '/docs/nextjs/route-handlers/route-ts-methods-and-http-semantics',
            from: '/docs/nextjs/route-handlers/route-handlers',
          },
          {
            to: '/docs/nextjs/authentication-authorization-and-security/authentication-session-authorization-mental-model',
            from: '/docs/nextjs/authentication/authentication-overview',
          },
          {
            to: '/docs/nextjs/deployment-and-production-operations/deployment-model-build-runtime-and-platform-capabilities',
            from: '/docs/nextjs/deployment/deployment-overview',
          },
        ],
      },
    ],
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: true,
        indexDocSidebarParentCategories: 2,
        includeParentCategoriesInPageTitle: true,
        indexBlog: false,
        indexPages: false,
        language: 'en',
        maxSearchResults: 12,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.final.js'),
          editUrl: 'https://github.com/salman0butt/handbook/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/handbook-ux.css'),
            require.resolve('./src/css/navbar-fixes.css'),
            require.resolve('./src/css/mobile-dark-mode.css'),
          ],
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    metadata: [
      {
        name: 'keywords',
        content: 'React, React Native, Community CLI, Android, iOS, Hermes, Metro, Fabric, TurboModules, JSI, Codegen, Next.js, JavaScript, TypeScript, Node.js, SQL, PostgreSQL, databases, system design, DevOps, AI engineering, LLM, tokens, tokenization, transformers, prompt engineering, RAG, LangChain, LangGraph, MCP, AI agents, developer handbook',
      },
    ],
    navbar: {
      title: 'Developer Handbook',
      items: [
        {
          label: 'Frontend',
          position: 'left',
          items: [
            {to: '/react', label: 'React', activeBaseRegex: '^/(react|docs/react)'},
            {to: '/nextjs', label: 'Next.js', activeBaseRegex: '^/(nextjs|docs/nextjs)'},
            {to: '/typescript', label: 'TypeScript', activeBaseRegex: '^/(typescript|docs/typescript)'},
            {to: '/javascript', label: 'JavaScript', activeBaseRegex: '^/(javascript|docs/javascript)'},
          ],
        },
        {
          label: 'Backend & Data',
          position: 'left',
          items: [
            {to: '/nodejs', label: 'Node.js', activeBaseRegex: '^/(nodejs|docs/nodejs)'},
            {to: '/postgresql', label: 'PostgreSQL', activeBaseRegex: '^/(postgresql|docs/postgresql)'},
            {to: '/databases', label: 'Databases', activeBaseRegex: '^/(databases|docs/databases)'},
          ],
        },
        {to: '/react-native', label: 'Mobile', position: 'left', activeBaseRegex: '^/(react-native|docs/react-native)'},
        {to: '/ai-engineering', label: 'AI', position: 'left', activeBaseRegex: '^/(ai-engineering|docs/ai-engineering)'},
        {
          label: 'More',
          position: 'left',
          items: [
            {label: 'System Design', to: '/system-design'},
            {label: 'DevOps', to: '/devops'},
            {label: 'WordPress', to: '/wordpress'},
          ],
        },
        {
          href: 'https://github.com/salman0butt/handbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Handbooks',
          items: [
            {label: 'React', to: '/react'},
            {label: 'Next.js', to: '/nextjs'},
            {label: 'JavaScript', to: '/javascript'},
            {label: 'TypeScript', to: '/typescript'},
            {label: 'PostgreSQL', to: '/postgresql'},
            {label: 'React Native', to: '/react-native'},
          ],
        },
        {
          title: 'Engineering',
          items: [
            {label: 'System Design', to: '/system-design'},
            {label: 'DevOps', to: '/devops'},
            {label: 'AI Engineering', to: '/ai-engineering'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/salman0butt/handbook'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Salman Butt. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
