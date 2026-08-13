import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";

export function VerdictModalContainer({
  isOpen,
  alignTop = false,
  children,
}: {
  isOpen: boolean;
  alignTop?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm overflow-y-auto ${
            alignTop ? "items-start" : "items-center"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`p-5 md:p-6 w-full max-w-2xl overflow-visible bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative ${
              alignTop
                ? "mt-4 md:mt-12"
                : "max-h-[90vh]"
            }`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function VerdictFeedback({
  isSuccess,
  title,
  message,
  onNext,
  onRetry,
  nextButtonText,
  retryButtonText,
  isFinalRound,
  scoreBadge,
  forceNextAction,
}: {
  isSuccess: boolean;
  title: string;
  message: React.ReactNode;
  onNext: () => void;
  onRetry: () => void;
  nextButtonText?: string;
  retryButtonText?: string;
  isFinalRound?: boolean;
  scoreBadge?: React.ReactNode;
  forceNextAction?: boolean;
}) {
  return (
    <div className="py-4 space-y-6 relative text-left">
      {/* Absolute top-right score badge */}
      {scoreBadge && (
        <div className="absolute top-0 right-0 -mt-8 -mr-4 z-20">
          {scoreBadge}
        </div>
      )}

      {/* Overlapping top-left icon */}
      <div className="absolute -top-10 -left-10 z-10">
        {isSuccess ? (
          <div className="w-16 h-16 bg-[#10B981] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-16 h-16 bg-[#E11D48] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
            <XCircle className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="pl-6 pt-6">
        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-wider uppercase text-[#0F172A] mb-3">
          {title}
        </h2>
        
        {/* Short colored underline */}
        <div className={`w-16 h-2 ${isSuccess ? "bg-[#10B981]" : "bg-[#E11D48]"}`}></div>
      </div>

      <div className="px-6 pb-2 mt-2">
        <div className="border-[3px] border-[#0F172A] p-6 bg-white shadow-[6px_6px_0px_0px_#E2E8F0]">
          <p className="text-xl md:text-2xl font-bold font-sans text-[#0F172A] leading-relaxed text-left">
            {message}
          </p>
        </div>
      </div>

      <div className="px-6 pt-2 flex gap-4">
        {isSuccess || forceNextAction ? (
          <BrutalButton
            onClick={onNext}
            variant="primary"
            size="lg"
            className={`w-full md:w-auto ${!isFinalRound ? (isSuccess ? "bg-[#10B981] hover:bg-[#10B981]/90" : "bg-[#E11D48] hover:bg-[#E11D48]/90 text-white") : ""}`}
          >
            {!isFinalRound ? (
              <span className="flex items-center justify-center">
                {nextButtonText || "Next Round"} <ArrowRight className="ml-3 w-6 h-6" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {nextButtonText || "Complete Case"} <Trophy className="ml-3 w-6 h-6" strokeWidth={2.5} />
              </span>
            )}
          </BrutalButton>
        ) : (
          <BrutalButton onClick={onRetry} variant="secondary" size="lg" className="w-full md:w-auto">
            <RotateCcw className="mr-3 w-6 h-6" strokeWidth={2.5} /> {retryButtonText || "Retry Verdict"}
          </BrutalButton>
        )}
      </div>
    </div>
  );
}

export function GameOverModal({
  isOpen,
  onRestart
}: {
  isOpen: boolean;
  onRestart: () => void;
}) {
  return (
    <VerdictModalContainer isOpen={isOpen}>
      <div className="py-4 space-y-6 relative text-left">
        <div className="absolute -top-10 -left-10 z-10">
          <div className="w-16 h-16 bg-[#E11D48] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
            <XCircle className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="pl-6 pt-6">
          <h2 className="text-4xl md:text-5xl font-black font-heading tracking-wider uppercase text-[#0F172A] mb-3">
            GAME OVER
          </h2>
          <div className="w-16 h-2 bg-[#E11D48]"></div>
        </div>

        <div className="px-6 pb-2 mt-2">
          <div className="border-[3px] border-[#0F172A] p-6 bg-white shadow-[6px_6px_0px_0px_#E2E8F0]">
            <p className="text-xl md:text-2xl font-bold font-sans text-[#0F172A] leading-relaxed text-left">
              Your score has dropped to zero. You have failed the assessment. You must return to the beginning and restart your training.
            </p>
          </div>
        </div>

        <div className="px-6 pt-2 flex gap-4">
          <BrutalButton onClick={onRestart} variant="secondary" size="lg" className="w-full">
            <RotateCcw className="mr-3 w-6 h-6" strokeWidth={2.5} /> Restart Training
          </BrutalButton>
        </div>
      </div>
    </VerdictModalContainer>
  );
}
