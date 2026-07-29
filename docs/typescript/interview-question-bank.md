---
title: 62 · Interview Question Bank
---

# 62 · Interview Question Bank

This bank contains **310 numbered TypeScript questions** plus model-answer rubrics for high-value senior questions. Use the numbered bank for repetition and the rubrics to practice answer depth.

## Important-question answer rubrics

### A · What is the difference between `any` and `unknown`?

**Question:** When should each be used?

**Expected answer:** Both can represent arbitrary values, but `any` disables checking while `unknown` requires narrowing before use.

**Senior answer:** `unknown` is a trust-boundary type: external data enters as unknown, runtime validation/narrowing establishes facts, then the typed core receives a domain type. `any` is an escape hatch that propagates unsafety and should be contained.

**Weak answer:** “They are basically the same, but unknown is stricter.”

**Follow-up:** How can one `any` from a declaration file contaminate downstream inference?

### B · Why does TypeScript code compile but fail at runtime?

**Question:** What guarantees does TypeScript actually provide?

**Expected answer:** TypeScript statically checks a model of JavaScript; most types erase and runtime values can violate assumptions.

**Senior answer:** Separate checker proof from runtime truth. Assertions, `any`, inaccurate declarations, external inputs, races, authorization, module mismatches, and ordinary logic bugs can all survive compilation. Explain which invariant was statically modeled and where runtime evidence was missing.

**Weak answer:** “TypeScript cannot catch every bug.”

**Follow-up:** Show how `JSON.parse(text) as User` bypasses the intended safety.

### C · Union, overload, or generic?

**Question:** How do you choose?

**Expected answer:** Union for one implementation over several possible values, overload for a finite set of distinct call shapes, generic for a reusable relationship between input/output types.

**Senior answer:** Optimize consumer inference and diagnostics. Avoid overloads when a union gives the same output; avoid generics used only once; avoid conditional types when a small overload set is clearer.

**Weak answer:** “Generics are best because they are reusable.”

**Follow-up:** Refactor a generic API that forces callers to specify three type arguments.

### D · Why can narrowing disappear?

**Question:** Explain using control-flow analysis.

**Expected answer:** Reassignment or uncertain mutation invalidates a previous proof.

**Senior answer:** The checker tracks flow-sensitive observed types while the declared type remains the assignment envelope. Assignments, aliases, callbacks, and property mutation can invalidate facts. Capture a proven value in a local `const` when appropriate rather than asserting.

**Weak answer:** “TypeScript forgets sometimes.”

**Follow-up:** Why are object-property refinements more fragile than local consts?

### E · Why do conditional types distribute?

**Question:** When does distribution happen?

**Expected answer:** A conditional over a naked type parameter distributes over a union.

**Senior answer:** For `T extends U ? X<T> : Y<T>`, if `T` is a union and appears naked on the checked side, evaluate per union member then union the results. Wrap both sides, such as `[T] extends [U]`, to test the union as a whole.

**Weak answer:** “Conditional types automatically loop unions.”

**Follow-up:** Give a case where suppressing distribution changes API semantics.

### F · What does `satisfies` do?

**Expected answer:** Checks assignability to a target while preserving useful inferred type of the expression.

**Senior answer:** Compare annotation, assertion and `satisfies`: annotation gives the variable the declared target view; assertion overrides/requests a view; `satisfies` validates compatibility without replacing the expression type. It is valuable for config maps whose exact keys should remain inferable.

**Weak answer:** “It is a safer `as`.”

**Follow-up:** When might `as const` still be useful with `satisfies`?

### G · Explain structural typing and one soundness trade-off.

**Expected answer:** Compatibility is mostly based on shape rather than explicit nominal names.

**Senior answer:** Structural typing matches JavaScript composition and makes extra-member values broadly reusable, but accidental compatibility and mutable variance can create unsound edges. Brands/private members can introduce nominal-like distinctions when domain identity matters.

**Weak answer:** “If properties match, everything is safe.”

**Follow-up:** Why do private/protected class members change compatibility?

### H · What is variance?

**Expected answer:** It describes how generic compatibility changes with subtype relationships.

**Senior answer:** Explain covariance for readonly producers, contravariance for consumers/callback parameters, invariance for producer+consumer mutable types, and bivariance in selected compatibility contexts. Tie mutable array unsoundness to write operations.

**Weak answer:** Only defines covariance.

**Follow-up:** Why is `readonly Dog[]` easier to treat covariantly than `Dog[]`?

### I · Why is `request<T>(url): Promise<T>` not type-safe by itself?

**Expected answer:** Caller chooses `T`; runtime response is not validated.

**Senior answer:** Bind static type to runtime evidence through an endpoint descriptor/schema/decoder. Parse raw data as `unknown`, validate it, and infer `T` from the validator rather than caller assertion.

**Weak answer:** “Because network requests can fail.”

**Follow-up:** Design a better endpoint API.

### J · How should a monorepo use project references?

**Expected answer:** Split into composite projects and use `tsc -b` dependency order/incremental builds.

**Senior answer:** References should mirror ownership/public declaration boundaries, reduce semantic scope, prevent accidental graph coupling, and improve clean/incremental/editor performance. They do not fix a bad graph with deep cross-package imports.

**Weak answer:** “Turn on `composite` everywhere.”

**Follow-up:** What should CI cache and what can invalidate a referenced build?

### K · TypeScript type vs runtime schema?

**Expected answer:** Type is compile-time; schema validates runtime data.

**Senior answer:** At external boundaries, schema/runtime parser is authoritative evidence. Derive static types from schema when semantics match; map to separate domain models when business invariants differ.

**Weak answer:** “Schemas are for backend, types are for frontend.”

**Follow-up:** Should frontend and backend share the database model type?

### L · How do you debug a huge generic error?

**Expected answer:** Inspect actual/expected types and break the expression into smaller aliases.

**Senior answer:** State failed relationship, substitute concrete type arguments, inspect mapped layers, determine conditional distribution, isolate inference vs assignability, and build a minimal repro. Avoid casting away the symptom.

**Weak answer:** “Read the last line and add a type annotation.”

**Follow-up:** What does a sudden `never` often indicate?

### M · How can a type change be semver-breaking?

**Expected answer:** Consumers compile against declarations, so tighter or different types can break them.

**Senior answer:** Union additions can break exhaustive consumers, generic-default/inference changes can alter inferred outputs, declaration entrypoint changes can break resolution, and overload reordering can change selection. Test consumer fixtures and declaration diffs.

**Weak answer:** “Only runtime API changes are breaking.”

**Follow-up:** Is adding a union member always additive?

### N · What changed operationally in TypeScript 7.0?

**Expected answer:** Native Go-based compiler/language service generation with major performance improvements.

**Senior answer:** TypeScript 7.0 is the stable native compiler baseline, but 7.0 does not ship the old programmatic Compiler API replacement; tool authors may need TypeScript 6 compatibility side-by-side. Separate language compatibility, tool API compatibility, editor/LSP integration, and build performance.

**Weak answer:** “It is just faster TypeScript.”

**Follow-up:** How would you upgrade a tool that directly imports compiler APIs?

### O · Why is a TypeScript type not an authorization check?

**Expected answer:** Authorization is runtime policy about current identity/resource/action.

**Senior answer:** A correctly typed `User` and `ProjectId` prove only static shape/identity distinctions. Authorization requires runtime resource scoping, tenant context, policy evaluation, and often current data. Types can structure the API but cannot grant permission.

**Weak answer:** “Types are compile-time.”

**Follow-up:** Where should authorization occur in a layered backend?

---

# 310-question bank

## Basics — 001–005

001. What problem does TypeScript solve on top of JavaScript?
002. What is static type checking?
003. What is gradual typing?
004. What is the difference between checking and emitting JavaScript?
005. Which parts of TypeScript normally disappear at runtime?

## Compiler workflow — 006–010

006. What happens conceptually during scanning, parsing, binding and checking?
007. What is a diagnostic?
008. What does `tsc --noEmit` do?
009. Why can a transpiler compile `.ts` without type-checking?
010. How can editor and CI TypeScript behavior differ?

## Primitive types — 011–015

011. Why should you usually write `string` instead of `String`?
012. How are `null` and `undefined` modeled under strict null checks?
013. What is the type of a bigint literal?
014. How do symbols differ from string keys?
015. When does a primitive literal widen?

## Arrays & tuples — 016–020

016. How does a tuple differ from an array?
017. What are named tuple elements?
018. What is a variadic tuple?
019. Why prefer readonly arrays for read-only APIs?
020. How do you extract a tuple element union with indexed access?

## Object types — 021–025

021. What is an object type literal?
022. What does `readonly` guarantee and not guarantee?
023. What is an index signature?
024. Why is `Record<string, T>` sometimes too optimistic?
025. What is excess property checking?

## Optional properties — 026–030

026. How does `foo?: string` differ from `foo: string | undefined`?
027. What does `exactOptionalPropertyTypes` change?
028. When is absence semantically different from explicit undefined?
029. How do spreads affect optional properties?
030. Why are TypeScript object types not exact by default?

## Interfaces vs types — 031–035

031. What can both interfaces and type aliases express?
032. What is declaration merging?
033. When is interface extension clearer than intersection?
034. Which constructs require a type alias rather than an interface?
035. Why is “always use interface” poor guidance?

## Unions — 036–040

036. What operations are allowed on a union before narrowing?
037. What makes a union discriminated?
038. How do discriminated unions prevent impossible states?
039. How would you model a Result type?
040. When is a union preferable to optional fields?

## Intersections — 041–045

041. What does `A & B` mean statically?
042. Does an intersection merge runtime objects?
043. Why can `string & number` become `never`?
044. What happens with conflicting property intersections?
045. When is interface extension safer to read than intersections?

## Narrowing — 046–050

046. How does `typeof` narrowing work?
047. What does the `in` operator prove?
048. How does `instanceof` depend on runtime prototypes?
049. What is equality narrowing?
050. Why can truthiness narrowing mishandle `0` or empty strings?

## Control-flow analysis — 051–055

051. What is flow-sensitive observed type?
052. How does reachability narrow a union?
053. How can assignment narrow or widen a variable?
054. Why can mutation invalidate a property refinement?
055. When is copying a narrowed value to `const` useful?

## Type guards — 056–060

056. What is a user-defined type predicate?
057. Why can an incorrect predicate be unsafe?
058. What is an assertion function?
059. When should a runtime schema replace hand-written guards?
060. How do guards differ from assertions?

## Functions — 061–065

061. What is contextual typing of a callback?
062. How are optional/default/rest parameters typed?
063. What does an explicit return annotation provide?
064. What is a higher-order function?
065. How do function expressions differ from declarations for inference/context?

## `void` / `never` — 066–070

066. What does `void` mean in a callback contract?
067. Why can a value-returning function often satisfy a `void` callback?
068. What programs naturally return `never`?
069. How is `never` used for exhaustiveness?
070. Why is `never` useful when debugging impossible intersections?

## Overloads — 071–075

071. What is an overload signature?
072. What is the implementation signature?
073. Why can the implementation accept a union callers cannot use directly?
074. When are overloads preferable to a generic?
075. How can overload ordering affect consumers?

## `any` — 076–080

076. How does `any` propagate unsafety?
077. When can `any` be justified in a migration?
078. How do you contain an `any` boundary?
079. How can third-party declarations introduce `any`?
080. Why can “no explicit any” still leave implicit unsafety?

## `unknown` — 081–085

081. Why is `unknown` appropriate for JSON/external input?
082. What operations can you perform on unknown before narrowing?
083. How do you turn unknown into a trusted domain type?
084. How does unknown behave in unions/intersections?
085. Why is unknown preferable to a generic caller-selected response type at a network boundary?

## Assertions — 086–090

086. What does `as` do at runtime?
087. What risk does non-null `!` introduce?
088. What is a definite assignment assertion?
089. Why is `as unknown as T` a high-risk escape hatch?
090. When is `@ts-expect-error` better than `@ts-ignore`?

## Literal inference — 091–095

091. Why does `const x = "a"` preserve a literal more than `let x = "a"`?
092. What does `as const` do to object/tuple inference?
093. Does `as const` freeze an object at runtime?
094. What is a const type parameter?
095. When can over-annotation destroy useful literals?

## Generics basics — 096–100

096. What relationship does `identity<T>(x:T):T` express?
097. Why is a generic type parameter not the same as `any`?
098. When should callers omit explicit generic arguments?
099. What is a generic default?
100. What makes a generic parameter “useless”?

## Generic constraints — 101–105

101. What does `T extends U` mean in a generic declaration?
102. How does a constraint preserve more information than annotating directly as U?
103. How do multiple generic parameters model independent relationships?
104. How can a too-broad constraint harm inference?
105. How can a too-narrow constraint harm reuse?

## `keyof` — 106–110

106. What does `keyof T` produce?
107. How do numeric/string index signatures affect `keyof`?
108. How do you constrain a property key generic?
109. Why use `keyof typeof value`?
110. When is a finite key union better than `string`?

## Type-position `typeof` — 111–115

111. How does type-position `typeof` differ from runtime `typeof`?
112. How do you derive a type from a runtime config constant?
113. Why is `typeof` useful with `as const`?
114. Can type-position `typeof` inspect arbitrary runtime values not in source scope?
115. How can `typeof fn` help type wrappers/tests?

## Indexed access — 116–120

116. What does `T[K]` mean?
117. How do you extract all value types from an object?
118. What does `(typeof tuple)[number]` produce?
119. Why must generic K often extend `keyof T`?
120. How does optionality affect indexed access results?

## Mapped types — 121–125

121. What is a mapped type?
122. How do you add/remove readonly in a mapped type?
123. How do you add/remove optionality?
124. What is key remapping with `as`?
125. How does remapping a key to `never` filter it?

## Conditional types — 126–130

126. What question does `T extends U ? A : B` ask?
127. What is distributive conditional behavior?
128. How do you prevent distribution?
129. When can nested conditionals harm readability/performance?
130. How are conditional types different from runtime `if`?

## `infer` — 131–135

131. Where can `infer` be introduced?
132. How do you infer a function return type?
133. How do you infer tuple head/tail?
134. What happens when a pattern does not match?
135. Why can multiple inference sites create unions/intersections or ambiguity?

## Template literal types — 136–140

136. How do template literal unions expand?
137. How can you derive event names from property keys?
138. What do `Capitalize` and `Lowercase` do?
139. Why are parsing-style template types version/performance sensitive at scale?
140. Why do template literal types not validate runtime strings?

## Utility types — 141–145

141. How is `Partial<T>` mentally implemented?
142. When is `Omit` dangerous for public DTO design?
143. What do `Exclude` and `Extract` operate on?
144. What does `Awaited<T>` model?
145. When do `Parameters`/`ReturnType` create hidden coupling?

## Classes — 146–150

146. What does `implements` check?
147. How does TypeScript `private` differ from JS `#private`?
148. What does strict property initialization enforce?
149. What is polymorphic `this`?
150. What trade-off do parameter properties introduce?

## Enums — 151–155

151. What runtime object does a normal enum create?
152. What is numeric reverse mapping?
153. Why can `const enum` be problematic in libraries/isolated transforms?
154. How does an `as const` object + union compare to a string enum?
155. When is an enum's runtime identity useful?

## Structural typing — 156–160

156. Why is an object with extra members assignable to a smaller shape?
157. Why are fresh object literals checked differently?
158. What are nominal islands in TypeScript?
159. How do private/protected members affect class compatibility?
160. What accidental compatibility risks exist in structural systems?

## Variance — 161–165

161. Define covariance.
162. Define contravariance.
163. Define invariance.
164. Define bivariance.
165. How does mutability determine safe variance?

## Function compatibility — 166–170

166. Why is return-type covariance usually safe?
167. Why is callback parameter contravariance relevant?
168. What does `strictFunctionTypes` improve?
169. How do methods differ from plain function properties in compatibility contexts?
170. Why can ignoring extra callback arguments be safe?

## Advanced inference — 171–175

171. What is best common type inference?
172. What candidate sources contribute to generic inference?
173. What is contextual inference direction?
174. When should explicit type arguments be supplied?
175. How do you redesign an API for better inference ergonomics?

## `satisfies` — 176–180

176. How does annotation differ from `satisfies`?
177. How does assertion differ from `satisfies`?
178. What inferred information can `satisfies` preserve?
179. Does `satisfies` perform runtime validation?
180. How do `as const` and `satisfies` complement each other?

## Nullability — 181–185

181. What does `strictNullChecks` change?
182. Optional chaining vs nullish coalescing?
183. Why is `??` often safer than `||` for defaults?
184. How does `noUncheckedIndexedAccess` model missing keys?
185. When should a domain use null vs undefined vs discriminated absence?

## Advanced function APIs — 186–190

186. What is a generic call signature?
187. What is a construct signature?
188. How do you type a callable object with properties?
189. What is a TypeScript `this` parameter?
190. How can a staged builder encode construction state?

## Modules — 191–195

191. What is the difference between runtime and type dependency edges?
192. Why use `import type`?
193. What determines ESM/CJS interpretation in Node-aware modes?
194. Why can barrel files create runtime cycles?
195. Why must module config match the actual runtime/bundler?

## Module resolution — 196–200

196. `nodenext` vs `bundler` resolution?
197. Why is `node10` legacy for modern Node?
198. How do package `exports` affect TypeScript resolution?
199. Why do `paths` aliases not automatically work at runtime?
200. How do you debug a module-resolution mismatch?

## TSConfig strictness — 201–205

201. What does `strict` enable conceptually?
202. Why use `exactOptionalPropertyTypes`?
203. Why use `noImplicitOverride`?
204. What does `noPropertyAccessFromIndexSignature` communicate?
205. How would you roll stricter flags into a mature repo?

## TSConfig emit/modules — 206–210

206. What is `target` responsible for?
207. What is `module` responsible for beyond syntax emit in Node modes?
208. When should an app use `noEmit`?
209. What are declaration maps for?
210. What does `verbatimModuleSyntax` encourage?

## Project references — 211–215

211. What does `composite` mean?
212. What does `tsc -b` do?
213. How do declarations form project boundaries?
214. How can references improve editor performance?
215. What graph problems can references expose?

## Declaration files — 216–220

216. What does a `.d.ts` file provide at runtime?
217. What does `declare` mean?
218. What is an ambient module shim?
219. Bundled typings vs `@types/*`?
220. How can inaccurate declarations create runtime bugs?

## Library design — 221–225

221. Why curate package exports?
222. How do you test an SDK's inferred types?
223. Why can dual ESM/CJS publishing be complex?
224. What does `sideEffects` metadata communicate to bundlers?
225. How can a type-only API change be breaking?

## JavaScript interop — 226–230

226. What do `allowJs` and `checkJs` do?
227. How does `@ts-check` help migration?
228. What can JSDoc generics/type annotations express?
229. How should you handle an untyped legacy dependency?
230. Why convert leaf modules first?

## Runtime validation — 231–235

231. Why should external data enter as `unknown`?
232. What makes a validator trustworthy?
233. When should types derive from runtime schemas?
234. Why validate environment variables?
235. Why can database values still require validation/mapping?

## Error handling — 236–240

236. Why should caught values be `unknown`?
237. When is a custom Error class useful?
238. Expected failure vs exceptional failure?
239. What does `Promise<Result<T,E>>` imply about error channels?
240. How do you exhaustively handle domain errors?

## Async — 241–245

241. How does async function return typing work?
242. `Promise.all` vs `allSettled`?
243. Does `Promise.race` cancel losers?
244. How do you type cancellation with `AbortSignal`?
245. Concurrency vs parallelism?

## Iterators/generators — 246–250

246. `Iterable<T>` vs `Iterator<T>`?
247. What are the three generic parameters of `Generator` conceptually?
248. What does `yield*` do?
249. How do async iterables differ from promises of arrays?
250. How should streaming APIs model cleanup/cancellation?

## Decorators — 251–255

251. Modern decorators vs legacy `experimentalDecorators`?
252. What does a decorator context describe?
253. Can TypeScript types automatically become runtime metadata?
254. Why can decorator migration be framework-sensitive?
255. What should you test when changing decorator modes?

## JSX/React — 256–260

256. Why does `.tsx` change generic arrow syntax?
257. What determines intrinsic JSX element typing?
258. How do discriminated unions improve component props?
259. Why should form values still be runtime validated?
260. How can a context default accidentally hide absence?

## Node — 261–265

261. What does Node's stable TypeScript type stripping do?
262. Does Node type stripping type-check or read tsconfig?
263. Why must type-only imports be explicit for direct stripping workflows?
264. How should `process.env` be modeled?
265. What runtime/transpile strategies exist for Node TypeScript?

## Backend/API design — 266–270

266. DTO vs domain entity vs persistence model?
267. Why should database models not automatically be public response types?
268. What does a branded ID prevent and not prevent?
269. How should pagination be modeled?
270. How should distributed event contracts be versioned?

## Architecture/domain — 271–275

271. What is a vertical slice?
272. Why avoid giant global `types.ts`?
273. What is schema ownership?
274. What is primitive obsession?
275. How can factories preserve domain invariants?

## Type-level programming — 276–280

276. When is type-level programming appropriate?
277. What makes deep utility types dangerous?
278. How would you implement `KeysMatching`?
279. How does `UnionToIntersection` exploit parameter positions?
280. When should code generation replace type-level computation?

## Soundness — 281–285

281. Name three intentional/inevitable unsound edges in TypeScript.
282. How can mutable array aliases violate assumptions?
283. Why can stale refinements be dangerous?
284. How do assertions affect soundness?
285. Why does structural typing trade nominal safety for JS ergonomics?

## Compiler/language service — 286–290

286. Symbol vs type?
287. What is a `SourceFile` conceptually?
288. Why does the language service have different workloads from batch `tsc`?
289. What is contextual typing inside the checker?
290. Why should private compiler internals not be treated as stable APIs?

## Compiler API / TypeScript 7 — 291–295

291. What is the TypeScript 7.0 Compiler API caveat?
292. Why might tooling run TypeScript 6 API compatibility side-by-side with TypeScript 7?
293. What tasks use AST/type-checker APIs?
294. What risks do codemods have beyond text replacement?
295. How would you isolate version-sensitive compiler tooling?

## Performance/debugging/testing — 296–300

296. How do giant unions/recursive conditionals affect compiler performance?
297. What is the `skipLibCheck` trade-off?
298. What is your workflow for a huge generic diagnostic?
299. Runtime tests vs type tests?
300. What makes a good minimal TypeScript reproduction?

## Lint/build/security — 301–305

301. Why use typescript-eslint type-aware linting and project service?
302. Why can typed linting be slower?
303. Why can Babel/SWC/esbuild accept TS without proving type correctness?
304. Why is a TypeScript type not an authorization check?
305. How can an unsafe assertion become a security problem at a token/claims boundary?

## Production/migration/staff/system design — 306–310

306. How do you govern strictness across dozens of teams?
307. What metrics would you track during a large JavaScript→TypeScript migration?
308. How do you canary a TypeScript compiler upgrade?
309. How do you govern generated vs handwritten types across an organization?
310. Design a production TypeScript platform that keeps runtime schemas, APIs, domain models, events, packages, CI, security and compiler performance aligned.

---

## How to practice the bank

For every question, answer aloud using:

```text
define → mechanism → example → trade-offs → production implication
```

For questions 161–170, draw the variance/compatibility relationship. For 191–215, draw the module/project graph. For 231–240 and 301–310, explicitly identify the runtime trust boundary. For 286–295, separate stable conceptual compiler models from version-sensitive programmatic APIs.

A strong score is not “310 memorized sentences.” It is the ability to reconstruct answers from the mental models taught throughout the handbook.