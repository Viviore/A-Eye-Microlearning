"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MILVerdict } from "@/lib/investigation";
import { InvestigationImage, ArtifactHotspot } from "@/components/game/InvestigationImage";
import { FeedbackDialog } from "@/components/game/FeedbackDialog";
import { ContextCardModal } from "@/components/game/ContextCardModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Terminal, ShieldAlert, CheckCircle2, XCircle, Globe, Timer, Camera, Sparkles, ZoomIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CASE_002_HOTSPOTS: ArtifactHotspot[] = [
  {
    id: "gibberish_text",
    x: 43,
    y: 63,
    width: 20,
    height: 20,
    title: "Typography Failure: Gibberish",
    description: "Generative AI struggles to render coherent text, often producing alien-like squiggles or misspelled words on signs and banners. This is a dead giveaway.",
  },
  {
    id: "distorted_buildings",
    x: 22,
    y: 21,
    width: 20,
    height: 20,
    title: "Non-Euclidean Architecture",
    description: "Look at the background buildings. The structural geometry is warped and merges impossibly with the sky. Real buildings do not bend like this.",
  },
];

export default function Level2Page() {
  const router = useRouter();
  const foundArtifacts = useGameStore((state) => state.level2FoundArtifacts);
  const discoverEvidence = useGameStore((state) => state.discoverEvidence);
  const addFoundArtifact = useGameStore((state) => state.addLevel2Artifact);
  const setVerdict = useGameStore((state) => state.setLevel2Verdict);
  const setConfidence = useGameStore((state) => state.setLevel2Confidence);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const resetLevel2 = useGameStore((state) => state.resetLevel2);

  const [activeDialog, setActiveDialog] = useState<ArtifactHotspot | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<MILVerdict | "Time Expired" | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([70]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const handleRetry = () => {
    resetLevel2();
    setShowResults(false);
    setTimeLeft(60);
    setIsTimeUp(false);
    setActiveDialog(null);
    setSelectedVerdict(null);
    setConfidenceScore([70]);
  };

  useEffect(() => {
    if (showResults || isSubmitting || activeDialog) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
      setTimeout(() => {
        setIsSubmitting(true);
        setSelectedVerdict("Time Expired");
        setConfidenceScore([0]);
        setVerdict("Time Expired");
        setConfidence(0);
        completeLevel(2);

        setTimeout(() => {
          setIsSubmitting(false);
          setShowResults(true);
        }, 2000);
      }, 1500);
    }
  }, [timeLeft, showResults, isSubmitting, activeDialog, isTimeUp, setVerdict, setConfidence, completeLevel]);

  const handleArtifactFound = (artifact: ArtifactHotspot) => {
    addFoundArtifact(artifact.id);
    discoverEvidence('case-002', {
      id: artifact.id,
      title: artifact.title,
      description: artifact.description,
      category: 'visual_artifact',
      explanation: artifact.description,
    });
    setActiveDialog(artifact);
  };

  const allFound = foundArtifacts.length === CASE_002_HOTSPOTS.length;

  const handleSubmit = () => {
    if (!selectedVerdict) return;

    setIsSubmitting(true);
    setVerdict(selectedVerdict);
    setConfidence(confidenceScore[0]);
    completeLevel(2);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);
    }, 2000);
  };

  if (showResults) {
    const isTimeOut = selectedVerdict === "Time Expired";
    const isCorrect = !isTimeOut && selectedVerdict === "Misleading";

    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 md:p-12 shadow-2xl rounded-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
            {isTimeOut ? (
              <Timer className="w-12 h-12 text-red-500" />
            ) : isCorrect ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
            <div>
              <h2 className="text-3xl font-black font-heading tracking-widest uppercase">
                {isTimeOut ? "Time Expired" : isCorrect ? "Report Verified: Accurate" : "Report Inaccurate"}
              </h2>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">
                Target Classification: Misleading (Contains Non-Euclidean background artifacts)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Your Verdict</div>
              <div className={`font-bold ${isCorrect ? 'text-emerald-400' : isTimeOut ? 'text-red-400' : 'text-zinc-100'}`}>{selectedVerdict}</div>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Confidence Rating</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{confidenceScore[0]}%</div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Learning Debrief: Environmental Inspection
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Viral posts during breaking news events frequently use manipulated image composites. Always inspect the peripheral environment—look for warped building lines, gibberish signage, or broken shadow vectors. Finding physical impossibilities disproves claim authenticity.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isTimeOut ? (
              <Button onClick={handleRetry} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-red-500 hover:bg-red-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-red-700">
                Retry Case 002
              </Button>
            ) : (
              <Button onClick={() => setShowContextCard(true)} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700">
                Proceed to Case 003
              </Button>
            )}
          </div>
        </motion.div>

        <ContextCardModal
          isOpen={showContextCard}
          title="Viral News Verification & Image Manipulation"
          context="Sensational claims often spread faster than fact-checks. Always inspect background details and cross-reference photos with official news outlets before re-sharing content."
          onProceed={() => router.push("/level/3")}
        />
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
          className="text-center z-10 p-12 max-w-lg w-full"
        >
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <ShieldAlert className="w-16 h-16 text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-heading tracking-widest text-emerald-400 uppercase">
            Transmitting Investigation Report
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-12">
            Evaluating structural & visual artifacts...
          </p>
          <div className="w-full h-1 bg-zinc-900 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "linear" }}
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

        {/* Left Column: Simulated Feed */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>Case 002 // Photo Investigation</span>
            </div>
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Evidence: {foundArtifacts.length} / {CASE_002_HOTSPOTS.length} Discovered
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[500px] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
          >
            <div className="flex items-start justify-between p-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                  <span className="text-xs font-bold text-zinc-500">TD</span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-zinc-100">Truth Defenders</div>
                    <div className="flex items-center gap-1 text-[13px] text-zinc-400">
                    <span>3 hrs</span>
                    <span>·</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-zinc-400 cursor-pointer" />
            </div>

            <div className="px-4 py-2 text-[15px] text-zinc-200 mb-2">
              Absolutely CHAOTIC scenes downtown right now! Look at the size of this protest! They are completely losing control of the city. WAKE UP! 🚨🏢🔥 #Truth #BreakingNews
            </div>

            <div className="relative border-y border-zinc-800">
              <InvestigationImage
                src="/level2_news.png"
                alt="Protest street image"
                hotspots={CASE_002_HOTSPOTS}
                foundArtifacts={foundArtifacts}
                onArtifactFound={handleArtifactFound}
                isTimeUp={isTimeUp}
              />
            </div>

            <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-[13px] text-zinc-400">
              <div className="flex items-center gap-1">
                <div className="flex items-center -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border border-zinc-900 flex items-center justify-center"><ThumbsUp className="w-2 h-2 text-white fill-white" /></div>
                </div>
                <span className="ml-1">8.2K</span>
              </div>
              <div className="flex items-center gap-3">
                <span>1.4K Comments</span>
                <span>4.1K Shares</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 py-1">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-zinc-400 font-bold text-sm">
                <ThumbsUp className="w-5 h-5" /> Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-zinc-400 font-bold text-sm">
                <MessageSquare className="w-5 h-5" /> Comment
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-zinc-400 font-bold text-sm">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Investigation Panel */}
        <div className="lg:col-span-5 sticky top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm relative overflow-hidden space-y-6"
          >
            {/* Timer UI */}
            <div className={`absolute top-0 right-0 p-4 flex items-center gap-2 font-mono text-xl ${timeLeft <= 10 && !isTimeUp ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
              <Timer className="w-5 h-5" />
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : '00:00'}
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading uppercase tracking-wide text-zinc-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" /> Investigation Report
              </h2>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Inspect background building geometry and text signage to gather visual evidence.
              </p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Evidence Collected</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{foundArtifacts.length} / {CASE_002_HOTSPOTS.length} Clues</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(foundArtifacts.length / CASE_002_HOTSPOTS.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence>
              {(allFound || isTimeUp) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 pt-4 border-t border-zinc-800"
                >
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                      1. Final Report Verdict
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        { key: "Credible", label: "🟢 Credible / Supported by Evidence" },
                        { key: "Needs Verification", label: "🟡 Needs Verification / Unsubstantiated" },
                        { key: "Misleading", label: "🔴 Misleading / Contains Material Artifacts" },
                        { key: "Insufficient Evidence", label: "⚪ Insufficient Evidence to Decide" },
                      ] as Array<{ key: MILVerdict; label: string }>).map((v) => (
                        <button
                          key={v.key}
                          onClick={() => setSelectedVerdict(v.key)}
                          className={`p-3.5 border text-left text-xs font-bold transition-all ${
                            selectedVerdict === v.key
                              ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                        2. Certainty Calibration
                      </h3>
                      <span className="font-mono text-emerald-400 font-bold text-sm">{confidenceScore[0]}%</span>
                    </div>
                    <Slider
                      defaultValue={[70]}
                      max={100}
                      step={5}
                      value={confidenceScore}
                      onValueChange={(val) => setConfidenceScore(Array.isArray(val) ? [...val] : [Number(val)])}
                      className="mb-1"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase mt-1">
                      <span>🤔 Just Guessing (0%)</span>
                      <span>⚖️ Moderately Sure (50%)</span>
                      <span>🎯 100% Certain</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedVerdict}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 disabled:opacity-50"
                  >
                    Submit Report & Debrief
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!allFound && (
              <div className="p-4 border border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500">
                Click suspicious details in the image to collect evidence.
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
    </main>
  );
}
