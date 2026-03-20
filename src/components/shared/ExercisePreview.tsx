import { Card } from "even-toolkit/web";
import type { Exercise } from "../../types/workout";

interface ExercisePreviewProps {
  exercise: Exercise;
}

export function ExercisePreview({ exercise }: ExercisePreviewProps) {
  return (
    <Card padding="sm" className="opacity-70 w-full text-center">
      <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">
        Up Next
      </p>
      <p className="text-[13px] tracking-[-0.13px] text-text">{exercise.name}</p>
      <p className="text-[11px] tracking-[-0.11px] text-text-dim">
        {exercise.sets} sets &middot;{" "}
        {exercise.reps !== null
          ? `${exercise.reps} reps`
          : `${exercise.durationSeconds}s`}
      </p>
    </Card>
  );
}
