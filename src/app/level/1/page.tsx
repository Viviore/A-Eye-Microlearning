"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MILVerdict } from "@/lib/investigation";
import { FeedbackDialog } from "@/components/game/FeedbackDialog";
import { ContextCardModal } from "@/components/game/ContextCardModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Terminal, ShieldAlert, CheckCircle2, XCircle, Timer, FileText, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TextSegment {
  id?: string;
  text: string;
  isArtifact: boolean;
  title?: string;
  description?: string;
}

const POST_A_SEGMENTS: TextSegment[] = [
  {
    id: "prompt_leak",
    text: "🤖 Here is a viral social media post: BREAKING NEWS! Scientists in Denmark have invented 100% real glowing clover plants! ",
    isArtifact: true,
    title: "AI Prompt Leak / Robotic Intro",
    description: "AI text models often leak their instructions or include robotic intros like 'Here is a viral post...'. Real humans and news outlets don't write like this!",
  },
  {
    id: "text_hallucination",
    text: "These super-plants glow so bright (over 1,000,000 lumens!) that 1 single leaf can replace all city streetlights and wirelessly charge your smartphone!",
    isArtifact: true,
    title: "Impossible Super-Hallucination",
    description: "Generative AI doesn't understand physics! Real bioluminescent plants produce less than 1% of a tiny LED bulb—they cannot illuminate cities or charge phones.",
  },
  {
    id: "fake_authority",
    text: " According to Chief Scientist Dr. Robo-Plant AI from Harvard-Google University, this solved world energy forever! 🍀💡",
    isArtifact: true,
    title: "Hallucinated Fake Doctor & School",
    description: "AI models fabricate convincing names and fake institutions (like 'Dr. Robo-Plant AI' from 'Harvard-Google University') when they don't have real facts.",
  },
  {
    id: "bot_hashtags",
    text: " #glowingplants #100percentreal #notafake #biotech #viral #bot #greenfuture",
    isArtifact: true,
    title: "Bot Hashtag Stuffing",
    description: "Automated AI bot accounts stuff spammy hashtags like #100percentreal #notafake to trick social media algorithms into promoting false posts.",
  },
];

const POST_B_SEGMENTS: TextSegment[] = [
  {
    text: "Biotechnologists have engineered transgenic plant strains expressing luciferase genes to emit faint light, but output remains extremely low—about 1% of a standard LED. ",
    isArtifact: false,
  },
  {
    text: "While exciting for lab research into plant gene pathways, they're nowhere near bright enough to light up streets as viral claims suggest. Read the peer-reviewed paper in Biotech Journal. 🔬🌱 #scicomm",
    isArtifact: false,
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

  const [activeDialog, setActiveDialog] = useState<TextSegment | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<MILVerdict | "Time Expired" | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([70]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const level1ArtifactsToFind = POST_A_SEGMENTS.filter(s => s.isArtifact).map(s => s.id as string);

  const handleRetry = () => {
    resetLevel1();
    setShowResults(false);
    setTimeLeft(60);
    setIsTimeUp(false);
    setActiveDialog(null);
    setSelectedVerdict(null);
    setConfidenceScore([70]);
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

  const handleSegmentClick = (segment: TextSegment) => {
    if (isTimeUp) return;

    if (segment.isArtifact && segment.id) {
      addFoundArtifact(segment.id);
      discoverEvidence('case-001', {
        id: segment.id,
        title: segment.title || segment.id,
        description: segment.description || '',
        category: 'textual_claim',
        explanation: segment.description || '',
      });
    }
    setActiveDialog(segment);
  };

  const allFound = level1ArtifactsToFind.every(id => foundArtifacts.includes(id));

  const handleSubmit = () => {
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
                Target Classification: Misleading (Post A contains fabricated metrics & hallucinations)
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
              <Sparkles className="w-4 h-4 text-emerald-400" /> Learning Debrief: Textual Verification
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Post A contains scientific hallucinations and fabricated 5,000-lumen metrics. When evaluating online text claims, look for physical impossibilities and fake numbers. Credible sources cite peer-reviewed journals, whereas misleading posts rely on promotional hype.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isTimeOut ? (
              <Button onClick={handleRetry} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-red-500 hover:bg-red-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-red-700">
                Retry Case 001
              </Button>
            ) : (
              <Button onClick={() => setShowContextCard(true)} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700">
                Proceed to Case 002
              </Button>
            )}
          </div>
        </motion.div>

        <ContextCardModal
          isOpen={showContextCard}
          title="Social Media Bots & Text Misinformation"
          context="Automated accounts generate thousands of sensational claims daily. By learning to cross-examine claims against scientific consensus, you build lifelong immunity against digital deception."
          onProceed={() => router.push("/level/2")}
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
            Evaluating textual evidence...
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

        {/* Left Column: Simulated Feeds */}
        <div className="lg:col-span-7 flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-sm text-emerald-400 font-mono text-xs uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>Case 001 // Text Investigation</span>
            </div>
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Artifacts: {foundArtifacts.length} / {level1ArtifactsToFind.length} Clues Discovered
            </div>
          </div>

          {/* Forensic Tip */}
          <div className="w-full p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm text-xs text-zinc-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Read Post A carefully. Click on sentences you suspect of containing fabricated metrics or physical impossibilities.</span>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Post A (Target Post with Natural Text) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 shadow-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center border border-emerald-500/55">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">A</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                        @nature_facts_daily
                        <div className="w-3 h-3 bg-zinc-700 rounded-full flex items-center justify-center text-[7px] text-zinc-300">✓</div>
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">Target Post A</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                </div>

                <div className="text-sm leading-relaxed text-zinc-200 mb-4 select-text space-y-1">
                  {POST_A_SEGMENTS.map((seg, idx) => {
                    const isFound = foundArtifacts.includes(seg.id || "");
                    return (
                      <span
                        key={idx}
                        onClick={() => handleSegmentClick(seg)}
                        className={`cursor-pointer transition-all duration-200 rounded-sm px-0.5 ${
                          isFound
                            ? "bg-emerald-950/80 border-b-2 border-emerald-500 text-emerald-300 font-medium py-0.5"
                            : "hover:bg-zinc-800/70 hover:text-emerald-300"
                        }`}
                      >
                        {seg.text}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-3 mt-auto">
                <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
                  <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> 23.4k</div>
                  <div className="flex items-center gap-1.5"><Repeat2 className="w-3.5 h-3.5" /> 8.1k</div>
                  <div className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> 1.9k</div>
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                  Click suspicious claim sentences to inspect evidence
                </div>
              </div>
            </motion.div>

            {/* Post B (Balanced Reference Context) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 shadow-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/25 flex items-center justify-center border border-blue-500/55">
                      <span className="text-[10px] text-blue-400 font-mono font-bold">B</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                        @sci_insights
                        <div className="w-3 h-3 bg-zinc-700 rounded-full flex items-center justify-center text-[7px] text-zinc-300">✓</div>
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">Reference Post B</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                </div>

                <div className="text-sm leading-relaxed text-zinc-400 mb-4 select-text">
                  {POST_B_SEGMENTS.map((seg, idx) => (
                    <span key={idx}>{seg.text}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-3 mt-auto">
                <div className="flex items-center justify-between text-zinc-500 text-xs mb-2">
                  <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> 843</div>
                  <div className="flex items-center gap-1.5"><Repeat2 className="w-3.5 h-3.5" /> 312</div>
                  <div className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> 45</div>
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                  Cross-examine claims against reference post
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Right Column: Investigation Report Panel */}
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
                <FileText className="w-5 h-5 text-emerald-400" /> Investigation Report
              </h2>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Click claim sentences in Post A to uncover scientific hallucinations and fabricated metrics.
              </p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Evidence Discovered</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{foundArtifacts.length} / {level1ArtifactsToFind.length} Clues</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(foundArtifacts.length / level1ArtifactsToFind.length) * 100}%` }}
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
                  {/* Verdict Options */}
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

                  {/* Confidence Slider */}
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
                Read Post A and click suspicious claim sentences to collect evidence.
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
