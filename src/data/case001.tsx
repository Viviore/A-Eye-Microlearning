import React from 'react';

export type TextSegment = {
  id: string;
  text: string;
  isClue?: boolean;
  isDecoy?: boolean;
  explanation?: string;
  tactic?: string;
};

export type TextRound = {
  id: number;
  difficulty: "Tutorial" | "Easy" | "Medium" | "Hard";
  badgeColor: string;
  title: string;
  postAuthor: string;
  postHandle: string;
  postTime: string;
  segments: TextSegment[];
  sourceCheckContent: React.ReactNode;
  correctVerdict: "Real" | "Fake";
  cluesNeeded: number;
  tacticOptions: string[];
};

export const TEXT_ROUNDS: TextRound[] = [
  {
    id: 0,
    difficulty: "Tutorial",
    badgeColor: "bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]",
    title: "Community Relief Goods",
    postAuthor: "Concerned Citizen",
    postHandle: "@truthseeker99",
    postTime: "2 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 1,
    tacticOptions: ["Vague Attribution", "Artificial Urgency", "Phishing Link"],
    segments: [
      { id: "t-1", text: "ALERT! Our city council is giving out FAKE relief goods to flood victims! " },
      { 
        id: "t-2", 
        text: "An unnamed city official stated that the distributed items were 'expired and unsafe for consumption.' ", 
        isClue: true, 
        explanation: "Vague attribution: Which official? Real alerts name the source.",
        tactic: "Vague Attribution"
      },
      { id: "t-3", text: "Share this now before more people get hurt!" }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official City Council Page:</strong> "No relief goods have been distributed yet. Distribution starts tomorrow."</p>
        <p className="text-[#0F172A]"><strong>Local News:</strong> No reports of expired goods in this area.</p>
      </div>
    )
  },
  {
    id: 1,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Scam Scholarship Post",
    postAuthor: "University Admissions Update",
    postHandle: "@UniScholarshipsPh",
    postTime: "4 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Advance Fee Fraud", "Artificial Urgency", "Unofficial Domain", "Vague Attribution"],
    segments: [
      { 
        id: "1-1", 
        text: "ALERT! National State University is opening 50 FREE scholarship slots for incoming students! ", 
        isDecoy: true,
        explanation: "The university name is real, but scammers often use real institutions to build trust."
      },
      { 
        id: "1-2", 
        text: "To secure your slot, applicants must first send a $50 'processing fee' to CashApp tag $UniScholarships. ", 
        isClue: true,
        explanation: "Real scholarships never ask for a processing fee via personal mobile wallets.",
        tactic: "Advance Fee Fraud"
      },
      { 
        id: "1-3", 
        text: "Hurry and send your payment before tonight's deadline to guarantee your future! ", 
        isClue: true,
        explanation: "Artificial urgency ('tonight's deadline') is a classic scam tactic to rush victims.",
        tactic: "Artificial Urgency"
      },
      { 
        id: "1-4", 
        text: "PM us your receipt. No official website link available at the moment."
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official University Website:</strong> "We do not ask for CashApp processing fees. All scholarship applications are processed through our official portal."</p>
        <p className="text-[#0F172A]"><strong>Scam Alert Database:</strong> CashApp tag $UniScholarships has been flagged multiple times for 'Advance Fee' fraud.</p>
      </div>
    )
  },
  {
    id: 2,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Celebrity Endorsement",
    postAuthor: "Health & Wellness Daily",
    postHandle: "@HealthyLifePh",
    postTime: "12 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Fabricated Quote", "Unregistered Product", "Suspicious Storefront", "Artificial Urgency"],
    segments: [
      { id: "2-1", text: "Have you tried this new miracle cure? " },
      { 
        id: "2-2", 
        text: "Even a famous actor swears by it! ", 
        isDecoy: true,
        explanation: "The celebrity's name is correctly used, but their endorsement is entirely fabricated."
      },
      { 
        id: "2-3", 
        text: "\"I was struggling with high blood sugar until I found GlucoCure Max. It completely reversed my diabetes in 2 weeks!\" ", 
        isClue: true,
        explanation: "The quote is entirely fabricated and doesn't appear on any of his official channels.",
        tactic: "Fabricated Quote"
      },
      { 
        id: "2-4", 
        text: "This FDA-approved herbal supplement is selling out fast. ", 
        isClue: true,
        explanation: "Checking the FDA database reveals this product is NOT registered.",
        tactic: "Unregistered Product"
      },
      { 
        id: "2-5", 
        text: "Buy it now exclusively at this unverified Shopify link: buy-gluco-max-now.shop.co"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Celebrity Official Page:</strong> "I am not endorsing any diabetes supplement. Please beware of fake ads using my name."</p>
        <p className="text-[#0F172A]"><strong>National Health Database:</strong> 0 results found for "GlucoCure Max". Not a registered food or drug product.</p>
      </div>
    )
  },
  {
    id: 3,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Official Advisory",
    postAuthor: "Regional Gov Updates",
    postHandle: "@RegionalGov_Updates",
    postTime: "1 hr ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Unverified Claim", "Fabricated Memo", "Advance Fee Fraud", "Fabricated Quote"],
    segments: [
      { 
        id: "3-1", 
        text: "Due to the incoming Super Typhoon, ", 
        isDecoy: true,
        explanation: "The typhoon itself is a real, ongoing weather event. Flagging the typhoon is wrong, only the suspension claim is fake."
      },
      { 
        id: "3-2", 
        text: "all classes (all levels) and government work in the region are SUSPENDED tomorrow. ", 
        isClue: true,
        explanation: "No matching post exists on the official government social media account.",
        tactic: "Unverified Claim"
      },
      {
        id: "3-3",
        text: "Per Memo No. 45-B, signed by the Mayor. ",
        isClue: true,
        explanation: "The memo number doesn't match official records (checkable via Source Check).",
        tactic: "Fabricated Memo"
      },
      {
        id: "3-4",
        text: "Stay safe and stay indoors! Share to inform others."
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official Gov PIO Page:</strong> "No suspension of classes has been announced yet. We are monitoring the weather."</p>
        <p className="text-[#0F172A]"><strong>Memo Database:</strong> Memo No. 45-B was issued last year for a completely different event.</p>
      </div>
    )
  },
  {
    id: 4,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Job Offer",
    postAuthor: "HR Recruitment PH",
    postHandle: "@JobsPH_Official",
    postTime: "30 mins ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Advance Fee Fraud", "Unofficial Domain", "Too Good to Be True", "Phishing Link"],
    segments: [
      { id: "4-1", text: "WORK FROM HOME: Earn $500 to $1,000 daily by just watching YouTube videos! " },
      { 
        id: "4-2", 
        text: "We are hiring 100 people today for immediate start. No experience needed! ", 
        isDecoy: true,
        explanation: "While 'no experience needed' is common, the ridiculous pay rate for watching videos is the real red flag."
      },
      { 
        id: "4-3", 
        text: "To get your starting kit and portal access, pay the $25 training fee via CashApp. ", 
        isClue: true,
        explanation: "Legitimate employers will never ask you to pay a fee to start working.",
        tactic: "Advance Fee Fraud"
      },
      { 
        id: "4-4", 
        text: "Apply now at http://bit.ly/yt-jobs-2024", 
        isClue: true,
        explanation: "Real companies use official domains for job applications, not URL shorteners.",
        tactic: "Unofficial Domain"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Labor Dept Advisory:</strong> "Beware of online job offers asking for training fees or equipment fees. This is a common scam."</p>
        <p className="text-[#0F172A]"><strong>Scam Alert:</strong> Shortened links in job offers are highly suspicious and often lead to phishing sites.</p>
      </div>
    )
  },
  {
    id: 5,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Bank Alert",
    postAuthor: "Security Alerts",
    postHandle: "@GlobalBank_Security",
    postTime: "Just now",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Impersonation", "Artificial Urgency", "Phishing Link", "Vague Attribution"],
    segments: [
      { id: "5-1", text: "SECURITY ALERT for all Global Bank Account Holders. " },
      { 
        id: "5-2", 
        text: "Your account has been temporarily locked due to suspicious login attempts from overseas. ", 
        isDecoy: true,
        explanation: "Banks do lock accounts for suspicious activity, but the method of notification here is fake."
      },
      { 
        id: "5-3", 
        text: "You must verify your identity within 24 hours or your account will be permanently closed. ", 
        isClue: true,
        explanation: "Banks do not threaten permanent closure within 24 hours via a social media post or SMS.",
        tactic: "Artificial Urgency"
      },
      { 
        id: "5-4", 
        text: "Click here to unlock your account: www.globalbank-security-unlock.com", 
        isClue: true,
        explanation: "This is a fake domain. Official Global Bank alerts direct you to the official app or globalbank.com.",
        tactic: "Phishing Link"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official Bank Advisory:</strong> "We will never ask you to click a link to unlock your account or verify your identity."</p>
        <p className="text-[#0F172A]"><strong>Domain Check:</strong> 'globalbank-security-unlock.com' was registered 2 days ago.</p>
      </div>
    )
  },
  {
    id: 6,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Giveaway",
    postAuthor: "MrBeast Giveaways",
    postHandle: "@MrBeast_Global_Giveaways",
    postTime: "5 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Advance Fee Fraud", "Impersonation", "Phishing Link", "Artificial Urgency"],
    segments: [
      { id: "6-1", text: "I am giving away $10,000 to the first 500 people who share this post! " },
      { 
        id: "6-2", 
        text: "Congratulations to our previous winners who already received their cash! ", 
        isDecoy: true,
        explanation: "Scammers often use fake testimonials or fake previous winners to build trust."
      },
      { 
        id: "6-3", 
        text: "Message our admin 'Jimmy' directly to claim your prize. ", 
        isClue: true,
        explanation: "Real giveaways do not require you to message a random admin account.",
        tactic: "Impersonation"
      },
      { 
        id: "6-4", 
        text: "Winners must pay a small $30 transfer fee to receive the $10,000. ", 
        isClue: true,
        explanation: "A legitimate giveaway will never ask the winner to pay a fee to receive their prize.",
        tactic: "Advance Fee Fraud"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>MrBeast Official:</strong> "I do not have a separate regional giveaway page. My only official giveaways are on my main verified accounts."</p>
        <p className="text-[#0F172A]"><strong>Scam Alert:</strong> Requiring a 'transfer fee' or 'tax fee' is the defining characteristic of an advance-fee scam.</p>
      </div>
    )
  },
  {
    id: 7,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Investment Scam",
    postAuthor: "Crypto Wealth Coach",
    postHandle: "@CryptoCoach_Max",
    postTime: "1 day ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Unverified Claim", "Too Good to Be True", "Unregistered Product", "Artificial Urgency"],
    segments: [
      { 
        id: "7-1", 
        text: "Bitcoin is crashing, but my students are making millions in passive income! ", 
        isDecoy: true,
        explanation: "The market context might be true, but it's being used to sell a scam."
      },
      { 
        id: "7-2", 
        text: "Our new AI trading bot guarantees a 500% return on your investment in just 3 days. ", 
        isClue: true,
        explanation: "No legitimate investment can guarantee a 500% return in 3 days. This is mathematically impossible without massive risk.",
        tactic: "Too Good to Be True"
      },
      { 
        id: "7-3", 
        text: "Fully licensed and approved by the SEC and National Bank. ", 
        isClue: true,
        explanation: "Checking the SEC database reveals this entity is NOT registered or licensed to solicit investments.",
        tactic: "Unverified Claim"
      },
      { 
        id: "7-4", 
        text: "Only 5 slots left for the VIP tier! DM me 'INVEST' now." 
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>SEC Advisory:</strong> "The entity 'Crypto Wealth Coach' is NOT registered with the Commission and is NOT authorized to solicit investments from the public."</p>
        <p className="text-[#0F172A]"><strong>Financial Experts:</strong> Guaranteed high returns in a short period are the primary red flag of a Ponzi scheme.</p>
      </div>
    )
  },
  {
    id: 8,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Charity Appeal",
    postAuthor: "Help Baby Angel",
    postHandle: "@BabyAngelFund",
    postTime: "2 days ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Emotional Manipulation", "Vague Attribution", "Suspicious Storefront", "Unofficial Domain"],
    segments: [
      { id: "8-1", text: "Please help! Baby Angel needs an emergency liver transplant within 48 hours or she won't survive. " },
      { 
        id: "8-2", 
        text: "The hospital bill is already at $200,000 and the doctors are threatening to stop treatment. ", 
        isClue: true,
        explanation: "Hospitals in most regions cannot legally deny emergency life-saving treatment due to inability to pay (Emergency Medical Act).",
        tactic: "Emotional Manipulation"
      },
      { 
        id: "8-3", 
        text: "We are begging for your kind hearts. Please send any amount to this CashApp: $HelpBabyAngel (Name: J. Cruz). ", 
        isClue: true,
        explanation: "The name on the CashApp account does not match the parents' names and the photo is stolen from a 2018 news article in another country.",
        tactic: "Vague Attribution"
      },
      { 
        id: "8-4", 
        text: "God bless everyone who shares and donates! ",
        isDecoy: true,
        explanation: "Scammers use religious or moral appeals to lower people's critical thinking."
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Reverse Image Search:</strong> The photo of the baby was taken from a news article in Brazil from 2018.</p>
        <p className="text-[#0F172A]"><strong>Hospital Statement:</strong> "We do not have a patient named 'Baby Angel' currently admitted in our pediatric ICU."</p>
      </div>
    )
  },
  {
    id: 9,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Flight Promo",
    postAuthor: "Oceanic Airlines Promos",
    postHandle: "@Oceanic_SeatSale",
    postTime: "3 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Impersonation", "Artificial Urgency", "Phishing Link", "Unverified Claim"],
    segments: [
      { id: "9-1", text: "$1 FLIGHT ALERT! ✈️ " },
      { 
        id: "9-2", 
        text: "Celebrate our anniversary with $1 base fares to ANY domestic destination! ", 
        isDecoy: true,
        explanation: "Piso fares are real promotions, making this scam highly believable."
      },
      { 
        id: "9-3", 
        text: "This secret promo is only available through our partner travel agency link, not the main website. ", 
        isClue: true,
        explanation: "Airlines host their major sales directly on their official website or app to drive traffic, not exclusively through unknown partners.",
        tactic: "Impersonation"
      },
      { 
        id: "9-4", 
        text: "Book within the next 2 hours before seats run out! Click here: www.1dollar-oceanic-flights-2024.net", 
        isClue: true,
        explanation: "The link points to an unofficial domain designed to steal credit card details.",
        tactic: "Phishing Link"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official Airline Page:</strong> "All our official seat sales are announced and booked exclusively through oceanicairlines.com. Beware of fake pages."</p>
        <p className="text-[#0F172A]"><strong>Domain Check:</strong> The domain '1dollar-oceanic-flights-2024.net' is not owned by the airline.</p>
      </div>
    )
  }
];

export const TACTIC_DESCRIPTIONS: Record<string, string> = {
  "Vague Attribution": "Citing unnamed or generic sources (e.g. 'an official') to avoid verification.",
  "Artificial Urgency": "Creating fake time pressure (e.g. 'hurry', 'ends tonight') to rush decisions.",
  "Phishing Link": "Using deceptive URLs that look official but steal your information.",
  "Advance Fee Fraud": "Asking for an upfront payment or processing fee for a 'free' reward.",
  "Unofficial Domain": "Directing users to sketchy, non-official websites or personal messages.",
  "Fabricated Quote": "Inventing fake statements and attributing them to celebrities or authority figures.",
  "Unregistered Product": "Selling items claiming health benefits without FDA approval or registration.",
  "Suspicious Storefront": "Using unverified, temporary e-commerce sites to sell dubious products.",
  "Unverified Claim": "Making bold, official-sounding statements without any supporting evidence.",
  "Fabricated Memo": "Referencing fake official documents or memo numbers to appear legitimate.",
  "Impersonation": "Pretending to be a trusted entity like a bank, company, or government agency.",
  "Too Good to Be True": "Offering extravagant rewards for minimal effort.",
  "Emotional Manipulation": "Exploiting fear, pity, or tragedy to bypass critical thinking."
};

