---
id: probability
title: Probability for AI
---

# Probability for AI

Machine-learning models often produce uncertain predictions. Probability gives us a language for representing and reasoning about that uncertainty.

## Probability basics

A probability lies between zero and one:

```text
0   → impossible
0.5 → equally plausible in a binary case
1   → certain
```

For a fair coin:

```text
P(heads) = 0.5
P(tails) = 0.5
```

For mutually exclusive exhaustive outcomes:

```text
sum of probabilities = 1
```

## Complement

If:

```text
P(A) = 0.8
```

then:

```text
P(not A) = 1 - 0.8 = 0.2
```

## Joint probability

Joint probability asks for both events:

```text
P(A and B)
```

If two independent fair coin flips both need to be heads:

```text
0.5 * 0.5 = 0.25
```

## Independence

A and B are independent when knowing one does not change the probability of the other:

```text
P(A | B) = P(A)
```

When independent:

```text
P(A and B) = P(A) * P(B)
```

Real-world ML features are often **not** independent.

## Conditional probability

Conditional probability means probability of A given B:

```text
P(A | B)
```

Example:

```text
P(rain | dark_clouds)
```

Language models are fundamentally conditional models:

```text
P(next_token | previous_tokens)
```

For:

```text
"The capital of France is"
```

a model might assign:

```text
Paris   0.93
London  0.02
Rome    0.01
other   0.04
```

## Conditional probability formula

```text
P(A | B)
= P(A and B) / P(B)
```

provided `P(B) > 0`.

## Bayes' rule

Bayes' rule reverses a conditional probability:

```text
P(A | B)
=
P(B | A) * P(A) / P(B)
```

Terminology:

```text
P(A)     prior
P(B | A) likelihood
P(A | B) posterior
```

## Medical-test intuition

Suppose:

```text
1% of people have a condition
test sensitivity = 99%
false positive rate = 5%
```

A positive result does **not** mean a 99% chance of having the condition because the base rate is low.

Imagine 10,000 people:

```text
100 have condition
  99 test positive

9,900 do not have condition
  495 test positive
```

Total positives:

```text
99 + 495 = 594
```

Probability of actually having the condition given positive test:

```text
99 / 594 ≈ 16.7%
```

This illustrates why prior/base-rate probability matters.

## Random variables

A random variable maps an uncertain outcome to a number.

Example: dice roll `X`:

```text
X ∈ {1, 2, 3, 4, 5, 6}
```

A model's predicted class can also be treated as a random variable.

## Expected value

Expected value is a probability-weighted average:

```text
E[X] = Σ x * P(X=x)
```

For a fair six-sided die:

```text
E[X]
= (1+2+3+4+5+6)/6
= 3.5
```

The expected value need not itself be a possible outcome.

## Bernoulli distribution

A Bernoulli variable has two outcomes:

```text
X = 1 with probability p
X = 0 with probability 1-p
```

Examples:

- spam vs not spam;
- fraud vs not fraud;
- click vs no click.

Binary classification often predicts `p`.

## Categorical distribution

A categorical distribution chooses one class among many:

```text
cat   0.7
dog   0.2
bird  0.1
```

Softmax produces a categorical probability distribution.

Token generation uses a categorical distribution over the model vocabulary.

## Normal / Gaussian distribution

Characterized mainly by:

```text
mean μ
variance σ^2
```

The normal distribution appears throughout statistics and ML, but real data is not automatically Gaussian.

## Probability density vs probability

For continuous variables, a density value is not itself the probability of one exact point.

Probability comes from an interval/area under the density.

At beginner level, remember this distinction without worrying about integration yet.

## Likelihood

Probability usually asks:

> Given model parameters, how likely is this data/outcome?

Likelihood asks:

> Given observed data, how plausible are these model parameters?

Training many statistical models means finding parameters that maximize likelihood.

## Maximum likelihood

Suppose a binary model predicts probability `p`.

Observed labels:

```text
[1, 1, 0]
```

Likelihood:

```text
p * p * (1-p)
```

Training can choose `p` to make observed data more likely.

## Log-likelihood

Products of many probabilities become tiny:

```text
p1 * p2 * p3 * ... * pn
```

Taking logs converts this to:

```text
log(p1) + log(p2) + ... + log(pn)
```

So models often maximize log-likelihood or equivalently minimize negative log-likelihood.

## Entropy intuition

Entropy measures uncertainty in a probability distribution.

Low entropy:

```text
[0.99, 0.01]
```

The model is highly concentrated/confident.

Higher entropy:

```text
[0.50, 0.50]
```

The model is uncertain.

For many classes, a flatter distribution generally has higher entropy.

## Sampling

Given:

```text
A 0.6
B 0.3
C 0.1
```

sampling repeatedly should select A most often, B less often, C least often.

LLMs sample tokens from probability distributions unless decoding is fully greedy/deterministic.

## Probability calibration

A calibrated model that says "70%" across many similar cases should be correct about 70% of the time.

High accuracy does not automatically imply good calibration.

Calibration matters in risk-sensitive applications.

## Python sampling example

```python
import numpy as np

tokens = ["A", "B", "C"]
probabilities = [0.6, 0.3, 0.1]

samples = np.random.choice(
    tokens,
    size=20,
    p=probabilities,
)

print(samples)
```

## What to master

Know:

- probability range and normalization;
- complement;
- joint probability;
- independence;
- conditional probability;
- Bayes' rule intuition;
- random variables;
- expectation;
- Bernoulli and categorical distributions;
- likelihood and log-likelihood;
- entropy intuition;
- sampling.

## Practice

1. If `P(A)=0.7`, what is `P(not A)`?
2. Two independent events have probabilities 0.5 and 0.2. What is the joint probability?
3. Explain `P(next_token | previous_tokens)` in plain language.
4. Why can base rates make a "99% accurate test" misleading?
5. Why do training objectives often use log probabilities?
