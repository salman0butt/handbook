---
title: DNS
---

# DNS

Node exposes two importantly different DNS paths.

## `lookup()` vs resolver queries

`dns.lookup()` uses operating-system name-resolution facilities and follows local host configuration. APIs under `dns.resolve*()` perform DNS queries through Node's resolver facilities and return DNS records more directly.

```js
import { lookup, resolve4 } from 'node:dns/promises';

console.log(await lookup('example.com'));
console.log(await resolve4('example.com'));
```

The distinction matters because OS resolver configuration, `/etc/hosts`, search domains, caching layers, and DNS servers can produce different behavior.

## Runtime implications

Selected lookup behavior may involve the libuv worker pool because platform resolver calls can be blocking APIs. Direct resolver operations use different machinery. Do not assume every DNS call is “just network I/O.”

## IPv4 / IPv6

Production code should not assume one family. Test dual-stack behavior, bind addresses intentionally, and understand ordering/fallback behavior of the clients and infrastructure you deploy.

## Service discovery

DNS is commonly used for service discovery, but records change over time. A process that resolves once at startup can hold stale endpoints. Conversely, resolving on every request can amplify DNS dependency and latency. Pick a refresh/caching strategy aligned with TTLs and client behavior.

## Incident reasoning

```text
requests fail
  ↓
is TCP connection attempted?
  ├─ no → DNS / resolver / config problem?
  └─ yes → route / firewall / remote listener?
```

Measure DNS separately from connect, TLS, and server response latency. Retries against a broken resolver can become a retry storm.
