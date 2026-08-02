const fs = require('fs');
let content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

// Update difficulties
content = content.replace(/difficulty: "Easy",\s*badgeColor: "bg-green-100 text-green-700 border-green-700",/g, 'difficulty: "Medium",\n    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",');
content = content.replace(/difficulty: "Hard",\s*badgeColor: "bg-\\[#FFB800\\]\\/20 text-\\[#FFB800\\] border-\\[#FFB800\\]",/g, 'difficulty: "Medium",\n    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",');

// Add sessionRounds state
content = content.replace(
  /const \[currentRoundIndex, setCurrentRoundIndex\] = useState<number>\(0\);\n  const currentRound = TEXT_ROUNDS\[currentRoundIndex\];/g,
  `const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [sessionRounds, setSessionRounds] = useState<TextRound[]>(TEXT_ROUNDS.slice(0, 6));

  useEffect(() => {
    const nonTutorial = TEXT_ROUNDS.filter(r => r.difficulty !== "Tutorial");
    const shuffled = nonTutorial.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    const tutorial = TEXT_ROUNDS.find(r => r.difficulty === "Tutorial");
    if (tutorial) {
      setSessionRounds([tutorial, ...selected]);
    } else {
      setSessionRounds(selected);
    }
  }, []);

  const currentRound = sessionRounds[currentRoundIndex];`
);

// Replace TEXT_ROUNDS.length with sessionRounds.length
content = content.replace(/TEXT_ROUNDS\.length/g, 'sessionRounds.length');

fs.writeFileSync('src/app/level/1/page.tsx', content);
console.log('Done modifying page.tsx');
