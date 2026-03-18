import { useWorkoutContext } from "../contexts/WorkoutContext";
import { getWorkoutById } from "../data/workouts";

export function useWorkoutProgress() {
  const { activeState, allWorkouts } = useWorkoutContext();

  if (!activeState) {
    return {
      completedSets: 0,
      totalSets: 0,
      progress: 0,
      currentExercise: null,
      nextExercise: null,
      currentSet: 0,
      exerciseIndex: 0,
    };
  }

  const workout = getWorkoutById(activeState.workoutId, allWorkouts);
  if (!workout) {
    return {
      completedSets: 0,
      totalSets: 0,
      progress: 0,
      currentExercise: null,
      nextExercise: null,
      currentSet: 0,
      exerciseIndex: 0,
    };
  }

  const currentExercise = workout.exercises[activeState.exerciseIndex] ?? null;
  const nextExercise = workout.exercises[activeState.exerciseIndex + 1] ?? null;
  const progress =
    activeState.totalSets > 0
      ? activeState.completedSets / activeState.totalSets
      : 0;

  return {
    completedSets: activeState.completedSets,
    totalSets: activeState.totalSets,
    progress,
    currentExercise,
    nextExercise,
    currentSet: activeState.currentSet,
    exerciseIndex: activeState.exerciseIndex,
  };
}
