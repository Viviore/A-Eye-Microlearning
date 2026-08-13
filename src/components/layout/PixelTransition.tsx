import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PixelTransitionProps {
  isActive: boolean;
}

export function PixelTransition({ isActive }: PixelTransitionProps) {
  // We use useMemo to generate the random delays once, 
  // so they stay consistent during the entrance and exit animations.
  const pixels = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 0.35,
    }));
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <div 
          className="fixed inset-0 z-[999999] pointer-events-none grid grid-cols-[repeat(10,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] md:grid-cols-[repeat(20,minmax(0,1fr))] md:grid-rows-[repeat(10,minmax(0,1fr))]"
        >
          {pixels.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, delay: p.delay } }}
              exit={{ opacity: 0, transition: { duration: 0.15, delay: p.delay } }}
              className="w-full h-full bg-[#0F172A]"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
