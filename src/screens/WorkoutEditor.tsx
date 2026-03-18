import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import type { Workout, Exercise } from "../types/workout";

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

  const inputClass =
    "w-full bg-surface border border-surface-lighter rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-cyan-accent";
  const selectClass = inputClass + " appearance-none pr-8 bg-[length:16px_16px] bg-[position:right_8px_center] bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20d%3D%22M8%2012l-4-4h8zM8%204l4%204H4z%22%2F%3E%3C%2Fsvg%3E')]";

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-text-muted uppercase tracking-wider mb-6 hover:text-text-secondary transition-colors"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {isEditing ? "Edit Workout" : "New Workout"}
      </h1>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
            Title
          </label>
          <input
            className={inputClass}
            placeholder="Workout name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              className={selectClass}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Workout["difficulty"])}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
              Est. Minutes
            </label>
            <input
              type="number"
              className={inputClass}
              min={1}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
            Target Muscles
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Chest, Back"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
        Exercises
      </h2>

      <div className="flex flex-col gap-3 mb-4">
        {exercises.map((ex, i) => {
          const isTimed = ex.durationSeconds !== null;
          return (
            <Card key={i} padding="md" className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted uppercase">Exercise {i + 1}</span>
                {exercises.length > 1 && (
                  <button
                    onClick={() => removeExercise(i)}
                    className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className={inputClass + " mb-2"}
                placeholder="Exercise name"
                value={ex.name}
                onChange={(e) => updateExercise(i, "name", e.target.value)}
              />
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <label className="block text-[10px] text-text-muted uppercase mb-0.5">Sets</label>
                  <input
                    type="number"
                    className={inputClass}
                    min={1}
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, "sets", Number(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase mb-0.5">
                    {isTimed ? "Secs" : "Reps"}
                  </label>
                  <input
                    type="number"
                    className={inputClass}
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
                  <label className="block text-[10px] text-text-muted uppercase mb-0.5">Rest(s)</label>
                  <input
                    type="number"
                    className={inputClass}
                    min={0}
                    value={ex.restSeconds}
                    onChange={(e) => updateExercise(i, "restSeconds", Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted uppercase mb-0.5">Type</label>
                  <select
                    className={selectClass}
                    value={isTimed ? "timed" : "reps"}
                    onChange={(e) => toggleExerciseType(i, e.target.value === "timed")}
                  >
                    <option value="reps">Reps</option>
                    <option value="timed">Timed</option>
                  </select>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mb-6" onClick={addExercise}>
        + Add Exercise
      </Button>

      <Button size="xl" className="w-full" onClick={handleSave}>
        {isEditing ? "Save Changes" : "Create Workout"}
      </Button>
    </div>
  );
}
