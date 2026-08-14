---
title: Unconscious recognition
status: under-review
category: Neuroscience
summary: Recognizing what we never consciously saw.
order: 1
color: clay
image: /project-unconscious-recognition.jpg
imageCredit: 'Photo by <a href="https://unsplash.com/@gabriel_meinert?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gabriel Meinert</a> on <a href="https://unsplash.com/photos/a-mans-face-with-two-different-colored-eyes-1Uo-iev1mjU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
---

*Current project — Unconscious visual disambiguation with prior information*

I study how prior knowledge reshapes what the visual brain represents — and
whether it has to reach conscious awareness to do so. Using fMRI, ambiguous
two-tone "Mooney" images, and a binocular masking technique that pushes those
images out of sight, I ask whether the brain still applies a learned
interpretation to a stimulus that a person reports never having seen. It does:
across five visual regions, from V1 to inferotemporal cortex, the neural pattern
evoked by a suppressed ambiguous image shifts toward the pattern of its
disambiguated counterpart — even though participants report no recognition at
all, and even though the retinal input is identical before and after learning.

## The question

Look at a two-tone Mooney image for the first time and you will probably see
nothing but blotches. Then someone shows you the original photograph, and the
blotches snap into a dalmatian, a face, a hand. Show you the same blotchy image
again and you cannot *un*-see it. Nothing about the image changed; what changed
is what you brought to it. Psychologists call this **disambiguation**, or
one-shot perceptual learning, and it is one of the cleanest demonstrations that
perception is a joint product of incoming sensory signal and stored knowledge.

Both the behavioural and the neural signatures are well documented. After
disambiguation, people report recognizing the image far more often, and its
neural representation drifts toward the representation of the clear photograph —
despite the image on the retina being pixel-for-pixel the same.

What nobody had established is whether **awareness of the ambiguous stimulus is
required for any of this to happen**. Prior work on unconscious vision has mostly
asked whether invisible stimuli can be *encoded* — whether they can prime, enter
memory, or drive learning. My question runs in the opposite direction: once a
prior has *already* been acquired, can it be retrieved and applied to a stimulus
that never becomes visible? And if so, how early in the visual hierarchy does
that show up?

## Why it matters

The answer bears directly on what conscious experience is *for*. Influential
accounts tie consciousness to recurrent top-down signalling — the idea that
experience arises precisely when feedback loops integrate predictions with
sensory input. If the machinery that resolves visual ambiguity can run on a
stimulus that produces no report and no recognition, then the processes that
resolve ambiguity and the processes that generate a conscious report are at least
partly separable. Either top-down prior application does not require awareness,
or neural disambiguation is a more local, feedforward affair than the field has
assumed. Both readings are consequential, and the paradigm lets me put a number
on the effect rather than argue about it.

## How I do it

**The paradigm.** Each image passes through three recognition stages:
*pre-disambiguation* (Mooney image, never seen before), *grayscale* (the clear
photograph that supplies the prior), and *post-disambiguation* (the identical
Mooney image, now interpretable). Comparing the first and third stages holds the
physical stimulus constant and varies only what the observer knows — which is
exactly the manipulation the question needs.

**Making the stimulus invisible.** Every image is presented twice, once under
normal binocular viewing and once under **discontinuous flash suppression
(dCFS)**: a high-contrast, 10 Hz coloured Mondrian animation goes to the dominant
eye while the target goes to the other, and the target drops out of subjective
awareness. I used the *discontinuous* variant, flashing the stimulus in short
bursts, because it makes participants far less likely to break through the mask.
Target opacity is set per participant with a two-stage staircase, so each person
receives as much visual information as suppression allows — the conscious and
unconscious conditions then differ only in what reaches the dominant eye.

**Stimulus selection.** From a 120-image library, a pilot study identified images
that were reliably *un*recognizable before disambiguation and reliably
recognizable after. Ranking those by the size of the confidence jump left a final
set with a mean increase of roughly 50 points on a 100-point scale — images that
genuinely flip.

**Imaging.** 17 participants, 3T fMRI, seven runs structured so that a rolling
subset of images is disambiguated in each run while others are held back, giving
all three stages within a single session. Preprocessing runs through fMRIPrep;
single-subject GLMs model each condition with motion parameters, drift terms and
spike regressors, with head motion and temporal SNR checked before anything else
is done.

**Analysis: representational similarity.** Univariate activation is the wrong
tool here — the question is not *how much* a region responds but *what it
represents*. So for each region of interest I build a representational
dissimilarity matrix over all images and stages using correlation distance, then
ask a targeted question of it: **is a post-disambiguation image's pattern more
similar to *its own* grayscale counterpart than a pre-disambiguation image's
pattern is?**

The critical methodological point is that raw similarity is contaminated. Repeated
exposure, adaptation, rising confidence over the session, and generic semantic
labelling would all inflate similarity between later stages *regardless of which
image is which*. To isolate the genuinely stimulus-specific effect, I subtract
from each matched (diagonal) pair the mean of that image's similarity to the
other eleven images at the same stage. What survives is the image-specific
component and nothing else — which also disposes of the most obvious alternative
explanation before it gets started.

Five regions — **V1, V2, fusiform gyrus, inferotemporal cortex and MT** — were
fixed *a priori* from earlier work and defined from an independent meta-analytic
atlas, so no voxel is selected using the data it is later tested on.

## What I've found

- **No conscious disambiguation under suppression.** Subjective identification
  under dCFS stayed at essentially zero and did not budge across recognition
  stages. Phenomenally, nothing happened.
- **Neural disambiguation happened anyway.** In all five regions, the suppressed
  post-disambiguation image's representation was significantly closer to its own
  grayscale counterpart than the pre-disambiguation image's was — with large
  effect sizes, after the correction described above.
- **The conscious effect replicated**, confirming that the intermittent
  presentation format did not break the phenomenon.
- **It also appears in a third, telling condition:** trials where the image was
  fully visible but the participant reported being unable to identify it. So the
  effect tracks stimulus presentation, not subjective report.
- **The unconscious effect was never weaker** than the conscious one in any
  region, and in MT it was reliably *larger* — which cuts against the common
  assumption that unconscious effects are just faded copies of conscious ones.

## What I am careful not to claim

Awareness here was indexed by self-reported suppression breaks plus a binary
recognition response, not by an objective, sensitivity-based measure — no
forced-choice *d′* near zero, no Bayes factors favouring the null. That is a real
limit, and it means near-threshold perception on some trials cannot be excluded.
So the honest description of the masked condition is *greatly reduced stimulus
visibility* rather than certified unawareness, and the implications for theories
of consciousness stay tentative until objective awareness controls are added.
Suppression depth also varies with spatial frequency, and Mooney and grayscale
images differ in exactly that respect.

## Where it goes next

The obvious extension is to redo the visibility side of this properly: objective
detection criteria, participant-level exclusion for above-chance performance, and
ideally a presentation method that avoids interocular masking altogether. With
awareness pinned down that tightly, the same representational analysis becomes a
direct test between "top-down priors operate without awareness" and "neural
disambiguation is more feedforward than we thought" — which is the question I
actually want answered.

---

*fMRI data collected at the National Taiwan University Imaging Center for
Integrated Body, Mind, and Culture Research.*
