const fs = require('fs');
let content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

// Fix decoy deduction to allow negative scores (so penalties apply before they earn round points)
content = content.replace(
  'setScore(prev => Math.max(0, prev - 20));',
  'setScore(prev => prev - 20);'
);

// Add penalty for wrong verdict (retry)
content = content.replace(
  `    } else {
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite the right manipulation tactic for this evidence. Review the quote and try again."
      });
    }`,
  `    } else {
      if (currentRoundIndex !== 0) {
        setScore(prev => prev - 10); // Deduct 10 points for wrong verdict (retry penalty)
      }
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite the right manipulation tactic for this evidence. Review the quote and try again. (-10 Points)"
      });
    }`
);

fs.writeFileSync('src/app/level/1/page.tsx', content);
console.log('Penalties updated.');
