---
id: synthetic-data-evaluation
title: Synthetic Data, Distillation & Generative Evaluation
---

# Synthetic Data, Distillation & Generative Evaluation

Generative models can create training examples, labels, conversations, images, audio, and test cases. That can accelerate development, but synthetic data can also amplify model bias, contaminate evaluation sets, leak private inputs, and create a feedback loop where models learn from their own mistakes.

## Synthetic data pipeline

```text
source requirements / seed examples
             |
             v
         generator
             |
             v
     candidate examples
             |
   +---------+----------+
   |                    |
validators            reviewers
   |                    |
   +---------+----------+
             |
             v
      accepted dataset
             |
             v
 training / eval / simulation
```

The generator should not be the only judge of its own outputs.

## Why generate synthetic data?

Common uses:

- bootstrap a new classifier or extractor;
- create edge cases that are rare in production;
- generate paraphrases and linguistic variety;
- simulate conversations;
- generate images for controlled visual scenarios;
- create red-team inputs;
- build tool-calling traces;
- produce privacy-preserving approximations when appropriate;
- teach a smaller model using a stronger teacher.

## Seeded generation

Start from real task structure rather than "generate 1000 random examples."

```text
real task taxonomy
  |
  +--> happy path
  +--> ambiguous input
  +--> malformed input
  +--> adversarial input
  +--> rare language
  +--> boundary values
       |
       v
synthetic variants
```

This gives coverage a purpose.

## TypeScript synthetic example generator

```ts
export interface ScenarioSeed {
  intent: string
  constraints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface SyntheticExample {
  input: string
  expectedBehavior: string
  tags: string[]
}

export interface ExampleGenerator {
  generate(seed: ScenarioSeed, count: number): Promise<SyntheticExample[]>
}
```

Validation can be independent:

```ts
async function buildSyntheticBatch(seed: ScenarioSeed) {
  const candidates = await generator.generate(seed, 20)

  const accepted = []
  for (const candidate of candidates) {
    const schemaOk = validateExample(candidate)
    const duplicate = await duplicateIndex.has(candidate.input)
    const policyOk = await policyCheck(candidate)

    if (schemaOk && !duplicate && policyOk) accepted.push(candidate)
  }

  return accepted
}
```

## Teacher-student distillation

Distillation transfers behavior from a stronger or larger teacher into a smaller student.

```text
inputs
  |
  v
teacher model -> teacher outputs / labels / preferences
  |
  v
curated training set
  |
  v
student training
  |
  v
smaller production model
```

Use cases:

- lower serving cost;
- lower latency;
- private/local deployment;
- task specialization;
- reducing dependence on a large model for repetitive work.

The student should be evaluated independently. Matching teacher output is not the same as satisfying the product requirement.

## Self-instruction and bootstrapping

A model can propose new instructions or tasks from a seed set.

```text
seed tasks -> model expands task set -> filter -> train / evaluate
```

Risks:

- examples become repetitive;
- hidden biases are amplified;
- impossible or nonsensical tasks enter the dataset;
- model phrasing becomes overrepresented;
- evaluation becomes artificially easy because it resembles generated training data.

## Synthetic data contamination

Maintain strict boundaries between:

```text
training set
validation set
offline evaluation set
red-team set
production replay set
```

If a generator was prompted with evaluation examples and then creates training variants of them, your benchmark can become misleading.

## Data provenance

Every generated example should record:

```ts
export interface SyntheticProvenance {
  exampleId: string
  generatorModel: string
  generatorVersion: string
  promptTemplateVersion: string
  seedId?: string
  validatorVersions: string[]
  createdAt: string
}
```

This lets you rebuild or remove synthetic batches if a generation pipeline is later found to be flawed.

## Privacy

Synthetic does not automatically mean anonymous.

A model can reproduce sensitive details from prompts or seed data. Apply privacy policy **before** generation and verify outputs afterward.

```text
private source
   |
redact / minimize
   |
generation
   |
PII / secret scan
   |
accepted synthetic record
```

## Evaluating text generation

Text-generation evaluation can include:

- exact or field-level correctness;
- rubric grading;
- groundedness/citation checks;
- pairwise preference;
- style compliance;
- safety behavior;
- tool-call correctness;
- latency and cost.

Separate deterministic checks from model-based judges.

```text
output
  |
  +--> JSON/schema validator
  +--> business-rule tests
  +--> citation verifier
  +--> model judge
  +--> human review sample
```

## Evaluating image generation

Possible dimensions:

- prompt alignment;
- identity/subject fidelity;
- composition;
- visual quality;
- text/logo rendering;
- edit-region correctness;
- protected-region preservation;
- diversity;
- safety.

Automated visual metrics can help, but product acceptance often needs human or task-specific evaluation.

## Evaluating audio generation

Measure:

- semantic correctness;
- intelligibility;
- naturalness;
- speaker similarity when authorized;
- prosody;
- clipping/noise;
- duration adherence;
- latency;
- policy compliance.

## Evaluating video generation

Measure both frame and sequence behavior:

```text
frame quality
+ temporal consistency
+ identity consistency
+ motion quality
+ camera adherence
+ audio sync
+ safety
+ latency / cost
```

## Pairwise evaluation

Pairwise comparison is often easier than assigning absolute scores.

```text
same input
  |
  +--> model/config A -> output A
  +--> model/config B -> output B
               |
               v
        evaluator chooses
      A / B / tie / both fail
```

Store ties and both-fail cases. Forcing a winner hides important information.

## Judge-model bias

LLM/VLM judges can have biases related to verbosity, position, formatting, model family, or prompt style.

Mitigate by:

- randomizing candidate order;
- using explicit rubrics;
- including deterministic checks;
- calibrating against human judgments;
- evaluating judge consistency;
- using multiple judges where justified;
- inspecting disagreement cases.

## Acceptance-rate economics

For generative products, optimize cost per **accepted** output.

```text
100 generations x $0.10 = $10
only 40 accepted
cost per accepted output = $0.25
```

A more expensive model that produces 90 acceptable results may be cheaper at the product level.

## Eval dataset lifecycle

```text
production failures
      |
      v
curated regression cases
      |
      v
versioned eval suite
      |
      +--> current prod
      +--> candidate model
      +--> candidate prompt
      +--> candidate adapter
      |
      v
release decision
```

Every meaningful incident should produce a regression case when possible.

## Evaluation record

```ts
export interface EvalRun {
  id: string
  suiteVersion: string
  candidate: string
  baseline: string
  scores: Record<string, number>
  startedAt: string
  completedAt: string
  artifactsUri: string
}
```

Keep raw outputs and evaluator metadata so aggregate scores can be investigated.

## Official references

- Hugging Face PEFT for efficient student/adaptation workflows: https://huggingface.co/docs/peft/
- Transformers quantization overview for deployment compression: https://huggingface.co/docs/transformers/quantization/overview
- Diffusers for media-generation evaluation workloads and pipeline versioning: https://huggingface.co/docs/diffusers/
