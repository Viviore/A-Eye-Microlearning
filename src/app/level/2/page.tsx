"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, FileCheck, Search, User, FileText, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

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

const VISUAL_CLUES: VisualClue[] = [
  {
    id: "v-1",
    title: "6-Fingered Hand",
    x: 42, y: 48, width: 15, height: 15,
    explanation: "AI often struggles with hands. Counting the fingers reveals an unnatural 6-fingered structure holding the envelope.",
    tactic: "AI Image Generation"
  },
  {
    id: "v-2",
    title: "Garbled Text",
    x: 10, y: 15, width: 25, height: 20,
    explanation: "The text on the poster in the background is nonsensical. AI generators frequently produce garbled, unreadable text instead of real letters.",
    tactic: "AI Image Generation"
  },
  {
    id: "v-3",
    title: "Warped Hair",
    x: 65, y: 15, width: 15, height: 25,
    explanation: "The shadow figure's hair merges unnaturally with the background, a common AI artifact.",
    tactic: "AI Image Generation"
  },
  {
    id: "v-4",
    title: "Motion Blur (Decoy)",
    x: 75, y: 65, width: 15, height: 15,
    isDecoy: true,
    explanation: "This blurry spot looks suspicious, but it's just natural motion blur from a slow camera shutter, not an AI artifact.",
    tactic: "None"
  }
];

const TACTIC_OPTIONS = ["AI Image Generation", "Deepfake", "Context Stripping", "Photoshopped Composite"];

const TACTIC_DESCRIPTIONS: Record<string, string> = {
  "AI Image Generation": "Images created entirely by artificial intelligence, often containing physical impossibilities or warped artifacts.",
  "Deepfake": "Using AI to map a person's face or voice onto another person's body.",
  "Context Stripping": "Using a genuine, real photo but claiming it represents a different event or time.",
  "Photoshopped Composite": "Manually splicing different real photos together using image editing software."
};

const tutorialDialogs = [
  "Welcome to Case 002! A viral photo claims to show a local politician secretly accepting a bribe in a dark alley.",
  "Is this a real scandal, or an AI-generated smear campaign? We need to look closely to find out.",
  "When analyzing photos, we use the Magnifier Tool. Hover your mouse over the photo to activate it.",
  "Move the magnifier over the hand holding the envelope right here in the center.",
  "See that? A classic AI mistake: 6 fingers! Click the hand to flag it as evidence.",
  "Excellent! Your flagged clue has been added to the Evidence Board on the right.",
  "Now it's your turn. Scan the rest of the image and find at least 2 more visual clues. Watch out for decoys!",
  "You've found enough evidence! Click the 'File Verdict' button when you're ready to make the call.",
  "Just like before, choose your verdict and select your strongest piece of evidence.",
  "Finally, select the manipulation tactic used here. Submit your report when ready!"
];

const tutorialMascots = [
  "confident_expression.png",
  "determined_expression.png",
  "thinking_expression.png",
  "thinking_expression.png",
  "idea_expression.png",
  "confident_expression.png",
  "determined_expression.png",
  "idea_expression.png",
  "thinking_expression.png",
  "thinking_expression.png"
];

export default function Level2Page() {
  const router = useRouter();
  const { completeLevel } = useGameStore();

  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialCooldown, setTutorialCooldown] = useState(0);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const [magnifier, setMagnifier] = useState({ show: false, x: 0, y: 0, xPercent: 0, yPercent: 0, imgWidth: 0, imgHeight: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [foundClues, setFoundClues] = useState<VisualClue[]>([]);
  const [foundDecoys, setFoundDecoys] = useState<VisualClue[]>([]);
  
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [selectedVerdict, setSelectedVerdict] = useState<"Real" | "AI-Generated" | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{isSuccess: boolean; title: string; message: string} | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);

  useEffect(() => {
    if (tutorialStep === 3 && isHoveringImage) {
      setTutorialStep(4);
    }
    if ((tutorialStep === 4 || tutorialStep === 5) && isHoveringImage && !flaggedIds.has("v-1")) {
      const isOverHand = magnifier.xPercent > 35 && magnifier.xPercent < 60 && magnifier.yPercent > 40 && magnifier.yPercent < 65;
      if (isOverHand && tutorialStep === 4) {
        setTutorialStep(5);
      } else if (!isOverHand && tutorialStep === 5) {
        setTutorialStep(4);
      }
    }
    if (tutorialStep === 5 && flaggedIds.has("v-1")) {
      setTutorialStep(6);
      setTutorialCooldown(2);
    }
    if (tutorialStep === 7 && foundClues.length >= 3) {
      setTutorialStep(8);
    }
    if (tutorialStep === 8 && showVerdictModal) {
      setTutorialStep(9);
    }
    if (tutorialStep === 9 && selectedEvidenceId) {
      setTutorialStep(10);
    }
  }, [tutorialStep, isHoveringImage, magnifier, flaggedIds, foundClues, showVerdictModal, selectedEvidenceId]);

  useEffect(() => {
    if (tutorialCooldown > 0) {
      const timer = setTimeout(() => setTutorialCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tutorialCooldown]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setMagnifier({ show: true, x, y, xPercent, yPercent, imgWidth: rect.width, imgHeight: rect.height });
  };

  const handleClueClick = (clue: VisualClue) => {
    if (flaggedIds.has(clue.id)) return;
    if (tutorialStep < 7 && clue.id !== "v-1") return;
    
    setFlaggedIds(prev => new Set([...prev, clue.id]));
    
    if (clue.isDecoy) {
      setFoundDecoys(prev => [...prev, clue]);
    } else {
      setFoundClues(prev => [...prev, clue]);
    }
  };

  const handleSubmitVerdict = () => {
    if (!selectedVerdict || !selectedEvidenceId || !selectedTactic) return;
    
    const evidence = foundClues.find(c => c.id === selectedEvidenceId) || foundDecoys.find(c => c.id === selectedEvidenceId);
    if (!evidence) return;
    
    if (selectedVerdict === "AI-Generated" && evidence.tactic === selectedTactic && !evidence.isDecoy) {
      setFeedback({
        isSuccess: true,
        title: "CASE CLOSED",
        message: "Outstanding work! You correctly identified the image as AI-Generated and matched the correct visual evidence to the generation artifact."
      });
    } else {
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: evidence.isDecoy 
          ? "Careful! That's just motion blur from a slow camera shutter. Look for structural impossibilities, not just blur." 
          : "That's not quite the right analysis. Review your evidence and tactic match and try again."
      });
    }
  };

  const handleRetryRound = () => {
    setFeedback(null);
    setSelectedVerdict(null);
    setSelectedEvidenceId(null);
    setSelectedTactic(null);
    setShowVerdictModal(false);
  };

  const handleNextRound = () => {
    completeLevel(2);
    router.push('/level/3'); // Redirect to next level or post-quiz
  };

  return (
    <main 
      className="min-h-full bg-[#FAFAFA] text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
      style={{
        backgroundImage: "radial-gradient(#1D2A3C 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px"
      }}
    >
      <div className="w-full max-w-[1200px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        
        {/* Left Column: Photo Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div 
                className="px-3 py-1.5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FAFAFA] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Case 002 // Photo Investigation</span>
              </div>
              <span 
                className="px-3 py-1 font-mono text-xs font-bold uppercase border-[3px] shadow-[2px_2px_0px_0px_#0F172A] bg-blue-100 text-blue-700 border-blue-700"
                style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
              >
                LEVEL 2
              </span>
            </div>
          </div>
          
          <div 
            className="bg-[#FFB800] p-5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1 mt-4 relative"
            style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" />
            </div>

            <h3 className="font-heading font-bold text-2xl mb-1 flex items-center gap-2 text-[#0F172A]">
              <Search className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} /> Objective:
            </h3>
            <p className="text-[17px] text-[#0F172A]/90 font-medium font-sans leading-relaxed">
              Use the Magnifier Tool to inspect the viral photo. Click on any areas that look like AI generation mistakes to flag them. 
              Find at least <strong className="text-[#0F172A] font-bold underline decoration-wavy decoration-1 underline-offset-4">3 visual clues</strong> to proceed.
            </p>
          </div>
          
          {/* Mock Social Post (Photo) */}
          <div 
            id="tutorial-post"
            className={`p-6 md:p-8 mt-6 bg-white relative transition-all duration-500 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] -rotate-1 ${
              tutorialStep === 3 || tutorialStep === 4 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
            }`}
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
          >
            <div className="flex items-center gap-4 mb-6 border-b-[3px] border-dashed border-[#0F172A]/30 pb-4">
              <div 
                className="w-14 h-14 bg-[#1D2A3C] border-[3px] border-[#0F172A] flex items-center justify-center -rotate-3"
                style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
              >
                <User className="w-7 h-7 text-[#0F172A]" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-2xl leading-tight text-[#0F172A] tracking-wide">Anonymous Tipster</h4>
                <p className="text-[15px] font-sans font-bold text-[#0F172A]/60">@TruthBomber • 1 hr ago</p>
              </div>
            </div>
            
            <p className="text-xl font-sans leading-relaxed text-[#0F172A] mb-6">
              Caught red-handed! 📸 Can't believe they thought they could get away with this right before the elections. #Scandal
            </p>

            {/* Interactive Image Container */}
            <div 
              className={`relative w-full bg-gray-100 border-[3px] border-[#0F172A] overflow-hidden ${isHoveringImage ? 'cursor-none' : 'cursor-crosshair'}`}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => {
                setIsHoveringImage(false);
                setMagnifier(p => ({ ...p, show: false }));
              }}
              onMouseMove={handleMouseMove}
              style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
            >
              <img src="/case002/bribe.png" alt="Viral Photo" className="w-full h-auto block pointer-events-none select-none" />
              
              {/* Hotspots */}
              {VISUAL_CLUES.map(clue => (
                <div 
                  key={clue.id}
                  className={`absolute cursor-pointer transition-all z-10 ${
                    flaggedIds.has(clue.id) ? 'ring-4 ring-[#FFB800] bg-[#FFB800]/30' : 
                    (tutorialStep === 5 && clue.id === 'v-1') ? 'ring-4 ring-white animate-pulse bg-white/20' : ''
                  }`}
                  style={{ left: `${clue.x}%`, top: `${clue.y}%`, width: `${clue.width}%`, height: `${clue.height}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClueClick(clue);
                  }}
                />
              ))}

              {/* Magnifier Lens */}
              {magnifier.show && tutorialStep >= 3 && (
                <div 
                  className="absolute pointer-events-none z-30 border-[4px] border-white shadow-[0_0_0_2000px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)] rounded-full bg-no-repeat overflow-hidden transition-[background-position] duration-75 ease-out"
                  style={{
                    width: "250px",
                    height: "250px",
                    left: `${magnifier.x}px`,
                    top: `${magnifier.y}px`,
                    transform: "translate(-50%, -50%)",
                    backgroundImage: "url('/case002/bribe.png')",
                    backgroundSize: magnifier.imgWidth > 0 ? `${magnifier.imgWidth * 3}px ${magnifier.imgHeight * 3}px` : "300%",
                    backgroundPosition: `${magnifier.xPercent}% ${magnifier.yPercent}%`
                  }}
                >
                  <div className="absolute inset-0 ring-inset ring-2 ring-black/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
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
                <p><strong>Careful!</strong> You flagged something that looks suspicious but is actually natural. That's a decoy. Keep searching.</p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Right Column: Evidence Board */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
          
          <div 
            className="p-6 bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative rotate-1"
            style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0F172A]/10 -rotate-2 backdrop-blur-sm z-20" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold font-heading uppercase tracking-wide flex items-center gap-2 text-[#0F172A]">
                <Flag className="w-7 h-7 text-[#FFB800]" strokeWidth={2.5} /> Evidence Board
              </h2>
              <span 
                className="font-mono text-sm font-bold bg-[#0F172A] text-white px-3 py-1 shadow-[2px_2px_0px_0px_#FFB800]"
                style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
              >
                {foundClues.length} / 3 Clues
              </span>
            </div>
            
            <div className={`min-h-[300px] border-[3px] border-dashed border-[#0F172A]/30 p-4 space-y-3 bg-[radial-gradient(#0F172A33_1.5px,transparent_1.5px)] bg-[size:16px_16px] transition-all duration-500 relative ${
              tutorialStep === 6 ? "z-40 bg-white ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
            }`}
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              {foundClues.length === 0 && foundDecoys.length === 0 ? (
                <div className="h-full absolute inset-0 flex flex-col items-center justify-center text-[#0F172A]/40 space-y-3 p-6 text-center">
                  <Search className="w-12 h-12 opacity-50" />
                  <p className="font-bold uppercase tracking-widest text-sm">No evidence flagged</p>
                  <p className="text-xs opacity-70 font-sans">Use the magnifier to inspect the photo.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {[...foundClues, ...foundDecoys].map((clue, idx) => (
                    <motion.div
                      key={clue.id}
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: idx % 2 === 0 ? 1 : -1 }}
                      className={`p-3 border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] relative ${clue.isDecoy ? 'bg-red-100' : 'bg-[#FFB800]'}`}
                      style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                    >
                      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 ${clue.isDecoy ? 'bg-red-500/20' : 'bg-white/30'} rotate-3`} />
                      <div className="flex items-start gap-2">
                        {clue.isDecoy ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-xs font-bold font-mono text-[#0F172A]/70 uppercase tracking-widest mb-1">{clue.isDecoy ? "Decoy Logged" : "Clue Flagged"}</p>
                          <p className="text-lg font-sans font-bold leading-snug text-[#0F172A]">{clue.title}</p>
                          <p className="text-[14px] text-[#1D2A3C] font-sans font-medium mt-1">{clue.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className={`mt-6 transition-all duration-500 relative ${tutorialStep === 7 && foundClues.length >= 3 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02] bg-white p-2 rounded-xl" : "z-10"}`}>
              <Button 
                onClick={() => setShowVerdictModal(true)}
                disabled={foundClues.length < 3}
                className={`w-full h-16 font-black font-heading text-xl uppercase tracking-widest border-[3px] border-[#0F172A] transition-all active:translate-x-[6px] active:translate-y-[6px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  foundClues.length >= 3 
                    ? 'bg-[#FFB800] text-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A]' 
                    : 'bg-gray-200 text-gray-500 border-dashed shadow-none hover:translate-x-0 hover:translate-y-0'
                }`}
                style={{ borderRadius: "225px 15px 255px 15px / 15px 255px 15px 225px" }}
              >
                File Verdict
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Chat */}
      <AnimatePresence mode="wait">
        {!showVerdictModal && !feedback && (
          <motion.div 
            key="tutorial-dialog"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-4 md:bottom-8 z-50 flex items-end gap-3 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-auto lg:max-w-4xl transition-all duration-700 ease-in-out left-1/2 -translate-x-1/2 ${
              [6, 8, 9, 10].includes(tutorialStep) 
                ? "lg:left-12 lg:right-auto lg:translate-x-0 lg:flex-row" 
                : "lg:left-auto lg:right-12 lg:translate-x-0 lg:flex-row-reverse"
            }`}
          >
            {/* Mascot */}
            <div className="shrink-0 z-10 hidden lg:block" style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={tutorialMascots[tutorialStep - 1]}
                  initial={{ rotateY: 90, opacity: 0, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                  animate={{ rotateY: 0, opacity: 1, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                  exit={{ rotateY: -90, opacity: 0, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                  transition={{ duration: 0.15 }}
                  src={`/character_mascot/${tutorialMascots[tutorialStep - 1]}`} 
                  alt="A-Eye Agent" 
                  className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[4px_4px_0px_rgba(15,23,42,0.15)]"
                />
              </AnimatePresence>
            </div>
            
            {/* Speech Bubble */}
            <div 
              className="flex-1 bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] p-4 md:p-6 relative font-sans"
              style={{ borderRadius: "25px 255px 25px 225px / 255px 25px 225px 25px" }}
            >
              {/* Pointer Triangle (Desktop) */}
              <div className={`absolute bottom-8 w-0 h-0 border-y-[12px] border-y-transparent hidden lg:block transition-all duration-300 ${
                [6, 8, 9, 10].includes(tutorialStep) 
                  ? "border-r-[14px] border-r-[#0F172A] -left-[14px]" 
                  : "border-l-[14px] border-l-[#0F172A] -right-[14px]"
              }`}>
                <div className={`absolute -top-[9px] w-0 h-0 border-y-[9px] border-y-transparent z-10 ${
                  [6, 8, 9, 10].includes(tutorialStep) 
                    ? "border-r-[11px] border-r-white -left-[10px]" 
                    : "border-l-[11px] border-l-white -right-[10px]"
                }`} />
              </div>
              
              <div className="lg:hidden flex items-center gap-3 mb-3 pb-3 border-b-2 border-dashed border-[#0F172A]/10" style={{ perspective: "1000px" }}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={tutorialMascots[tutorialStep - 1]}
                    initial={{ rotateY: 90, opacity: 0, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                    animate={{ rotateY: 0, opacity: 1, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                    exit={{ rotateY: -90, opacity: 0, scaleX: [6, 8, 9, 10].includes(tutorialStep) ? -1 : 1 }}
                    transition={{ duration: 0.15 }}
                    src={`/character_mascot/${tutorialMascots[tutorialStep - 1]}`} 
                    alt="A-Eye Agent" 
                    className="w-10 h-10 object-contain shrink-0"
                  />
                </AnimatePresence>
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">A-Eye Agent</h3>
              </div>

              <h3 className="hidden lg:block font-heading font-bold text-xl md:text-2xl text-[#1D2A3C] mb-1 md:mb-2">A-Eye Agent</h3>
              <p className="text-base md:text-lg font-bold font-sans text-[#0F172A]/90 mb-4 leading-relaxed">
                {tutorialDialogs[tutorialStep - 1]}
              </p>
              
              <div className="flex justify-between items-center border-t-[3px] border-dashed border-[#0F172A]/20 pt-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-xs md:text-sm font-sans font-bold text-[#0F172A]/60 uppercase tracking-widest">
                    Step {tutorialStep} / {tutorialDialogs.length}
                  </span>
                  <button 
                    onClick={() => setShowSkipConfirm(true)} 
                    className="cursor-pointer text-xs md:text-sm font-sans font-bold text-[#0F172A]/40 hover:text-[#0F172A] underline decoration-[#0F172A]/30 hover:decoration-[#0F172A] underline-offset-4 transition-colors uppercase tracking-widest text-left"
                  >
                    Skip Tutorial
                  </button>
                </div>
                <Button 
                  onClick={() => setTutorialStep(prev => prev + 1)}
                  disabled={tutorialCooldown > 0 || [3, 4, 5, 7, 8, 9, 10].includes(tutorialStep)}
                  className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-[#0F172A] font-bold font-heading text-base md:text-lg uppercase tracking-widest border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:bg-[#1D2A3C] disabled:text-white/50 disabled:border-solid disabled:shadow-none h-10 px-4 md:px-6"
                  style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                >
                  {[3, 4, 5, 7, 8, 9, 10].includes(tutorialStep) 
                    ? "Action Required"
                    : tutorialCooldown > 0 
                      ? `Wait ${tutorialCooldown}s` 
                      : tutorialStep === tutorialDialogs.length ? "Got it!" : "Next"} 
                  {tutorialCooldown === 0 && ![3, 4, 5, 7, 8, 9, 10].includes(tutorialStep) && <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verdict Modal */}
      <AnimatePresence>
        {showVerdictModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="p-6 md:p-8 max-w-4xl w-full bg-[#FAFAFA] border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative"
              style={{ borderRadius: "25px 255px 15px 225px / 255px 15px 225px 15px" }}
            >
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#FFB800] border-4 border-[#0F172A] rounded-full shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
              </div>

              {!feedback ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-black font-heading text-[#0F172A] uppercase tracking-wider mb-2 border-b-4 border-[#0F172A] pb-4">
                    Official Verdict Report
                  </h2>
                  <p className="text-[#0F172A]/70 font-bold mb-8 font-sans">Review the evidence and submit your final analysis.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white border-[3px] border-[#0F172A] p-4 shadow-[4px_4px_0px_0px_#0F172A]" style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}>
                        <h3 className="font-heading font-bold text-xl uppercase mb-3 text-[#0F172A]">1. Select Verdict</h3>
                        <div className="flex gap-3">
                          {["Real", "AI-Generated"].map(v => (
                            <button
                              key={v}
                              onClick={() => setSelectedVerdict(v as "Real" | "AI-Generated")}
                              className={`flex-1 py-3 font-bold font-sans uppercase tracking-wider border-[3px] transition-all shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                                selectedVerdict === v 
                                  ? "bg-[#0F172A] text-white border-[#0F172A]" 
                                  : "bg-[#FAFAFA] text-[#0F172A] border-[#0F172A] hover:bg-[#FFB800]"
                              }`}
                              style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border-[3px] border-[#0F172A] p-4 shadow-[4px_4px_0px_0px_#0F172A]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                        <h3 className="font-heading font-bold text-xl uppercase mb-3 text-[#0F172A]">2. Primary Evidence</h3>
                        <div className="space-y-3">
                          {[...foundClues, ...foundDecoys].map(clue => (
                            <button
                              key={clue.id}
                              onClick={() => setSelectedEvidenceId(clue.id)}
                              className={`w-full text-left p-3 font-bold font-sans text-sm border-[3px] transition-all shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                                selectedEvidenceId === clue.id
                                  ? "bg-[#FFB800] border-[#0F172A] text-[#0F172A]"
                                  : "bg-[#FAFAFA] text-[#0F172A] border-[#0F172A] hover:bg-gray-100"
                              }`}
                              style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                            >
                              {clue.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border-[3px] border-[#0F172A] p-4 shadow-[4px_4px_0px_0px_#0F172A] h-full flex flex-col" style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}>
                        <h3 className="font-heading font-bold text-xl uppercase mb-3 text-[#0F172A]">3. Identify Tactic</h3>
                        <div className="space-y-3 flex-1">
                          {TACTIC_OPTIONS.map(tactic => (
                            <button
                              key={tactic}
                              onClick={() => setSelectedTactic(tactic)}
                              onMouseEnter={() => setHoveredTactic(tactic)}
                              onMouseLeave={() => setHoveredTactic(null)}
                              className={`w-full text-left p-3 font-bold font-sans text-sm border-[3px] transition-all shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                                selectedTactic === tactic
                                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                                  : "bg-[#FAFAFA] text-[#0F172A] border-[#0F172A] hover:bg-gray-100"
                              }`}
                              style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
                            >
                              {tactic}
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-[#FAFAFA] border-[3px] border-dashed border-[#0F172A]/30 min-h-[90px] text-sm font-bold font-sans text-[#0F172A] flex items-center justify-center text-center" style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}>
                          {hoveredTactic ? TACTIC_DESCRIPTIONS[hoveredTactic] : "Hover over a tactic to see its definition."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 mt-8 border-t-[3px] border-dashed border-[#0F172A]/30">
                    <Button onClick={() => setShowVerdictModal(false)} className="flex-1 h-14 bg-white text-[#0F172A] border-[3px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:bg-[#FFB800] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitVerdict} 
                      disabled={!selectedVerdict || !selectedEvidenceId || !selectedTactic} 
                      className="flex-1 h-14 bg-[#FFB800] text-[#0F172A] border-[3px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:bg-[#1D2A3C] disabled:text-white/50 disabled:shadow-none disabled:border-dashed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                      style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                    >
                      Submit Report
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="flex justify-center">
                    {feedback.isSuccess ? (
                      <div className="w-24 h-24 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A] rotate-2" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                        <CheckCircle2 className="w-12 h-12 text-[#0F172A]" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-[#FFB800]/20 border-[4px] border-[#FFB800] flex items-center justify-center shadow-[6px_6px_0px_0px_#FFB800] -rotate-2" style={{ borderRadius: "15px 225px 15px 255px / 15px 225px 15px 255px" }}>
                        <XCircle className="w-12 h-12 text-[#FFB800]" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <h2 className={`text-5xl font-black font-heading uppercase tracking-wider ${feedback.isSuccess ? 'text-[#0F172A]' : 'text-[#FFB800]'}`}>{feedback.title}</h2>
                  <p className="text-xl font-sans font-bold text-[#0F172A]/80 max-w-md mx-auto">{feedback.message}</p>
                  
                  <div className="pt-8">
                    {feedback.isSuccess ? (
                      <Button onClick={handleNextRound} className="w-full h-16 text-[#0F172A] text-2xl font-heading uppercase tracking-widest bg-[#10B981] hover:bg-[#10B981]/90 border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                        Complete Case 002 <Trophy className="ml-3 w-7 h-7" strokeWidth={2.5} />
                      </Button>
                    ) : (
                      <Button onClick={handleRetryRound} className="w-full h-16 bg-white text-[#0F172A] text-2xl font-heading uppercase tracking-widest border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:bg-[#1D2A3C] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all" style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}>
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

      <AnimatePresence>
        {showSkipConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="p-6 max-w-md w-full bg-[#FAFAFA] border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] relative -rotate-1 text-center" 
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-3 uppercase tracking-wider">Skip Training?</h2>
              <p className="text-lg font-bold font-sans text-[#0F172A]/80 mb-6 leading-relaxed">Are you sure you want to skip the rest of the tutorial?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => setShowSkipConfirm(false)} className="flex-1 h-12 bg-white hover:bg-gray-50 text-[#0F172A] font-bold font-heading text-lg border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider" style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}>Cancel</Button>
                <Button onClick={() => { setShowSkipConfirm(false); handleNextRound(); }} className="flex-1 h-12 bg-[#FFB800] hover:bg-[#FFB800]/90 text-[#0F172A] font-bold font-heading text-lg border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider" style={{ borderRadius: "225px 15px 255px 15px / 15px 255px 15px 225px" }}>Yes, Skip It</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
