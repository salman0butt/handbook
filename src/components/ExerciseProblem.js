import React from 'react'

const constraintsByDifficulty = {
  Beginner: 'Use modern JavaScript, validate the stated input shape, and handle empty, zero or negative values when the domain permits them.',
  Intermediate: 'Handle malformed and boundary inputs, avoid unnecessary mutation, and keep the solution practical for up to 100,000 input items unless stated otherwise.',
  Advanced: 'Define failure, cancellation and ownership semantics; keep resources bounded; and justify correctness for production-scale or adversarial input.',
}

export default function ExerciseProblem({problem}) {
  const [input, output] = problem.io.split('→').map(value => value.trim())
  return (
    <article className="exercise-problem">
      <h2 id={`problem-${problem.id}`}>{problem.id}. {problem.title}</h2>
      <p><strong>Difficulty:</strong> {problem.difficulty} · <strong>Category:</strong> {problem.category}</p>
      <p><strong>Problem statement:</strong> {problem.task}</p>
      <p><strong>Input:</strong> {input}</p>
      <p><strong>Output:</strong> {output}</p>
      <p><strong>Constraints:</strong> {constraintsByDifficulty[problem.difficulty]}</p>
      <p><strong>Example:</strong> <code>{problem.example}</code></p>
      <p><strong>Hint:</strong> Identify the invariant or transformation first; {problem.approach.charAt(0).toLowerCase() + problem.approach.slice(1)}.</p>
      <p><strong>Recommended approach:</strong> {problem.approach}.</p>
      <p><strong>Complexity:</strong> {problem.complexity}.</p>
      <details>
        <summary>Solution explanation</summary>
        <p>{problem.approach}. Validate the documented boundary cases before the main operation, preserve the required output shape, and add tests for the example plus empty, minimum, maximum and invalid inputs. The implementation is complete when its observed time and space costs match <strong>{problem.complexity}</strong>.</p>
      </details>
    </article>
  )
}
