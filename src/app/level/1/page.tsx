"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { InvestigationImage, ArtifactHotspot } from "@/components/game/InvestigationImage";
import { FeedbackDialog } from "@/components/game/FeedbackDialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Terminal, ShieldAlert, CheckCircle2, XCircle, Info, Timer } from "lucide-react";
import Link from "next/link";

const LEVEL_1_HOTSPOTS: ArtifactHotspot[] = [
  {
    id: "extra_finger",
    x: 51,
    y: 70,
    width: 20,
    height: 20,
    title: "Anatomical Glitch: Extra Fingers",
    description: "Generative AI models frequently struggle with hands. You've identified a classic artifact: an impossible number of fingers wrapped around the coffee cup.",
  },
  {
    id: "fused_hair",
    x: 31,
    y: 27,
    width: 20,
    height: 20,
    title: "Texture Blending",
    description: "Notice how the hair physically blends into the background or clothing. AI often struggles to cleanly separate overlapping textures.",
  },
];

export default function Level1Page() {
  // Global state
  const foundArtifacts = useGameStore((state) => state.level1FoundArtifacts);
  const addFoundArtifact = useGameStore((state) => state.addLevel1Artifact);
  const setVerdict = useGameStore((state) => state.setLevel1Verdict);
  const setConfidence = useGameStore((state) => state.setLevel1Confidence);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const resetLevel1 = useGameStore((state) => state.resetLevel1);
  
  // Local state
  const [activeDialog, setActiveDialog] = useState<ArtifactHotspot | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([50]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const handleRetry = () => {
    resetLevel1();
    setShowResults(false);
    setTimeLeft(45);
    setIsTimeUp(false);
    setActiveDialog(null);
    setSelectedVerdict(null);
    setConfidenceScore([50]);
  };

  // Timer Logic
  useEffect(() => {
    if (showResults || isSubmitting || activeDialog) return;
    
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
      // Auto-fail logic
      setTimeout(() => {
        setIsSubmitting(true);
        setSelectedVerdict("Time Expired");
        setConfidenceScore([0]);
        setVerdict("Time Expired");
        setConfidence(0);
        completeLevel(1);
        
        setTimeout(() => {
          setIsSubmitting(false);
          setShowResults(true);
        }, 2000);
      }, 1500);
    }
  }, [timeLeft, showResults, isSubmitting, activeDialog, isTimeUp, setVerdict, setConfidence, completeLevel]);

  const handleArtifactFound = (artifact: ArtifactHotspot) => {
    addFoundArtifact(artifact.id);
    setActiveDialog(artifact);
  };

  const allFound = foundArtifacts.length === LEVEL_1_HOTSPOTS.length;

  const handleSubmit = () => {
    if (!selectedVerdict) return;
    
    setIsSubmitting(true);
    setVerdict(selectedVerdict);
    setConfidence(confidenceScore[0]);
    completeLevel(1);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);
    }, 2500);
  };

  if (showResults) {
    const isTimeOut = selectedVerdict === "Time Expired";
    const isCorrect = !isTimeOut && selectedVerdict === "AI Generated";
    
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-6">
            {isTimeOut ? (
              <Timer className="w-12 h-12 text-red-500" />
            ) : isCorrect ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
            <div>
              <h2 className="text-3xl font-black font-heading tracking-widest uppercase">
                {isTimeOut ? "Time Ran Out" : isCorrect ? "Verdict: Accurate" : "Verdict: Incorrect"}
              </h2>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">
                True Classification: AI Generated
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Your Verdict</div>
              <div className={`font-bold ${isCorrect ? 'text-emerald-400' : isTimeOut ? 'text-red-400' : 'text-zinc-100'}`}>{selectedVerdict}</div>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Your Confidence</div>
              <div className="font-bold text-zinc-100">{confidenceScore}%</div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-zinc-100 mb-3 font-heading uppercase tracking-wide">MIL Lesson: Visual Inspection</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Generative AI is constantly improving, but it often struggles with complex geometries like human hands, text on clothing, and intersecting objects (like hair against a detailed background). When viewing social feeds, don't just consume the focal point—inspect the periphery. Finding even one impossible anatomical artifact is enough to flag an image as synthetic.
            </p>
          </div>

          <div className="flex justify-end">
            {isTimeOut ? (
              <Button onClick={handleRetry} className="h-14 px-8 text-base font-heading tracking-widest uppercase bg-red-500 hover:bg-red-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-red-700 hover:border-red-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150">
                Retry Level
              </Button>
            ) : (
              <Link href="/level/2" passHref>
                <Button className="h-14 px-8 text-base font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150">
                  Continue to Level 2
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    );
  }

  if (isSubmitting) {
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 p-12 max-w-lg w-full"
        >
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <ShieldAlert className="w-16 h-16 text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-heading tracking-widest text-emerald-400 uppercase">
            Transmitting Data
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-12">
            Verifying findings with HQ...
          </p>
          <div className="w-full h-1 bg-zinc-900 overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-emerald-500/30 pb-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: The Simulated UI */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>Target_Feed // Instagram_Proxy</span>
            </div>
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Artifacts: {foundArtifacts.length} / {LEVEL_1_HOTSPOTS.length}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[470px] bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-2xl"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-orange-400 p-[2px]">
                  <div className="w-full h-full rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <span className="text-[10px] text-zinc-500">JS</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">jessica.smith_99</div>
                  <div className="text-[10px] text-zinc-500">Los Angeles, CA</div>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-zinc-500" />
            </div>

            {/* Post Image with Hotspots */}
            <div className="relative">
              <InvestigationImage
                src="/level1_selfie.png"
                alt="Suspicious Selfie"
                hotspots={LEVEL_1_HOTSPOTS}
                foundArtifacts={foundArtifacts}
                onArtifactFound={handleArtifactFound}
                isTimeUp={isTimeUp}
              />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 text-zinc-100" />
                  <MessageCircle className="w-6 h-6 text-zinc-100" />
                  <Send className="w-6 h-6 text-zinc-100" />
                </div>
                <Bookmark className="w-6 h-6 text-zinc-100" />
              </div>
              
              <div className="text-sm font-bold mb-1">1,492 likes</div>
              
              <div className="text-sm">
                <span className="font-bold mr-2">jessica.smith_99</span>
                Morning coffee vibes ☕️✨ Can't believe it's already Wednesday! #morningroutine #coffeelover #sunshine
              </div>
              
              <div className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">
                2 HOURS AGO
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Investigation Tools & Verdict */}
        <div className="lg:col-span-5 sticky top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm relative overflow-hidden"
          >
            {/* Timer UI */}
            <div className={`absolute top-0 right-0 p-4 flex items-center gap-2 font-mono text-xl ${timeLeft <= 10 && !isTimeUp ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
              <Timer className="w-5 h-5" />
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : '00:00'}
            </div>

            <h2 className="text-2xl font-bold font-heading uppercase tracking-wide mb-2 text-zinc-100">
              Investigation Panel
            </h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-[85%]">
              Examine the post on the left. Click on areas that appear anomalous. Once you have enough evidence, submit your verdict.
            </p>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Progress</div>
                <div className="text-xs font-mono text-emerald-400">
                  {foundArtifacts.length} / {LEVEL_1_HOTSPOTS.length} Artifacts
                </div>
              </div>
              <div className="w-full h-1 bg-zinc-800">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(foundArtifacts.length / LEVEL_1_HOTSPOTS.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence>
              {(allFound || isTimeUp) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="w-full h-px bg-zinc-800 mb-8" />
                  
                  {isTimeUp && !allFound && (
                    <div className="mb-6 p-3 bg-red-950/40 border border-red-900/50 rounded-sm text-red-400 text-sm flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Time limit reached! You must lock in a verdict now.
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 group/tooltip">
                      <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">1. Establish Verdict</h3>
                      <div className="relative">
                        <Info className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-help transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-sans normal-case tracking-normal leading-relaxed rounded-sm shadow-2xl z-50 pointer-events-none text-center">
                          Select the classification that best matches your findings based on the artifacts discovered.
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {["Real", "AI Generated", "Unsure"].map((verdict) => (
                        <button
                          key={verdict}
                          onClick={() => setSelectedVerdict(verdict)}
                          className={`p-4 border text-sm font-bold transition-all duration-200 ${
                            selectedVerdict === verdict
                              ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          {verdict}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 group/tooltip2">
                        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">2. Calibration</h3>
                        <div className="relative">
                          <Info className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-help transition-colors" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip2:block w-64 p-3 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-sans normal-case tracking-normal leading-relaxed rounded-sm shadow-2xl z-50 pointer-events-none text-center">
                            Rate your certainty. Top investigators know when they need more data before making a definitive call.
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400">{confidenceScore}%</span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      value={confidenceScore}
                      onValueChange={setConfidenceScore}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                      <span>Guessing</span>
                      <span>Certain</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!selectedVerdict}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150 disabled:opacity-50"
                  >
                    Submit Report
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!allFound && (
              <div className="p-4 border border-zinc-800 bg-zinc-900/50 text-center">
                <span className="text-sm text-zinc-500">Locate all artifacts to unlock verdict submission.</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <FeedbackDialog
        isOpen={!!activeDialog}
        onClose={() => setActiveDialog(null)}
        title={activeDialog?.title || ""}
        description={activeDialog?.description || ""}
      />

      {/* Time's Up Overlay */}
      <AnimatePresence>
        {isTimeUp && !showResults && !isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-4" />
              <h1 className="text-6xl font-black font-heading text-red-500 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                Time's Up
              </h1>
              <p className="text-red-400 font-mono mt-4 uppercase tracking-widest">
                Force submitting current report...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
