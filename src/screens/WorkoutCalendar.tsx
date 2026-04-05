import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent as ReactTouchEvent } from 'react';
import { useLocation } from 'react-router';
import {
  Badge,
  Button,
  Calendar,
  Card,
  EmptyState,
  Select,
  TimePicker,
  useDrawerHeader,
  type CalendarEvent,
  type CalendarEventMove,
  type CalendarView,
} from 'even-toolkit/web';
import { IcFeatCalendar } from 'even-toolkit/web/icons/svg-icons';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { useTranslation } from '../hooks/useTranslation';

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;
const DIRECTION_LOCK_PX = 10;

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function parseTimeKey(value?: string): { hour: number; minute: number } {
  const [hour, minute] = (value ?? '07:00').split(':').map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : 7,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

function toTimeKey(value: { hour: number; minute: number }): string {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
}

function formatTimeKey(value?: string): string {
  const { hour, minute } = parseTimeKey(value);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function workoutColor(difficulty: string): string {
  if (difficulty === 'advanced') return 'var(--color-negative)';
  if (difficulty === 'beginner') return 'var(--color-positive)';
  return 'var(--color-accent)';
}

function formatSelectedDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function SwipeDeleteRow({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const direction = useRef<'none' | 'horizontal' | 'vertical'>('none');

  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentOffset.current = offset;
    direction.current = 'none';
    setSwiping(true);
  }, [offset]);

  const onTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (direction.current === 'none') {
      if (Math.abs(dx) > DIRECTION_LOCK_PX || Math.abs(dy) > DIRECTION_LOCK_PX) {
        direction.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      return;
    }

    if (direction.current === 'vertical') return;
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, currentOffset.current + dx)));
  }, [swiping]);

  const onTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);
    if (direction.current === 'vertical') return;
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0);
  }, [offset, swiping]);

  const handleDelete = useCallback(() => {
    onDelete();
    setOffset(0);
    direction.current = 'none';
  }, [onDelete]);

  return (
    <div className="relative overflow-hidden rounded-[6px]">
      {offset < 0 && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer"
          style={{ width: DELETE_WIDTH }}
        >
          {`Delete`}
        </button>
      )}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function WorkoutCalendar() {
  const {
    allWorkouts,
    scheduleEntries,
    scheduleWorkout,
    removeScheduledWorkout,
    moveScheduledWorkout,
  } = useWorkoutContext();
  const { t } = useTranslation();
  const location = useLocation();
  const initialWorkoutId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('workout') ?? '';
  }, [location.search]);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(initialWorkoutId);
  const [scheduledTime, setScheduledTime] = useState(() => ({ hour: 7, minute: 0 }));
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  useEffect(() => {
    if (initialWorkoutId) {
      setSelectedWorkoutId(initialWorkoutId);
      return;
    }
    if (!selectedWorkoutId && allWorkouts.length > 0) {
      setSelectedWorkoutId(allWorkouts[0]!.id);
    }
  }, [allWorkouts, initialWorkoutId, selectedWorkoutId]);

  useDrawerHeader({
    title: t('calendar.title'),
  });

  const workoutById = useMemo(
    () => new Map(allWorkouts.map((workout) => [workout.id, workout])),
    [allWorkouts],
  );

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const counts = new Map<string, number>();
    return scheduleEntries.flatMap((entry) => {
      const workout = workoutById.get(entry.workoutId);
      if (!workout) return [];
      const count = counts.get(entry.scheduledFor) ?? 0;
      counts.set(entry.scheduledFor, count + 1);

      const start = fromDateKey(entry.scheduledFor);
      const time = parseTimeKey(entry.scheduledTime);
      start.setHours(time.hour, time.minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + Math.max(30, workout.estimatedMinutes));

      return [{
        id: entry.id,
        title: workout.title,
        start,
        end,
        color: workoutColor(workout.difficulty),
        description: workout.target,
      }];
    });
  }, [scheduleEntries, workoutById]);

  const selectedDateKey = toDateKey(selectedDate);

  const selectedDayEntries = useMemo(() => {
    return scheduleEntries
      .filter((entry) => entry.scheduledFor === selectedDateKey)
      .map((entry) => ({
        entry,
        workout: workoutById.get(entry.workoutId),
      }))
      .filter((item): item is { entry: typeof item.entry; workout: NonNullable<typeof item.workout> } => !!item.workout)
      .sort((a, b) => {
        const timeDiff = (a.entry.scheduledTime ?? '07:00').localeCompare(b.entry.scheduledTime ?? '07:00');
        if (timeDiff !== 0) return timeDiff;
        return a.workout.title.localeCompare(b.workout.title);
      });
  }, [scheduleEntries, selectedDateKey, workoutById]);

  const totalPlanned = scheduleEntries.length;
  const startWeek = startOfWeek(selectedDate);
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 7);
  const thisWeekCount = scheduleEntries.filter((entry) => {
    const date = fromDateKey(entry.scheduledFor);
    return date >= startWeek && date < endWeek;
  }).length;

  const handleSchedule = () => {
    if (!selectedWorkoutId) return;
    scheduleWorkout(selectedWorkoutId, selectedDateKey, toTimeKey(scheduledTime));
  };

  return (
    <div className="px-3 pt-4 pb-8 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card variant="elevated" className="text-center">
          <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">{t('calendar.totalPlanned')}</p>
          <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">{totalPlanned}</p>
        </Card>
        <Card variant="elevated" className="text-center">
          <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1">{t('calendar.thisWeek')}</p>
          <p className="text-[20px] tracking-[-0.6px] text-accent tabular-nums">{thisWeekCount}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <Calendar
          className="px-1"
          events={calendarEvents}
          view={view}
          onViewChange={setView}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onEventClick={(event) => {
            const entry = scheduleEntries.find((item) => item.id === event.id);
            if (!entry) return;
            setSelectedDate(fromDateKey(entry.scheduledFor));
            setSelectedWorkoutId(entry.workoutId);
            setView('day');
          }}
          onEventMove={({ event, start }: CalendarEventMove) => {
            moveScheduledWorkout(event.id, toDateKey(start), toTimeKey({
              hour: start.getHours(),
              minute: start.getMinutes(),
            }));
          }}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] tracking-[-0.15px] text-text">{t('calendar.forDate')}</p>
            <p className="text-[13px] tracking-[-0.13px] text-text-dim mt-1">{formatSelectedDate(selectedDate)}</p>
          </div>
          <Badge>{selectedDayEntries.length} {t('calendar.planned')}</Badge>
        </div>

        {allWorkouts.length === 0 ? (
          <EmptyState
            title={t('calendar.noWorkouts')}
            description={t('calendar.noWorkoutsDesc')}
          />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div className="min-w-0">
                <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1.5 uppercase">{t('calendar.workout')}</p>
                <Select
                  value={selectedWorkoutId}
                  onValueChange={setSelectedWorkoutId}
                  options={allWorkouts.map((workout) => ({
                    value: workout.id,
                    label: workout.title,
                  }))}
                />
              </div>

              <div className="grid grid-cols-[112px_1fr] gap-2 items-end">
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[-0.11px] text-text-dim mb-1.5 uppercase">{t('calendar.time')}</p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full justify-center gap-2"
                    onClick={() => setTimePickerOpen(true)}
                  >
                    {formatTimeKey(toTimeKey(scheduledTime))}
                  </Button>
                </div>
                <Button size="sm" className="w-full self-end justify-center gap-2" onClick={handleSchedule}>
                  <IcFeatCalendar width={18} height={18} />
                  {t('calendar.schedule')}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {selectedDayEntries.length === 0 ? (
                <div className="rounded-[6px] bg-surface-light px-4 py-3">
                  <p className="text-[13px] tracking-[-0.13px] text-text-dim">{t('calendar.emptyDay')}</p>
                </div>
              ) : selectedDayEntries.map(({ entry, workout }) => (
                <SwipeDeleteRow key={entry.id} onDelete={() => removeScheduledWorkout(entry.id)}>
                  <div className="rounded-[6px] border border-border bg-surface-light px-4 py-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] tracking-[-0.15px] text-text truncate">{workout.title}</p>
                      <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-1">
                        {formatTimeKey(entry.scheduledTime)} · {workout.target} · {workout.estimatedMinutes} min · {workout.exercises.length} ex
                      </p>
                    </div>
                  </div>
                </SwipeDeleteRow>
              ))}
            </div>
          </>
        )}
      </Card>

      <TimePicker
        open={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
        title={t('calendar.pickTime')}
        value={scheduledTime}
        onValueChange={setScheduledTime}
        format="24h"
      />
    </div>
  );
}
