import { useEffect } from "react";
import { useWorkoutContext } from "../contexts/WorkoutContext";

export function useExerciseTimer() {
  const { activeState, setExerciseRemaining, pauseExerciseTimer, completeSet } =
    useWorkoutContext();

  const isExercising = activeState?.phase === "exercise";
  const remaining = activeState?.exerciseRemaining ?? null;
  const running = activeState?.exerciseRunning ?? false;
  const isTimedExercise = remaining !== null;

  // Tick down once per second while running.
  useEffect(() => {
    if (!isExercising || !running || remaining === null || remaining <= 0) return;

    const interval = setInterval(() => {
      setExerciseRemaining((prev: number) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isExercising, running, remaining, setExerciseRemaining]);

  // When the timer hits zero, auto-complete the set and stop ticking.
  useEffect(() => {
    if (isExercising && running && remaining === 0) {
      pauseExerciseTimer();
      completeSet();
    }
  }, [isExercising, running, remaining, pauseExerciseTimer, completeSet]);

  return {
    isTimedExercise,
    remaining: remaining ?? 0,
    running,
  };
}
