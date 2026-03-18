import { Card } from "../ui/Card";
import type { Exercise } from "../../types/workout";

interface ExerciseCardProps {
  exercise: Exercise;
  currentSet: number;
}

export function ExerciseCard({ exercise, currentSet }: ExerciseCardProps) {
  return (
    <Card variant="elevated" padding="lg" className="text-center">
      <p className="text-xs uppercase tracking-widest text-cyan-accent mb-2">
        Current Exercise
      </p>
      <h2 className="text-2xl font-bold text-text-primary mb-4">
        {exercise.name}
      </h2>
      <p className="text-lg text-text-secondary mb-2">
        Set <span className="text-cyan-accent font-bold">{currentSet}</span> of{" "}
        <span className="font-bold">{exercise.sets}</span>
      </p>
      <p className="text-3xl font-bold text-text-primary tabular-nums">
        {exercise.reps !== null
          ? `${exercise.reps} reps`
          : `${exercise.durationSeconds}s`}
      </p>
    </Card>
  );
}
