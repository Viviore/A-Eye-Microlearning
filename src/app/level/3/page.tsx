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
import { CaseHeader } from "@/components/game/CaseHeader";
import { useLevelScoring } from "@/hooks/useLevelScoring";
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

  const [toolUsed, setToolUsed] = useState(false);
  const [replaysUsed, setReplaysUsed] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState<"A" | "B" | null>(null);
  const [isPanelLocked, setIsPanelLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedTell, setSelectedTell] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: React.ReactNode; penalty?: number; scoreBadge?: React.ReactNode } | null>(null);
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
        message: "You ran out of time. AI misinformation spreads rapidly in seconds. Proceeding to the next round.",
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
    const selected = shuffled.slice(0, 5);

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
  };

  const handleConfirmPanel = () => {
    setIsPanelLocked(true);
    setShowConfirm(false);
  };

  const handleCancelConfirm = () => {
    setSelectedPanel(null);
    setShowConfirm(false);
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
      });
    } else if (!isCorrectTell) {
      applyDeduction(25);
      finalScore = Math.max(0, finalScore - 25);
      setFeedback({
        isSuccess: false,
        title: "LUCKY GUESS",
        message: (<>You picked the correct panel, but your reasoning was wrong.</>),
        penalty: 25,
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
    } else if (selectedPanel !== null && selectedPanel !== currentRound.correctPanel) {
      swapToRandomRound();
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
      resetRoundState();
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
              resetScoring();
              setToolUsed(false);
              setSelectedTell(null);
              resetRoundState();
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
      className="min-h-[100dvh] bg-[#FAFAFA] bg-cubes text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-[1200px] z-10 grid grid-cols-1 gap-8 items-start pb-20">

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

            <div id="tutorial-replay" className="relative group">
              <BrutalButton
                variant="icon"
                size="circle"
                disabled={isPanelLocked || showConfirm || showReveal}
                onClick={handleReplay}
              >
                <RotateCcw className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
              </BrutalButton>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg z-50">
                {replaysUsed < 5 ? `Replays: ${5 - replaysUsed} free` : "Replay (-10 pts)"}
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

                  let btnClass = "relative px-6 py-4 border-[4px] font-black font-heading uppercase text-lg md:text-xl transition-all duration-200 text-[#0F172A] cursor-pointer text-center flex items-center justify-center min-h-[5rem] ";

                  if (isDisabled) {
                    btnClass += "bg-white/50 border-dashed border-[#0F172A]/20 opacity-40 !cursor-not-allowed ";
                  } else if (showPulse) {
                    btnClass += "bg-[#FFB800] border-[#0F172A] border-solid shadow-[4px_4px_0px_0px_#0F172A] animate-pulse hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F172A] ";
                  } else {
                    btnClass += "bg-white border-solid border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:bg-[#FFB800] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F172A] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#0F172A] ";
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
              className={`relative p-8 mt-10 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] flex flex-col bg-[#FAFAFA] text-left`}
            >
              {/* Overlapping top-left icon */}
              <div className="absolute -top-10 -left-10 z-10">
                {feedback.isSuccess ? (
                  <div className="w-16 h-16 bg-[#10B981] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
                    <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-[#E11D48] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
                    <XCircle className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>

              {feedback.scoreBadge && (
                <div className="absolute top-0 right-0 -mt-8 -mr-4 z-20">
                  {feedback.scoreBadge}
                </div>
              )}

              {feedback.penalty && (
                <div className="absolute top-0 right-0 -mt-8 -mr-4 z-20">
                  <div className="bg-[#0F172A] text-white px-3 py-1 font-mono font-bold text-lg border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#E11D48] rotate-2">
                    -{feedback.penalty} PTS
                  </div>
                </div>
              )}

              <div className="pl-6 pt-2">
                <h3 className="font-heading font-black text-3xl md:text-5xl text-[#0F172A] uppercase tracking-wider">
                  {feedback.title}
                </h3>
                <div className={`w-16 h-2 mt-3 ${feedback.isSuccess ? "bg-[#10B981]" : "bg-[#E11D48]"}`}></div>
              </div>

              <div className="px-6 pb-2 mt-2">
                <div className="border-[3px] border-[#0F172A] p-6 bg-white shadow-[6px_6px_0px_0px_#E2E8F0]">
                  <p className="text-xl md:text-2xl font-bold font-sans text-[#0F172A] leading-relaxed text-left">
                    {feedback.message}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-4 pt-4 flex gap-4">
                <BrutalButton
                  onClick={handleNextAction}
                  variant="dark"
                  size="lg"
                  className="w-full h-16 md:h-20 text-xl md:text-2xl group"
                >
                  {currentRoundIndex < sessionRounds.length - 1 ? (feedback.isSuccess ? "Proceed to Next Video" : "Retry with New Video") : "Finish Case 003"}
                  <ArrowRight className="ml-4 w-8 h-8 transition-transform group-hover:translate-x-2" strokeWidth={3} />
                </BrutalButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <VerdictModalContainer isOpen={showTimeoutModal}>
        {feedback && (
          <VerdictFeedback
            isSuccess={feedback.isSuccess}
            title={feedback.title}
            message={feedback.message}
            onNext={handleNextAction}
            onRetry={handleNextAction}
            nextButtonText={currentRoundIndex < sessionRounds.length - 1 ? "Proceed to Next Video" : "Finish Case 003"}
            retryButtonText={currentRoundIndex < sessionRounds.length - 1 ? "Proceed to Next Video" : "Finish Case 003"}
            forceNextAction={true}
            scoreBadge={
              <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
                -50 Points
              </span>
            }
          />
        )}
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
