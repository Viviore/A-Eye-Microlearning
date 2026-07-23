"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MILVerdict } from "@/lib/investigation";
import { FeedbackDialog } from "@/components/game/FeedbackDialog";
import { ContextCardModal } from "@/components/game/ContextCardModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AdvancedInvestigationImage } from "@/components/game/AdvancedInvestigationImage";
import { Camera, ShieldAlert, CheckCircle2, XCircle, Timer, ZoomIn, Eye, Sparkles, HelpCircle, AlertCircle, Layers, Check, X, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HotspotConfig {
  id: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  title: string;
  description: string;
  correctCategory: "Anatomic Anomaly" | "Geometric Distortion" | "Text Garbling";
  explanation: string;
}

const CASE_002_HOTSPOTS: HotspotConfig[] = [
  {
    id: "warped-windows",
    xPercent: 32,
    yPercent: 22,
    widthPercent: 18,
    heightPercent: 24,
    title: "Warped Window Geometry",
    description: "The background building windows exhibit melted, non-parallel architectural lines.",
    correctCategory: "Geometric Distortion",
    explanation: "AI image diffusion models often struggle with linear architectural perspective in background structures.",
  },
  {
    id: "garbled-signage",
    xPercent: 68,
    yPercent: 18,
    widthPercent: 20,
    heightPercent: 20,
    title: "Garbled Text Signage",
    description: "The street sign contains unreadable pseudo-script characters that blur into geometric noise.",
    correctCategory: "Text Garbling",
    explanation: "AI generators produce text-like pixel clusters rather than rendered typography from real glyph sets.",
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

  const [activeHotspot, setActiveHotspot] = useState<HotspotConfig | null>(null);
  const [selectedTagCategory, setSelectedTagCategory] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<{ title: string; description: string } | null>(null);

  // Tools state
  const [forensicLensMode, setForensicLensMode] = useState(false);
  const [contrastBoost, setContrastBoost] = useState(false);
  const [gridOverlay, setGridOverlay] = useState(false);

  // Verdict & Certainty state
  const [selectedVerdict, setSelectedVerdict] = useState<MILVerdict | "Time Expired" | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([75]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const allFound = CASE_002_HOTSPOTS.every(h => foundArtifacts.includes(h.id));

  const handleRetry = () => {
    resetLevel2();
    setShowResults(false);
    setTimeLeft(60);
    setIsTimeUp(false);
    setActiveHotspot(null);
    setSelectedTagCategory(null);
    setActiveDialog(null);
    setSelectedVerdict(null);
    setConfidenceScore([75]);
    setForensicLensMode(false);
    setContrastBoost(false);
    setGridOverlay(false);
  };

  // Timer logic
  useEffect(() => {
    if (showResults || isSubmitting || activeHotspot) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
    }
  }, [timeLeft, showResults, isSubmitting, activeHotspot, isTimeUp]);

  // Click Hotspot -> Open 3-Choice Evidence Tagging Modal
  const handleHotspotClick = (hotspot: HotspotConfig) => {
    setActiveHotspot(hotspot);
    setSelectedTagCategory(null);
  };

  // Confirm Tag Selection
  const handleConfirmTag = () => {
    if (!activeHotspot || !selectedTagCategory) return;

    const isCorrectTag = selectedTagCategory === activeHotspot.correctCategory;

    if (isCorrectTag) {
      addFoundArtifact(activeHotspot.id);
      discoverEvidence('case-002', {
        id: activeHotspot.id,
        title: activeHotspot.title,
        description: activeHotspot.description,
        category: activeHotspot.correctCategory,
        explanation: activeHotspot.explanation,
      });

      setActiveDialog({
        title: `✅ Correct Tag: ${activeHotspot.correctCategory}`,
        description: activeHotspot.explanation,
      });
    } else {
      setActiveDialog({
        title: `⚠️ Incorrect Tag Selected`,
        description: `You selected '${selectedTagCategory}'. Re-examine the clue: ${activeHotspot.description}`,
      });
    }

    setActiveHotspot(null);
    setSelectedTagCategory(null);
  };

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

  // Results Screen
  if (showResults) {
    const isCorrect = selectedVerdict === "Misleading";

    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 md:p-12 shadow-2xl rounded-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <div>
              <h2 className="text-3xl font-black font-heading tracking-widest uppercase">
                Photo Forensics Report Verified
              </h2>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">
                Visual Forensics Complete — {foundArtifacts.length} / {CASE_002_HOTSPOTS.length} Hotspots Tagged
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Your Verdict</div>
              <div className={`font-bold text-sm ${isCorrect ? "text-emerald-400" : "text-zinc-200"}`}>{selectedVerdict}</div>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Evidence Tagged</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{foundArtifacts.length} / {CASE_002_HOTSPOTS.length} Tagged</div>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Certainty Rating</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{confidenceScore[0]}%</div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-sm space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Photo Forensics Takeaways
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Using Forensic Lens heatmap outlines, you identified warped window geometry and garbled signage text. Tagging specific visual categories (*Geometric Distortion* & *Text Garbling*) verifies root causes behind diffusion generation errors.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => setShowContextCard(true)}
              className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 font-bold"
            >
              Proceed to Case 003
            </Button>
          </div>
        </motion.div>

        <ContextCardModal
          isOpen={showContextCard}
          title="Synthetic Images & Structural Verification"
          context="Generative AI photo models frequently distort secondary background geometry while rendering subject faces cleanly. Forensic lens tools reveal structural flaws."
          onProceed={() => router.push("/level/3")}
        />
      </main>
    );
  }

  // Transmitting Screen
  if (isSubmitting) {
    return (
      <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10 p-12 max-w-lg w-full">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <ShieldAlert className="w-16 h-16 text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 font-heading tracking-widest text-emerald-400 uppercase">
            Transmitting Photo Forensics Report
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-12">
            Evaluating structural evidence tags...
          </p>
          <div className="w-full h-1 bg-zinc-900 overflow-hidden">
            <motion.div className="h-full bg-emerald-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "linear" }} />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-emerald-500/30 pb-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Image Inspection Console */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest w-fit">
              <Camera className="w-3.5 h-3.5" />
              <span>Case 002 // Photo Forensics Console</span>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 p-2 rounded-sm backdrop-blur-sm shadow-md">
              <button
                onClick={() => setForensicLensMode(!forensicLensMode)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors rounded-sm flex items-center gap-1.5 ${
                  forensicLensMode ? "bg-amber-500 text-zinc-950 border-amber-400 font-bold" : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-amber-400"
                }`}
                title="Toggle Forensic Scan Heatmap Outlines"
              >
                <Eye className="w-3.5 h-3.5" />
                {forensicLensMode ? "🔍 Lens Heatmap ON" : "🔍 Forensic Lens"}
              </button>

              <button
                onClick={() => setContrastBoost(!contrastBoost)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors rounded-sm ${
                  contrastBoost ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold" : "border-zinc-700 bg-zinc-950 text-zinc-400"
                }`}
              >
                Visual Boost
              </button>

              <button
                onClick={() => setGridOverlay(!gridOverlay)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors rounded-sm ${
                  gridOverlay ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold" : "border-zinc-700 bg-zinc-950 text-zinc-400"
                }`}
              >
                Grid Overlay
              </button>
            </div>
          </div>

          {/* Interactive Inspection Canvas */}
          <AdvancedInvestigationImage
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200"
            alt="Target Investigation Photograph"
            hotspots={CASE_002_HOTSPOTS}
            foundArtifacts={foundArtifacts}
            onHotspotClick={handleHotspotClick}
            contrastBoost={contrastBoost}
            gridOverlay={gridOverlay}
            scanMode={forensicLensMode}
          />

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 text-zinc-300 rounded-sm text-xs md:text-sm leading-relaxed flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enable <strong>Forensic Lens Mode</strong> to view structural heatmap outlines. Click hotspots to open the <strong>3-Choice Evidence Tagging Modal</strong>.</span>
          </div>
        </div>

        {/* Right Column: Case 002 Final Report Panel */}
        <div className="lg:col-span-5 sticky top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/60 border border-zinc-800 p-6 md:p-8 rounded-sm backdrop-blur-sm relative overflow-hidden space-y-6 shadow-2xl"
          >
            {/* Timer UI */}
            <div className={`absolute top-0 right-0 p-4 flex items-center gap-2 font-mono text-xl ${timeLeft <= 10 && !isTimeUp ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
              <Timer className="w-5 h-5" />
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : '00:00'}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading uppercase tracking-wide text-zinc-100 flex items-center gap-2.5">
                <Camera className="w-6 h-6 text-emerald-400" /> Case 002 Report
              </h2>
              <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed font-sans">
                Inspect background building geometry and text signage to gather visual evidence.
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-mono uppercase">
                <span className="text-zinc-300 font-medium">Evidence Tagged</span>
                <span className="text-emerald-400 font-bold text-base">{foundArtifacts.length} / {CASE_002_HOTSPOTS.length} Clues</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
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
                    <h3 className="text-sm md:text-base font-bold text-zinc-100 uppercase tracking-wider">
                      1. Final Report Verdict
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {([
                        { key: "Credible", label: "🟢 Credible / Supported by Evidence" },
                        { key: "Needs Verification", label: "🟡 Needs Verification / Unsubstantiated" },
                        { key: "Misleading", label: "🔴 Misleading / Contains Material Artifacts" },
                        { key: "Insufficient Evidence", label: "⚪ Insufficient Evidence to Decide" },
                      ] as Array<{ key: MILVerdict; label: string }>).map((v) => (
                        <button
                          key={v.key}
                          onClick={() => setSelectedVerdict(v.key)}
                          className={`p-4 border text-left text-sm md:text-base font-bold transition-all rounded-sm font-sans ${
                            selectedVerdict === v.key
                              ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm md:text-base font-bold text-zinc-100 uppercase tracking-wider">
                        2. Certainty Calibration
                      </h3>
                      <span className="font-mono text-emerald-400 font-bold text-base md:text-lg">{confidenceScore[0]}%</span>
                    </div>
                    <Slider
                      defaultValue={[70]}
                      max={100}
                      step={5}
                      value={confidenceScore}
                      onValueChange={(val) => setConfidenceScore(Array.isArray(val) ? [...val] : [Number(val)])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs md:text-sm font-mono text-zinc-300 font-medium uppercase mt-2">
                      <span>🤔 Just Guessing (0%)</span>
                      <span>⚖️ Moderately Sure (50%)</span>
                      <span>🎯 100% Certain</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedVerdict}
                    className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 disabled:opacity-50 font-bold text-base md:text-lg shadow-lg"
                  >
                    Submit Case 002 Report 🚀
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!allFound && (
              <div className="p-4 border border-zinc-800 bg-zinc-950 text-center text-sm text-zinc-300 font-medium">
                Enable Forensic Lens and click suspicious image hotspots to tag evidence.
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 3-Choice Evidence Tagging Modal */}
      <AnimatePresence>
        {activeHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/85 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 p-8 shadow-2xl rounded-sm space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                      Evidence Tagging // Hotspot Analysis
                    </span>
                    <h3 className="text-lg font-bold font-heading uppercase text-zinc-100">
                      {activeHotspot.title}
                    </h3>
                  </div>
                </div>
                <button onClick={() => setActiveHotspot(null)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs md:text-sm text-zinc-300 bg-zinc-950 p-3.5 border border-zinc-800 rounded-sm leading-relaxed">
                  <strong>Observed Visual Feature:</strong> {activeHotspot.description}
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 block">
                    Select the Correct Artifact Classification Tag:
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: "Anatomic Anomaly", label: "A) Anatomic Anomaly (Extra limbs, fused skin)" },
                      { key: "Geometric Distortion", label: "B) Geometric Distortion (Melted window bars, perspective fault)" },
                      { key: "Text Garbling", label: "C) Text Garbling (Unreadable pseudo-script signage)" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedTagCategory(opt.key)}
                        className={`p-3.5 border text-left text-xs md:text-sm font-bold transition-all rounded-sm ${
                          selectedTagCategory === opt.key
                            ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md"
                            : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={handleConfirmTag}
                  disabled={!selectedTagCategory}
                  className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 font-bold disabled:opacity-50"
                >
                  Confirm Evidence Tag <Check className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FeedbackDialog
        isOpen={!!activeDialog}
        onClose={() => setActiveDialog(null)}
        title={activeDialog?.title || ""}
        description={activeDialog?.description || ""}
      />
    </main>
  );
}
