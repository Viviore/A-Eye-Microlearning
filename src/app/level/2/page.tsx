"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  Flag,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Search,
  User,
  FileText,
  ShieldAlert,
  Lightbulb,
  Plus,
  FileCheck,
  MessageCircle, 
  Repeat2, 
  Heart, 
  Eye, 
  Share
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppTransition } from "@/components/layout/TransitionProvider";
import case002Data from "@/data/case002.json";
import { CaseHeader } from "@/components/game/CaseHeader";
import { PostAuthorHeader } from "@/components/game/PostAuthorHeader";
import { SocialEngagementFooter } from "@/components/game/SocialEngagementFooter";
import { ObjectivePanel } from "@/components/game/ObjectivePanel";
import { EvidenceBoard } from "@/components/game/EvidenceBoard";
import { VerdictModalContainer, VerdictFeedback, GameOverModal } from "@/components/game/VerdictModal";
import { DecoyWarning } from "@/components/game/DecoyWarning";
import { DetectiveHandbook } from "@/components/game/DetectiveHandbook";
import { MockBrowserWindow } from "@/components/game/MockBrowserWindow";
import { useLevelScoring } from "@/hooks/useLevelScoring";

type VisualClue = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDecoy?: boolean;
  explanation: string;
  tactic?: string;
};

type ImageRound = {
  id: string;
  isTutorial: boolean;
  imageSrc: string;
  cluesNeeded: number;
  postAuthorName: string;
  postHandle: string;
  postText: string;
  clues: VisualClue[];
};

const IMAGE_ROUNDS: ImageRound[] = case002Data as ImageRound[];

const TACTIC_OPTIONS = [
  "Anatomical/Biological Error",
  "Text Rendering Error",
  "Physics/Shadow Violation",
  "Object Merging/Clipping",
];

const TACTIC_DESCRIPTIONS: Record<string, string> = {
  "Anatomical/Biological Error":
    "Extra or wrong body parts, impossible organic structures (e.g., extra fingers, impossible banana stem).",
  "Text Rendering Error":
    "Garbled text, mismatched fonts, corrupted signs, unscannable barcodes.",
  "Physics/Shadow Violation":
    "Impossible reflections, floating objects, wrong shadow direction.",
  "Object Merging/Clipping":
    "Things blending into each other, clipping through solid objects, impossible duplication.",
};



const DETECTIVE_TIPS = [
  "Don't believe a screenshot of a post. Anyone can fake a social media screenshot in minutes. Always look for a link to the real thing.",
  "Do a quick image search on Google. You might find out the 'breaking news' photo is actually from a movie set five years ago.",
  "If an image makes you instantly furious or terrified, pause. Fake news is designed to trigger your emotions so you share it without thinking.",
  "Use your common sense. If a photo claims it's a winter protest but people are wearing shorts, something is wrong.",
  "Check the background. Store names, street signs, and license plates can quickly reveal if a photo isn't where it claims to be.",
  "Watch the shadows. If someone says a picture was taken at noon but the shadows are super long, they might be lying.",
  "If a story sounds too crazy to be true, check if any major news channels are reporting it. Don't trust just one random blog.",
  "Beware of zoomed-in or cropped photos. What’s hiding just outside the frame can completely change the story.",
  "A real picture can still be a lie. The easiest way to trick people is to take an old, real photo and put a fake caption on it.",
  "Ask yourself: 'Why did the photographer only show me this?' Think about what the person taking the photo wants you to believe.",
  "Look for other angles. A massive public event should have hundreds of photos from different people, not just one blurry shot.",
  "Check reflections in windows or puddles. They can accidentally show the real background or the person taking the photo.",
  "Don't trust meme quotes. If a famous person's face is next to a shocking quote, it's probably fake. Try to find a video of them saying it.",
  "Look at the buildings. Do the streetlights or architecture actually match the country the photo claims to be in?",
  "Be skeptical of 'secret insider leaks'. Real whistleblowers usually go to journalists who can verify their story.",
  "If a photo perfectly confirms everything you already believe, be extra careful. Fake news often targets what we want to be true.",
  "Read the comments before sharing. Often, someone else has already debunked a fake image and posted proof.",
  "Just because a picture has a watermark doesn't mean it's official. Anyone can slap a news logo on a fake photo.",
  "Watch out for deepfakes. If a video looks a bit blurry around the edges of a face or their voice sounds robotic, question it.",
  "Trust your gut. If something about a photo just looks 'off' or artificial, take a minute to verify it before passing it along."
];

export default function Level2Page() {
  const router = useRouter();
  const { startTransition, startInPlaceTransition, isTransitioning } = useAppTransition();
  const { completeLevel, cumulativeScore, addCumulativeScore, addCase002Score, resetGame, playedCase002Rounds, markCase002RoundPlayed } = useGameStore();

  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [sessionRounds, setSessionRounds] = useState<ImageRound[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [toolUsed, setToolUsed] = useState(false);
  useEffect(() => {
    const tutorial = IMAGE_ROUNDS.find(r => r.isTutorial);
    let unplayed = IMAGE_ROUNDS.filter(r => !r.isTutorial && !playedCase002Rounds.includes(r.id));
    
    if (unplayed.length < 5) {
      unplayed = IMAGE_ROUNDS.filter(r => !r.isTutorial); // fallback if pool too small
    }
    
    const shuffled = [...unplayed].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    if (tutorial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionRounds([tutorial, ...selected]);
    } else {
      setSessionRounds(selected);
    }
    setIsReady(true);
  }, [playedCase002Rounds]);

  
  const currentRound = sessionRounds[currentRoundIndex];




  const [currentTip, setCurrentTip] = useState<string>("");



  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTip(
      DETECTIVE_TIPS[Math.floor(Math.random() * DETECTIVE_TIPS.length)]
    );
  }, [currentRoundIndex]);

  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [foundClues, setFoundClues] = useState<VisualClue[]>([]);
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [verdictStep, setVerdictStep] = useState<1 | 2>(1);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  
  const [shuffledTactics, setShuffledTactics] = useState<string[]>(TACTIC_OPTIONS);
  
  useEffect(() => {
    setShuffledTactics(prev => {
      const arr = [...TACTIC_OPTIONS];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }, [currentRoundIndex]);
  
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: React.ReactNode; scoreBadge?: React.ReactNode; forceNext?: boolean; retryButtonText?: string; nextButtonText?: string } | null>(null);
  const [foundDecoys, setFoundDecoys] = useState<VisualClue[]>([]);

  const [isTourActive, setIsTourActive] = useState(true);
  
  const {
    roundScore,
    setRoundScore,
    timeLeft,
    setTimeLeft,
    clickPopups: deductions, // Map clickPopups to deductions for UI compatibility
    scorePopups,
    triggerScoreAnimation,
    applyDeduction,
    resetScoring,
  } = useLevelScoring({
    isReady,
    hasTimer: true,
    isPaused: currentRound?.isTutorial || showVerdictModal || feedback !== null,
    onTimeout: () => {
      triggerScoreAnimation(-50);
      addCumulativeScore(-50);
      markCase002RoundPlayed(currentRound?.id || "");
      
      setShowVerdictModal(true);
      setFeedback({
        isSuccess: false,
        title: "TIME'S UP",
        message: "You ran out of time. AI misinformation spreads rapidly in seconds. Proceeding to the next round.",
        forceNext: true,
        nextButtonText: "Proceed to Next Photo",
        scoreBadge: (
          <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            -50 Points
          </span>
        )
      });
    }
  });

  const driverObjRef = useRef<any>(null);
  
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [magnifier, setMagnifier] = useState({
    show: false,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    imgWidth: 0,
    imgHeight: 0,
  });

  const isDriverInitialized = useRef(false);

  useEffect(() => {
    if (currentRound?.isTutorial && !isDriverInitialized.current && !isTransitioning) {
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
              
              startInPlaceTransition(() => {
                // Auto-advance past the tutorial round
                setCurrentRoundIndex(1);
                resetScoring();
                setFlaggedIds(new Set());
                setFoundClues([]);
                setFoundDecoys([]);
                setFeedback(null);
                setSelectedEvidenceId(null);
                setSelectedTactic(null);
                setShowVerdictModal(false);
                setToolUsed(false);
              });
            });
            navBtns.insertBefore(skipBtn, navBtns.firstChild);
          }
        },
        onDestroyed: () => {
          setIsTourActive(false);
        },
        steps: [
          { popover: { title: 'A-Eye Agent', description: "Welcome to Case 002! A viral photo claims to show an official receiving a secret cash payout." } },
          { element: '#tutorial-post', popover: { title: 'A-Eye Agent', description: "Is this a real scandal, or an AI-generated smear campaign? We need to look closely to find out.", side: "bottom" } },
          { element: '#tutorial-image-container', popover: { title: 'A-Eye Agent', description: "When analyzing photos, we use the Magnifier Tool. You will hover your mouse over the photo to activate it.", side: "bottom" } },
          { element: '#tutorial-image-container', popover: { title: 'A-Eye Agent', description: "Look for AI mistakes like double thumbs or warped backgrounds. When you spot one, you will click it to flag it as evidence.", side: "bottom" } },
          { element: '#tutorial-evidence', popover: { title: 'A-Eye Agent', description: "Flagged clues appear on the Evidence Board on the right.", side: "left" } },
          { element: '#tutorial-timer', popover: { title: 'A-Eye Agent', description: "Notice the timer above? Real cases only give you 60 seconds! Running out of time costs -50 points.", side: "bottom" } },
          { element: '#tutorial-tool', popover: { title: 'A-Eye Agent', description: "Need more time? You can use the +30s tool, but it costs -80 points! Only use it if you really have to.", side: "bottom" } },
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
  }, [currentRound?.isTutorial, isTransitioning]);

  useEffect(() => {
    if (currentRound?.isTutorial && !isTourActive && flaggedIds.size === 0 && !showVerdictModal) {
      const timeout = setTimeout(() => {
        const el = document.getElementById("tutorial-image-container");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isTourActive, currentRound, flaggedIds.size, showVerdictModal]);

  useEffect(() => {
    if (currentRoundIndex !== 0 && cumulativeScore + roundScore <= 0 && !feedback?.forceNext) {
      setShowGameOverModal(true);
    }
  }, [roundScore, cumulativeScore, currentRoundIndex, feedback?.forceNext]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setMagnifier({
      show: true,
      x,
      y,
      xPercent,
      yPercent,
      imgWidth: rect.width,
      imgHeight: rect.height,
    });
  };

  
  const handleClueClick = (clue: VisualClue) => {
    if (flaggedIds.has(clue.id)) return;
    if (currentRound.isTutorial && isTourActive)
      return;

    setFlaggedIds((prev) => new Set([...prev, clue.id]));
    setFoundClues((prev) => [...prev, clue]);
  };


  
  const handleSubmitVerdict = () => {
    if (!selectedTactic || !selectedEvidenceId) return;

    const selectedClue = currentRound.clues.find(c => c.id === selectedEvidenceId);
    const correctTactic = selectedClue?.tactic;
    
    if (selectedTactic === correctTactic) {
      if (!currentRound.isTutorial) {
        triggerScoreAnimation(roundScore);
        addCumulativeScore(roundScore);
        addCase002Score(roundScore);
        markCase002RoundPlayed(currentRound.id);
      }
      
      setFeedback({
        isSuccess: true,
        title:
          currentRoundIndex < sessionRounds.length - 1
            ? "VERDICT CORRECT!"
            : "CASE 002 COMPLETE!",
        message: "Great job! You correctly identified the fake image and the tactic used.",
        scoreBadge: (
          <span className="inline-block bg-[#10B981] text-white border-[3px] border-[#0F172A] px-3 py-1 font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            +{roundScore} Points
          </span>
        )
      });
    } else {
      applyDeduction(50);
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite the right analysis. Review your evidence and tactic match and try again.",
        scoreBadge: (
          <span className="inline-block border-[3px] border-[#0F172A] text-white px-3 py-1 bg-[#E11D48] font-black whitespace-nowrap shadow-[4px_4px_0px_0px_#0F172A] text-lg">
            -50 Points
          </span>
        )
      });
    }
  };


  
  const handleRetryRound = () => {
    setFeedback(null);
    setSelectedTactic(null);
    setShowVerdictModal(false);
    setShowGameOverModal(false);
    setShuffledTactics(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    
    if (timeLeft === 0 || cumulativeScore + roundScore <= 0) {
      const availableReplacementRounds = IMAGE_ROUNDS.filter(
        (r) => !r.isTutorial && !sessionRounds.some((sr) => sr.id === r.id)
      );

      if (availableReplacementRounds.length > 0) {
        const replacement = availableReplacementRounds[Math.floor(Math.random() * availableReplacementRounds.length)];
        const newSessionRounds = [...sessionRounds];
        newSessionRounds[currentRoundIndex] = replacement;
        setSessionRounds(newSessionRounds);
      }

      setFlaggedIds(new Set());
      setFoundClues([]);
      resetScoring();
      setToolUsed(false);
    }
  };


  
  const handleNextRound = () => {
    if (currentRoundIndex < sessionRounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      resetScoring();
      setToolUsed(false);
      setFlaggedIds(new Set());
      setFoundClues([]);
      setFoundDecoys([]);
      setFeedback(null);
      setSelectedEvidenceId(null);
      setSelectedTactic(null);
      setVerdictStep(1);
      setShowVerdictModal(false);
      setRoundScore(100);
      setTimeLeft(60);
      setToolUsed(false);
      setMagnifier({
        show: false,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        imgWidth: 0,
        imgHeight: 0,
      });
      setIsHoveringImage(false);
    } else {
      completeLevel(2);
      startTransition("/level/3", { variant: 'next-case' });
    }
  };

  if (!isReady || !currentRound) return null;

  return (
    <main
      className="min-h-[100dvh] bg-[#FAFAFA] bg-cubes text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-8 md:pb-12"
    >
      <div className="w-full max-w-[1200px] z-10 flex flex-col gap-8">
        
        {/* Header Info */}
        <CaseHeader 
          caseNumber="CASE 002"
          caseTitle="PHOTO INVESTIGATION"
          isTutorial={currentRound.isTutorial}
          currentRoundNumber={sessionRounds.slice(0, currentRoundIndex).filter(r => !r.isTutorial).length + 1}
          totalRounds={sessionRounds.filter(r => !r.isTutorial).length}
          score={cumulativeScore + roundScore}
          scorePopups={deductions}
          icon="fileText"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photo Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full">

          {/* Mock Social Post (Photo) */}
          <MockBrowserWindow id="tutorial-post">
            <PostAuthorHeader 
              authorName={currentRound.postAuthorName}
              handle={currentRound.postHandle}
              avatarColor="bg-[#FFB800]"
            >
              <div id="tutorial-tool" className="relative group">
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
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs font-bold font-mono py-1 px-2 rounded whitespace-nowrap shadow-lg">
                  +30s (-80 pts)
                </div>
              </div>

              <div 
                id="tutorial-timer" 
                className="text-right transition-all duration-500"
              >
                <div className="text-sm font-bold uppercase text-red-500">Timer</div>
                {currentRound.isTutorial ? (
                  <div className="text-lg font-black font-heading text-[#0F172A]/30 uppercase tracking-wider">Paused</div>
                ) : (
                  <div className="text-3xl font-black font-heading">{timeLeft}s</div>
                )}
              </div>
            </PostAuthorHeader>


            <p className="text-xl md:text-[22px] font-sans font-bold leading-[2.2] text-[#0F172A] mb-6">
              {currentRound.postText}
            </p>

            {/* Wrapper for Image and Magnifier */}
            <div className="relative w-full">
              {/* Interactive Image Container */}
            <div
              id="tutorial-image-container"
              className={`relative cursor-crosshair w-full aspect-auto transition-all ${isHoveringImage ? "cursor-none" : "cursor-crosshair"}`}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => {
                setIsHoveringImage(false);
                setMagnifier((p) => ({ ...p, show: false }));
              }}
              onMouseMove={handleMouseMove}
            >
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentRound.imageSrc}
                alt="Viral Photo"
                className="w-full h-auto block select-none border-b-[4px] border-transparent"
                onPointerDown={() => {
                  if (currentRound.isTutorial && isTourActive) return;
                  applyDeduction(10);
                }}
              />


              {/* Hotspots */}
              {currentRound.clues.map((clue, idx) => (
                <div
                  key={clue.id}
                  className={`absolute transition-all z-20 ${
                    flaggedIds.has(clue.id)
                      ? "bg-[#FFB800]/50"
                      : "bg-transparent"
                  }`}
                  style={{
                    left: `${clue.x}%`,
                    top: `${clue.y}%`,
                    width: `${clue.width}%`,
                    height: `${clue.height}%`,
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleClueClick(clue);
                  }}
                />
              ))}


            </div>

            {/* Magnifier Lens (Outside overflow-hidden to float above) */}
            {magnifier.show && (
                <div
                  className="absolute pointer-events-none z-40 border-[4px] border-[#0F172A] bg-white overflow-hidden rounded-full"
                    style={{
                      width: "250px",
                      height: "250px",
                      left: `${magnifier.x}px`,
                      top: `${magnifier.y}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 transition-transform duration-75 ease-out"
                      style={{
                        width:
                          magnifier.imgWidth > 0
                            ? `${magnifier.imgWidth * 3}px`
                            : "300%",
                        height:
                          magnifier.imgHeight > 0
                            ? `${magnifier.imgHeight * 3}px`
                            : "300%",
                        transform: `translate(calc(125px - ${magnifier.xPercent}%), calc(125px - ${magnifier.yPercent}%))`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentRound.imageSrc}
                        alt=""
                        className="w-full h-full block"
                      />
                      {currentRound.clues.map((clue, idx) => (
                        <div
                          key={clue.id}
                          className={`absolute transition-all z-10 ${
                            flaggedIds.has(clue.id)
                              ? "bg-[#FFB800]/50"
                              : ""
                          }`}
                          style={{
                            left: `${clue.x}%`,
                            top: `${clue.y}%`,
                            width: `${clue.width}%`,
                            height: `${clue.height}%`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white/50 z-20">
                      
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mix-blend-difference text-white"
                      >

                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>

                    <AnimatePresence>
                      {deductions.map((d) => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 1, y: -20, scale: 0.8 }}
                          animate={{ opacity: 0, y: -60, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 font-black font-heading text-4xl z-50 whitespace-nowrap pointer-events-none drop-shadow-[2px_2px_0_rgba(15,23,42,1)]"
                        >
                          {d.amount}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
            </div>

            {/* Decoy Warning */}
            {foundDecoys.length > 0 && <DecoyWarning />}

            {/* Social Engagement Footer */}
            <SocialEngagementFooter seed={currentRoundIndex + 1} />
          </MockBrowserWindow>
        </div>

        {/* Right Column: Evidence Board */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${currentRound.isTutorial ? "" : "sticky top-28"}`}>
          
          <ObjectivePanel>
            Use the Magnifier Tool to inspect the viral photo. Click on any
            areas that look like AI generation mistakes to flag them. Find at
            least <span className="bg-white px-2 py-0.5 border-[3px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] ml-1"><strong className="text-[#FF3366] font-black uppercase tracking-wider">
              {currentRound.cluesNeeded} visual clue{currentRound.cluesNeeded !== 1 ? "s" : ""}
            </strong></span> to proceed.
          </ObjectivePanel>

          <EvidenceBoard
            flaggedCount={foundClues.length}
            requiredCount={currentRound.cluesNeeded}
            toolsSlot={
              <BrutalButton
                id="tutorial-verdict-btn"
                onClick={() => {
                  setShowVerdictModal(true);
                }}
                disabled={foundClues.length < currentRound.cluesNeeded}
                variant="blue"
                size="lg"
                className="w-full flex items-center justify-center"
              >
                {foundClues.length >= currentRound.cluesNeeded ? <><FileCheck className="mr-3 w-6 h-6 inline" strokeWidth={2.5} /> File Verdict</> : "Gather Evidence First"}
              </BrutalButton>
            }
          >
            {foundClues.length === 0 && foundDecoys.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0F172A]/30">
                <Flag className="w-10 h-10 mb-2 opacity-50" strokeWidth={2} />
                <p className="font-heading font-bold text-lg uppercase tracking-widest text-center">
                  [ No clues flagged yet ]
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {[...foundClues, ...foundDecoys].map((clue, idx) => (
                  <motion.div
                    key={clue.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className={`p-3 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative ${clue.isDecoy ? "bg-red-400" : "bg-[#FFB800]"}`}
                  >
                    <div className="flex items-start gap-2">
                      {clue.isDecoy ? (
                        <XCircle className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" strokeWidth={2.5} />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" strokeWidth={2.5} />
                      )}
                      <div>
                        <p className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest mb-1">
                          {clue.isDecoy ? "Decoy Logged" : "Clue Flagged"}
                        </p>
                        <p className="text-lg font-sans font-black leading-snug text-[#0F172A]">
                          {clue.title}
                        </p>
                        <p className="text-[15px] text-[#1D2A3C] font-sans font-bold mt-2 pt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                          {clue.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </EvidenceBoard>

          {/* Detective's Handbook / Tip of the Day */}
          <DetectiveHandbook tip={currentTip} />
        </div>
        </div>
      </div>


      {/* Verdict Modal */}
      <VerdictModalContainer
        isOpen={showVerdictModal}
      >
        {!feedback ? (
          <>
            <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-3 uppercase tracking-wider text-center">
              Final Verdict Form
            </h2>

            <div className="space-y-4 font-sans">
              {verdictStep === 1 ? (
                <div>
                  <h3 className="font-bold text-xl mb-3 font-heading">
                    Which clue do you want to explain?
                  </h3>
                  <div className="flex flex-col gap-3">
                    {foundClues.map((clue) => {
                      let buttonClass = `p-4 border-[4px] font-bold font-sans transition-all text-[#0F172A] cursor-pointer text-left `;
                      
                      if (selectedEvidenceId === clue.id) {
                        buttonClass += "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] ";
                      } else if (currentRound.isTutorial) {
                        buttonClass += "bg-[#FFB800]/30 border-[#0F172A] border-solid shadow-[4px_4px_0px_0px_#0F172A] animate-pulse hover:bg-[#FFB800]/50 ";
                      } else {
                        buttonClass += "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)] ";
                      }

                      return (
                        <button
                          key={clue.id}
                          onClick={() => setSelectedEvidenceId(clue.id)}
                          className={buttonClass}
                        >
                          <div className="text-lg">{clue.title}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 pt-6 mt-4 border-t-[3px] border-dashed border-[#0F172A]/30">
                    <BrutalButton
                      onClick={() => setShowVerdictModal(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </BrutalButton>
                    <BrutalButton
                      onClick={() => setVerdictStep(2)}
                      disabled={!selectedEvidenceId}
                      variant="primary"
                      className="flex-1 disabled:bg-[#1D2A3C] disabled:text-white/70"
                    >
                      Next Step
                    </BrutalButton>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold text-xl mb-3 font-heading">
                    How Was This Faked?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shuffledTactics.map((tactic) => {
                      const correctTactic = currentRound.clues.find(c => c.id === selectedEvidenceId)?.tactic;
                      const isCorrect = tactic === correctTactic;
                      const isTutorial = currentRound.isTutorial && !isTourActive;
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

                  <div className="flex gap-4 pt-4 mt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                    <BrutalButton
                      onClick={() => {
                        setVerdictStep(1);
                        setSelectedTactic(null);
                      }}
                      variant="secondary"
                      className="flex-1"
                    >
                      Back
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
              )}
            </div>
          </>
        ) : (
          <VerdictFeedback
            isSuccess={feedback.isSuccess}
            title={feedback.title}
            message={feedback.message}
            scoreBadge={feedback.scoreBadge}
            forceNextAction={feedback.forceNext}
            onNext={handleNextRound}
            onRetry={handleRetryRound}
            retryButtonText={feedback.retryButtonText}
            nextButtonText={feedback.nextButtonText || "Next Photo"}
            isFinalRound={currentRoundIndex === sessionRounds.length - 1}
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
