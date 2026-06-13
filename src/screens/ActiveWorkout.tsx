import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { useRestTimer } from "../hooks/useRestTimer";
import { useExerciseTimer } from "../hooks/useExerciseTimer";
import { useElapsedTime } from "../hooks/useElapsedTime";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useWorkoutActions } from "../hooks/useWorkoutActions";
import { getWorkoutById } from "../data/workouts";
import { Button, ConfirmDialog, Progress, TimerRing, useDrawerHeader } from "even-toolkit/web";
import { IcChevronBack } from "even-toolkit/web/icons/svg-icons";
import { ExerciseCard } from "../components/shared/ExerciseCard";
import { RestTimer } from "../components/shared/RestTimer";
import { ExercisePreview } from "../components/shared/ExercisePreview";
import { useTranslation } from "../hooks/useTranslation";
import { formatTime } from "../utils/format";

export default function ActiveWorkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeState, allWorkouts, startExerciseTimer, pauseExerciseTimer, advanceExerciseSide } = useWorkoutContext();
  const { t } = useTranslation();
  const { isResting, restRemaining } = useRestTimer();
  const { isTimedExercise, remaining: exerciseRemaining, running: timerRunning, side } = useExerciseTimer();
  const elapsedSeconds = useElapsedTime(activeState?.startedAt ?? null);
  const {
    completedSets,
    totalSets,
    progress,
    currentExercise,
    nextExercise,
    currentSet,
  } = useWorkoutProgress();
  const { completeSet, skipRest, finishWorkout } = useWorkoutActions();

  const [confirmExit, setConfirmExit] = useState(false);

  const workout = id ? getWorkoutById(id, allWorkouts) : undefined;

  // Redirect if no active workout
  useEffect(() => {
    if (!activeState) {
      navigate(`/workout/${id}`, { replace: true });
    }
  }, [activeState, id, navigate]);

  const handleFinish = () => {
    navigate(`/workout/${id}/complete`, {
      state: {
        workoutId: workout?.id,
        workoutTitle: workout?.title,
        completedSets,
        totalSets,
        startedAt: activeState?.startedAt,
        finishedAt: Date.now(),
        exerciseCount: workout?.exercises.length,
      },
    });
    finishWorkout();
  };

  const handleQuit = () => {
    finishWorkout();
    navigate(`/workout/${id}`);
  };

  useDrawerHeader({
    title: workout?.title ?? t('editor.workout'),
    left: (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setConfirmExit(true)}
        aria-label={t('active.exitConfirm')}
      >
        <IcChevronBack width={20} height={20} />
      </Button>
    ),
    right: (
      <span className="text-[11px] tracking-[-0.11px] text-text-dim tabular-nums">
        {completedSets}/{totalSets} {t('active.sets')}
      </span>
    ),
    below: (
      <div className="px-3 mt-3 pb-2 flex items-center gap-3">
        <Progress value={progress * 100} className="flex-1" />
        <span className="text-[11px] tracking-[-0.11px] text-text-dim tabular-nums shrink-0">
          {formatTime(elapsedSeconds)}
        </span>
      </div>
    ),
  });

  if (!activeState || !workout || !currentExercise) {
    return null;
  }

  const isWorkoutDone = completedSets >= totalSets;

  return (
    <div className="px-3 pt-6 pb-8 flex flex-col items-center gap-6">

      {isResting ? (
        <div className="flex flex-col items-center gap-6 w-full">
          <RestTimer remaining={restRemaining} total={currentExercise.restSeconds} onSkip={skipRest} />
          <Button size="lg" className="w-full" onClick={skipRest}>
            {t('active.skipRest')}
          </Button>
        </div>
      ) : isWorkoutDone ? (
        <div className="flex flex-col items-center gap-6 w-full text-center">
          <div>
            <p className="text-[17px] tracking-[-0.17px] text-text-dim mb-2">{t('active.allSetsComplete')}</p>
            <h2 className="text-[24px] tracking-[-0.72px] text-text">{t('active.greatWork')}</h2>
          </div>
          <Button size="lg" className="w-full" onClick={handleFinish}>
            {t('active.finishWorkout')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full">
          <ExerciseCard exercise={currentExercise} currentSet={currentSet} side={side} />

          {isTimedExercise && currentExercise.durationSeconds !== null ? (
            <div className="flex flex-col items-center gap-6 w-full">
              {side && (
                <p className="text-[15px] tracking-[-0.15px] text-accent uppercase">
                  {side === "left" ? t('active.leftSide') : t('active.rightSide')}
                </p>
              )}
              <TimerRing
                remaining={exerciseRemaining}
                total={currentExercise.durationSeconds}
              />
              <div className="flex w-full gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  onClick={timerRunning ? pauseExerciseTimer : startExerciseTimer}
                  disabled={exerciseRemaining <= 0}
                >
                  {timerRunning ? t('active.pause') : t('active.start')}
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={side === "left" ? advanceExerciseSide : completeSet}
                >
                  {side === "left" ? t('active.nextSide') : t('active.done')}
                </Button>
              </div>
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={completeSet}>
              {t('active.completeSet')}
            </Button>
          )}

          {nextExercise && (
            <ExercisePreview exercise={nextExercise} />
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
        onConfirm={handleQuit}
        title={t('active.exitConfirmTitle')}
        description={t('active.exitConfirmDesc')}
        confirmLabel={t('active.exitConfirm')}
        cancelLabel={t('active.exitCancel')}
        variant="danger"
      />
    </div>
  );
}
