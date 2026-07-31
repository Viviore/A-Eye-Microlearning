# A-Eye — Investigation Cases Spec

## Shared Frame
The player is a new recruit at a fact-checking agency ("The Verify Desk" — placeholder name, swap for the real branding later). Each case is a tip that was sent in and might be fake. The player investigates it, builds an evidence board, and gives a final answer (verdict). Same main character and agency story runs through all 3 cases. Cases go in this order: text → photo → video, each one testing a different type of media literacy skill.

---

## Case 001 — Text Investigation

**Story:**
The Verify Desk gets a batch of suspicious posts to check. As a new recruit, the player works through them one at a time, starting with an easy scam and ending with a fake official government advisory.

**Learning Objective:**
Teach the player to spot fake text — scam patterns, made-up quotes, and messages that fake official authority.

**Structure:**
Like Case 003, this case has 1 tutorial round + 3 scored levels. Unlike Case 003, this case still uses the Evidence Board and evidence-citation verdict flow (flag clues, pick a verdict, pick supporting evidence). Difficulty ramps by how well-hidden the fake is:
- Level 1 (Easy) — Scam Scholarship Post — obvious scam pattern.
- Level 2 (Medium) — Fake Celebrity Endorsement — fabricated quote mixed with a real, recognizable name.
- Level 3 (Hard) — Fake Official Advisory — no obvious "scam tone," just false info dressed as legitimate.

**Tutorial Flow (Barangay Relief Goods post):**
In-game post text: "ALERT! Our barangay is giving out FAKE relief goods to flood victims! A barangay official said the goods are 'expired and unsafe.' Share this now before more people get hurt!"

The tutorial is fully guided by the A-Eye Agent mascot with a dynamic 10-step process:
1. **Introduction:** Mascot introduces the player to their role.
2. **Observation:** The main social media post is highlighted.
3. **Source Check:** The player is guided to open the Source Check panel.
4. **Verification:** Mascot explains how to compare the post's claims against official records.
5. **Flagging:** A specific suspicious quote is highlighted for the player to flag.
6. **Evidence Board:** The flagged clue appears on the right-hand Evidence Board.
7. **Verdict Initiation:** Player is guided to click the "File Verdict" button once enough evidence is collected.
8. **Evidence Selection (Modal):** Inside the verdict modal, the player selects their strongest piece of evidence.
9. **Tactic Identification:** Player matches the selected evidence to a specific manipulation tactic (e.g., "Fabricated Quote").
10. **Report Submission:** Player submits the final report for grading.
This tutorial round doesn't count as one of the 3 scored levels.

**Tools & Mechanics (used across all levels):**
- **Flag tool** — Click on a line of text in the post to mark it as suspicious. Flagged items move to the Evidence Board.
- **Source Check panel** — A simulated database the player opens to compare the post's claims against verified facts.
- **Evidence Board** — Tracks all flagged clues (and decoys) on the right side of the screen.
- **Verdict Modal** — A two-step filing system where players must first select their supporting evidence, then correctly identify the manipulation tactic used, before passing judgment.

---

### Level 1 (Easy) — Scam Scholarship Post

**Post:** "A post claims a university is opening 50 free scholarship slots for incoming students, but says applicants must first send a ₱500 'processing fee' to a personal GCash number to confirm their slot before tonight's deadline."

**Evidence (real clues):**
- Request for a "processing fee" sent to a personal GCash number — real scholarships don't ask for advance payment.
- Urgency pressure ("before tonight's deadline") meant to rush the reader into not checking.
- No link to an official university account or website.

**Decoy (looks suspicious but is true):**
- The university name mentioned is a real, existing school — flagging the school's name itself would be wrong.

**Success Conditions:**
- Player must flag at least 2 of the 3 real clues.
- Player must open Source Check at least once before the verdict unlocks.
- Verdict choices: Real / Fake.

---

### Level 2 (Medium) — Fake Celebrity Endorsement

**Post:** "A post shows a quote from a well-known local celebrity claiming they personally use and recommend a specific herbal supplement to cure diabetes, urging followers to buy it through a linked online store."

**Evidence (real clues):**
- The quote is fabricated — Source Check shows the celebrity never said this.
- The product isn't registered with the FDA (checkable via Source Check).
- The linked store isn't the celebrity's verified account.

**Decoy (looks suspicious but is true):**
- The celebrity's name and photo are real and correctly used — flagging the celebrity's identity itself would be wrong, only the quote and product claim are fake.

**Success Conditions:**
- Player must flag at least 2 of the 3 real clues.
- Player must open Source Check at least once before the verdict unlocks.
- Verdict choices: Real / Fake.

---

### Level 3 (Hard) — Fake Official Advisory

**Post:** "A post styled like an official LGU announcement states that all classes and government offices in the province are suspended tomorrow due to an incoming typhoon, citing a memo number and the mayor's signature."

**Evidence (real clues):**
- The memo number doesn't match official records (checkable via Source Check).
- The signature/format doesn't match the LGU's actual announcement template.
- No matching post exists on the official government social media account.

**Decoy (looks suspicious but is true):**
- The typhoon itself is a real, ongoing weather event — flagging the typhoon mention itself would be wrong, only the advisory claiming suspension is fake.

**Success Conditions:**
- Player must flag at least 2 of the 3 real clues.
- Player must open Source Check at least once before the verdict unlocks.
- Verdict choices: Real / Fake.

---

**Overall Case 001 Rules (all 3 levels):**
- Flagging a decoy does not block progress or count against the clue threshold, but flagging 2+ decoys in a level should lower that level's score.
- Verdict flow per level: pick verdict → pick supporting evidence → confirm, locked in. Same scoring table as the main Verdict/Scoring System (right verdict + right evidence = 100%, etc.).
- If a level's verdict is wrong: same Failure Progression rule as before — partial reset (keep found clues, clear verdict/evidence pick), unlimited retries, -10% retry penalty per attempt needed, with a message explaining why it reset.
- Case 001's total score is the average of the 3 level scores.

**Flow (per level):**
```
┌─────────────────────────┐
│   Show the post           │
└───────────┬──────────────┘
            ▼
┌─────────────────────────┐
│ Player flags lines        │
│ (real clues / decoys)     │
│ + opens Source Check      │
└───────────┬──────────────┘
            ▼
      ┌─────┴─────┐
      │  Gate met?  │  (2+ real clues found
      │             │   AND Source Check opened)
      └─────┬─────┘
        No  │  Yes
     ◄──────┘   │
   (keep         ▼
   playing) ┌─────────────────┐
            │ "File Verdict"    │
            │  unlocks          │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Pick verdict:     │
            │ Real / Fake       │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Pick supporting   │
            │ evidence          │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Confirm — locked  │
            │ in                │
            └────────┬──────────┘
                      ▼
              ┌───────┴───────┐
              │ Correct verdict?│
              └───────┬───────┘
          No  │               │  Yes
   ┌──────────┘               └──────────┐
   ▼                                       ▼
┌─────────────┐                 ┌─────────────────┐
│ Show why      │                 │ Score this level   │
│ wrong, retry  │                 │ (100/50/0% per      │
│ level (partial│                 │ table), then move    │
│ reset)        │                 │ to next level or      │
└─────────────┘                 │ end of Case 001        │
                                   └─────────────────┘
```

---

## Case 002 — Photo Investigation

**Story:**
A photo is going viral, appearing to show a local politician secretly accepting a bribe from someone — an envelope changing hands. It's spreading fast right before an election and damaging their reputation. The player has to check if it's a real photo or an AI-generated smear before it causes real damage.

**Learning Objective:**
Teach the player to spot the classic tells of an AI-generated image — things like wrong numbers of fingers, warped or unnatural hair, mismatched jewelry, garbled background text, or off-looking textures.

**Tutorial Flow:**
1. Show the photo zoomed into one clear AI mistake (like an extra finger or warped ear).
2. Guide the player to flag that spot.
3. The game explains what gave it away.
4. Player finds 2 more mistakes on their own.

**Tools:**
- Zoom tool.

**Gameplay Mechanics:**
Player zooms into parts of the photo, detective-style, looking for classic AI-generation mistakes: extra or missing fingers, warped hair, mismatched jewelry or accessories, garbled background text, or textures that look off. Player flags each spot they think is a mistake.

**Evidence:**
- 3–4 visual mistakes in the photo (e.g. a hand with 6 fingers, hair that doesn't follow a natural pattern, an earring that doesn't match its pair, blurry or nonsense text in the background).

**Decoy (1–2 spots that look like AI mistakes but aren't):**
- A part of the photo with an odd shadow, blur, or lighting quirk that looks like an artifact, but is actually just a normal camera or compression issue — a natural imperfection, not a sign of AI generation.

**Success Conditions:**
- Player must find at least 2 visual clues (not counting the tutorial's guided example — that one is free and doesn't count toward this total).
- Flagging a decoy does not block progress or count against the clue threshold, but flagging 2+ decoys should lower the player's score.
- Verdict choices: Real / AI-Generated.

**Flow:**
```
┌─────────────────────────┐
│   Show the photo          │
└───────────┬──────────────┘
            ▼
┌─────────────────────────┐
│ Tutorial: 1 AI mistake     │
│ shown + explained (free,   │
│ no count)                  │
└───────────┬──────────────┘
            ▼
┌─────────────────────────┐
│ Player zooms in, flags     │
│ suspicious spots           │
│ (real mistakes / decoys)   │
└───────────┬──────────────┘
            ▼
      ┌─────┴─────┐
      │  2+ real    │
      │  clues       │
      │  found?      │
      └─────┬─────┘
        No  │  Yes
     ◄──────┘   │
   (keep         ▼
   playing) ┌─────────────────┐
            │ "File Verdict"    │
            │  unlocks          │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Pick verdict:     │
            │ Real /            │
            │ AI-Generated      │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Pick supporting   │
            │ evidence          │
            └────────┬──────────┘
                      ▼
            ┌─────────────────┐
            │ Confirm — locked  │
            │ in                │
            └────────┬──────────┘
                      ▼
              ┌───────┴───────┐
              │ Correct verdict?│
              └───────┬───────┘
          No  │               │  Yes
   ┌──────────┘               └──────────┐
   ▼                                       ▼
┌─────────────┐                 ┌─────────────────┐
│ Show why      │                 │ Score based on    │
│ wrong, replay │                 │ verdict+evidence   │
│ case (partial │                 │ table, then         │
│ reset)        │                 │ Reflection/Debrief  │
└─────────────┘                 └─────────────────┘
```

---

## Case 003 — Video Investigation

**Story:**
Two versions of the same leaked clip are being shared online — showing a public official appearing to say something controversial. Only one version is real. The other is an AI-made fake. This is the hardest case and the last one in the game.

**Learning Objective:**
Teach the player to spot deepfake video tells in a short clip — things like unnatural mouth movement, odd blinking, warped facial features, or lighting/motion that looks off — by comparing a real and a fake clip side by side.

**Structure:**
This case has 3 levels, each its own round of the same panel-pick format. Difficulty comes only from the footage itself (cucumbers = easy, race = medium, sushi = hard) — no other rules change between levels. Same 5-second play time, same 1 replay, same 3 attempts across all 3 levels. This case does NOT use the Evidence Board or the evidence-citation step from the shared Verdict System — it's a standalone watch-then-pick format.

**Video Assets:**
4 video sets, 8 videos total — 1 real + 1 AI-generated per set:
- Tutorial set: making pancakes (used only for the guided tutorial round, not one of the 3 scored levels)
- Set 1 (Level 1, Easy): cutting cucumbers
- Set 2 (Level 2, Medium): a race
- Set 3 (Level 3, Hard): creating sushi

Files will be provided by the user and placed in the project's root folder. (Not generated in-engine — actual video files.)

**Tutorial Flow:**
1. Before Level 1, show one example round with 2 panels playing.
2. Point out one clear tell in the AI panel (e.g. an unnatural blink or mouth movement that doesn't match the words).
3. Explain why that panel is the fake one.
4. This tutorial round doesn't count as one of the 3 levels.

**Tools:**
- None needed — just Play and a limited Replay (1 replay allowed) before the player has to choose.

**Gameplay Mechanics (per level):**
- Two video panels (Panel 1 and Panel 2) play at the same time for about 5 seconds.
- One panel is the real clip, the other is AI-generated.
- After watching, the player can replay once if needed.
- Player clicks the panel they believe is the AI-generated one, then a "Are you sure?" confirmation appears before it locks in.
- Once confirmed, there's no turning back or rewatching — no more replays after this point.
- Only after confirming their panel pick does the player then pick which tell made them choose it, from a short list (e.g. "blinking looked off," "mouth didn't match," "hands/fingers looked wrong," "lighting was inconsistent").
- This tell-pick is the anti-guessing check for Case 003 — a lighter version of the evidence-citation step used in Case 001/002, sized down for a 5-second clip instead of a full evidence board.

**Attempts:**
- Player gets up to 3 attempts per level.
- Picking the correct panel always passes the level, even if the tell picked was wrong — a wrong tell only lowers the score (see Scoring below), it does NOT use up an attempt or count as a strike.
- Wrong panel on attempt 1 or 2 → same level plays again (same video pair), player tries again.
- After the 3rd wrong-panel attempt: the level is marked as failed and the player moves on to the next level (or ends the case, if it was Level 3) instead of getting stuck. Show a short message first, e.g. "You'll move on for now — this one's flagged as unresolved." A failed level scores 0% for that level, which drags down the Case 003 total. This keeps the game fully playable start to finish even if a player can't get one level, which matters for hackathon demos.

**Success Conditions:**
- Player picks the correct panel (the AI-generated one) within 3 attempts to pass that level.
- No clue count or evidence minimum — right or wrong is based only on the panel picked.
- Player must pass all 3 levels to complete Case 003.

**Scoring (Case 003 only — different from Case 001/002):**
Each level's score depends on which attempt it was solved on, AND whether the tell picked was actually present in that clip:
- Correct panel + correct tell, attempt 1 → 100%
- Correct panel + correct tell, attempt 2 → 90%
- Correct panel + correct tell, attempt 3 → 80%
- Correct panel + wrong tell (any attempt) → 50%, same "lucky guess" logic as Case 001/002 — right answer, no real proof
- Failed after 3 attempts → 0%

Case 003's total score is the average of all 3 level scores.

**Flow:**
```
┌─────────────────────────┐
│ Tutorial round             │
│ (pancakes clip — doesn't   │
│ count as a level)          │
└───────────┬──────────────┘
            ▼
   ┌──────────────────┐
   │  LEVEL LOOP        │  (Level 1 → 2 → 3:
   │  (attempt 1 of 3)  │   cucumbers → race → sushi)
   └─────────┬──────────┘
             ▼
   ┌───────────────────────┐
   │ Panel 1 + Panel 2 play   │
   │ at once, ~5 sec           │
   └─────────┬─────────────┘
             ▼
   ┌───────────────────────┐
   │ Optional 1 replay        │
   └─────────┬─────────────┘
             ▼
   ┌───────────────────────┐
   │ Player clicks a panel    │
   └─────────┬─────────────┘
             ▼
   ┌───────────────────────┐
   │ "Are you sure?"           │
   │ confirmation               │
   └─────────┬─────────────┘
             ▼ (confirmed — no more replays)
   ┌───────────────────────┐
   │ Pick a "tell" reason      │
   └─────────┬─────────────┘
             ▼
       ┌─────┴─────┐
       │  Correct    │
       │  panel?     │
       └─────┬─────┘
    No  │             │  Yes
        ▼             ▼
 ┌─────────────┐  ┌─────────────────┐
 │ Attempt      │  │ Level passed      │
 │ used (max 3) │  │ Correct tell? →    │
 └──────┬──────┘  │ 100/90/80% by      │
        │          │ attempt #           │
        │          │ Wrong tell → 50%    │
   3rd fail?        └────────┬───────────┘
        │                    │
   No → retry level           ▼
        │             ┌───────────────┐
   Yes → mark level     │ Next level, or  │
   FAILED (0%),          │ end of Case 003 │
   move to next level    └───────────────┘
```

---

## Open Dependencies (not written yet)
- The Evidence Board (Section 9.5) and Verdict System (Section 9.6) are used by all 3 cases above but haven't been written yet. These need to be locked down before the cases can actually be built.

### Verdict System — decisions made so far
- Purpose: this is where the player commits to a final answer, and the game checks if the evidence they found actually backs up that answer — not just that they clicked something. This is also where the teaching happens (Reflection + Debrief right after).
- It's a full-screen transition when the player submits, not a small pop-up box. Reflection (9.7) and Learning Debrief (9.8) should probably also be full screens shown one after another, not pop-ups — still needs a final decision.
- To unlock "File Verdict": stays at the partial amount already set per case in Success Conditions above (like 3 of 5 for Case 001) — the player does NOT need to find every single clue. Reason: forcing the player to find 100% of the evidence teaches them to be a completionist, not to use good judgment. Also, some evidence might be a red herring or unclear, so "find everything" isn't always possible to cleanly finish.
- How thorough the player was (finding more clues than the minimum) should change their score instead of blocking the verdict button. That's something to define in the Scoring System (Section 18).
- The player only gets one shot at the verdict per case — no retrying after submitting. This stops the player from just guessing buttons until one works.
- Before showing the verdict choices, the player must first pick 1–2 pieces of evidence from their board that support the answer they're about to give ("Why do you think this is Fake?" → pick the clues that back it up). Steps:
  1. Player picks the verdict they're leaning toward
  2. Player picks the evidence that supports that verdict
  3. Player confirms — locked in, can't change it after
- Reason: this stops the player from submitting with no real evidence behind it, and gives us a second way to check understanding — a player might get the verdict right by luck but pick the wrong supporting evidence, which shows they didn't actually get it.
- What this affects: Data Models (Section 16) — the verdict submission now needs to also save which evidence the player picked, not just their final answer. Scoring System (Section 18) — right verdict + right evidence = full points; right verdict + wrong evidence = partial points (a sign they were guessing).
- **Exception:** Case 003 does NOT follow this Evidence Board + evidence-citation flow. It uses a standalone side-by-side pick-and-tell format instead, with its own scoring system — see Case 003's Gameplay Mechanics, Attempts, and Scoring sections for the full rules.

### Scoring System — decisions made so far
Score is calculated per case based on the combination of verdict (right/wrong) and evidence picked (right/wrong):

| Verdict | Evidence Picked | Meaning | Score |
|---|---|---|---|
| Correct | Correct | Player actually understood the case | 100% |
| Correct | Wrong | Got the right answer without real proof — likely guessed | 50% |
| Wrong | Correct | Found the right clues but drew the wrong conclusion | 50% |
| Wrong | Wrong | Didn't understand the case | 0% |

- Both 50% outcomes should trigger different feedback text in Reflection (Section 9.7), even though the score is the same — "right evidence, wrong conclusion" is a different lesson than "right answer, no real proof." This needs to be written into Section 9.7 later.
- Decoy penalty: flagging 1 decoy = no penalty (could be an honest mistake). Flagging 2 or more decoys = minus 10% from the case's final score per decoy, down to a floor of 0% (score can't go negative).
- Retry penalty: minus 10% off the case's final score if the player needed at least one retry (wrong verdict) before getting it right. Stacks with the decoy penalty. See Failure Progression below for how retries work.
- **Note:** this table (right verdict/wrong verdict × right evidence/wrong evidence) applies to Case 001 and Case 002 only. Case 003 has its own scoring system — see Case 003's Scoring section.

### Failure Progression — decision made
- If a player gets the verdict wrong, they have to try the case again. They don't move on to the next case, and they don't get stuck forever — they just redo it.
- This is a **partial reset**:
  - They keep the clues and decoys they already found.
  - Their verdict pick and evidence pick get cleared — they have to choose again.
  - They can still look for clues they missed before submitting again.
  - The tutorial's guided clue still counts — they don't redo the onboarding.
- Before sending them back in, show a short message telling them why: e.g. "Your verdict didn't match the evidence. Take another look and try again." Don't just drop them back into the case with no explanation.
- Retry penalty: if they needed a retry, minus 10% off that case's score. This is added on top of the decoy penalty, not instead of it. It gives guessing a small real cost.
- **Exception — Case 003:** unlike Case 001 and 002 (unlimited retries), Case 003 caps retries at 3 attempts per level. After the 3rd wrong attempt, the level is marked failed (0% for that level) and the player moves on instead of getting stuck — see Case 003 Attempts section. The retry penalty (-10% per retry needed) still applies here, but there's no "evidence kept" partial reset since Case 003 has no evidence board — each retry is just the same video pair playing again.

### Flow Gaps — open questions, not answered yet
- [x] Scoring — RESOLVED. Full 4-outcome matrix added under Scoring System above, plus the decoy penalty rule (2+ decoys = -10% per decoy). Still need to write the actual feedback text for the two 50% outcomes into Section 9.7 (Reflection) later.
- [x] Decoy evidence — RESOLVED. All 3 cases now have 1–2 decoys each in their Evidence sections. Flagging a decoy doesn't block progress, but flagging 2+ should lower score (exact numbers still pending, ties into the scoring gap below).
- [x] Tool-requirement consistency — RESOLVED for Case 001 and 002 (Case 001 requires opening Source Check at least once; Case 002 no longer uses Reverse Search after the redesign below). NOTE: Case 003 was later redesigned into a standalone panel-pick format and no longer uses this evidence-board rule at all — see Case 003 and the Verdict System exception note.
- [x] Failure progression — RESOLVED. Wrong verdict = replay the case from the start. See Failure Progression section above.
- [x] Tutorial-guided clue counting — RESOLVED. The tutorial's guided example clue does NOT count toward the "find X of Y" threshold in Case 001 and 002. It's free/onboarding only, so the real threshold has to be found by the player on their own.
- [x] Case 003 tutorial video source — RESOLVED. Tutorial uses its own separate 4th video pair (pancakes), not one of the 3 scored levels. 4 sets / 8 videos total.
- [x] Case 003 level difficulty progression — RESOLVED. Difficulty comes only from the footage itself (cucumbers easy → race medium → sushi hard). No other rules (clip time, replays, attempts) change between levels.
- [x] Case 003 anti-guessing check — RESOLVED. Player now picks a "tell" reason after picking a panel. Correct panel + correct tell = full score. Correct panel + wrong tell = passes the level but scores 50% (lucky guess). Wrong panel = uses up an attempt. See Case 003 Gameplay Mechanics, Attempts, and Scoring sections.
- [x] Case 002 story — RESOLVED. New concrete scenario: a viral photo appears to show a local politician accepting a bribe, spreading right before an election. Player checks if it's real or an AI-generated smear.
