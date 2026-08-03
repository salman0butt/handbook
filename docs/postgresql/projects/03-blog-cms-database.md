---
id: project-03-blog-cms-database
title: "Project 3 — Blog / CMS Database"
---

# Project 3 — Blog / CMS Database

## Requirements and ER diagram

Users author posts; posts have immutable revisions, tags, comments, moderation state, and full-text search.

```text
User 1──< Post 1──< Revision
Post >──< Tag
Post 1──< Comment >──1 User
Post 1──1 SearchVector
```

## Schema

Use `users`, `posts`, `post_revisions`, `tags`, `post_tags`, `comments`, and `moderation_events`. Enforce unique slugs, `(post_id, revision_no)`, tag names, FK ownership, valid status checks, and parent-comment references.

```sql
CREATE TABLE post_revisions (
  post_id bigint REFERENCES posts(id) ON DELETE CASCADE,
  revision_no integer CHECK (revision_no > 0),
  title text NOT NULL,
  body text NOT NULL,
  created_by bigint NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(post_id, revision_no)
);
```

Add generated/stored `tsvector` search data or a maintained search column, with GIN. Add `(author_id, published_at DESC, id DESC)` and `(post_id, created_at, id)` indexes.

## Seed / SQL

Seed authors, editors, 50 posts with revisions/tags/comments including draft/published/deleted edge cases. Implement latest revision, revision history, tag pages, threaded comments, moderation queue, search ranking, and keyset archive pagination.

## Transactions and concurrency

Publishing creates a revision and updates current post state atomically. Serialize revision-number allocation per post using row lock or a separate sequence-like mechanism. Slug uniqueness is enforced by the DB, not an existence check.

## EXPLAIN analysis

Compare full-text GIN lookup to `ILIKE '%term%'`; inspect author archive sort/index behavior and tag many-to-many join cardinality.

## Tests / security / failures

Test duplicate slug, revision races, deleted author behavior, recursive comment cycles policy, search with empty text, unauthorized draft visibility, and moderation retries. Runtime author/editor roles are represented by application authorization; DB runtime role has least privileges. Avoid exposing drafts through a broad view.

## Acceptance criteria

Every published change has a revision; search is indexed; concurrent revisions cannot share numbers; schema supports audit history; restore smoke test reproduces search and constraints.

## Interview questions / senior review

Why immutable revisions? When should comments use adjacency list vs closure table? FTS vs trigram? How would high-volume comments partition/archive? How do cache invalidation and search indexing stay consistent?