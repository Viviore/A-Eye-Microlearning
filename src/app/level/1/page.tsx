"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MILVerdict } from "@/lib/investigation";
import { ContextCardModal } from "@/components/game/ContextCardModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Terminal, ShieldAlert, CheckCircle2, XCircle, Timer, FileText, Sparkles, AlertCircle, Edit3, Highlighter, Search, Database, Check, X, ChevronRight, HelpCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ClaimDocumentSegment {
  id: string;
  text: string;
  isClaim: boolean;
  claimTitle?: string;
  sourceQuery?: string;
  verificationResult?: {
    status: "FABRICATED" | "UNVERIFIED" | "FACTUAL";
    alertTitle: string;
    alertDetail: string;
  };
}

const DOCUMENT_SEGMENTS: ClaimDocumentSegment[] = [
  {
    id: "seg_1",
    text: "🚨 TRENDING TECH ALERT 🚨\n\nJust saw this viral post from tech page @FutureTechDaily:\n\n\"",
    isClaim: false,
  },
  {
    id: "claim_1",
    text: "Dr. Aris Thorne from MIT just published a breakthrough study proving that new bioluminescent street clovers produce 5,000 lumens of continuous light.",
    isClaim: true,
    claimTitle: "Claim #1: Dr. Aris Thorne / 5,000 Lumens MIT Study",
    sourceQuery: "Query MIT Directory & Academic Journal Database for 'Dr. Aris Thorne'",
    verificationResult: {
      status: "FABRICATED",
      alertTitle: "❌ Database Alert: Person & Study Do Not Exist",
      alertDetail: "MIT Directory query returned ZERO results for 'Dr. Aris Thorne'. Furthermore, physical optics limits plant luminescence output to <0.8% of a standard LED bulb.",
    },
  },
  {
    id: "seg_2",
    text: "\" According to their post, \"",
    isClaim: false,
  },
  {
    id: "claim_2",
    text: "municipalities can replace all city streetlights with these clovers next month, cutting urban electricity expenditure to absolute zero!",
    isClaim: true,
    claimTitle: "Claim #2: Zero-Cost City Streetlight Replacement",
    sourceQuery: "Cross-reference Municipal Infrastructure Grid Standards & Energy Audits",
    verificationResult: {
      status: "FABRICATED",
      alertTitle: "❌ Infrastructure Alert: Physically Impossible Scale",
      alertDetail: "No municipal permit or grid authority has approved plant light integration. Current transgenic plant strains require dark-adapted laboratory cameras to even detect light emission.",
    },
  },
  {
    id: "seg_3",
    text: "\" While geneticists have successfully introduced luciferase genes into plant tissue for research, ",
    isClaim: false,
  },
  {
    id: "claim_3",
    text: "the National Science Foundation issued a statement confirming that commercial deployment of streetlights remains unfeasible.",
    isClaim: true,
    claimTitle: "Claim #3: NSF Scientific Verification Statement",
    sourceQuery: "Query National Science Foundation Public Release Registry",
    verificationResult: {
      status: "FACTUAL",
      alertTitle: "✅ Source Verified: NSF Official Statement",
      alertDetail: "The NSF public registry confirms laboratory luciferase research is genuine, but cautions against viral exaggerated commercial claims.",
    },
  },
];

export default function Level1Page() {
  const router = useRouter();
  const foundArtifacts = useGameStore((state) => state.level1FoundArtifacts);
  const discoverEvidence = useGameStore((state) => state.discoverEvidence);
  const addFoundArtifact = useGameStore((state) => state.addLevel1Artifact);
  const setVerdict = useGameStore((state) => state.setLevel1Verdict);
  const setConfidence = useGameStore((state) => state.setLevel1Confidence);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const resetLevel1 = useGameStore((state) => state.resetLevel1);

  // Redaction Pen & Fact Checker Drawer State
  const [selectedSegment, setSelectedSegment] = useState<ClaimDocumentSegment | null>(null);
  const [queriedClaimIds, setQueriedClaimIds] = useState<string[]>([]);
  const [redactedClaimIds, setRedactedClaimIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Final Report & Certainty Calibration State
  const [selectedVerdict, setSelectedVerdict] = useState<MILVerdict | "Time Expired" | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([80]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const totalFabricatedClaims = DOCUMENT_SEGMENTS.filter(s => s.isClaim && s.verificationResult?.status === "FABRICATED").length;

  const handleRetry = () => {
    resetLevel1();
    setSelectedSegment(null);
    setQueriedClaimIds([]);
    setRedactedClaimIds([]);
    setScore(0);
    setTimeLeft(60);
    setIsTimeUp(false);
    setShowResults(false);
    setSelectedVerdict(null);
    setConfidenceScore([80]);
  };

  // Timer logic
  useEffect(() => {
    if (showResults || isSubmitting) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
    }
  }, [timeLeft, showResults, isSubmitting, isTimeUp]);

  // Handle clicking a claim text segment
  const handleSegmentClick = (segment: ClaimDocumentSegment) => {
    if (!segment.isClaim) return;
    setSelectedSegment(segment);
  };

  // Execute Source Fact Check Query in Drawer
  const handleExecuteQuery = (segment: ClaimDocumentSegment) => {
    if (!queriedClaimIds.includes(segment.id)) {
      setQueriedClaimIds([...queriedClaimIds, segment.id]);
    }

    if (segment.verificationResult?.status === "FABRICATED" && !redactedClaimIds.includes(segment.id)) {
      const updatedRedactions = [...redactedClaimIds, segment.id];
      setRedactedClaimIds(updatedRedactions);
      setScore((prev) => prev + 250);

      addFoundArtifact(segment.id);
      discoverEvidence("case-001", {
        id: segment.id,
        title: segment.claimTitle || "Fabricated Claim",
        description: segment.verificationResult.alertDetail,
        category: "source_verification",
        explanation: segment.verificationResult.alertDetail,
      });
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedVerdict) return;

    setIsSubmitting(true);
    setVerdict(selectedVerdict);
    setConfidence(confidenceScore[0]);
    completeLevel(1);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);
    }, 2000);
  };

  // Results Screen
  if (showResults) {
    const isCorrect = selectedVerdict === "Misleading" || selectedVerdict === "AI-Generated";

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
                Source Fact-Check Verified
              </h2>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-1">
                Fact Checker Audit Complete — Total Score: {score} PTS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Your Verdict</div>
              <div className={`font-bold text-sm ${isCorrect ? "text-emerald-400" : "text-zinc-200"}`}>{selectedVerdict}</div>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Claims Cross-Referenced</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{redactedClaimIds.length} / {totalFabricatedClaims} Verified</div>
            </div>
            <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Certainty Rating</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{confidenceScore[0]}%</div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-sm space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Fact-Checking Lesson
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Instead of guessing based on writing style, you cross-referenced claims against institutional directories (MIT) and physics standards. Fabricated names like <em>"Dr. Aris Thorne"</em> and impossible metrics were caught through evidence verification!
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isCorrect ? (
              <Button
                onClick={() => setShowContextCard(true)}
                className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700 font-bold"
              >
                Proceed to Case 002
              </Button>
            ) : (
              <Button
                onClick={handleRetry}
                className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-red-500 hover:bg-red-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-red-700 font-bold"
              >
                Retry Case 001
              </Button>
            )}
          </div>
        </motion.div>

        <ContextCardModal
          isOpen={showContextCard}
          title="Fact Checking & Source Verification"
          context="Digital misinformation often fabricates authoritative names and studies. Cross-referencing claims against registered databases equips you to uncover synthetic hoaxes."
          onProceed={() => router.push("/level/2")}
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
            Transmitting Source Audit Report
          </h2>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-12">
            Verifying evidence cross-references...
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

        {/* Left Column: Redaction Pen Document Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Case 001 // Redaction Pen & Fact Checker</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-sm font-mono text-xs font-bold uppercase bg-emerald-500 text-zinc-950">
                Score: {score} PTS
              </span>
            </div>

            {/* Claims Found Counter */}
            <div className="text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Evidence Tagged: <strong>{redactedClaimIds.length} / {totalFabricatedClaims} Fabricated Claims</strong></span>
            </div>
          </div>

          {/* Document Inspection Canvas */}
          <div className="bg-zinc-905 border border-zinc-800 rounded-sm shadow-2xl overflow-hidden">
            {/* Social Post Header */}
            <div className="p-4 md:p-6 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm rounded-full shrink-0">
                  FT
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-sm tracking-wide text-zinc-100">Future Tech Daily</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded-sm font-mono font-bold uppercase">Influencer</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">@FutureTechDaily // Trending now</div>
                </div>
              </div>
              
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 border border-emerald-800/60 rounded-sm flex items-center gap-1">
                <Highlighter className="w-3.5 h-3.5" /> Claim Highlighter Active
              </span>
            </div>

            {/* Social Post Content - Clickable Claims */}
            <div className="p-6 bg-zinc-950/60 text-base md:text-lg leading-relaxed text-zinc-100 font-sans selection:bg-emerald-500/45 space-y-2 border-b border-zinc-800 whitespace-pre-line">
              {DOCUMENT_SEGMENTS.map((seg) => {
                if (!seg.isClaim) {
                  return <span key={seg.id} className="text-zinc-400">{seg.text}</span>;
                }

                const isQueried = queriedClaimIds.includes(seg.id);
                const isRedacted = redactedClaimIds.includes(seg.id);
                const isSelected = selectedSegment?.id === seg.id;

                return (
                  <span
                    key={seg.id}
                    onClick={() => handleSegmentClick(seg)}
                    className={`cursor-pointer transition-all duration-200 rounded px-1.5 py-0.5 inline-block mx-0.5 ${
                      isRedacted
                        ? "bg-red-950/90 border-b-2 border-red-500 text-red-200 font-medium"
                        : isSelected
                        ? "bg-emerald-950/80 border-b-2 border-emerald-500 text-emerald-200 font-medium"
                        : isQueried
                        ? "bg-zinc-800/85 text-zinc-200"
                        : "hover:bg-zinc-800/90 hover:text-emerald-300 border-b border-dashed border-zinc-700"
                    }`}
                    title="Click claim to open Fact Checker Inspection Drawer"
                  >
                    {seg.text}
                  </span>
                );
              })}
            </div>

            {/* Social Engagement Stats */}
            <div className="px-6 py-4 bg-zinc-900/20 text-xs font-mono text-zinc-500 flex items-center gap-6 border-b border-zinc-800">
              <span>❤️ 42.5K Likes</span>
              <span>💬 8.2K Comments</span>
              <span>🔁 1.4K Shares</span>
            </div>

            <div className="p-4 bg-zinc-900/40 text-xs text-zinc-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Click on any underlined claim sentence in the post text to cross-reference registered databases.</span>
            </div>
          </div>

          {/* Interactive Source Inspection Drawer */}
          <AnimatePresence>
            {selectedSegment && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold font-heading uppercase text-zinc-100">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Fact Checker Drawer // {selectedSegment.claimTitle}</span>
                  </div>
                  <button onClick={() => setSelectedSegment(null)} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-sm space-y-2 text-xs md:text-sm text-zinc-200">
                  <div className="font-mono text-xs text-zinc-400 uppercase">Target Claim Text:</div>
                  <div className="italic text-zinc-300">"{selectedSegment.text}"</div>
                </div>

                {/* Query Button */}
                {!queriedClaimIds.includes(selectedSegment.id) ? (
                  <Button
                    onClick={() => handleExecuteQuery(selectedSegment)}
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Cross-Reference Claim against Registries
                  </Button>
                ) : (
                  /* Verification Alert Output */
                  <div className={`p-4 border rounded-sm space-y-2 text-xs md:text-sm ${
                    selectedSegment.verificationResult?.status === "FABRICATED"
                      ? "bg-red-950/70 border-red-500/70 text-red-200"
                      : "bg-emerald-950/70 border-emerald-500/70 text-emerald-200"
                  }`}>
                    <div className="font-bold font-mono text-sm flex items-center gap-2">
                      {selectedSegment.verificationResult?.alertTitle}
                    </div>
                    <p className="leading-relaxed font-sans text-xs">
                      {selectedSegment.verificationResult?.alertDetail}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column: Case 001 Final Report Panel */}
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
                <Terminal className="w-6 h-6 text-emerald-400" /> Case 001 Report
              </h2>
              <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed font-sans">
                Inspect the viral post, cross-reference suspicious claims, and submit your final report.
              </p>
            </div>

            {/* Evidence Tagged Meter */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-sm space-y-3">
              <div className="flex justify-between items-center text-sm font-mono uppercase">
                <span className="text-zinc-300 font-medium">Fabricated Claims Tagged</span>
                <span className="text-emerald-400 font-bold text-base">{redactedClaimIds.length} / {totalFabricatedClaims} Verified</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  animate={{ width: `${(redactedClaimIds.length / totalFabricatedClaims) * 100}%` }}
                />
              </div>
            </div>

            {/* Verdict Options */}
            <div className="space-y-3">
              <h3 className="text-sm md:text-base font-bold text-zinc-100 uppercase tracking-wider">
                1. Final Report Verdict
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { key: "Trustworthy", label: "🟢 Trustworthy / Verified Source Context" },
                  { key: "Misleading", label: "🟡 Misleading / Contains Fabricated Claims" },
                  { key: "AI-Generated", label: "🔴 AI-Generated / Contains Hallucinations" },
                ].map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setSelectedVerdict(v.key as MILVerdict)}
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

            {/* Confidence Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-zinc-100 uppercase tracking-wider">
                  2. Certainty Calibration
                </h3>
                <span className="font-mono text-emerald-400 font-bold text-base md:text-lg">{confidenceScore[0]}%</span>
              </div>
              <Slider
                defaultValue={[80]}
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
              onClick={handleFinalSubmit}
              disabled={!selectedVerdict || queriedClaimIds.length < 2}
              className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 disabled:opacity-50 font-bold text-base md:text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {queriedClaimIds.length < 2 ? (
                <span>Lock: Check {2 - queriedClaimIds.length} More Claim{2 - queriedClaimIds.length > 1 ? 's' : ''} 🔒</span>
              ) : (
                <span>Submit Case 001 Report 🚀</span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
