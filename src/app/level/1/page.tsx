"use client";

import { useState, useEffect, useRef } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Flag, FileText, CheckCircle2, XCircle, User, ShieldAlert, ArrowRight, RotateCcw, Trophy, FileCheck, MessageCircle, Repeat2, Heart, Eye, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppTransition } from "@/components/layout/TransitionProvider";
import case001Data from "@/data/case001.json";
import { CaseHeader } from "@/components/game/CaseHeader";
import { PostAuthorHeader } from "@/components/game/PostAuthorHeader";
import { SocialEngagementFooter } from "@/components/game/SocialEngagementFooter";
import { ObjectivePanel } from "@/components/game/ObjectivePanel";
import { EvidenceBoard } from "@/components/game/EvidenceBoard";
import { VerifiedSourcesModal } from "@/components/game/VerifiedSourcesModal";
import { VerdictModalContainer, VerdictFeedback, GameOverModal } from "@/components/game/VerdictModal";
import { MockBrowserWindow } from "@/components/game/MockBrowserWindow";
import { useLevelScoring } from "@/hooks/useLevelScoring";

export type TextSegment = {
  id: string;
  text: string;
  isClue?: boolean;
  isDecoy?: boolean;
  explanation?: string;
  tactic?: string;
};

export type VerifiedSource = {
  name: string;
  text: string;
};

export type TextRound = {
  id: number;
  difficulty: "Tutorial" | "Easy" | "Medium" | "Hard";
  badgeColor: string;
  title: string;
  postAuthor: string;
  postHandle: string;
  postTime: string;
  segments: TextSegment[];
  verifiedSources: VerifiedSource[];
  correctVerdict: "Real" | "Fake";
  cluesNeeded: number;
  tacticOptions: string[];
};

const TEXT_ROUNDS: TextRound[] = case001Data.TEXT_ROUNDS as TextRound[];
const TACTIC_DESCRIPTIONS: Record<string, string> = case001Data.TACTIC_DESCRIPTIONS as Record<string, string>;

export default function Level1Page() {
  const router = useRouter();
  const { startTransition, isTransitioning } = useAppTransition();
  const completeLevel = useGameStore((state) => state.completeLevel);
  const cumulativeScore = useGameStore((state) => state.cumulativeScore);
  const addCumulativeScore = useGameStore((state) => state.addCumulativeScore);
  const addCase001Score = useGameStore((state) => state.addCase001Score);
  const resetGame = useGameStore((state) => state.resetGame);
  const playedCase001Rounds = useGameStore((state) => state.playedCase001Rounds);
  const markCase001RoundPlayed = useGameStore((state) => state.markCase001RoundPlayed);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  
  const [sessionRounds, setSessionRounds] = useState<TextRound[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prevent reappearance of rounds played in previous sessions
    const allPlayable = TEXT_ROUNDS.filter(r => r.id !== 0);
    let unplayed = allPlayable.filter(r => !playedCase001Rounds.includes(r.id));
    
    // If there aren't enough unplayed rounds, reset the pool and use all available
    if (unplayed.length < 5) {
      unplayed = allPlayable;
    }
    
    const shuffled = [...unplayed].sort(() => 0.5 - Math.random());
    const tutorial = TEXT_ROUNDS.find(r => r.id === 0);
    const selected = shuffled.slice(0, 5);
    
    // Always start with tutorial
    if (tutorial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionRounds([tutorial, ...selected]);
    } else {
      setSessionRounds(selected);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playedCase001Rounds]);

  const currentRound = sessionRounds[currentRoundIndex];
  
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [foundClues, setFoundClues] = useState<TextSegment[]>([]);
  const [foundDecoys, setFoundDecoys] = useState<TextSegment[]>([]);
  
  const [sourceCheckOpen, setSourceCheckOpen] = useState(false);
  
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: React.ReactNode; scoreBadge?: React.ReactNode } | null>(null);

  const [shuffledTacticOptions, setShuffledTacticOptions] = useState<string[]>(currentRound?.tacticOptions || []);
  
  useEffect(() => {
    if (!currentRound) return;
    setShuffledTacticOptions(prev => {
      const arr = [...currentRound.tacticOptions];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoundIndex]);

  const [isTourActive, setIsTourActive] = useState(true);
  
  const {
    roundScore,
    setRoundScore,
    scorePopups,
    clickPopups,
    triggerScoreAnimation,
    applyDeduction,
    resetScoring,
  } = useLevelScoring({
    isReady,
    isPaused: showVerdictModal || isTourActive,
  });
  
  const driverObjRef = useRef<any>(null);

  const isDriverInitialized = useRef(false);

  useEffect(() => {
    if (currentRoundIndex === 0 && !isDriverInitialized.current && isReady && !isTransitioning) {
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
              setFlaggedIds(new Set());
              setFoundClues([]);
              setFoundDecoys([]);
              setSourceCheckOpen(false);
              setFeedback(null);
            });
            navBtns.insertBefore(skipBtn, navBtns.firstChild);
          }
        },
        onDestroyed: () => {
          setIsTourActive(false);
          setSourceCheckOpen(false);
        },
        steps: [
          { popover: { title: 'A-Eye Agent', description: "Welcome recruit! I'm your A-Eye Agent. Your job is to review suspicious social media posts." } },
          { element: '#tutorial-post', popover: { title: 'A-Eye Agent', description: "Read the post on the left. It looks suspicious, but we shouldn't jump to conclusions.", side: "bottom" } },
          { element: '#btn-source-check', popover: { title: 'A-Eye Agent', description: "Always gather facts first! We'll click 'Open Source Check' to see verified information.", side: "left" } },
          { element: '#tutorial-source', popover: { title: 'A-Eye Agent', description: "Read the verified sources carefully and cross-check them against the claims made in the post.", side: "left" }, onHighlightStarted: (element) => { setSourceCheckOpen(true); element?.scrollIntoView({ behavior: "smooth", block: "center" }); } },
          { element: '#segment-t-2', popover: { title: 'A-Eye Agent', description: "Look at the highlighted sentence. It contradicts our verified facts! You'll need to flag such clues.", side: "bottom" } },
          { element: '#tutorial-evidence', popover: { title: 'A-Eye Agent', description: "Flagged clues appear on the Evidence Board. Watch out for decoys!", side: "left" } },
          { element: '#tutorial-score', popover: { title: 'A-Eye Agent', description: "Each round starts at 100 points. Flagging a decoy costs -10 points, and filing a wrong verdict costs -25 points.", side: "bottom" } },
          { element: '#tutorial-verdict-btn', popover: { title: 'A-Eye Agent', description: "Once you have enough evidence, click 'File Verdict' to submit your report.", side: "left" } },
          { popover: { title: 'A-Eye Agent', description: "Now you do it yourself! Find the evidence, identify the tactic, and submit your verdict. Good luck!", doneBtnText: "Start Playing" } }
        ]
      });
      driverObjRef.current = d;
      d.drive();
    }

    return () => {
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
      }
    };
  }, [currentRoundIndex, isReady, isTransitioning]);

  useEffect(() => {
    if (currentRoundIndex === 0 && !isTourActive && flaggedIds.size === 0 && !showVerdictModal) {
      const timeout = setTimeout(() => {
        const el = document.getElementById("segment-t-2");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isTourActive, currentRoundIndex, flaggedIds.size, showVerdictModal]);

  // Check Game Over condition immediately
  useEffect(() => {
    if (currentRoundIndex !== 0 && cumulativeScore + roundScore <= 0) {
      setShowGameOverModal(true);
    }
  }, [roundScore, cumulativeScore, currentRoundIndex]);
  
  if (!isReady || !currentRound) return null;
  
  const handleFlagSegment = (segment: TextSegment, e: React.MouseEvent) => {
    if (currentRoundIndex === 0 && isTourActive) return;
    if (flaggedIds.has(segment.id)) return;
    if (foundClues.length >= currentRound.cluesNeeded) return;
    
    setFlaggedIds((prev) => new Set(prev).add(segment.id));
    
    if (segment.isClue) {
      setFoundClues((prev) => [...prev, segment]);
    } else {
      setFoundDecoys((prev) => [...prev, segment]);
      if (currentRound.difficulty !== "Tutorial") {
        applyDeduction(10, e.clientX, e.clientY);
      }
    }
  };
  
  const handleOpenSourceCheck = () => {
    setSourceCheckOpen(!sourceCheckOpen);
  };
  
  const canFileVerdict = foundClues.length >= currentRound.cluesNeeded;
  
  const handleSubmitVerdict = () => {
    if (!selectedTactic) return;
    
    const correctTactics = currentRound.segments.filter(s => s.isClue && s.tactic).map(s => s.tactic);
    const isCorrect = correctTactics.includes(selectedTactic);
    
    if (isCorrect) {
      if (currentRound.difficulty !== "Tutorial") {
        triggerScoreAnimation(roundScore);
      }
      setFeedback({
        isSuccess: true,
        title: currentRoundIndex === 0 ? "TRAINING COMPLETE" : "VERDICT CORRECT!",
        message: currentRoundIndex === 0 
          ? "Great job! You identified all the clues and successfully filed your report."
          : "Great job! You correctly identified the fake post and the tactic used.",
        scoreBadge: currentRoundIndex !== 0 ? (
          <span className="inline-block bg-[#10B981] text-white border-[3px] border-[#0F172A] px-3 py-1 font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            +{roundScore} Points
          </span>
        ) : undefined
      });
    } else {
      if (currentRound.difficulty !== "Tutorial") {
        applyDeduction(25);
      }
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite how this was faked. Take another look and try again.",
        scoreBadge: (
          <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            -25 Points
          </span>
        )
      });
    }
  };
  
  const handleNextRound = () => {
    const newTotal = currentRoundIndex === 0 ? cumulativeScore : cumulativeScore + roundScore;
    
    if (currentRoundIndex !== 0) {
      addCumulativeScore(roundScore);
      addCase001Score(roundScore);
      markCase001RoundPlayed(currentRound.id);
    }

    if (currentRoundIndex < sessionRounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
      resetScoring();
      setFlaggedIds(new Set());
      setFoundClues([]);
      setFoundDecoys([]);
      setSourceCheckOpen(false);
      setShowVerdictModal(false);
      setSelectedTactic(null);
      setFeedback(null);
    } else {
      completeLevel(1);
      startTransition('/level/2', { variant: 'next-case' });
    }
  };
  
  const handleRetryRound = () => {
    setShowVerdictModal(false);
    setSelectedTactic(null);
    setFeedback(null);
    setShuffledTacticOptions(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    // Keep the clues but reset verdict!
  };

  return (
    <main 
      className={`min-h-[100dvh] bg-[#FAFAFA] bg-cubes text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans ${currentRoundIndex === 0 ? 'pb-72 md:pb-56 lg:pb-48' : 'pb-32'}`}
    >
      {/* Global Tutorial Backdrop removed so UI is not dimmed */}
      
      <div className="w-full max-w-[1200px] z-10 flex flex-col gap-8 pb-20">
        
        {/* Header Info */}
        <CaseHeader 
          caseNumber="CASE 001"
          caseTitle="TEXT FEED"
          isTutorial={currentRoundIndex === 0}
          currentRoundNumber={currentRoundIndex}
          totalRounds={sessionRounds.length - 1}
          score={currentRoundIndex === 0 ? roundScore : cumulativeScore + roundScore}
          scorePopups={scorePopups}
          icon="fileText"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Social Feed */}
          <div className="lg:col-span-7 flex flex-col h-full">
            
            {/* Mock Social Post */}
            <MockBrowserWindow id="tutorial-post">
                <PostAuthorHeader 
                  authorName={currentRound.postAuthor}
                  handle={currentRound.postHandle}
                  time={currentRound.postTime}
                />
                
                <div className="text-xl md:text-[22px] font-sans font-bold leading-[2.2] text-[#0F172A]">
              {currentRound.segments.map((segment) => {
                const isFlagged = flaggedIds.has(segment.id);
                const showTutorialPulse = currentRoundIndex === 0 && segment.id === "t-2" && flaggedIds.size === 0 && !isTourActive;
                return (
                  <span
                    key={segment.id}
                    id={`segment-${segment.id}`}
                    onClick={(e) => handleFlagSegment(segment, e)}
                    className={`cursor-pointer transition-all px-1 py-0.5 inline box-decoration-clone rounded-sm leading-relaxed ${
                      isFlagged 
                        ? (segment.isClue 
                            ? "bg-[#FFB800] border-[3px] border-[#0F172A] font-black shadow-[4px_4px_0px_0px_#0F172A]" 
                              : "text-[#FF3366] font-bold line-through decoration-[#FF3366] decoration-[3px] bg-transparent")
                        : showTutorialPulse
                          ? "bg-[#FFB800]/30 border-b-[4px] border-dashed border-[#FFB800]"
                          : "hover:bg-[#FFB800]/40 hover:border-b-[4px] hover:border-solid hover:border-[#0F172A] hover:shadow-[2px_2px_0px_0px_#0F172A]"
                    }`}
                  >
                    {segment.text}
                    {showTutorialPulse && (
                      <motion.span 
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-1/2 -translate-y-1/2 -left-16 pointer-events-none z-10 drop-shadow-md"
                      >
                        <svg viewBox="0 0 100 100" className="w-12 h-12 overflow-visible">
                          <polygon points="14,44 54,44 54,24 94,54 54,84 54,64 14,64" fill="#0F172A" />
                          <polygon points="10,40 50,40 50,20 90,50 50,80 50,60 10,60" fill="#FFB800" stroke="#0F172A" strokeWidth="6" strokeLinejoin="miter" />
                        </svg>
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </div>
            
            {/* Decoy Warning */}
            {foundDecoys.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 mx-6 md:mx-8 mb-6 md:mb-8 p-4 bg-[#FF3366] border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] flex items-start gap-3 text-white font-bold font-sans relative z-10"
              >
                <ShieldAlert className="w-6 h-6 text-white shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm md:text-base"><strong className="font-heading uppercase tracking-widest text-lg block mb-1">Careful!</strong> You flagged something that looks suspicious but is actually true. That&apos;s a decoy. Focus on the core claims.</p>
              </motion.div>
            )}
            
            {/* Social Engagement Footer */}
            <SocialEngagementFooter seed={currentRound.id} />
            
            </MockBrowserWindow>
          </div>
          
        {/* Right Column: Evidence Board & Source Check */}
        <div className={`lg:col-span-5 flex flex-col gap-6 h-full ${currentRoundIndex === 0 ? "" : "sticky top-28"}`}>
          
          <ObjectivePanel>
            Read the post carefully. Click on any sentence that looks suspicious to flag it as evidence. 
            Find at least <span className="bg-white px-2 py-0.5 border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] ml-1"><strong className="text-[#FF3366] font-black uppercase tracking-wider">{currentRound.cluesNeeded} real {currentRound.cluesNeeded === 1 ? 'clue' : 'clues'}</strong></span> to proceed.
          </ObjectivePanel>

          <EvidenceBoard
            flaggedCount={foundClues.length}
            requiredCount={currentRound.cluesNeeded}
            toolsSlot={
              <>
                <BrutalButton
                  id="btn-source-check"
                  onClick={handleOpenSourceCheck}
                  disabled={currentRoundIndex === 0 && isTourActive}
                  variant={sourceCheckOpen ? "primary" : "secondary"}
                  className={`w-full ${sourceCheckOpen ? "bg-[#FF3366] text-white hover:bg-[#FF3366]/90" : "bg-[#0F172A] text-white hover:bg-[#FFB800] hover:text-[#0F172A]"}`}
                >
                  <Search className="mr-3 w-6 h-6" strokeWidth={3} />
                  {sourceCheckOpen ? "CLOSE SOURCE CHECK" : "OPEN SOURCE CHECK"}
                </BrutalButton>
                
                <BrutalButton
                  id="tutorial-verdict-btn"
                  onClick={() => {
                    setShowVerdictModal(true);
                  }}
                  disabled={!canFileVerdict}
                  variant="blue"
                  size="lg"
                  className="w-full flex items-center justify-center"
                >
                  {canFileVerdict ? <><CheckCircle2 className="mr-3 w-7 h-7 inline" strokeWidth={3} /> File Verdict</> : "Gather Evidence First"}
                </BrutalButton>
              </>
            }
          >
            {foundClues.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0F172A]/30 mt-16">
                <Flag className="w-10 h-10 mb-2 opacity-50" strokeWidth={2} />
                <p className="font-heading font-bold text-lg uppercase tracking-widest text-center">
                  [ No clues flagged yet ]
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {foundClues.map((clue, idx) => (
                  <motion.div
                    key={clue.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#FFB800] p-3 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative"
                  >
                    <p className="text-xs font-bold font-mono text-[#0F172A]/70 mb-1 uppercase tracking-widest">Found Clue:</p>
                    <p className="text-lg font-sans font-bold leading-snug text-[#0F172A]">&quot;{clue.text.substring(0, 50)}...&quot;</p>
                    {clue.explanation && (
                      <p className="text-[15px] text-[#1D2A3C] font-sans font-bold mt-2 pt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                        {clue.explanation}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </EvidenceBoard>

          <VerifiedSourcesModal
            isOpen={sourceCheckOpen}
            onClose={() => setSourceCheckOpen(false)}
            sources={currentRound.verifiedSources}
          />
        </div>
      </div>
    </div>
      
      {/* Verdict Modal */}
      <VerdictModalContainer
        isOpen={showVerdictModal}
        alignTop={currentRoundIndex === 0}
      >
        {!feedback ? (
          <>
            <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-3 uppercase tracking-wider text-center">
              Final Verdict Form
            </h2>
            
            <div className="space-y-4 font-sans">
              <div className="pt-2">
                <h3 className="font-bold text-xl mb-3 font-heading">How Was This Faked?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shuffledTacticOptions.map(tactic => {
                    const correctTactics = currentRound.segments.filter(s => s.isClue && s.tactic).map(s => s.tactic);
                    const isCorrect = correctTactics.includes(tactic);
                    const isTutorial = currentRound.difficulty === "Tutorial" && !isTourActive;
                    const isDisabled = isTutorial && !isCorrect;

                    let buttonClass = `p-3 border-[4px] font-bold font-sans transition-all text-[#0F172A] cursor-pointer `;
                    
                    if (isDisabled) {
                      buttonClass += "bg-white/50 border-dashed border-[#0F172A]/20 opacity-40 cursor-not-allowed ";
                    } else if (selectedTactic === tactic) {
                      buttonClass += "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] ";
                    } else if (isTutorial && isCorrect) {
                      buttonClass += "bg-[#FFB800]/30 border-[#0F172A] border-solid shadow-[4px_4px_0px_0px_#0F172A] animate-pulse hover:bg-[#FFB800]/50 ";
                    } else {
                      buttonClass += "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)] ";
                    }

                    return (
                      <button
                        key={tactic}
                        onClick={() => !isDisabled && setSelectedTactic(tactic)}
                        onMouseEnter={() => !isDisabled && setHoveredTactic(tactic)}
                        onMouseLeave={() => !isDisabled && setHoveredTactic(null)}
                        disabled={isDisabled}
                        className={buttonClass}
                      >
                        {tactic}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 h-12 flex items-center justify-center p-2 bg-[#0F172A]/5 border-[2px] border-dashed border-[#0F172A]/20 rounded-sm italic text-sm text-[#0F172A]/80 text-center transition-all">
                  {hoveredTactic 
                    ? TACTIC_DESCRIPTIONS[hoveredTactic] 
                    : "Hover over a tactic to see its definition."}
                </div>
              </div>
              
              {/* Submit */}
              <div className="flex gap-4 pt-4 mt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                <BrutalButton
                  onClick={() => setShowVerdictModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </BrutalButton>
                <BrutalButton
                  onClick={handleSubmitVerdict}
                  disabled={!selectedTactic}
                  variant="primary"
                  className="flex-1 disabled:bg-[#1D2A3C] disabled:text-white/70"
                >
                  Submit Report
                </BrutalButton>
              </div>
            </div>
          </>
        ) : (
          <VerdictFeedback
            isSuccess={feedback.isSuccess}
            title={feedback.title}
            message={feedback.message}
            scoreBadge={feedback.scoreBadge}
            onNext={handleNextRound}
            onRetry={handleRetryRound}
            nextButtonText={currentRoundIndex === 0 ? "Start Real Cases" : "Next Round"}
            isFinalRound={currentRoundIndex === sessionRounds.length - 1}
          />
        )}
      </VerdictModalContainer>

      {/* Click Animations */}
      <AnimatePresence>
        {clickPopups.map((popup) => (
          <div key={popup.id} className="fixed z-[150] pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: popup.x, top: popup.y }}>
            <motion.div
              initial={{ opacity: 1, y: -20, scale: 0.8 }}
              animate={{ opacity: 0, y: -80, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-red-500 font-black font-heading text-4xl whitespace-nowrap drop-shadow-[2px_2px_0_rgba(15,23,42,1)]"
            >
              -{popup.amount}
            </motion.div>
          </div>
        ))}
      </AnimatePresence>

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
