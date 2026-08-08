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
          className={`fixed inset-0 z-50 flex justify-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm ${
            alignTop ? "items-start pt-4 md:pt-12" : "items-center"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`p-5 md:p-6 w-full max-w-2xl overflow-y-auto overflow-x-hidden bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative ${
              alignTop
                ? "max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-280px)]"
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
  isFinalRound,
}: {
  isSuccess: boolean;
  title: string;
  message: string;
  onNext: () => void;
  onRetry: () => void;
  nextButtonText?: string;
  isFinalRound?: boolean;
}) {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-24 h-24 bg-[#FFB800] border-[4px] border-[#0F172A] flex items-center justify-center shadow-[6px_6px_0px_0px_#0F172A]">
            <CheckCircle2 className="w-12 h-12 text-[#0F172A]" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="w-24 h-24 bg-white border-[4px] border-[#FFB800] flex items-center justify-center shadow-[6px_6px_0px_0px_#FFB800]">
            <XCircle className="w-12 h-12 text-[#FFB800]" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <h2
        className={`text-5xl font-black font-heading tracking-wider ${
          isSuccess ? "uppercase text-[#0F172A]" : "text-[#FFB800]"
        }`}
      >
        {title}
      </h2>
      <p className="text-xl font-bold font-sans text-[#0F172A]/80 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      <div className="pt-8">
        {isSuccess ? (
          <BrutalButton
            onClick={onNext}
            variant="primary"
            size="lg"
            className={!isFinalRound ? "bg-[#10B981] hover:bg-[#10B981]/90" : ""}
          >
            {!isFinalRound ? (
              <span className="flex items-center justify-center">
                {nextButtonText || "Next Round"} <ArrowRight className="ml-3 w-7 h-7" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {nextButtonText || "Complete Case"} <Trophy className="ml-3 w-7 h-7" strokeWidth={2.5} />
              </span>
            )}
          </BrutalButton>
        ) : (
          <BrutalButton onClick={onRetry} variant="secondary" size="lg">
            <RotateCcw className="mr-3 w-7 h-7" strokeWidth={2.5} /> Retry Verdict
          </BrutalButton>
        )}
      </div>
    </div>
  );
}
