import { useWorkoutContext } from "../contexts/WorkoutContext";

export function useWorkoutActions() {
  const { completeSet, skipRest, finishWorkout } = useWorkoutContext();

  return { completeSet, skipRest, finishWorkout };
}
