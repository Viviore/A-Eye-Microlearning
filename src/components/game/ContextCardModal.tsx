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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 p-8 shadow-2xl rounded-sm space-y-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                MIL Takeaway // Context Card
              </span>
              <h3 className="text-xl font-bold font-heading uppercase text-zinc-100">{title}</h3>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">{context}</p>

          <div className="flex justify-end pt-2">
            <Button
              onClick={onProceed}
              className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading uppercase tracking-widest rounded-none border-b-4 border-r-4 border-emerald-700 hover:border-emerald-600 active:translate-y-[2px] active:translate-x-[2px] transition-all duration-150"
            >
              Continue Investigation <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
