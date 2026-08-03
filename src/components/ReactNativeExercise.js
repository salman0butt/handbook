import React from 'react'

export default function ReactNativeExercise({exercise}) {
  return (
    <article className="exercise-problem">
      <h2 id={`exercise-${exercise.id}`}>{exercise.id}. {exercise.title}</h2>
      <p><strong>Difficulty:</strong> {exercise.difficulty} · <strong>Category:</strong> {exercise.category}</p>
      <p><strong>Problem statement:</strong> {exercise.problem}</p>
      <p><strong>Requirements:</strong> {exercise.requirements}</p>
      <p><strong>Input or starting state:</strong> {exercise.startingState}</p>
      <p><strong>Expected result:</strong> {exercise.expectedResult}</p>
      <p><strong>Constraints:</strong> {exercise.constraints}</p>
      <p><strong>Example:</strong> {exercise.example}</p>
      <p><strong>Hint:</strong> {exercise.hint}</p>
      <p><strong>Recommended approach:</strong> {exercise.approach}</p>
      <p><strong>Testing expectations:</strong> {exercise.testing}</p>
      <p><strong>Common mistakes:</strong> {exercise.mistakes}</p>
      <details>
        <summary>Expandable solution explanation</summary>
        <p>{exercise.solution}</p>
      </details>
    </article>
  )
}
