# Developer Handbook

A personal software engineering knowledge base covering frontend, backend, system design, DevOps, WordPress, and AI engineering — from fundamentals to advanced concepts.

**Live site:** https://salman0butt.github.io/handbook/

## Current focus: React

The React handbook is being built from first principles through production architecture and senior engineering topics.

Current chapters include:

- React mental model and what problem React solves
- JSX
- Components and props
- `useState`

Planned React sections include hooks, forms, routing, state management, data fetching, TypeScript, testing, accessibility, performance, architecture, design patterns, security, React internals, and interview preparation.

## Handbook library

| Handbook | Status |
| --- | --- |
| React | In progress |
| JavaScript | Coming soon |
| TypeScript | Coming soon |
| Next.js | Coming soon |
| Node.js | Coming soon |
| Databases | Coming soon |
| System Design | Coming soon |
| DevOps | Coming soon |
| WordPress | Coming soon |
| AI Engineering | Coming soon |

## Philosophy

```text
Learn → Understand → Build → Debug → Design → Master
```

The goal is not to collect syntax. Each handbook should explain mental models, real-world examples, common mistakes, trade-offs, exercises, and production engineering decisions.

## Tech

- React
- Docusaurus
- MDX / Markdown
- GitHub Actions
- GitHub Pages

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Production build:

```bash
npm run build
```

## Deployment

Pushes to `main` are configured to build the Docusaurus site and deploy the generated `build` directory through GitHub Pages Actions.
