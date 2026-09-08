---
id: math-roadmap
title: Mathematics Roadmap for AI & Machine Learning
---

# Mathematics Roadmap for AI & Machine Learning

You do **not** need to finish a mathematics degree before learning machine learning. You need a compact set of ideas that let you understand data, model computations, loss functions, optimization, embeddings, and transformer internals.

This section teaches the **minimum useful mathematics first**, then adds optional topics only when they become valuable.

## The minimum stack

Learn these in order:

```text
basic algebra
  ↓
functions, powers and logarithms
  ↓
vectors and matrices
  ↓
mean, variance and standard deviation
  ↓
probability and conditional probability
  ↓
derivatives and gradients
  ↓
gradient descent
  ↓
loss functions
  ↓
softmax and cross-entropy
  ↓
embeddings, cosine similarity and attention
```

For most practical AI engineering, this sequence is more valuable than spending months on advanced proofs, differential equations, abstract algebra, or advanced geometry.

## What "understand" means

For every topic, aim for four levels:

| Level | You should be able to... |
|---|---|
| Intuition | explain what the idea means in plain language |
| Calculation | work through a small example by hand |
| Code | implement or inspect the computation |
| AI connection | explain where the idea appears in ML/LLMs |

For example, with a dot product you should know that it combines matching vector components, calculate one manually, implement it, and recognize it inside neural networks, cosine similarity, and attention.

## Math-to-AI map

| Mathematics | Where it appears |
|---|---|
| Variables and functions | model inputs, outputs, parameters |
| Linear equations | linear regression, neural layers |
| Powers/exponents | exponential growth, softmax |
| Logarithms | likelihood, cross-entropy, perplexity |
| Vectors | features, embeddings, hidden states |
| Matrices | weights, batches, projections |
| Dot products | dense layers, similarity, attention |
| Norms/distances | nearest neighbors, embeddings |
| Mean/variance | normalization, statistics, evaluation |
| Probability | classification, token prediction |
| Conditional probability | language modeling, Bayes |
| Derivatives | measuring how loss changes |
| Gradients | direction for parameter updates |
| Chain rule | backpropagation |
| Optimization | training neural networks |
| Softmax | converting logits into probabilities |
| Cross-entropy | classification and language-model loss |

## What can wait

These are useful later but **not prerequisites for starting**:

- eigenvalues and eigenvectors beyond basic intuition;
- singular value decomposition;
- multivariable integration;
- Hessians and second-order optimization;
- information theory beyond entropy/cross-entropy intuition;
- advanced Bayesian inference;
- measure theory;
- differential equations;
- formal mathematical proofs.

Learn them when your work actually needs them.

## Recommended eight-week path

### Week 1 — Algebra and functions

Learn variables, equations, functions, powers, roots, logarithms, summation notation, and basic graphs.

Goal: read expressions such as:

```text
y = w*x + b
loss = (prediction - target)^2
```

without treating them as mysterious symbols.

### Week 2 — Linear algebra

Learn scalars, vectors, matrices, tensors, shapes, vector arithmetic, dot products, norms, matrix multiplication, and transpose.

Goal: understand:

```text
output = input @ weights + bias
```

### Week 3 — Statistics

Learn mean, median, variance, standard deviation, percentiles, covariance, correlation, normalization, and sampling.

Goal: inspect a dataset and describe its scale and spread.

### Week 4 — Probability

Learn events, random variables, conditional probability, independence, expectation, common distributions, Bayes' rule, and likelihood.

Goal: interpret a model output as uncertainty rather than certainty.

### Week 5 — Calculus

Learn slope, derivative, partial derivative, gradient, chain rule, and the idea of backpropagation.

Goal: understand why a gradient tells the optimizer how to change model parameters.

### Week 6 — Optimization

Learn gradient descent, learning rate, SGD, mini-batches, momentum, Adam intuition, regularization, and numerical stability.

Goal: understand a training loop.

### Week 7 — Core ML mathematics

Study linear regression, logistic regression, MSE, sigmoid, binary cross-entropy, feature scaling, distance, and bias/variance.

Goal: connect the math to actual supervised-learning models.

### Week 8 — LLM mathematics

Study embeddings, cosine similarity, logits, softmax, cross-entropy, perplexity, temperature, and scaled dot-product attention.

Goal: read the transformer attention equation conceptually.

## Learn by calculating small examples

Do not only watch videos or memorize definitions. Use tiny numbers.

Example linear model:

```text
x = 3
w = 2
b = 1

y = w*x + b
y = 2*3 + 1
y = 7
```

Example squared error:

```text
prediction = 7
target = 10

error = prediction - target = -3
squared error = (-3)^2 = 9
```

Example parameter update:

```text
old weight = 2.0
gradient = 0.4
learning rate = 0.1

new weight
= old weight - learning_rate * gradient
= 2.0 - 0.1 * 0.4
= 1.96
```

These small calculations build the intuition needed for much larger systems.

## Use code as a calculator

Python with NumPy is ideal for learning ML math:

```python
import numpy as np

x = np.array([2.0, 3.0])
w = np.array([0.5, 0.2])

print(np.dot(x, w))
# 1.6
```

TypeScript is also useful for understanding the mechanics:

```ts
function dot(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

console.log(dot([2, 3], [0.5, 0.2])); // 1.6
```

## A practical learning rule

When you encounter a formula:

1. identify every symbol;
2. replace symbols with tiny numbers;
3. calculate it manually;
4. implement it in code;
5. explain why an ML system needs it;
6. only then move to the next formula.

## Completion checkpoint

Before moving deeply into neural networks, you should be able to explain:

- what a vector and matrix are;
- what a dot product does;
- why matrix shapes matter;
- mean, variance, and standard deviation;
- probability vs conditional probability;
- what a derivative measures;
- what a gradient represents;
- why gradient descent reduces loss;
- what logits are;
- what softmax does;
- what cross-entropy measures;
- why embeddings use vector similarity.

You do not need advanced mathematics. You need these fundamentals to be **comfortable rather than perfect**.

## Practice

1. Why is a vector useful for representing an embedding?
2. What does the slope of a loss function tell an optimizer?
3. Why are logarithms common in probability-based losses?
4. Name three places where dot products appear in modern AI.
5. Explain the difference between "math needed to start ML" and "math useful for advanced ML research."
