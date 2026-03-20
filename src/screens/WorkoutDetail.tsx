import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getWorkoutById, getTotalSets } from "../data/workouts";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Card, Button, Badge, NavHeader, AppShell, EmptyState, ConfirmDialog, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "even-toolkit/web";
import { IcChevronBack } from "even-toolkit/web/icons/svg-icons";
import { DifficultyBadge } from "../components/shared/DifficultyBadge";
import { formatDuration } from "../utils/format";

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startWorkout, allWorkouts, removeWorkout } = useWorkoutContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const workout = id ? getWorkoutById(id, allWorkouts) : undefined;

  if (!workout) {
    return (
      <AppShell header={<NavHeader title="Workout" left={<Button variant="ghost" size="icon" onClick={() => navigate("/")}><IcChevronBack width={20} height={20} /></Button>} />}>
        <EmptyState title="Workout not found" />
      </AppShell>
    );
  }

  const handleStart = () => {
    startWorkout(workout.id);
    navigate(`/workout/${workout.id}/active`);
  };

  const totalReps = workout.exercises.reduce((sum, ex) => sum + (ex.reps ?? 0) * ex.sets, 0);

  return (
    <AppShell header={<NavHeader title={workout.title} left={<Button variant="ghost" size="icon" onClick={() => navigate("/")}><IcChevronBack width={20} height={20} /></Button>} />}>
      <div className="px-3 pb-8">
        {/* Stats badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
          <DifficultyBadge difficulty={workout.difficulty} />
          <Badge variant="accent">{formatDuration(workout.estimatedMinutes)}</Badge>
          <Badge>{workout.exercises.length} exercises</Badge>
          <Badge>{getTotalSets(workout)} sets</Badge>
          {totalReps > 0 && <Badge>{totalReps} reps</Badge>}
        </div>

        {/* Exercise table */}
        <Card padding="none" className="mb-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead className="text-center">Sets</TableHead>
                <TableHead className="text-center">Reps/Dur</TableHead>
                <TableHead className="text-center">Rest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workout.exercises.map((ex, i) => (
                <TableRow key={i}>
                  <TableCell className="text-text">{ex.name}</TableCell>
                  <TableCell className="text-center text-text-dim">{ex.sets}</TableCell>
                  <TableCell className="text-center text-text-dim tabular-nums">
                    {ex.reps !== null ? `${ex.reps}` : `${ex.durationSeconds}s`}
                  </TableCell>
                  <TableCell className="text-center text-text-dim tabular-nums">{ex.restSeconds}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Button size="lg" className="w-full" onClick={handleStart}>
          Start Workout
        </Button>

        <div className="flex gap-2 mt-4">
          <Button variant="default" className="flex-1" onClick={() => navigate(`/editor/${workout.id}`)}>
            Edit
          </Button>
          <Button variant="danger" className="flex-1" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { removeWorkout(workout.id); navigate("/"); }}
        title="Delete Workout?"
        description="This will permanently remove this workout. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </AppShell>
  );
}
