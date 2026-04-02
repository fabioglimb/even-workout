import { useNavigate } from "react-router";
import { useRef, useState, useCallback } from "react";
import { Card } from "even-toolkit/web";
import { IcTrash } from "even-toolkit/web/icons/svg-icons";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatDuration } from "../../utils/format";
import { useTranslation } from "../../hooks/useTranslation";
import type { Workout } from "../../types/workout";
import type { TouchEvent as ReactTouchEvent } from "react";

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;

interface WorkoutCardProps {
  workout: Workout;
  onDelete?: () => void;
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const dir = useRef<'none' | 'h' | 'v'>('none');

  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    if (!onDelete) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentOffset.current = offset;
    dir.current = 'none';
    setSwiping(true);
  }, [onDelete, offset]);

  const onTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (dir.current === 'none') {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        dir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      return;
    }
    if (dir.current === 'v') return;
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, currentOffset.current + dx)));
  }, [swiping]);

  const onTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);
    if (dir.current === 'v') return;
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0);
  }, [swiping, offset]);

  return (
    <div className="relative overflow-hidden rounded-[6px]">
      {onDelete && offset < 0 && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer rounded-r-[6px]"
          style={{ width: DELETE_WIDTH }}
        >
          <IcTrash width={20} height={20} />
        </button>
      )}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
        }}
      >
        <Card
          className="cursor-pointer transition-all hover:bg-surface-light relative"
          onClick={() => navigate(`/workout/${workout.id}`)}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <DifficultyBadge difficulty={workout.difficulty} />
          </div>
          <h3 className="text-[17px] tracking-[-0.17px] text-text mb-2 pr-24">{workout.title}</h3>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim mb-2 pr-24">
            {workout.target}
          </p>
          <div className="flex items-center gap-4 text-[11px] tracking-[-0.11px] text-text-dim">
            <span>{formatDuration(workout.estimatedMinutes)}</span>
            <span>{workout.exercises.length} {t('detail.exercises')}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
