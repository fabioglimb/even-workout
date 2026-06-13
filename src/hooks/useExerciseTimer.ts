import { useEffect } from "react";
import { useWorkoutContext } from "../contexts/WorkoutContext";

export function useExerciseTimer() {
  const { activeState, setExerciseRemaining, pauseExerciseTimer, completeSet, advanceExerciseSide } =
    useWorkoutContext();

  const isExercising = activeState?.phase === "exercise";
  const remaining = activeState?.exerciseRemaining ?? null;
  const running = activeState?.exerciseRunning ?? false;
  const side = activeState?.exerciseSide ?? null;
  const isTimedExercise = remaining !== null;

  // Tick down once per second while running.
  useEffect(() => {
    if (!isExercising || !running || remaining === null || remaining <= 0) return;

    const interval = setInterval(() => {
      setExerciseRemaining((prev: number) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isExercising, running, remaining, setExerciseRemaining]);

  // When the timer hits zero: for a unilateral exercise still on the left side,
  // switch to the right side; otherwise complete the set.
  useEffect(() => {
    if (isExercising && running && remaining === 0) {
      pauseExerciseTimer();
      if (side === "left") {
        advanceExerciseSide();
      } else {
        completeSet();
      }
    }
  }, [isExercising, running, remaining, side, pauseExerciseTimer, completeSet, advanceExerciseSide]);

  return {
    isTimedExercise,
    remaining: remaining ?? 0,
    running,
    side,
  };
}
