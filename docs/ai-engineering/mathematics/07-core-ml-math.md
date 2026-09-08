---
id: core-ml-math
title: Core Machine Learning Mathematics
---

# Core Machine Learning Mathematics

This chapter connects the previous math topics to classic machine-learning models. If you understand these examples, neural-network training becomes much less mysterious.

## Supervised learning notation

Dataset:

```text
X = input features
y = target labels
```

Model:

```text
prediction = f(X; parameters)
```

Training:

```text
choose parameters
that minimize average loss
```

## Linear regression

For one feature:

```text
prediction = w*x + b
```

Example:

```text
x = house size
prediction = price
```

The model learns the slope `w` and intercept `b`.

## Mean squared error

A common regression loss:

```text
MSE
=
(1/n) * Σ (prediction_i - target_i)^2
```

Example:

```text
predictions = [3, 5]
targets     = [4, 8]

errors      = [-1, -3]
squared     = [1, 9]

MSE = (1 + 9) / 2 = 5
```

Why square errors?

- removes sign;
- differentiable;
- penalizes large errors strongly.

## Mean absolute error

```text
MAE
=
(1/n) * Σ |prediction_i - target_i|
```

Same example:

```text
absolute errors = [1, 3]
MAE = 2
```

MAE is less sensitive than MSE to very large errors.

## Multiple linear regression

For several features:

```text
prediction
=
w1*x1 + w2*x2 + ... + wn*xn + b
```

Vector form:

```text
prediction = w · x + b
```

Batch/matrix form:

```text
predictions = X @ w + b
```

This shows why linear algebra is central to ML.

## Logistic regression

Binary classification starts with a linear score:

```text
z = w · x + b
```

Then sigmoid maps it to 0..1:

```text
p = sigmoid(z)
```

Interpret:

```text
p ≈ probability of class 1
```

## Binary cross-entropy

For true label `y ∈ {0,1}` and predicted probability `p`:

```text
BCE
=
-[y*ln(p) + (1-y)*ln(1-p)]
```

If `y=1`:

```text
loss = -ln(p)
```

If `y=0`:

```text
loss = -ln(1-p)
```

Correct confident predictions produce low loss.

## Multiclass classification

A multiclass model outputs one logit per class:

```text
logits = [2.0, 0.5, -1.0]
```

Softmax converts logits into probabilities that sum to one.

Cross-entropy then penalizes the negative log probability assigned to the correct class.

## k-nearest neighbors

k-NN uses a distance metric such as Euclidean distance:

```text
distance(a,b)
=
sqrt(Σ(a_i-b_i)^2)
```

To classify:

1. compute distance to training examples;
2. choose the k closest;
3. vote among their labels.

Feature scale strongly affects distance.

## Why scaling matters

Suppose features are:

```text
age:    18..80
salary: 20,000..500,000
```

Raw Euclidean distance can be dominated by salary because its numerical scale is much larger.

Standardization:

```text
z = (x - mean) / std
```

puts features on more comparable scales.

## Classification threshold

A binary model might output:

```text
p = 0.72
```

A default threshold:

```text
p >= 0.5 → positive
```

But 0.5 is not always appropriate.

For fraud or medical screening, you may choose a different threshold based on costs of false positives/negatives.

## Confusion matrix

Binary classification outcomes:

| | Predicted positive | Predicted negative |
|---|---:|---:|
| Actual positive | TP | FN |
| Actual negative | FP | TN |

Metrics derive from these counts.

## Accuracy

```text
accuracy
=
(TP + TN) / all_examples
```

Can be misleading under class imbalance.

## Precision

Of predicted positives, how many were actually positive?

```text
precision
=
TP / (TP + FP)
```

Useful when false positives are costly.

## Recall

Of actual positives, how many were detected?

```text
recall
=
TP / (TP + FN)
```

Useful when missing positives is costly.

## F1 score

Harmonic mean of precision and recall:

```text
F1
=
2 * precision * recall
/
(precision + recall)
```

It balances the two when both matter.

## Bias-variance tradeoff

Underfitting:

```text
high training error
high validation error
```

Overfitting:

```text
low training error
higher validation error
```

Good generalization:

```text
low enough training error
validation error close to training error
```

## Regularization revisited

L2-regularized regression:

```text
objective
=
MSE + λ*Σw_i^2
```

The regularization strength `λ` trades fit against model complexity.

## Feature interactions

A purely linear model cannot naturally model every nonlinear relationship.

You can manually add features:

```text
x1
x2
x1*x2
x1^2
```

Neural networks learn complex nonlinear interactions through layers and activation functions.

## PCA intuition

Principal Component Analysis finds new orthogonal directions that capture high variance.

Conceptually:

```text
many correlated dimensions
→ rotate into principal directions
→ optionally keep the most informative directions
```

PCA uses eigenvectors/eigenvalues or SVD under the hood.

It is useful, but not required before neural networks.

## A linear regression implementation

```python
import numpy as np

x = np.array([1., 2., 3., 4.])
y = np.array([3., 5., 7., 9.])

w = 0.0
b = 0.0
lr = 0.05

for _ in range(1000):
    pred = w * x + b
    error = pred - y

    dw = 2 * np.mean(error * x)
    db = 2 * np.mean(error)

    w -= lr * dw
    b -= lr * db

print(w, b)
# approximately 2 and 1
```

The model discovers:

```text
y ≈ 2x + 1
```

## From logistic regression to a neuron

A basic neuron computes:

```text
z = w · x + b
output = activation(z)
```

That is already very similar to logistic regression.

A neural network stacks many such transformations.

## Practice

1. Compute MSE for predictions `[2, 5]` and targets `[3, 9]`.
2. Why does logistic regression need sigmoid?
3. Why can feature scaling matter for k-NN?
4. Explain precision vs recall with a spam detector.
5. What does regularization try to prevent?
