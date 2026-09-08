---
id: optimization-gradient-descent
title: Optimization & Gradient Descent
---

# Optimization & Gradient Descent

Training a model means choosing parameters that make a loss function small. Optimization is the process used to find those parameters.

## Objective / loss function

A loss function assigns a numerical penalty to predictions.

Example:

```text
loss(w)
```

Training seeks:

```text
parameters with low loss
```

For simple models, the loss surface may look like a bowl. Neural networks have huge high-dimensional non-convex surfaces.

## Gradient descent

Basic update rule:

```text
new_parameter
=
old_parameter - learning_rate * gradient
```

Why subtract?

The gradient points toward local increase, so subtracting it moves toward local decrease.

## One-step example

```text
weight = 2.0
gradient = 0.4
learning_rate = 0.1

new_weight
= 2.0 - 0.1*0.4
= 1.96
```

If the gradient is negative:

```text
weight = 2.0
gradient = -0.4
learning_rate = 0.1

new_weight
= 2.0 - 0.1*(-0.4)
= 2.04
```

So the sign determines update direction.

## Learning rate

The learning rate controls step size.

Too small:

```text
training is very slow
```

Too large:

```text
loss may oscillate or diverge
```

A useful mental model:

```text
gradient = direction + local steepness
learning rate = how aggressively to move
```

## Full-batch gradient descent

Use the entire training set for every update.

Advantages:

- stable gradient.

Disadvantages:

- expensive for large datasets;
- fewer updates per pass through data.

## Stochastic gradient descent

Classical SGD uses one sample at a time.

Advantages:

- cheap updates;
- noisy motion can help exploration.

Disadvantages:

- very noisy gradient estimates.

## Mini-batch gradient descent

Most deep learning uses mini-batches:

```text
dataset
→ batch 1 → gradient → update
→ batch 2 → gradient → update
→ ...
```

Mini-batches balance computational efficiency with useful stochasticity.

## Epoch, batch, step

```text
epoch = one pass through the dataset
batch = subset processed together
step  = one optimizer update
```

Example:

```text
dataset size = 10,000
batch size = 100

steps per epoch = 100
```

## Training loop

```python
for batch_x, batch_y in data:
    predictions = model(batch_x)
    loss = loss_fn(predictions, batch_y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

Mathematically:

```text
forward pass
→ loss
→ gradients
→ parameter update
→ repeat
```

## Momentum

Plain gradient descent reacts only to the current gradient.

Momentum keeps a running velocity:

```text
velocity
≈ previous velocity + current gradient signal
```

It can:

- accelerate movement in consistent directions;
- reduce zig-zagging.

## Adam intuition

Adam maintains moving estimates related to:

- average gradient;
- average squared gradient.

This gives adaptive per-parameter step sizes.

You should understand the intuition before worrying about the full equation.

Adam is widely used, but it does not eliminate the need to tune learning rate and training setup.

## Learning-rate schedules

The best learning rate can change during training.

Common ideas:

- warmup;
- step decay;
- cosine decay;
- linear decay.

Warmup starts with smaller updates before reaching the target learning rate.

## Local minima and saddle points

Deep neural-network loss surfaces are non-convex.

You may encounter:

- local minima;
- flat regions;
- saddle points.

In practice, large models can still train effectively with first-order optimizers and good initialization/training recipes.

## Convex vs non-convex

Convex optimization has a simpler landscape: local minima are global minima.

Linear regression with MSE is a classic convex problem.

Deep neural networks are generally non-convex.

Do not assume training is finding a mathematically unique best solution.

## Regularization

Regularization discourages undesirable complexity.

### L2 regularization

Add squared weight magnitude:

```text
total_loss
=
data_loss + λ * Σ w_i^2
```

This discourages very large weights.

### L1 regularization

Add absolute weight magnitude:

```text
total_loss
=
data_loss + λ * Σ |w_i|
```

L1 can encourage sparse weights.

### Weight decay

Weight decay is closely related to L2 regularization, though exact equivalence depends on optimizer details.

## Gradient clipping

Clip gradients when their norm exceeds a threshold.

Conceptually:

```text
if ||gradient|| > max_norm:
    scale gradient down
```

Common in recurrent networks and large-model training to improve stability.

## Numerical stability

Mathematically equivalent expressions can behave differently in floating-point arithmetic.

Bad softmax:

```text
exp(1000)
```

may overflow.

Stable softmax subtracts the maximum logit:

```text
exp(z_i - max(z))
```

Because subtracting the same constant does not change the final normalized probabilities.

## Floating-point precision

Training may use:

- FP32;
- FP16;
- BF16;
- mixed precision.

Lower precision improves speed/memory but increases numerical concerns.

Modern accelerators and frameworks use techniques such as scaling and accumulation to maintain stability.

## Overfitting is not an optimization failure

Training loss can become very small while validation performance worsens.

That means optimization succeeded at fitting training data but generalization is poor.

Always track both:

```text
training metrics
validation metrics
```

## Early stopping

Stop when validation performance stops improving.

This can prevent unnecessary overfitting and wasted compute.

## A minimal optimizer from scratch

```python
w = 3.0
learning_rate = 0.1

x = 2.0
target = 10.0

for step in range(10):
    prediction = w * x
    loss = (prediction - target) ** 2

    gradient = 2 * (prediction - target) * x

    w = w - learning_rate * gradient

    print(step, w, loss)
```

This tiny example contains the essential idea behind training much larger systems.

## Practice

1. Why does gradient descent subtract the gradient?
2. What happens if learning rate is much too high?
3. Explain batch, step, and epoch.
4. Why can training loss decrease while validation performance becomes worse?
5. Why does stable softmax subtract the maximum logit?
