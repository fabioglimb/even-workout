import { Card } from "even-toolkit/web";
import type { Exercise } from "../../types/workout";
import { useTranslation } from "../../hooks/useTranslation";
import { getSetWeight } from "../../utils/weight";

interface ExerciseCardProps {
  exercise: Exercise;
  currentSet: number;
  /** Current side for unilateral timed exercises (null otherwise). */
  side?: "left" | "right" | null;
}

export function ExerciseCard({ exercise, currentSet, side }: ExerciseCardProps) {
  const { t } = useTranslation();
  const weight = getSetWeight(exercise, currentSet - 1);
  return (
    <Card variant="elevated" padding="lg" className="text-center w-full">
      <p className="text-[11px] tracking-[-0.11px] text-accent mb-2">
        {t('component.currentExercise')}
      </p>
      {exercise.image && (
        <img
          src={exercise.image}
          alt={exercise.name}
          className="mx-auto mb-3 w-20 h-20 object-cover rounded-[6px]"
        />
      )}
      <h2 className="text-[20px] tracking-[-0.6px] text-text mb-4">
        {exercise.name}
        {exercise.unilateral && !side && (
          <span className="text-[13px] tracking-[-0.13px] text-text-dim"> · {t('active.perSide')}</span>
        )}
      </h2>
      <p className="text-[17px] tracking-[-0.17px] text-text-dim mb-2">
        {t('glass.set')} <span className="text-accent">{currentSet}</span> {t('component.setOf')}{" "}
        <span>{exercise.sets}</span>
      </p>
      <p className="text-[24px] tracking-[-0.72px] text-text tabular-nums">
        {exercise.reps !== null
          ? `${exercise.reps} ${t('detail.reps')}`
          : `${exercise.durationSeconds}s`}
      </p>
      {weight !== null && (
        <p className="text-[15px] tracking-[-0.15px] text-text-dim tabular-nums mt-2">
          {weight} {t('editor.kg')}
        </p>
      )}
      {exercise.notes && (
        <p className="text-[13px] tracking-[-0.13px] text-text-dim mt-3 whitespace-pre-line">
          {exercise.notes}
        </p>
      )}
    </Card>
  );
}
