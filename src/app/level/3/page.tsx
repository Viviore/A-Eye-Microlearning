"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  FileVideo,
  CheckCircle2,
  XCircle,
  Plus,
  RotateCcw,
} from "lucide-react";
import case003Data from "@/data/case003.json";

type VideoRound = {
  id: string;
  isTutorial: boolean;
  videoA: string;
  videoB: string;
  correctPanel: "A" | "B";
  tells: string[];
  distractorTells: string[];
};

const VIDEO_ROUNDS: VideoRound[] = case003Data as VideoRound[];

export default function Level3Page() {
  const router = useRouter();
  const { 
    completeLevel, 
    cumulativeScore, 
    addCumulativeScore,
    addCase003Score,
    resetGame, 
    playedCase003Rounds, 
    markCase003RoundPlayed 
  } = useGameStore();

  const [sessionRounds, setSessionRounds] = useState<VideoRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);
  const [toolUsed, setToolUsed] = useState(false);
  const [replaysUsed, setReplaysUsed] = useState(0);
  
  const [roundScore, setRoundScore] = useState(100);
  const [deductions, setDeductions] = useState<{id: number, amount: number}[]>([]);

  const [selectedPanel, setSelectedPanel] = useState<"A" | "B" | null>(null);
  const [isPanelLocked, setIsPanelLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [selectedTell, setSelectedTell] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string } | null>(null);
  const [hoveredTell, setHoveredTell] = useState<string | null>(null);

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const isDriverInitialized = useRef(false);
  const driverObjRef = useRef<any>(null);
  const [isTourActive, setIsTourActive] = useState(true);

  useEffect(() => {
    const tutorial = VIDEO_ROUNDS.find(r => r.isTutorial);
    let unplayed = VIDEO_ROUNDS.filter(r => !r.isTutorial && !playedCase003Rounds.includes(r.id));
    
    if (unplayed.length < 5) {
      unplayed = VIDEO_ROUNDS.filter(r => !r.isTutorial); // fallback
    }
    
    const shuffled = [...unplayed].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    if (tutorial) {
      setSessionRounds([tutorial, ...selected]);
    } else {
      setSessionRounds(selected);
    }
    setIsReady(true);
  }, [playedCase003Rounds]);

  const currentRound = sessionRounds[currentRoundIndex];

  const [currentTells, setCurrentTells] = useState<any[]>([]);

  useEffect(() => {
    if (!currentRound) {
      setCurrentTells([]);
      return;
    }
    const tells = [...currentRound.tells, ...currentRound.distractorTells];
    setCurrentTells(tells.sort(() => 0.5 - Math.random()));
  }, [currentRound]);

  // Check Game Over condition
  useEffect(() => {
    if (cumulativeScore + roundScore <= 0 && !currentRound?.isTutorial) {
      alert("GAME OVER: Your score has reached 0. The A-Eye experience will now reset.");
      resetGame();
      router.push("/");
    }
  }, [cumulativeScore, roundScore, currentRound, resetGame, router]);

  const applyDeduction = (amount: number) => {
    if (!currentRound?.isTutorial) {
      setRoundScore((prev) => Math.max(0, prev - amount));
      // eslint-disable-next-line
      setDeductions((prev) => [...prev, { id: Date.now() + Math.random(), amount }]);
      setTimeout(() => {
        setDeductions((prev) => prev.slice(1));
      }, 2000);
    }
  };

  const handleTimeout = useCallback(() => {
    applyDeduction(50);
    setFeedback({
      isSuccess: false,
      title: "TIME'S UP",
      message: "You ran out of time. The AI generates new content fast, you must be faster."
    });
    setShowReveal(true);
  }, [currentRound, setRoundScore, setDeductions, setFeedback, setShowReveal]);

  // Timer logic
  useEffect(() => {
    if (!isReady || !currentRound || isPanelLocked || isTourActive || showConfirm || showReveal) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isReady, currentRound, isPanelLocked, isTourActive, showConfirm, showReveal, handleTimeout]);

  const swapToRandomRound = () => {
    const availableIndices = sessionRounds
      .map((_, i) => i)
      .filter(i => i !== currentRoundIndex && !playedCase003Rounds.includes(sessionRounds[i].id) && !sessionRounds[i].isTutorial);
      
    if (availableIndices.length > 0) {
      // eslint-disable-next-line
      const nextIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setCurrentRoundIndex(nextIdx);
    } else {
      setCurrentRoundIndex((prev) => (prev + 1) % sessionRounds.length);
    }
    resetRoundState();
  };

  const resetRoundState = () => {
    setSelectedPanel(null);
    setIsPanelLocked(false);
    setShowConfirm(false);
    setSelectedTell(null);
    setShowReveal(false);
    setFeedback(null);
    setTimeLeft(60);
    setToolUsed(false);
    setRoundScore(100);
    setReplaysUsed(0);
    
    if (videoARef.current && videoBRef.current) {
        videoARef.current.currentTime = 0;
        videoBRef.current.currentTime = 0;
        videoARef.current.play().catch(e => console.log(e));
        videoBRef.current.play().catch(e => console.log(e));
    }
  };

  const handleReplay = () => {
    if (isPanelLocked || showConfirm || showReveal) return;
    const newReplays = replaysUsed + 1;
    setReplaysUsed(newReplays);
    if (newReplays > 5) {
      applyDeduction(10);
    }
    if (videoARef.current && videoBRef.current) {
      videoARef.current.currentTime = 0;
      videoBRef.current.currentTime = 0;
      videoARef.current.play();
      videoBRef.current.play();
    }
  };

  const handlePanelClick = (panel: "A" | "B") => {
    if (isPanelLocked || isTourActive || showReveal) return;
    setSelectedPanel(panel);
    setShowConfirm(true);
    if (videoARef.current && videoBRef.current) {
        videoARef.current.pause();
        videoBRef.current.pause();
    }
  };
  
  const handleConfirmPanel = () => {
    setIsPanelLocked(true);
    setShowConfirm(false);
  };
  
  const handleCancelConfirm = () => {
    setSelectedPanel(null);
    setShowConfirm(false);
    if (videoARef.current && videoBRef.current) {
        videoARef.current.play();
        videoBRef.current.play();
    }
  };

  const handleTellClick = (tell: string) => {
    if (showReveal) return;
    setSelectedTell(tell);
    setShowReveal(true);
    
    const isCorrectPanel = selectedPanel === currentRound.correctPanel;
    const isCorrectTell = currentRound.tells.includes(tell);
    let finalScore = roundScore;

    if (!isCorrectPanel) {
      applyDeduction(50);
      finalScore = Math.max(0, finalScore - 50);
      setFeedback({
        isSuccess: false,
        title: "WRONG PANEL",
        message: "You picked the wrong panel. The other video was the AI-generated one.",
      });
    } else if (!isCorrectTell) {
      applyDeduction(20);
      finalScore = Math.max(0, finalScore - 20);
      setFeedback({
        isSuccess: false,
        title: "LUCKY GUESS",
        message: "You picked the correct panel, but your reasoning was wrong.",
      });
      if (!currentRound.isTutorial) {
        addCumulativeScore(finalScore);
        addCase003Score(finalScore);
        markCase003RoundPlayed(currentRound.id);
      }
    } else {
      if (!currentRound.isTutorial) {
        addCumulativeScore(finalScore);
        addCase003Score(finalScore);
        markCase003RoundPlayed(currentRound.id);
      }
      setFeedback({
        isSuccess: true,
        title: "VERDICT VERIFIED",
        message: "Great job! You successfully identified the AI video and the correct reasoning.",
      });
    }
  };

  const handleNextAction = () => {
    if (timeLeft === 0 || selectedPanel !== currentRound.correctPanel) {
      swapToRandomRound();
    } else {
      if (currentRoundIndex < sessionRounds.length - 1) {
        setCurrentRoundIndex((prev) => prev + 1);
        resetRoundState();
      } else {
        completeLevel(3);
        setTimeout(() => {
          router.push("/results");
        }, 500);
      }
    }
  };

  // Driver.js tutorial
  useEffect(() => {
    if (currentRound?.isTutorial && !isDriverInitialized.current && isReady) {
      isDriverInitialized.current = true;
      setIsTourActive(true);
      
      const d = driver({
        showProgress: true,
        allowClose: false,
        disableActiveInteraction: true,
        onPopoverRender: (popover, { state }) => {
          if (!driverObjRef.current?.hasNextStep()) return;

          const navBtns = popover.wrapper.querySelector(".driver-popover-navigation-btns");
          if (navBtns && !navBtns.querySelector(".driver-skip-btn")) {
            const skipBtn = document.createElement("button");
            skipBtn.innerText = "Skip";
            skipBtn.className = "driver-popover-footer-btn driver-skip-btn";
            skipBtn.setAttribute("aria-label", "Skip Tutorial");
            skipBtn.addEventListener("click", () => {
              if (driverObjRef.current) {
                driverObjRef.current.destroy();
              }
              // Auto-advance past the tutorial round
              setCurrentRoundIndex(1);
              resetRoundState();
              setDeductions([]);
              setHoveredTell(null);
            });
            navBtns.insertBefore(skipBtn, navBtns.firstChild);
          }
        },
        steps: [
          { popover: { title: 'A-Eye Agent', description: "Welcome to Case 003! You need to figure out which video is AI generated." } },
          { element: '#tutorial-videos', popover: { title: 'A-Eye Agent', description: "Watch both panels carefully. They play simultaneously." } },
          { element: '#tutorial-replay', popover: { title: 'A-Eye Agent', description: "You have 5 free grace replays. Use them wisely! Beyond 5, it costs -10 points each." } },
          { element: '#tutorial-timer', popover: { title: 'A-Eye Agent', description: "You have 60 seconds per round. Running out of time means a -50 penalty and a new round." } },
          { popover: { title: 'A-Eye Agent', description: "Click the panel you think is AI. After confirming, you must explain WHY. Good luck!", doneBtnText: "Start Playing" } }
        ],
        onDestroyStarted: () => {
          setIsTourActive(false);
          if (videoARef.current && videoBRef.current) {
              videoARef.current.play().catch(e => console.log(e));
              videoBRef.current.play().catch(e => console.log(e));
          }
          if (driverObjRef.current?.hasNextStep()) {
            driverObjRef.current.destroy();
          } else {
            driverObjRef.current.destroy();
          }
        }
      });
      driverObjRef.current = d;
      d.drive();
    }
    
    return () => {
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
      }
    };
  }, [currentRound?.isTutorial, isReady]);

  if (!isReady || !currentRound) return null;

  return (
    <main
      className="min-h-full bg-white text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
      style={{
        backgroundImage: "linear-gradient(to right, #0F172A12 1px, transparent 1px), linear-gradient(to bottom, #0F172A12 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 gap-8 items-start pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FFB800] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-[#0F172A]" />
              <span>CASE 003 // VIDEO INVESTIGATION</span>
            </div>
            
            <span
              className={`px-3 py-1 font-mono text-xs font-bold uppercase border-[4px] shadow-[4px_4px_0px_0px_#0F172A] border-[#0F172A] ${
                currentRound.isTutorial ? "bg-white text-[#0F172A]" : "bg-[#FFB800] text-[#0F172A]"
              }`}
            >
              {currentRound.isTutorial
                ? "TUTORIAL"
                : `VIDEO ${sessionRounds.slice(0, currentRoundIndex).filter(r => !r.isTutorial).length + 1} / ${sessionRounds.filter(r => !r.isTutorial).length}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Button
                disabled={currentRound.isTutorial || toolUsed || (cumulativeScore + roundScore < 80)}
                onClick={() => {
                  if (!toolUsed && (cumulativeScore + roundScore >= 80)) {
                    setToolUsed(true);
                    applyDeduction(80);
                    setTimeLeft((prev) => prev + 30);
                  }
                }}
                className="w-10 h-10 p-0 rounded-full bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center text-[#0F172A] disabled:opacity-50 hover:bg-[#FFB800]"
                title="+30 Seconds (-80 pts)"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
              </Button>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                +30s (-80 pts)
              </div>
            </div>

            <div id="tutorial-replay" className="relative group">
              <Button
                disabled={isPanelLocked || showConfirm || showReveal}
                onClick={handleReplay}
                className="w-10 h-10 p-0 rounded-full bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center text-[#0F172A] disabled:opacity-50 hover:bg-[#FFB800]"
              >
                <RotateCcw className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
              </Button>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                {replaysUsed < 5 ? `Replays: ${5 - replaysUsed} free` : "Replay (-10 pts)"}
              </div>
            </div>

            <div id="tutorial-timer" className="text-right">
              <div className="text-sm font-bold uppercase text-red-500">Timer</div>
              <div className="text-3xl font-black font-heading">{timeLeft}s</div>
            </div>

            <div className="font-heading font-black text-xl md:text-2xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-1 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative">
              <span>Score: </span>
              <span className="relative text-[#FFB800] drop-shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                {cumulativeScore + roundScore}
              </span>
              <AnimatePresence>
                {deductions.map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-black font-heading text-2xl z-50 whitespace-nowrap pointer-events-none"
                  >
                    -{d.amount}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div id="tutorial-videos" className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[8px_8px_0px_0px_#0F172A]">
          <h2 className="text-3xl font-black font-heading text-center mb-6 uppercase">Which one is AI?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Panel A */}
            <div 
              onClick={() => handlePanelClick("A")}
              className={`relative cursor-pointer transition-all border-[4px] ${selectedPanel === "A" ? "border-[#FFB800] shadow-[0_0_0_4px_#FFB800]" : "border-[#0F172A] hover:border-[#FFB800] hover:scale-[1.02]"} ${(isPanelLocked && selectedPanel !== "A") ? "opacity-50 pointer-events-none grayscale" : ""}`}
            >
              <div className="absolute top-2 left-2 bg-[#0F172A] text-white font-mono font-bold px-3 py-1 z-10 border-2 border-white shadow-sm">PANEL A</div>
              <video 
                ref={videoARef} 
                src={currentRound.videoA} 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay
                loop 
                muted 
                playsInline
                onEnded={() => { videoARef.current?.pause(); }}
              />
              {showReveal && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/60 z-20`}>
                  <span className={`text-5xl font-black font-heading uppercase ${currentRound.correctPanel === "A" ? "text-red-500 drop-shadow-[0_4px_0_black]" : "text-green-400 drop-shadow-[0_4px_0_black]"}`}>
                    {currentRound.correctPanel === "A" ? "AI FAKE" : "REAL"}
                  </span>
                </div>
              )}
            </div>

            {/* Panel B */}
            <div 
              onClick={() => handlePanelClick("B")}
              className={`relative cursor-pointer transition-all border-[4px] ${selectedPanel === "B" ? "border-[#FFB800] shadow-[0_0_0_4px_#FFB800]" : "border-[#0F172A] hover:border-[#FFB800] hover:scale-[1.02]"} ${(isPanelLocked && selectedPanel !== "B") ? "opacity-50 pointer-events-none grayscale" : ""}`}
            >
              <div className="absolute top-2 left-2 bg-[#0F172A] text-white font-mono font-bold px-3 py-1 z-10 border-2 border-white shadow-sm">PANEL B</div>
              <video 
                ref={videoBRef} 
                src={currentRound.videoB} 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay
                loop 
                muted 
                playsInline
                onEnded={() => { videoBRef.current?.pause(); }}
              />
              {showReveal && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/60 z-20`}>
                  <span className={`text-5xl font-black font-heading uppercase ${currentRound.correctPanel === "B" ? "text-red-500 drop-shadow-[0_4px_0_black]" : "text-green-400 drop-shadow-[0_4px_0_black]"}`}>
                    {currentRound.correctPanel === "B" ? "AI FAKE" : "REAL"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Confirm Dialog */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8 p-6 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex flex-col items-center gap-4"
              >
                <h3 className="font-heading font-black text-2xl uppercase">Are you sure?</h3>
                <p className="font-sans font-bold text-center">You selected Panel {selectedPanel} as the AI fake. Locking this in will consume your answer.</p>
                <div className="flex gap-4">
                  <Button onClick={handleCancelConfirm} className="bg-white text-[#0F172A] border-[3px] border-[#0F172A] hover:bg-gray-100 uppercase font-bold px-8">Cancel</Button>
                  <Button onClick={handleConfirmPanel} className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 uppercase font-bold border-[3px] border-[#0F172A] px-8">Lock Answer</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Verdict Form Area */}
        <AnimatePresence>
          {isPanelLocked && !showReveal && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A]"
            >
              <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-2 uppercase tracking-wider text-center">
                Explain Your Tell
              </h2>
              <p className="text-center font-bold text-[#0F172A]/70 mb-6">Why do you think Panel {selectedPanel} is AI? Select the most obvious mistake.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTells.map((tell) => (
                  <button
                    key={tell}
                    onClick={() => handleTellClick(tell)}
                    onMouseEnter={() => setHoveredTell(tell)}
                    onMouseLeave={() => setHoveredTell(null)}
                    className="p-4 border-[4px] border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] font-bold font-sans transition-all text-[#0F172A] bg-white hover:bg-[#FFB800] hover:shadow-[4px_4px_0px_0px_#0F172A]"
                  >
                    {tell}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback / Reveal Area */}
        <AnimatePresence>
          {showReveal && feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] ${feedback.isSuccess ? "bg-green-100" : "bg-red-100"}`}
            >
              <div className="flex items-center gap-3 mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-4">
                {feedback.isSuccess ? (
                  <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={3} />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" strokeWidth={3} />
                )}
                <h3 className="font-heading font-black text-3xl text-[#0F172A] uppercase tracking-wider">
                  {feedback.title}
                </h3>
              </div>
              <p className="text-xl font-sans font-bold text-[#0F172A] mb-8">
                {feedback.message}
              </p>
              
              <Button
                onClick={handleNextAction}
                className="w-full h-16 bg-[#0F172A] text-white hover:bg-[#0F172A]/90 font-heading uppercase tracking-widest font-bold text-2xl transition-all"
              >
                {currentRoundIndex < sessionRounds.length - 1 ? (feedback.isSuccess ? "Proceed to Next Video" : "Retry with New Video") : "Finish Case 003"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
