"use client";

import { useState, useEffect, useRef } from "react";
import { driver } from "driver.js";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import case002Data from "@/data/case002.json";

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
  "AI Image Generation",
  "Deepfake",
  "Context Stripping",
  "Photoshopped Composite",
];

const TACTIC_DESCRIPTIONS: Record<string, string> = {
  "AI Image Generation":
    "Images created entirely by artificial intelligence, often containing physical impossibilities or warped artifacts.",
  Deepfake:
    "Using AI to map a person's face or voice onto another person's body.",
  "Context Stripping":
    "Using a genuine, real photo but claiming it represents a different event or time.",
  "Photoshopped Composite":
    "Manually splicing different real photos together using image editing software.",
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
  const { completeLevel, cumulativeScore, addCumulativeScore, addCase002Score, resetGame, playedCase002Rounds, markCase002RoundPlayed } = useGameStore();

  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [sessionRounds, setSessionRounds] = useState<ImageRound[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [toolUsed, setToolUsed] = useState(false);
  
  const [roundScore, setRoundScore] = useState(100);
  const [deductions, setDeductions] = useState<{id: number, amount: number}[]>([]);

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
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string } | null>(null);
  const [foundDecoys, setFoundDecoys] = useState<VisualClue[]>([]);

  const [isTourActive, setIsTourActive] = useState(true);
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
  const applyDeduction = (amount: number) => {
    if (!currentRound?.isTutorial) {
      setRoundScore((prev) => prev - amount);
      setDeductions((prev) => [...prev, { id: Date.now() + Math.random(), amount }]);
      setTimeout(() => {
        setDeductions((prev) => prev.slice(1));
      }, 2000);
    }
  };

  const handleTimeout = () => {
    applyDeduction(50);
    setTimeLeft(0);
    setFeedback({
      isSuccess: false,
      title: "TIME'S UP",
      message: "You ran out of time. The AI generates new content fast, you must be faster."
    });
  };

  useEffect(() => {
    if (!isReady || !currentRound || currentRound.isTutorial || showVerdictModal || feedback) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, currentRound, showVerdictModal, feedback]);



  useEffect(() => {
    if (currentRound?.isTutorial && !isDriverInitialized.current) {
      isDriverInitialized.current = true;
      setIsTourActive(true);

      const d = driver({
        showProgress: true,
        allowClose: false,
        disableActiveInteraction: true,
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
              setFlaggedIds(new Set());
              setFoundClues([]);
              setFoundDecoys([]);
              setFeedback(null);
              setSelectedEvidenceId(null);
              setSelectedTactic(null);
              setShowVerdictModal(false);
              setRoundScore(100);
              setTimeLeft(60);
              setToolUsed(false);
            });
            navBtns.insertBefore(skipBtn, navBtns.firstChild);
          }
        },
        onDestroyStarted: () => {
          driverObjRef.current?.destroy();
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
  }, [currentRound?.isTutorial]);

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
    if (!selectedTactic) return;

    const correctTactic = currentRound.clues[0]?.tactic;
    
    if (selectedTactic === correctTactic) {
      if (!currentRound.isTutorial) {
        addCumulativeScore(roundScore);
        addCase002Score(roundScore);
        markCase002RoundPlayed(currentRound.id);
      }
      
      setFeedback({
        isSuccess: true,
        title:
          currentRoundIndex < sessionRounds.length - 1
            ? "VERDICT VERIFIED"
            : "CASE CLOSED",
        message:
          "Outstanding work! You correctly identified how this image was faked.",
      });
    } else {
      applyDeduction(50);
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite the right analysis. Review your evidence and tactic match and try again.",
      });
    }
  };


  
  const handleRetryRound = () => {
    setFeedback(null);
    setSelectedTactic(null);
    setShowVerdictModal(false);
    
    if (timeLeft === 0) {
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
      setTimeLeft(60);
      setToolUsed(false);
      setRoundScore(100);
    }
  };


  
  const handleNextRound = () => {
    if (currentRoundIndex < sessionRounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setFlaggedIds(new Set());
      setFoundClues([]);
      setFoundDecoys([]);
      setFeedback(null);
      setSelectedEvidenceId(null);
      setSelectedTactic(null);
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
      router.push("/level/3");
    }
  };

  if (!isReady || !currentRound) return null;

  return (
    <main
      className="min-h-full bg-white text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
      style={{
        backgroundImage: "linear-gradient(to right, #0F172A12 1px, transparent 1px), linear-gradient(to bottom, #0F172A12 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        {/* Left Column: Photo Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1.5 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FFB800] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2"
              >
                
                <FileText className="w-4 h-4 text-[#0F172A]" />
                <span>CASE 002 // PHOTO INVESTIGATION</span>
              </div>
              
              <span
                className={`px-3 py-1 font-mono text-xs font-bold uppercase border-[4px] shadow-[4px_4px_0px_0px_#0F172A] border-[#0F172A] ${
                  currentRound.isTutorial ? "bg-white text-[#0F172A]" : "bg-[#FFB800] text-[#0F172A]"
                }`}
              >
                {currentRound.isTutorial
                  ? "TUTORIAL"
                  : `PHOTO ${sessionRounds.slice(0, currentRoundIndex).filter(r => !r.isTutorial).length + 1} / ${sessionRounds.filter(r => !r.isTutorial).length}`}
              </span>
            </div>

            <div
              id="tutorial-score"
              className="font-heading font-black text-xl md:text-2xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-1 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative"
            >
              <span>Score: </span>
              <span className="relative text-[#FFB800] drop-shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                {cumulativeScore + roundScore}
              </span>

              <AnimatePresence>
                {deductions.map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-black font-heading text-2xl z-50 whitespace-nowrap pointer-events-none"
                  >
                    -{d.amount}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Mock Social Post (Photo) */}

          <div
            id="tutorial-post"
            className="p-6 md:p-8 mt-6 bg-white transition-all duration-500 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A]"
          >
            <div className="flex items-center gap-4 mb-6 border-b-[4px] border-dashed border-[#0F172A] pb-4">
              <div
                className="w-14 h-14 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center overflow-hidden"
              >
                <img src={`https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(currentRound.postAuthorName)}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-2xl leading-tight text-[#0F172A] tracking-wide">
                  {currentRound.postAuthorName}
                </h4>
                
                <p className="text-[15px] font-sans font-bold text-[#0F172A]/60">
                  {currentRound.postHandle}
                </p>
              </div>
              
              <div className="ml-auto flex items-center gap-4 transition-all duration-300">
                <div id="tutorial-tool" className="relative group">
                  <Button
                    disabled={currentRound.isTutorial || toolUsed || (cumulativeScore + roundScore < 80)}
                    onClick={() => {
                      if (!toolUsed && (cumulativeScore + roundScore >= 80)) {
                        setToolUsed(true);
                        applyDeduction(80);
                        setTimeLeft((prev) => prev + 30);
                      }
                    }}
                    className="w-10 h-10 p-0 rounded-full bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB800]"
                    title="+30 Seconds (-80 pts)"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={3} />
                  </Button>
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
                  <div className="text-3xl font-black font-heading">{timeLeft}s</div>
                </div>
              </div>
            </div>


            <p className="text-xl font-sans leading-relaxed text-[#0F172A] mb-6">
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
                          -{d.amount}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
            </div>

            {/* Decoy Warning */}
            {foundDecoys.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-3 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-start gap-2 text-sm text-[#0F172A] -rotate-1 font-medium"
              >
                <ShieldAlert className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />
                <p>
                  <strong>Careful!</strong> You flagged something that looks
                  suspicious but is actually natural. That&apos;s a decoy. Keep
                  searching.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Evidence Board */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${currentRound.isTutorial ? "" : "sticky top-28"}`}>
          
          <div
            className="bg-[#FFB800] p-5 border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] relative"
          >
            <h3 className="font-heading font-black text-2xl mb-1 flex items-center gap-2 text-[#0F172A] uppercase tracking-wider">
              <Search className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} />{" "}
              Objective:
            </h3>
            <p className="text-[17px] text-[#0F172A]/90 font-bold font-sans leading-relaxed">
              Use the Magnifier Tool to inspect the viral photo. Click on any
              areas that look like AI generation mistakes to flag them. Find at
              least{" "}
              <strong className="text-[#0F172A] font-black underline decoration-solid decoration-2 underline-offset-4">
                {currentRound.cluesNeeded} visual clue
                {currentRound.cluesNeeded !== 1 ? "s" : ""}
              </strong>{" "}
              to proceed.
            </p>
          </div>

          <div
            id="tutorial-evidence"
            className="p-6 bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A]"
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

            <div className="min-h-[150px] border-[4px] border-dashed border-[#0F172A] p-4 space-y-3 bg-[linear-gradient(45deg,#0F172A11_25%,transparent_25%,transparent_50%,#0F172A11_50%,#0F172A11_75%,transparent_75%,transparent)] bg-[length:16px_16px] transition-all duration-500 relative"
            >
              {foundClues.length === 0 && foundDecoys.length === 0 ? (
                <p className="text-center text-[#0F172A]/40 font-mono text-sm absolute inset-0 flex items-center justify-center">
                  [ No clues flagged yet ]
                </p>
              ) : (
                <AnimatePresence>
                  {[...foundClues, ...foundDecoys].map((clue, idx) => (
                    <motion.div
                      key={clue.id}
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: idx % 2 === 0 ? 1 : -1,
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
                          
                          <p className="text-[14px] text-[#0F172A]/90 font-sans font-bold mt-1">
                            {showVerdictModal || feedback ? clue.explanation : "Analyze the image to determine why this is suspicious."}
                          </p>

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div 
              id="tutorial-verdict"
              className="mt-6 pt-6 border-t-[4px] border-dashed border-[#0F172A] transition-all duration-500"
            >
              <Button
                id="tutorial-verdict-btn"
                onClick={() => {
                  setShowVerdictModal(true);
                }}
                disabled={foundClues.length < currentRound.cluesNeeded}
                className="w-full h-16 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-[#0F172A] font-heading uppercase tracking-widest border-[4px] border-[#0F172A] font-bold text-2xl shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                {foundClues.length >= currentRound.cluesNeeded ? <><FileCheck className="mr-3 w-6 h-6 inline" strokeWidth={2.5} /> File Verdict</> : "Gather Evidence First"}
              </Button>
            </div>
          </div>

          {/* Detective's Handbook / Tip of the Day */}
          <div
            className="p-5 md:p-6 bg-[#FEF3C7] border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] relative transition-all hover:-translate-y-1 hover:shadow-[6px_8px_0px_0px_#0F172A]"
          >
            <h3 className="text-xl font-black font-heading uppercase tracking-wider flex items-center gap-2 text-[#0F172A] mb-3 border-b-[4px] border-dashed border-[#0F172A] pb-2">
              <Lightbulb className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
              Real-World Verification
            </h3>
            <p className="text-sm md:text-base font-sans font-bold text-[#0F172A]/80 leading-relaxed italic min-h-[4rem]">
              {currentTip ? `"${currentTip}"` : "..."}
            </p>
          </div>
        </div>
      </div>


      {/* Verdict Modal */}
      <AnimatePresence>
        {showVerdictModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm">
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
                    <div>
                      <h3 className="font-bold text-xl mb-3 font-heading">
                        How It Was Faked
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TACTIC_OPTIONS.map((tactic) => {
                          return (
                            <button
                              key={tactic}
                              onClick={() => setSelectedTactic(tactic)}
                              onMouseEnter={() => setHoveredTactic(tactic)}
                              onMouseLeave={() => setHoveredTactic(null)}
                              className={`p-3 border-[4px] font-bold font-sans transition-all text-[#0F172A] cursor-pointer ${
                                selectedTactic === tactic
                                  ? "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]"
                                  : "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
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

                    <div className="flex gap-4 pt-4 mt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                      <Button
                        onClick={() => setShowVerdictModal(false)}
                        disabled={currentRound.isTutorial && isTourActive}
                        className="flex-1 h-12 bg-white text-[#0F172A] border-[4px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] hover:bg-gray-100 transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitVerdict}
                        disabled={!selectedTactic}
                        className="flex-1 h-12 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-[#0F172A] border-[4px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
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
                        <CheckCircle2
                          className="w-12 h-12 text-[#0F172A]"
                          strokeWidth={2.5}
                        />
                      </div>
                    ) : (
                      <div className="relative inline-block w-24 h-24 mb-2">
                        <div 
                          className="absolute inset-0 bg-[#F59E0B] rounded-sm transform translate-x-1.5 translate-y-1.5 rotate-3"
                        />
                        <div 
                          className="absolute inset-0 bg-[#FEF3C7] border-[4px] border-[#F59E0B] rounded-sm flex items-center justify-center transform -rotate-1"
                        >
                          <XCircle
                            className="w-12 h-12 text-[#F59E0B]"
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <h2
                    className={`text-5xl font-black font-heading tracking-wider ${feedback.isSuccess ? "uppercase text-[#0F172A]" : "text-[#F59E0B]"}`}
                  >
                    {feedback.title}
                  </h2>
                  <p className={`text-xl font-bold max-w-md mx-auto ${feedback.isSuccess ? "font-sans text-[#0F172A]/80" : "font-heading text-[#334155] leading-relaxed"}`}>
                    {feedback.message}
                  </p>

                  <div className="pt-8">
                    {feedback.isSuccess ? (
                      <Button
                        onClick={handleNextRound}
                        className="w-full h-16 text-[#0F172A] text-2xl font-heading uppercase tracking-widest bg-[#10B981] hover:bg-[#10B981]/90 border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
                      >
                        {currentRoundIndex < IMAGE_ROUNDS.length - 1 ? (
                          <>
                            Next Photo{" "}
                            <ArrowRight
                              className="ml-3 w-7 h-7"
                              strokeWidth={2.5}
                            />
                          </>
                        ) : (
                          <>
                            Complete Case 002{" "}
                            <Trophy
                              className="ml-3 w-7 h-7"
                              strokeWidth={2.5}
                            />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleRetryRound}
                        className="w-full h-16 bg-white text-[#0F172A] text-2xl font-heading uppercase tracking-widest border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
                      >
                        <RotateCcw className="mr-3 w-7 h-7" strokeWidth={2.5} />{" "}
                        Retry Verdict
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
