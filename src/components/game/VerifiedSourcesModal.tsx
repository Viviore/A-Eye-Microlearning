import { Search, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";

type VerifiedSource = {
  name: string;
  text: string;
};

export function VerifiedSourcesModal({
  isOpen,
  onClose,
  sources,
}: {
  isOpen: boolean;
  onClose: () => void;
  sources?: VerifiedSource[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-[#FAFAFA]/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="p-5 md:p-6 w-full max-w-2xl bg-white border-[4px] border-[#0F172A] shadow-[12px_12px_0px_0px_#0F172A] relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 border-b-[4px] border-dashed border-[#0F172A]/30 pb-4">
              <h2 className="text-3xl font-black font-heading text-[#0F172A] uppercase tracking-wider flex items-center gap-3">
                <Search className="w-8 h-8 text-[#0F172A]" strokeWidth={3} />
                Verified Sources
              </h2>
              <button 
                onClick={onClose}
                className="text-[#0F172A] hover:text-[#FF3366] transition-colors"
              >
                <XCircle className="w-8 h-8" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="space-y-4 font-sans text-lg">
              {sources && sources.length > 0 ? (
                sources.map((source: VerifiedSource, i: number) => (
                  <div key={i} className="p-4 bg-[#FAFAFA] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]">
                    <h4 className="font-bold text-[#2563EB] mb-2 font-mono uppercase tracking-widest text-sm">{source.name}</h4>
                    <p className="text-[#0F172A] font-bold leading-relaxed">{source.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#0F172A]/50 font-mono text-sm uppercase tracking-widest border-[3px] border-dashed border-[#0F172A]/20">
                  No verified sources available.
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4">
              <BrutalButton
                onClick={onClose}
                variant="secondary"
                className="w-full"
              >
                Close Sources
              </BrutalButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
