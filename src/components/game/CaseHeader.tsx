import { FileText, FileVideo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ScorePopup = {
  id: number;
  amount: number;
};

export function CaseHeader({
  caseNumber,
  caseTitle,
  isTutorial,
  currentRoundNumber,
  totalRounds,
  score,
  scorePopups = [],
  icon = "fileText",
  children
}: {
  caseNumber: string;
  caseTitle: string;
  isTutorial: boolean;
  currentRoundNumber: number;
  totalRounds: number;
  score: number;
  scorePopups?: ScorePopup[];
  icon?: "fileText" | "fileVideo";
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] bg-[#FFB800] text-[#0F172A] font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          {icon === "fileText" ? (
            <FileText className="w-4 h-4 text-[#0F172A]" />
          ) : (
            <FileVideo className="w-4 h-4 text-[#0F172A]" />
          )}
          <span>{caseNumber} {"//"} {caseTitle}</span>
        </div>
        
        <span
          className={`px-3 py-1 font-mono text-xs font-bold uppercase border-[4px] shadow-[4px_4px_0px_0px_#0F172A] border-[#0F172A] ${
            isTutorial ? "bg-white text-[#0F172A]" : "bg-[#FFB800] text-[#0F172A]"
          }`}
        >
          {isTutorial
            ? "TUTORIAL"
            : `${currentRoundNumber} / ${totalRounds}`}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {children}
        
        <div
          id="tutorial-score"
          className="font-heading font-black text-xl md:text-2xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-1 border-[4px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] relative"
        >
          <span>Score: </span>
          <span className="relative text-[#FFB800] drop-shadow-[1px_1px_0px_rgba(15,23,42,1)]">
            {score}
          </span>
          
          <AnimatePresence>
            {scorePopups.map((popup) => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 0, y: 0, scale: 0.8 }}
                animate={{ opacity: 1, y: -30, scale: 1.2 }}
                exit={{ opacity: 0, y: -45, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none font-black whitespace-nowrap z-50 ${
                  popup.amount > 0
                    ? "text-[#FFB800] drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                    : "text-red-500 drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                }`}
              >
                {popup.amount > 0 ? `+${popup.amount}` : popup.amount}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
