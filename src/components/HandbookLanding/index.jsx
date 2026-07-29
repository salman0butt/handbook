import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

export default function HandbookLanding({
  name,
  icon,
  description,
  intro,
  highlights = [],
  studyPath = [],
  status = 'Available',
}) {
  return (
    <Layout title={`${name} Handbook`} description={description}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <Link className={styles.back} to="/">← All handbooks</Link>
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.eyebrow}>{icon} {status}</div>
                <h1>{name} Developer Handbook</h1>
                <p className={styles.lead}>{description}</p>
                <div className={styles.actions}>
                  <Link className="button button--primary button--lg" to={intro}>Start handbook</Link>
                  <span className={styles.searchHint}>Search any topic with <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> or <kbd>/</kbd></span>
                </div>
              </div>
              <aside className={styles.quickStart}>
                <span>How to use this handbook</span>
                <strong>Learn → practise → debug → design → interview</strong>
                <p>Use the sidebar for the learning path, the page outline for long chapters, and global search when you need a reference quickly.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.heading}>
              <div><span className={styles.kicker}>WHAT YOU'LL MASTER</span><h2>From concepts to production reasoning</h2></div>
              <p>The handbook is structured as a learning system, not a collection of disconnected notes.</p>
            </div>
            <div className={styles.grid}>
              {highlights.map((item) => (
                <div className={styles.card} key={item.title}>
                  <span>{item.label || 'Topic'}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.href && <Link to={item.href}>Open chapter →</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {studyPath.length > 0 && (
          <section className={`${styles.section} ${styles.pathSection}`}>
            <div className="container">
              <span className={styles.kicker}>LEARNING PATH</span>
              <h2>Build depth in the right order</h2>
              <div className={styles.path}>
                {studyPath.map((step, index) => (
                  <React.Fragment key={step}>
                    <div><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span></div>
                    {index < studyPath.length - 1 && <i>→</i>}
                  </React.Fragment>
                ))}
              </div>
              <Link className="button button--secondary button--lg" to={intro}>Open the full learning path</Link>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
