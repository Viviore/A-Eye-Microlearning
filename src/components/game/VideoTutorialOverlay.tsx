"use client";

import { motion } from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";

interface VideoTutorialOverlayProps {
  videoSrc: string;
  onComplete: () => void;
}

export function VideoTutorialOverlay({ videoSrc, onComplete }: VideoTutorialOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0F172A]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-6">
        <div className="w-full relative bg-black border-[6px] border-[#FFB800] shadow-[8px_8px_0px_0px_#FFB800]">
          <video
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="w-full aspect-video outline-none block"
            onEnded={onComplete}
          />
        </div>
        
        <BrutalButton variant="primary" size="lg" onClick={onComplete} className="text-xl px-12 font-black uppercase tracking-widest border-white text-white hover:text-[#0F172A]">
          Skip Video
        </BrutalButton>
      </div>
    </motion.div>
  );
}
