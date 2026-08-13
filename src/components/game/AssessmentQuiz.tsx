"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ClipboardCheck,
  Shield,
  User,
  Clock,
} from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  ASSESSMENT_QUESTIONS,
  type AssessmentQuestion,
  type SkillQuestion,
  type ScaleQuestion,
} from "@/data/quizQuestions";
import { type AssessmentAnswers, type SkillAnswer } from "@/store/gameStore";

// ─── Types ───────────────────────────────────────────────────────────
type QuizMode = "pre" | "post";

interface AssessmentQuizProps {
  mode: QuizMode;
  onComplete: (answers: AssessmentAnswers) => void;
}

type QuizPhase = "intro" | "quiz" | "complete";

// ─── Intro / Completion Copy ─────────────────────────────────────────
const INTRO_COPY = {
  pre: {
    badge: "BASELINE ASSESSMENT",
    title: "Before You Begin",
    body: "Let\u2019s see how you currently evaluate information online. This short assessment helps us understand your starting point. Your score does not affect your game score.",
    cta: "Start Assessment",
  },
  post: {
    badge: "FINAL ASSESSMENT",
    title: "Investigation Complete",
    body: "You\u2019ve completed the A-Eye investigations. Now let\u2019s see what changed. This assessment uses the same questions from the beginning so we can compare your responses before and after the experience.",
    cta: "Start Post-Assessment",
  },
} as const;

const COMPLETE_COPY = {
  pre: {
    title: "Assessment Complete",
    body: "Your baseline has been recorded. Now it\u2019s time to investigate.",
    cta: "Start Case 001",
  },
  post: {
    title: "Assessment Complete",
    body: "Your responses have been recorded. Let\u2019s see how you\u2019ve grown.",
    cta: "View Your Growth",
  },
} as const;

// ─── Animation Variants ──────────────────────────────────────────────
const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

// ─── Social Post Card (for Q1-Q5) ────────────────────────────────────
function SocialPostCard({ question }: { question: SkillQuestion }) {
  return (
    <div className="bg-white border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] w-full">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4 border-b-[3px] border-[#0F172A] bg-[#FAFAFA]">
        <div className="w-10 h-10 bg-[#FFB800] border-[3px] border-[#0F172A] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-heading font-bold text-sm text-[#0F172A] truncate">
            {question.postAuthorName}
          </div>
          <div className="font-mono text-xs text-[#0F172A]/60">
            {question.postHandle}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#0F172A]/50 shrink-0">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-xs">{question.postTime}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 md:p-5">
        <p className="font-sans font-semibold text-[#0F172A] text-base md:text-lg leading-relaxed">
          {question.content}
        </p>
      </div>

      {/* Post Image */}
      {question.imageSrc && (
        <div className="border-t-[3px] border-[#0F172A] aspect-square w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={question.imageSrc}
            alt="Post attachment"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

// ─── Skill Answer Options (REAL / FAKE) ──────────────────────────────
function SkillAnswerOptions({
  selected,
  onSelect,
}: {
  selected: SkillAnswer | null;
  onSelect: (answer: SkillAnswer) => void;
}) {
  const options: { value: SkillAnswer; label: string }[] = [
    { value: "real", label: "REAL" },
    { value: "fake", label: "FAKE" },
  ];

  return (
    <fieldset className="space-y-3 mt-6">
      <legend className="sr-only">Is this post real or fake?</legend>
      <p className="font-heading font-bold text-sm uppercase tracking-widest text-[#0F172A]/70 mb-3">
        Is this post real or fake?
      </p>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-4 p-4 md:p-5 cursor-pointer border-[4px] border-[#0F172A] transition-all select-none ${
              isSelected
                ? "bg-[#FFB800] shadow-[4px_4px_0px_0px_#0F172A] -translate-y-[1px]"
                : "bg-white shadow-[4px_4px_0px_0px_#0F172A] hover:bg-[#FFF8E1] hover:-translate-y-[1px]"
            }`}
          >
            <input
              type="radio"
              name="skill-answer"
              value={opt.value}
              checked={isSelected}
              onChange={() => onSelect(opt.value)}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 border-[3px] border-[#0F172A] shrink-0 flex items-center justify-center ${
                isSelected ? "bg-[#0F172A]" : "bg-white"
              }`}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 bg-white" />
              )}
            </div>
            <span className="font-heading font-black text-lg md:text-xl uppercase tracking-wider text-[#0F172A]">
              {opt.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

// ─── Scale Answer Options (1-5) ──────────────────────────────────────
function ScaleAnswerOptions({
  question,
  selected,
  onSelect,
}: {
  question: ScaleQuestion;
  selected: number | null;
  onSelect: (value: number) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="sr-only">{question.question}</legend>
      <div className="bg-white border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] p-5 md:p-6">
        <p className="font-sans font-bold text-lg md:text-xl text-[#0F172A] leading-relaxed mb-6">
          {question.question}
        </p>

        {/* Scale Labels */}
        <div className="flex justify-between mb-3">
          <span className="font-mono text-xs font-bold text-[#0F172A]/60 uppercase">
            {question.lowLabel}
          </span>
          <span className="font-mono text-xs font-bold text-[#0F172A]/60 uppercase">
            {question.highLabel}
          </span>
        </div>

        {/* Scale Buttons */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                className={`aspect-square flex items-center justify-center border-[4px] border-[#0F172A] font-heading font-black text-xl md:text-2xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#FFB800] shadow-[3px_3px_0px_0px_#0F172A] text-[#0F172A] -translate-y-[2px]"
                    : "bg-white shadow-[3px_3px_0px_0px_#0F172A] text-[#0F172A] hover:bg-[#FFF8E1] hover:-translate-y-[1px]"
                }`}
                aria-pressed={isSelected}
                aria-label={`${value} out of 5`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────
function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono font-bold text-xs text-[#0F172A]/70 uppercase tracking-widest">
          Question {current} of {total}
        </span>
        <span className="font-mono font-bold text-xs text-[#0F172A]/70">
          {percent}%
        </span>
      </div>
      <div className="h-4 bg-gray-200 border-[3px] border-[#0F172A] relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[#FFB800]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export function AssessmentQuiz({ mode, onComplete }: AssessmentQuizProps) {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
  });
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex, phase]);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion: AssessmentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const introCopy = INTRO_COPY[mode];
  const completeCopy = COMPLETE_COPY[mode];

  // ─── Answer Getters ──────────────────────────────────────────────
  const getCurrentAnswer = useCallback(() => {
    const q = currentQuestion;
    if (q.questionType === "skill") {
      return answers[q.id] as SkillAnswer | null;
    }
    return answers[q.id] as number | null;
  }, [currentQuestion, answers]);

  const isAnswered = getCurrentAnswer() !== null;

  // ─── Answer Setters ──────────────────────────────────────────────
  const setSkillAnswer = (value: SkillAnswer) => {
    const q = currentQuestion as SkillQuestion;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const setScaleAnswer = (value: number) => {
    const q = currentQuestion as ScaleQuestion;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  // ─── Navigation ──────────────────────────────────────────────────
  const handleNext = () => {
    if (!isAnswered) return;

    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All questions answered — finalize
      setPhase("complete");
      onComplete(answers);
    }
  };

  // ─── INTRO PHASE ──────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main className="min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-80px)] w-full flex flex-col items-center justify-center bg-[#FAFAFA] text-[#0F172A] p-4 font-sans bg-cubes">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] p-8 md:p-12 text-center flex flex-col gap-6 relative"
        >
          {/* Badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] px-4 py-1.5 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#0F172A]" strokeWidth={2.5} />
              <span className="font-mono font-bold text-xs text-[#0F172A] uppercase tracking-widest whitespace-nowrap">
                {introCopy.badge}
              </span>
            </div>
          </div>

          {/* Icon */}
          <div className="mx-auto mt-4 w-16 h-16 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#0F172A]" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-widest text-[#0F172A]">
            {introCopy.title}
          </h1>

          <p className="font-sans font-bold text-base md:text-lg text-[#0F172A]/80 leading-relaxed max-w-md mx-auto">
            {introCopy.body}
          </p>

          {/* Question count */}
          <div className="flex items-center justify-center gap-3 bg-[#FAFAFA] border-[3px] border-[#0F172A] p-3">
            <span className="font-mono font-bold text-sm text-[#0F172A]/70 uppercase">
              5 Skill Questions + 2 Self-Assessment Questions
            </span>
          </div>

          <div className="mt-2">
            <BrutalButton
              onClick={() => setPhase("quiz")}
              size="lg"
              className="w-full sm:w-auto uppercase"
            >
              {introCopy.cta}
            </BrutalButton>
          </div>
        </motion.div>
      </main>
    );
  }

  // ─── COMPLETE PHASE ───────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <main className="min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-80px)] w-full flex flex-col items-center justify-center bg-[#FAFAFA] text-[#0F172A] p-4 font-sans bg-cubes">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] p-8 md:p-12 text-center flex flex-col gap-6 relative"
        >
          {/* Completion badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="bg-[#10B981] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] px-4 py-1.5 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
              <span className="font-mono font-bold text-xs text-white uppercase tracking-widest whitespace-nowrap">
                RECORDED
              </span>
            </div>
          </div>

          <div className="mx-auto mt-4 w-16 h-16 bg-[#10B981] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center">
            <ClipboardCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-widest text-[#0F172A]">
            {completeCopy.title}
          </h1>

          <p className="font-sans font-bold text-base md:text-lg text-[#0F172A]/80 leading-relaxed max-w-md mx-auto">
            {completeCopy.body}
          </p>
        </motion.div>
      </main>
    );
  }

  // ─── QUIZ PHASE ───────────────────────────────────────────────────
  return (
    <main className="min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-80px)] w-full flex flex-col bg-[#FAFAFA] text-[#0F172A] font-sans bg-cubes">
      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#FFB800] border-[3px] border-[#0F172A]">
                  <ClipboardCheck className="w-4 h-4 text-[#0F172A]" strokeWidth={2.5} />
                </div>
                <span className="font-heading font-black text-sm uppercase tracking-widest text-[#0F172A]">
                  {mode === "pre" ? "Pre-Assessment" : "Post-Assessment"}
                </span>
              </div>
            </div>
            <ProgressBar current={currentIndex + 1} total={totalQuestions} />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentQuestion.questionType === "skill" ? (
                <>
                  <SocialPostCard question={currentQuestion as SkillQuestion} />
                  <SkillAnswerOptions
                    selected={answers[(currentQuestion as SkillQuestion).id] as SkillAnswer | null}
                    onSelect={setSkillAnswer}
                  />
                </>
              ) : (
                <ScaleAnswerOptions
                  question={currentQuestion as ScaleQuestion}
                  selected={answers[(currentQuestion as ScaleQuestion).id] as number | null}
                  onSelect={setScaleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex justify-end"
          >
            <BrutalButton
              onClick={handleNext}
              disabled={!isAnswered}
              size="default"
              className="uppercase group"
            >
              {currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </BrutalButton>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
