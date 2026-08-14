---
title: Cleaner Speech is Cleaner for Brain?
status: in-progress
category: Speech perception
summary: Testing whether "cleaner" speech helps you understand more, or just feel like you do.
order: 2
color: sage
image: /project-cleaner-speech.jpg
imageCredit: 'Photo by <a href="https://unsplash.com/@charly_sxg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charly Álvarez</a> on <a href="https://unsplash.com/photos/a-close-up-of-a-microphone-on-a-table-O5og2garfsQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
---

**Audio-Visual Integration under Natural and Algorithmic Speech Degradation**
*Current project · fMRI · speech perception · metacognition*

## The short version

Speech enhancement algorithms are now everywhere — hearing aids, cochlear implants, video-call noise suppression, "clear voice" modes on headphones. They are getting better every year at *sounding* clean. Whether they make listeners *understand* more is a separate question, and the two have a habit of coming apart.

I'm running an fMRI study that puts the same 120 sentences through four acoustic conditions — clean speech, noisy speech, and two kinds of algorithmically enhanced speech — crossed with three visual conditions (no face, matching face, mismatched face). On every single trial I measure both how well people *actually* understood and how well they *think* they understood. The question underneath all of it: when the brain meets a signal that has never existed in natural auditory experience, does it stretch the model it already has, or does it build a new one?

## Why this problem

Three literatures are each in good shape on their own, and none of them talk to each other.

**Speech enhancement is evaluated almost entirely without brains.** The field has a well-known and stubborn finding: quality metrics (PESQ-family) and intelligibility metrics (STOI-family) dissociate. Enhanced speech sounds cleaner while carrying no more linguistic information — sometimes less, because processing artifacts eat it. This matters clinically, and it has been argued out almost entirely at the behavioral and engineering level. There is no neural account of it.

**Audio-visual integration research has only ever used natural degradation.** The finding that watching a talker's mouth helps more as the acoustics get worse (*inverse effectiveness*) has been replicated many times — with white noise, babble, vocoding. But algorithmically enhanced speech is a genuinely different animal: it has the surface statistics of clean speech while carrying unnatural artifacts and hidden information loss. Surface-familiar, deep-strange. Nobody has tested what visual integration does with that.

**And the newest algorithms fail in a new way.** Classical MMSE enhancement is statistical filtering: its signature artifact is musical noise, which sounds obviously wrong but never *invents* speech content. Modern generative enhancement (e.g. Mamba-based models) is trained to land inside the distribution of natural speech, so it sounds natural — and for exactly that reason it can produce fragments that sound plausible but don't match what was said. If that's right, the clinically worst-case device is not the one that sounds bad. It's the one that makes users more confident without making them more correct.

That reframing is the conceptual core of the project: the stimulus space is at least **two-dimensional**, and the two dimensions aren't collinear.

| | Intelligibility | Distributional atypicality | Content fidelity |
|---|---|---|---|
| Clean | high | low (reference) | complete |
| Noisy | low | low (part of everyday hearing) | complete — masked, not altered |
| MMSE | mid | **high** (musical noise) | mid — removed, not replaced |
| Mamba | mid–high | **low** (trained onto the natural manifold) | **lowest** — may generate content that wasn't there |

Which gives a prediction that runs *against* the naive one: the illusion of understanding should be largest for the algorithm that sounds best, not the condition that's hardest.

## The three questions

1. **Representation.** Does the brain treat algorithmically enhanced speech as another point on the manifold spanned by natural speech (*fine-tuning*), or does it build a separate representational structure (*separate model*)?
2. **Metacognition.** Does enhancement manufacture a **fluency illusion** — subjective comprehension tracking *quality* while objective comprehension tracks *intelligibility*, so the two systematically decouple?
3. **Cross-modal.** Is the benefit of seeing the talker's mouth governed by acoustic SNR, or by how far the signal sits from the listener's internal model of speech?

## What I actually do

**Design.** 30 participants, event-related fMRI. 8 runs × 30 trials = 240 trials each. 4 (acoustic: Clean / Noisy / MMSE / Mamba) × 3 (modality: audio-only / audio-visual matched / audio + *mismatched* video) = 12 cells, 10 sentences per cell, each presented twice. The 120 sentences come from a behavioral pilot that screened 320 candidates and difficulty-matched what survived across cells.

**Each trial has three parts.** Sentence (3.5 s) → a 5-point *subjective* comprehension rating → a 2-alternative *objective* content question. Getting both judgments on every trial is what makes the illusion quantifiable rather than anecdotal: I can ask, sentence by sentence, how much of the confidence is unearned.

**The mismatched-video condition earns its place.** It provides visual input with no informative content, which separates *the presence of a face* from *the information in the face*. It also gives a free continuous variable — different sentence pairings happen to be more or less temporally synchronized by chance, so lip-motion/speech-envelope correlation varies within the condition.

## How I analyze it

**Layer 1 — characterize the stimuli before touching brain data.** Because Clean is a per-sentence reference, every intrusive metric is computable: STOI/ESTOI, PESQ, SI-SDR, HASPI. On top of that I compute two things the standard toolkit doesn't give me:

- **Atypicality**: take a self-supervised model trained only on natural speech (wav2vec2 / HuBERT / WavLM), fit a distribution to the mid-layer representations of all Clean + Noisy tokens, and score every token by its Mahalanobis distance or negative log-likelihood. This replaces a binary "natural vs artificial" label — which would have been an unverified assumption about listeners' life histories — with a *measured, continuous property of the signal* that also varies within condition.
- **Content fidelity**: ASR word error rate against the ground-truth transcript, plus phoneme posteriorgram divergence from Clean. This is the only thing that catches generative models producing confident, plausible, wrong speech.

This layer is deliberately falsifiable and comes first. If the enhanced conditions turn out to overlap with natural speech, my central manipulation doesn't exist and I need to know that before spending a single hour on imaging preprocessing.

**Layer 2 — behavior: a hierarchical Bayesian dual-latent model.** Objective accuracy is modeled as Bernoulli with an explicit 2AFC guessing floor and lapse term; subjective rating as ordered logistic with subject-specific thresholds (people use 5-point scales very differently, and that variance would otherwise contaminate exactly the parameter I care about). The key quantity is a **metacognitive coupling** parameter λ — how strongly subjective judgment tracks latent objective understanding — allowed to vary by condition. From it:

```
fluency bias = subjective condition effect − λ × objective condition effect
```

i.e. the part of someone's confidence that their actual comprehension can't explain. This is a latent-variable analogue of M-ratio that survives having only 20 trials per cell. Item-level acoustic and linguistic features (STOI, PESQ, surprisal, lip–envelope correlation) enter as fixed covariates so residual item difficulty doesn't masquerade as a condition effect. Per-subject learning slopes across the session give an independent behavioral read on which signal classes were initially poorly modeled.

**Layer 3 — fMRI: trial-level estimates into a voxelwise encoding model.** The within-trial timing is fixed, so a standard GLM can't cleanly separate the three phases; I use LSS to get per-trial betas, collapse the two comprehension phases into nuisance regressors, and run all representational analysis in the stimulus window. Then, per voxel, a ridge encoding model over five feature blocks — low-level acoustic, intelligibility/quality, content fidelity, visual/lip kinematics, high-level semantics (Chinese sentence embeddings, LLM-derived surprisal) — with **variance partitioning** to get each block's unique R². That single framework yields:

- an **abstraction index** (semantic unique R² − acoustic unique R²), regressed onto an *externally defined* cortical hierarchy axis (Margulies connectivity gradient or intrinsic timescale map) — external, specifically to avoid the circularity of using this dataset to define its own hierarchy;
- a **mixed-selectivity index** (fraction of voxels with unique variance in ≥2 blocks), tested against nodal graph metrics from functional connectivity;
- **cross-condition decoding** — train on Clean/Noisy, test on MMSE/Mamba — which is the most direct operational test of fine-tuning versus separate model.

Representational similarity analysis (crossnobis distances, using the two repetitions as cross-validation folds, which gives a natural noise ceiling) sits alongside as summary and visualization rather than as the primary inferential engine.

## What would prove me wrong

Every hypothesis in the plan is written with its falsification condition attached, which I think is the only honest way to write one. If cross-condition decoding generalizes as well as within-condition decoding and the condition RDM collapses onto a single axis, the "separate model" account is dead. If λ doesn't differ across acoustic conditions, there is no fluency illusion. If atypicality doesn't predict visual benefit once STOI is controlled, plain inverse effectiveness wins.

And the known weak points are on the record: sentences are nested within condition, so item × condition interactions aren't estimable; the pilot matching was done at ceiling, so some of that apparent difficulty-matching may be range restriction that reopens under degradation; n = 30 limits what the connectivity analyses can carry.

## Where it stands now

Currently working through a set of feasibility checks that require no new data — atypicality and content-fidelity computation, the PESQ/STOI dissociation at the stimulus level, re-verifying difficulty matching on ceiling-immune objective properties, design efficiency, and parameter-recoverability simulations on the real design matrix. Their outcome determines whether the analysis plan needs revision, so they come before any imaging work.

The most interesting outcome may not even need the scanner: if generative enhancement really does sit in the "sounds natural × says the wrong thing" quadrant, that's a finding with immediate implications for hearing-aid and cochlear-implant signal processing — **the algorithm may be making users more confident without making them understand more.**
