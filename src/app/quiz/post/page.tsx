"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, TrendingUp, RotateCcw } from "lucide-react";
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
      if (percentageScore > preQuizScore) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f4f4f5']
        });
      }
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const improvementDelta = finalScore - preQuizScore;
  const didImprove = improvementDelta > 0;

  if (isFinished) {
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 md:p-12 shadow-2xl text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black font-heading tracking-widest uppercase mb-2 text-zinc-100">
            Mission Complete
          </h1>
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-10">
            A-Eye Media Literacy Certificate
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Pre-Mission Assessment</div>
              <div className="text-3xl font-black font-heading text-zinc-400">{preQuizScore}%</div>
            </div>
            <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Post-Mission Assessment</div>
              <div className="text-3xl font-black font-heading text-zinc-100">{finalScore}%</div>
            </div>
          </div>

          <div className={`p-8 border rounded-sm mb-10 ${didImprove ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {didImprove && <TrendingUp className="w-8 h-8 text-emerald-500" />}
              <div className={`text-6xl font-black font-heading ${didImprove ? 'text-emerald-400' : 'text-zinc-100'}`}>
                {improvementDelta > 0 ? `+${improvementDelta}` : improvementDelta}%
              </div>
            </div>
            <div className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
              Media Literacy Improvement Index
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/" passHref>
              <Button 
                onClick={handlePlayAgain}
                className="h-12 px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-heading uppercase tracking-widest rounded-none border border-zinc-700 transition-all duration-150 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Start New Simulation
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="z-10 w-full max-w-xl">
        <div className="mb-8 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zinc-500">
          <span>Post-Mission Assessment</span>
          <span className="text-emerald-400">Question {currentQuestion + 1} / {POST_QUIZ_QUESTIONS.length}</span>
        </div>

        <div className="w-full h-1 bg-zinc-900 mb-12">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: `${(currentQuestion / POST_QUIZ_QUESTIONS.length) * 100}%` }}
            animate={{ width: `${((currentQuestion + 1) / POST_QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold font-heading leading-snug mb-8">
              {POST_QUIZ_QUESTIONS[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {POST_QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-6 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500 hover:bg-emerald-950/20 rounded-sm transition-all duration-200 text-zinc-300 hover:text-emerald-400 font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
