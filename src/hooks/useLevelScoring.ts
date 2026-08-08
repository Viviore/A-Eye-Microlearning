import { useState, useEffect, useCallback, useRef } from "react";

type UseLevelScoringProps = {
  initialScore?: number;
  initialTime?: number;
  hasTimer?: boolean;
  isReady: boolean;
  isPaused: boolean; // True when modal is open, tutorial active, etc.
  onTimeout?: () => void;
};

export function useLevelScoring({
  initialScore = 100,
  initialTime = 60,
  hasTimer = false,
  isReady,
  isPaused,
  onTimeout,
}: UseLevelScoringProps) {
  const [roundScore, setRoundScore] = useState(initialScore);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  // For score increment/decrement popups over the score header
  const [scorePopups, setScorePopups] = useState<{ id: number; amount: number }[]>([]);
  
  // For click deduction animations at specific coordinates
  const [clickPopups, setClickPopups] = useState<{ id: number; amount: number; x?: number; y?: number }[]>([]);

  // Used primarily for adding to score or standard score animations
  const triggerScoreAnimation = useCallback((amount: number) => {
    const newPopup = { id: Date.now() + Math.random(), amount };
    setScorePopups((prev) => [...prev, newPopup]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== newPopup.id));
    }, 2000);
  }, []);

  // Used for deducting score with optional mouse coordinates for floating text
  const applyDeduction = useCallback((amount: number, x?: number, y?: number) => {
    setRoundScore((prev) => prev - amount);
    
    if (x !== undefined && y !== undefined) {
      // It's a coordinate-based click popup (Level 1)
      const newPopup = { id: Date.now() + Math.random(), amount: -amount, x, y };
      setClickPopups((prev) => [...prev, newPopup]);
      setTimeout(() => {
        setClickPopups((prev) => prev.filter((p) => p.id !== newPopup.id));
      }, 1000);
    } else {
      // Standard deduction (Level 2/3) or if no coords provided
      const newDeduction = { id: Date.now() + Math.random(), amount: -amount };
      // Depending on the level, some use scorePopups for everything, some use a separate deductions state.
      // We'll expose this as clickPopups but components can render it wherever.
      setClickPopups((prev) => [...prev, newDeduction]);
      setTimeout(() => {
        setClickPopups((prev) => prev.filter((p) => p.id !== newDeduction.id));
      }, 2000);
    }
  }, []);

  // Store onTimeout in a ref so the timer effect doesn't restart on every render
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Timer countdown — only counts down, nothing else
  useEffect(() => {
    if (!hasTimer || !isReady || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasTimer, isReady, isPaused, timeLeft <= 0]);

  // Separate effect: fire onTimeout when timeLeft hits 0
  const hasFiredTimeoutRef = useRef(false);

  useEffect(() => {
    if (timeLeft === 0 && hasTimer && isReady && !hasFiredTimeoutRef.current) {
      hasFiredTimeoutRef.current = true;
      onTimeoutRef.current?.();
    }
    if (timeLeft > 0) {
      hasFiredTimeoutRef.current = false;
    }
  }, [timeLeft, hasTimer, isReady]);

  const resetScoring = useCallback(() => {
    setRoundScore(initialScore);
    setTimeLeft(initialTime);
    hasFiredTimeoutRef.current = false;
    setScorePopups([]);
    setClickPopups([]);
  }, [initialScore, initialTime]);

  return {
    roundScore,
    setRoundScore,
    timeLeft,
    setTimeLeft,
    scorePopups,
    clickPopups,
    triggerScoreAnimation,
    applyDeduction,
    resetScoring,
  };
}
