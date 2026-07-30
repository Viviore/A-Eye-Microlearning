'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ChevronRight, BookOpen } from 'lucide-react';

interface ContextCardModalProps {
  isOpen: boolean;
  title: string;
  context: string;
  onProceed: () => void;
}

export const ContextCardModal: React.FC<ContextCardModalProps> = ({
  isOpen,
  title,
  context,
  onProceed,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FAFAFA]/90 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="z-10 w-full max-w-lg glass-panel p-8 space-y-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b-2 border-dashed border-[#0F172A] pb-4">
            <div className="p-2.5 bg-[#fafa33] border-2 border-[#0F172A] rounded-none text-[#FFB800] shadow-[2px_2px_0px_0px_#0F172A]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFB800] block font-bold">
                MIL Takeaway // Context Card
              </span>
              <h3 className="text-xl font-bold font-heading uppercase text-[#0F172A]">{title}</h3>
            </div>
          </div>

          <p className="text-base font-handwriting text-[#0F172A]/80 leading-relaxed">{context}</p>

          <div className="flex justify-end pt-2">
            <Button
              onClick={onProceed}
              className="h-12 px-6 bg-[#FFB800] hover:bg-[#FFB800]/90 text-white font-heading uppercase tracking-widest rounded-none border-2 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F172A] transition-all duration-150 font-bold"
            >
              Continue Investigation <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
