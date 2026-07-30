/** PostgreSQL-specific navigation layered over the existing handbook sidebars. */
const sidebars = require('./sidebars.javascript.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `postgresql/${id}`, label});

sidebars.postgresqlSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version-baseline', 'Version Baseline'),
    doc('roadmap', 'Learning Roadmap'),
    doc('00-start-here', '00 · Start Here'),
  ], {collapsed: false}),
  category('Database Foundations', [
    doc('01-04-foundations-architecture', '01–04 · Foundations & Architecture'),
    doc('05-08-objects-connections-schemas-tables', '05–08 · Objects, Connections, Schemas & Tables'),
  ]),
  category('SQL Fundamentals & Data Types', [
    doc('09-13-core-data-types', '09–13 · Core Data Types'),
    doc('14-18-advanced-data-types', '14–18 · Advanced Data Types'),
    doc('19-23-null-and-data-modification', '19–23 · NULL & Data Modification'),
  ]),
  category('Querying Data', [
    doc('24-27-select-filter-sort-pagination', '24–27 · SELECT, Filtering, Sorting & Pagination'),
    doc('28-30-aggregation-and-joins', '28–30 · Aggregation & Joins'),
    doc('31-38-advanced-querying', '31–38 · Advanced Querying'),
  ]),
  category('Data Modelling', [
    doc('39-44-views-sequences-constraints-keys', '39–44 · Views, Sequences, Constraints & Keys'),
    doc('45-49-modelling-and-multitenancy', '45–49 · Modelling & Multitenancy'),
  ]),
  category('Indexes', [
    doc('50-57-indexes', '50–57 · Indexes'),
  ]),
  category('Transactions & Concurrency', [
    doc('58-63-transactions-mvcc-isolation', '58–63 · Transactions, MVCC & Isolation'),
    doc('64-67-locks-deadlocks-concurrency-patterns', '64–67 · Locks, Deadlocks & Concurrency Patterns'),
  ]),
  category('Query Planning & Performance', [
    doc('68-74-query-planning-explain-performance', '68–74 · Query Planning, EXPLAIN & Performance'),
    doc('75-81-vacuum-storage-buffers', '75–81 · VACUUM, Storage & Buffers'),
  ]),
  category('WAL, Recovery, Replication & HA', [
    doc('82-90-wal-recovery-replication-ha', '82–90 · WAL, Recovery, Replication & HA'),
  ]),
  category('Security', [
    doc('91-97-connections-and-security', '91–97 · Connections & Security'),
  ]),
  category('PostgreSQL Programming & Extensions', [
    doc('98-107-programming-search-extensions-catalogs', '98–107 · Programming, Search, Extensions & Catalogs'),
  ]),
  category('Monitoring & Administration', [
    doc('108-120-monitoring-config-partitioning-and-plans', '108–120 · Monitoring, Configuration, Partitioning & Plans'),
  ]),
  category('Application Development', [
    doc('121-128-application-access-orms-migrations', '121–128 · Application Access, ORMs & Migrations'),
  ]),
  category('Production Operations', [
    doc('129-138-testing-observability-and-operations', '129–138 · Testing, Observability & Operations'),
    doc('150-159-reliability-patterns-and-failure-modes', '150–159 · Reliability Patterns & Failure Modes'),
    doc('160-169-production-scaling-copy-and-versions', '160–169 · Production Scaling, COPY & Versions'),
  ]),
  category('Scaling & Architecture', [
    doc('139-149-cloud-distributed-caching-and-history', '139–149 · Cloud, Distributed Data & Caching'),
    doc('181-192-comparisons-extensions-ai-and-architecture', '181–192 · Comparisons, Extensions, AI & Architecture'),
  ]),
  category('Internals & SQL Standard', [
    doc('170-180-internals-and-sql-standard', '170–180 · Internals & SQL Standard'),
  ]),
  category('Projects', [
    doc('projects/01-library-database', '1 · Library Database'),
    doc('projects/02-ecommerce-database', '2 · E-commerce Database'),
    doc('projects/03-blog-cms-database', '3 · Blog / CMS Database'),
    doc('projects/04-booking-system', '4 · Booking System'),
    doc('projects/05-banking-ledger', '5 · Banking Ledger'),
    doc('projects/06-multi-tenant-saas', '6 · Multi-tenant SaaS'),
    doc('projects/07-analytics-database', '7 · Analytics Database'),
    doc('projects/08-job-queue', '8 · Job Queue'),
    doc('projects/09-full-text-search', '9 · Full-text Search'),
    doc('projects/10-jsonb-product-catalog', '10 · JSONB Product Catalog'),
    doc('projects/11-high-traffic-api-database', '11 · High-traffic API Database'),
    doc('projects/12-production-migration-exercise', '12 · Production Migration Exercise'),
    doc('projects/13-capstone-multi-tenant-saas-platform', 'Capstone · Multi-tenant SaaS Platform'),
  ]),
  category('SQL Exercises', [
    doc('sql-exercises/overview', '300-Exercise Overview'),
    doc('sql-exercises/beginner', 'Beginner'),
    doc('sql-exercises/intermediate', 'Intermediate'),
    doc('sql-exercises/advanced', 'Advanced'),
    doc('sql-exercises/expert', 'Expert'),
    doc('sql-exercises/production', 'Production'),
  ]),
  category('Interview Mastery', [
    doc('interview-mastery/overview', 'Interview Mastery Overview'),
    doc('interview-mastery/query-interview-exercises', 'Query Interview Exercises'),
  ]),
  category('Interview Question Bank', [
    doc('interview-question-bank/overview', '400-Question Overview'),
    doc('interview-question-bank/beginner', 'Beginner'),
    doc('interview-question-bank/intermediate', 'Intermediate'),
    doc('interview-question-bank/advanced', 'Advanced'),
    doc('interview-question-bank/senior', 'Senior'),
    doc('interview-question-bank/staff-database-architecture', 'Staff Database Architecture'),
  ]),
  category('Mock Interview Practice', [
    doc('mock-interview-practice/overview', 'Overview & Scoring'),
    doc('mock-interview-practice/rounds-01-05', 'Rounds 1–5'),
    doc('mock-interview-practice/rounds-06-10', 'Rounds 6–10'),
    doc('mock-interview-practice/rounds-11-15', 'Rounds 11–15'),
  ]),
  category('Reference & Coverage', [
    doc('reference/overview', 'Reference Overview'),
    doc('reference/sql-command-coverage', 'SQL Command Coverage'),
    doc('reference/data-type-coverage', 'Data Type Coverage'),
    doc('reference/functions-and-operators', 'Functions & Operators'),
    doc('reference/official-docs-coverage', 'Official Docs Coverage'),
    doc('reference/w3schools-coverage', 'W3Schools Coverage'),
    doc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

module.exports = sidebars;
