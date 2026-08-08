"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import Link from "next/link";
import { NotebookPen, TrendingUp, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

const POST_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is a common telltale sign of generative AI in background architecture?",
    options: [
      "Consistent vanishing points",
      "Symmetrical windows",
      "Non-Euclidean, warping structures",
      "High-contrast shadows"
    ],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "When examining a photorealistic face, what is the best area to check for rendering errors?",
    options: [
      "The color of the lips",
      "Light reflections (catchlights) in the eyes",
      "The shape of the jawline",
      "The brightness of the skin"
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Why do generative AI models often struggle to accurately render complex jewelry?",
    options: [
      "They fail to understand object permanence, causing items to merge into the skin",
      "They cannot generate metallic textures",
      "Jewelry is always copyrighted",
      "They intentionally blur jewelry to save processing power"
    ],
    correctAnswer: 0,
  }
];

export default function PostAssessmentQuizPage() {
  const { preQuizScore, setPostQuizScore, resetGame } = useGameStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < POST_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const correctAnswers = newAnswers.reduce((acc, curr, index) => {
        return curr === POST_QUIZ_QUESTIONS[index].correctAnswer ? acc + 1 : acc;
      }, 0);
      
      const percentageScore = Math.round((correctAnswers / POST_QUIZ_QUESTIONS.length) * 100);
      setFinalScore(percentageScore);
      setPostQuizScore(percentageScore);
      setIsFinished(true);

      // Trigger celebration if they improved
      const safePreScore = preQuizScore ?? 0;
      if (percentageScore > safePreScore) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB800', '#0F172A', '#FAFAFA']
        });
      }
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const safePreScore = preQuizScore ?? 0;
  const improvementDelta = finalScore - safePreScore;
  const didImprove = improvementDelta > 0;

  if (isFinished) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="z-10 w-full max-w-2xl bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] p-8 md:p-12 text-center relative"
          style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
        >
          {/* Decorative tape */}

          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#FFB800] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A] -rotate-6" style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}>
              <Award className="w-10 h-10 text-[#FFB800]" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black font-heading tracking-wide mb-2 text-[#0F172A]">
            Mission Complete!
          </h1>
          <p className="text-[#0F172A] font-heading text-xl font-bold mb-10">
            A-Eye Media Literacy Certificate
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-[#FAFAFA] border-[3px] border-dashed border-[#0F172A] rotate-1" style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}>
              <div className="text-lg text-muted-foreground font-sans font-bold mb-2">Pre-Mission</div>
              <div className="text-5xl font-black font-heading text-[#0F172A] opacity-50 line-through">{preQuizScore}%</div>
            </div>
            <div className="p-6 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] -rotate-1" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              <div className="text-lg text-[#0F172A] font-sans font-bold mb-2">Final Score</div>
              <div className="text-5xl font-black font-heading text-white">{finalScore}%</div>
            </div>
          </div>

          <div className={`p-8 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-sm mb-10 ${didImprove ? 'bg-[#1D2A3C]' : 'bg-white'} rotate-1`} style={{ borderRadius: "15px 255px 15px 225px / 255px 15px 225px 15px" }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {didImprove && <TrendingUp className="w-8 h-8 text-[#FFB800]" />}
              <div className={`text-6xl font-black font-heading ${didImprove ? 'text-[#FFB800]' : 'text-[#0F172A]'}`}>
                {improvementDelta > 0 ? `+${improvementDelta}` : improvementDelta}%
              </div>
            </div>
            <div className={`text-xl font-sans font-bold ${didImprove ? 'text-[#F8FAFC]' : 'text-[#0F172A]'}`}>
              Media Literacy Improvement
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/" passHref>
              <BrutalButton 
                onClick={handlePlayAgain}
                variant="primary"
                size="lg"
                className="px-10 h-14"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Start New Simulation
              </BrutalButton>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="z-10 w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center text-lg font-heading font-bold text-[#0F172A]">
          <span className="flex items-center gap-2 px-3 py-1 bg-white border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] -rotate-1" style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}>
            <NotebookPen className="w-5 h-5 text-[#FFB800]" /> Post-Mission
          </span>
          <span className="text-[#0F172A] rotate-2">Question {currentQuestion + 1} / {POST_QUIZ_QUESTIONS.length}</span>
        </div>

        <div className="w-full h-3 bg-white border-[2px] border-[#0F172A] mb-12 shadow-[2px_2px_0px_0px_#0F172A]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
          <motion.div 
            className="h-full bg-[#FFB800] border-r-[2px] border-[#0F172A]"
            initial={{ width: `${(currentQuestion / POST_QUIZ_QUESTIONS.length) * 100}%` }}
            animate={{ width: `${((currentQuestion + 1) / POST_QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: -1 }}
            exit={{ opacity: 0, x: -20, rotate: -3 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 md:p-12 relative"
          >
            {/* Tape */}


            <h2 className="text-3xl md:text-4xl font-bold font-heading leading-tight mb-10 text-[#0F172A]">
              {POST_QUIZ_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {POST_QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full cursor-pointer text-left p-4 bg-white border-[3px] border-[#0F172A] hover:bg-[#FFB800] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#0F172A] shadow-[2px_2px_0px_0px_#0F172A] transition-all duration-200 text-lg md:text-xl font-sans text-[#0F172A]"
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#0F172A] flex items-center justify-center font-heading shrink-0 bg-white group-hover:text-[#FFB800]">
                      {index + 1}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
