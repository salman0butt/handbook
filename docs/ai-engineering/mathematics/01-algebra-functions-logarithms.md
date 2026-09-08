---
id: algebra-functions-logarithms
title: Algebra, Functions, Exponents & Logarithms
---

# Algebra, Functions, Exponents & Logarithms

Algebra is the language used to describe models. You do not need advanced symbolic manipulation, but you must be comfortable with variables, functions, equations, powers, logarithms, and summations.

## Variables and constants

A variable represents a value that can change.

```text
x = input
w = weight
b = bias
y = output
```

A common model is:

```text
y = w*x + b
```

If:

```text
x = 4
w = 2
b = 3
```

then:

```text
y = 2*4 + 3 = 11
```

In machine learning, the model usually learns `w` and `b` from data.

## Rearranging equations

You should be comfortable isolating variables.

```text
y = 2x + 3
y - 3 = 2x
x = (y - 3) / 2
```

This is useful when understanding relationships between features, outputs, and transformations.

## Functions

A function maps an input to an output.

```text
f(x) = 2x + 1
```

For `x = 3`:

```text
f(3) = 2*3 + 1 = 7
```

A machine-learning model can be viewed as a function:

```text
prediction = model(features)
```

A neural network is simply a complicated parameterized function.

## Composition of functions

If:

```text
f(x) = 2x
g(x) = x + 1
```

then:

```text
g(f(3))
= g(6)
= 7
```

Deep neural networks repeatedly compose functions:

```text
input
→ linear layer
→ activation
→ linear layer
→ activation
→ output
```

Function composition is why the chain rule later matters for backpropagation.

## Powers

Know the basic laws:

```text
x^2 = x*x
x^3 = x*x*x

x^a * x^b = x^(a+b)
x^a / x^b = x^(a-b)
(x^a)^b = x^(a*b)
x^0 = 1
```

Squared values appear everywhere:

- mean squared error;
- Euclidean distance;
- variance;
- L2 regularization.

Example:

```text
error = prediction - target
prediction = 8
target = 5

error = 3
error^2 = 9
```

Squaring removes the sign and penalizes larger errors more heavily.

## Roots

The square root reverses squaring:

```text
sqrt(25) = 5
```

Euclidean vector length uses a square root:

```text
length([3, 4])
= sqrt(3^2 + 4^2)
= sqrt(9 + 16)
= 5
```

## Exponential function

The exponential function is commonly written as:

```text
e^x
```

where `e` is approximately 2.71828.

Examples:

```text
e^0 = 1
e^1 ≈ 2.718
e^2 ≈ 7.389
```

Exponentials are important because softmax uses exponentials to convert logits into positive values before normalization.

## Logarithms

A logarithm asks:

> What exponent gives this number?

For base 10:

```text
10^2 = 100
log10(100) = 2
```

For natural logarithms:

```text
ln(e^3) = 3
```

Important rules:

```text
log(a*b) = log(a) + log(b)
log(a/b) = log(a) - log(b)
log(a^k) = k*log(a)
```

## Why logs matter in ML

Suppose independent probabilities are:

```text
0.8 * 0.7 * 0.9 * 0.6
```

For thousands of probabilities, repeated multiplication produces extremely tiny numbers.

Taking logs converts multiplication into addition:

```text
log(0.8 * 0.7 * 0.9 * 0.6)
=
log(0.8) + log(0.7) + log(0.9) + log(0.6)
```

This is numerically easier and is why log-likelihood and cross-entropy are so common.

## A cross-entropy preview

If the correct class receives probability `0.9`:

```text
loss = -ln(0.9) ≈ 0.105
```

If the correct class receives probability `0.1`:

```text
loss = -ln(0.1) ≈ 2.303
```

So confident correct predictions have small loss, while confident wrong predictions are heavily penalized.

## Summation notation

The sigma symbol means "add these terms."

```text
Σ x_i
```

For:

```text
x = [2, 4, 6]
```

the sum is:

```text
2 + 4 + 6 = 12
```

Mean:

```text
mean = (1/n) * Σ x_i
```

For `[2, 4, 6]`:

```text
mean = (2 + 4 + 6) / 3 = 4
```

Loss functions often average errors:

```text
MSE = (1/n) * Σ (prediction_i - target_i)^2
```

## Product notation

Sometimes you will see a product of values:

```text
Π p_i
```

This means multiply all values. Likelihood functions often start as products and are then transformed into sums using logarithms.

## Absolute value

Absolute value removes sign:

```text
|5| = 5
|-5| = 5
```

Mean absolute error uses:

```text
MAE = mean(|prediction - target|)
```

## Min-max normalization

To map values into approximately 0 to 1:

```text
normalized
= (x - min) / (max - min)
```

Example:

```text
x = 70
min = 50
max = 100

normalized
= (70 - 50) / (100 - 50)
= 20 / 50
= 0.4
```

## Sigmoid as an algebraic function

Binary classification often uses the sigmoid:

```text
sigmoid(z) = 1 / (1 + e^(-z))
```

Useful values:

```text
z = 0  → sigmoid = 0.5
z >> 0 → sigmoid approaches 1
z << 0 → sigmoid approaches 0
```

Python:

```python
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

for z in [-2, 0, 2]:
    print(z, sigmoid(z))
```

## TypeScript examples

```ts
function linear(x: number, w: number, b: number): number {
  return w * x + b;
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

console.log(linear(4, 2, 3)); // 11
console.log(sigmoid(0));      // 0.5
```

## What to memorize

Memorize or become immediately comfortable with:

```text
y = w*x + b
x^2
sqrt(x)
e^x
ln(x)
Σ
mean = sum / count
sigmoid(z) = 1 / (1 + e^(-z))
```

You do not need to memorize dozens of logarithm identities before starting ML.

## Practice

1. Compute `y = 3x + 2` for `x = 5`.
2. Compute the squared errors for predictions `[3, 7]` and targets `[5, 6]`.
3. Explain why logs help when multiplying many probabilities.
4. Calculate the mean of `[3, 5, 7, 9]`.
5. What does sigmoid return when its input is zero?
