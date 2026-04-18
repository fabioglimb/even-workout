import { Card } from "even-toolkit/web";
import type { Exercise } from "../../types/workout";
import { useTranslation } from "../../hooks/useTranslation";

interface ExerciseCardProps {
  exercise: Exercise;
  currentSet: number;
}

export function ExerciseCard({ exercise, currentSet }: ExerciseCardProps) {
  const { t } = useTranslation();
  return (
    <Card variant="elevated" padding="lg" className="text-center w-full">
      <p className="text-[11px] tracking-[-0.11px] text-accent mb-2">
        {t('component.currentExercise')}
      </p>
      <h2 className="text-[20px] tracking-[-0.6px] text-text mb-4">
        {exercise.name}
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
    </Card>
  );
}
