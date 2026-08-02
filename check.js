const fs = require('fs');
const content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

const rounds = content.split('title: ').slice(1);
rounds.forEach((r, i) => {
  if (r.includes('tacticOptions')) {
    const titleMatch = r.match(/"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Unknown';
    const clues = (r.match(/isClue: true/g) || []).length;
    console.log(`Round ${i} (${title}): ${clues} clues`);
  }
});
