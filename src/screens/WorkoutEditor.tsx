import { useState, useEffect, useRef, useCallback, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { BottomActionBar, Button, Card, Checkbox, Input, Select, Textarea, Toast, useDrawerHeader } from "even-toolkit/web";
import { IcEditAdd, IcTrash, IcGuideChevronDrillUp, IcGuideChevronDrillDown, IcFeatCamera } from "even-toolkit/web/icons/svg-icons";
import type { Workout, Exercise } from "../types/workout";
import { useTranslation } from "../hooks/useTranslation";
import { fileToThumbnailDataUrl } from "../utils/image";

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
  setWeightsKg: string[];
  perSetWeights: boolean;
  restSeconds: string;
  mode: "reps" | "timed";
  notes: string;
  unilateral: boolean;
  image: string;
};

function emptyExerciseDraft(): ExerciseDraft {
  return {
    name: "",
    sets: "3",
    reps: "10",
    durationSeconds: "30",
    weightKg: "",
    setWeightsKg: [],
    perSetWeights: false,
    restSeconds: "45",
    mode: "reps",
    notes: "",
    unilateral: false,
    image: "",
  };
}

function toExerciseDraft(exercise: Exercise): ExerciseDraft {
  const perSet = Array.isArray(exercise.setWeightsKg) && exercise.setWeightsKg.length > 0;
  return {
    name: exercise.name,
    sets: String(exercise.sets),
    reps: String(exercise.reps ?? 10),
    durationSeconds: String(exercise.durationSeconds ?? 30),
    weightKg: exercise.weightKg == null ? "" : String(exercise.weightKg),
    setWeightsKg: perSet
      ? Array.from({ length: exercise.sets }, (_, i) => {
          const v = exercise.setWeightsKg?.[i];
          return v == null ? "" : String(v);
        })
      : [],
    perSetWeights: perSet,
    restSeconds: String(exercise.restSeconds),
    mode: exercise.durationSeconds != null ? "timed" : "reps",
    notes: exercise.notes ?? "",
    unilateral: Boolean(exercise.unilateral),
    image: exercise.image ?? "",
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
  const setWeightsKg = draft.perSetWeights
    ? Array.from({ length: sets }, (_, i) => parseOptionalNumber(draft.setWeightsKg[i] ?? ""))
    : undefined;
  const extras = {
    ...(setWeightsKg ? { setWeightsKg } : {}),
    ...(draft.notes.trim() ? { notes: draft.notes.trim() } : {}),
    ...(draft.unilateral ? { unilateral: true } : {}),
    ...(draft.image ? { image: draft.image } : {}),
  };

  if (draft.mode === "timed") {
    return {
      name: draft.name,
      sets,
      reps: null,
      durationSeconds: parsePositiveInt(draft.durationSeconds, 1),
      weightKg,
      ...extras,
      restSeconds,
    };
  }

  return {
    name: draft.name,
    sets,
    reps: parsePositiveInt(draft.reps, 1),
    durationSeconds: null,
    weightKg,
    ...extras,
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
    <div className="relative">
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

  const [titleError, setTitleError] = useState(false);
  const [exerciseNameErrors, setExerciseNameErrors] = useState<boolean[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

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

  const togglePerSetWeights = (index: number, enabled: boolean) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        if (enabled) {
          const setsCount = parsePositiveInt(ex.sets, 1);
          const fill = ex.weightKg;
          const initial = Array.from({ length: setsCount }, (_, k) => ex.setWeightsKg[k] ?? fill);
          return { ...ex, perSetWeights: true, setWeightsKg: initial };
        }
        return { ...ex, perSetWeights: false };
      }),
    );
  };

  const updateSetWeight = (index: number, setIdx: number, value: string) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        const setsCount = parsePositiveInt(ex.sets, 1);
        const next = Array.from({ length: setsCount }, (_, k) =>
          k === setIdx ? value : (ex.setWeightsKg[k] ?? ""),
        );
        return { ...ex, setWeightsKg: next };
      }),
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

  const setUnilateral = (index: number, checked: boolean) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, unilateral: checked } : ex)));
  };

  const moveExercise = (index: number, dir: -1 | 1) => {
    setExercises((prev) => {
      const to = index + dir;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  };

  const handleImagePick = async (index: number, file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToThumbnailDataUrl(file);
      setExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, image: dataUrl } : ex)));
    } catch {
      // Ignore unreadable/invalid images.
    }
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, emptyExerciseDraft()]);
  };

  const handleSave = () => {
    const titleMissing = !title.trim();
    const nameErrors = exercises.map((e) => !e.name.trim());
    const anyExerciseMissingName = nameErrors.some(Boolean);
    const noExercises = exercises.length === 0;

    setTitleError(titleMissing);
    setExerciseNameErrors(nameErrors);

    if (titleMissing || noExercises || anyExerciseMissingName) {
      if (titleMissing) {
        setToast(t('editor.errTitleRequired'));
      } else if (noExercises) {
        setToast(t('editor.errAddExercise'));
      } else {
        setToast(t('editor.errExerciseName'));
      }
      return;
    }

    const workout: Workout = {
      id: id ?? `custom-${Date.now().toString(36)}`,
      title: title.trim(),
      difficulty,
      target: target.trim() || "General",
      estimatedMinutes: parsePositiveInt(estimatedMinutesInput, 1),
      exercises: exercises.map(toExercise),
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
            error={titleError}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(false);
            }}
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
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">
                        {t('editor.exerciseN').replace('{n}', String(i + 1))}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={i === 0}
                          onClick={() => moveExercise(i, -1)}
                          aria-label={t('editor.moveUp')}
                        >
                          <IcGuideChevronDrillUp width={16} height={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={i === exercises.length - 1}
                          onClick={() => moveExercise(i, 1)}
                          aria-label={t('editor.moveDown')}
                        >
                          <IcGuideChevronDrillDown width={16} height={16} />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.name')}</span>
                      <div className="mt-1">
                        <Input
                          placeholder={t('editor.exerciseName')}
                          value={ex.name}
                          error={exerciseNameErrors[i] ?? false}
                          onChange={(e) => {
                            updateExercise(i, "name", e.target.value);
                            if (exerciseNameErrors[i]) {
                              setExerciseNameErrors((prev) => {
                                const next = [...prev];
                                next[i] = false;
                                return next;
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-start">
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
                          disabled={ex.perSetWeights}
                        />
                      </div>
                    </div>
                    <Checkbox
                      checked={ex.perSetWeights}
                      onChange={(checked) => togglePerSetWeights(i, checked)}
                      label={t('editor.perSetWeight')}
                    />
                    {ex.perSetWeights && (
                      <div className="grid grid-cols-3 gap-2 items-start">
                        {Array.from({ length: parsePositiveInt(ex.sets, 1) }, (_, setIdx) => (
                          <div key={setIdx}>
                            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">
                              {t('editor.setLabel')} {setIdx + 1}
                            </span>
                            <Input
                              className="mt-1"
                              type="number"
                              min={0}
                              step="0.5"
                              value={ex.setWeightsKg[setIdx] ?? ""}
                              onChange={(e) => updateSetWeight(i, setIdx, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
                        <Select
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
                    <Checkbox
                      checked={ex.unilateral}
                      onChange={(checked) => setUnilateral(i, checked)}
                      label={isTimed ? t('editor.unilateralTimed') : t('editor.unilateral')}
                    />
                    <div>
                      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.notes')}</span>
                      <Textarea
                        className="mt-1"
                        rows={2}
                        placeholder={t('editor.notesPlaceholder')}
                        value={ex.notes}
                        onChange={(e) => updateExercise(i, "notes", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      {ex.image ? (
                        <img src={ex.image} alt="" className="w-12 h-12 object-cover rounded-[4px]" />
                      ) : null}
                      <label className="inline-flex items-center gap-2 px-3 h-9 rounded-[6px] bg-surface-light text-text text-[13px] tracking-[-0.13px] cursor-pointer hover:bg-surface-lighter">
                        <IcFeatCamera width={16} height={16} />
                        {ex.image ? t('editor.changePhoto') : t('editor.addPhoto')}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImagePick(i, e.target.files?.[0])}
                        />
                      </label>
                      {ex.image && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateExercise(i, "image", "")}
                          aria-label={t('editor.removePhoto')}
                        >
                          <IcTrash width={16} height={16} />
                        </Button>
                      )}
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
          <Button className="w-full" onClick={handleSave}>
            {isEditing ? t('editor.saveChanges') : t('editor.createWorkout')}
          </Button>
        </div>
      </BottomActionBar>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-3">
          <Toast message={toast} variant="error" />
        </div>
      )}
    </div>
  );
}
