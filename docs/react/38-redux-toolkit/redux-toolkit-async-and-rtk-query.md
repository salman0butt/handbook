---
title: Redux Toolkit Async Logic and RTK Query
description: Separate client state from server state, use createAsyncThunk deliberately, and understand RTK Query's cache and mutation model.
sidebar_position: 2
---

# Redux Toolkit async logic and RTK Query

Redux state management and server-state caching are related but different problems.

Redux Toolkit provides tools for both:

```text
Client state transitions
        │
        ├── slices
        ├── reducers
        └── middleware / thunks

Server-state lifecycle
        │
        └── RTK Query
```

RTK Query is included with Redux Toolkit and is specifically designed for data fetching and caching.

## When `createAsyncThunk` fits

`createAsyncThunk` is useful when an async workflow is genuinely part of your Redux state machine.

```ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const saveDraft = createAsyncThunk(
  'editor/saveDraft',
  async (draft: Draft, { rejectWithValue }) => {
    const response = await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    })

    if (!response.ok) {
      return rejectWithValue('Could not save draft')
    }

    return (await response.json()) as SavedDraft
  },
)
```

A slice can react to pending/fulfilled/rejected actions through `extraReducers`.

```ts
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveDraft.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.saveStatus = 'saved'
        state.lastSaved = action.payload
      })
      .addCase(saveDraft.rejected, (state) => {
        state.saveStatus = 'failed'
      })
  },
})
```

## Do not build a server cache manually by default

This pattern becomes expensive when repeated for every endpoint:

```text
request started
request succeeded
request failed
loading flags
cache lifetime
stale data
retry
refetch
invalidation
optimistic updates
pagination
```

That is a server-state lifecycle problem.

## RTK Query mental model

```text
API endpoint definition
        │
        ▼
createApi()
        │
        ├── generated reducer
        ├── middleware
        ├── cache entries
        └── generated React hooks
                  │
                  ▼
           subscribed components
```

## Define an API slice

```ts
import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

type Product = {
  id: string
  name: string
  price: number
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Product'],
    }),
  }),
})

export const { useGetProductsQuery } = productsApi
```

## Add RTK Query to the store

```ts
export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
})
```

The middleware handles important cache/subscription behavior.

## Query from React

```tsx
function ProductList() {
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery()

  if (isLoading) return <p>Loading products…</p>
  if (isError) return <p>Could not load products.</p>

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## Query cache lifecycle

Conceptually:

```text
component subscribes
       │
       ▼
cache key for endpoint + argument
       │
       ├── cached data available → reuse
       │
       └── missing/stale by policy → request
                 │
                 ▼
              cache entry
```

RTK Query is designed to avoid hand-writing duplicate request/cache logic.

## Mutations

```ts
const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Product'],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (product) => ({
        url: 'products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
})
```

After a successful mutation, invalidating `Product` can cause relevant active queries to refresh.

## Tags are cache dependency metadata

```text
getProducts
provides: Product
       │
       ▼
createProduct
invalidates: Product
       │
       ▼
relevant query may refetch
```

This is more declarative than manually dispatching several fetch actions after every mutation.

## RTK Query vs `createAsyncThunk`

Use RTK Query when the core problem is:

- load remote data;
- cache it;
- deduplicate consumers;
- invalidate after mutations;
- track request state;
- refetch under defined conditions.

Use `createAsyncThunk` when the async work is part of a broader custom Redux workflow that is not primarily a reusable server cache.

## RTK Query vs TanStack Query

Both solve server-state lifecycle problems.

```text
RTK Query
├── integrated with Redux Toolkit store
├── endpoint definitions
├── generated hooks
└── tag-based invalidation

TanStack Query
├── dedicated server-state cache
├── queryKey/queryFn model
├── framework integrations
└── does not require Redux
```

If an application already uses Redux deeply, RTK Query can be a natural fit.

If you do not otherwise need Redux, introducing Redux only to use RTK Query may add architecture you do not need.

## Optimistic updates

RTK Query supports cache lifecycle APIs for optimistic and streaming updates.

The important production model is:

```text
user mutation
    ↓
optimistically patch cache
    ↓
server request
    ├── success → keep result/reconcile
    └── failure → undo or invalidate/refetch
```

Do not treat optimistic state as proof the server accepted the mutation.

## Authentication

A common base-query pattern is to prepare headers:

```ts
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  },
})
```

Remember:

- client tokens are untrusted input to the server;
- authorization still belongs on the backend;
- do not log secrets in middleware/devtools accidentally.

## Common mistakes

### Mirroring query data into a normal slice

Bad:

```text
RTK Query cache
      ↓
copy result into productsSlice
      ↓
now two sources of truth
```

Prefer reading from the cache unless you have a genuine separate client-owned model.

### Treating loading flags as application state

If request state is already owned by RTK Query, avoid duplicating `isProductsLoading` in another slice.

### One API slice per endpoint

The official guidance generally favours grouping endpoints into a small number of API slices, commonly one per base URL, rather than creating an isolated `createApi` for every request.

## Interview questions

**Mid-level:** What problem does RTK Query solve that normal Redux reducers do not solve automatically?

**Senior:** When would you choose `createAsyncThunk` over RTK Query?

**Senior:** What is the difference between tag invalidation and directly editing cached query data?

**Staff:** How would you migrate an application from hand-written request slices to RTK Query without creating duplicate server-state ownership?

## References

- https://redux-toolkit.js.org/rtk-query/overview
- https://redux-toolkit.js.org/rtk-query/usage/queries
- https://redux-toolkit.js.org/tutorials/rtk-query
- https://redux.js.org/tutorials/essentials/part-5-async-logic
