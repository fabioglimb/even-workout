import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useWorkoutActions } from "../hooks/useWorkoutActions";
import { getWorkoutById } from "../data/workouts";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/Progress";
import { ExerciseCard } from "../components/shared/ExerciseCard";
import { RestTimer } from "../components/shared/RestTimer";
import { ExercisePreview } from "../components/shared/ExercisePreview";

export default function ActiveWorkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeState, allWorkouts } = useWorkoutContext();
  const { isResting, restRemaining } = useRestTimer();
  const {
    completedSets,
    totalSets,
    progress,
    currentExercise,
    nextExercise,
    currentSet,
  } = useWorkoutProgress();
  const { completeSet, skipRest, finishWorkout } = useWorkoutActions();

  const workout = id ? getWorkoutById(id, allWorkouts) : undefined;

  // Redirect if no active workout
  useEffect(() => {
    if (!activeState) {
      navigate(`/workout/${id}`, { replace: true });
    }
  }, [activeState, id, navigate]);

  if (!activeState || !workout || !currentExercise) {
    return null;
  }

  const isWorkoutDone = completedSets >= totalSets;

  const handleFinish = () => {
    navigate(`/workout/${id}/complete`, {
      state: {
        workoutId: workout.id,
        workoutTitle: workout.title,
        completedSets,
        totalSets,
        startedAt: activeState.startedAt,
        finishedAt: Date.now(),
        exerciseCount: workout.exercises.length,
      },
    });
    finishWorkout();
  };

  const handleQuit = () => {
    finishWorkout();
    navigate(`/workout/${id}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={handleQuit}
        className="text-sm text-text-muted uppercase tracking-wider mb-6 hover:text-text-secondary transition-colors"
      >
        &larr; Quit
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-text-primary uppercase tracking-wider">
          {workout.title}
        </h1>
        <span className="text-xs text-text-muted tabular-nums">
          {completedSets}/{totalSets} sets
        </span>
      </div>

      <Progress value={progress} color={isResting ? "orange" : "cyan"} className="mb-8" />

      {isResting ? (
        <RestTimer remaining={restRemaining} onSkip={skipRest} />
      ) : isWorkoutDone ? (
        <div className="text-center py-12">
          <p className="text-xs uppercase tracking-widest text-cyan-accent mb-4">
            All Sets Complete
          </p>
          <h2 className="text-3xl font-bold text-text-primary mb-8">
            Great Work!
          </h2>
          <Button size="xl" onClick={handleFinish}>
            Finish Workout
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ExerciseCard exercise={currentExercise} currentSet={currentSet} />
          <Button size="xl" className="w-full" onClick={completeSet}>
            Complete Set
          </Button>
        </div>
      )}

      {!isWorkoutDone && nextExercise && !isResting && (
        <div className="mt-6">
          <ExercisePreview exercise={nextExercise} />
        </div>
      )}
    </div>
  );
}
