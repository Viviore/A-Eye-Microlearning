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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 max-w-lg w-full bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] flex flex-col"
        >
          <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-2 flex gap-2">
            <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-[#FFB800]"></div>
            <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-[#0F172A]"></div>
            <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-white"></div>
          </div>
          <div className="p-12">
            <div className="flex justify-center mb-8 relative">
              <ShieldCheck className="w-16 h-16 text-[#0F172A] stroke-[2] relative z-10" />
            </div>
            <h2 className="text-4xl font-bold mb-3 font-heading tracking-wide text-[#0F172A] uppercase">
              Assessment Logged!
            </h2>
            <p className="font-sans text-lg mb-12 text-[#0F172A] font-bold">
              Calibrating your profile... Access Granted.
            </p>
            <div className="w-full h-6 bg-white border-[3px] border-[#0F172A] overflow-hidden relative shadow-[4px_4px_0px_0px_#0F172A]">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#FFB800] border-r-[3px] border-[#0F172A]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
              />
            </div>
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
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] text-[#0F172A] font-heading font-bold uppercase">
            <NotebookPen className="w-4 h-4 text-[#0F172A]" />
            <span>SYS.TEST // BSLN</span>
          </div>
          <div className="text-[#0F172A] font-heading font-black text-2xl bg-white border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] px-3 py-1">
            0{currentStep + 1} / 0{quizQuestions.length}
          </div>
        </div>

        <div className="w-full h-4 bg-white border-[3px] border-[#0F172A] mb-12 relative overflow-hidden shadow-[6px_6px_0px_0px_#0F172A]">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#FFB800] border-r-[3px] border-[#0F172A]"
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
            className="bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative flex flex-col"
          >
            <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-2 flex justify-between items-center px-4">
               <span className="font-sans font-bold uppercase text-sm">QUESTION PROMPT</span>
               <div className="flex gap-2">
                 <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-white cursor-pointer hover:bg-black transition-colors"></div>
               </div>
            </div>
            
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black mb-10 leading-tight font-heading text-[#0F172A]">
                {question.question}
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-10">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full cursor-pointer text-left p-4 flex items-center gap-4 transition-all duration-100 border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none ${
                        isSelected
                          ? "bg-[#FFB800] translate-x-[3px] translate-y-[3px] shadow-[3px_3px_0px_0px_#0F172A]"
                          : "bg-white"
                      }`}
                    >
                      <div className={`w-8 h-8 border-[3px] border-[#0F172A] flex items-center justify-center font-heading text-[#0F172A] font-bold shrink-0 ${isSelected ? 'bg-white' : 'bg-white'}`}>
                        {isSelected ? <span className="text-[#0F172A]">X</span> : index + 1}
                      </div>
                      <span className="text-lg md:text-xl font-bold leading-snug font-sans text-[#0F172A]">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-4 border-t-[4px] border-dashed border-[#0F172A] pt-8">
                <Button 
                  onClick={handleNext} 
                  disabled={selectedAnswer === null}
                  className="btn-primary text-xl px-10 h-16"
                >
                  {currentStep === quizQuestions.length - 1 ? "Submit" : "Next File"}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
