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
- Decoy click → -10 per decoy click (applies immediately to live score with a floating animation).
- Failed round (wrong tactic) → -25 per failed attempt (applies immediately with floating animation).
- Completing a round permanently banks that round's remaining score into the case total.
- **Deductions:** Can be endless. If `roundScore` + `cumulativeScore` hits 0 or below, it's Game Over.
- If the cumulative total score across all cases hits 0 (not just a single round — see cumulative scoring note at top of doc), the entire A-Eye experience resets — all cases (001/002/003) reset.

### Failure / Retry Rules

- Wrong tactic → partial reset (keep clues found, clear tactic pick, can keep exploring before resubmitting).
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
- [x] Decoy click → in-context warning shown, applies -10 deduction immediately
- [x] Verdict Flow is tactic-ID only — no Real/Fake step, no evidence-select step
- [x] 4 tactic options per round, 1 correct + 3 distinct non-overlapping distractors
- [x] Scoring: round starts at 100
- [x] Scoring UI: display is a single merged live score (Bank + Current Round)
- [x] Scoring: decoy click = -10 (with floating deduction animation)
- [x] Scoring: failed round (wrong tactic) = -25 (with floating deduction animation)
- [x] Scoring: endless deductions, no flooring at 0
- [x] Scoring: completed round's score adds to running case total
- [x] Cumulative total (across all 3 cases) hitting 0 → resets entire A-Eye experience
- [x] Wrong tactic → partial reset (keep clues found, clear tactic pick), same round repeats
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
- Timer runs out → counts as a failed attempt (same -50 deduction as a wrong tactic — see Scoring). Player retries with a random round, not the same round that timed out — this applies no matter how much progress was made (even partial, e.g. only 1 of 2 clues found). This is different from a normal wrong-tactic failure: if the player found all the clues but still picked the wrong tactic, the round stays the same (per Failure/Retry Rules below) — randomizing only applies specifically to a timeout, not to a wrong-tactic fail.

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
- Misclick (any click that isn't a real clue) → -10 per misclick.
- Failed round (wrong tactic) → -50 per failed attempt (double Case 001's -25), doesn't just discard the attempt.
- Timer runs out → same -50 deduction as a failed round.
- +30 Seconds tool used → -80 (stacks with fail/misclick penalties, per stacking rule above).
- Completing a round adds that round's score to a running case total.
- Each round's score is floored at 0 — a deduction cannot push a round's score negative, and negative balance does not carry over into the next round.
- If the cumulative total score across all cases hits 0, the entire A-Eye experience resets (same rule as Case 001 — see cumulative scoring note at top of doc).

### Failure / Retry Rules

- Wrong tactic → partial reset (keep clues found, clear tactic pick, can keep exploring before resubmitting).
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
- [x] Timer runs out → -50 deduction (same as failed round) AND retries with a RANDOM round, not the same round — applies even with partial progress
- [x] Wrong tactic (not timeout) → same round repeats, partial reset, does NOT randomize
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
- [x] Cumulative total (across all 3 cases) hitting 0 → resets entire A-Eye experience

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
- Timer runs out → counts as a failed attempt (same penalty as picking the wrong panel — see Scoring). Retries with a random round, not the same one, same no-repeat-within-session rule as Case 002 (never re-show a round/theme already seen this session, swap only pulls from the session's 5 selected rounds).

### Verdict Flow
1. Player clicks the panel they believe is AI-generated.
2. "Are you sure?" confirmation before locking in.
3. Once confirmed, no more replays.
4. Player picks a "tell" reason from a short list (e.g. "blinking looked off," "mouth didn't match," "hands/fingers looked wrong," "lighting was inconsistent") — this is the anti-guessing check.
5. Reveal screen shows "AI" / "Real" labels directly on each panel, regardless of whether the player was right.

### Scoring
- Each round starts at 100 points.
- Wrong panel picked → -50 (matches Case 002's failed-round penalty).
- Correct panel + wrong tell → -20 (partial penalty — got the harder part right, the panel, but couldn't explain why).
- Timeout → -50 (same as wrong panel).
- +30 Seconds tool used → -80.
- Extra replay beyond the 5 free ones → -10 per extra replay.
- All penalties stack cumulatively in real time, same rule as Case 002.
- Round score floored at 0, no negative carryover.
- Completed round's score adds to the running case total.
- Cumulative total (across all cases) hitting 0 → resets entire A-Eye experience, same as Case 001/002.

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
- [ ] 10 total video pairs in pool, 5 shown per session
- [ ] 5 free grace replays per round, resets to 5 fresh on every new round (including after a random swap), extra replays beyond 5 = -10 each
- [ ] "Are you sure?" confirmation kept before locking in a panel pick
- [ ] 2 video panels, play side-by-side simultaneously
- [ ] "Which one is AI?" prompt shown
- [ ] 60-second timer per round
- [ ] Timeout → -50 penalty AND random round swap, no repeats within session, swap only from session's 5
- [ ] Wrong panel (not timeout) → -50 penalty, ALSO randomizes to a new round (unlike Case 001/002, both failure types randomize in Case 003)
- [ ] No max-attempts cap — unlimited retries until score hits 0
- [ ] Tell-selection step kept as anti-guessing check
- [ ] Reveal screen shows AI/Real labels on both panels after answer
- [ ] +30 Seconds tool: adds 30 sec to the round timer, -80 cost, 1 per round, requires sufficient score
- [ ] Scoring: round starts at 100
- [ ] Scoring: wrong panel = -50
- [ ] Scoring: correct panel + wrong tell = -20
- [ ] Scoring: timeout = -50
- [ ] Scoring: +30 Seconds = -80
- [ ] Scoring: extra replay beyond 5 free ones = -10 each
- [ ] All penalties stack cumulatively
- [ ] Round score floored at 0, no negative carryover
- [ ] Cumulative total across all cases hitting 0 → resets entire A-Eye experience
