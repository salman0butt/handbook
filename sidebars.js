/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  handbookSidebar: [
    {
      type: 'category',
      label: '⚛️ React Handbook',
      collapsed: false,
      items: [
        'react/intro',
        {
          type: 'category',
          label: '01 · Getting Started',
          items: ['react/01-getting-started/what-is-react'],
        },
        {
          type: 'category',
          label: '02 · Fundamentals',
          items: ['react/02-fundamentals/jsx'],
        },
        {
          type: 'category',
          label: '03 · Components',
          items: ['react/03-components/components-and-props'],
        },
        {
          type: 'category',
          label: '04 · Hooks',
          items: ['react/04-hooks/use-state'],
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
