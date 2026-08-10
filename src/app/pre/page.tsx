"use client";

import { useAppTransition } from "@/components/layout/TransitionProvider";
import { useGameStore, type AssessmentAnswers } from "@/store/gameStore";
import { AssessmentQuiz } from "@/components/game/AssessmentQuiz";

export default function PreQuizPage() {
  const { startTransition } = useAppTransition();
  const { completePreAssessment } = useGameStore();

  const handleComplete = (answers: AssessmentAnswers) => {
    // 1. Store results
    completePreAssessment(answers);

    // 2. Preload and transition to Case 001
    const preloadPromise = import("@/utils/preloader").then(m => m.preloadGameAssets());
    startTransition("/level/1", { variant: 'init', waitFor: preloadPromise });
  };

  return <AssessmentQuiz mode="pre" onComplete={handleComplete} />;
}
