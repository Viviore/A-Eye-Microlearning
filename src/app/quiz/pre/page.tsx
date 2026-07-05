"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowRight, ShieldAlert } from "lucide-react";

const quizQuestions = [
  {
    question: "When evaluating an image online, what is the most reliable first step?",
    options: [
      "Trusting it if it has a lot of likes and shares",
      "Checking the comments to see if others think it's real",
      "Looking for a verified blue checkmark on the poster's account",
      "Looking for visual inconsistencies and verifying the source context",
    ],
    correctAnswer: 3,
  },
  {
    question: "Which of the following is a common artifact found in AI-generated images?",
    options: [
      "The image is perfectly symmetrical in every way",
      "Inconsistent lighting and impossible geometry",
      "The image file size is always larger than a normal photo",
      "There are hidden watermarks visible only when zoomed in",
    ],
    correctAnswer: 1,
  },
  {
    question: "If an image confirms your existing beliefs and makes you very angry, you should...",
    options: [
      "Share it immediately to spread awareness",
      "Assume it is true because it makes sense",
      "Pause and verify it",
      "Only share it with close friends",
    ],
    correctAnswer: 2,
  },
];

export default function PreAssessmentQuiz() {
  const router = useRouter();
  const setPreQuizScore = useGameStore((state) => state.setPreQuizScore);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleting(true);
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      const percentage = Math.round((score / quizQuestions.length) * 100);
      setPreQuizScore(percentage);

      setTimeout(() => {
        router.push("/level/1");
      }, 2000);
    }
  };

  if (isCompleting) {
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 p-12 max-w-lg w-full"
        >
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <ShieldAlert className="w-16 h-16 text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-heading tracking-widest text-emerald-400 uppercase">
            Assessment Logged
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-12">
            Calibrating profile [Access Granted]
          </p>
          <div className="w-full h-1 bg-zinc-900 overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </main>
    );
  }

  const question = quizQuestions[currentStep];

  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="z-10 w-full max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>Sys.Test // Baseline</span>
          </div>
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            0{currentStep + 1} / 0{quizQuestions.length}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-900 mb-12 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-emerald-500"
            initial={{ width: `${(currentStep / quizQuestions.length) * 100}%` }}
            animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight font-heading tracking-wide">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-12">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full text-left p-6 flex items-start gap-4 transition-all duration-200 border ${
                      isSelected
                        ? "bg-emerald-950/20 border-emerald-500/50"
                        : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-mono text-xs text-zinc-500 pt-1">
                      0{index + 1}
                    </div>
                    <span className={`text-base md:text-lg leading-snug ${isSelected ? "text-emerald-50" : "text-zinc-300"}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-start">
              <Button 
                onClick={handleNext} 
                disabled={selectedAnswer === null}
                className="h-14 px-8 text-base font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none group"
              >
                {currentStep === quizQuestions.length - 1 ? "Submit" : "Next File"}
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
