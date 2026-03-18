import { useEffect } from "react";
import { useWorkoutContext } from "../contexts/WorkoutContext";

export function useRestTimer() {
  const { activeState, setRestRemaining, skipRest } = useWorkoutContext();
  const isResting = activeState?.phase === "rest";
  const restRemaining = activeState?.restRemaining ?? 0;

  useEffect(() => {
    if (!isResting || restRemaining <= 0) return;

    const interval = setInterval(() => {
      setRestRemaining((prev: number) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restRemaining, setRestRemaining]);

  // Auto-advance when rest ends
  useEffect(() => {
    if (isResting && restRemaining <= 0) {
      skipRest();
    }
  }, [isResting, restRemaining, skipRest]);

  return { isResting, restRemaining };
}
