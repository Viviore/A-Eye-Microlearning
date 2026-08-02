const fs = require('fs');
let content = fs.readFileSync('src/app/level/1/page.tsx', 'utf8');

const replacements = [
  // Round 0
  ['title: "Barangay Relief Goods"', 'title: "Community Relief Goods"'],
  ['Our barangay is giving out FAKE', 'Our city council is giving out FAKE'],
  ["An unnamed barangay official stated", "An unnamed city official stated"],
  ["Official Barangay Page:", "Official City Council Page:"],
  
  // Round 1
  ["Ateneo de Manila University", "National State University"],
  ["₱500", "$50"],
  ["GCash number 09123456789", "CashApp tag $UniScholarships"],
  ["Scam Alert Database:</strong> Mobile number 09123456789", "Scam Alert Database:</strong> CashApp tag $UniScholarships"],
  ["We do not ask for GCash processing fees", "We do not ask for CashApp processing fees"],
  
  // Round 2
  ["Dingdong Dantes", "a famous actor"],
  ["FDA Philippines Database", "National Health Database"],
  ["FDA Philippines", "National Health Authority"],
  
  // Round 3
  ["Provincial Gov Updates", "Regional Gov Updates"],
  ["@ProvGov_Updates", "@RegionalGov_Updates"],
  ["in the province are SUSPENDED", "in the region are SUSPENDED"],
  
  // Round 4
  ["₱5,000 to ₱10,000", "$500 to $1,000"],
  ["₱250", "$25"],
  ["via GCash", "via CashApp"],
  ["DOLE Advisory", "Labor Dept Advisory"],
  ["http://bit.ly/yt-jobs-ph-2023", "http://bit.ly/yt-jobs-2024"],
  
  // Round 5
  ["BDO Account Holders", "Global Bank Account Holders"],
  ["@BDO_Security_Updates", "@GlobalBank_Security"],
  ["www.bdo-security-unlock-ph.com", "www.globalbank-security-unlock.com"],
  ["bdo.com.ph", "globalbank.com"],
  ["'bdo-security-unlock-ph.com'", "'globalbank-security-unlock.com'"],
  ["Official Bank Advisory", "Official Bank Advisory"],
  ["BDO alerts", "Global Bank alerts"],
  
  // Round 6
  ["MrBeast Philippines", "MrBeast Giveaways"],
  ["@MrBeast_PH_Giveaways", "@MrBeast_Global_Giveaways"],
  ["₱50,000", "$10,000"],
  ["₱150", "$30"],
  ["Philippines giveaway page", "regional giveaway page"],
  
  // Round 7
  ["SEC and BSP", "SEC and National Bank"],
  
  // Round 8
  ["₱2 Million", "$200,000"],
  ["GCash: 09998887776", "CashApp: $HelpBabyAngel"],
  ["GCash account", "CashApp account"],
  ["Hospitals in the Philippines cannot legally deny emergency life-saving treatment due to inability to pay (RA 8344).", "Hospitals in most regions cannot legally deny emergency life-saving treatment due to inability to pay (Emergency Medical Act)."],
  
  // Round 9
  ["Cebu Pacific Promos", "Oceanic Airlines Promos"],
  ["@CebPac_SeatSale", "@Oceanic_SeatSale"],
  ["PISO FARE ALERT", "$1 FLIGHT ALERT"],
  ["₱1 base fares", "$1 base fares"],
  ["www.piso-fare-cebpac-2024.net", "www.1dollar-oceanic-flights-2024.net"],
  ["cebupacificair.com", "oceanicairlines.com"],
  ["'piso-fare-cebpac-2024.net'", "'1dollar-oceanic-flights-2024.net'"]
];

replacements.forEach(([search, replace]) => {
  content = content.split(search).join(replace);
});

fs.writeFileSync('src/app/level/1/page.tsx', content);
console.log('Done replacing strings.');
