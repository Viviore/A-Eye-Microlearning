# A-Eye — Architecture

## Project Vision

A-Eye is an interactive **Digital Investigation Simulator** built for the UNESCO Youth Hackathon.

Unlike traditional AI detection games, A-Eye does not teach players to memorize AI-generated artifacts. Instead, it develops Media and Information Literacy (MIL) by training players to investigate digital content using observation, evidence, reasoning, and critical thinking.

Players take on the role of a Digital Investigator responsible for reviewing viral online content before it spreads. Every investigation requires collecting evidence, evaluating credibility, and reaching a justified conclusion.

The objective is simple:

> **Don't guess whether something is AI.**
>
> **Investigate whether it can be trusted.**

---

# Design Principles

Every feature in A-Eye follows these principles.

## 1. Evidence Over Guessing

Players should never guess.

Every conclusion should be supported by collected evidence.

---

## 2. Learn Through Investigation

Players learn by actively inspecting content rather than reading lessons.

---

## 3. Reflection Before Progression

Every completed investigation explains **why** the conclusion was correct.

Mistakes become learning opportunities.

---

## 4. Consistent Gameplay

Every case follows the same investigation process regardless of media type.

The content changes.

The investigation workflow does not.

---

## 5. Simplicity

The interface should remain minimal and approachable.

Complexity comes from analyzing information—not navigating the UI.

---

# Core Gameplay Loop

Every investigation follows the same structure.

```
Mission Brief

↓

Observe Content

↓

Collect Evidence

↓

Review Evidence

↓

Submit Investigation Report

↓

Learning Debrief

↓

Next Case
```

This gameplay loop remains identical across all investigations.

---

# Screen Flow

```
Home

↓

How To Play

↓

Pre-Assessment Quiz

↓

Case 001

↓

Case 002

↓

Case 003

↓

Learning Report

↓

Post-Assessment Quiz
```

---

# Investigation Cases

Instead of traditional game levels, A-Eye presents investigations as Cases.

Each case teaches a different Media and Information Literacy competency.

---

# Case 001 — Text Investigation

## Learning Objective

Evaluate whether online claims are supported by evidence.

## Scenario

Players review two competing social media posts discussing the same topic.

The objective is not to identify AI.

The objective is to determine whether the information is trustworthy.

Players inspect:

- claims
- wording
- sources
- scientific accuracy
- sensational language

### Examples of Evidence

- Extraordinary claim
- Unsupported statistic
- Missing source
- Hallucinated information
- Clickbait wording

### Investigation Outcome

Players submit an Investigation Report explaining whether the claim is:

- Credible
- Needs Verification
- Misleading
- Insufficient Evidence

---

# Case 002 — Photo Investigation

## Learning Objective

Evaluate visual evidence within an online image.

## Scenario

Players inspect a viral image using investigation tools.

Rather than searching for "AI", players collect observable evidence.

### Evidence Examples

- Impossible anatomy
- Texture fusion
- Reflection inconsistency
- Distorted objects
- Unrealistic perspective

### Investigation Tools

- Zoom
- Brightness Adjustment
- Grid Overlay

### Investigation Outcome

Players determine whether the image supports the accompanying claim.

---

# Case 003 — Video Investigation

## Learning Objective

Evaluate competing video evidence.

## Scenario

Players compare two videos covering the same event.

One may contain AI-generated content.

One may be authentic.

Both may require verification.

The player should never assume.

### Investigation Tools

- Play / Pause
- Slow Motion
- Frame-by-frame
- Zoom

### Evidence Examples

- Lip-sync inconsistencies
- Temporal flickering
- Fabricated quotes
- Suspicious captions
- Source credibility

### Investigation Outcome

Players submit a conclusion based on collected evidence.

---

# Evidence System

Evidence is the foundation of every investigation.

Instead of scoring clicks, players collect Evidence.

Each piece of evidence represents an observation made during the investigation.

## Evidence Model

Each Evidence item stores:

- id
- missionId
- title
- description
- category
- discovered
- timestamp
- explanation
- metadata

Evidence is reusable across every investigation.

---

# Investigation Session

Each Case owns one Investigation Session.

The Investigation Session tracks:

- discovered evidence
- investigation progress
- player confidence
- submitted verdict
- completion state

Future gameplay systems attach to the Investigation Session.

---

# Investigation Report

At the end of every Case, players submit an Investigation Report.

Possible conclusions include:

- Credible
- Needs Verification
- Misleading
- Insufficient Evidence

The report summarizes:

- evidence collected
- reasoning
- confidence
- final conclusion

The emphasis is evidence-based reasoning rather than AI detection.

---

# Confidence Calibration

Before submitting an Investigation Report, players rate their confidence.

Confidence is compared against actual investigation performance.

This teaches players to reflect on their own certainty rather than relying on intuition.

Future versions may expand this into confidence progression tracking.

---

# Learning Debrief

Every investigation ends with an explanation.

The debrief includes:

- why the conclusion was correct
- supporting evidence
- verification techniques
- real-world examples
- media literacy takeaway

Players should understand **why** they were correct or incorrect.

---

# Results Dashboard

The Results Dashboard focuses on learning rather than scoring.

Each completed Case displays:

- Investigation Quality
- Evidence Collected
- Confidence Rating
- Final Conclusion
- Media Literacy Lesson
- Real-world Verification Tip

Future versions may include personalized investigator profiles.

---

# Technical Stack

| Technology | Purpose |
|------------|----------|
| Next.js | Application framework and routing |
| React | Component architecture |
| TypeScript | Type safety |
| Tailwind CSS | Responsive UI styling |
| Zustand | Global investigation state |
| Framer Motion | Animations and transitions |
| shadcn/ui | Accessible UI components |
| react-zoom-pan-pinch | Image inspection tools |
| js-cookie | Local telemetry and retention checks |
| canvas-confetti | Completion celebration |
| Vercel | Hosting and deployment |

No backend is required.

All investigation data, cases, quizzes, and evidence definitions are stored as static TypeScript/JSON files.

---

# State Management

Zustand manages:

- current case
- collected evidence
- investigation progress
- confidence
- investigation reports
- quiz progress
- learning results

The Investigation Session acts as the central gameplay object.

---

# Data Structure

Example Evidence Definition

```ts
{
  id: "extra-finger",
  missionId: "case-002",
  title: "Extra Finger",
  category: "Impossible Anatomy",
  description: "The subject appears to have six fingers.",
  explanation: "Modern image generation models occasionally produce inconsistent hand anatomy.",
  discovered: false,
  metadata: {
    xPercent: 42,
    yPercent: 68,
    widthPercent: 8,
    heightPercent: 10
  }
}
```

---

# Future Roadmap

The architecture is intentionally modular.

Future features include:

- Investigation Case File
- Source Credibility Analysis
- Observation vs Assumption classification
- Red Herrings
- Mixed Media Investigations
- Educational Coaching
- Advanced Confidence Analytics
- Multiplayer Investigation Challenges

These systems should build upon the existing Investigation Session and Evidence architecture without requiring major refactoring.

---

# Guiding Philosophy

A-Eye is not an AI detector.

It is a Media and Information Literacy training platform.

Players should finish each investigation thinking:

> "I know how to evaluate digital information."

—not—

> "I know how to spot AI."