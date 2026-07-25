/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
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
          label: '05 · State & Hooks',
          items: ['react/hooks/use-state'],
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
