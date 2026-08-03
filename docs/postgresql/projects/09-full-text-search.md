---
id: project-09-full-text-search
title: "Project 9 — Full-Text Search"
---

# Project 9 — Full-Text Search

## Requirements

Search articles/products across weighted title/body text, support web-style queries, ranking, language configurations, phrase/prefix behavior, typo/fuzzy fallback, and tenant/status filters.

## ER diagram

```text
Tenant 1──< Document >──1 SearchVector
Document >──< Tag
```

## Schema

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TABLE documents (
  tenant_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuidv7(),
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','published')),
  language regconfig NOT NULL DEFAULT 'english',
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector(language, coalesce(title,'')), 'A') ||
    setweight(to_tsvector(language, coalesce(body,'')), 'B')
  ) STORED,
  PRIMARY KEY (tenant_id, id)
);
CREATE INDEX documents_search_gin ON documents USING gin(search_vector);
CREATE INDEX documents_title_trgm ON documents USING gin(title gin_trgm_ops);
CREATE INDEX documents_tenant_status_idx ON documents(tenant_id, status, id);
```

## Seed / SQL

Seed multilingual-ish document sets with stop words, similar titles and misspellings. Implement:

```sql
SELECT id, title,
       ts_rank(search_vector, q) AS rank
FROM documents,
     websearch_to_tsquery('english', $query) AS q
WHERE tenant_id = $tenant
  AND status = 'published'
  AND search_vector @@ q
ORDER BY rank DESC, id
LIMIT 20;
```

Add trigram fallback for title suggestions only when FTS returns too few results.

## Transactions/concurrency

Generated vectors update with the document in one statement/transaction. Tag changes are relational; search publication state changes atomically with content revision.

## EXPLAIN

Compare GIN FTS, trigram search, and `%term%` without trigram. Observe tenant filter + GIN bitmap combinations, ranking sort cost, and result limits.

## Tests/security/failures

Stop words, empty query, punctuation, Unicode, typo, draft leakage, wrong tenant, ranking ties, very long documents, generated vector update, extension unavailable on restore/provider.

## Acceptance criteria

Published-only tenant-scoped search is correct, indexed, deterministic at ties, and measured; restore documentation installs extensions first.

## Interview / senior review

FTS vs `ILIKE` vs trigram; GIN write cost; language dictionaries; relevance calibration; when dedicated search infrastructure is justified; how permissions interact with ranking/index filters.