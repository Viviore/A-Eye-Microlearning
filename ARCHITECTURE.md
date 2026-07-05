# A-Eye — Architecture

## Stack

| Techstack | Purpose |
|---|---|
| Next.js (React) | App framework, handles routing between screens (Home, Quiz, Level 1-3, Report) |
| TypeScript | Type safety for game state, level/artifact data |
| Tailwind CSS | Utility-first styling for feed UI, flat design, modals/transitions |
| Zustand | Game state management — score, confidence, progress across levels |
| Framer Motion | Screen transitions, modal animations, badge reveal animations |
| shadcn/ui | Accessible prebuilt UI primitives (buttons, sliders, dialogs) for quiz + confidence meter |
| react-zoom-pan-pinch | Zoom/pan/magnifier tool for image inspection |
| js-cookie | Cookie storage for delayed retention check telemetry |
| canvas-confetti | Achievement/badge celebration effect |
| Vercel | Hosting/deployment |

No database needed — level data, artifacts, and quiz questions can live as static JSON/TS files in the repo. No custom backend required for the core game.

## Screen flow
Home → How to Play → Pre-Assessment Quiz → Investigation (Level 1 → 2 → 3) → Learning Report

## Core components
- **Social Media Simulation Mode**: Tailwind components mimicking Instagram/Facebook-style posts (caption, reactions, comments, share count) wrapping each level.
- **Confidence Meter**: JS slider, player self-rates confidence before submitting a verdict. Feeds calibration data.
- **Real-World Context Cards**: Shown right after verdict — explains the structural failure, viral case study, or verification takeaway.
- **Achievement System**: state-driven micro-badges (e.g. Eagle Eye, Anatomy Expert, Critical Thinker).
- **Investigation Tools** (available every level): Zoom, Brightness adjustment, Grid overlay, Investigation marker (animated ring on correct find), Hint system (small score penalty).
- **Artifact Hotspot Detection**: Each image has invisible clickable zones defined as percentages of image width/height (not raw pixels), so they stay aligned when the image resizes. Zones sit in an `absolute`-positioned layer on top of the image; the image container must be `position: relative`. On click, check if it lands inside a zone → mark found, show ring + explanation. Level 3 must handle clicks that hit nothing (some images have zero artifacts, since they're real photos).

```ts
{
  imageId: "selfie-01",
  artifacts: [
    { id: "extra-finger", xPercent: 42, yPercent: 68, widthPercent: 8, heightPercent: 10, explanation: "..." }
  ]
}
```

## Levels

### Level 1 — Everyday Selfies
**Artifacts to find:** extra fingers, fused hands, floating earrings, misaligned eyes, hair blending into clothing, missing accessories
**Verdict options:** AI Generated / Real / Unsure

**Mechanics:**
- Player clicks suspicious areas on the image
- Correct clicks get an investigation marker (animated ring)
- Each found artifact opens a short explanation
- After finding all artifacts, player picks a verdict
- Player rates confidence (0–100%)
- Immediate feedback shows the correct answer

**Stack used:** Tailwind (Instagram-style post layout), shadcn/ui (explanation dialog, verdict buttons, confidence slider), Framer Motion (marker ring animation, dialog transitions), Zustand (tracks found artifacts, score, confidence per level)

### Level 2 — Viral News Posts
**Artifacts to find:** distorted buildings, impossible shadows, gibberish signs, broken perspective, cloned crowds, repeating windows
**Verdict options:** Trusted / Questioned / Fact-Checked First

**Mechanics:**
- Same click-to-find flow as Level 1, wrapped in a Facebook-style post (headline, reactions, comments, share count)
- Player picks a verdict, rates confidence, gets feedback

**Stack used:** same as Level 1 (Tailwind, shadcn/ui, Framer Motion, Zustand) — just a different feed layout and copy

### Level 3 — Deepfake Reality
**Artifacts to find:** subtle lighting inconsistencies, near-perfect AI portraits mixed with real photos
**Verdict options:** Authentic / AI Generated / Insufficient Evidence

**Mechanics:**
- Player gets a mixed feed of real and AI images, not labeled
- Player uses investigation tools before deciding: zoom, brightness adjustment, grid overlay, magnifier
- Marks suspected artifacts, picks a verdict, rates confidence
- Reviews an expert explanation after submitting

**Stack used:** everything from Level 1/2, plus react-zoom-pan-pinch (zoom/pan/magnifier tool) and a brightness filter applied directly on the image element (CSS filter, no extra library needed)

## Results screen (after each level)
Artifacts found, accuracy score, time taken, confidence score, verdict, MIL lesson, real-world verification tip.

## Data/telemetry
- Cookie storage for optional delayed retention checks (post-game skill decay tracking)
- Confidence calibration: compares self-declared confidence vs actual correctness

## Note
Closer to Navi's usual React setup now, but still no Node/Express/Prisma/Postgres — A-Eye doesn't need a database or server for the core game, everything is static/client-side.
