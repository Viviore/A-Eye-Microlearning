const fs = require('fs');
let content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

// Add score state
content = content.replace(
  'const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);',
  'const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);\n  const [score, setScore] = useState<number>(0);'
);

// Add scoring to handleSubmitVerdict
content = content.replace(
  'if (evidence.tactic === selectedTactic) {\n      setFeedback({',
  `if (evidence.tactic === selectedTactic) {
      if (currentRoundIndex !== 0) {
        setScore(prev => prev + 100);
      }
      setFeedback({`
);

// Deduct score on decoy flag
content = content.replace(
  '} else if (segment.isDecoy) {\n      setFoundDecoys((prev) => [...prev, segment]);\n    }',
  `} else if (segment.isDecoy) {
      setFoundDecoys((prev) => [...prev, segment]);
      if (currentRoundIndex !== 0) {
        setScore(prev => Math.max(0, prev - 20));
      }
    }`
);

// Render score in UI
content = content.replace(
  `              <span \n                className={\`px-3 py-1 font-mono text-xs font-bold uppercase border-[3px] shadow-[2px_2px_0px_0px_#0F172A] \${currentRound.badgeColor}\`}\n                style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}\n              >\n                {currentRoundIndex === 0 ? "TUTORIAL" : \`ROUND \${currentRoundIndex} / \${sessionRounds.length - 1}\`}\n              </span>\n            </div>`,
  `              <span \n                className={\`px-3 py-1 font-mono text-xs font-bold uppercase border-[3px] shadow-[2px_2px_0px_0px_#0F172A] \${currentRound.badgeColor}\`}\n                style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}\n              >\n                {currentRoundIndex === 0 ? "TUTORIAL" : \`ROUND \${currentRoundIndex} / \${sessionRounds.length - 1}\`}\n              </span>\n            </div>\n            <div className="font-heading font-black text-2xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-1 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>\n              Score: <span className="text-[#FFB800] drop-shadow-[1px_1px_0px_rgba(15,23,42,1)]">{score}</span>\n            </div>`
);

fs.writeFileSync('src/app/level/1/page.tsx', content);
console.log('Score logic added.');
