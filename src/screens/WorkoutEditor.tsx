import { useState, useEffect, useRef, useCallback, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { BottomActionBar, Button, Card, Input, Select, SegmentedControl, useDrawerHeader } from "even-toolkit/web";
import { IcEditAdd, IcTrash } from "even-toolkit/web/icons/svg-icons";
import type { Workout, Exercise } from "../types/workout";
import { useTranslation } from "../hooks/useTranslation";

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;
const DIRECTION_LOCK_PX = 10;

function emptyExercise(): Exercise {
  return { name: "", sets: 3, reps: 10, durationSeconds: null, weightKg: null, restSeconds: 45 };
}

type ExerciseDraft = {
  name: string;
  sets: string;
  reps: string;
  durationSeconds: string;
  weightKg: string;
  restSeconds: string;
  mode: "reps" | "timed";
};

function emptyExerciseDraft(): ExerciseDraft {
  return {
    name: "",
    sets: "3",
    reps: "10",
    durationSeconds: "30",
    weightKg: "",
    restSeconds: "45",
    mode: "reps",
  };
}

function toExerciseDraft(exercise: Exercise): ExerciseDraft {
  return {
    name: exercise.name,
    sets: String(exercise.sets),
    reps: String(exercise.reps ?? 10),
    durationSeconds: String(exercise.durationSeconds ?? 30),
    weightKg: exercise.weightKg == null ? "" : String(exercise.weightKg),
    restSeconds: String(exercise.restSeconds),
    mode: exercise.durationSeconds != null ? "timed" : "reps",
  };
}

function parsePositiveInt(value: string, fallback = 1): number {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.round(parsed));
}

function parseNonNegativeInt(value: string, fallback = 0): number {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.round(parsed));
}

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toExercise(draft: ExerciseDraft): Exercise {
  const sets = parsePositiveInt(draft.sets, 1);
  const restSeconds = parseNonNegativeInt(draft.restSeconds, 0);
  const weightKg = parseOptionalNumber(draft.weightKg);

  if (draft.mode === "timed") {
    return {
      name: draft.name,
      sets,
      reps: null,
      durationSeconds: parsePositiveInt(draft.durationSeconds, 1),
      weightKg,
      restSeconds,
    };
  }

  return {
    name: draft.name,
    sets,
    reps: parsePositiveInt(draft.reps, 1),
    durationSeconds: null,
    weightKg,
    restSeconds,
  };
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 mb-1.5 flex items-center gap-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-3 py-3 border-b border-border last:border-b-0">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SwipeDeleteCard({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete?: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const direction = useRef<'none' | 'horizontal' | 'vertical'>('none');

  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!onDelete) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentOffset.current = offset;
    direction.current = 'none';
    setSwiping(true);
  }, [offset, onDelete]);

  const onTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!swiping || !onDelete) return;
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
  }, [onDelete, swiping]);

  const onTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);
    if (direction.current === 'vertical') return;
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0);
  }, [offset, swiping]);

  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    onDelete();
    setOffset(0);
    direction.current = 'none';
  }, [onDelete]);

  return (
    <div className="relative overflow-hidden">
      {onDelete && offset < 0 && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer"
          style={{ width: DELETE_WIDTH }}
        >
          <IcTrash width={18} height={18} />
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

export default function WorkoutEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allWorkouts, addWorkout, updateWorkout } = useWorkoutContext();
  const { t } = useTranslation();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Workout["difficulty"]>("beginner");
  const [target, setTarget] = useState("");
  const [estimatedMinutesInput, setEstimatedMinutesInput] = useState("30");
  const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExerciseDraft()]);

  useEffect(() => {
    if (id) {
      const existing = allWorkouts.find((w) => w.id === id);
      if (existing) {
        setTitle(existing.title);
        setDifficulty(existing.difficulty);
        setTarget(existing.target);
        setEstimatedMinutesInput(String(existing.estimatedMinutes));
        setExercises(existing.exercises.map(toExerciseDraft));
      } else {
        navigate("/");
      }
    }
  }, [id, allWorkouts, navigate]);

  const updateExercise = (index: number, field: keyof ExerciseDraft, value: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const toggleExerciseType = (index: number, isTimed: boolean) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        if (isTimed) {
          return {
            ...ex,
            mode: "timed",
            durationSeconds: ex.durationSeconds.trim() === "" ? "30" : ex.durationSeconds,
          };
        }
        return {
          ...ex,
          mode: "reps",
          reps: ex.reps.trim() === "" ? "10" : ex.reps,
        };
      })
    );
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, emptyExerciseDraft()]);
  };

  const handleSave = () => {
    if (!title.trim() || exercises.length === 0) return;
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) return;

    const workout: Workout = {
      id: id ?? `custom-${Date.now().toString(36)}`,
      title: title.trim(),
      difficulty,
      target: target.trim() || "General",
      estimatedMinutes: parsePositiveInt(estimatedMinutesInput, 1),
      exercises: validExercises.map(toExercise),
    };

    if (isEditing) {
      updateWorkout(workout);
    } else {
      addWorkout(workout);
    }
    navigate("/");
  };

  useDrawerHeader({
    title: isEditing ? t('editor.editWorkout') : t('editor.newWorkout'),
    backTo: '/',
  });

  return (
    <div className="px-3 pt-4 pb-0">
      {/* Workout Details */}
      <SectionLabel>{t('editor.workout')}</SectionLabel>
      <Card className="mb-4" padding="none">
        <FieldRow label={t('editor.name')}>
          <Input
            placeholder={t('editor.workoutName')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FieldRow>
        <div className="grid grid-cols-2 gap-2 border-b border-border px-3 py-3">
          <div>
            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.difficulty')}</span>
            <div className="mt-1">
              <Select
                options={[
                  { label: t('editor.beginner'), value: "beginner" },
                  { label: t('editor.intermediate'), value: "intermediate" },
                  { label: t('editor.advanced'), value: "advanced" },
                ]}
                value={difficulty}
                onValueChange={(val) => setDifficulty(val as Workout["difficulty"])}
              />
            </div>
          </div>
          <div>
            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.estMinutes')}</span>
            <div className="mt-1">
              <Input
                type="number"
                min={1}
                value={estimatedMinutesInput}
                onChange={(e) => setEstimatedMinutesInput(e.target.value)}
              />
            </div>
          </div>
        </div>
        <FieldRow label={t('editor.targetMuscles')}>
          <Input
            placeholder={t('editor.targetPlaceholder')}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </FieldRow>
      </Card>

      {/* Exercises */}
      <SectionLabel>{t('editor.exercises')}</SectionLabel>
      <Card className="mb-4" padding="none">
        {exercises.map((ex, i) => {
          const isTimed = ex.mode === "timed";
          return (
            <div key={i}>
              {i > 0 && <div className="mx-3 h-[1px] bg-border" />}
              <SwipeDeleteCard onDelete={exercises.length > 1 ? () => removeExercise(i) : undefined}>
                <div className="px-3 py-3 bg-surface">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.name')}</span>
                      <div className="mt-1">
                        <Input
                          placeholder={t('editor.exerciseName')}
                          value={ex.name}
                          onChange={(e) => updateExercise(i, "name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.sets')}</span>
                        <Input
                          className="mt-1"
                          type="number"
                          min={1}
                          value={ex.sets}
                          onChange={(e) => updateExercise(i, "sets", e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">
                          {isTimed ? t('editor.secs') : t('editor.reps')}
                        </span>
                        <Input
                          className="mt-1"
                          type="number"
                          min={1}
                          value={isTimed ? ex.durationSeconds : ex.reps}
                          onChange={(e) => {
                            if (isTimed) {
                              updateExercise(i, "durationSeconds", e.target.value);
                            } else {
                              updateExercise(i, "reps", e.target.value);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.kg')}</span>
                        <Input
                          className="mt-1"
                          type="number"
                          min={0}
                          step="0.5"
                          value={ex.weightKg}
                          onChange={(e) => updateExercise(i, "weightKg", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.restS')}</span>
                        <Input
                          className="mt-1"
                          type="number"
                          min={0}
                          value={ex.restSeconds}
                          onChange={(e) => updateExercise(i, "restSeconds", e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.type')}</span>
                        <SegmentedControl
                          size="small"
                          className="mt-1"
                          options={[
                            { label: t('editor.reps'), value: "reps" },
                            { label: t('editor.timed'), value: "timed" },
                          ]}
                          value={isTimed ? "timed" : "reps"}
                          onValueChange={(val) => toggleExerciseType(i, val === "timed")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwipeDeleteCard>
            </div>
          );
        })}
        <div className="px-3 py-3">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 bg-text text-text-highlight hover:bg-text/90 hover:text-text-highlight"
            onClick={addExercise}
          >
            <IcEditAdd width={16} height={16} />
            {t('editor.addExercise')}
          </Button>
        </div>
      </Card>

      {/* Bottom Buttons */}
      <BottomActionBar className="-mx-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={() => navigate("/")}>{t('editor.cancel')}</Button>
          <Button className="w-full" onClick={handleSave} disabled={!title.trim()}>
            {isEditing ? t('editor.saveChanges') : t('editor.createWorkout')}
          </Button>
        </div>
      </BottomActionBar>
    </div>
  );
}
