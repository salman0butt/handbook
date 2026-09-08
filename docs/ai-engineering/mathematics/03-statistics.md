---
id: statistics
title: Statistics for Machine Learning
---

# Statistics for Machine Learning

Statistics helps you understand datasets, variability, relationships, noise, evaluation results, and whether a model is genuinely learning useful patterns.

## Mean

The arithmetic mean is:

```text
mean = sum(values) / number_of_values
```

Example:

```text
values = [2, 4, 6, 8]
mean = 20 / 4 = 5
```

Python:

```python
import numpy as np

x = np.array([2, 4, 6, 8])
print(x.mean())  # 5.0
```

## Median

The median is the middle value after sorting.

```text
[2, 4, 6, 100]
median = (4 + 6) / 2 = 5
```

Mean:

```text
mean = 28
```

The outlier `100` strongly shifts the mean, but not the median.

## Mode

The mode is the most frequent value.

```text
[1, 2, 2, 3, 4]
mode = 2
```

It is especially useful for categorical or discrete data.

## Range

```text
range = max - min
```

For `[4, 7, 11]`:

```text
range = 11 - 4 = 7
```

Range is simple but highly sensitive to outliers.

## Variance

Variance measures how spread out values are around the mean.

Population variance:

```text
variance
= mean((x_i - mean)^2)
```

Example:

```text
x = [2, 4, 6]
mean = 4

deviations:
[-2, 0, 2]

squared deviations:
[4, 0, 4]

variance:
(4 + 0 + 4) / 3
= 2.6667
```

## Standard deviation

Standard deviation is the square root of variance:

```text
std = sqrt(variance)
```

It returns spread to the original unit.

If height variance is measured in `cm^2`, standard deviation is measured in `cm`.

## Population vs sample variance

When you have the entire population:

```text
divide by n
```

When estimating population variance from a sample, the common unbiased sample estimator divides by:

```text
n - 1
```

Libraries often let you choose this with a parameter such as `ddof`.

## Percentiles

The p-th percentile is a value below which approximately p percent of observations fall.

Examples:

- 50th percentile = median;
- 90th percentile = value above about 90% of observations;
- 99th percentile is common in latency analysis.

Model-serving metrics often use p50, p95, and p99 latency.

## Quartiles and IQR

Quartiles split sorted data into four sections.

```text
Q1 = 25th percentile
Q2 = median
Q3 = 75th percentile

IQR = Q3 - Q1
```

The IQR is often used to identify outliers.

## Standardization / z-score

Standardization centers data around zero and scales it by standard deviation:

```text
z = (x - mean) / std
```

Example:

```text
x = 70
mean = 50
std = 10

z = (70 - 50) / 10 = 2
```

So `70` is two standard deviations above the mean.

Feature scaling often helps optimization.

## Covariance

Covariance measures whether two variables tend to move together.

Conceptually:

```text
positive covariance:
x increases → y often increases

negative covariance:
x increases → y often decreases

near-zero covariance:
no strong linear co-movement
```

The scale depends on the original variables, which makes covariance hard to compare across datasets.

## Correlation

Correlation normalizes covariance to approximately `[-1, 1]`.

```text
+1 → strong positive linear relationship
 0 → little/no linear relationship
-1 → strong negative linear relationship
```

Important:

> Correlation does not prove causation.

A third variable can affect both.

## Distribution

A probability/statistical distribution describes how values are spread.

Common shapes:

### Normal / Gaussian

Bell-shaped around a mean.

Useful for:

- measurement noise;
- initialization assumptions;
- approximation through the central limit theorem.

### Uniform

Every value in a range has equal density.

### Bernoulli

One binary outcome:

```text
0 or 1
false or true
failure or success
```

### Categorical

One outcome from several categories.

Language-model next-token prediction is categorical over the vocabulary.

## Histograms

A histogram groups numerical values into bins.

Use it to inspect:

- skew;
- multiple clusters;
- outliers;
- heavy tails;
- unexpected data ranges.

Never trust only a mean; inspect the distribution.

## Sampling

Machine learning usually trains from samples rather than an entire real-world population.

Good samples should represent the target deployment population.

Sampling problems create:

- class imbalance;
- demographic or domain bias;
- train/deployment mismatch;
- misleading evaluation.

## Train, validation, test

Typical split:

```text
training set
→ fit parameters

validation set
→ choose hyperparameters / models

test set
→ final unbiased evaluation
```

Do not repeatedly tune against the test set, because it stops being an unbiased estimate.

## Data leakage

Leakage occurs when information unavailable at prediction time enters training.

Examples:

- target-derived features;
- future data;
- duplicated records across train/test;
- preprocessing fitted on the entire dataset.

Leakage can make metrics look excellent while production performance fails.

## Bias and variance intuition

High bias:

```text
model too simple
→ underfits
```

High variance:

```text
model fits training details/noise
→ overfits
```

The goal is not zero bias or zero variance; it is strong generalization.

## Class imbalance

Suppose:

```text
99% normal
1% fraud
```

A model that always predicts "normal" has:

```text
99% accuracy
```

but detects zero fraud.

This is why accuracy alone can be misleading.

## Practical NumPy summary

```python
import numpy as np

x = np.array([2, 4, 6, 8, 10], dtype=float)

print("mean", x.mean())
print("median", np.median(x))
print("variance", x.var())
print("std", x.std())
print("p90", np.percentile(x, 90))

z = (x - x.mean()) / x.std()
print("standardized", z)
```

## What matters most for AI engineers

Be comfortable with:

- mean;
- median;
- variance;
- standard deviation;
- percentiles;
- distributions;
- sampling;
- correlation;
- normalization/standardization;
- train/validation/test splits;
- class imbalance;
- leakage.

Advanced statistical inference can come later.

## Practice

1. Why can median be better than mean when data has large outliers?
2. Calculate the mean and population variance of `[1, 3, 5]`.
3. What does a z-score of `-2` mean?
4. Why can 99% accuracy be useless on an imbalanced dataset?
5. Give one example of data leakage.
