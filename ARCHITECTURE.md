# A-Eye — System & Game Architecture

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

Every feature in A-Eye follows these principles:

1. **Evidence Over Guessing**: Every conclusion should be supported by collected evidence and database cross-referencing.
2. **Learn Through Investigation**: Players learn by actively inspecting content rather than reading passive slides.
3. **Reflection Before Progression**: Every completed investigation explains **why** the conclusion was correct through learning debriefs.
4. **Consistent Gameplay**: Every case follows the same investigation process regardless of media type.
5. **Accessibility & High Readability**: Clean, high-contrast, large-font interface designed for all age groups, non-tech users, and children.

---

# Core Gameplay Loop

Every investigation follows the same structure:

```
Mission Brief
    ↓
Observe Content & Tool Analysis
    ↓
Collect Evidence & Discover Clues
    ↓
Rate Certainty Calibration (0-100%)
    ↓
Submit Investigation Report
    ↓
Learning Debrief & Context Card
    ↓
Next Case Progression
```

---

# Sequential Route Locking & Screen Flow

Linear route progression is guarded by `RouteGuard.tsx` and displayed on the persistent `Header.tsx`:

```
Home / How to Play
    ↓
Pre-Assessment Quiz (/quiz/pre) — [Unlocked Baseline]
    ↓ 🔒 (Requires Pre-Quiz completion)
Case 001: Text Investigation (/level/1) — Redaction Pen & Fact Checker Drawer
    ↓ 🔒 (Requires Case 001 completion)
Case 002: Photo Investigation (/level/2) — Forensic Lens & Evidence Tagging
    ↓ 🔒 (Requires Case 002 completion)
Case 003: Video Investigation (/level/3) — 3-Round Temporal Video Forensics
    ↓ 🔒 (Requires Case 003 completion)
Results Dashboard (/results) — MIL Competency Report
    ↓ 🔒 (Requires Case 003 completion)
Post-Assessment Quiz (/quiz/post) — Growth & Impact Evaluation
```

---

# Investigation Cases Implementation

---

## Case 001 — Text Investigation (Redaction Pen & Fact-Checker Drawer)

### Learning Objective
Cross-reference claims against database registries rather than guessing based on writing style alone.

### Core Mechanics
- **Redaction Pen Document View**: Players review a press release document and click claim sentences to inspect them.
- **Source Inspection Drawer (Fact / Claim Checker Tool)**:
  - Interactive drawer where players click **"Cross-Reference Claim against Registries"**.
  - **Dr. Aris Thorne Claim**: Querying MIT Directory reveals *"❌ Database Alert: No researcher named Dr. Aris Thorne exists in MIT's database."*
  - **5,000 Lumens Claim**: Querying optics registry reveals *"❌ Infrastructure Alert: Physical optics limits plant luminescence output to <0.8% of a standard LED bulb."*
  - **NSF Statement Claim**: Verified as genuine research context (*"✅ Source Verified: NSF Official Statement"*).

---

## Case 002 — Photo Investigation (Forensic Lens & 3-Choice Tagging)

### Learning Objective
Inspect visual geometry, text rendering, and lighting consistency using forensic heatmaps.

### Core Mechanics & Inspection Console
- **Interactive Inspection Canvas**: 4-way Pan & Zoom controls (`react-zoom-pan-pinch`), **Visual Contrast Boost**, and **Grid Overlay**.
- **🔍 Forensic Lens Heatmap Mode**: Toggle button (`🔍 Forensic Lens`) renders subtle dashed heatmap outlines around structural distortion zones so players don't click blindly.
- **3-Choice Evidence Tagging Modal**: Clicking a hotspot presents 3 classification options:
  1. `A) Anatomic Anomaly` (Extra limbs, fused skin)
  2. `B) Geometric Distortion` (Melted window bars, perspective fault)
  3. `C) Text Garbling` (Unreadable pseudo-script signage)

---

## Case 003 — Video Investigation (3-Round Progressive Forensics)

### Learning Objective
Analyze temporal video streams across multi-stage difficulty levels.

### 3-Round Progressive Difficulty System
- **🟢 Round 1 (Easy Mode — `cut_real.mp4` vs `cut_ai.mp4`)**:
  - *Set*: Paper Cut / Fine Edge Interaction (`public/videos/set1/`)
  - *Timer*: 60s
  - *Forensics*: Facial mask boundary edge bleed & paper smudging under normal playback.
- **🟡 Round 2 (Medium Mode — `race_real.mp4` vs `race_ai.mp4`)**:
  - *Set*: Fast Motion Race (`public/videos/set2/`)
  - *Timer*: 45s
  - *Forensics*: High-speed motion blur & frame-rate jittering evaluated under **0.5x Slow-Mo**.
- **🔴 Round 3 (Hard Mode — `sushi_real.mp4` vs `sushi_ai.mp4`)**:
  - *Set*: Sushi Preparation (`public/videos/set3/`)
  - *Timer*: 30s
  - *Forensics*: Pupil catchlight refraction mismatch & knife-rice micro-grain merging evaluated using **Visual Boost** & **Grid Overlay**.

---

# Technical Stack

| Technology | Purpose |
|------------|----------|
| Next.js 16 (Turbopack) | Application framework and routing |
| React 19 | Component architecture |
| TypeScript | Strict type safety |
| Tailwind CSS | High-contrast dark responsive styling |
| Zustand | Global investigation & route state |
| Framer Motion | Fluid card swiping and modal animations |
| Lucide React | Modern iconography system |
| react-zoom-pan-pinch | Image pan/zoom inspection tools |

No backend or external API is required. All static assets, video sets (`public/videos/set1`, `set2`, `set3`), and case definitions build cleanly into static HTML/JS pages.

---

# Verification & Build Guarantee

The application maintains a strict **0-Error Build Guarantee**:
```powershell
npm run build
```
- All 11 static routes (`/`, `/how-to-play`, `/quiz/pre`, `/level/1`, `/level/2`, `/level/3`, `/results`, `/quiz/post`) build cleanly without warnings or type errors.