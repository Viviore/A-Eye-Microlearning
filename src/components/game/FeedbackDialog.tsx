"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function FeedbackDialog({ isOpen, onClose, title, description }: FeedbackDialogProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [isOpen, countdown]);

  const handleClose = () => {
    if (countdown === 0) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className={`absolute inset-0 bg-[#FAFAFA]/80 backdrop-blur-sm ${countdown > 0 ? "cursor-not-allowed" : ""}`}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md glass-panel overflow-hidden"
          >
            {/* Top Bar (Tape) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/10 -rotate-2 backdrop-blur-sm z-20" />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-[#FFB800]">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">Feedback</span>
                </div>
                <button 
                  onClick={handleClose}
                  disabled={countdown > 0}
                  className={`transition-colors border-2 border-transparent hover:border-[#0F172A] rounded-none p-1 ${countdown > 0 ? "text-[#0F172A]/30 cursor-not-allowed" : "text-[#0F172A]/60 hover:text-[#0F172A]"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-[#0F172A] font-heading mb-3">{title}</h3>
              <p className="text-base text-[#0F172A]/80 leading-relaxed font-handwriting">
                {description}
              </p>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleClose}
                  disabled={countdown > 0}
                  className={`px-6 py-2 text-sm font-heading font-bold uppercase tracking-widest transition-all rounded-none border-2 shadow-[2px_2px_0px_0px_#0F172A] ${
                    countdown > 0 
                      ? "bg-white/50 text-[#0F172A]/40 border-[#0F172A]/40 shadow-none cursor-not-allowed" 
                      : "bg-[#fafa33] hover:bg-[#fafa33]/90 text-[#0F172A] border-[#0F172A] hover:translate-y-[2px] hover:shadow-none"
                  }`}
                >
                  {countdown > 0 ? `Acknowledge (${countdown})` : "Acknowledge"}
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
