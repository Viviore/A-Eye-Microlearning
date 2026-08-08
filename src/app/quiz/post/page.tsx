"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ShieldCheck, Check } from "lucide-react";
import { QUIZ_ASSETS } from "@/data/quizQuestions";

export default function PostAssessmentQuizPage() {
  const router = useRouter();
  const { setPostQuizScore, setPostQuizAwareness, setPostQuizConfidence } = useGameStore();

  const [phase, setPhase] = useState<"intro" | "partA" | "partB" | "complete">("intro");
  
  // Part A state
  const [currentStepA, setCurrentStepA] = useState(0);
  const [scoreA, setScoreA] = useState(0);
  const [selectedA, setSelectedA] = useState<boolean | null>(null);

  // Part B state
  const [awareness, setAwareness] = useState<number | null>(null);
  const [currentStepB, setCurrentStepB] = useState(0);
  const [selectedB, setSelectedB] = useState<number | null>(null);

  const handleAnswerA = (isFakeSelected: boolean) => {
    if (selectedA !== null) return;
    setSelectedA(isFakeSelected);
    
    setTimeout(() => {
      const isCorrect = isFakeSelected === QUIZ_ASSETS[currentStepA].isFake;
      if (isCorrect) {
        setScoreA(prev => prev + 1);
      }
      
      if (currentStepA < QUIZ_ASSETS.length - 1) {
        setCurrentStepA(prev => prev + 1);
        setSelectedA(null);
      } else {
        setPhase("partB");
      }
    }, 400);
  };

  const handleAnswerB = (rating: number) => {
    if (selectedB !== null) return;
    setSelectedB(rating);
    
    setTimeout(() => {
      if (currentStepB === 0) {
        setAwareness(rating);
        setCurrentStepB(1);
        setSelectedB(null);
      } else {
        setPostQuizScore(scoreA); 
        setPostQuizAwareness(awareness!);
        setPostQuizConfidence(rating);
        
        setPhase("complete");
        setTimeout(() => {
          router.push("/results");
        }, 2500);
      }
    }, 400);
  };

  const renderPartA = () => {
    const asset = QUIZ_ASSETS[currentStepA];
    
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto w-full pt-8 pb-16 px-4">
        <div className="mb-8 flex flex-col gap-4">
          <h2 className="font-heading font-black text-3xl uppercase tracking-widest text-[#0F172A] text-center">
            Field Test
          </h2>
          {/* Progress Bar */}
          <div className="flex gap-2 justify-center">
            {QUIZ_ASSETS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-3 w-12 border-[2px] border-[#0F172A] ${
                  idx < currentStepA ? "bg-[#0F172A]" : idx === currentStepA ? "bg-[#FFB800]" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Post Mockup */}
        <div className="relative w-full mb-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`post-${currentStepA}`}
              initial={{ filter: "blur(8px)", opacity: 0, scale: 0.95, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }}
              exit={{ filter: "blur(8px)", opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] rounded-xl overflow-hidden flex flex-col w-full"
            >
              <div className="border-b-[4px] border-[#0F172A] p-4 bg-gray-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 border-[2px] border-[#0F172A] flex-shrink-0"></div>
                <div>
                  <div className="font-bold font-sans leading-none text-[#0F172A] text-lg">{asset.postAuthorName}</div>
                  <div className="text-sm font-mono opacity-60 mt-1 text-[#0F172A]">{asset.postHandle} • {asset.postTime}</div>
                </div>
              </div>
              {asset.type === "image" && asset.imageSrc && (
                <div className="border-b-[4px] border-[#0F172A] w-full bg-black flex justify-center">
                  <img src={asset.imageSrc} alt="Post asset" className="w-full max-h-[400px] object-contain" />
                </div>
              )}
              <div className="p-6">
                <p className="font-sans text-xl text-[#0F172A] font-medium leading-relaxed">{asset.content}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-auto">
          <BrutalButton
            variant={selectedA === false ? "dark" : "secondary"}
            size="lg"
            onClick={() => handleAnswerA(false)}
            disabled={selectedA !== null}
            className={`py-8 text-3xl transition-all duration-200 ${
              selectedA === false 
                ? "opacity-100 border-solid shadow-none translate-x-[6px] translate-y-[6px]" 
                : ""
            }`}
          >
            {selectedA === false ? <span className="flex items-center justify-center gap-2"><Check className="w-8 h-8"/> Real</span> : "Real"}
          </BrutalButton>
          <BrutalButton
            variant={selectedA === true ? "primary" : "secondary"}
            size="lg"
            onClick={() => handleAnswerA(true)}
            disabled={selectedA !== null}
            className={`py-8 text-3xl transition-all duration-200 ${
              selectedA === true 
                ? "opacity-100 border-solid shadow-none translate-x-[6px] translate-y-[6px]" 
                : ""
            }`}
          >
            {selectedA === true ? <span className="flex items-center justify-center gap-2"><Check className="w-8 h-8"/> Fake</span> : "Fake"}
          </BrutalButton>
        </div>
      </div>
    );
  };

  const renderPartB = () => {
    const question = currentStepB === 0 
      ? "How aware are you NOW of AI-generated misinformation?"
      : "How confident are you NOW in spotting fake content online?";
      
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full pt-20 pb-16 px-4 items-center justify-center text-center">
        {/* Progress */}
        <div className="flex gap-2 justify-center mb-16">
          <div className={`h-3 w-16 border-[2px] border-[#0F172A] ${currentStepB === 0 ? "bg-[#FFB800]" : "bg-[#0F172A]"}`} />
          <div className={`h-3 w-16 border-[2px] border-[#0F172A] ${currentStepB === 1 ? "bg-[#FFB800]" : "bg-white"}`} />
        </div>

        <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-widest text-[#0F172A] mb-16 leading-tight">
          {question}
        </h2>
        
        <div className="grid grid-cols-5 gap-3 md:gap-6 w-full max-w-2xl">
          {[1, 2, 3, 4, 5].map((rating) => (
            <BrutalButton
              key={rating}
              variant={selectedB === rating ? "dark" : "secondary"}
              onClick={() => handleAnswerB(rating)}
              disabled={selectedB !== null}
              className={`aspect-square h-auto p-0 flex items-center justify-center text-4xl md:text-5xl font-black transition-all duration-200 ${
                selectedB === rating
                  ? "opacity-100 border-solid shadow-none translate-x-[6px] translate-y-[6px]"
                  : ""
              }`}
            >
              {rating}
            </BrutalButton>
          ))}
        </div>
        
        <div className="flex justify-between w-full max-w-2xl mt-8 font-mono font-bold text-[#0F172A]/70 uppercase text-sm md:text-base">
          <span>Not at all</span>
          <span>Very much</span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA] font-sans bg-cubes flex flex-col items-center">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl px-4"
          >
            <div className="border-[4px] border-[#0F172A] bg-white p-12 shadow-[12px_12px_0px_0px_#0F172A]">
              <h1 className="text-5xl md:text-7xl font-black font-heading tracking-widest uppercase text-[#0F172A] drop-shadow-[4px_4px_0_rgba(255,184,0,1)] mb-6">
                Field Test
              </h1>
              <p className="text-xl md:text-2xl font-bold font-sans text-[#0F172A]/80 mb-12 max-w-xl mx-auto leading-relaxed">
                Let's see how much you've learned. We'll run you through the same check.
              </p>
              <BrutalButton variant="primary" size="lg" onClick={() => setPhase("partA")} className="w-full text-2xl py-6">
                START FIELD TEST
              </BrutalButton>
            </div>
          </motion.div>
        )}

        {phase === "partA" && (
          <motion.div
            key="partA"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full flex-1 flex flex-col"
          >
            {renderPartA()}
          </motion.div>
        )}

        {phase === "partB" && (
          <motion.div
            key="partB"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
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
