const fs = require('fs');
const path = 'c:/Users/ROG STRIX/Desktop/A-Eye/src/app/level/3/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const replacement = `  const handleTellClick = (tell: string) => {
    if (showReveal) return;
    setSelectedTell(tell);
    setShowReveal(true);
    
    const isCorrectPanel = selectedPanel === currentRound.correctPanel;
    const isCorrectTell = currentRound.tells.includes(tell);
    let finalScore = roundScore;

    if (!isCorrectPanel) {
      applyDeduction(50);
      finalScore = Math.max(0, finalScore - 50);
      setFeedback({
        isSuccess: false,
        title: "WRONG PANEL",
        message: (<>You picked the wrong panel. The other video was the AI-generated one.</>),
        penalty: 50,
      });
    } else if (!isCorrectTell) {
      applyDeduction(25);
      finalScore = Math.max(0, finalScore - 25);
      setFeedback({
        isSuccess: false,
        title: "LUCKY GUESS",
        message: (<>You picked the correct panel, but your reasoning was wrong.</>),
        penalty: 25,
      });
      if (!currentRound.isTutorial) {
        addCumulativeScore(finalScore);
        addCase003Score(finalScore);
        markCase003RoundPlayed(currentRound.id);
      }
    } else {
      if (!currentRound.isTutorial) {
        addCumulativeScore(finalScore);
        addCase003Score(finalScore);
        markCase003RoundPlayed(currentRound.id);
      }
      setFeedback({
        isSuccess: true,
        title: "VERDICT VERIFIED",
        message: "Great job! You successfully identified the AI video and the correct reasoning.",
        scoreBadge: !currentRound.isTutorial ? (
          <span className="inline-block bg-[#10B981] text-white border-[3px] border-[#0F172A] px-3 py-1 font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            +{finalScore} Points
          </span>
        ) : undefined,
      });
    }
  };

  const handleNextAction = () => {`;

// The file is currently very mangled.
// Find the exact line "  const handleTellClick = (tell: string) => {" OR where "videoARef.current.play();" ends.
const beforeIndex = code.indexOf('    if (videoARef.current && videoBRef.current) {');
const before = code.substring(0, beforeIndex + 120);

// Find handleNextAction
const afterIndex = code.indexOf('    if (timeLeft === 0 || selectedPanel !== currentRound.correctPanel) {');
const after = code.substring(afterIndex);

const finalCode = before.substring(0, before.lastIndexOf('}')) + '    }\n  };\n\n' + replacement + '\n' + after;

fs.writeFileSync(path, finalCode);
console.log('Fixed');
