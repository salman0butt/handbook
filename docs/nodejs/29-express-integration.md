---
title: Express Integration
---

# Express Integration

Express is a minimal HTTP framework layered on Node's request/response model. Learn Node first so framework abstractions remain understandable.

```js
import express from 'express';
const app = express();
app.use(express.json({limit: '1mb'}));

app.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    if (!order) return res.sendStatus(404);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  req.log?.error?.(err);
  res.status(500).json({code: 'INTERNAL_ERROR'});
});
```

Adapt async-handler details to the Express major version you deploy; do not copy legacy patterns without checking current framework behavior.

## Architecture

Keep request parsing/response formatting in routers/controllers. Inject application services. Avoid controllers that perform SQL, authorization, email, cache, and queue operations inline.

## Security

- size-limit parsers;
- validate after parsing;
- configure proxy trust explicitly;
- set security headers at the appropriate layer;
- use strict CORS policy where browsers are involved;
- never assume route presence equals authorization.

## Testing

Test handlers through HTTP/injection tools plus unit-test application services separately. The framework should be a thin adapter around behavior that remains testable without Express globals.

## Production

Set server timeouts on the underlying Node server, coordinate graceful shutdown, expose readiness separately from liveness, and propagate abort/deadline signals to owned downstream operations.
