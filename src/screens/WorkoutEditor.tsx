import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Button, Card, Input, Select, useDrawerHeader } from "even-toolkit/web";
import { IcTrash } from "even-toolkit/web/icons/svg-icons";
import type { Workout, Exercise } from "../types/workout";
import { useTranslation } from "../hooks/useTranslation";

function emptyExercise(): Exercise {
  return { name: "", sets: 3, reps: 10, durationSeconds: null, restSeconds: 45 };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-border last:border-b-0">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{label}</span>
      <div className="mt-1">{children}</div>
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
    title: isEditing ? t('editor.editWorkout') : t('editor.newWorkout'),
    backTo: '/',
  });

  return (
    <div className="px-3 pt-4 pb-8">
      {/* Workout Details */}
      <SectionLabel>{t('editor.workout')}</SectionLabel>
      <Card className="mb-4">
        <FieldRow label={t('editor.name')}>
          <Input
            placeholder={t('editor.workoutName')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t('editor.difficulty')}>
          <Select
            options={[
              { label: t('editor.beginner'), value: "beginner" },
              { label: t('editor.intermediate'), value: "intermediate" },
              { label: t('editor.advanced'), value: "advanced" },
            ]}
            value={difficulty}
            onValueChange={(val) => setDifficulty(val as Workout["difficulty"])}
          />
        </FieldRow>
        <FieldRow label={t('editor.targetMuscles')}>
          <Input
            placeholder={t('editor.targetPlaceholder')}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t('editor.estMinutes')}>
          <Input
            type="number"
            min={1}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 1)}
          />
        </FieldRow>
      </Card>

      {/* Exercises */}
      <SectionLabel>{t('editor.exercises')}</SectionLabel>
      <Card className="mb-4">
        {exercises.map((ex, i) => {
          const isTimed = ex.durationSeconds !== null;
          return (
            <div key={i} className="py-3 border-b border-border last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.exercise')} {i + 1}</span>
                {exercises.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeExercise(i)}
                  >
                    <IcTrash width={16} height={16} />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.name')}</span>
                  <Input
                    className="mt-1"
                    placeholder={t('editor.exerciseName')}
                    value={ex.name}
                    onChange={(e) => updateExercise(i, "name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.sets')}</span>
                    <Input
                      className="mt-1"
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) => updateExercise(i, "sets", Number(e.target.value) || 1)}
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
                    <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('editor.restS')}</span>
                    <Input
                      className="mt-1"
                      type="number"
                      min={0}
                      value={ex.restSeconds}
                      onChange={(e) => updateExercise(i, "restSeconds", Number(e.target.value) || 0)}
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
              </div>
            </div>
          );
        })}
        <div className="py-3">
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={addExercise}
          >
            {t('editor.addExercise')}
          </Button>
        </div>
      </Card>

      {/* Bottom Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="ghost" onClick={() => navigate("/")}>{t('editor.cancel')}</Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {isEditing ? t('editor.saveChanges') : t('editor.createWorkout')}
        </Button>
      </div>
    </div>
  );
}
