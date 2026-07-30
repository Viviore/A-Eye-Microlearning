"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { NotebookPen, ArrowRight, ShieldCheck } from "lucide-react";

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
      <main className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 p-12 max-w-lg w-full glass-panel bg-[#FFB800]"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-sm z-20" />
          
          <div className="flex justify-center mb-8 relative">
            <ShieldCheck className="w-16 h-16 text-[#0F172A] stroke-[2] relative z-10" />
          </div>
          <h2 className="text-4xl font-bold mb-3 font-heading tracking-wide text-[#0F172A]">
            Assessment Logged!
          </h2>
          <p className="text-muted-foreground font-sans text-lg mb-12">
            Calibrating your profile... Access Granted.
          </p>
          <div className="w-full h-4 bg-white border-2 border-[#0F172A] overflow-hidden" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            <motion.div 
              className="h-full bg-[#FFB800]"
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
    <main className="min-h-[100dvh] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="z-10 w-full max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] text-[#0F172A] font-heading font-bold rotate-1" style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}>
            <NotebookPen className="w-4 h-4 text-[#FFB800]" />
            <span>Sys.Test // Baseline</span>
          </div>
          <div className="text-[#0F172A] font-heading font-bold text-xl -rotate-2">
            0{currentStep + 1} / 0{quizQuestions.length}
          </div>
        </div>

        <div className="w-full h-3 bg-white border-[2px] border-[#0F172A] mb-12 relative overflow-hidden shadow-[2px_2px_0px_0px_#0F172A]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#FFB800] border-r-[2px] border-[#0F172A]"
            initial={{ width: `${(currentStep / quizQuestions.length) * 100}%` }}
            animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: -10, rotate: -2 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel p-8 md:p-12 relative"
          >
            {/* Thumbtack */}
            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-10">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight font-heading text-[#0F172A]">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full cursor-pointer text-left p-4 flex items-center gap-4 transition-all duration-200 border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] ${
                      isSelected
                        ? "bg-[#FFB800] scale-[1.02] shadow-[4px_4px_0px_0px_#0F172A]"
                        : "bg-white hover:bg-[#FAFAFA] hover:translate-x-1"
                    }`}
                    style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[#0F172A] flex items-center justify-center font-heading text-[#0F172A] shrink-0 bg-white">
                      {isSelected ? <span className="text-[#FFB800] font-bold text-xl">✓</span> : index + 1}
                    </div>
                    <span className="text-lg md:text-xl leading-snug font-sans text-[#0F172A]">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end mt-4 border-t-2 border-dashed border-[#1D2A3C] pt-6">
              <Button 
                onClick={handleNext} 
                disabled={selectedAnswer === null}
                className="btn-primary text-xl px-10 h-14"
              >
                {currentStep === quizQuestions.length - 1 ? "Submit" : "Next File"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
