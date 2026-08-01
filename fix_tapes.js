
const fs = require("fs");
const files = [
  "src/app/page.tsx",
  "src/app/level/1/page.tsx",
  "src/app/level/2/page.tsx",
  "src/app/quiz/post/page.tsx"
];
for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  // The regex to match the tape div
  const regex = /<div\s+className="absolute -top-[34] left-1\/2 -translate-x-1\/2 w-\d+ h-[468] bg-\\[#0F172A\\]\/10 border border-\\[#0F172A\\]\/20 shadow-\\[0_[12]px_[24]px_rgba\(0,0,0,0\.1\)\\] -?rotate-\d backdrop-blur-md z-20 pointer-events-none"\s+style={{ clipPath: "polygon\([^)]+\)" }}\s+\/>/g;
  const pushPin = `<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20"><div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" /></div>`;
  content = content.replace(regex, pushPin);
  fs.writeFileSync(file, content);
}
console.log("Done");

