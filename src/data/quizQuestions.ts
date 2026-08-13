// ─── Assessment Question Types ───────────────────────────────────────
export type SkillQuestion = {
  id: "q1" | "q2" | "q3" | "q4" | "q5";
  type: "text" | "image";
  questionType: "skill";
  postAuthorName: string;
  postHandle: string;
  postTime: string;
  content: string;
  imageSrc?: string;
  /** The correct classification for this post */
  expected: "real" | "fake";
};

export type ScaleQuestion = {
  id: "q6" | "q7";
  type: "scale";
  questionType: "scale";
  question: string;
  lowLabel: string;
  highLabel: string;
};

export type AssessmentQuestion = SkillQuestion | ScaleQuestion;

// ─── Assessment Questions (Exact content per specification) ──────────
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Q1 — Text Post (FAKE)
  {
    id: "q1",
    type: "text",
    questionType: "skill",
    postAuthorName: "CyberSec Alert",
    postHandle: "@CyberSec_Alerts",
    postTime: "10 mins ago",
    content: "Sure, here is an engaging and urgent social media post about a data breach: URGENT! Major Telecom provider just suffered a massive data breach! Over 5 million customer records have been leaked online. Check if your number was compromised by entering it at: telecom-breach-check.xyz",
    expected: "fake",
  },

  // Q2 — Photo (FAKE)
  {
    id: "q2",
    type: "image",
    questionType: "skill",
    postAuthorName: "Home Reno DIY",
    postHandle: "@DIY_RenoQueen",
    postTime: "2 hrs ago",
    content: "Just finished renovating the kitchen! I'm completely in love with the new modern setup. 🍳🏡 #HomeDesign",
    imageSrc: "/photos/quiz/kitchen_fake.png",
    expected: "fake",
  },

  // Q3 — Text Post (FAKE)
  {
    id: "q3",
    type: "text",
    questionType: "skill",
    postAuthorName: "Fäceb00k Security Team",
    postHandle: "@FB_Security_Official",
    postTime: "1 hr ago",
    content: "⚠️ 🔴 URGENT SECURITY NOTICE 🔴 ⚠️ — Your account has been flagged for violating our community standards! 😱 — To prevent PERMANENT DEACTIVATION in the next 24 hours ⏰ — Please verify your identity by sending a small security deposit of $10 to the link below 💸 — We will refund it immediately! 💯 👉 www.fb-account-recovery-urgent.xyz 👈 — DO NOT IGNORE THIS MESSAGE! 🛑",
    expected: "fake",
  },

  // Q4 — Photo (REAL)
  {
    id: "q4",
    type: "image",
    questionType: "skill",
    postAuthorName: "City News Network",
    postHandle: "@CityNews_Live",
    postTime: "3 hrs ago",
    content: "Massive protests downtown today! This crowd is unbelievable. They are demanding immediate action on the new policy. #BreakingNews",
    imageSrc: "/photos/quiz/protest_real.png",
    expected: "real",
  },

  // Q5 — Text Post (REAL)
  {
    id: "q5",
    type: "text",
    questionType: "skill",
    postAuthorName: "Science Facts Daily",
    postHandle: "@ScienceFacts",
    postTime: "5 hrs ago",
    content: "The Sun is a star at the center of our solar system. It is composed primarily of hydrogen and helium, and its gravity holds the entire solar system together.",
    expected: "real",
  },

  // Q6 — Awareness Scale
  {
    id: "q6",
    type: "scale",
    questionType: "scale",
    question: "How aware are you of AI-generated misinformation?",
    lowLabel: "Not aware at all",
    highLabel: "Very aware",
  },

  // Q7 — Confidence Scale
  {
    id: "q7",
    type: "scale",
    questionType: "scale",
    question:
      "How confident are you in telling real content from AI-generated fakes?",
    lowLabel: "Not confident at all",
    highLabel: "Very confident",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────
export const SKILL_QUESTIONS = ASSESSMENT_QUESTIONS.filter(
  (q): q is SkillQuestion => q.questionType === "skill"
);

export const SCALE_QUESTIONS = ASSESSMENT_QUESTIONS.filter(
  (q): q is ScaleQuestion => q.questionType === "scale"
);

export const TOTAL_SKILL_QUESTIONS = SKILL_QUESTIONS.length; // 5
