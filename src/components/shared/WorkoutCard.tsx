import { useNavigate } from "react-router";
import { Card } from "../ui/Card";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatDuration } from "../../utils/format";
import type { Workout } from "../../types/workout";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:border-cyan-accent/50 hover:bg-surface-light"
      padding="lg"
      onClick={() => navigate(`/workout/${workout.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-text-primary">{workout.title}</h3>
        <DifficultyBadge difficulty={workout.difficulty} />
      </div>
      <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">
        {workout.target}
      </p>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>{formatDuration(workout.estimatedMinutes)}</span>
        <span>{workout.exercises.length} exercises</span>
      </div>
    </Card>
  );
}
