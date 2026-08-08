"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ShieldCheck } from "lucide-react";
import { QUIZ_ASSETS } from "@/data/quizQuestions";

export default function PostAssessmentQuizPage() {
  const router = useRouter();
  const { setPostQuizScore, setPostQuizAwareness, setPostQuizConfidence } = useGameStore();

  const [phase, setPhase] = useState<"intro" | "partA" | "partB" | "complete">("intro");
  
  // Part A state
  const [currentStepA, setCurrentStepA] = useState(0);
  const [scoreA, setScoreA] = useState(0);

  // Part B state
  const [awareness, setAwareness] = useState<number | null>(null);
  const [currentStepB, setCurrentStepB] = useState(0);

  const handleAnswerA = (isFakeSelected: boolean) => {
    const isCorrect = isFakeSelected === QUIZ_ASSETS[currentStepA].isFake;
    if (isCorrect) {
      setScoreA(prev => prev + 1);
    }
    
    if (currentStepA < QUIZ_ASSETS.length - 1) {
      setCurrentStepA(prev => prev + 1);
    } else {
      setPhase("partB");
    }
  };

  const handleAnswerB = (rating: number) => {
    if (currentStepB === 0) {
      setAwareness(rating);
      setCurrentStepB(1);
    } else {
      setPostQuizScore(scoreA); 
      setPostQuizAwareness(awareness!);
      setPostQuizConfidence(rating);
      
      setPhase("complete");
      setTimeout(() => {
        router.push("/results");
      }, 2500);
    }
  };

  const renderPartA = () => {
    const asset = QUIZ_ASSETS[currentStepA];
    
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full pt-12 pb-24 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-[#0F172A]">
            Field Test: Real or Fake?
          </h2>
          <span className="font-mono font-bold bg-black text-white px-3 py-1">
            {currentStepA + 1} / {QUIZ_ASSETS.length}
          </span>
        </div>
        
        {/* Post Mockup */}
        <div className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] mb-8 overflow-hidden">
          <div className="border-b-[4px] border-[#0F172A] p-3 bg-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 border-[2px] border-[#0F172A]"></div>
            <div>
              <div className="font-bold font-sans leading-none text-[#0F172A]">{asset.postAuthorName}</div>
              <div className="text-sm font-mono opacity-60 mt-1 text-[#0F172A]">{asset.postHandle} • {asset.postTime}</div>
            </div>
          </div>
          {asset.type === "image" && asset.imageSrc && (
            <div className="border-b-[4px] border-[#0F172A] w-full bg-gray-50 flex justify-center p-4">
              <img src={asset.imageSrc} alt="Post asset" className="max-h-[400px] object-contain border-[2px] border-black" />
            </div>
          )}
          <div className="p-6">
            <p className="font-sans text-lg text-[#0F172A] font-medium">{asset.content}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-auto">
          <button
            onClick={() => handleAnswerA(false)}
            className="border-[4px] border-[#0F172A] bg-white text-[#0F172A] py-6 text-xl font-bold uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-colors shadow-[6px_6px_0px_0px_#0F172A] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#0F172A]"
          >
            Real
          </button>
          <button
            onClick={() => handleAnswerA(true)}
            className="border-[4px] border-[#0F172A] bg-white text-[#0F172A] py-6 text-xl font-bold uppercase tracking-widest hover:bg-[#FFB800] transition-colors shadow-[6px_6px_0px_0px_#0F172A] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#0F172A]"
          >
            Fake
          </button>
        </div>
      </div>
    );
  };

  const renderPartB = () => {
    const question = currentStepB === 0 
      ? "How aware are you NOW of AI-generated misinformation?"
      : "How confident are you NOW in spotting fake content online?";
      
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto w-full pt-32 px-4 items-center text-center">
        <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-widest text-[#0F172A] mb-16">
          {question}
        </h2>
        
        <div className="grid grid-cols-5 gap-3 md:gap-6 w-full">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleAnswerB(rating)}
              className="aspect-square border-[4px] border-[#0F172A] bg-white text-[#0F172A] flex items-center justify-center text-4xl font-black hover:bg-[#FFB800] transition-colors shadow-[6px_6px_0px_0px_#0F172A] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#0F172A]"
            >
              {rating}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between w-full mt-6 font-mono font-bold text-[#0F172A]/70 uppercase text-sm md:text-base">
          <span>Not at all</span>
          <span>Very much</span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA] font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl px-4"
          >
            <h1 className="text-5xl md:text-6xl font-black font-heading tracking-widest uppercase text-[#0F172A] drop-shadow-[4px_4px_0_rgba(255,184,0,1)] mb-6">
              Field Test
            </h1>
            <p className="text-xl font-bold font-sans text-[#0F172A] mb-12">
              Let's see how much you've learned. We'll run you through the same check.
            </p>
            <BrutalButton variant="primary" size="lg" onClick={() => setPhase("partA")}>
              START FIELD TEST
            </BrutalButton>
          </motion.div>
        )}

        {phase === "partA" && (
          <motion.div
            key={`partA-${currentStepA}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full flex-1 flex flex-col"
          >
            {renderPartA()}
          </motion.div>
        )}

        {phase === "partB" && (
          <motion.div
            key={`partB-${currentStepB}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex-1 flex flex-col"
          >
            {renderPartB()}
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center relative w-full px-4"
          >
            <div className="text-center z-10 max-w-lg w-full bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] flex flex-col">
              <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-2 flex gap-2">
                <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-[#FFB800]"></div>
                <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-[#0F172A]"></div>
                <div className="w-4 h-4 border-[3px] border-[#0F172A] bg-white"></div>
              </div>
              <div className="p-12">
                <div className="flex justify-center mb-8">
                  <ShieldCheck className="w-16 h-16 text-[#0F172A] stroke-[2]" />
                </div>
                <h2 className="text-4xl font-bold mb-3 font-heading tracking-wide text-[#0F172A] uppercase">
                  Analysis Complete!
                </h2>
                <p className="font-sans text-lg mb-12 text-[#0F172A] font-bold">
                  Generating final report...
                </p>
                <div className="w-full h-6 bg-white border-[3px] border-[#0F172A] overflow-hidden relative shadow-[4px_4px_0px_0px_#0F172A]">
                  <motion.div
                    className="h-full bg-[#FFB800] border-r-[3px] border-[#0F172A]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
