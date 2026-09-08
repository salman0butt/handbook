---
id: math-cheat-sheet-exercises
title: AI/ML Math Cheat Sheet & Exercises
---

# AI/ML Math Cheat Sheet & Exercises

Use this page for review after studying the previous chapters. The goal is not memorizing every symbol; it is being able to recognize the operation and explain why AI uses it.

## Core notation

```text
x        input / value / feature
y        target or output
w        weight / parameter
b        bias
n        number of examples
Σ        sum
||x||    vector norm / length
A^T      transpose
A @ B    matrix multiplication
a · b    dot product
P(A)     probability of A
P(A|B)   probability of A given B
E[X]     expected value
∂L/∂w    partial derivative of loss w.r.t. weight
```

## Essential formulas

### Linear model

```text
y_hat = w*x + b
```

Vector version:

```text
y_hat = w · x + b
```

### Mean

```text
mean = (1/n) * Σ x_i
```

### Population variance

```text
variance = (1/n) * Σ (x_i - mean)^2
```

### Standard deviation

```text
std = sqrt(variance)
```

### Standardization

```text
z = (x - mean) / std
```

### Dot product

```text
a · b = Σ a_i*b_i
```

### L2 norm

```text
||x|| = sqrt(Σ x_i^2)
```

### Euclidean distance

```text
distance(a,b)
= sqrt(Σ(a_i-b_i)^2)
```

### Cosine similarity

```text
cosine(a,b)
=
(a · b) / (||a||*||b||)
```

### Conditional probability

```text
P(A|B)
=
P(A and B) / P(B)
```

### Bayes' rule

```text
P(A|B)
=
P(B|A)*P(A) / P(B)
```

### Sigmoid

```text
sigmoid(z)
=
1 / (1 + e^(-z))
```

### MSE

```text
MSE
=
(1/n) * Σ(prediction_i-target_i)^2
```

### Binary cross-entropy

```text
BCE
=
-[y*ln(p) + (1-y)*ln(1-p)]
```

### Softmax

```text
softmax(z_i)
=
exp(z_i) / Σ exp(z_j)
```

### Gradient-descent update

```text
parameter
=
parameter - learning_rate * gradient
```

### Attention

```text
Attention(Q,K,V)
=
softmax((Q @ K^T) / sqrt(d_k)) @ V
```

### Perplexity

```text
perplexity
=
exp(average_cross_entropy)
```

## Exercise set A — algebra

### 1. Linear model

Given:

```text
x = 4
w = 3
b = -2
```

Compute:

```text
y = w*x + b
```

Answer:

```text
y = 3*4 - 2 = 10
```

### 2. Squared error

```text
prediction = 7
target = 10
```

Answer:

```text
error = -3
squared error = 9
```

### 3. Log-loss intuition

Which prediction has lower loss for the correct class?

```text
A: p = 0.9
B: p = 0.2
```

Answer:

```text
A

-ln(0.9) < -ln(0.2)
```

## Exercise set B — linear algebra

### 4. Dot product

```text
a = [1, 2, 3]
b = [2, 0, 4]
```

Answer:

```text
1*2 + 2*0 + 3*4
= 14
```

### 5. Norm

```text
x = [5, 12]
```

Answer:

```text
sqrt(25 + 144)
= 13
```

### 6. Matrix shape

```text
A: [32, 128]
B: [128, 64]
```

Answer:

```text
A @ B → [32, 64]
```

## Exercise set C — statistics

### 7. Mean

```text
[2, 4, 6, 8]
```

Answer:

```text
5
```

### 8. Population variance

```text
[2, 4, 6]
mean = 4
```

Answer:

```text
((2-4)^2 + (4-4)^2 + (6-4)^2)/3
= (4+0+4)/3
= 8/3
≈ 2.667
```

### 9. Standardization

```text
x = 80
mean = 60
std = 10
```

Answer:

```text
z = 2
```

## Exercise set D — probability

### 10. Complement

```text
P(rain) = 0.3
```

Answer:

```text
P(no rain) = 0.7
```

### 11. Independent joint probability

```text
P(A) = 0.5
P(B) = 0.4
```

Answer:

```text
P(A and B) = 0.2
```

### 12. Conditional language-model interpretation

Explain:

```text
P(token_t | token_1 ... token_(t-1))
```

Answer:

The probability distribution for the next token conditioned on all previous context tokens available to the model.

## Exercise set E — calculus and optimization

### 13. Derivative

```text
f(x) = x^2
x = 4
```

Answer:

```text
f'(x) = 2x
f'(4) = 8
```

### 14. Gradient update

```text
weight = 1.5
gradient = -0.2
learning rate = 0.1
```

Answer:

```text
new weight
= 1.5 - 0.1*(-0.2)
= 1.52
```

### 15. Interpret a positive gradient

If the derivative of loss with respect to a weight is positive, increasing that weight increases loss locally. Gradient descent therefore decreases the weight.

## Exercise set F — ML

### 16. MSE

```text
predictions = [2, 6]
targets     = [4, 5]
```

Answer:

```text
errors = [-2, 1]
squared = [4, 1]
MSE = 2.5
```

### 17. Precision vs recall

Suppose a fraud detector flags 20 transactions. Ten are truly fraudulent. There are actually 25 fraudulent transactions total.

```text
precision = 10/20 = 0.5
recall = 10/25 = 0.4
```

### 18. Why scale features?

Because distance- and gradient-based methods can be dominated by features whose numerical ranges are much larger than others.

## Exercise set G — LLM math

### 19. Softmax intuition

If logits are:

```text
[10, 1, 0]
```

the first class gets most probability because its exponential dominates.

### 20. Cross-entropy

Correct-token probabilities:

```text
model A: 0.8
model B: 0.05
```

Model A has much lower cross-entropy loss.

### 21. Attention shape

```text
Q = [128, 64]
K = [128, 64]
K^T = [64, 128]

Q @ K^T = [128, 128]
```

This contains pairwise query-key scores between 128 token positions.

## Mini-project 1 — linear regression from scratch

Implement a one-feature model without a machine-learning library.

Dataset:

```python
x = [1, 2, 3, 4, 5]
y = [3, 5, 7, 9, 11]
```

Expected relationship:

```text
y = 2x + 1
```

Implement:

1. prediction;
2. MSE;
3. gradients for `w` and `b`;
4. gradient-descent update;
5. 1,000 training steps;
6. print final parameters.

You should recover approximately:

```text
w ≈ 2
b ≈ 1
```

## Mini-project 2 — embedding similarity

Create three small vectors representing:

```text
car
automobile
banana
```

Choose vectors so car and automobile point in similar directions.

Implement cosine similarity and confirm:

```text
similarity(car, automobile)
>
similarity(car, banana)
```

Then explain why real embedding models can use the same geometry with hundreds or thousands of dimensions.

## Mini-project 3 — softmax classifier

Given logits:

```text
[2.5, 1.2, -0.5]
```

Implement stable softmax:

1. subtract max logit;
2. exponentiate;
3. divide by sum;
4. verify probabilities sum to approximately one.

Then compute:

```text
-loss = ln?
cross_entropy = -ln(probability_of_correct_class)
```

for each possible correct class.

## Mini-project 4 — attention by hand

Use:

```text
Q =
[[1, 0],
 [0, 1]]

K =
[[1, 0],
 [1, 1]]

V =
[[10, 0],
 [0, 20]]
```

Calculate:

```text
Q @ K^T
```

Then apply row-wise softmax and multiply by `V`.

Do it once manually and once in NumPy.

## Final readiness checklist

You are ready to move forward when you can explain, without notes:

- variable, function, exponent, logarithm;
- vector, matrix, tensor, shape;
- dot product, norm, cosine similarity;
- matrix multiplication and transpose;
- mean, variance, standard deviation;
- probability and conditional probability;
- expectation and likelihood;
- derivative, partial derivative, gradient;
- chain rule and backpropagation;
- gradient descent and learning rate;
- MSE, sigmoid, BCE;
- logits, softmax, cross-entropy;
- embeddings and attention.

## What to learn next

After this section, continue with:

```text
Neural Network Training
→ Transformer Internals
→ Language Modeling & Decoding
→ Embeddings & Vector Search
→ RAG
→ model training / fine-tuning when needed
```

Return to advanced math only when a topic requires it. This keeps mathematical learning tied to engineering intuition.
