---
id: audio-speech-generation
title: Audio, Speech & Realtime Generation
---

# Audio, Speech & Realtime Generation

Generative audio includes text-to-speech, speech-to-speech, sound effects, music, voice transformation, conversational audio, and multimodal systems that reason over audio while generating audio responses.

## The audio task map

```text
text --------------------> speech
speech ------------------> text
speech + instruction ----> transformed speech
text --------------------> sound / music
text + audio ------------> multimodal response
live microphone ---------> realtime conversational audio
```

These are related but not identical problems. A production architecture should distinguish transcription, synthesis, transformation, generation, and realtime conversation.

## Text-to-speech pipeline

Conceptually:

```text
text
 |
 v
text / phoneme representation
 |
 v
acoustic model
 |
 v
mel / latent acoustic representation
 |
 v
vocoder / decoder
 |
 v
waveform
```

Modern systems may combine or replace these stages with end-to-end generative models, audio token models, transformers, or diffusion-style components.

## Audio token models

Some models discretize audio into learned tokens.

```text
audio -> codec encoder -> audio tokens -> generative model -> audio tokens -> codec decoder -> audio
```

This allows sequence-model techniques to operate over speech or sound similarly to text tokens, although token rates and quality/latency trade-offs are very different from language.

## Diffusion and latent audio generation

Audio can also be generated in compressed latent spaces.

```text
prompt -> text embeddings
            |
noise ------+--> latent denoising / flow model --> audio latent --> decoder --> waveform
```

Current Diffusers includes audio-generation pipelines, including latent systems that use an autoencoder plus transformer-based diffusion components.

## Speech-to-speech

A speech-to-speech experience can be built as a pipeline:

```text
microphone -> STT -> language model -> TTS -> speaker
```

or with a model/API capable of directly accepting and producing audio:

```text
microphone -> audio-capable model -> audio response
```

The first architecture provides explicit transcripts and boundaries. The second can reduce conversational friction and preserve paralinguistic cues, but it may be harder to inspect and moderate at intermediate stages.

## Realtime conversational architecture

```text
browser / phone
     |
 WebRTC / WebSocket
     |
     v
session gateway
     |
     +--> auth + tenant policy
     +--> turn detection / VAD
     +--> realtime model
     +--> tools / business APIs
     +--> transcript + trace storage
     |
     v
streamed audio response
```

Realtime systems should measure more than total request latency:

- input buffering delay;
- speech-start detection delay;
- turn-end detection delay;
- model response latency;
- first audio byte/frame latency;
- interruption/cancel latency;
- packet/network jitter;
- end-to-end conversational delay.

## Voice activity detection and turn taking

A conversational system needs to know when the user is speaking, has paused, has finished, or has interrupted the model.

```text
silence -> speech begins -> active speech -> possible pause -> turn complete
                                      ^
                                      |
                               user interrupts output
```

Poor turn detection makes a capable model feel unusable. Tune VAD/turn thresholds with real audio from target environments, including noisy rooms, mobile networks, and different accents.

## Barge-in and cancellation

If a user starts speaking while the assistant is talking:

1. stop or duck playback quickly;
2. cancel generation if it is no longer useful;
3. preserve only the audio/transcript that was actually heard when appropriate;
4. start the new turn with coherent context.

```text
assistant speaking
      |
user starts speaking
      |
      +--> stop playback
      +--> cancel current output
      +--> commit interruption state
      +--> process new user turn
```

## TypeScript session model

```ts
export interface AudioSession {
  id: string
  tenantId: string
  state: 'connecting' | 'active' | 'closing' | 'closed'
  inputCodec: string
  outputCodec: string
  startedAt: string
}

export interface AudioTurn {
  sessionId: string
  turnId: string
  userTranscript?: string
  assistantTranscript?: string
  startedAt: string
  completedAt?: string
  interrupted: boolean
}
```

Keep the session protocol separate from domain tools. A realtime model can request `lookupOrder` or `bookAppointment`, but authorization still belongs in server code.

## Streaming event design

A simple event contract:

```ts
type RealtimeEvent =
  | { type: 'input.audio'; chunk: Uint8Array }
  | { type: 'input.turn.completed'; turnId: string }
  | { type: 'output.audio'; chunk: Uint8Array }
  | { type: 'output.transcript.delta'; text: string }
  | { type: 'tool.requested'; name: string; args: unknown }
  | { type: 'turn.interrupted'; turnId: string }
  | { type: 'error'; code: string; retryable: boolean }
```

Do not let provider event names leak through the entire application. Translate them into a stable internal protocol.

## Tool calling in voice experiences

```text
user: "What is the status of order 8421?"
                |
                v
        realtime model
                |
        tool request proposed
                |
                v
      server authorization
                |
                v
          order service
                |
                v
        structured tool result
                |
                v
       generated spoken answer
```

Important rule: **the audio model does not become authorized because the user spoke a request.** The same identity, tenant, permission, approval, and audit rules used in text agents apply to audio agents.

## Text-to-speech application boundary

```ts
export interface SpeechSynthesisRequest {
  text: string
  voice: string
  format: 'wav' | 'mp3' | 'pcm'
  speed?: number
}

export interface SpeechSynthesizer {
  synthesize(input: SpeechSynthesisRequest): Promise<Uint8Array>
}
```

A product-level service may add caching:

```ts
async function synthesizeAnnouncement(input: SpeechSynthesisRequest) {
  const key = await hashJson(input)
  const cached = await audioCache.get(key)
  if (cached) return cached

  const audio = await speechSynthesizer.synthesize(input)
  await audioCache.put(key, audio)
  return audio
}
```

Caching works well for repeated deterministic announcements but less well for highly personalized conversational output.

## Voice cloning and identity

Voice cloning introduces serious consent, fraud, and impersonation risks. A production system should have explicit policy for:

- whose voice may be cloned;
- proof of consent;
- organization-approved voices;
- high-risk use cases such as financial instructions;
- synthetic-audio disclosure where appropriate;
- audit logs and abuse monitoring;
- retention/deletion of voice reference data.

Do not treat a user-uploaded audio sample as proof that the user owns the voice.

## Audio generation for music and sound effects

Generative audio is not limited to speech.

```text
prompt: "short metallic UI success chime"
                 |
                 v
          audio generator
                 |
                 v
       candidate waveforms
                 |
       rank / evaluate / moderate
                 |
                 v
             asset store
```

For media assets, useful metadata includes duration, sample rate, channels, loudness, model version, seed, prompt version, and licensing/provenance information.

## Evaluation

Speech systems can be evaluated across several independent dimensions:

| Dimension | Questions |
|---|---|
| Intelligibility | Can users understand the words? |
| Naturalness | Does the speech sound human and fluid? |
| Semantic correctness | Did it say the right content? |
| Speaker similarity | If authorized cloning is used, is identity preserved? |
| Prosody | Are rhythm, emphasis, and emotion suitable? |
| Latency | Is conversation responsive? |
| Interruption | Can users reliably barge in? |
| Tool correctness | Were actions authorized and accurate? |
| Safety | Does output avoid disallowed impersonation or harmful content? |

A good voice assistant can fail because of turn-taking even when model intelligence is high. Evaluate the **conversation loop**, not just generated waveform quality.

## Operational failures

Common incidents:

- runaway sessions that never close;
- duplicate tool execution after reconnect;
- partial transcripts treated as final;
- model audio continuing after user interruption;
- audio chunks delivered out of order;
- codec mismatch;
- unexpected silence;
- voice selection leaking across tenants;
- sensitive transcripts retained longer than policy allows.

Build idempotency and session ownership into the protocol.

## Official references

- Transformers text-to-speech: https://huggingface.co/docs/transformers/main/tasks/text-to-speech
- Diffusers audio pipelines: https://huggingface.co/docs/diffusers/main/en/using-diffusers/audio
- Stable Audio pipeline: https://huggingface.co/docs/diffusers/main/api/pipelines/stable_audio
- OpenAI realtime model capability example: https://developers.openai.com/api/docs/models/gpt-realtime
- OpenAI audio model capability example: https://developers.openai.com/api/docs/models/gpt-audio
