"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Flag, ChevronRight, FileText, CheckCircle2, XCircle, User, ShieldAlert, ArrowRight, RotateCcw, Trophy, AlertCircle, FileCheck, MousePointer2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Data Structure
type TextSegment = {
  id: string;
  text: string;
  isClue?: boolean;
  isDecoy?: boolean;
  explanation?: string;
  tactic?: string;
};

type TextRound = {
  id: number;
  difficulty: "Tutorial" | "Easy" | "Medium" | "Hard";
  badgeColor: string;
  title: string;
  postAuthor: string;
  postHandle: string;
  postTime: string;
  segments: TextSegment[];
  sourceCheckContent: React.ReactNode;
  correctVerdict: "Real" | "Fake";
  cluesNeeded: number;
  tacticOptions: string[];
};

const TEXT_ROUNDS: TextRound[] = [
  {
    id: 0,
    difficulty: "Tutorial",
    badgeColor: "bg-[#0F172A]/10 text-[#0F172A] border-[#0F172A]",
    title: "Barangay Relief Goods",
    postAuthor: "Concerned Citizen",
    postHandle: "@truthseeker99",
    postTime: "2 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 1, // Tutorial just needs 1 clue
    tacticOptions: ["Vague Attribution", "Artificial Urgency", "Phishing Link"],
    segments: [
      { id: "t-1", text: "ALERT! Our barangay is giving out FAKE relief goods to flood victims! " },
      { 
        id: "t-2", 
        text: "An unnamed barangay official stated that the distributed items were 'expired and unsafe for consumption.' ", 
        isClue: true, 
        explanation: "Vague attribution: Which official? Real alerts name the source.",
        tactic: "Vague Attribution"
      },
      { id: "t-3", text: "Share this now before more people get hurt!" }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official Barangay Page:</strong> "No relief goods have been distributed yet. Distribution starts tomorrow."</p>
        <p className="text-[#0F172A]"><strong>Local News:</strong> No reports of expired goods in this area.</p>
      </div>
    )
  },
  {
    id: 1,
    difficulty: "Easy",
    badgeColor: "bg-green-100 text-green-700 border-green-700",
    title: "Scam Scholarship Post",
    postAuthor: "University Admissions Update",
    postHandle: "@UniScholarshipsPh",
    postTime: "4 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Advance Fee Fraud", "Artificial Urgency", "Unofficial Domain", "Vague Attribution"],
    segments: [
      { 
        id: "1-1", 
        text: "ALERT! Ateneo de Manila University is opening 50 FREE scholarship slots for incoming students! ", 
        isDecoy: true,
        explanation: "The university name is real, but scammers often use real institutions to build trust."
      },
      { 
        id: "1-2", 
        text: "To secure your slot, applicants must first send a ₱500 'processing fee' to GCash number 09123456789. ", 
        isClue: true,
        explanation: "Real scholarships never ask for a processing fee via personal mobile wallets.",
        tactic: "Advance Fee Fraud"
      },
      { 
        id: "1-3", 
        text: "Hurry and send your payment before tonight's deadline to guarantee your future! ", 
        isClue: true,
        explanation: "Artificial urgency ('tonight's deadline') is a classic scam tactic to rush victims.",
        tactic: "Artificial Urgency"
      },
      { 
        id: "1-4", 
        text: "PM us your receipt. No official website link available at the moment.", 
        isClue: true,
        explanation: "Legitimate scholarships are always hosted on the official university domain, not via PM.",
        tactic: "Unofficial Domain"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official University Website:</strong> "We do not ask for GCash processing fees. All scholarship applications are processed through our official portal."</p>
        <p className="text-[#0F172A]"><strong>Scam Alert Database:</strong> Mobile number 09123456789 has been flagged multiple times for 'Advance Fee' fraud.</p>
      </div>
    )
  },
  {
    id: 2,
    difficulty: "Medium",
    badgeColor: "bg-[#FFB800] text-[#0F172A] border-[#0F172A]",
    title: "Fake Celebrity Endorsement",
    postAuthor: "Health & Wellness Daily",
    postHandle: "@HealthyLifePh",
    postTime: "12 hrs ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Fabricated Quote", "Unregistered Product", "Suspicious Storefront", "Artificial Urgency"],
    segments: [
      { id: "2-1", text: "Have you tried this new miracle cure? " },
      { 
        id: "2-2", 
        text: "Even Dingdong Dantes swears by it! ", 
        isDecoy: true,
        explanation: "The celebrity's name is correctly used, but their endorsement is entirely fabricated."
      },
      { 
        id: "2-3", 
        text: "\"I was struggling with high blood sugar until I found GlucoCure Max. It completely reversed my diabetes in 2 weeks!\" ", 
        isClue: true,
        explanation: "The quote is entirely fabricated and doesn't appear on any of his official channels.",
        tactic: "Fabricated Quote"
      },
      { 
        id: "2-4", 
        text: "This FDA-approved herbal supplement is selling out fast. ", 
        isClue: true,
        explanation: "Checking the FDA database reveals this product is NOT registered.",
        tactic: "Unregistered Product"
      },
      { 
        id: "2-5", 
        text: "Buy it now exclusively at this unverified Shopify link: buy-gluco-max-now.shop.co", 
        isClue: true,
        explanation: "The link points to a sketchy, unverified storefront rather than an official brand page or pharmacy.",
        tactic: "Suspicious Storefront"
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Celebrity Official Page:</strong> "I am not endorsing any diabetes supplement. Please beware of fake ads using my name."</p>
        <p className="text-[#0F172A]"><strong>FDA Philippines Database:</strong> 0 results found for "GlucoCure Max". Not a registered food or drug product.</p>
      </div>
    )
  },
  {
    id: 3,
    difficulty: "Hard",
    badgeColor: "bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]",
    title: "Fake Official Advisory",
    postAuthor: "Provincial Gov Updates",
    postHandle: "@ProvGov_Updates",
    postTime: "1 hr ago",
    correctVerdict: "Fake",
    cluesNeeded: 2,
    tacticOptions: ["Unverified Claim", "Fabricated Memo", "Advance Fee Fraud", "Fabricated Quote"],
    segments: [
      { 
        id: "3-1", 
        text: "Due to the incoming Super Typhoon, ", 
        isDecoy: true,
        explanation: "The typhoon itself is a real, ongoing weather event. Flagging the typhoon is wrong, only the suspension claim is fake."
      },
      { 
        id: "3-2", 
        text: "all classes (all levels) and government work in the province are SUSPENDED tomorrow. ", 
        isClue: true,
        explanation: "No matching post exists on the official government social media account.",
        tactic: "Unverified Claim"
      },
      {
        id: "3-3",
        text: "Per Memo No. 45-B, signed by the Mayor. ",
        isClue: true,
        explanation: "The memo number doesn't match official records (checkable via Source Check).",
        tactic: "Fabricated Memo"
      },
      {
        id: "3-4",
        text: "Stay safe and stay indoors! Share to inform others."
      }
    ],
    sourceCheckContent: (
      <div className="space-y-3 font-sans">
        <h4 className="font-bold border-b-2 border-dashed border-[#0F172A] pb-2 text-[#0F172A]">Verified Sources:</h4>
        <p className="text-[#0F172A]"><strong>Official Gov PIO Page:</strong> "No suspension of classes has been announced yet. We are monitoring the weather."</p>
        <p className="text-[#0F172A]"><strong>Memo Database:</strong> Memo No. 45-B was issued last year for a completely different event.</p>
      </div>
    )
  }
];

const TACTIC_DESCRIPTIONS: Record<string, string> = {
  "Vague Attribution": "Citing unnamed or generic sources (e.g. 'an official') to avoid verification.",
  "Artificial Urgency": "Creating fake time pressure (e.g. 'hurry', 'ends tonight') to rush decisions.",
  "Phishing Link": "Using deceptive URLs that look official but steal your information.",
  "Advance Fee Fraud": "Asking for an upfront payment or processing fee for a 'free' reward.",
  "Unofficial Domain": "Directing users to sketchy, non-official websites or personal messages.",
  "Fabricated Quote": "Inventing fake statements and attributing them to celebrities or authority figures.",
  "Unregistered Product": "Selling items claiming health benefits without FDA approval or registration.",
  "Suspicious Storefront": "Using unverified, temporary e-commerce sites to sell dubious products.",
  "Unverified Claim": "Making bold, official-sounding statements without any supporting evidence.",
  "Fabricated Memo": "Referencing fake official documents or memo numbers to appear legitimate."
};

export default function Level1Page() {
  const router = useRouter();
  const completeLevel = useGameStore((state) => state.completeLevel);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const currentRound = TEXT_ROUNDS[currentRoundIndex];
  
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [foundClues, setFoundClues] = useState<TextSegment[]>([]);
  const [foundDecoys, setFoundDecoys] = useState<TextSegment[]>([]);
  
  const [sourceCheckOpen, setSourceCheckOpen] = useState(false);
  const [hasOpenedSourceCheck, setHasOpenedSourceCheck] = useState(false);
  
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [selectedVerdict, setSelectedVerdict] = useState<"Real" | "Fake" | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [hoveredTactic, setHoveredTactic] = useState<string | null>(null);
  
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string } | null>(null);
  
  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialCooldown, setTutorialCooldown] = useState(3);
  
  const tutorialDialogs = [
    "Welcome recruit! I'm your A-Eye Agent. Your job is to review suspicious social media posts.",
    "Read the post on the left. It looks suspicious, but we shouldn't jump to conclusions.",
    "Always gather facts first! Click 'Open Source Check' on the right to see verified information.",
    "Read the verified sources carefully and cross-check them against the claims made in the post.",
    "See that highlighted sentence? It contradicts our verified facts! Click it to flag it as a clue.",
    "Great! Your flagged clues appear on the Evidence Board. Try to find the real clues, but watch out for decoys!",
    "Once you have enough evidence and checked the sources, click 'File Verdict' to submit your report. Good luck!"
  ];

  const tutorialMascots = [
    "confident_expression.png",
    "determined_expression.png",
    "thinking_expression.png",
    "thinking_expression.png",
    "idea_expression.png",
    "confident_expression.png",
    "idea_expression.png"
  ];
  
  useEffect(() => {
    if (currentRoundIndex === 0 && tutorialStep <= tutorialDialogs.length) {
      setTutorialCooldown(3);
      const interval = setInterval(() => {
        setTutorialCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tutorialStep, currentRoundIndex, tutorialDialogs.length]);
  
  useEffect(() => {
    if (currentRoundIndex === 0 && tutorialStep === 4) {
      setSourceCheckOpen(true);
      setHasOpenedSourceCheck(true);
    }
  }, [tutorialStep, currentRoundIndex]);
  
  const handleFlagSegment = (segment: TextSegment) => {
    if (currentRoundIndex === 0 && tutorialStep < 5) return;
    if (flaggedIds.has(segment.id)) return;
    
    setFlaggedIds((prev) => new Set(prev).add(segment.id));
    
    if (segment.isClue) {
      setFoundClues((prev) => [...prev, segment]);
    } else if (segment.isDecoy) {
      setFoundDecoys((prev) => [...prev, segment]);
    }
  };
  
  const handleOpenSourceCheck = () => {
    setSourceCheckOpen(!sourceCheckOpen);
    if (!sourceCheckOpen) setHasOpenedSourceCheck(true);
  };
  
  const canFileVerdict = foundClues.length >= currentRound.cluesNeeded && hasOpenedSourceCheck;
  
  const handleSubmitVerdict = () => {
    if (!selectedEvidenceId || !selectedTactic) return;
    
    const evidence = foundClues.find(c => c.id === selectedEvidenceId);
    if (!evidence) return;
    
    if (evidence.tactic === selectedTactic) {
      setFeedback({
        isSuccess: true,
        title: "Verdict Correct!",
        message: "Great job! You correctly identified the fake post and the tactic used."
      });
    } else {
      setFeedback({
        isSuccess: false,
        title: "Analysis Failed",
        message: "That's not quite the right manipulation tactic for this evidence. Review the quote and try again."
      });
    }
  };
  
  const handleNextRound = () => {
    if (currentRoundIndex < TEXT_ROUNDS.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
      setFlaggedIds(new Set());
      setFoundClues([]);
      setFoundDecoys([]);
      setSourceCheckOpen(false);
      setHasOpenedSourceCheck(false);
      setShowVerdictModal(false);
      setSelectedVerdict(null);
      setSelectedEvidenceId(null);
      setSelectedTactic(null);
      setFeedback(null);
    } else {
      completeLevel(1);
      router.push('/level/2');
    }
  };
  
  const handleRetryRound = () => {
    setShowVerdictModal(false);
    setSelectedVerdict(null);
    setSelectedEvidenceId(null);
    setSelectedTactic(null);
    setFeedback(null);
    // Keep the clues but reset verdict!
  };

  return (
    <main 
      className="min-h-full bg-[#FAFAFA] text-[#0F172A] flex flex-col items-center pt-8 p-4 md:p-8 relative overflow-hidden font-sans pb-32"
      style={{
        backgroundImage: "radial-gradient(#1D2A3C 1.5px, transparent 1.5px)",
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
                className="px-3 py-1.5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FAFAFA] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Case 001 // Text Feed</span>
              </div>
              <span 
                className={`px-3 py-1 font-mono text-xs font-bold uppercase border-[3px] shadow-[2px_2px_0px_0px_#0F172A] ${currentRound.badgeColor}`}
                style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
              >
                {currentRound.difficulty}
              </span>
            </div>
            
          </div>
          
          <div 
            className="bg-[#FFB800] p-5 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1 mt-4 relative"
            style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
          >
            {/* Decorative Tack */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FFB800] rounded-full border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] z-20">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-50" />
            </div>

            <h3 className="font-heading font-bold text-2xl mb-1 flex items-center gap-2 text-[#0F172A]">
              <Search className="w-5 h-5 text-[#FFB800]" strokeWidth={2.5} /> Objective:
            </h3>
            <p className="text-[17px] text-[#0F172A]/90 font-medium font-sans leading-relaxed">
              Read the post carefully. Click on any sentence that looks suspicious to flag it as evidence. 
              Find at least <strong className="text-[#FFB800] font-bold underline decoration-wavy decoration-1 underline-offset-4">{currentRound.cluesNeeded} real {currentRound.cluesNeeded === 1 ? 'clue' : 'clues'}</strong> to proceed.
            </p>
          </div>
          
          {/* Mock Social Post */}
          <div 
            className={`p-6 md:p-8 mt-6 bg-white relative transition-all duration-500 border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] -rotate-1 ${
              currentRoundIndex === 0 && tutorialStep === 2 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
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
                className="mt-6 p-3 bg-[#FFB800]/10 border-2 border-[#FFB800] wobbly-border flex items-start gap-2 text-sm"
              >
                <ShieldAlert className="w-5 h-5 text-[#FFB800] shrink-0 mt-0.5" />
                <p><strong>Careful!</strong> You flagged something that looks suspicious but is actually true. That's a decoy. Focus on the core claims.</p>
              </motion.div>
            )}
          </div>


        </div>
        
        {/* Right Column: Evidence Board & Source Check */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
          
          <div 
            className="p-6 bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative rotate-1"
            style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
          >
            {/* Tape Decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0F172A]/10 -rotate-2 backdrop-blur-sm z-20" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold font-heading uppercase tracking-wide flex items-center gap-2 text-[#0F172A]">
                <Flag className="w-7 h-7 text-[#FFB800]" strokeWidth={2.5} /> Evidence Board
              </h2>
              <span 
                className="font-mono text-sm font-bold bg-[#0F172A] text-white px-3 py-1 shadow-[2px_2px_0px_0px_#FFB800]"
                style={{ borderRadius: "225px 25px 215px 25px / 25px 215px 25px 225px" }}
              >
                {foundClues.length} / {currentRound.cluesNeeded} Clues
              </span>
            </div>
            
            <div className={`min-h-[150px] border-[3px] border-dashed border-[#0F172A]/30 p-4 space-y-3 bg-[radial-gradient(#0F172A33_1.5px,transparent_1.5px)] bg-[size:16px_16px] transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 6 ? "z-40 bg-white ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
            }`}
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
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
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: idx % 2 === 0 ? 1 : -1 }}
                      className="bg-[#FFB800] p-3 border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] relative"
                      style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#FFB800]/20 rotate-3" />
                      <p className="text-xs font-bold font-mono text-[#0F172A]/70 mb-1 uppercase tracking-widest">Found Clue:</p>
                      <p className="text-lg font-sans font-bold leading-snug text-[#0F172A]">"{clue.text.substring(0, 50)}..."</p>
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
            
            <div className={`mt-6 space-y-4 transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 3 ? "z-40 bg-white p-2 -m-2 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
            }`}
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <Button
                onClick={handleOpenSourceCheck}
                className={`w-full h-14 font-heading text-xl tracking-wide uppercase border-[3px] border-[#0F172A] font-bold shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all ${
                  sourceCheckOpen ? "bg-[#FFB800] text-[#0F172A] hover:bg-[#FFB800]/90" : "bg-white text-[#0F172A] hover:bg-gray-50"
                }`}
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
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
                      className={`p-5 bg-white border-[3px] border-[#0F172A] mt-2 font-sans text-lg text-[#0F172A] transition-all duration-500 relative ${
                        currentRoundIndex === 0 && tutorialStep === 4 ? "z-40 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
                      }`}
                      style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                    >
                      {currentRound.sourceCheckContent}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className={`mt-6 pt-6 border-t-[3px] border-dashed border-[#0F172A]/30 transition-all duration-500 relative ${
              currentRoundIndex === 0 && tutorialStep === 7 ? "z-40 bg-white p-2 -m-2 ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#FAFAFA] scale-[1.02]" : "z-10"
            }`}>
              <Button
                onClick={() => setShowVerdictModal(true)}
                disabled={!canFileVerdict}
                className="w-full h-16 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-white font-heading uppercase tracking-widest border-[3px] border-[#0F172A] font-bold text-2xl shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="p-5 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] relative rotate-1"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              {!feedback ? (
                <>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#0F172A]/10 -rotate-2 backdrop-blur-sm z-20" />
                  
                  <h2 className="text-3xl font-black font-heading text-[#0F172A] mb-4 border-b-[4px] border-dashed border-[#0F172A]/30 pb-3 uppercase tracking-wider text-center">
                    Final Verdict Form
                  </h2>
                  
                  <div className="space-y-4 font-sans">
                    <div>
                      <h3 className="font-bold text-xl mb-3 font-heading">Step 1: Select your strongest piece of evidence:</h3>
                      <div className="space-y-4">
                        {foundClues.map(clue => (
                          <button
                            key={clue.id}
                            onClick={() => setSelectedEvidenceId(clue.id)}
                            className={`w-full p-3 border-[3px] text-left transition-all ${
                              selectedEvidenceId === clue.id
                                ? "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1"
                                : "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
                            }`}
                            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                          >
                            <span className="text-lg font-bold block text-[#0F172A]">"{clue.text.trim()}"</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Step 2: Tactic */}
                    {selectedEvidenceId && (
                      <div className="pt-4 border-t-[3px] border-dashed border-[#0F172A]/30 mt-4">
                        <h3 className="font-bold text-xl mb-3 font-heading">Step 2: Identify the manipulation tactic:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentRound.tacticOptions.map(tactic => (
                            <button
                              key={tactic}
                              onClick={() => setSelectedTactic(tactic)}
                              onMouseEnter={() => setHoveredTactic(tactic)}
                              onMouseLeave={() => setHoveredTactic(null)}
                              className={`p-3 border-[3px] font-bold font-sans transition-all text-[#0F172A] ${
                                selectedTactic === tactic
                                  ? "bg-[#FFB800] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1"
                                  : "bg-white border-dashed border-[#0F172A]/50 hover:border-solid hover:border-[#0F172A] hover:shadow-[4px_4px_0px_0px_rgba(45,45,45,0.2)]"
                              }`}
                              style={{ borderRadius: "15px 255px 15px 225px / 225px 15px 255px 15px" }}
                            >
                              {tactic}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-4 h-12 flex items-center justify-center p-2 bg-[#0F172A]/5 border-[2px] border-dashed border-[#0F172A]/20 rounded-sm italic text-sm text-[#0F172A]/80 text-center transition-all">
                          {hoveredTactic 
                            ? TACTIC_DESCRIPTIONS[hoveredTactic] 
                            : "Hover over a tactic to see its definition."}
                        </div>
                      </div>
                    )}
                    
                    {/* Submit */}
                    <div className="flex gap-4 pt-4 mt-2 border-t-[3px] border-dashed border-[#0F172A]/30">
                      <Button
                        onClick={() => setShowVerdictModal(false)}
                        className="flex-1 h-12 bg-white text-[#0F172A] border-[3px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] hover:bg-[#FFB800] hover:text-[#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitVerdict}
                        disabled={!selectedEvidenceId || !selectedTactic}
                        className="flex-1 h-12 bg-[#FFB800] hover:bg-[#FFB800]/90 disabled:bg-[#1D2A3C] disabled:text-white/70 disabled:border-dashed disabled:shadow-none text-[#0F172A] border-[3px] border-[#0F172A] font-bold font-heading text-xl uppercase tracking-wider shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                        style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
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
                        className="w-24 h-24 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A] rotate-2"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-[#FFB800]" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div 
                        className="w-24 h-24 bg-[#FFB800]/20 border-[4px] border-[#FFB800] flex items-center justify-center shadow-[6px_6px_0px_0px_#FFB800] -rotate-2"
                        style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
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
                        className="w-full h-16 bg-[#FFB800] text-white text-2xl font-heading uppercase tracking-widest border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        {currentRoundIndex < TEXT_ROUNDS.length - 1 ? (
                          <span className="flex items-center justify-center">Next Round <ArrowRight className="ml-3 w-7 h-7" strokeWidth={2.5} /></span>
                        ) : (
                          <span className="flex items-center justify-center">Complete Case 001 <Trophy className="ml-3 w-7 h-7" strokeWidth={2.5} /></span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleRetryRound}
                        className="w-full h-16 bg-white text-[#0F172A] text-2xl font-heading uppercase tracking-widest border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#0F172A] hover:bg-[#1D2A3C] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
                        style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
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

      {/* Floating Tutorial Helper (Bottom Right) */}
      <AnimatePresence mode="wait">
        {currentRoundIndex === 0 && tutorialStep <= tutorialDialogs.length && !showVerdictModal && (
          <motion.div 
            key={tutorialStep <= 2 || tutorialStep === 5 ? "pos-right" : "pos-left"}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-4 md:bottom-8 z-50 flex items-end gap-3 max-w-[95vw] md:max-w-2xl ${
              tutorialStep <= 2 || tutorialStep === 5
                ? "right-4 md:right-8 flex-row-reverse" 
                : "left-4 md:left-8 flex-row"
            }`}
          >
            {/* Mascot */}
            <div className="shrink-0 z-10 hidden sm:block">
              <img 
                src={`/character_mascot/${tutorialMascots[tutorialStep - 1]}`} 
                alt="A-Eye Agent" 
                className={`w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[4px_4px_0px_rgba(15,23,42,0.15)] transition-transform duration-500 ${tutorialStep > 2 && tutorialStep !== 5 ? "scale-x-[-1]" : ""}`}
              />
            </div>

            {/* Speech Bubble */}
            <div 
              className="flex-1 bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] p-4 md:p-6 relative font-sans"
              style={{ borderRadius: "25px 255px 25px 225px / 255px 25px 225px 25px" }}
            >
              {/* Pointer Triangle (Desktop) */}
              <div className={`absolute bottom-8 w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-[#0F172A] hidden sm:block transition-all duration-300 ${
                tutorialStep <= 2 || tutorialStep === 5 ? "-right-[14px] rotate-180" : "-left-[14px]"
              }`}>
                <div className="absolute -left-[10px] -top-[9px] w-0 h-0 border-y-[9px] border-y-transparent border-r-[11px] border-r-white z-10" />
              </div>
              
              <div className="sm:hidden flex items-center gap-3 mb-3 pb-3 border-b-2 border-dashed border-[#0F172A]/10">
                <img 
                  src={`/character_mascot/${tutorialMascots[tutorialStep - 1]}`} 
                  alt="A-Eye Agent" 
                  className={`w-10 h-10 object-contain transition-transform duration-500 ${tutorialStep > 2 && tutorialStep !== 5 ? "scale-x-[-1]" : ""}`}
                />
                <h3 className="font-heading font-bold text-lg text-[#0F172A]">A-Eye Agent</h3>
              </div>

              <h3 className="hidden sm:block font-heading font-bold text-xl md:text-2xl text-[#1D2A3C] mb-1 md:mb-2">
                A-Eye Agent
              </h3>
              
              <p className="text-base md:text-lg font-bold font-sans text-[#0F172A]/90 mb-4 leading-relaxed">
                {tutorialDialogs[tutorialStep - 1]}
              </p>
              
              <div className="flex justify-between items-center border-t-[3px] border-dashed border-[#0F172A]/20 pt-3">
                <span className="text-xs md:text-sm font-sans font-bold text-[#0F172A]/60 uppercase tracking-widest">
                  Step {tutorialStep} / {tutorialDialogs.length}
                </span>
                <Button 
                  onClick={() => setTutorialStep(prev => prev + 1)}
                  disabled={tutorialCooldown > 0}
                  className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-[#0F172A] font-bold font-heading text-base md:text-lg uppercase tracking-widest border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0F172A] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:bg-[#1D2A3C] disabled:text-white/50 disabled:border-solid disabled:shadow-none h-10 px-4 md:px-6"
                  style={{ borderRadius: "15px 225px 15px 255px / 225px 15px 255px 15px" }}
                >
                  {tutorialCooldown > 0 
                    ? `Wait ${tutorialCooldown}s` 
                    : tutorialStep === tutorialDialogs.length ? "Got it!" : "Next"} 
                  {tutorialCooldown === 0 && <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
