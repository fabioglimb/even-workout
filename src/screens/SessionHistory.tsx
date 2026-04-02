import { useMemo, useState } from "react";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Card, Badge, Button, EmptyState, ListItem, ConfirmDialog, useDrawerHeader } from "even-toolkit/web";
import { IcTrash } from "even-toolkit/web/icons/svg-icons";
import { useTranslation } from "../hooks/useTranslation";

export default function SessionHistory() {
  const { sessionHistory, removeSession, clearHistory } = useWorkoutContext();
  const [confirmClear, setConfirmClear] = useState(false);
  const { t } = useTranslation();

  useDrawerHeader({
    title: t('history.title'),
    right: sessionHistory.length > 0 ? (
      <Button variant="ghost" size="icon" onClick={() => setConfirmClear(true)}>
        <IcTrash width={20} height={20} />
      </Button>
    ) : undefined,
  });

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
    <>
      <div className="px-3 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card variant="elevated" className="text-center">
            <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">{t('history.totalWorkouts')}</p>
            <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">{sessionHistory.length}</p>
          </Card>
          <Card variant="elevated" className="text-center">
            <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">{t('history.thisWeek')}</p>
            <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">{thisWeekCount}</p>
          </Card>
        </div>

        {sessionHistory.length === 0 ? (
          <EmptyState title={t('history.noSessions')} description={t('history.noSessionsDesc')} />
        ) : (
          <div className="flex flex-col gap-3">
            {sessionHistory.map((session) => (
              <div key={session.id} className="rounded-[6px] overflow-hidden">
                <ListItem
                  title={session.workoutTitle}
                  subtitle={`${formatSessionDuration(session.durationSeconds)}  ·  ${session.setsCompleted}/${session.totalSets} ${t('history.sets')}  ·  ${session.exercisesCompleted}/${session.totalExercises} ${t('history.exercises')}`}
                  onDelete={() => removeSession(session.id)}
                  trailing={<Badge>{formatDate(session.completedAt)}</Badge>}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearHistory}
        title={t('history.clearTitle')}
        description={t('history.clearDesc')}
        confirmLabel={t('history.clearAll')}
        cancelLabel={t('detail.cancel')}
        variant="danger"
      />
    </>
  );
}
