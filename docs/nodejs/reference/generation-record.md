---
title: Node.js Handbook Generation Record
sidebar_label: Generation Record
slug: /nodejs/reference/generation-record
---

# Node.js handbook generation record

This page records the reproducible expansion completed on **August 2, 2026**.

The final handbook content was reconstructed from a checksum-verified bundle with SHA-256 digest `97f2776ea7fa381ddca1f074e0d6c4388373393211769aa899e867c332078739`. The temporary bundle and generation workflow were removed before merge. Permanent repository files contain the actual Markdown, sidebar, validator, configuration, and GitHub Actions sources; the published site has no runtime dependency on the generator.

## Validation contract

The permanent quality gate runs:

```bash
npm install --no-audit --no-fund
npm run validate:nodejs
npm run validate:mermaid
npm run build
```

The Pages deployment workflow repeats the dedicated Node.js validation before producing the public artifact. This record exists for auditability only and is not a substitute for the source files, CI results, merge commit, or deployment run.
