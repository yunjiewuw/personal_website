---
title: VitalFlow — Planner Tools for Energy Optimization and Management
status: in-progress
category: Applied ML / product
summary: A planner that senses when your body is actually ready to think.
order: 3
color: sand
image: /project-vitalflow.jpg
imageCredit: 'Photo by <a href="https://unsplash.com/@lukechesser?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luke Chesser</a> on <a href="https://unsplash.com/photos/person-clicking-apple-watch-smartwatch-rCOWMC8qf8A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
---

*Personal project — wearables · time-series ML · personal energy modeling*

There is a kind of waste that never shows up on any productivity dashboard. It is not wasted time, exactly. It is wasted *readiness* — the hours you spent grinding through a problem while your body was already in recovery mode, or the deep afternoon focus window you burned on email because you did not know it was there.

This is the problem I built VitalFlow to solve.

## The Problem: Scheduling Against Yourself

Knowledge workers — researchers, designers, engineers, writers — spend enormous effort trying to be more productive. We use task managers, time-blocking calendars, Pomodoro timers, and habit trackers. What almost none of these tools account for is that the person sitting at the desk at 9 AM is physiologically different from the person sitting at that same desk at 3 PM, and both are completely different from who they will be the morning after a night of fragmented sleep.

Cognitive output is not a flat resource. It rises and falls throughout the day in patterns that are partly predictable, partly personal, and almost entirely ignored by the tools we use to manage our work.

The result is a chronic mismatch: we routinely schedule our hardest, most creative, most demanding thinking during windows when our nervous system is already depleted — and then wonder why focus feels like pushing through mud. Conversely, when our physiology signals genuine readiness for deep work, we often squander it on administrative tasks because nothing told us the window was open.

The deeper issue is that we cannot feel our own physiological state with any precision. Fatigue accumulates gradually. HRV (heart rate variability) — one of the most robust proxies for nervous system recovery — is invisible without instrumentation. We operate largely on gut feel, which is subject to the very cognitive biases that impaired states produce.

## The Vision: Optimize Insight, Not Just Output

Most productivity tools optimize for quantity — more tasks completed, more hours logged, more streaks maintained. VitalFlow is built around a different goal: **optimize insight**.

The distinction matters. A highly productive day in terms of volume can be one where you never entered a state capable of genuine creative synthesis. The kind of thinking that produces new connections, solves hard problems, generates original ideas — what I call *insight-grade thinking* — requires specific physiological conditions. It is not just about being awake and at your desk. It is about whether your autonomic nervous system is in a state of recovery and readiness, whether your sleep architecture actually produced the consolidation cycles that support associative memory, whether your accumulated physical and cognitive load has been properly metabolized.

The vision for VitalFlow is a system that understands your internal state well enough to answer, at any moment: *Is this a window for deep work, or should I protect it for something else?* And eventually: *What kind of thinking are you most capable of right now, and what should you be doing with that?*

This is not about maximizing busyness. It is about placing the right cognitive demands on yourself at the right biological moments — so that when insight is possible, you are not filling that window with noise.

## Where We Are Now: The Physiological Foundation

The first and hardest step is instrumentation. Before any model can predict energy, it needs a reliable signal.

### The signals

I am currently building the data collection and pipeline layer, anchored to the Apple Watch via HealthKit. The Apple Watch Ultra 3 — the initial target device — carries a dense array of sensors that, when interrogated correctly, can paint a reasonably accurate picture of physiological state. The highest-value signals for energy modeling are:

- **HRV-SDNN** (heart rate variability): the single most important proxy for autonomic recovery. Measured continuously during sleep and during breathing exercises.
- **Resting heart rate**: a slower-moving indicator of cumulative fatigue and cardiovascular adaptation.
- **Sleep staging**: REM, Core, and deep sleep proportions, plus total sleep time and consistency — together forming the most predictive cluster for next-day cognitive readiness.
- **Blood oxygen saturation (SpO2)**: sleep-period respiratory quality, flagging potential disruptions that suppress recovery.
- **Skin temperature**: a sensitive early signal for illness, stress load, and hormonal fluctuation.
- **Cumulative activity load**: the three-day exercise accumulation that shapes how much recovery the body still owes.

### The pipeline

The data pipeline works like this: after HealthKit authorization, the iOS app listens for new data via `HKObserverQuery`. Feature computation happens on-device — the raw physiological readings never leave the device; only the derived features are transmitted to the backend. Those features land in a time-series store (InfluxDB) alongside user metadata (PostgreSQL). Each night at midnight, a batch job recomputes the personal energy baseline and updates the prediction model.

This architecture matters for a reason beyond technical convenience: it makes a genuine privacy commitment. The raw signals — your sleep, your heart — stay on your hardware.

### The model

The model right now is in an early phase: rule-based thresholds derived from clinical research (HRV below 50ms triggers a low-recovery flag, for instance), layered with personal z-score deviation from your own rolling 7-day baseline. This is not yet predictive in a meaningful sense — it is descriptive. But it is the necessary first step: establish a personal physiological baseline before attempting to forecast from it.

Building that baseline takes roughly 14–28 days per user. This cold-start period is one of the honest limitations of the current stage. The recommendations during those first two weeks are conservative and general, because the model does not yet know you specifically.

## What Comes Next: Proactive Energy Prediction

Once the data pipeline is stable and baseline data accumulates, the next layer is predictive modeling.

The target is a system that can forecast tomorrow's energy envelope from tonight's physiological signals — and ideally provide a 24–48 hour energy curve, not just a single daily score. This means knowing not just "tomorrow will be a high-energy day" but "your peak window will be roughly 9–11 AM, a secondary window around 4 PM, and the afternoon dip will be significant — protect morning for your hardest work."

The modeling approach moves through phases:
1. **Rule-based baseline** (current): clinical thresholds plus personal deviation scoring.
2. **Statistical personalization**: exponential moving averages and z-score monitoring to continuously recalibrate to the individual, rather than population norms.
3. **Predictive ML**: LSTM or Temporal Fusion Transformer architectures trained on longitudinal physiological sequences, fine-tuned on-device via Apple Core ML so the model continues adapting to you without requiring raw data to leave the device.

The outputs of the model feed into a recommendation layer — the part the user actually sees. Not raw numbers, but actionable guidance: which time blocks are physiologically suited for deep focus, when creative work is appropriate, when the system should protect you from scheduling cognitive-heavy tasks.

The application layer — the part that surfaces these recommendations — is being designed around a simple principle from the brand: **data is quiet**. The interface should not demand your attention; it should earn it at the moment you need it, then step back. A Today dashboard showing your energy curve for the day. A weekly forecast to anchor planning. A Watch complication that gives you a single glance check-in without requiring you to open a phone.

## The Longer Horizon: Richer Signals, Deeper Understanding

The Apple Watch is an excellent starting point: widely deployed, sensor-rich, HealthKit API is mature. But its physiological capture has real limits. Daytime HRV measurement is sparse compared to dedicated devices like Oura Ring or Whoop. And — importantly — none of the signals currently captured reflect neural state directly.

### In-ear EEG

The direction I am most interested in longer-term is in-ear EEG.

In-ear electroencephalography — small passive electrodes positioned inside the ear canal — can capture continuous electrical brain activity in a form factor that is genuinely wearable throughout the day. Unlike traditional EEG setups, in-ear configurations do not require gel, scalp preparation, or laboratory conditions. Early-generation devices are already commercially available, and the signal quality for broad frequency-band analysis (alpha, theta, beta power ratios) is sufficient to distinguish rest, focus, and cognitive load states.

This would represent a qualitative leap in the richness of available signal. Peripheral physiological indicators like HRV and skin temperature tell you something about *recovery and arousal*, but they do not tell you much about the current quality of neural engagement. EEG-derived markers could add a real-time cognition dimension to the energy model: not just "your body is recovered" but "your brain is currently in a state consistent with high associative processing" — which is a more direct proxy for insight-grade thinking than anything the Apple Watch can provide.

Adding in-ear EEG as a second sensor modality would allow the model to triangulate across both peripheral and neural signals — physiological readiness on one axis, actual cognitive state on another. The combination is closer to what you would want if you were trying to truly track the conditions under which a person is most capable of their best thinking.

### Other modalities

Other modalities worth exploring as the sensor landscape matures: continuous glucose monitoring (already commercially available, and metabolic state is deeply linked to cognitive function), environmental sensing (ambient noise, light spectrum), and behavioral signals derived from typing cadence and activity patterns.

## The Underlying Belief

The premise behind VitalFlow is not that people are lazy or unorganized. The premise is that they are operating with a fundamental information gap: they do not know their own physiological state with enough precision to make good scheduling decisions.

We have built extraordinary tools for managing external information — tasks, calendars, notes, projects. We have built almost nothing for managing the internal resource that determines what we can actually do with any of those tools: cognitive energy, and specifically the conditions under which genuine insight becomes possible.

The goal is not a system that squeezes more output from every waking hour. It is a system that helps you understand when you are capable of your best thinking — so you can be there for it, rather than accidentally spending it on something that did not need it.

*Do the right thing at the right moment. That is what VitalFlow is for.*
