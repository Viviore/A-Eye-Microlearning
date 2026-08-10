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
    postAuthorName: "Health Alert PH",
    postHandle: "@HealthAlertPH",
    postTime: "10 mins ago",
    content:
      "URGENT: Local hospital giving out free medical checkups today only! No appointment needed, just bring ₱200 registration fee in cash. Limited slots, first come first served!",
    expected: "fake",
  },

  // Q2 — Photo (REAL)
  {
    id: "q2",
    type: "image",
    questionType: "skill",
    postAuthorName: "Coastal Cleanup Crew",
    postHandle: "@CoastalCleanupCrew",
    postTime: "3 hrs ago",
    content:
      "Community cleanup drive this weekend, thank you to everyone who joined! 🧹🌊",
    imageSrc: "/photos/quiz/assessment_q2.png",
    expected: "real",
  },

  // Q3 — Photo (FAKE)
  {
    id: "q3",
    type: "image",
    questionType: "skill",
    postAuthorName: "UrbanArt Daily",
    postHandle: "@UrbanArtDaily",
    postTime: "1 hr ago",
    content:
      "Can't believe how realistic this new statue installation looks downtown! 😳",
    imageSrc: "/photos/quiz/assessment_q3.png",
    expected: "fake",
  },

  // Q4 — Text Post (REAL)
  {
    id: "q4",
    type: "text",
    questionType: "skill",
    postAuthorName: "Barangay Hall Official",
    postHandle: "@BrgyHallOfficial",
    postTime: "5 hrs ago",
    content:
      "Reminder: barangay hall will be closed this Friday for a scheduled holiday. Regular hours resume Monday. Thank you for your understanding.",
    expected: "real",
  },

  // Q5 — Photo (FAKE)
  {
    id: "q5",
    type: "image",
    questionType: "skill",
    postAuthorName: "Office Vibes",
    postHandle: "@OfficeVibes",
    postTime: "45 mins ago",
    content: "Grabbed this candid shot of my coworkers during lunch today 😄",
    imageSrc: "/photos/quiz/assessment_q5.png",
    expected: "fake",
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
