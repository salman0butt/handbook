export function examples(topic, category) {
  const primitive = {
    string: ['const name: string = "Ada"', 'const upper = name.toUpperCase()'],
    number: ['const total: number = 42.5', 'const rounded = Math.round(total)'],
    boolean: ['const enabled: boolean = true', 'if (enabled) console.log("ready")'],
    bigint: ['const bytes: bigint = 9_007_199_254_740_993n', 'const doubled = bytes * 2n'],
    symbol: ['const token: unique symbol = Symbol("token")', 'type Registry = { [token]: string }'],
    null: ['const selected: string | null = null', 'const label = selected ?? "None"'],
    undefined: ['let result: string | undefined', 'const length = result?.length'],
    void: ['function log(message: string): void {\n  console.log(message)\n}', 'log("saved")'],
    never: ['function fail(message: string): never {\n  throw new Error(message)\n}', 'function assertNever(value: never): never {\n  throw new Error(String(value))\n}'],
    unknown: ['const payload: unknown = JSON.parse(input)', 'if (typeof payload === "string") console.log(payload.toUpperCase())'],
    any: ['let legacyValue: any', 'const safer: unknown = legacyValue'],
    object: ['function acceptObject(value: object) { return value }', 'acceptObject({ id: 1 })'],
  };
  if (primitive[topic]) return [...primitive[topic], 'const value: any = readValue()\nvalue.missing.method()', 'const value: unknown = readValue()\nif (typeof value === "string") console.log(value)'];

  const utility = new Set(['Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'Record', 'Exclude', 'Extract', 'NonNullable', 'Parameters', 'ConstructorParameters', 'ReturnType', 'InstanceType', 'Awaited', 'ThisParameterType', 'OmitThisParameter', 'NoInfer']);
  if (utility.has(topic)) return [`type Example = ${topic}<User>`, 'type Patch = Partial<Pick<User, "name" | "active">>', 'type Patch = { name?: string; active?: boolean }', 'type Patch = Partial<Pick<User, "name" | "active">>'];

  if (['tsconfig.json', 'Strictness Options', 'Setup and Tooling', 'Compiler Fundamentals'].includes(category)) return ['{\n  "compilerOptions": {\n    "strict": true,\n    "noUncheckedIndexedAccess": true\n  }\n}', 'npx tsc --showConfig', '{ "compilerOptions": { "strict": false } }', '{ "compilerOptions": { "strict": true } }'];
  if (['Generics', 'keyof and Indexed Access', 'typeof and Value-to-Type Patterns', 'Mapped Types', 'Conditional Types', 'infer Keyword', 'Template Literal Types', 'Advanced Type Patterns', 'Type-Level Programming', 'Variance'].includes(category)) return ['type Box<T> = { value: T }\nconst box: Box<string> = { value: "safe" }', 'function get<T, K extends keyof T>(value: T, key: K): T[K] {\n  return value[key]\n}', 'type Flexible = any', 'type Flexible<T> = { value: T }'];
  if (['Union and Intersection Types', 'Type Narrowing', 'Error Handling', 'Null and Undefined'].includes(category)) return ['type Result<T, E> =\n  | { ok: true; value: T }\n  | { ok: false; error: E }', 'function show(result: Result<string, Error>) {\n  return result.ok ? result.value : result.error.message\n}', 'type State = { loading: boolean; data?: string; error?: Error }', 'type State = { kind: "loading" } | { kind: "ready"; data: string } | { kind: "failed"; error: Error }'];
  if (['Modules', 'Declaration Files', 'Libraries and Type Definitions', 'Library Authoring'].includes(category)) return ['import { createUser, type User } from "./user.js"\nexport type { User }', 'export declare function createClient(options: ClientOptions): Client', 'export const client: any', 'export declare function createClient(options: ClientOptions): Client'];
  if (category === 'Project References') return ['{\n  "files": [],\n  "references": [{"path": "./packages/domain"}]\n}', 'npx tsc --build --verbose', '{ "include": ["packages/**/*"] }', '{ "files": [], "references": [{"path": "./packages/domain"}] }'];
  if (category === 'TypeScript with React') return ['type Props = { value: string; onChange(value: string): void }', 'function Field({ value, onChange }: Props) {\n  return <input value={value} onChange={e => onChange(e.currentTarget.value)} />\n}', 'function Field(props: any) { return <input {...props} /> }', 'function Field({ value, onChange }: Props) { return <input value={value} onChange={e => onChange(e.currentTarget.value)} /> }'];
  if (category === 'TypeScript with Vue') return ['const props = defineProps<{ value: string; disabled?: boolean }>()', 'const emit = defineEmits<{ change: [value: string] }>()', 'const props = defineProps<any>()', 'const props = defineProps<{ value: string; disabled?: boolean }>()'];
  if (['Runtime Validation', 'API Design', 'Database Types', 'Security'].includes(category)) return ['const raw: unknown = await response.json()', 'const value = PayloadSchema.parse(raw)', 'const value = (await response.json()) as Payload', 'const raw: unknown = await response.json()\nconst value = PayloadSchema.parse(raw)'];
  if (['Type Testing', 'Testing TypeScript Applications'].includes(category)) return ['expectTypeOf(createUser({ name: "Ada" })).toEqualTypeOf<User>()', '// @ts-expect-error numbers are invalid names\ncreateUser({ name: 123 })', 'const result = value as any', 'expectTypeOf(value).toMatchTypeOf<Expected>()'];
  if (category === 'ESLint and Code Quality') return ['await saveUser(user)', 'void backgroundTask().catch(reportError)', 'backgroundTask()', 'void backgroundTask().catch(reportError)'];
  if (category === 'Performance') return ['npx tsc --noEmit --extendedDiagnostics', 'npx tsc --generateTrace .trace', 'type ExpandForever<T> = { [K in keyof T]: ExpandForever<T[K]> }', 'measure first, name intermediate types, and simplify the public surface'];
  if (['Architecture', 'Production Engineering'].includes(category)) return ['type UserId = string & { readonly __brand: "UserId" }', 'type CreateUserResult = Result<User, DuplicateEmailError>', 'export type SharedModel = DatabaseRow & ApiResponse', 'map database rows to domain types and domain types to public DTOs'];
  return ['type Input = { id: string; value: string }\nfunction process(input: Input): string {\n  return input.value.trim()\n}', 'type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }', 'function process(input: any): any { return input.value }', 'function process(input: Input): string { return input.value.trim() }'];
}
