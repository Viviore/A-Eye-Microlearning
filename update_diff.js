const fs = require('fs');
let content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

// Replace Easy
const easyRegex = new RegExp('difficulty: "Easy",\\s*badgeColor: "bg-green-100 text-green-700 border-green-700",', 'g');
content = content.replace(easyRegex, 'difficulty: "Medium",\n    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",');

// Replace Hard
const hardRegex = new RegExp('difficulty: "Hard",\\s*badgeColor: "bg-\\[#FFB800\\]/20 text-\\[#FFB800\\] border-\\[#FFB800\\]",', 'g');
content = content.replace(hardRegex, 'difficulty: "Medium",\n    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",');

fs.writeFileSync('src/app/level/1/page.tsx', content);
console.log('Done');
