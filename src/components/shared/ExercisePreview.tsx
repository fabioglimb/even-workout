import { Card } from "../ui/Card";
import type { Exercise } from "../../types/workout";

interface ExercisePreviewProps {
  exercise: Exercise;
}

export function ExercisePreview({ exercise }: ExercisePreviewProps) {
  return (
    <Card padding="sm" className="opacity-70">
      <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
        Up Next
      </p>
      <p className="text-sm font-semibold text-text-primary">{exercise.name}</p>
      <p className="text-xs text-text-secondary">
        {exercise.sets} sets &middot;{" "}
        {exercise.reps !== null
          ? `${exercise.reps} reps`
          : `${exercise.durationSeconds}s`}
      </p>
    </Card>
  );
}
