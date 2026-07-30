import React from 'react';
import HandbookLanding from '../components/HandbookLanding';

const postgresqlHandbook = {
  name: 'SQL & PostgreSQL',
  icon: 'PG',
  status: 'In Review',
  intro: '/docs/postgresql/intro',
  description: 'A production-focused SQL and PostgreSQL handbook from relational fundamentals and query design through MVCC, indexing, execution plans, WAL, recovery, replication, operations, internals, and staff-level database architecture.',
  highlights: [
    {
      label: 'SQL & modelling',
      title: 'Querying, constraints & schema design',
      description: 'Build strong relational models, write expressive SQL, enforce invariants, and choose data types and constraints deliberately.',
      href: '/docs/postgresql/24-27-select-filter-sort-pagination',
    },
    {
      label: 'Performance',
      title: 'Indexes, EXPLAIN, MVCC & storage',
      description: 'Reason about index design, planner choices, transaction visibility, vacuum, buffers, locks, and production query performance.',
      href: '/docs/postgresql/68-74-query-planning-explain-performance',
    },
    {
      label: 'Production',
      title: 'WAL, recovery, HA & architecture',
      description: 'Operate PostgreSQL through backups, recovery, replication, security, observability, failure handling, scaling, and architecture trade-offs.',
      href: '/docs/postgresql/82-90-wal-recovery-replication-ha',
    },
  ],
  studyPath: [
    'SQL foundations',
    'Data modelling',
    'Indexes & performance',
    'Transactions & MVCC',
    'Operations & reliability',
    'Internals & architecture',
    'Projects & interviews',
  ],
};

export default function PostgreSQLHandbookLanding() {
  return <HandbookLanding {...postgresqlHandbook} />;
}
