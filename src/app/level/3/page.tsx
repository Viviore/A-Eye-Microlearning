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
import case003Data from "@/data/case003";
import { CaseHeader } from "@/components/game/CaseHeader";
import { useLevelScoring } from "@/hooks/useLevelScoring";
import { useProgressionGuard } from "@/hooks/useProgressionGuard";
import { MockBrowserWindow } from "@/components/game/MockBrowserWindow";
import { GameOverModal, VerdictModalContainer, VerdictFeedback } from "@/components/game/VerdictModal";

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
  useProgressionGuard();
  const router = useRouter();
  const { startTransition, startInPlaceTransition, isTransitioning } = useAppTransition();
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

  const [toolUsed, setToolUsed] = useState(false);

  const [selectedPanel, setSelectedPanel] = useState<"A" | "B" | null>(null);
  const [isPanelLocked, setIsPanelLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedTell, setSelectedTell] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: React.ReactNode; penalty?: number; scoreBadge?: React.ReactNode; forceNext?: boolean; retryButtonText?: string; } | null>(null);
  const [hoveredTell, setHoveredTell] = useState<string | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const isDriverInitialized = useRef(false);
  const driverObjRef = useRef<any>(null);
  const [isTourActive, setIsTourActive] = useState(true);

  const currentRound = sessionRounds[currentRoundIndex];

  const {
    roundScore,
    setRoundScore,
    timeLeft,
    setTimeLeft,
    clickPopups: deductions,
    scorePopups,
    triggerScoreAnimation,
    applyDeduction,
    resetScoring,
  } = useLevelScoring({
    isReady,
    hasTimer: true,
    isPaused: currentRound?.isTutorial || isTourActive || showReveal || showTimeoutModal,
    onTimeout: () => {
      // Pause both videos immediately
      if (videoARef.current && videoBRef.current) {
        videoARef.current.pause();
        videoBRef.current.pause();
      }
      applyDeduction(50);
      addCumulativeScore(-50);
      addCase003Score(-50);
      markCase003RoundPlayed(currentRound?.id || "");
      setShowTimeoutModal(true);
      setFeedback({
        isSuccess: false,
        title: "TIME'S UP",
        message: currentRoundIndex === sessionRounds.length - 1 
          ? "You ran out of time. Proceeding to case summary."
          : "You ran out of time. AI misinformation spreads rapidly in seconds. Proceeding to the next round.",
        penalty: 50,
      });
    }
  });

  useEffect(() => {
    // Only initialize once to prevent round shuffling mid-game
    if (sessionRounds.length > 0) return;

    const tutorial = VIDEO_ROUNDS.find(r => r.isTutorial);
    let unplayed = VIDEO_ROUNDS.filter(r => !r.isTutorial && !playedCase003Rounds.includes(r.id));

    if (unplayed.length < 5) {
      unplayed = VIDEO_ROUNDS.filter(r => !r.isTutorial); // fallback
    }

    const shuffled = [...unplayed].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).map(round => {
      if (Math.random() > 0.5) {
        return {
          ...round,
          videoA: round.videoB,
          videoB: round.videoA,
          correctPanel: (round.correctPanel === "A" ? "B" : "A") as "A" | "B"
        };
      }
      return round;
    });

    if (tutorial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionRounds([tutorial, ...selected]);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionRounds(selected);
    }
    setIsReady(true);
  }, []);


  const [currentTells, setCurrentTells] = useState<string[]>([]);

  useEffect(() => {
    if (!currentRound) return;
    // 1 correct tell + all 3 distractors = 4 options
    const tells = [...currentRound.tells, ...(currentRound.distractorTells || [])];
    // Fisher-Yates shuffle
    for (let i = tells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tells[i], tells[j]] = [tells[j], tells[i]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTells(tells);
  }, [currentRoundIndex, currentRound]);

  // Check Game Over condition
  useEffect(() => {
    if (cumulativeScore + roundScore <= 0 && !currentRound?.isTutorial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowGameOverModal(true);
    }
  }, [roundScore, cumulativeScore, currentRound?.isTutorial]);

  // Timer and deduct logic replaced by useLevelScoring hook

  const swapToRandomRound = () => {
    const usedIds = sessionRounds.map(r => r.id);
    let available = VIDEO_ROUNDS.filter(r => !r.isTutorial && !usedIds.includes(r.id) && !playedCase003Rounds.includes(r.id));

    if (available.length === 0) {
      available = VIDEO_ROUNDS.filter(r => !r.isTutorial && r.id !== currentRound?.id);
    }

    if (available.length > 0) {
      // eslint-disable-next-line react-hooks/purity
      const nextRound = available[Math.floor(Math.random() * available.length)];
      setSessionRounds(prev => {
        const next = [...prev];
        next[currentRoundIndex] = nextRound;
        return next;
      });
    }
    resetRoundState();
  };

  const resetRoundState = () => {
    setSelectedPanel(null);
    setIsPanelLocked(false);
    setShowConfirm(false);
    setSelectedTell(null);
    setShowReveal(false);
    setShowTimeoutModal(false);
    setFeedback(null);
    setToolUsed(false);
    resetScoring();


    if (videoARef.current && videoBRef.current) {
      videoARef.current.currentTime = 0;
      videoBRef.current.currentTime = 0;
      videoARef.current.play().catch(e => console.log(e));
      videoBRef.current.play().catch(e => console.log(e));
    }
  };



  const handlePanelClick = (panel: "A" | "B") => {
    if (isPanelLocked || isTourActive || showReveal) return;
    setSelectedPanel(panel);
    setShowConfirm(true);
  };

  const handleConfirmPanel = () => {
    setIsPanelLocked(true);
    setShowConfirm(false);
  };

  const handleCancelConfirm = () => {
    setSelectedPanel(null);
    setShowConfirm(false);
  };

  const handleCancelSelection = () => {
    setIsPanelLocked(false);
    setSelectedPanel(null);
    if (videoARef.current && videoBRef.current) {
      videoARef.current.play().catch(e => console.log(e));
      videoBRef.current.play().catch(e => console.log(e));
    }
  };

  const handleTellClick = (tell: string) => {
    if (showReveal) return;
    setSelectedTell(tell);
    setShowReveal(true);
    
    // Pause videos when the round is completed
    if (videoARef.current && videoBRef.current) {
      videoARef.current.pause();
      videoBRef.current.pause();
    }

    const isCorrectPanel = selectedPanel === currentRound.correctPanel;
    const isCorrectTell = currentRound.tells.includes(tell);
    let finalScore = roundScore;

    if (!isCorrectPanel) {
      applyDeduction(50);
      finalScore = Math.max(0, finalScore - 50);
      setFeedback({
        isSuccess: false,
        title: "WRONG PANEL",
        message: (<>You picked the wrong panel. The other video was the AI-generated one.</>),
        penalty: 50,
        scoreBadge: (
          <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            -50 Points
          </span>
        )
      });
    } else if (!isCorrectTell) {
      applyDeduction(25);
      finalScore = Math.max(0, finalScore - 25);
      setFeedback({
        isSuccess: false,
        title: "LUCKY GUESS",
        message: (<>You picked the correct panel, but your reasoning was wrong.</>),
        penalty: 25,
        scoreBadge: (
          <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            -25 Points
          </span>
        )
      });
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
        scoreBadge: !currentRound.isTutorial ? (
          <span className="inline-block bg-[#10B981] text-white border-[3px] border-[#0F172A] px-3 py-1 font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            +{finalScore} Points
          </span>
        ) : undefined,
      });
    }
  };

  const handleNextAction = () => {
    if (currentRoundIndex >= sessionRounds.length - 1) {
      completeLevel(3);
      setTimeout(() => {
        startTransition("/post", { variant: 'post-assessment' });
      }, 1500);
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
      resetRoundState();
    }
  };

  const handleRetryAction = () => {
    // Soft reset: unlock panels and play videos, but PRESERVE score deductions and timer
    setSelectedPanel(null);
    setIsPanelLocked(false);
    setShowConfirm(false);
    setSelectedTell(null);
    setShowReveal(false);
    setFeedback(null);
    
    if (videoARef.current && videoBRef.current) {
      videoARef.current.currentTime = 0;
      videoBRef.current.currentTime = 0;
      videoARef.current.play().catch(e => console.log(e));
      videoBRef.current.play().catch(e => console.log(e));
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
            element.scrollIntoView({ behavior: "smooth", block: "start" });
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
              
              startInPlaceTransition(() => {
                // Auto-advance past the tutorial round
                setCurrentRoundIndex(1);
                resetScoring();
                setToolUsed(false);
                setSelectedTell(null);
                resetRoundState();
              });
            });
            navBtns.insertBefore(skipBtn, navBtns.firstChild);
          }
        },
        popoverOffset: 20,
        stagePadding: 8,
        steps: [
          { popover: { title: 'A-Eye Agent', description: "Welcome to Case 003! You need to figure out which video is AI generated." } },
          { element: '#tutorial-videos', popover: { title: 'A-Eye Agent', description: "Watch both panels carefully. They play simultaneously.", side: "bottom", align: "center" } },
          { element: '#tutorial-timer', popover: { title: 'A-Eye Agent', description: "You have 60 seconds per round. Running out of time means a -50 penalty and a new round.", side: "bottom", align: "center" } },
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
      className="min-h-[100dvh] bg-[#FAFAFA] bg-cubes text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-8 md:pb-12"
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-[1200px] z-10 grid grid-cols-1 gap-8 items-start">

        {/* Header Section */}
        <motion.div variants={fadeUp} className="w-full">
          <CaseHeader
            caseNumber="CASE 003"
            caseTitle="VIDEO INVESTIGATION"
            isTutorial={currentRound.isTutorial}
            currentRoundNumber={sessionRounds.slice(0, currentRoundIndex).filter(r => !r.isTutorial).length + 1}
            totalRounds={sessionRounds.filter(r => !r.isTutorial).length}
            score={cumulativeScore + roundScore}
            scorePopups={deductions}
            icon="fileVideo"
          >
            <div className="relative group">
              <BrutalButton
                variant="icon"
                size="circle"
                disabled={currentRound.isTutorial || toolUsed || (cumulativeScore + roundScore < 80)}
                onClick={() => {
                  if (!toolUsed && (cumulativeScore + roundScore >= 80)) {
                    setToolUsed(true);
                    applyDeduction(80);
                    setTimeLeft((prev) => prev + 30);
                  }
                }}
                title="+30 Seconds (-80 pts)"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
              </BrutalButton>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                +30s (-80 pts)
              </div>
            </div>



            <div id="tutorial-timer" className="text-right">
              <div className="text-sm font-bold uppercase text-red-500">Timer</div>
              {currentRound.isTutorial ? (
                <div className="text-lg font-black font-heading text-[#0F172A]/30 uppercase tracking-wider">Paused</div>
              ) : (
                <div className="text-3xl font-black font-heading">{timeLeft}s</div>
              )}
            </div>
          </CaseHeader>
        </motion.div>

        {/* Video Area */}
        <motion.div variants={fadeUp} id="tutorial-videos" className="w-full">
          <MockBrowserWindow className="bg-[#FAFAFA]">
            <h2 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-widest text-[#0F172A] mb-6 text-center">Which one is AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/70 z-20`}>
                      {currentRound.correctPanel === "A" ? (
                        <div className="bg-[#FFB800] text-[#0F172A] px-4 md:px-6 py-2 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                          <span className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest">
                            AI GENERATED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#10B981] text-white px-4 md:px-6 py-2 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]">
                          <span className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest">
                            AUTHENTIC
                          </span>
                        </div>
                      )}
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
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/70 z-20`}>
                      {currentRound.correctPanel === "B" ? (
                        <div className="bg-[#FFB800] text-[#0F172A] px-4 md:px-6 py-2 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                          <span className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest">
                            AI GENERATED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#10B981] text-white px-4 md:px-6 py-2 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]">
                          <span className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest">
                            AUTHENTIC
                          </span>
                        </div>
                      )}
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
          {showConfirm && (
            <div className="w-full mt-8">
              <div className="p-6 bg-[#FFB800] border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] flex flex-col items-center gap-4">
                <h3 className="font-heading font-black text-2xl uppercase">Are you sure?</h3>
                <p className="font-sans font-bold text-center">You selected Panel {selectedPanel} as the AI fake. Locking this in will consume your answer.</p>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-2">
                  <BrutalButton onClick={handleCancelConfirm} variant="secondary" className="w-full md:w-auto">Cancel</BrutalButton>
                  <BrutalButton onClick={handleConfirmPanel} variant="dark" className="w-full md:w-auto">Lock Answer</BrutalButton>
                </div>
              </div>
            </div>
          )}
          </MockBrowserWindow>
        </motion.div>

      </motion.div>

      <VerdictModalContainer isOpen={isPanelLocked || showTimeoutModal}>
        <AnimatePresence mode="wait">
          {isPanelLocked && !showReveal && !showTimeoutModal && (
            <motion.div
              key="verdict-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8 flex flex-col"
            >
              <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-3 uppercase tracking-wider text-center">
                Explain Your Tell
              </h2>
              <div className="space-y-4 font-sans">
              <h3 className="font-bold text-xl mb-3 font-heading">
                Why do you think Panel {selectedPanel} is AI? Select the most obvious mistake.
              </h3>
              <div className="flex flex-col gap-3">
                {currentTells.map((tell) => {
                  const isCorrect = currentRound.tells.includes(tell);
                  const isTutorial = currentRound.isTutorial && !isTourActive;
                  const isDisabled = isTutorial && !isCorrect;
                  const showPulse = isTutorial && isCorrect;

                  let buttonClass = `p-4 border-[4px] font-bold font-sans transition-all text-[#0F172A] cursor-pointer text-left `;

                  if (isDisabled) {
                    buttonClass += "bg-white/50 border-dashed border-[#0F172A]/20 opacity-40 cursor-not-allowed ";
                  } else if (showPulse) {
                    buttonClass += "bg-[#FFB800]/30 border-[#0F172A] border-solid shadow-[4px_4px_0px_0px_#0F172A] animate-pulse hover:bg-[#FFB800]/50 ";
                  } else {
                    buttonClass += "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)] ";
                  }

                  return (
                    <button
                      key={tell}
                      onClick={() => !isDisabled && handleTellClick(tell)}
                      disabled={isDisabled}
                      className={buttonClass}
                    >
                      <div className="text-lg">{tell}</div>
                    </button>
                  );
                })}
              </div>
              
              {(!currentRound.isTutorial || !isTourActive) && (
                <div className="pt-2 mt-2">
                  <BrutalButton onClick={handleCancelSelection} variant="secondary" className="w-full flex justify-center items-center">
                    <RotateCcw className="mr-2 w-5 h-5" strokeWidth={2.5} /> CANCEL & RE-WATCH
                  </BrutalButton>
                </div>
              )}
              </div>
            </motion.div>
          )}

          {showReveal && feedback && !showTimeoutModal && (
            <motion.div
              key="verdict-feedback"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <VerdictFeedback
                isSuccess={feedback.isSuccess}
                title={feedback.title}
                message={feedback.message}
                scoreBadge={feedback.scoreBadge}
                forceNextAction={feedback.forceNext}
                onNext={handleNextAction}
                onRetry={handleRetryAction}
                retryButtonText={feedback.retryButtonText}
                nextButtonText={currentRoundIndex < sessionRounds.length - 1 ? "Proceed to Next Video" : "Finish Case 003"}
                isFinalRound={currentRoundIndex === sessionRounds.length - 1}
              />
            </motion.div>
          )}

          {showTimeoutModal && feedback && (
            <motion.div
              key="verdict-timeout"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <VerdictFeedback
                isSuccess={feedback.isSuccess}
                title={feedback.title}
                message={feedback.message}
                onNext={handleNextAction}
                onRetry={handleRetryAction}
                nextButtonText={currentRoundIndex < sessionRounds.length - 1 ? "Proceed to Next Video" : "Finish Case 003"}
                retryButtonText={currentRoundIndex < sessionRounds.length - 1 ? "Proceed to Next Video" : "Finish Case 003"}
                forceNextAction={true}
                scoreBadge={
                  <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
                    -50 Points
                  </span>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </VerdictModalContainer>

      <GameOverModal
        isOpen={showGameOverModal}
        onRestart={() => {
          resetGame();
          startTransition('/', { variant: 'init' });
        }}
      />
    </main>
  );
}
