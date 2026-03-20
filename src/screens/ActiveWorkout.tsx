import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useWorkoutActions } from "../hooks/useWorkoutActions";
import { getWorkoutById } from "../data/workouts";
import { Button, Progress, NavHeader, AppShell } from "even-toolkit/web";
import { IcChevronBack } from "even-toolkit/web/icons/svg-icons";
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
    <AppShell header={<><NavHeader title={workout.title} left={<Button variant="ghost" size="icon" onClick={handleQuit}><IcChevronBack width={20} height={20} /></Button>} right={<span className="text-[11px] tracking-[-0.11px] text-text-dim tabular-nums">{completedSets}/{totalSets} sets</span>} /><div className="px-3 mt-3 pb-2"><Progress value={progress * 100} /></div></>}>
      <div className="px-3 pt-6 pb-8 flex flex-col items-center gap-6">

        {isResting ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <RestTimer remaining={restRemaining} total={currentExercise.restSeconds} onSkip={skipRest} />
            <Button size="lg" className="w-full" onClick={skipRest}>
              Skip Rest
            </Button>
          </div>
        ) : isWorkoutDone ? (
          <div className="flex flex-col items-center gap-6 w-full text-center">
            <div>
              <p className="text-[17px] tracking-[-0.17px] text-text-dim mb-2">All Sets Complete</p>
              <h2 className="text-[24px] tracking-[-0.72px] text-text">Great Work!</h2>
            </div>
            <Button size="lg" className="w-full" onClick={handleFinish}>
              Finish Workout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <ExerciseCard exercise={currentExercise} currentSet={currentSet} />
            <Button size="lg" className="w-full" onClick={completeSet}>
              Complete Set
            </Button>
            {nextExercise && (
              <ExercisePreview exercise={nextExercise} />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
