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
            className={`absolute inset-0 bg-zinc-950/80 backdrop-blur-sm ${countdown > 0 ? "cursor-not-allowed" : ""}`}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Cyberpunk Top Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">Anomaly Detected</span>
                </div>
                <button 
                  onClick={handleClose}
                  disabled={countdown > 0}
                  className={`transition-colors ${countdown > 0 ? "text-zinc-700 cursor-not-allowed" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-100 font-heading mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {description}
              </p>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleClose}
                  disabled={countdown > 0}
                  className={`px-6 py-2 text-sm font-mono uppercase tracking-widest transition-colors rounded-sm border ${
                    countdown > 0 
                      ? "bg-zinc-800/50 text-zinc-600 border-zinc-800 cursor-not-allowed" 
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                  }`}
                >
                  {countdown > 0 ? `Acknowledge (${countdown})` : "Acknowledge"}
                </button>
              </div>
            </div>
            
            {/* Scanning line */}
            <motion.div 
              className="absolute left-0 right-0 h-px bg-emerald-500/50 pointer-events-none"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
