"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ZoomIn, ZoomOut, RotateCcw, Sun, Eye, Layers } from "lucide-react";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export interface ArtifactHotspot {
  id: string;
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title: string;
  description: string;
  explanation?: string;
  category?: string;
  correctCategory?: string;
}

interface AdvancedInvestigationImageProps {
  src: string;
  alt: string;
  hotspots: ArtifactHotspot[];
  foundArtifacts: string[];
  onHotspotClick: (hotspot: any) => void;
  contrastBoost?: boolean;
  gridOverlay?: boolean;
  scanMode?: boolean;
  isTimeUp?: boolean;
}

export function AdvancedInvestigationImage({
  src,
  alt,
  hotspots,
  foundArtifacts,
  onHotspotClick,
  contrastBoost = false,
  gridOverlay = false,
  scanMode = false,
  isTimeUp = false,
}: AdvancedInvestigationImageProps) {
  const [internalContrast, setInternalContrast] = useState(false);

  const effectiveContrast = contrastBoost || internalContrast;

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 flex flex-col rounded-sm border border-zinc-800">
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
                  onClick={() => setInternalContrast(!internalContrast)}
                  className={`p-2 rounded-sm transition-colors ${
                    effectiveContrast
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
                      filter: effectiveContrast ? "contrast(150%) brightness(120%) saturate(80%)" : "none",
                      transition: "filter 0.3s ease",
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

                    {/* Grid Overlay */}
                    {gridOverlay && (
                      <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 bg-[linear-gradient(to_right,#10b9810f_1px,transparent_1px),linear-gradient(to_bottom,#10b9810f_1px,transparent_1px)] bg-[size:32px_32px]" />
                    )}

                    {/* Interactive Hotspots Layer */}
                    {hotspots.map((hotspot) => {
                      const isFound = foundArtifacts.includes(hotspot.id);
                      const isDisabled = isFound || isTimeUp;
                      const leftPos = hotspot.xPercent ?? hotspot.x ?? 0;
                      const topPos = hotspot.yPercent ?? hotspot.y ?? 0;
                      const widthPos = hotspot.widthPercent ?? hotspot.width ?? 10;
                      const heightPos = hotspot.heightPercent ?? hotspot.height ?? 10;

                      return (
                        <div
                          key={hotspot.id}
                          className={`absolute transition-all duration-300 ${!isDisabled ? "cursor-pointer" : "cursor-default"}`}
                          style={{
                            left: `${leftPos}%`,
                            top: `${topPos}%`,
                            width: `${widthPos}%`,
                            height: `${heightPos}%`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) onHotspotClick(hotspot);
                          }}
                        >
                          {/* Forensic Lens / Heatmap Overlay */}
                          {scanMode && !isFound && (
                            <div className="absolute inset-0 border-2 border-dashed border-amber-400/80 bg-amber-400/20 rounded-md animate-pulse pointer-events-none shadow-[0_0_12px_rgba(251,191,36,0.6)] flex items-center justify-center">
                              <span className="text-[9px] font-mono font-bold text-amber-950 bg-amber-400 px-1 rounded">SCAN DETECTED</span>
                            </div>
                          )}

                          {/* Found Artifact Indicator */}
                          <AnimatePresence>
                            {isFound && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 border-2 border-emerald-500 rounded-md bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] overflow-hidden pointer-events-none"
                              >
                                <Search className="text-emerald-400 w-5 h-5 drop-shadow-md" />
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
