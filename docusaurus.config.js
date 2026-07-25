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
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
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
        content: 'React, JavaScript, TypeScript, Node.js, system design, DevOps, AI engineering, developer handbook',
      },
    ],
    navbar: {
      title: 'Developer Handbook',
      items: [
        {
          to: '/docs/react/intro',
          label: 'React',
          position: 'left',
        },
        {
          to: '/docs/javascript/intro',
          label: 'JavaScript',
          position: 'left',
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
            {label: 'React', to: '/docs/react/intro'},
            {label: 'JavaScript', to: '/docs/javascript/intro'},
            {label: 'TypeScript', to: '/docs/typescript/intro'},
          ],
        },
        {
          title: 'Engineering',
          items: [
            {label: 'System Design', to: '/docs/system-design/intro'},
            {label: 'DevOps', to: '/docs/devops/intro'},
            {label: 'AI Engineering', to: '/docs/ai-engineering/intro'},
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
