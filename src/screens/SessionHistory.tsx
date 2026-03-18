import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function SessionHistory() {
  const navigate = useNavigate();
  const { sessionHistory, removeSession, clearHistory } = useWorkoutContext();

  const thisWeekCount = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return sessionHistory.filter(
      (s) => new Date(s.completedAt) >= startOfWeek
    ).length;
  }, [sessionHistory]);

  const formatSessionDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-text-muted uppercase tracking-wider mb-6 hover:text-text-secondary transition-colors"
      >
        &larr; Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Session History
        </h1>
        {sessionHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-2 py-1 text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 bg-surface-light rounded-sm border border-surface-lighter"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card variant="elevated" padding="md" className="text-center">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
            Total Workouts
          </p>
          <p className="text-2xl font-bold text-cyan-accent tabular-nums">
            {sessionHistory.length}
          </p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
            This Week
          </p>
          <p className="text-2xl font-bold text-cyan-accent tabular-nums">
            {thisWeekCount}
          </p>
        </Card>
      </div>

      {sessionHistory.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          No sessions yet. Complete a workout to see it here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessionHistory.map((session) => (
            <Card key={session.id} padding="md">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-text-primary">
                  {session.workoutTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{formatDate(session.completedAt)}</Badge>
                  <button
                    onClick={() => removeSession(session.id)}
                    className="px-2 py-1 text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 bg-surface-light rounded-sm border border-surface-lighter"
                  >
                    Del
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{formatSessionDuration(session.durationSeconds)}</span>
                <span>
                  {session.setsCompleted}/{session.totalSets} sets
                </span>
                <span>
                  {session.exercisesCompleted}/{session.totalExercises} exercises
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
