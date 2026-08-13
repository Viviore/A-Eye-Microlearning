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
  // Q1 — Text Post (REAL)
  {
    id: "q1",
    type: "text",
    questionType: "skill",
    postAuthorName: "Fact Checker",
    postHandle: "@DailyFacts",
    postTime: "10 mins ago",
    content: "A healthy, normal adult chicken has 2 legs.",
    expected: "real",
  },

  // Q2 — Text Post (REAL)
  {
    id: "q2",
    type: "text",
    questionType: "skill",
    postAuthorName: "City Info",
    postHandle: "@CityInfo",
    postTime: "3 hrs ago",
    content: "Standard traffic lights have 3 colors: Red, Yellow, and Green.",
    expected: "real",
  },

  // Q3 — Text Post (FAKE)
  {
    id: "q3",
    type: "text",
    questionType: "skill",
    postAuthorName: "Trivia Master",
    postHandle: "@TriviaM",
    postTime: "1 hr ago",
    content: "Did you know? Spiders belong to the insect family and only have 6 legs.",
    expected: "fake",
  },

  // Q4 — Text Post (REAL)
  {
    id: "q4",
    type: "text",
    questionType: "skill",
    postAuthorName: "Science Daily",
    postHandle: "@ScienceDaily",
    postTime: "5 hrs ago",
    content: "A single water molecule is composed of two hydrogen atoms and one oxygen atom.",
    expected: "real",
  },

  // Q5 — Text Post (FAKE)
  {
    id: "q5",
    type: "text",
    questionType: "skill",
    postAuthorName: "Space Bot",
    postHandle: "@SpaceBot",
    postTime: "45 mins ago",
    content: "NASA confirmed yesterday that the Earth is actually shaped like a perfect cube.",
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
