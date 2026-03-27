import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Button, Card, Input, Select, useDrawerHeader } from "even-toolkit/web";
import { IcTrash } from "even-toolkit/web/icons/svg-icons";
import type { Workout, Exercise } from "../types/workout";
import type { TouchEvent as ReactTouchEvent } from "react";

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;

function emptyExercise(): Exercise {
  return { name: "", sets: 3, reps: 10, durationSeconds: null, restSeconds: 45 };
}

export default function WorkoutEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allWorkouts, addWorkout, updateWorkout } = useWorkoutContext();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Workout["difficulty"]>("beginner");
  const [target, setTarget] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise()]);

  useEffect(() => {
    if (id) {
      const existing = allWorkouts.find((w) => w.id === id);
      if (existing) {
        setTitle(existing.title);
        setDifficulty(existing.difficulty);
        setTarget(existing.target);
        setEstimatedMinutes(existing.estimatedMinutes);
        setExercises(existing.exercises.map((e) => ({ ...e })));
      } else {
        navigate("/");
      }
    }
  }, [id, allWorkouts, navigate]);

  const updateExercise = (index: number, field: keyof Exercise, value: string | number | null) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const toggleExerciseType = (index: number, isTimed: boolean) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        if (isTimed) {
          return { ...ex, reps: null, durationSeconds: 30 };
        }
        return { ...ex, reps: 10, durationSeconds: null };
      })
    );
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, emptyExercise()]);
  };

  // Swipe-to-delete state
  const [swipeOffsets, setSwipeOffsets] = useState<Record<number, number>>({});
  const [swipingIndex, setSwipingIndex] = useState<number | null>(null);
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeCurrentOffset = useRef(0);
  const swipeDir = useRef<'none' | 'h' | 'v'>('none');

  const onExTouchStart = useCallback((e: ReactTouchEvent, index: number) => {
    if (exercises.length <= 1) return;
    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
    swipeCurrentOffset.current = swipeOffsets[index] ?? 0;
    swipeDir.current = 'none';
    setSwipingIndex(index);
  }, [exercises.length, swipeOffsets]);

  const onExTouchMove = useCallback((e: ReactTouchEvent) => {
    if (swipingIndex === null) return;
    const dx = e.touches[0].clientX - swipeStartX.current;
    const dy = e.touches[0].clientY - swipeStartY.current;
    if (swipeDir.current === 'none') {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        swipeDir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      return;
    }
    if (swipeDir.current === 'v') return;
    setSwipeOffsets((prev) => ({
      ...prev,
      [swipingIndex]: Math.min(0, Math.max(-DELETE_WIDTH, swipeCurrentOffset.current + dx)),
    }));
  }, [swipingIndex]);

  const onExTouchEnd = useCallback(() => {
    if (swipingIndex === null) return;
    const idx = swipingIndex;
    setSwipingIndex(null);
    if (swipeDir.current === 'v') return;
    const current = swipeOffsets[idx] ?? 0;
    setSwipeOffsets((prev) => ({
      ...prev,
      [idx]: current < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0,
    }));
  }, [swipingIndex, swipeOffsets]);

  const handleSave = () => {
    if (!title.trim() || exercises.length === 0) return;
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) return;

    const workout: Workout = {
      id: id ?? `custom-${Date.now().toString(36)}`,
      title: title.trim(),
      difficulty,
      target: target.trim() || "General",
      estimatedMinutes,
      exercises: validExercises,
    };

    if (isEditing) {
      updateWorkout(workout);
    } else {
      addWorkout(workout);
    }
    navigate("/");
  };

  useDrawerHeader({
    title: isEditing ? "Edit Workout" : "New Workout",
    backTo: '/',
  });

  return (
      <div className="px-3 pt-4 pb-8">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-1">
              Title
            </label>
            <Input
              placeholder="Workout name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-1">
                Difficulty
              </label>
              <Select
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ]}
                value={difficulty}
                onValueChange={(val) => setDifficulty(val as Workout["difficulty"])}
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-1">
                Est. Minutes
              </label>
              <Input
                type="number"
                min={1}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-1">
              Target Muscles
            </label>
            <Input
              placeholder="e.g. Chest, Back"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
        </div>

        <h2 className="text-[13px] tracking-[-0.13px] text-text-dim mb-3">
          Exercises
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          {exercises.map((ex, i) => {
            const isTimed = ex.durationSeconds !== null;
            const exOffset = swipeOffsets[i] ?? 0;
            const isSwiping = swipingIndex === i;
            return (
              <div key={i} className="relative overflow-hidden rounded-[6px]">
                {exercises.length > 1 && exOffset < 0 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer rounded-r-[6px]"
                    style={{ width: DELETE_WIDTH }}
                  >
                    <IcTrash width={20} height={20} />
                  </button>
                )}
                <div
                  onTouchStart={(e) => onExTouchStart(e, i)}
                  onTouchMove={onExTouchMove}
                  onTouchEnd={onExTouchEnd}
                  style={{
                    transform: `translateX(${exOffset}px)`,
                    transition: isSwiping ? 'none' : 'transform 200ms ease',
                  }}
                >
                  <Card className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] tracking-[-0.11px] text-text-dim">Exercise {i + 1}</span>
                    </div>
                    <Input
                      className="mb-2"
                      placeholder="Exercise name"
                      value={ex.name}
                      onChange={(e) => updateExercise(i, "name", e.target.value)}
                    />
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div>
                        <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-0.5">Sets</label>
                        <Input
                          type="number"
                          min={1}
                          value={ex.sets}
                          onChange={(e) => updateExercise(i, "sets", Number(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-0.5">
                          {isTimed ? "Secs" : "Reps"}
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={isTimed ? (ex.durationSeconds ?? 30) : (ex.reps ?? 10)}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            if (isTimed) {
                              updateExercise(i, "durationSeconds", val);
                            } else {
                              updateExercise(i, "reps", val);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-0.5">Rest(s)</label>
                        <Input
                          type="number"
                          min={0}
                          value={ex.restSeconds}
                          onChange={(e) => updateExercise(i, "restSeconds", Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[-0.11px] text-text-dim mb-0.5">Type</label>
                        <Select
                          options={[
                            { label: "Reps", value: "reps" },
                            { label: "Timed", value: "timed" },
                          ]}
                          value={isTimed ? "timed" : "reps"}
                          onValueChange={(val) => toggleExerciseType(i, val === "timed")}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="ghost" className="w-full mb-6" onClick={addExercise}>
          + Add Exercise
        </Button>

        <Button size="lg" className="w-full" onClick={handleSave}>
          {isEditing ? "Save Changes" : "Create Workout"}
        </Button>
      </div>
  );
}
