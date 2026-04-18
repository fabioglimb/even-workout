import { Card } from "even-toolkit/web";
import type { Exercise } from "../../types/workout";
import { useTranslation } from "../../hooks/useTranslation";

interface ExercisePreviewProps {
  exercise: Exercise;
}

export function ExercisePreview({ exercise }: ExercisePreviewProps) {
  const { t } = useTranslation();
  return (
    <Card padding="sm" className="opacity-70 w-full text-center">
      <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">
        {t('component.upNext')}
      </p>
      <p className="text-[13px] tracking-[-0.13px] text-text">{exercise.name}</p>
      <p className="text-[11px] tracking-[-0.11px] text-text-dim">
        {exercise.sets} {t('detail.sets')} &middot;{" "}
        {exercise.reps !== null
          ? `${exercise.reps} ${t('detail.reps')}`
          : `${exercise.durationSeconds}s`}
      </p>
    </Card>
  );
}
