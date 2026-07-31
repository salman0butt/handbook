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
          sidebarPath: require.resolve('./sidebars.ai-engineering.js'),
          editUrl: 'https://github.com/salman0butt/handbook/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/handbook-ux.css'),
          ],
        },
      },
    ],
  ],

  themeConfig: {
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
        {to: '/react', label: 'React', position: 'left', activeBaseRegex: '^/(react|docs/react)'},
        {to: '/nextjs', label: 'Next.js', position: 'left', activeBaseRegex: '^/(nextjs|docs/nextjs)'},
        {to: '/typescript', label: 'TypeScript', position: 'left', activeBaseRegex: '^/(typescript|docs/typescript)'},
        {to: '/javascript', label: 'JavaScript', position: 'left', activeBaseRegex: '^/(javascript|docs/javascript)'},
        {to: '/nodejs', label: 'Node.js', position: 'left', activeBaseRegex: '^/(nodejs|docs/nodejs)'},
        {to: '/postgresql', label: 'PostgreSQL', position: 'left', activeBaseRegex: '^/(postgresql|docs/postgresql)'},
        {to: '/react-native', label: 'React Native', position: 'left', activeBaseRegex: '^/(react-native|docs/react-native)'},
        {
          label: 'More',
          position: 'left',
          items: [
            {label: 'Databases', to: '/databases'},
            {label: 'System Design', to: '/system-design'},
            {label: 'DevOps', to: '/devops'},
            {label: 'WordPress', to: '/wordpress'},
            {label: 'AI Engineering', to: '/ai-engineering'},
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