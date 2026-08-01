import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import curriculum from '@site/scripts/typescript-curriculum-manifest.js';
import TypeScriptLesson, {CATEGORY_DESCRIPTIONS} from './index';

const h = React.createElement;

function relativeRoute(pathname) {
  const marker = '/typescript/';
  const index = pathname.indexOf(marker);
  if (index === -1) return '';
  return pathname.slice(index + marker.length).replace(/^\/+|\/+$/g, '');
}

function findDocument(route) {
  for (const category of curriculum.categories) {
    const categoryRoute = category.name === 'Projects' ? 'projects/overview' : category.slug;
    if (route === categoryRoute) return {kind: 'category', category};
    const topic = category.topics.find(([, topicRoute]) => topicRoute === route);
    if (topic) return {kind: 'topic', category, topic};
  }
  return null;
}

function CategoryPage({category}) {
  const description = CATEGORY_DESCRIPTIONS[category.name] ?? 'a focused part of the TypeScript learning path';
  return h(React.Fragment, null,
    h(Head, null, h('title', null, `${category.name} | TypeScript Handbook`)),
    h('h1', null, category.name),
    h('p', null, `This section covers ${description}. Every lesson stands alone while fitting the beginner-to-staff progression.`),
    h('h2', null, 'Learning outcomes'),
    h('ul', null,
      h('li', null, 'Explain runtime and compile-time responsibilities.'),
      h('li', null, 'Write a correct example without unsafe escape hatches.'),
      h('li', null, 'Diagnose a representative compiler error.'),
      h('li', null, 'Identify API, performance, security, and production trade-offs.'),
      h('li', null, 'Apply the concept in a project or interview.'),
    ),
    h('h2', null, 'Lessons'),
    h('ul', null, ...category.topics.map(([title, route]) =>
      h('li', {key: route}, h(Link, {to: `/typescript/${route}`}, title)))),
    h('h2', null, 'Study method'),
    h('p', null, 'Run the examples under strict checking, intentionally introduce an error, explain the diagnostic, and finish the exercises.'),
  );
}

function TopicPage({category, topic}) {
  const [title] = topic;
  return h(React.Fragment, null,
    h(Head, null, h('title', null, `${title} | TypeScript Handbook`)),
    h('h1', null, title),
    h(TypeScriptLesson, {topic: title, category: category.name}),
  );
}

export default function DynamicTypeScriptDoc() {
  const location = useLocation();
  const route = relativeRoute(location.pathname);
  const document = findDocument(route);
  if (!document) {
    return h(React.Fragment, null,
      h(Head, null, h('title', null, 'TypeScript Handbook')),
      h('h1', null, 'TypeScript Handbook'),
      h('p', null, 'This handbook route was not found in the curriculum manifest.'),
    );
  }
  return document.kind === 'category'
    ? h(CategoryPage, {category: document.category})
    : h(TopicPage, {category: document.category, topic: document.topic});
}
