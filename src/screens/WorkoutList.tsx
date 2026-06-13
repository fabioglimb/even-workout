import { useRef, useState, useCallback, useEffect, type TouchEvent as ReactTouchEvent } from "react";
import { useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { WorkoutCard } from "../components/shared/WorkoutCard";
import { Button, useDrawerHeader } from "even-toolkit/web";
import { Skeleton } from "even-toolkit/web/skeleton";
import { IcEditAdd } from "even-toolkit/web/icons/svg-icons";
import { useTranslation } from "../hooks/useTranslation";

export default function WorkoutList() {
  const navigate = useNavigate();
  const { allWorkouts, removeWorkout, moveWorkout, favoriteIds, toggleFavorite, loaded } = useWorkoutContext();
  const { t } = useTranslation();

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const workoutsRef = useRef(allWorkouts);
  workoutsRef.current = allWorkouts;
  const dragRef = useRef<{ index: number; startClientY: number } | null>(null);
  const dragHappened = useRef(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragMove = useCallback((clientY: number) => {
    if (!dragRef.current) return;
    const { index, startClientY } = dragRef.current;
    const delta = clientY - startClientY;

    if (Math.abs(delta) > 4) dragHappened.current = true;

    const refs = itemRefs.current;
    const dragged = refs[index];
    if (!dragged) return;
    const draggedRect = dragged.getBoundingClientRect();
    // getBoundingClientRect already reflects the CSS transform, so use it directly
    const draggedMidY = draggedRect.top + draggedRect.height / 2;

    if (index > 0) {
      const above = refs[index - 1];
      if (above) {
        const aboveRect = above.getBoundingClientRect();
        if (draggedMidY < aboveRect.top + aboveRect.height / 2) {
          const newStartClientY = startClientY - aboveRect.height;
          dragRef.current = { index: index - 1, startClientY: newStartClientY };
          setDraggingIndex(index - 1);
          setDragOffset(clientY - newStartClientY);
          moveWorkout(index, index - 1);
          return;
        }
      }
    }

    if (index < workoutsRef.current.length - 1) {
      const below = refs[index + 1];
      if (below) {
        const belowRect = below.getBoundingClientRect();
        if (draggedMidY > belowRect.top + belowRect.height / 2) {
          const newStartClientY = startClientY + belowRect.height;
          dragRef.current = { index: index + 1, startClientY: newStartClientY };
          setDraggingIndex(index + 1);
          setDragOffset(clientY - newStartClientY);
          moveWorkout(index, index + 1);
          return;
        }
      }
    }

    setDragOffset(delta);
  }, [moveWorkout]);

  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
    setDraggingIndex(null);
    setDragOffset(0);
  }, []);

  const onHandleTouchStart = useCallback((e: ReactTouchEvent, index: number) => {
    dragRef.current = { index, startClientY: e.touches[0].clientY };
    setDraggingIndex(index);
    setDragOffset(0);
  }, []);

  const onHandleTouchMove = useCallback((e: ReactTouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  }, [handleDragMove]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    dragRef.current = { index, startClientY: e.clientY };
    dragHappened.current = false;
    setDraggingIndex(index);
    setDragOffset(0);
  }, []);

  useEffect(() => {
    if (draggingIndex === null) return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggingIndex, handleDragMove, handleDragEnd]);

  useDrawerHeader({
    title: 'ER Workout',
    right: (
      <Button size="sm" onClick={() => navigate("/editor")} aria-label={t('editor.newWorkout')}>
        <IcEditAdd width={16} height={16} />
      </Button>
    ),
  });

  // While the storage bridge is still loading, show placeholders instead of a
  // flash of preset workouts before the user's real data arrives.
  if (!loaded) {
    return (
      <div className="px-3 pt-2 pb-8 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={96} rounded="default" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-3 pt-2 pb-8 flex flex-col gap-3">
      {allWorkouts.map((workout, i) => {
        const isDragging = draggingIndex === i;
        return (
          <div
            key={workout.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            onClickCapture={(e) => {
              if (dragHappened.current) {
                e.stopPropagation();
                dragHappened.current = false;
              }
            }}
            style={isDragging ? {
              transform: `translateY(${dragOffset}px)`,
              position: 'relative',
              zIndex: 10,
              borderRadius: 6,
              // box-shadow (composited) instead of filter: drop-shadow, which
              // repaints every frame during the transform/reorder and flickers.
              boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
              willChange: 'transform',
            } : undefined}
          >
            <WorkoutCard
              workout={workout}
              isFavorite={favoriteIds.includes(workout.id)}
              onToggleFavorite={() => toggleFavorite(workout.id)}
              onDelete={() => removeWorkout(workout.id)}
              dragHandleProps={{
                onMouseDown: (e) => onHandleMouseDown(e, i),
                onTouchStart: (e) => onHandleTouchStart(e, i),
                onTouchMove: onHandleTouchMove,
                onTouchEnd: handleDragEnd,
                onTouchCancel: handleDragEnd,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
