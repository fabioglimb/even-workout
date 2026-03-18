import { useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { WorkoutCard } from "../components/shared/WorkoutCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function WorkoutList() {
  const navigate = useNavigate();
  const { allWorkouts, sessionHistory } = useWorkoutContext();

  const recentSessions = sessionHistory.slice(0, 3);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold text-text-primary">Even Workout</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
            History
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/editor")}>
            + New
          </Button>
        </div>
      </div>
      <p className="text-sm text-text-secondary uppercase tracking-widest mb-6">
        Choose your session
      </p>

      {sessionHistory.length > 0 && (
        <Card variant="elevated" padding="md" className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-text-muted">
              Completed
            </p>
            <p className="text-lg font-bold text-cyan-accent tabular-nums">
              {sessionHistory.length} workout{sessionHistory.length !== 1 ? "s" : ""}
            </p>
          </div>
          {recentSessions.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {recentSessions.map((s) => (
                <p key={s.id} className="text-xs text-text-muted truncate">
                  {s.workoutTitle} &mdash;{" "}
                  {new Date(s.completedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {allWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
