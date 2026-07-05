"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";

export interface ArtifactHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage width
  height: number; // percentage height
  title: string;
  description: string;
}

interface InvestigationImageProps {
  src: string;
  alt: string;
  hotspots: ArtifactHotspot[];
  foundArtifacts: string[];
  onArtifactFound: (artifact: ArtifactHotspot) => void;
  isTimeUp?: boolean;
}

export function InvestigationImage({
  src,
  alt,
  hotspots,
  foundArtifacts,
  onArtifactFound,
  isTimeUp = false,
}: InvestigationImageProps) {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTimeUp) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickPos({ x, y });

    // Show a miss animation if they didn't click a hotspot
    setTimeout(() => {
      setClickPos(null);
    }, 600);
  };

  return (
    <div 
      className="relative w-full aspect-square md:aspect-[4/5] bg-zinc-900 overflow-hidden cursor-crosshair group rounded-md border border-zinc-800"
      onClick={handleImageClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* Crosshair UI overlay (Cyberpunk feel) */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase bg-zinc-950/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-sm">
          <Search className="w-3 h-3" />
          Analyzing
        </div>
      </div>

      {/* Miss Click Animation */}
      <AnimatePresence>
        {clickPos && (
          <motion.div
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-8 h-8 rounded-full border border-red-500 bg-red-500/20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: clickPos.x, top: clickPos.y }}
          />
        )}
      </AnimatePresence>

      {/* Hotspots */}
      {hotspots.map((hotspot) => {
        const isFound = foundArtifacts.includes(hotspot.id);
        const isDisabled = isFound || isTimeUp;

        return (
          <div
            key={hotspot.id}
            className={`absolute group/hotspot ${!isDisabled ? "cursor-pointer" : "cursor-default"}`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent image click handler
              if (!isDisabled) onArtifactFound(hotspot);
            }}
          >
            <AnimatePresence>
              {isFound && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 border-2 border-emerald-500 rounded-md bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] overflow-hidden"
                >
                  <Search className="text-emerald-400 w-5 h-5 drop-shadow-md" />
                  
                  {/* Scanning lines effect on found artifact */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-1/2 w-full"
                    animate={{ top: ["-50%", "150%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Debug border for development - remove in prod if needed, or keep subtle */}
            <div className="absolute inset-0 border border-white/0 hover:border-emerald-500/30 transition-colors duration-200" />
          </div>
        );
      })}
    </div>
  );
}
