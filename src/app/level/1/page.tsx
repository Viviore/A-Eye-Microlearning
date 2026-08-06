"use client";

import { useState, useEffect, useRef } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Flag, FileText, CheckCircle2, XCircle, User, ShieldAlert, ArrowRight, RotateCcw, Trophy, FileCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import case001Data from "@/data/case001.json";

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
  const completeLevel = useGameStore((state) => state.completeLevel);
  const cumulativeScore = useGameStore((state) => state.cumulativeScore);
  const addCumulativeScore = useGameStore((state) => state.addCumulativeScore);
  const resetGame = useGameStore((state) => state.resetGame);
  const playedCase001Rounds = useGameStore((state) => state.playedCase001Rounds);
  const markCase001RoundPlayed = useGameStore((state) => state.markCase001RoundPlayed);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [roundScore, setRoundScore] = useState<number>(100);
  
  const [sessionRounds, setSessionRounds] = useState<TextRound[]>([]);

  useEffect(() => {
    // Prevent reappearance of rounds played in previous sessions
    const allPlayable = TEXT_ROUNDS.filter(r => r.id !== 0);
    let unplayed = allPlayable.filter(r => !playedCase001Rounds.includes(r.id));
    
    // If there aren't enough unplayed rounds, reset the pool and use all available
    if (unplayed.length < 5) {
      unplayed = allPlayable;
    }
    
    const shuffled = [...unplayed].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    // Always start with tutorial
    const tutorial = TEXT_ROUNDS.find(r => r.id === 0);
    if (tutorial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionRounds([tutorial, ...selected]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRound = sessionRounds[currentRoundIndex] || TEXT_ROUNDS[currentRoundIndex];
  
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [foundClues, setFoundClues] = useState<TextSegment[]>([]);
  const [foundDecoys, setFoundDecoys] = useState<TextSegment[]>([]);
  
  const [sourceCheckOpen, setSourceCheckOpen] = useState(false);
  
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [scoreChange, setScoreChange] = useState(0);
  
  const triggerScoreAnimation = (amount: number) => {
    setShowScoreAnimation(false);
    setTimeout(() => {
      setScoreChange(amount);
      setShowScoreAnimation(true);
    }, 50);
    setTimeout(() => setShowScoreAnimation(false), 2000);
  };
  
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string } | null>(null);
  
  const [tutorialStep, setTutorialStep] = useState(1);
  const driverObjRef = useRef<any>(null);

  useEffect(() => {
    if (currentRoundIndex === 0) {
      const d = driver({
        showProgress: true,
        allowClose: false,
        steps: [
          { popover: { title: 'A-Eye Agent', description: "Welcome recruit! I'm your A-Eye Agent. Your job is to review suspicious social media posts." } },
          { element: '#tutorial-post', popover: { title: 'A-Eye Agent', description: "Read the post on the left. It looks suspicious, but we shouldn't jump to conclusions.", side: "bottom" } },
          { element: '#btn-source-check', popover: { title: 'A-Eye Agent', description: "Always gather facts first! Click 'Open Source Check' on the right to see verified information.", side: "left", showButtons: ['previous'] }, onHighlightStarted: () => setTutorialStep(3) },
          { element: '#tutorial-source', popover: { title: 'A-Eye Agent', description: "Read the verified sources carefully and cross-check them against the claims made in the post.", side: "left" } },
          { element: '#segment-t-2', popover: { title: 'A-Eye Agent', description: "See that highlighted sentence? It contradicts our verified facts! Click it to flag it as a clue.", side: "bottom", showButtons: ['previous'] }, onHighlightStarted: () => setTutorialStep(5) },
          { element: '#tutorial-evidence', popover: { title: 'A-Eye Agent', description: "Great! Your flagged clues appear on the Evidence Board. Try to find the real clues, but watch out for decoys!", side: "left" }, onHighlightStarted: () => setTutorialStep(6) },
          { element: '#tutorial-score', popover: { title: 'A-Eye Agent', description: "Let's talk about Scoring. Each round starts at 100 points, but mistakes will cost you!", side: "bottom" }, onHighlightStarted: () => setTutorialStep(7) },
          { element: '#tutorial-score', popover: { title: 'A-Eye Agent', description: "Flagging a decoy costs -10 points, and filing a wrong verdict costs -25 points. If your total score hits 0, it's Game Over!", side: "bottom" }, onHighlightStarted: () => setTutorialStep(8) },
          { element: '#tutorial-verdict-btn', popover: { title: 'A-Eye Agent', description: "Once you have enough evidence, click 'File Verdict' to submit your report. Good luck!", side: "left", showButtons: ['previous'] }, onHighlightStarted: () => setTutorialStep(9) },
        ]
      });
      driverObjRef.current = d;
      d.drive();

      return () => {
        d.destroy();
      };
    }
  }, [currentRoundIndex]);

  useEffect(() => {
    if (currentRoundIndex === 0 && tutorialStep === 4) {
      setSourceCheckOpen(true);
      setTimeout(() => driverObjRef.current?.moveNext(), 300);
    }
  }, [tutorialStep, currentRoundIndex]);
  
  // Auto-scroll to highlighted elements in tutorial for mobile view
  useEffect(() => {
    if (currentRoundIndex !== 0) return;
    
    let targetId = "";
    switch (tutorialStep) {
      case 2:
      case 5:
        targetId = "tutorial-post";
        break;
      case 3:
      case 4:
        targetId = "tutorial-source";
        break;
      case 8:
      case 9:
        targetId = "tutorial-verdict";
        break;
      default:
        return;
    }
    
    if (targetId && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [tutorialStep, currentRoundIndex]);
  
  const handleFlagSegment = (segment: TextSegment) => {
    if (currentRoundIndex === 0 && tutorialStep < 5) return;
    if (flaggedIds.has(segment.id)) return;
    if (foundClues.length >= currentRound.cluesNeeded) return;
    
    setFlaggedIds((prev) => new Set(prev).add(segment.id));
    
    if (segment.isClue) {
      setFoundClues((prev) => [...prev, segment]);
    } else {
      setFoundDecoys((prev) => [...prev, segment]);
      if (currentRoundIndex !== 0) {
        setRoundScore(prev => prev - 10);
        triggerScoreAnimation(-10);
      }
    }

    if (currentRoundIndex === 0 && tutorialStep === 5) {
      setTutorialStep(6);
      setTimeout(() => driverObjRef.current?.moveNext(), 300);
    }
  };
  
  const handleOpenSourceCheck = () => {
    setSourceCheckOpen(!sourceCheckOpen);
    if (!sourceCheckOpen) {
      if (currentRoundIndex === 0 && tutorialStep === 3) {
        setTutorialStep(4);
        
      }
    }
  };
  
  const canFileVerdict = foundClues.length >= currentRound.cluesNeeded;
  
  const handleSubmitVerdict = () => {
    if (!selectedTactic) return;
    
    const correctTactics = currentRound.segments.filter(s => s.isClue && s.tactic).map(s => s.tactic);
    const isCorrect = correctTactics.includes(selectedTactic);
    
    if (isCorrect) {
      if (currentRoundIndex !== 0) {
        triggerScoreAnimation(roundScore);
      }
      setFeedback({
        isSuccess: true,
        title: currentRoundIndex === 0 ? "TRAINING COMPLETE" : "Verdict Correct!",
        message: currentRoundIndex === 0 
          ? "Excellent work, recruit. You've successfully analyzed your first case. The training wheels are off now. Are you ready for the real assignments?"
          : `Great job! You correctly identified the fake post and the tactic used. (+${roundScore} Points)`
      });
    } else {
      if (currentRoundIndex !== 0) {
        setRoundScore(prev => prev - 25);
        triggerScoreAnimation(-25);
      }
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite how this was faked. Take another look and try again. (-25 Points)"
      });
    }
  };
  
  const handleNextRound = () => {
    const newTotal = currentRoundIndex === 0 ? cumulativeScore : cumulativeScore + roundScore;
    
    if (currentRoundIndex !== 0 && newTotal <= 0) {
      resetGame();
      router.push('/');
      return;
    }

    if (currentRoundIndex !== 0) {
      addCumulativeScore(roundScore);
      markCase001RoundPlayed(currentRound.id);
    }

    if (currentRoundIndex < sessionRounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
      setRoundScore(100);
      setFlaggedIds(new Set());
      setFoundClues([]);
      setFoundDecoys([]);
      setSourceCheckOpen(false);
      setShowVerdictModal(false);
      setSelectedTactic(null);
      setFeedback(null);
    } else {
      completeLevel(1);
      router.push('/level/2');
    }
  };
  
  const handleRetryRound = () => {
    setShowVerdictModal(false);
    setSelectedTactic(null);
    setFeedback(null);
    // Keep the clues but reset verdict!
  };

  return (
    <main 
      className={`min-h-full bg-white text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans ${currentRoundIndex === 0 ? 'pb-72 md:pb-56 lg:pb-48' : 'pb-32'}`}
      style={{
        backgroundImage: "linear-gradient(to right, #0F172A12 1px, transparent 1px), linear-gradient(to bottom, #0F172A12 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }}
    >
      {/* Global Tutorial Backdrop removed so UI is not dimmed */}
      
      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        
        {/* Left Column: Social Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div 
                className="px-3 py-1.5 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FFB800] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#0F172A]" />
                <span>CASE 001 // TEXT FEED</span>
              </div>
              <span 
                className={`px-3 py-1 font-mono text-xs font-bold uppercase border-[4px] shadow-[4px_4px_0px_0px_#0F172A] ${currentRound.badgeColor}`}
              >
                {currentRoundIndex === 0 ? "TUTORIAL" : `ROUND ${currentRoundIndex} / ${sessionRounds.length - 1}`}
              </span>
            </div>
            <div id="tutorial-score" className="font-heading font-black text-xl md:text-2xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-1 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
              <span>Score: </span>
              <span className="relative text-[#FFB800] drop-shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                {currentRoundIndex === 0 ? roundScore : cumulativeScore + roundScore}
                
                <AnimatePresence>
                  {showScoreAnimation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 0, scale: 0.8 }}
                      animate={{ opacity: 1, y: -30, scale: 1.2 }}
                      exit={{ opacity: 0, y: -45, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none font-black whitespace-nowrap ${
                        scoreChange > 0 
                          ? "text-[#FFB800] drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]" 
                          : "text-[#FF3366] drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                      }`}
                    >
                      {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </div>
            
          </div>
          
          {/* Mock Social Post */}
          <div 
            id="tutorial-post"
            className={`p-6 md:p-8 mt-6 bg-white relative transition-all duration-500 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] ${
              currentRoundIndex === 0 && tutorialStep === 2 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-white scale-[1.02]" : "z-10"
            }`}
          >
            <div className="flex items-center gap-4 mb-6 border-b-[4px] border-dashed border-[#0F172A] pb-4">
              <div 
                className="w-14 h-14 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center"
              >
                <User className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-2xl leading-tight text-[#0F172A] tracking-wide">{currentRound.postAuthor}</h4>
                <p className="text-[15px] font-sans font-bold text-[#0F172A]/60">{currentRound.postHandle} • {currentRound.postTime}</p>
              </div>
            </div>
            
            <div className="text-xl md:text-2xl font-sans leading-relaxed text-[#0F172A]">
              {currentRound.segments.map((segment) => {
                const isFlagged = flaggedIds.has(segment.id);
                const showTutorialPulse = currentRoundIndex === 0 && segment.id === "t-2" && flaggedIds.size === 0 && tutorialStep === 5;
                return (
                  <span
                    key={segment.id}
                    id={`segment-${segment.id}`}
                    onClick={() => handleFlagSegment(segment)}
                    className={`cursor-pointer transition-all px-1.5 py-0.5 inline-block mb-2 relative mx-0.5 ${
                      isFlagged 
                        ? (segment.isClue 
                            ? "bg-[#FFB800] border-[3px] border-[#0F172A] font-bold shadow-[2px_2px_0px_0px_#0F172A] rotate-1" 
                              : "text-red-500 line-through decoration-red-500 decoration-2 opacity-80 -rotate-1")
                        : showTutorialPulse
                          ? "bg-[#FFB800]/20 border-b-[3px] border-dashed border-[#FFB800]"
                          : (currentRoundIndex === 0 && tutorialStep < 5)
                            ? ""
                            : "hover:bg-[#FFB800]/50 hover:border-b-[3px] hover:border-dashed hover:border-[#0F172A]"
                    }`}
                    style={isFlagged && segment.isClue ? { borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" } : {}}
                  >
                    {segment.text}
                    {showTutorialPulse && (
                      <motion.span 
                        animate={{ x: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-1/2 -translate-y-1/2 -left-12 text-[#FFB800] pointer-events-none z-10"
                      >
                        <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5,25 Q20,10 35,20" />
                          <polyline points="25,10 35,20 25,30" />
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
                className="mt-6 p-3 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] wobbly-border flex items-start gap-2 text-sm text-[#0F172A] -rotate-1 font-medium"
              >
                <ShieldAlert className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />
                <p><strong>Careful!</strong> You flagged something that looks suspicious but is actually true. That&apos;s a decoy. Focus on the core claims.</p>
              </motion.div>
            )}
          </div>


        </div>
        
        {/* Right Column: Evidence Board & Source Check */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
          
          <div 
            className="bg-[#FFB800] p-5 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] relative"
          >
            <h3 className="font-heading font-bold text-2xl mb-1 flex items-center gap-2 text-[#0F172A] uppercase">
              <Search className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} /> Objective
            </h3>
            <p className="text-[17px] text-[#0F172A] font-bold font-sans leading-relaxed">
              Read the post carefully. Click on any sentence that looks suspicious to flag it as evidence. 
              Find at least <strong className="text-[#0F172A] font-black border-b-[4px] border-[#0F172A]">{currentRound.cluesNeeded} real {currentRound.cluesNeeded === 1 ? 'clue' : 'clues'}</strong> to proceed.
            </p>
          </div>

          <div 
            id="tutorial-evidence"
            className="p-6 bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-black font-heading uppercase tracking-wide flex items-center gap-2 text-[#0F172A]">
                <Flag className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} /> Evidence
              </h2>
              <span 
                className="font-mono text-sm font-bold bg-[#FFB800] border-[4px] border-[#0F172A] text-[#0F172A] px-3 py-1 shadow-[4px_4px_0px_0px_#0F172A]"
              >
                {foundClues.length} / {currentRound.cluesNeeded}
              </span>
            </div>
            
            <div className={`min-h-[150px] border-[4px] border-dashed border-[#0F172A] p-4 space-y-3 bg-[linear-gradient(45deg,#0F172A11_25%,transparent_25%,transparent_50%,#0F172A11_50%,#0F172A11_75%,transparent_75%,transparent)] bg-[length:16px_16px] transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 6 ? "z-40 bg-white ring-4 ring-[#FFB800] ring-offset-4 ring-offset-white scale-[1.02]" : "z-10"
            }`}
            >
              {foundClues.length === 0 ? (
                <p className="text-center text-[#0F172A]/40 font-mono text-sm absolute inset-0 flex items-center justify-center">
                  [ No clues flagged yet ]
                </p>
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
            </div>
            
            <div 
              id="tutorial-source"
              className={`mt-6 space-y-4 transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 3 ? "z-40" : "z-10"
            }`}
            >
              <Button
                id="btn-source-check"
                onClick={handleOpenSourceCheck}
                disabled={currentRoundIndex === 0 && tutorialStep < 3}
                className={`w-full h-14 font-heading text-xl tracking-wide uppercase border-[4px] border-[#0F172A] font-bold shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:border-dashed ${
                  sourceCheckOpen ? "bg-[#FFB800] text-[#0F172A] hover:bg-[#FFB800]/90" : "bg-white text-[#0F172A] hover:bg-gray-50"
                } ${
                  currentRoundIndex === 0 && tutorialStep === 3 ? "z-10 ring-4 ring-[#FFB800] ring-offset-2 ring-offset-white scale-[1.02]" : ""
                }`}
              >
                <Search className="mr-2 w-5 h-5" strokeWidth={2.5} /> 
                {sourceCheckOpen ? "Close Source Check" : "Open Source Check"}
              </Button>
              
              <AnimatePresence>
                {sourceCheckOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={currentRoundIndex === 0 && tutorialStep === 4 ? "overflow-visible" : "overflow-hidden"}
                  >
                    <div 
                      className={`p-5 bg-white border-[4px] border-[#0F172A] mt-2 font-sans text-lg text-[#0F172A] transition-all duration-500 relative ${
                        currentRoundIndex === 0 && tutorialStep === 4 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-white scale-[1.02]" : "z-10"
                      }`}
                    >
                      <div className="space-y-3 font-sans">
                        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
                        {currentRound.verifiedSources && currentRound.verifiedSources.map((source: VerifiedSource, i: number) => (
                          <p key={i} className="text-[#0F172A]"><strong>{source.name}:</strong> {source.text}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div 
              id="tutorial-verdict"
              className={`mt-6 pt-6 border-t-[4px] border-dashed border-[#0F172A] transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 9 ? "z-40" : "z-10"
            }`}>
              <Button
                id="tutorial-verdict-btn"
                onClick={() => {
                  setShowVerdictModal(true);
                  if (currentRoundIndex === 0 && tutorialStep >= 9 && tutorialStep <= 11) {
                    setTutorialStep(10);
                    // No cooldown
                  }
                }}
                disabled={!canFileVerdict}
                className={`w-full h-16 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-[#0F172A] font-heading uppercase tracking-widest border-[4px] border-[#0F172A] font-bold text-2xl shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all ${
                  currentRoundIndex === 0 && tutorialStep === 9 ? "z-10 ring-4 ring-[#FFB800] ring-offset-2 ring-offset-white scale-[1.02]" : ""
                }`}
              >
                {canFileVerdict ? <><FileCheck className="mr-3 w-6 h-6 inline" strokeWidth={2.5} /> File Verdict</> : "Gather Evidence First"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Verdict Modal */}
      <AnimatePresence>
        {showVerdictModal && (
          <div className={`fixed inset-0 z-50 flex justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm ${currentRoundIndex === 0 ? "items-start pt-4 md:pt-12" : "items-center"}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`p-5 md:p-6 w-full max-w-2xl overflow-y-auto overflow-x-hidden bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative ${
                currentRoundIndex === 0 ? "max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-280px)]" : "max-h-[90vh]"
              }`}
            >
              {!feedback ? (
                <>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" />
                  </div>
                  
                  <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-3 uppercase tracking-wider text-center">
                    Final Verdict Form
                  </h2>
                  
                  <div className="space-y-4 font-sans">
                    <div className="pt-2">
                      <h3 className="font-bold text-xl mb-3 font-heading">How Was This Faked?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentRound.tacticOptions.map(tactic => {
                          const correctTactics = currentRound.segments.filter(s => s.isClue && s.tactic).map(s => s.tactic);
                          const isTutorialWrongTactic = currentRoundIndex === 0 && !correctTactics.includes(tactic);
                          
                          return (
                            <button
                              key={tactic}
                              disabled={isTutorialWrongTactic}
                              onClick={() => {
                                setSelectedTactic(tactic);
                                if (currentRoundIndex === 0 && tutorialStep === 10) {
                                  setTutorialStep(11);
                                  // No cooldown
                                }
                              }}
                              onMouseEnter={() => setHoveredTactic(tactic)}
                              onMouseLeave={() => setHoveredTactic(null)}
                              className={`p-3 border-[4px] font-bold font-sans transition-all text-[#0F172A] ${
                                isTutorialWrongTactic ? "opacity-40 cursor-not-allowed bg-white border-dashed border-[#0F172A]/30" : "cursor-pointer"
                              } ${
                                currentRoundIndex === 0 && tutorialStep === 10 && !selectedTactic && !isTutorialWrongTactic ? "z-10 ring-4 ring-[#FFB800] ring-offset-2 ring-offset-[#FAFAFA] scale-[1.02]" : ""
                              } ${
                                selectedTactic === tactic
                                  ? "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]"
                                  : !isTutorialWrongTactic ? "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]" : ""
                              }`}
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
                      <Button
                        onClick={() => setShowVerdictModal(false)}
                        className="flex-1 h-12 bg-white text-[#0F172A] border-[4px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] hover:bg-gray-100 transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitVerdict}
                        disabled={!selectedTactic}
                        className={`flex-1 h-12 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-[#0F172A] border-[4px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${
                          currentRoundIndex === 0 && tutorialStep === 11 ? "z-10 ring-4 ring-[#FFB800] ring-offset-2 ring-offset-white scale-[1.02]" : ""
                        }`}
                      >
                        Submit Report
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="flex justify-center">
                    {feedback.isSuccess ? (
                      <div 
                        className="w-24 h-24 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A]"
                      >
                        <CheckCircle2 className="w-12 h-12 text-[#0F172A]" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div 
                        className="w-24 h-24 bg-white border-[4px] border-[#FFB800] flex items-center justify-center shadow-[6px_6px_0px_0px_#FFB800]"
                      >
                        <XCircle className="w-12 h-12 text-[#FFB800]" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  
                  <h2 className={`text-5xl font-black font-heading ${feedback.isSuccess ? 'text-[#0F172A]' : 'text-[#FFB800]'}`}>
                    {feedback.title}
                  </h2>
                  <p className="text-xl font-sans font-bold text-[#0F172A]/80 max-w-md mx-auto">
                    {feedback.message}
                  </p>
                  
                  <div className="pt-8">
                    {feedback.isSuccess ? (
                      <Button
                        onClick={handleNextRound}
                        className={`w-full h-16 text-white text-2xl font-heading uppercase tracking-widest border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all ${
                          currentRoundIndex === 0 ? "bg-[#10B981] hover:bg-[#10B981]/90" : "bg-[#FFB800] hover:bg-[#FFB800]/90 text-[#0F172A]"
                        }`}
                      >
                        {currentRoundIndex < sessionRounds.length - 1 ? (
                          <span className="flex items-center justify-center">{currentRoundIndex === 0 ? "Start Real Cases" : "Next Round"} <ArrowRight className="ml-3 w-7 h-7" strokeWidth={2.5} /></span>
                        ) : (
                          <span className="flex items-center justify-center">Complete Case 001 <Trophy className="ml-3 w-7 h-7" strokeWidth={2.5} /></span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleRetryRound}
                        className="w-full h-16 bg-white text-[#0F172A] text-2xl font-heading uppercase tracking-widest border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] hover:bg-gray-100 active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
                      >
                        <RotateCcw className="mr-3 w-7 h-7" strokeWidth={2.5} /> Retry Verdict
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </main>
  );
}
