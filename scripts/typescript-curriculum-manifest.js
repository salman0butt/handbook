const part0 = require('./typescript-curriculum/part-0.json');
const part1 = require('./typescript-curriculum/part-1.json');
const part2 = require('./typescript-curriculum/part-2.json');
const part3 = require('./typescript-curriculum/part-3.json');
const part4 = require('./typescript-curriculum/part-4.json');
const part5 = require('./typescript-curriculum/part-5.json');
const part6 = require('./typescript-curriculum/part-6.json');
const part7 = require('./typescript-curriculum/part-7.json');

module.exports = {
  baselineDate: '2026-08-01',
  typescriptVersion: '7.0.2',
  nodeCiVersion: '24',
  categoryCount: 59,
  topicCount: 661,
  categories: [...part0,...part1,...part2,...part3,...part4,...part5,...part6,...part7],
  legacyPaths: ["docs/typescript/01-05-foundations-to-unions.md", "docs/typescript/06-10-narrowing-functions-safety-literals.md", "docs/typescript/11-16-generics-and-type-manipulation.md", "docs/typescript/17-25-classes-compatibility-inference-nullability-functions.md", "docs/typescript/26-31-modules-tsconfig-monorepos-declarations-libraries-js.md", "docs/typescript/32-39-runtime-validation-errors-async-decorators-jsx-react-node.md", "docs/typescript/40-49-backends-architecture-domain-type-level-compiler-performance-debugging.md", "docs/typescript/50-59-testing-linting-build-security-production-migration-patterns-staff.md", "docs/typescript/projects.md", "docs/typescript/interview-mastery.md", "docs/typescript/interview-question-bank.md", "docs/typescript/mock-interviews.md", "docs/typescript/reference/api-coverage.md", "docs/typescript/reference/final-completeness-audit.md"]
};
