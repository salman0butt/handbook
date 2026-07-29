import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const handbooks = [
  {
    icon: '⚛️',
    title: 'React',
    description: 'Components, hooks, state, performance, architecture, internals, production engineering, and interview mastery.',
    status: 'Complete',
    href: '/react',
    featured: true,
  },
  {
    icon: 'TS',
    title: 'TypeScript',
    description: 'From type fundamentals to inference, generics, compiler reasoning, architecture, production engineering, and interview mastery.',
    status: 'Complete',
    href: '/typescript',
    featured: true,
  },
  {
    icon: '▲',
    title: 'Next.js',
    description: 'App Router, Server Components, caching, security, testing, deployment, architecture, internals, and production operations.',
    status: 'Complete',
    href: '/nextjs',
    featured: true,
  },
  {
    icon: 'JS',
    title: 'JavaScript',
    description: 'The language foundations behind modern frontend and backend development.',
    status: 'Available',
    href: '/javascript',
  },
  {
    icon: '⬢',
    title: 'Node.js',
    description: 'Runtime internals, async I/O, APIs, data, security, distributed systems, production engineering, projects, and interviews.',
    status: 'Complete',
    href: '/nodejs',
    featured: true,
  },
  {
    icon: 'DB',
    title: 'Databases',
    description: 'SQL, modelling, indexes, transactions, query optimisation, and distributed data concepts.',
    status: 'Available',
    href: '/databases',
  },
  {
    icon: 'SD',
    title: 'System Design',
    description: 'Scalability, caching, queues, storage, distributed systems, trade-offs, and design interviews.',
    status: 'Available',
    href: '/system-design',
  },
  {
    icon: '∞',
    title: 'DevOps',
    description: 'Docker, CI/CD, infrastructure, deployments, observability, and reliable delivery.',
    status: 'Available',
    href: '/devops',
  },
  {
    icon: 'WP',
    title: 'WordPress',
    description: 'Core concepts, plugin engineering, Gutenberg, performance, security, and architecture.',
    status: 'Available',
    href: '/wordpress',
  },
  {
    icon: 'AI',
    title: 'AI Engineering',
    description: 'LLMs, prompting, RAG, agents, LangChain, LangGraph, evaluation, and production AI systems.',
    status: 'Available',
    href: '/ai-engineering',
  },
];

function HandbookCard({handbook}) {
  return (
    <Link
      className={`${styles.card} ${handbook.featured ? styles.featured : ''}`}
      to={handbook.href}>
      <div className={styles.cardTop}>
        <span className={styles.icon}>{handbook.icon}</span>
        <span className={styles.status}>{handbook.status}</span>
      </div>
      <h3>{handbook.title}</h3>
      <p>{handbook.description}</p>
      <span className={styles.cardLink}>Open learning path →</span>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="Developer Handbook"
      description="A personal software engineering handbook from fundamentals to advanced engineering.">
      <main>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.eyebrow}>PERSONAL ENGINEERING KNOWLEDGE BASE</div>
            <h1 className={styles.heroTitle}>Learn deeply. Build confidently.</h1>
            <p className={styles.heroSubtitle}>
              Practical handbooks for software engineers — from first principles to production architecture,
              debugging, trade-offs, and senior-level thinking. Search the documentation library from the header
              with ⌘K / Ctrl K or the / key.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to="/typescript">
                Explore TypeScript
              </Link>
              <Link className="button button--secondary button--lg" to="/react">
                Explore React
              </Link>
              <Link
                className="button button--secondary button--lg"
                href="https://github.com/salman0butt/handbook">
                View on GitHub
              </Link>
            </div>
            <div className={styles.learningPath}>
              <span>Fundamentals</span><b>→</b><span>Build</span><b>→</b><span>Understand</span><b>→</b><span>Architect</span><b>→</b><span>Master</span>
            </div>
          </div>
        </section>

        <section className={styles.library}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.kicker}>THE LIBRARY</span>
                <h2>Developer Handbooks</h2>
              </div>
              <p>Choose a handbook landing page, follow its learning path, then use global search whenever you need a fast reference.</p>
            </div>
            <div className={styles.grid}>
              {handbooks.map((handbook) => (
                <HandbookCard key={handbook.title} handbook={handbook} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.philosophy}>
          <div className="container">
            <span className={styles.kicker}>HOW THIS HANDBOOK TEACHES</span>
            <h2>Not just syntax. Engineering understanding.</h2>
            <div className={styles.principles}>
              <div><strong>01</strong><h3>Understand</h3><p>Learn what a concept is, why it exists, and how it works.</p></div>
              <div><strong>02</strong><h3>Apply</h3><p>Move from minimal examples to realistic application code.</p></div>
              <div><strong>03</strong><h3>Debug</h3><p>Study common mistakes, failure modes, and how to reason through them.</p></div>
              <div><strong>04</strong><h3>Design</h3><p>Compare approaches, understand trade-offs, and make better architecture decisions.</p></div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
