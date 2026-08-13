"use client";

import { useAppTransition } from "@/components/layout/TransitionProvider";
import { useGameStore, type AssessmentAnswers } from "@/store/gameStore";
import { AssessmentQuiz } from "@/components/game/AssessmentQuiz";
import { useProgressionGuard } from "@/hooks/useProgressionGuard";

export default function PostQuizPage() {
  useProgressionGuard();
  const { startTransition } = useAppTransition();
  const { completePostAssessment } = useGameStore();

  const handleComplete = (answers: AssessmentAnswers) => {
    // 1. Store results
    completePostAssessment(answers);

    // 2. Transition to final results
    startTransition("/results", { variant: 'results' });
  };

  return <AssessmentQuiz mode="post" onComplete={handleComplete} />;
}
