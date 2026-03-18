import { useParams, useNavigate } from "react-router";
import { getWorkoutById, getTotalSets } from "../data/workouts";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DifficultyBadge } from "../components/shared/DifficultyBadge";
import { formatDuration } from "../utils/format";

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startWorkout, allWorkouts, removeWorkout } = useWorkoutContext();

  const workout = id ? getWorkoutById(id, allWorkouts) : undefined;

  if (!workout) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary">Workout not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/")}>
          Back
        </Button>
      </div>
    );
  }

  const handleStart = () => {
    startWorkout(workout.id);
    navigate(`/workout/${workout.id}/active`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-text-muted uppercase tracking-wider mb-6 hover:text-text-secondary transition-colors"
      >
        &larr; Back
      </button>

      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-text-primary">
            {workout.title}
          </h1>
          <DifficultyBadge difficulty={workout.difficulty} />
        </div>
        <p className="text-sm text-text-secondary uppercase tracking-wider">
          {workout.target}
        </p>
        <div className="flex gap-4 mt-2 text-xs text-text-muted">
          <span>{formatDuration(workout.estimatedMinutes)}</span>
          <span>{workout.exercises.length} exercises</span>
          <span>{getTotalSets(workout)} total sets</span>
        </div>
      </div>

      <Card padding="none" className="mb-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-lighter text-left text-xs text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Exercise</th>
              <th className="px-4 py-3 text-center">Sets</th>
              <th className="px-4 py-3 text-center">Reps/Dur</th>
              <th className="px-4 py-3 text-center">Rest</th>
            </tr>
          </thead>
          <tbody>
            {workout.exercises.map((ex, i) => (
              <tr
                key={i}
                className="border-b border-surface-lighter last:border-0"
              >
                <td className="px-4 py-3 font-medium text-text-primary">
                  {ex.name}
                </td>
                <td className="px-4 py-3 text-center text-text-secondary">
                  {ex.sets}
                </td>
                <td className="px-4 py-3 text-center text-text-secondary tabular-nums">
                  {ex.reps !== null ? `${ex.reps}` : `${ex.durationSeconds}s`}
                </td>
                <td className="px-4 py-3 text-center text-text-secondary tabular-nums">
                  {ex.restSeconds}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Button size="xl" className="w-full" onClick={handleStart}>
        Start Workout
      </Button>

      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => navigate(`/editor/${workout.id}`)}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          className="flex-1 text-red-400 hover:text-red-300"
          onClick={() => {
            removeWorkout(workout.id);
            navigate("/");
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
