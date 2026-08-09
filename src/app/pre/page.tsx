"use client";

import { useAppTransition } from "@/components/layout/TransitionProvider";
import { BrutalButton } from "@/components/ui/brutal-button";

export default function PreQuizPage() {
  const { startTransition } = useAppTransition();

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#0F172A] p-4 font-sans bg-cubes">
      <div className="w-full max-w-2xl bg-white border-[4px] border-[#0F172A] shadow-[8px_8px_0px_0px_#0F172A] p-8 md:p-12 text-center flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-widest text-[#0F172A]">
          Pre-Quiz
        </h1>
        <p className="font-sans font-bold text-lg md:text-xl text-[#0F172A]/80">
          Placeholder for the Pre-Quiz.
        </p>
        <div className="mt-8 flex justify-center">
          <BrutalButton
            onClick={() => {
              const preloadPromise = import("@/utils/preloader").then(m => m.preloadGameAssets());
              startTransition("/level/1", { variant: 'init', waitFor: preloadPromise });
            }}
            size="lg"
            className="w-full sm:w-auto uppercase"
          >
            Proceed to Case 001
          </BrutalButton>
        </div>
      </div>
    </main>
  );
}
