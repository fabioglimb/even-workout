import { useLocation, useNavigate } from "react-router";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

interface CompleteState {
  workoutId: string;
  workoutTitle: string;
  completedSets: number;
  totalSets: number;
  startedAt: number;
  finishedAt: number;
  exerciseCount: number;
}

export default function WorkoutComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CompleteState | null;

  if (!state) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary">No workout data.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  const durationMs = state.finishedAt - state.startedAt;
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = Math.floor((durationMs % 60000) / 1000);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 text-center">
      <Badge variant="cyan" className="mb-4">
        Workout Complete
      </Badge>
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        {state.workoutTitle}
      </h1>
      <p className="text-sm text-text-secondary mb-8">Session finished</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card variant="elevated" padding="md">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
            Duration
          </p>
          <p className="text-2xl font-bold text-cyan-accent tabular-nums">
            {durationMin}:{durationSec.toString().padStart(2, "0")}
          </p>
        </Card>
        <Card variant="elevated" padding="md">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
            Sets
          </p>
          <p className="text-2xl font-bold text-cyan-accent tabular-nums">
            {state.completedSets}/{state.totalSets}
          </p>
        </Card>
        <Card variant="elevated" padding="md">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
            Exercises
          </p>
          <p className="text-2xl font-bold text-cyan-accent tabular-nums">
            {state.exerciseCount}
          </p>
        </Card>
      </div>

      <Button size="xl" className="w-full" onClick={() => navigate("/")}>
        Back to Workouts
      </Button>
    </div>
  );
}
