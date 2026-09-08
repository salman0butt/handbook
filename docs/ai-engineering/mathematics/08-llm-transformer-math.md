---
id: llm-transformer-math
title: Embeddings, Softmax, Cross-Entropy & Transformer Math
---

# Embeddings, Softmax, Cross-Entropy & Transformer Math

This chapter collects the minimum mathematics needed to understand LLMs and transformers without diving into research-level derivations.

## Embeddings

An embedding maps an item to a vector.

```text
"cat" → [0.12, -0.44, 0.91, ...]
"dog" → [0.10, -0.40, 0.87, ...]
"database" → [-0.62, 0.14, -0.03, ...]
```

The dimensions are learned numerical features, not usually human-named properties.

Semantically related items often end up with useful geometric relationships.

## Embedding similarity

Common choices:

- cosine similarity;
- dot product;
- Euclidean distance.

Cosine similarity:

```text
cosine(a,b)
=
(a · b) / (||a|| * ||b||)
```

For normalized embeddings:

```text
||a|| = ||b|| = 1
```

so cosine similarity becomes:

```text
cosine(a,b) = a · b
```

This is why vector databases often optimize dot-product-like search.

## Logits

A neural classifier or language model usually outputs **logits** before probabilities.

Example token logits:

```text
Paris   5.2
London  2.1
Rome    1.3
```

Logits are unrestricted real numbers:

```text
negative, zero, positive
```

They are not probabilities and do not need to sum to one.

## Softmax

Softmax converts logits into positive probabilities summing to one:

```text
softmax(z_i)
=
exp(z_i)
/
Σ exp(z_j)
```

Example logits:

```text
[2, 1, 0]
```

Exponentials:

```text
[e^2, e^1, e^0]
≈ [7.389, 2.718, 1]
```

Sum:

```text
11.107
```

Probabilities:

```text
[0.665, 0.245, 0.090]
```

## Stable softmax

Large exponentials can overflow.

Instead compute:

```text
shifted_logits = logits - max(logits)
```

Then exponentiate.

Python:

```python
import numpy as np

def softmax(logits):
    logits = np.array(logits, dtype=float)
    shifted = logits - np.max(logits)
    exps = np.exp(shifted)
    return exps / exps.sum()

print(softmax([2, 1, 0]))
```

## Temperature

Temperature modifies logits before softmax:

```text
softmax(logits / temperature)
```

Lower temperature:

```text
probabilities become sharper
more concentrated on high logits
```

Higher temperature:

```text
distribution becomes flatter
more randomness
```

Example intuition:

```text
T < 1 → conservative/sharp
T = 1 → original
T > 1 → flatter/more diverse
```

Exact generation behavior also depends on top-p, top-k, and provider implementation.

## Cross-entropy for one correct class

If the true token/class is `Paris` and the model assigns:

```text
P(Paris) = 0.8
```

loss:

```text
-loss = ln?
cross_entropy = -ln(0.8) ≈ 0.223
```

If:

```text
P(Paris) = 0.01
```

then:

```text
cross_entropy = -ln(0.01) ≈ 4.605
```

Wrong confident predictions are penalized strongly.

## Language-model objective

For a token sequence:

```text
x1, x2, x3, ..., xn
```

an autoregressive language model estimates:

```text
P(x2 | x1)
P(x3 | x1,x2)
P(x4 | x1,x2,x3)
...
```

Training minimizes average next-token cross-entropy.

Equivalently, it maximizes the likelihood/log-likelihood of the observed sequence.

## Perplexity

Perplexity is related to average cross-entropy:

```text
perplexity = exp(average_cross_entropy)
```

Lower perplexity means the model assigns higher probability to observed tokens on average.

Example:

```text
cross_entropy = ln(10)
perplexity = 10
```

Interpretation is easiest when comparing models on the same tokenization/data setup.

## Linear projections in transformers

Given hidden state matrix:

```text
X shape = [tokens, hidden]
```

learned projection matrices produce:

```text
Q = X @ W_Q
K = X @ W_K
V = X @ W_V
```

These are queries, keys, and values.

## Why query-key dot products?

A dot product produces a compatibility score:

```text
score(i,j)
=
query_i · key_j
```

High score means the query and key align strongly in the learned projection space.

## Attention scores

For all tokens at once:

```text
scores = Q @ K^T
```

If:

```text
Q shape = [tokens, d_k]
K shape = [tokens, d_k]
```

then:

```text
K^T shape = [d_k, tokens]

Q @ K^T
→ [tokens, tokens]
```

Every token receives a score against every token.

## Why divide by sqrt(d_k)?

Scaled dot-product attention uses:

```text
scores
=
(Q @ K^T) / sqrt(d_k)
```

As dimension increases, raw dot products can grow in magnitude.

Scaling helps keep values in a range where softmax behaves more stably.

## Softmax attention weights

Apply softmax across allowed keys:

```text
attention_weights
=
softmax(scores)
```

Each row becomes a probability-like weighting over tokens.

Example:

```text
[2.0, 1.0, 0.0]
→ softmax
→ [0.665, 0.245, 0.090]
```

## Weighted value combination

Final attention output:

```text
output
=
attention_weights @ V
```

So attention does three conceptual things:

```text
1. compare query with keys
2. turn scores into weights
3. use weights to mix values
```

## Complete attention equation

```text
Attention(Q,K,V)
=
softmax(
  (Q @ K^T) / sqrt(d_k)
) @ V
```

Read it left to right:

```text
Q @ K^T
→ similarity/compatibility scores

/ sqrt(d_k)
→ scale scores

softmax(...)
→ normalized attention weights

... @ V
→ weighted combination of values
```

This equation becomes straightforward once dot products, matrix multiplication, exponentials, and probability normalization are familiar.

## Tiny attention example

Suppose one query has scores against two keys:

```text
scores = [2, 1]
```

Softmax:

```text
weights ≈ [0.731, 0.269]
```

Values:

```text
V1 = [10, 0]
V2 = [0, 20]
```

Weighted combination:

```text
0.731*[10,0]
+
0.269*[0,20]

=
[7.31, 5.38]
```

The output blends value vectors according to attention weights.

## Causal masking

Autoregressive models must not look at future tokens during next-token training/generation.

Before softmax, future positions receive effectively negative infinity:

```text
allowed score → normal value
future score  → -infinity
```

After softmax:

```text
future probability weight → 0
```

## Multi-head attention

Instead of one attention calculation, transformers use several heads.

Each head has separate learned projections and can learn different relationships.

Conceptually:

```text
X
├─ head 1 attention
├─ head 2 attention
├─ head 3 attention
└─ ...
   ↓
concatenate
   ↓
output projection
```

## Residual connections

A transformer block often computes:

```text
output = input + transformation(input)
```

This is vector addition.

Residual connections help information and gradients flow through deep networks.

## Layer normalization intuition

Layer normalization standardizes activations within each token representation and then applies learnable scale/shift.

Core statistical idea:

```text
normalized
≈ (x - mean) / sqrt(variance + epsilon)
```

The `epsilon` term avoids division by zero/very tiny values.

## MLP/feed-forward layer

A transformer also contains a feed-forward network:

```text
hidden
→ linear projection
→ nonlinear activation
→ linear projection
```

Again, this is matrix multiplication + activation.

## Transformer math map

```text
embeddings
→ vectors

linear projections
→ matrix multiplication

attention compatibility
→ dot products

attention normalization
→ softmax

training objective
→ cross-entropy

training
→ gradients + optimization

normalization
→ mean + variance

sampling
→ probability
```

The transformer is mathematically sophisticated at scale, but its core building blocks are exactly the topics in this section.

## Practice

1. What is the difference between logits and probabilities?
2. Compute softmax conceptually for two logits where one is much larger than the other.
3. Why does cross-entropy use a logarithm?
4. What shape does `Q @ K^T` have when Q and K are `[128, 64]`?
5. Explain the attention equation in plain language.
