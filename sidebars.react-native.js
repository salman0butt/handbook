/** React Native-specific navigation layered over all existing handbook sidebars. */
const sidebars = require('./sidebars.postgresql.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `react-native/${id}`, label});

sidebars.reactNativeSidebar = [
  category('Start Here', [
    doc('intro', 'Introduction'),
    doc('version-baseline', 'Version Baseline'),
    doc('00-start-here', '00 · Start Here'),
  ], {collapsed: false}),
  category('Environment & Community CLI', [
    doc('chapters/chapters-001-020', '001–020 · Foundations, Environment, CLI & Core Components'),
  ]),
  category('Components', [
    doc('chapters/chapters-021-040', '021–040 · Components, TypeScript, Styling & Layout'),
  ]),
  category('State & React', [
    doc('chapters/chapters-041-060', '041–060 · Events, State, Effects & Navigation'),
  ]),
  category('Lists, Forms, Networking & Server State', [
    doc('chapters/chapters-061-080', '061–080 · Lists, Forms, Networking & Query State'),
  ]),
  category('Storage, Auth, Links, Permissions & Device APIs', [
    doc('chapters/chapters-081-100', '081–100 · Storage, Auth, Deep Links, Permissions & Device APIs'),
  ]),
  category('Keyboard, Animations, Gestures & Accessibility', [
    doc('chapters/chapters-101-120', '101–120 · Keyboard, Animation, Gestures, A11y & Platform Code'),
  ]),
  category('Android & iOS', [
    doc('chapters/chapters-121-140', '121–140 · Android, iOS, Gradle, CocoaPods & Metro'),
  ]),
  category('Metro, Hermes & New Architecture', [
    doc('chapters/chapters-141-160', '141–160 · Hermes, JSI, Fabric, TurboModules & Codegen'),
  ]),
  category('Performance, Debugging, Media & Testing', [
    doc('chapters/chapters-161-180', '161–180 · Debugging, Performance, Media, Background & Testing'),
  ]),
  category('Build, Release, Architecture & Internals', [
    doc('chapters/chapters-181-200', '181–200 · Production, Release, Architecture & Internals'),
  ]),
  category('Projects', [
    doc('projects/projects-01-05', 'Projects 01–05'),
    doc('projects/projects-06-10', 'Projects 06–10'),
    doc('projects/projects-11-15', 'Projects 11–15'),
    doc('projects/capstone-production-mobile-saas', 'Capstone · Production Mobile SaaS'),
  ]),
  category('Exercises', [
    doc('exercises/exercises-beginner-001-060', '001–060 · Beginner'),
    doc('exercises/exercises-intermediate-061-120', '061–120 · Intermediate'),
    doc('exercises/exercises-advanced-121-180', '121–180 · Advanced'),
    doc('exercises/exercises-senior-181-240', '181–240 · Senior'),
    doc('exercises/exercises-production-241-300', '241–300 · Production'),
  ]),
  category('Interview Question Bank', [
    doc('interview-question-bank/interview-questions-beginner-001-080', 'Q001–Q080 · Beginner'),
    doc('interview-question-bank/interview-questions-intermediate-081-160', 'Q081–Q160 · Intermediate'),
    doc('interview-question-bank/interview-questions-advanced-161-240', 'Q161–Q240 · Advanced'),
    doc('interview-question-bank/interview-questions-senior-241-320', 'Q241–Q320 · Senior'),
    doc('interview-question-bank/interview-questions-staff-321-400', 'Q321–Q400 · Staff'),
  ]),
  category('Interview Mastery', [
    doc('mock-interview-practice/mock-interviews-01-15', '15 Mock Interview Rounds'),
    doc('interview-mastery/live-coding-exercises', 'Live Coding Exercises'),
    doc('interview-mastery/production-incidents', 'Production Incident Exercises'),
  ]),
  category('Reference & Coverage', [
    doc('reference/core-api-coverage', 'Core API Coverage'),
    doc('reference/hooks-api-coverage', 'Hooks Coverage'),
    doc('reference/community-cli-coverage', 'Community CLI Coverage'),
    doc('reference/new-architecture-coverage', 'New Architecture Coverage'),
    doc('reference/android-coverage', 'Android Coverage'),
    doc('reference/ios-coverage', 'iOS Coverage'),
    doc('reference/official-docs-coverage', 'Official Docs Coverage'),
    doc('reference/final-completeness-audit', 'Final Completeness Audit'),
  ]),
];

module.exports = sidebars;
