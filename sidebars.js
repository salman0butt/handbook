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
          items: ['react/getting-started/what-is-react'],
        },
        {
          type: 'category',
          label: '02 · Fundamentals',
          items: ['react/fundamentals/jsx'],
        },
        {
          type: 'category',
          label: '03 · Components',
          items: ['react/components/components-and-props'],
        },
        {
          type: 'category',
          label: '04 · Hooks',
          items: ['react/hooks/use-state'],
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
