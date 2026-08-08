"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";
import { useRouter } from "next/navigation";
import { useAppTransition } from "@/components/layout/TransitionProvider";
import {
  FileVideo,
  CheckCircle2,
  XCircle,
  Plus,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import case003Data from "@/data/case003.json";
import { AnimatedBackground } from "@/components/ui/animated-background";

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Level3Page() {
  const router = useRouter();
  const { startTransition, isTransitioning } = useAppTransition();
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
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string; penalty?: number } | null>(null);
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
      message: "You ran out of time. The AI generates new content fast, you must be faster.",
      penalty: 50,
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
        penalty: 50,
      });
    } else if (!isCorrectTell) {
      applyDeduction(20);
      finalScore = Math.max(0, finalScore - 20);
      setFeedback({
        isSuccess: false,
        title: "LUCKY GUESS",
        message: "You picked the correct panel, but your reasoning was wrong.",
        penalty: 20,
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
          startTransition("/quiz/post", { variant: 'next-case' });
        }, 1500);
      }
    }
  };

  // Driver.js tutorial
  useEffect(() => {
    if (currentRound?.isTutorial && !isDriverInitialized.current && isReady && !isTransitioning) {
      isDriverInitialized.current = true;
      setIsTourActive(true);
      
      const d = driver({
        showProgress: true,
        allowClose: false,
        smoothScroll: true,
        disableActiveInteraction: true,
        onHighlightStarted: (element) => {
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        },
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
        onDestroyed: () => {
          setIsTourActive(false);
          if (videoARef.current && videoBRef.current) {
              videoARef.current.play().catch(e => console.log(e));
              videoBRef.current.play().catch(e => console.log(e));
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
  }, [currentRound?.isTutorial, isReady, isTransitioning]);

  if (!isReady || !currentRound) return null;

  return (
    <main
      className="min-h-[100dvh] bg-[#FAFAFA] text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
    >
      <AnimatedBackground theme="light" />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-[1200px] z-10 grid grid-cols-1 gap-8 items-start pb-20">
        
        {/* Header Section */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
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
              <button
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
              </button>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                +30s (-80 pts)
              </div>
            </div>

            <div id="tutorial-replay" className="relative group">
              <button
                disabled={isPanelLocked || showConfirm || showReveal}
                onClick={handleReplay}
                className="w-10 h-10 p-0 rounded-full bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center text-[#0F172A] disabled:opacity-50 hover:bg-[#FFB800]"
              >
                <RotateCcw className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
              </button>
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
        </motion.div>

        {/* Video Area */}
        <motion.div variants={fadeUp} id="tutorial-videos" className="bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] flex flex-col">
          <div className="border-b-[4px] border-[#0F172A] bg-[#FFB800] p-3 flex justify-between items-center shrink-0">
            <div className="flex gap-2">
              <div className="w-5 h-5 border-[4px] border-[#0F172A] bg-white" />
              <div className="w-5 h-5 border-[4px] border-[#0F172A] bg-[#0F172A]" />
              <div className="w-5 h-5 border-[4px] border-[#0F172A] bg-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black font-heading uppercase tracking-widest text-[#0F172A]">Which one is AI?</h2>
            <div className="w-20"></div>
          </div>
          
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#FAFAFA]">
            {/* Panel A */}
            {(() => {
              const isCorrect = currentRound.correctPanel === "A";
              const isTutorial = currentRound.isTutorial && !isTourActive;
              const isDisabled = isTutorial && !isCorrect && !isPanelLocked;
              const showPulse = isTutorial && isCorrect && !selectedPanel;
              
              return (
                <div 
                  onClick={() => !isDisabled && handlePanelClick("A")}
                  className={`relative cursor-pointer transition-all border-[4px] ${selectedPanel === "A" ? "border-[#FFB800] shadow-[0_0_0_4px_#FFB800]" : showPulse ? "border-[#FFB800] border-solid shadow-[0_0_0_4px_#FFB800] animate-pulse" : "border-[#0F172A] hover:border-[#FFB800] hover:scale-[1.02]"} ${(isPanelLocked && selectedPanel !== "A") || isDisabled ? "opacity-50 pointer-events-none grayscale" : ""}`}
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
                  {showPulse && (
                    <motion.span 
                      animate={{ x: [0, 12, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none z-10 drop-shadow-xl"
                    >
                      <svg viewBox="0 0 100 100" className="w-16 h-16 overflow-visible">
                        <polygon points="14,44 54,44 54,24 94,54 54,84 54,64 14,64" fill="#0F172A" />
                        <polygon points="10,40 50,40 50,20 90,50 50,80 50,60 10,60" fill="#FFB800" stroke="#0F172A" strokeWidth="6" strokeLinejoin="miter" />
                      </svg>
                    </motion.span>
                  )}
                </div>
              );
            })()}

            {/* Panel B */}
            {(() => {
              const isCorrect = currentRound.correctPanel === "B";
              const isTutorial = currentRound.isTutorial && !isTourActive;
              const isDisabled = isTutorial && !isCorrect && !isPanelLocked;
              const showPulse = isTutorial && isCorrect && !selectedPanel;
              
              return (
                <div 
                  onClick={() => !isDisabled && handlePanelClick("B")}
                  className={`relative cursor-pointer transition-all border-[4px] ${selectedPanel === "B" ? "border-[#FFB800] shadow-[0_0_0_4px_#FFB800]" : showPulse ? "border-[#FFB800] border-solid shadow-[0_0_0_4px_#FFB800] animate-pulse" : "border-[#0F172A] hover:border-[#FFB800] hover:scale-[1.02]"} ${(isPanelLocked && selectedPanel !== "B") || isDisabled ? "opacity-50 pointer-events-none grayscale" : ""}`}
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
                  {showPulse && (
                    <motion.span 
                      animate={{ x: [0, 12, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none z-10 drop-shadow-xl"
                    >
                      <svg viewBox="0 0 100 100" className="w-16 h-16 overflow-visible">
                        <polygon points="14,44 54,44 54,24 94,54 54,84 54,64 14,64" fill="#0F172A" />
                        <polygon points="10,40 50,40 50,20 90,50 50,80 50,60 10,60" fill="#FFB800" stroke="#0F172A" strokeWidth="6" strokeLinejoin="miter" />
                      </svg>
                    </motion.span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Confirm Dialog */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mx-6 md:mx-8 mb-6 mt-2 p-6 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex flex-col items-center gap-4"
              >
                <h3 className="font-heading font-black text-2xl uppercase">Are you sure?</h3>
                <p className="font-sans font-bold text-center">You selected Panel {selectedPanel} as the AI fake. Locking this in will consume your answer.</p>
                <div className="flex gap-4">
                  <BrutalButton onClick={handleCancelConfirm} variant="secondary">Cancel</BrutalButton>
                  <BrutalButton onClick={handleConfirmPanel} variant="dark">Lock Answer</BrutalButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Verdict Form Area */}
        <AnimatePresence>
          {isPanelLocked && !showReveal && (
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 50 }}
              className="bg-white p-8 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] flex flex-col"
            >
              <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-2 uppercase tracking-wider text-center">
                Explain Your Tell
              </h2>
              <p className="text-center font-bold text-[#0F172A]/70 mb-8">Why do you think Panel {selectedPanel} is AI? Select the most obvious mistake.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTells.map((tell) => {
                  const isCorrect = currentRound.tells.includes(tell);
                  const isTutorial = currentRound.isTutorial && !isTourActive;
                  const isDisabled = isTutorial && !isCorrect;
                  const showPulse = isTutorial && isCorrect;

                  let btnClass = "relative px-6 py-4 border-[4px] font-black font-heading uppercase text-lg md:text-xl transition-all text-[#0F172A] cursor-pointer text-center flex items-center justify-center min-h-[5rem] ";
                  
                  if (isDisabled) {
                    btnClass += "bg-white/50 border-dashed border-[#0F172A]/20 opacity-40 !cursor-not-allowed ";
                  } else if (showPulse) {
                    btnClass += "bg-[#FFB800] border-[#0F172A] border-solid shadow-[4px_4px_0px_0px_#0F172A] animate-pulse hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0F172A] ";
                  } else {
                    btnClass += "bg-white border-solid border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:bg-[#FFB800] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0F172A] active:translate-y-[2px] active:shadow-none ";
                  }

                  return (
                    <button
                      key={tell}
                      onClick={() => !isDisabled && handleTellClick(tell)}
                      onMouseEnter={() => !isDisabled && setHoveredTell(tell)}
                      onMouseLeave={() => !isDisabled && setHoveredTell(null)}
                      disabled={isDisabled}
                      className={btnClass}
                    >
                      {tell}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback / Reveal Area */}
        <AnimatePresence>
          {showReveal && feedback && (
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`p-8 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] flex flex-col ${feedback.isSuccess ? "bg-green-400" : "bg-[#FF3366]"}`}
            >
              <div className="flex items-center gap-4 mb-6 border-b-[4px] border-solid border-[#0F172A] pb-6">
                {feedback.isSuccess ? (
                  <div className="w-16 h-16 bg-white border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center rotate-3 shrink-0">
                    <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={4} />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center -rotate-3 shrink-0">
                    <XCircle className="w-10 h-10 text-red-600" strokeWidth={4} />
                  </div>
                )}
                <h3 className="font-heading font-black text-3xl md:text-5xl text-[#0F172A] uppercase tracking-wider drop-shadow-[2px_2px_0px_white]">
                  {feedback.title}
                </h3>
                {feedback.penalty && (
                  <div className="ml-auto bg-[#0F172A] text-white px-3 py-1 font-mono font-bold text-lg md:text-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] rotate-2">
                    -{feedback.penalty} PTS
                  </div>
                )}
              </div>
              <p className="text-xl md:text-2xl font-sans font-bold text-[#0F172A] mb-8 bg-white p-4 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                {feedback.message}
              </p>
              
              <BrutalButton
                onClick={handleNextAction}
                variant="dark"
                size="lg"
                className="w-full h-16 md:h-20 text-xl md:text-2xl group"
              >
                {currentRoundIndex < sessionRounds.length - 1 ? (feedback.isSuccess ? "Proceed to Next Video" : "Retry with New Video") : "Finish Case 003"}
                <ArrowRight className="ml-4 w-8 h-8 transition-transform group-hover:translate-x-2" strokeWidth={3} />
              </BrutalButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
