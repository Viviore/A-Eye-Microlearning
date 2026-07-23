"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { MILVerdict } from "@/lib/investigation";
import { ContextCardModal } from "@/components/game/ContextCardModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ShieldAlert, CheckCircle2, XCircle, Timer, Video, Eye, Sparkles, ChevronRight, Zap, Lightbulb, Check, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const VIDEO_ROUNDS = [
  {
    round: 1,
    difficulty: "Easy Mode",
    color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    badgeColor: "bg-emerald-500 text-zinc-950",
    title: "Round 1: Paper Cut / Fine Edge Interaction",
    description: "Inspect the boundary line around fingers, scissors/blades, and paper edges between Video A and Video B.",
    timeLimit: 60,
    setKey: "set1",
    paths: { real: "/videos/set1/cut_real.mp4", ai: "/videos/set1/cut_ai.mp4" },
    explainer: {
      title: "Explainer: Why Video B (Cut AI) is Synthetic",
      targetFake: "Video Source B",
      keyTells: [
        "Edge Bleed & Smudging: AI video diffusion models struggle to maintain sharp object boundary permanence when hands interact with sharp objects.",
        "Blade Reflection Glitch: Light reflections along the cutting blade warp unnaturally across consecutive frames.",
        "Texture Blending: Paper fibers visually merge into the fingertips during motion."
      ]
    }
  },
  {
    round: 2,
    difficulty: "Medium Mode",
    color: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    badgeColor: "bg-amber-500 text-zinc-950",
    title: "Round 2: Fast Motion Race Sequence",
    description: "High-speed action. Use Slow-Mo (0.5x) to spot temporal frame-rate drops and vector distortion along the background track.",
    timeLimit: 45,
    setKey: "set2",
    paths: { real: "/videos/set2/race_real.mp4", ai: "/videos/set2/race_ai.mp4" },
    explainer: {
      title: "Explainer: Why Video B (Race AI) is Synthetic",
      targetFake: "Video Source B",
      keyTells: [
        "Temporal Frame Jitter: High-speed motion exposes frame flickering and ghosting along moving vehicle boundaries.",
        "Inertial Discontinuity: Under 0.5x Slow-Mo, background spectator movement fails linear physical inertia.",
        "Motion Blur Artifacts: Synthetic motion blur creates unnatural warping instead of clean directional camera streaks."
      ]
    }
  },
  {
    round: 3,
    difficulty: "Hard Mode",
    color: "text-red-400 border-red-500/40 bg-red-950/40",
    badgeColor: "bg-red-500 text-zinc-950",
    title: "Round 3: Sushi Prep & Photorealistic Texture",
    description: "Microscopic detail inspection. Toggle Visual Boost and Grid Overlay to spot pupil catchlight reflections and rice grain merging.",
    timeLimit: 30,
    setKey: "set3",
    paths: { real: "/videos/set3/sushi_real.mp4", ai: "/videos/set3/sushi_ai.mp4" },
    explainer: {
      title: "Explainer: Why Video B (Sushi AI) is Synthetic",
      targetFake: "Video Source B",
      keyTells: [
        "Catchlight Refraction Mismatch: Light reflections in the subject's pupils do not match environmental light vectors under Visual Boost.",
        "Micro-Object Merging: Knife edges and rice grains subtly dissolve into one another during delicate food manipulation.",
        "Specular Glaze Artifacts: Liquid sheen on the fish surface displays non-physical specular highlights."
      ]
    }
  }
];

export default function Level3Page() {
  const router = useRouter();
  const foundArtifacts = useGameStore((state) => state.level3FoundArtifacts);
  const discoverEvidence = useGameStore((state) => state.discoverEvidence);
  const addFoundArtifact = useGameStore((state) => state.addLevel3Artifact);
  const setVerdict = useGameStore((state) => state.setLevel3Verdict);
  const setConfidence = useGameStore((state) => state.setLevel3Confidence);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const resetLevel3 = useGameStore((state) => state.resetLevel3);

  // Round progression state
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const currentRoundConfig = VIDEO_ROUNDS[currentRoundIndex];

  // Explainer modal state
  const [showRoundExplainer, setShowRoundExplainer] = useState(false);
  const [flaggedVideo, setFlaggedVideo] = useState<string | null>(null);

  const [selectedVerdict, setSelectedVerdict] = useState<MILVerdict | "Time Expired" | null>(null);
  const [confidenceScore, setConfidenceScore] = useState([70]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showContextCard, setShowContextCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentRoundConfig.timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Video tools state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1.0 | 0.5>(1.0);
  const [visualBoost, setVisualBoost] = useState(false);
  const [gridOverlay, setGridOverlay] = useState(false);

  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  const [videoSrcA, setVideoSrcA] = useState(currentRoundConfig.paths.real);
  const [videoSrcB, setVideoSrcB] = useState(currentRoundConfig.paths.ai);

  const fallbackUrlA = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const fallbackUrlB = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

  // Update video sources when round changes
  useEffect(() => {
    setVideoSrcA(currentRoundConfig.paths.real);
    setVideoSrcB(currentRoundConfig.paths.ai);
    setTimeLeft(currentRoundConfig.timeLimit);
    setIsTimeUp(false);
    setIsPlaying(false);
    setFlaggedVideo(null);
    setShowRoundExplainer(false);
  }, [currentRoundIndex, currentRoundConfig]);

  const handleVideoErrorA = () => {
    if (videoSrcA !== fallbackUrlA) setVideoSrcA(fallbackUrlA);
  };

  const handleVideoErrorB = () => {
    if (videoSrcB !== fallbackUrlB) setVideoSrcB(fallbackUrlB);
  };

  const handleRetry = () => {
    resetLevel3();
    setCurrentRoundIndex(0);
    setShowResults(false);
    setTimeLeft(VIDEO_ROUNDS[0].timeLimit);
    setIsTimeUp(false);
    setSelectedVerdict(null);
    setConfidenceScore([70]);
    setIsPlaying(false);
    setPlaybackSpeed(1.0);
    setVisualBoost(false);
    setGridOverlay(false);
    setFlaggedVideo(null);
    setShowRoundExplainer(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      videoRefA.current?.pause();
      videoRefB.current?.pause();
    } else {
      videoRefA.current?.play().catch(err => console.error(err));
      videoRefB.current?.play().catch(err => console.error(err));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (videoRefA.current) videoRefA.current.playbackRate = playbackSpeed;
    if (videoRefB.current) videoRefB.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const restartVideos = () => {
    if (videoRefA.current) videoRefA.current.currentTime = 0;
    if (videoRefB.current) videoRefB.current.currentTime = 0;
    if (!isPlaying) {
      videoRefA.current?.play().catch(err => console.error(err));
      videoRefB.current?.play().catch(err => console.error(err));
      setIsPlaying(true);
    }
  };

  // Timer logic per round
  useEffect(() => {
    if (showResults || isSubmitting || showRoundExplainer) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
      if (currentRoundIndex < VIDEO_ROUNDS.length - 1) {
        setTimeout(() => {
          setCurrentRoundIndex(currentRoundIndex + 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setIsSubmitting(true);
          setSelectedVerdict("Time Expired");
          setConfidenceScore([0]);
          setVerdict("Time Expired");
          setConfidence(0);
          completeLevel(3);

          setTimeout(() => {
            setIsSubmitting(false);
            setShowResults(true);
          }, 2000);
        }, 1500);
      }
    }
  }, [timeLeft, showResults, isSubmitting, isTimeUp, currentRoundIndex, showRoundExplainer, setVerdict, setConfidence, completeLevel]);

  const handleSelectVideoEvidence = (videoLabel: string) => {
    setFlaggedVideo(videoLabel);
    const evidenceKey = `R${currentRoundConfig.round}_${videoLabel}`;
    addFoundArtifact(evidenceKey);
    discoverEvidence('case-003', {
      id: evidenceKey,
      title: `${currentRoundConfig.difficulty}: Temporal Artifact in ${videoLabel}`,
      description: currentRoundConfig.description,
      category: 'temporal_video',
      explanation: 'Deepfake video artifacts exhibit subtle boundary flickering and non-physical specular highlights.',
    });
    setShowRoundExplainer(true);
  };

  const handleNextRound = () => {
    setShowRoundExplainer(false);
    if (currentRoundIndex < VIDEO_ROUNDS.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const handleSubmitFinalReport = () => {
    if (!selectedVerdict) return;

    videoRefA.current?.pause();
    videoRefB.current?.pause();
    setIsPlaying(false);

    setIsSubmitting(true);
    setVerdict(selectedVerdict);
    setConfidence(confidenceScore[0]);
    completeLevel(3);

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
                Completed All 3 Video Forensics Rounds (Cut ➔ Race ➔ Sushi)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Your Final Verdict</div>
              <div className={`font-bold ${isCorrect ? 'text-emerald-400' : isTimeOut ? 'text-red-400' : 'text-zinc-100'}`}>{selectedVerdict}</div>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-sm">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Confidence Rating</div>
              <div className="font-bold text-emerald-400 font-mono text-base">{confidenceScore[0]}%</div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-sm space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Learning Debrief: 3-Round Video Forensics
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Across Paper Cut, Fast Race, and Sushi Preparation rounds, you evaluated boundary edge bleed, frame-rate jittering, and pupil catchlight refractions. Continuous multi-frame evaluation trains digital investigators to catch even high-definition synthetic videos.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isTimeOut ? (
              <Button onClick={handleRetry} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-red-500 hover:bg-red-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-red-700">
                Retry Case 003
              </Button>
            ) : (
              <Button onClick={() => setShowContextCard(true)} className="h-12 px-6 text-sm font-heading tracking-widest uppercase bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-none border-b-4 border-r-4 border-emerald-700">
                Generate Learning Report
              </Button>
            )}
          </div>
        </motion.div>

        <ContextCardModal
          isOpen={showContextCard}
          title="Video Deepfakes & Multi-Stage Verification"
          context="Fraudulent schemes use deepfake videos to impersonate executives or public officials. Evaluating video evidence across easy, medium, and hard scenarios protects communities from video scams."
          onProceed={() => router.push("/results")}
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
            Evaluating 3-round temporal video forensics...
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

        {/* Left Column: Video Inspection Console */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Round Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 border rounded-sm font-mono text-xs uppercase tracking-widest flex items-center gap-2 bg-zinc-900/60 border-zinc-800">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Case 003 // Video Console</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-sm font-mono text-xs font-bold uppercase ${currentRoundConfig.badgeColor}`}>
                {currentRoundConfig.difficulty}
              </span>
            </div>

            {/* Round Switcher Tabs */}
            <div className="flex items-center border border-zinc-800 rounded-sm overflow-hidden bg-zinc-950">
              {VIDEO_ROUNDS.map((r, idx) => (
                <button
                  key={r.round}
                  onClick={() => setCurrentRoundIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase transition-all ${
                    currentRoundIndex === idx
                      ? "bg-emerald-500 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Round {r.round}
                </button>
              ))}
            </div>
          </div>

          {/* Round Objective Banner */}
          <div className={`p-4 border rounded-sm ${currentRoundConfig.color} space-y-1`}>
            <div className="text-xs font-bold font-heading uppercase tracking-widest flex items-center justify-between">
              <span>{currentRoundConfig.title}</span>
              <span className="font-mono text-[10px] uppercase">Step {currentRoundIndex + 1} of 3</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentRoundConfig.description}
            </p>
          </div>

          {/* Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/60 border border-zinc-800 p-2 rounded-sm backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                title={isPlaying ? "Pause Videos" : "Play Videos"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={restartVideos}
                className="p-2 border border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                title="Restart & Sync Videos"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.5 : 1.0)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors ${playbackSpeed === 0.5 ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
              >
                {playbackSpeed === 0.5 ? "Slow-Mo (0.5x)" : "Speed (1.0x)"}
              </button>

              <button
                onClick={() => setVisualBoost(!visualBoost)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors ${visualBoost ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
              >
                Visual Boost
              </button>

              <button
                onClick={() => setGridOverlay(!gridOverlay)}
                className={`px-3 py-1.5 border text-xs font-mono transition-colors ${gridOverlay ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
              >
                Grid Overlay
              </button>
            </div>
          </div>

          {/* Dual Video Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Video A */}
            <div className="flex flex-col gap-2">
              <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden group">
                <video
                  ref={videoRefA}
                  src={videoSrcA}
                  onError={handleVideoErrorA}
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover transition-all duration-300 ${visualBoost ? 'contrast-[1.4] brightness-[1.1] saturate-[1.1]' : ''}`}
                />
                {gridOverlay && (
                  <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 bg-[linear-gradient(to_right,#10b9810f_1px,transparent_1px),linear-gradient(to_bottom,#10b9810f_1px,transparent_1px)] bg-[size:32px_32px]" />
                )}
                <div className="absolute bottom-2 left-2 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-sm text-[10px] text-zinc-300 font-mono">
                  VIDEO_SOURCE_A // {currentRoundConfig.difficulty}
                </div>
              </div>
              <button
                onClick={() => handleSelectVideoEvidence("Video Source A")}
                className="py-2.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 font-mono text-xs uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5"
              >
                Flag Evidence in Video A
              </button>
            </div>

            {/* Video B */}
            <div className="flex flex-col gap-2">
              <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden group">
                <video
                  ref={videoRefB}
                  src={videoSrcB}
                  onError={handleVideoErrorB}
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover transition-all duration-300 ${visualBoost ? 'contrast-[1.4] brightness-[1.1] saturate-[1.1]' : ''}`}
                />
                {gridOverlay && (
                  <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 bg-[linear-gradient(to_right,#10b9810f_1px,transparent_1px),linear-gradient(to_bottom,#10b9810f_1px,transparent_1px)] bg-[size:32px_32px]" />
                )}
                <div className="absolute bottom-2 left-2 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-sm text-[10px] text-zinc-300 font-mono">
                  VIDEO_SOURCE_B // {currentRoundConfig.difficulty}
                </div>
              </div>
              <button
                onClick={() => handleSelectVideoEvidence("Video Source B")}
                className="py-2.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 font-mono text-xs uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5"
              >
                Flag Evidence in Video B
              </button>
            </div>
          </div>

          {/* Round Advance Bar */}
          {currentRoundIndex < VIDEO_ROUNDS.length - 1 && (
            <div className="flex justify-between items-center p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm">
              <span className="text-xs text-zinc-400">Ready for the next video challenge?</span>
              <Button
                onClick={handleNextRound}
                className="h-10 px-4 text-xs font-heading tracking-widest uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-none border border-zinc-700"
              >
                Advance to Round {currentRoundIndex + 2} <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Case 003 Video Forensics Panel */}
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
                <Video className="w-6 h-6 text-emerald-400" /> Case 003 Report
              </h2>
              <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed font-sans">
                Analyze temporal video streams across 3 difficulty rounds and establish your forensic verdict.
              </p>
            </div>

            {/* 3-Round Progress Tracker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-mono uppercase">
                <span className="text-zinc-300 font-medium">Rounds Progress</span>
                <span className="text-emerald-400 font-bold text-base">Round {currentRoundIndex + 1} of 3</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {VIDEO_ROUNDS.map((r, idx) => {
                  const isCurrent = currentRoundIndex === idx;
                  const isPassed = currentRoundIndex > idx;
                  return (
                    <div
                      key={r.round}
                      className={`p-2.5 border text-center rounded-sm transition-all ${
                        isCurrent
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold"
                          : isPassed
                          ? "bg-zinc-900/80 border-emerald-900/50 text-emerald-400"
                          : "bg-zinc-950 border-zinc-850 text-zinc-500"
                      }`}
                    >
                      <div className="text-xs font-mono font-bold uppercase">Round {r.round}</div>
                      <div className="text-[10px] font-mono truncate">{r.difficulty}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Round-Specific Video Identification */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-zinc-100 uppercase tracking-wider">
                  1. Round {currentRoundIndex + 1} Identification ({currentRoundConfig.difficulty})
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { key: "Video Source B is AI", label: "🔴 Video Source B contains Deepfake Artifacts" },
                  { key: "Video Source A is AI", label: "🔴 Video Source A contains Deepfake Artifacts" },
                  { key: "Both Authentic", label: "🟢 Both Videos are Authentic" },
                  { key: "Needs Verification", label: "🟡 Needs Verification / Unsubstantiated" },
                ].map((v) => {
                  const isSelected = selectedVerdict === v.key || flaggedVideo === (v.key.includes("Source B") ? "Video Source B" : v.key.includes("Source A") ? "Video Source A" : null);
                  return (
                    <button
                      key={v.key}
                      onClick={() => {
                        setSelectedVerdict(v.key as MILVerdict);
                        if (v.key.includes("Source B")) handleSelectVideoEvidence("Video Source B");
                        else if (v.key.includes("Source A")) handleSelectVideoEvidence("Video Source A");
                      }}
                      className={`p-4 border text-left text-sm md:text-base font-bold transition-all rounded-sm font-sans ${
                        isSelected
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40"
                          : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Certainty Calibration */}
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

            {/* Action Buttons */}
            {currentRoundIndex < VIDEO_ROUNDS.length - 1 ? (
              <Button
                onClick={handleNextRound}
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 font-bold text-base md:text-lg shadow-lg"
              >
                Lock Round {currentRoundIndex + 1} & Advance to Round {currentRoundIndex + 2} <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitFinalReport}
                disabled={!selectedVerdict}
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 disabled:opacity-50 font-bold text-base md:text-lg shadow-lg"
              >
                Submit Case 003 Report 🚀
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Round-Specific Explainer Modal */}
      <AnimatePresence>
        {showRoundExplainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="z-10 w-full max-w-xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl rounded-sm space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                    Forensic Explainer // Round {currentRoundConfig.round} ({currentRoundConfig.difficulty})
                  </span>
                  <h3 className="text-lg font-bold font-heading uppercase text-zinc-100">
                    {currentRoundConfig.explainer.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-sm flex items-center justify-between">
                  <span className="text-xs text-zinc-400">You Flagged: <strong className="text-zinc-100">{flaggedVideo}</strong></span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-sm font-bold ${flaggedVideo === currentRoundConfig.explainer.targetFake ? 'bg-emerald-500 text-zinc-950' : 'bg-amber-500 text-zinc-950'}`}>
                    {flaggedVideo === currentRoundConfig.explainer.targetFake ? "Correct Tell Discovered" : "Observation Recorded"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Key Synthetic Artifact Tells:</div>
                  <ul className="space-y-2">
                    {currentRoundConfig.explainer.keyTells.map((tell, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-2.5 border border-zinc-850 rounded-sm">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tell}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {currentRoundIndex < VIDEO_ROUNDS.length - 1 ? (
                  <Button
                    onClick={handleNextRound}
                    className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700"
                  >
                    Proceed to Round {currentRoundIndex + 2} <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowRoundExplainer(false)}
                    className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700"
                  >
                    Lock In Final Report <Check className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
