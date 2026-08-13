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
            className={`w-full max-w-[480px] overflow-visible bg-[#FAFAFA] border-[4px] border-[#0F172A] shadow-[16px_16px_0px_0px_#0F172A] relative ${
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
        <div className="absolute top-0 right-0 -mt-6 -mr-2 md:-mt-8 md:-mr-4 z-20">
          {scoreBadge}
        </div>
      )}

      {/* Overlapping top-left icon */}
      <div className="absolute -top-6 -left-4 md:-top-6 md:-left-6 z-10">
        {isSuccess ? (
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#10B981] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A] -rotate-3">
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF3366] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A] -rotate-3">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="px-6 md:px-10 pt-8 md:pt-10">
        <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight uppercase text-[#0F172A] mb-3">
          {title}
        </h2>
        
        {/* Short colored underline */}
        <div className={`w-20 h-2 ${isSuccess ? "bg-[#10B981]" : "bg-[#FF3366]"}`}></div>
      </div>

      <div className="px-6 md:px-10 pb-6 mt-6">
        <div className="border-[4px] border-[#0F172A] p-6 bg-white relative">
          <p className="text-lg md:text-xl font-bold font-sans text-[#0F172A]/90 leading-relaxed text-left">
            {message}
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-8 md:pb-10 pt-2 flex gap-4">
        {isSuccess || forceNextAction ? (
          <BrutalButton
            onClick={onNext}
            variant="primary"
            size="lg"
            className={`w-full uppercase ${!isFinalRound ? (isSuccess ? "bg-[#10B981] hover:bg-[#10B981]/90 text-[#0F172A]" : "bg-[#FF3366] hover:bg-[#FF3366]/90 text-white") : ""}`}
          >
            {!isFinalRound ? (
              <span className="flex items-center justify-center w-full">
                {nextButtonText || "Next Round"} <ArrowRight className="ml-3 w-6 h-6 shrink-0" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex items-center justify-center w-full">
                {nextButtonText || "Complete Case"} <Trophy className="ml-3 w-6 h-6 shrink-0" strokeWidth={3} />
              </span>
            )}
          </BrutalButton>
        ) : (
          <BrutalButton onClick={onRetry} variant="secondary" size="lg" className="w-full md:w-auto">
            <span className="flex items-center justify-center">
              <RotateCcw className="mr-3 w-6 h-6 shrink-0" strokeWidth={2.5} /> {retryButtonText || "Retry Verdict"}
            </span>
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
        <div className="absolute -top-6 -left-4 md:-top-10 md:-left-10 z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E11D48] border-[3px] border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_0px_#0F172A] -rotate-6">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />
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
