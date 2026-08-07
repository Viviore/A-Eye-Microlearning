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
    â†“
Observe Content & Tool Analysis
    â†“
Collect Evidence & Discover Clues
    â†“
Rate Certainty Calibration (0-100%)
    â†“
Submit Investigation Report
    â†“
Learning Debrief & Context Card
    â†“
Next Case Progression
```

---

# Sequential Route Locking & Screen Flow

Linear route progression is guarded by `RouteGuard.tsx` and displayed on the persistent `Header.tsx`:

```
Home / How to Play
    â†“
Pre-Assessment Quiz (/quiz/pre) — [Unlocked Baseline]
    â†“ ðŸ”’ (Requires Pre-Quiz completion)
Case 001: Text Investigation (/level/1) — Redaction Pen & Fact Checker Drawer
    â†“ ðŸ”’ (Requires Case 001 completion)
Case 002: Photo Investigation (/level/2) — Forensic Lens & Evidence Tagging
    â†“ ðŸ”’ (Requires Case 002 completion)
Case 003: Video Investigation (/level/3) — 3-Round Temporal Video Forensics
    â†“ ðŸ”’ (Requires Case 003 completion)
Results Dashboard (/results) — MIL Competency Report
    â†“ ðŸ”’ (Requires Case 003 completion)
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
  - **Dr. Aris Thorne Claim**: Querying MIT Directory reveals *"âŒ Database Alert: No researcher named Dr. Aris Thorne exists in MIT's database."*
  - **5,000 Lumens Claim**: Querying optics registry reveals *"âŒ Infrastructure Alert: Physical optics limits plant luminescence output to <0.8% of a standard LED bulb."*
  - **NSF Statement Claim**: Verified as genuine research context (*"âœ… Source Verified: NSF Official Statement"*).

---

## Case 002 — Photo Investigation (Forensic Lens & 3-Choice Tagging)

### Learning Objective
Inspect visual geometry, text rendering, and lighting consistency using forensic heatmaps.

### Core Mechanics & Inspection Console
- **Interactive Inspection Canvas**: 4-way Pan & Zoom controls (`react-zoom-pan-pinch`), **Visual Contrast Boost**, and **Grid Overlay**.
- **ðŸ” Forensic Lens Heatmap Mode**: Toggle button (`ðŸ” Forensic Lens`) renders subtle dashed heatmap outlines around structural distortion zones so players don't click blindly.
- **3-Choice Evidence Tagging Modal**: Clicking a hotspot presents 3 classification options:
  1. `A) Anatomic Anomaly` (Extra limbs, fused skin)
  2. `B) Geometric Distortion` (Melted window bars, perspective fault)
  3. `C) Text Garbling` (Unreadable pseudo-script signage)

---

## Case 003 — Video Investigation (3-Round Progressive Forensics)

### Learning Objective
Analyze temporal video streams across multi-stage difficulty levels.

### 3-Round Progressive Difficulty System
- **ðŸŸ¢ Round 1 (Easy Mode — `cut_real.mp4` vs `cut_ai.mp4`)**:
  - *Set*: Paper Cut / Fine Edge Interaction (`public/videos/set1/`)
  - *Timer*: 60s
  - *Forensics*: Facial mask boundary edge bleed & paper smudging under normal playback.
- **ðŸŸ¡ Round 2 (Medium Mode — `race_real.mp4` vs `race_ai.mp4`)**:
  - *Set*: Fast Motion Race (`public/videos/set2/`)
  - *Timer*: 45s
  - *Forensics*: High-speed motion blur & frame-rate jittering evaluated under **0.5x Slow-Mo**.
- **ðŸ”´ Round 3 (Hard Mode — `sushi_real.mp4` vs `sushi_ai.mp4`)**:
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

---

# A-Eye — Game Rules

Core mechanical rules for all 3 cases. See A-Eye_cases.md for full story/evidence content.

**Scoring is cumulative across cases** — Case 001's ending total carries over into Case 002, not reset to 0 at the start of a new case.

---

## Section 1 — Case 001 (Text Investigation)

### Format

1 free tutorial round (not counted as a round) + 10 playable rounds in the pool (5 rounds require 1 clue, 5 rounds require 2 clues). The game randomly selects 5 rounds per session, randomized order. No difficulty ramp — all rounds are equal difficulty.
- **No reappearance**: The game tracks played rounds. If you replay or restart, it filters out cases you have already seen (until the unplayed pool drops below 5, at which point it resets).

### Tools

- Flag tool — click a line of text to mark it suspicious.
- Source Check panel — compare claims against a fake "verified record," toggles open/closed.
- Evidence Board — tracks flagged clues with short explanations.

### Gate to unlock "File Verdict"

- Flag the required number of clues for the round (either 1 or 2 real clues, depending on the case).
- Source Check is optional (opening it is no longer required to progress).
- Flagging a decoy shows an in-context warning and applies a -10 point penalty, but doesn't block progress.

### Verdict Flow

1. "How was this faked?" — pick from 4 tactic options (1 correct, 3 distractors, e.g. Advance Fee Fraud / Impersonating a Real Company / Too Good to Be True / Phishing Link).
2. Submit Report.

No Real/Fake choice, no evidence-select step — every scenario is always "Fake," and with only 2 clues and no selectable decoy, evidence-select had nothing to test. Tactic ID is the only verdict step.

### Scoring

- Each round starts at 100 points.
- **Combined Live Score Display:** The UI merges your permanent banked score and your current round's 100 points into a single live number.
- Decoy click â†’ -10 per decoy click (applies immediately to live score with a floating animation).
- Failed round (wrong tactic) â†’ -25 per failed attempt (applies immediately with floating animation).
- Completing a round permanently banks that round's remaining score into the case total.
- **Deductions:** Can be endless. If `roundScore` + `cumulativeScore` hits 0 or below, it's Game Over.
- If the cumulative total score across all cases hits 0 (not just a single round — see cumulative scoring note at top of doc), the entire A-Eye experience resets — all cases (001/002/003) reset.

### Failure / Retry Rules

- Wrong tactic â†’ partial reset (keep clues found, clear tactic pick, can keep exploring before resubmitting).
- Retries allowed until score hits 0 (see Scoring).
- Failing an attempt applies the -25 flat deduction from the Scoring section above (not a separate penalty).
- Show a short message explaining the reset, e.g. "That's not quite how this was faked. Take another look and try again."

### Flow Diagram

```
Show post
   v
Player flags lines AND opens Source Check (either order, no fixed sequence)
   Decoy flagged --> warning shown, no threshold penalty
   v
Gate met? (2+ real clues AND Source Check opened)
   No --> keep playing
   Yes
   v
"File Verdict" unlocks
   v
"How was this faked?" (4 tactic options)
   v
Submit Report
   v
Correct tactic?
   No --> retry round (partial reset)
   Yes --> next round or end of case (scoring per above)
```

### Implementation Checklist

- [x] 1 free tutorial round, not counted toward the 5 scored rounds
- [x] 10 playable rounds in the pool (5 with 1 clue, 5 with 2 clues), 5 shown per session
- [x] Prevent randomization reappearance on restart (keep history of played rounds)
- [x] Flag tool on text lines
- [x] Source Check panel (toggle open/closed)
- [x] Evidence Board with short explanations per flagged clue
- [x] Gate: Required clues flagged (1 or 2 depending on round) (Source Check is optional)
- [x] Decoy click â†’ in-context warning shown, applies -10 deduction immediately
- [x] Verdict Flow is tactic-ID only — no Real/Fake step, no evidence-select step
- [x] 4 tactic options per round, 1 correct + 3 distinct non-overlapping distractors
- [x] Scoring: round starts at 100
- [x] Scoring UI: display is a single merged live score (Bank + Current Round)
- [x] Scoring: decoy click = -10 (with floating deduction animation)
- [x] Scoring: failed round (wrong tactic) = -25 (with floating deduction animation)
- [x] Scoring: endless deductions, no flooring at 0
- [x] Scoring: completed round's score adds to running case total
- [x] Cumulative total (across all 3 cases) hitting 0 â†’ resets entire A-Eye experience
- [x] Wrong tactic â†’ partial reset (keep clues found, clear tactic pick), same round repeats
- [x] Retries allowed until score hits 0 (not truly unlimited)
- [x] Retry message shown before round resets

---

## Section 2 — Case 002 (Photo Investigation)

### Format

Photo(s) are always AI-generated — no "Real" branch, since that would be a fake choice. The test is proving _how_ it was faked.

10 total playable rounds in the pool, but only 5 shown per session (randomly selected), same session structure as Case 001.

### Tools

- Magnifier tool — hover to zoom into the photo.
- Magnifier crosshair should invert its color depending on the photo underneath it, so it stays visible on both dark and light photos instead of disappearing when the background matches its color.
- Evidence Board — tracks flagged clues, no hover-hint (player must genuinely spot the mistake).
- +30 Seconds tool — extends the round timer by 30 seconds, costs -80 points. Limited to 1 use per round. Before allowing use, the game must check the player has enough score to afford the cost — if not, the button is unavailable/disabled. Replaces a hint tool — doesn't reveal any answer, just gives more time to find the clues legitimately, since the goal is teaching players to actually spot the artifacts themselves.

### Timer

- Each round has a 60-second timer.
- Timer applies to Case 002 only — Case 001 has no timer.
- Timer runs out â†’ counts as a failed attempt (same -50 deduction as a wrong tactic — see Scoring). Player retries with a random round, not the same round that timed out — this applies no matter how much progress was made (even partial, e.g. only 1 of 2 clues found). This is different from a normal wrong-tactic failure: if the player found all the clues but still picked the wrong tactic, the round stays the same (per Failure/Retry Rules below) — randomizing only applies specifically to a timeout, not to a wrong-tactic fail.

### Gate to unlock "File Verdict"

- Flag at least 2 real clues (tutorial's example doesn't count).
- Case 002 has no decoys — any click that isn't a real clue counts as a misclick (see Scoring), not a decoy.

### Verdict Flow

1. "How was this faked?" — pick from 4 tactic options (1 correct, 3 distractors, e.g. AI Image Generation / Old Photo, New Story / Photoshopped/Edited / Deepfake Video Frame).
2. Submit Report.

No evidence-select step — same reasoning as Case 001. With no decoys in Case 002, there's nothing to test in an evidence-select step, so Tactic ID is the only verdict step, with no exceptions.

### Scoring

All penalties below stack cumulatively and apply in real time as they happen during a round — e.g. 2 misclicks + a failed attempt + using +30 Seconds all subtract from the same round's score together, not just the single worst one.

- Each round starts at 100 points.
- Misclick (any click that isn't a real clue) â†’ -10 per misclick.
- Failed round (wrong tactic) â†’ -50 per failed attempt (double Case 001's -25), doesn't just discard the attempt.
- Timer runs out â†’ same -50 deduction as a failed round.
- +30 Seconds tool used â†’ -80 (stacks with fail/misclick penalties, per stacking rule above).
- Completing a round adds that round's score to a running case total.
- Each round's score is floored at 0 — a deduction cannot push a round's score negative, and negative balance does not carry over into the next round.
- If the cumulative total score across all cases hits 0, the entire A-Eye experience resets (same rule as Case 001 — see cumulative scoring note at top of doc).

### Failure / Retry Rules

- Wrong tactic â†’ partial reset (keep clues found, clear tactic pick, can keep exploring before resubmitting).
- Retries allowed until score hits 0 (see Scoring).
- Failing an attempt applies the -50 flat deduction from the Scoring section above (not a separate penalty).
- Show a short message explaining the reset, e.g. "That's not quite how this was faked. Take another look and try again."

### Flow Diagram

```
Show photo
   v
Player uses Magnifier, flags suspicious areas (real clues only, no decoys)
   v
Gate met? (2+ real clues flagged)
   No --> keep playing
   Yes
   v
"File Verdict" unlocks
   v
"How was this faked?" (4 tactic options)
   v
Submit Report
   v
Correct tactic?
   No --> retry (partial reset)
   Yes --> next photo/round or end of case (scoring per above)
```

### Implementation Checklist

- [x] 10 total rounds in the pool, only 5 shown per session (randomly selected)
- [x] Magnifier tool (hover to zoom)
- [x] Magnifier crosshair inverts color based on photo underneath (stays visible on dark and light photos)
- [x] Evidence Board — no hover-hint, player must genuinely spot the mistake
- [x] +30 Seconds tool — 1 per round max, costs -80, checks player has enough score before allowing use, button disabled if not, does not reveal any answer
- [x] 60-second timer per round (Case 002 only, not Case 001)
- [x] Timer runs out â†’ -50 deduction (same as failed round) AND retries with a RANDOM round, not the same round — applies even with partial progress
- [x] Wrong tactic (not timeout) â†’ same round repeats, partial reset, does NOT randomize
- [x] Gate: 2+ real clues flagged (no Source Check requirement, no tool-use requirement beyond Magnifier)
- [x] No decoys in Case 002 — any non-clue click is a misclick, not a decoy
- [x] Verdict Flow is tactic-ID only — no evidence-select step, no exceptions
- [x] 4 tactic options per round, 1 correct + 3 distinct distractors
- [x] Scoring: round starts at 100
- [x] All penalties stack cumulatively in real time (misclicks + failed attempts + tool use all subtract together, not just the worst one)
- [x] Scoring: misclick (any non-clue click) = -10
- [x] Scoring: failed round (wrong tactic) = -50
- [x] Scoring: timeout = -50 (same as failed round)
- [x] Scoring: +30 Seconds tool used = -80
- [x] Scoring: endless deductions, no flooring at 0
- [x] Scoring: completed round's score adds to running case total
- [x] Cumulative total (across all 3 cases) hitting 0 â†’ resets entire A-Eye experience

---

## Section 3 — Case 003 (Video Investigation)

### Format
- 2 video panels shown side-by-side, playing at the same time. Prompt: "Which one is AI?"
- Pool of 10 total video pairs, 5 shown per session (matches Case 002's pool structure).

### Tools
- Playback — both panels play automatically at the same time.
- Replay — 5 free "grace" replays allowed per round. Beyond 5, each additional replay deducts -10 from that round's score. Replay count resets to 5 fresh every time a new round loads (including after a random swap from a failed round).
- +30 Seconds tool — adds 30 seconds to the round's 60-second timer, costs -80, 1 use per round, requires enough score to use.

### Timer
- 60-second timer per round, same as Case 002.
- Timer runs out â†’ counts as a failed attempt (same penalty as picking the wrong panel — see Scoring). Retries with a random round, not the same one, same no-repeat-within-session rule as Case 002 (never re-show a round/theme already seen this session, swap only pulls from the session's 5 selected rounds).

### Verdict Flow
1. Player clicks the panel they believe is AI-generated.
2. "Are you sure?" confirmation before locking in.
3. Once confirmed, no more replays.
4. Player picks a "tell" reason from a short list (e.g. "blinking looked off," "face warped when turning," "hands/fingers looked wrong," "lighting was inconsistent") — this is the anti-guessing check.
5. Reveal screen shows "AI" / "Real" labels directly on each panel, regardless of whether the player was right.

### Scoring
- Each round starts at 100 points.
- Wrong panel picked â†’ -50 (matches Case 002's failed-round penalty).
- Correct panel + wrong tell â†’ -20 (partial penalty — got the harder part right, the panel, but couldn't explain why).
- Timeout â†’ -50 (same as wrong panel).
- +30 Seconds tool used â†’ -80.
- Extra replay beyond the 5 free ones â†’ -10 per extra replay.
- All penalties stack cumulatively in real time, same rule as Case 002.
- Round score floored at 0, no negative carryover.
- Completed round's score adds to the running case total.
- Cumulative total (across all cases) hitting 0 â†’ resets entire A-Eye experience, same as Case 001/002.

### Failure / Retry Rules
- Both wrong panel AND timeout randomize to a new round (not the same round) — this is different from Case 001/002, where only timeout randomizes and a normal wrong-tactic failure stays on the same round. Confirmed for Case 003: any failure (wrong panel or timeout) triggers a random swap.
- No-repeat rule applies: swap never re-shows a round/theme already seen this session, and only pulls from the session's 5 selected rounds.
- No max-attempts cap — retries allowed until score hits 0 (matches Case 001/002).

### Flow Diagram
```text
Show 2 video panels, play at the same time
   v
Optional replay(s)
   v
Player clicks a panel
   v
"Are you sure?" confirmation
   v (confirmed - no more replays)
Player picks a "tell" reason
   v
Reveal: "AI" / "Real" labels shown on each panel
   v
Correct panel?
   No --> retry with a random round (no repeats this session, applies to both wrong panel and timeout)
   Yes --> correct tell?
      No --> -20 penalty (lucky guess)
      Yes --> full score
   v
Next round or end of case (scoring per above)
```

### Implementation Checklist
- [x] 10 total video pairs in pool, 5 shown per session
- [x] 5 free grace replays per round, resets to 5 fresh on every new round (including after a random swap), extra replays beyond 5 = -10 each
- [x] "Are you sure?" confirmation kept before locking in a panel pick
- [x] 2 video panels, play side-by-side simultaneously
- [x] "Which one is AI?" prompt shown
- [x] 60-second timer per round
- [x] Timeout â†’ -50 penalty AND random round swap, no repeats within session, swap only from session's 5
- [x] Wrong panel (not timeout) â†’ -50 penalty, ALSO randomizes to a new round (unlike Case 001/002, both failure types randomize in Case 003)
- [x] No max-attempts cap — unlimited retries until score hits 0
- [x] Tell-selection step kept as anti-guessing check
- [x] Reveal screen shows AI/Real labels on both panels after answer
- [x] +30 Seconds tool: adds 30 sec to the round timer, -80 cost, 1 per round, requires sufficient score
- [x] Scoring: round starts at 100
- [x] Scoring: wrong panel = -50
- [x] Scoring: correct panel + wrong tell = -20
- [x] Scoring: timeout = -50
- [x] Scoring: +30 Seconds = -80
- [x] Scoring: extra replay beyond 5 free ones = -10 each
- [x] All penalties stack cumulatively
- [x] Round score floored at 0, no negative carryover
- [x] Cumulative total across all cases hitting 0 â†’ resets entire A-Eye experience

