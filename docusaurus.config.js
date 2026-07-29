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
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          sidebarPath: require.resolve('./sidebars.clean.js'),
          editUrl: 'https://github.com/salman0butt/handbook/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'React, Next.js, App Router, JavaScript, TypeScript, Node.js, system design, DevOps, AI engineering, developer handbook',
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
