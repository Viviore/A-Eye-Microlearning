"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ZoomIn, ZoomOut, RotateCcw, Sun } from "lucide-react";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArtifactHotspot } from "./InvestigationImage";

interface AdvancedInvestigationImageProps {
  src: string;
  alt: string;
  hotspots: ArtifactHotspot[];
  foundArtifacts: string[];
  onArtifactFound: (hotspot: ArtifactHotspot) => void;
  isTimeUp?: boolean;
}

export function AdvancedInvestigationImage({
  src,
  alt,
  hotspots,
  foundArtifacts,
  onArtifactFound,
  isTimeUp = false,
}: AdvancedInvestigationImageProps) {
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 flex flex-col">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform, state }) => {
          const currentScale = state?.scale ?? 1;
          return (
          <>
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-zinc-900/80 backdrop-blur-md p-2 rounded-md border border-zinc-700 shadow-2xl">
              <button
                onClick={() => zoomIn()}
                className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-300 hover:text-emerald-400 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-300 hover:text-emerald-400 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-300 hover:text-emerald-400 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="w-full h-px bg-zinc-700 my-1" />
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 rounded-sm transition-colors ${
                  highContrast 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400"
                }`}
                title="Toggle Contrast Overlay"
              >
                <Sun className="w-5 h-5" />
              </button>
            </div>

            {/* Current Zoom Level Indicator */}
            <div className="absolute top-4 left-4 z-50 px-3 py-1 bg-zinc-900/80 backdrop-blur-md rounded-sm border border-zinc-700 font-mono text-xs text-emerald-400">
              {Math.round(currentScale * 100)}%
            </div>

            {/* The Zoomable Area */}
            <div className="w-full relative cursor-crosshair">
              <TransformComponent wrapperClass="!w-full !h-auto" contentClass="!w-full relative">
                <div 
                  className="w-full relative" 
                  style={{ 
                    filter: highContrast ? "contrast(150%) brightness(120%) saturate(80%)" : "none",
                    transition: "filter 0.3s ease"
                  }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover select-none pointer-events-none"
                    priority
                  />
                  
                  {/* Invisible Hotspots Overlay Layer */}
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
                          e.stopPropagation();
                          if (!isDisabled) onArtifactFound(hotspot);
                        }}
                      >
                        {/* Detection Ring Animation */}
                        <AnimatePresence>
                          {isFound && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 border-2 border-emerald-500 rounded-md bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] overflow-hidden pointer-events-none"
                            >
                              <Search className="text-emerald-400 w-5 h-5 drop-shadow-md" />
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-1/2 w-full"
                                animate={{ top: ["-50%", "150%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
            </div>
          </>
        );
        }}
      </TransformWrapper>
    </div>
  );
}
