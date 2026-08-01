/** Focused TypeScript navigation layered over shared sidebars. */
const sidebars = require('./sidebars.javascript.js');
const curriculum = require('./scripts/typescript-curriculum-manifest.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (route, label) => ({type: 'doc', id: `typescript/${route}`, label});

sidebars.typescriptSidebar = curriculum.categories.map((section) =>
  category(
    section.name,
    section.topics.map(([label, route]) => doc(route, label)),
    {
      collapsed: section.name !== 'Start Here',
      link: {type: 'doc', id: `typescript/${section.slug}/index`},
    },
  ),
);

module.exports = sidebars;
