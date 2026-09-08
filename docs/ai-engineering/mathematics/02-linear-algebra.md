---
id: linear-algebra
title: Linear Algebra for AI
---

# Linear Algebra for AI

Linear algebra is the most important branch of mathematics for understanding modern AI. Neural networks, embeddings, attention, and batched computation are built from vectors, matrices, and tensor operations.

## Scalar, vector, matrix, tensor

```text
scalar:  3.5

vector:
[1, 2, 3]

matrix:
[[1, 2],
 [3, 4]]

tensor:
an n-dimensional array
```

Typical AI shapes:

```text
embedding:              [hidden]
sequence:               [tokens, hidden]
batch of sequences:     [batch, tokens, hidden]
attention scores:       [batch, heads, tokens, tokens]
```

## Shapes

Shape tells you how many values exist along each dimension.

Example:

```text
matrix shape = [2, 3]

[[1, 2, 3],
 [4, 5, 6]]
```

It has two rows and three columns.

Shape errors are common because many operations require compatible dimensions.

## Vector addition

Add matching components:

```text
[1, 2] + [3, 4]
= [4, 6]
```

Neural networks frequently add bias vectors or residual connections this way.

## Scalar multiplication

Multiply every component:

```text
3 * [1, 2, -1]
= [3, 6, -3]
```

## Dot product

The dot product multiplies matching components and sums them:

```text
a = [1, 2, 3]
b = [4, 5, 6]

a · b
= 1*4 + 2*5 + 3*6
= 4 + 10 + 18
= 32
```

This single operation appears in:

- neural-network layers;
- embedding similarity;
- attention;
- logistic regression;
- projections.

TypeScript:

```ts
function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('shape mismatch');

  return a.reduce(
    (sum, value, i) => sum + value * b[i],
    0,
  );
}
```

NumPy:

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a @ b)  # 32
```

## Vector length / norm

The L2 norm measures vector magnitude.

```text
||x|| = sqrt(x1^2 + x2^2 + ... + xn^2)
```

For:

```text
x = [3, 4]

||x||
= sqrt(3^2 + 4^2)
= 5
```

## Unit vectors and normalization

A normalized vector has length 1.

```text
normalized_x = x / ||x||
```

For `[3, 4]`:

```text
[3/5, 4/5]
= [0.6, 0.8]
```

Normalization is useful when direction matters more than magnitude.

## Euclidean distance

Distance between vectors:

```text
distance(a, b)
= sqrt(Σ (a_i - b_i)^2)
```

Example:

```text
a = [1, 2]
b = [4, 6]

difference = [-3, -4]
distance = sqrt(9 + 16) = 5
```

Distance is used in nearest-neighbor methods and clustering.

## Cosine similarity

Cosine similarity measures directional similarity:

```text
cosine(a, b)
= (a · b) / (||a|| * ||b||)
```

Interpretation:

```text
close to  1 → similar direction
close to  0 → roughly unrelated
close to -1 → opposite direction
```

This is extremely important for embeddings and semantic retrieval.

Python:

```python
import numpy as np

def cosine(a, b):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(cosine([1, 0], [0.9, 0.1]))
```

## Matrix-vector multiplication

Suppose:

```text
W =
[[1, 2],
 [3, 4]]

x =
[5,
 6]
```

Then:

```text
W*x =
[
  1*5 + 2*6,
  3*5 + 4*6
]
=
[17, 39]
```

A neural layer can be written as:

```text
y = W*x + b
```

The matrix `W` contains learned weights.

## Matrix multiplication

For:

```text
A shape = [m, n]
B shape = [n, p]
```

the result has shape:

```text
A @ B shape = [m, p]
```

The inner dimensions must match.

Example:

```text
[2, 3] @ [3, 4] → [2, 4]
```

This shape rule is essential for transformers.

## Why matrix multiplication is powerful

A dense layer can transform many input features into many output features at once:

```text
input batch X: [batch, input_features]
weights W:     [input_features, output_features]

X @ W:
[batch, output_features]
```

GPUs are optimized for these large parallel matrix operations.

## Transpose

Transpose swaps rows and columns.

```text
A =
[[1, 2, 3],
 [4, 5, 6]]

A^T =
[[1, 4],
 [2, 5],
 [3, 6]]
```

Shapes:

```text
[2, 3] → transpose → [3, 2]
```

Attention uses a transpose in:

```text
Q @ K^T
```

so each query can be compared with every key.

## Element-wise multiplication vs matrix multiplication

These are different operations.

Element-wise:

```text
[1, 2] * [3, 4]
= [3, 8]
```

Dot product:

```text
[1, 2] · [3, 4]
= 1*3 + 2*4
= 11
```

Always ask which operation is intended.

## Identity matrix

An identity matrix leaves a vector unchanged:

```text
I =
[[1, 0],
 [0, 1]]

I @ [5, 7]
= [5, 7]
```

Identity-like behavior matters conceptually in residual connections and linear transformations.

## Inverse — know the intuition

For some square matrices, an inverse `A^-1` satisfies:

```text
A^-1 @ A = I
```

You do not need to manually invert large matrices for practical deep learning. Libraries use more stable numerical methods.

## Eigenvalues/eigenvectors — optional intuition

An eigenvector is a direction that a matrix transformation scales without rotating away from that direction:

```text
A*v = λ*v
```

This becomes useful in PCA, spectral methods, and deeper theoretical work. It is not required before learning neural networks.

## A complete neural-layer example

Input:

```text
x = [2, 3]
```

Weights:

```text
W =
[[0.5, 0.1],
 [0.2, 0.8]]
```

Bias:

```text
b = [0.1, -0.2]
```

Compute:

```text
W*x =
[
  0.5*2 + 0.1*3,
  0.2*2 + 0.8*3
]
=
[1.3, 2.8]

y = W*x + b
= [1.4, 2.6]
```

That is the core numerical pattern behind enormous networks.

## Practice

1. Compute the dot product of `[2, 4]` and `[3, 5]`.
2. Find the L2 norm of `[6, 8]`.
3. What output shape results from `[32, 128] @ [128, 512]`?
4. Why does attention transpose the key matrix?
5. Explain cosine similarity in plain language.
