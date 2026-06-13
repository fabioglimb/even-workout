import { useNavigate } from "react-router";
import { useRef, useState, useCallback } from "react";
import { Card } from "even-toolkit/web";
import { IcTrash, IcStatusGrabber } from "even-toolkit/web/icons/svg-icons";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatDuration } from "../../utils/format";
import { useTranslation } from "../../hooks/useTranslation";
import type { Workout } from "../../types/workout";
import type { HTMLAttributes } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;

interface WorkoutCardProps {
  workout: Workout;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

export function WorkoutCard({ workout, isFavorite, onToggleFavorite, onDelete, dragHandleProps }: WorkoutCardProps) {
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
          className="cursor-pointer transition-all hover:bg-surface-light"
          onClick={() => navigate(`/workout/${workout.id}`)}
        >
          <div className="flex items-stretch gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {onToggleFavorite && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="text-[17px] leading-none cursor-pointer shrink-0">
                    {isFavorite ? '★' : '☆'}
                  </button>
                )}
                <h3 className="text-[17px] tracking-[-0.17px] text-text">{workout.title}</h3>
              </div>
              <p className="text-[13px] tracking-[-0.13px] text-text-dim mb-2">
                {workout.target}
              </p>
              <div className="flex items-center gap-4 text-[11px] tracking-[-0.11px] text-text-dim">
                <span>{formatDuration(workout.estimatedMinutes)}</span>
                <span>{workout.exercises.length} {t('detail.exercises')}</span>
              </div>
            </div>
            <div className={`flex flex-col items-center shrink-0 ${dragHandleProps ? 'justify-between' : 'justify-center'}`}>
              <DifficultyBadge difficulty={workout.difficulty} />
              {dragHandleProps && (
                <div
                  className="flex items-center justify-center touch-none p-1"
                  onClick={(e) => e.stopPropagation()}
                  {...dragHandleProps}
                >
                  <IcStatusGrabber width={16} height={16} className="text-text-dim" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
