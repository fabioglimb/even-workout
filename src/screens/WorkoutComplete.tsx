import { useLocation, useNavigate } from "react-router";
import { Card, Button, Badge, EmptyState, useDrawerHeader } from "even-toolkit/web";
import { useTranslation } from "../hooks/useTranslation";

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
  useDrawerHeader({ hidden: true });
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as CompleteState | null;

  if (!state) {
    return (
      <div className="px-3 pb-8 text-center pt-8">
        <EmptyState title={t('complete.noData')} />
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/")}>
          {t('complete.backToWorkouts')}
        </Button>
      </div>
    );
  }

  const durationMs = state.finishedAt - state.startedAt;
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = Math.floor((durationMs % 60000) / 1000);

  return (
    <div className="px-3 pb-8 text-center pt-8">
      <Badge variant="accent" className="mb-4">
        {t('complete.workoutComplete')}
      </Badge>
      <h1 className="text-[24px] tracking-[-0.72px] text-text mb-2">
        {state.workoutTitle}
      </h1>
      <p className="text-[13px] tracking-[-0.13px] text-text-dim mb-8">{t('complete.sessionFinished')}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card variant="elevated">
          <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">
            {t('complete.duration')}
          </p>
          <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">
            {durationMin}:{durationSec.toString().padStart(2, "0")}
          </p>
        </Card>
        <Card variant="elevated">
          <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">
            {t('complete.sets')}
          </p>
          <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">
            {state.completedSets}/{state.totalSets}
          </p>
        </Card>
        <Card variant="elevated">
          <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">
            {t('complete.exercises')}
          </p>
          <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">
            {state.exerciseCount}
          </p>
        </Card>
      </div>

      <Button size="lg" className="w-full" onClick={() => navigate("/")}>
        {t('complete.backToWorkouts')}
      </Button>
    </div>
  );
}
