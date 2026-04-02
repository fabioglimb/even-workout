import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getWorkoutById, getTotalSets } from "../data/workouts";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Card, Button, Badge, EmptyState, ConfirmDialog, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, useDrawerHeader } from "even-toolkit/web";
import { DifficultyBadge } from "../components/shared/DifficultyBadge";
import { formatDuration } from "../utils/format";
import { useTranslation } from "../hooks/useTranslation";

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startWorkout, allWorkouts, removeWorkout } = useWorkoutContext();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const workout = id ? getWorkoutById(id, allWorkouts) : undefined;

  useDrawerHeader({
    title: workout?.title ?? t('editor.workout'),
    backTo: '/',
  });

  if (!workout) {
    return (
      <EmptyState title={t('detail.notFound')} />
    );
  }

  const handleStart = () => {
    startWorkout(workout.id);
    navigate(`/workout/${workout.id}/active`);
  };

  const totalReps = workout.exercises.reduce((sum, ex) => sum + (ex.reps ?? 0) * ex.sets, 0);

  return (
    <>
      <div className="px-3 pb-8">
        {/* Stats badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
          <DifficultyBadge difficulty={workout.difficulty} />
          <Badge variant="accent">{formatDuration(workout.estimatedMinutes)}</Badge>
          <Badge>{workout.exercises.length} {t('detail.exercises')}</Badge>
          <Badge>{getTotalSets(workout)} {t('detail.sets')}</Badge>
          {totalReps > 0 && <Badge>{totalReps} {t('detail.reps')}</Badge>}
        </div>

        {/* Exercise table */}
        <Card padding="none" className="mb-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('detail.exercise')}</TableHead>
                <TableHead className="text-center">{t('editor.sets')}</TableHead>
                <TableHead className="text-center">{t('detail.repsDur')}</TableHead>
                <TableHead className="text-center">{t('detail.rest')}</TableHead>
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
          {t('detail.startWorkout')}
        </Button>

        <div className="flex gap-2 mt-4">
          <Button variant="default" className="flex-1" onClick={() => navigate(`/editor/${workout.id}`)}>
            {t('detail.edit')}
          </Button>
          <Button variant="danger" className="flex-1" onClick={() => setConfirmDelete(true)}>
            {t('detail.delete')}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { removeWorkout(workout.id); navigate("/"); }}
        title={t('detail.deleteTitle')}
        description={t('detail.deleteDesc')}
        confirmLabel={t('detail.delete')}
        cancelLabel={t('detail.cancel')}
        variant="danger"
      />
    </>
  );
}
