import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Workout, ActiveWorkoutState, SessionRecord } from "../types/workout";
import type { AppLanguage } from "../utils/i18n";
import { presetWorkouts, getWorkoutById, getTotalSets } from "../data/workouts";
import {
  loadCustomWorkouts,
  saveCustomWorkouts,
  loadSessionHistory,
  saveSession,
  removeSessionById,
  clearSessionHistory,
  loadLanguage,
  saveLanguage,
} from "../data/persistence";

interface WorkoutContextValue {
  activeState: ActiveWorkoutState | null;
  selectedWorkout: Workout | null;
  allWorkouts: Workout[];
  customWorkouts: Workout[];
  sessionHistory: SessionRecord[];
  startWorkout: (workoutId: string) => void;
  completeSet: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
  setRestRemaining: (value: number | ((prev: number) => number)) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  recordSession: (record: SessionRecord) => void;
  removeSession: (id: string) => void;
  clearHistory: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeState, setActiveState] = useState<ActiveWorkoutState | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>(() => {
    const saved = loadCustomWorkouts();
    if (saved.length === 0) {
      saveCustomWorkouts(presetWorkouts);
      return presetWorkouts;
    }
    return saved;
  });
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => loadSessionHistory());
  const [language, setLanguageState] = useState<AppLanguage>(() => loadLanguage());

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const allWorkouts = customWorkouts;

  const selectedWorkout = activeState
    ? getWorkoutById(activeState.workoutId, allWorkouts) ?? null
    : null;

  const startWorkout = useCallback((workoutId: string) => {
    const workout = getWorkoutById(workoutId, loadCustomWorkouts());
    if (!workout) return;
    setActiveState({
      workoutId,
      exerciseIndex: 0,
      currentSet: 1,
      phase: "exercise",
      restRemaining: 0,
      startedAt: Date.now(),
      finishedAt: null,
      completedSets: 0,
      totalSets: getTotalSets(workout),
    });
  }, []);

  const completeSet = useCallback(() => {
    // Read current state to check if this completes the workout
    const current = activeState;
    if (current) {
      const cw = loadCustomWorkouts();
      const wo = getWorkoutById(current.workoutId, cw);
      if (wo) {
        const ex = wo.exercises[current.exerciseIndex];
        const isLast = current.exerciseIndex >= wo.exercises.length - 1 && current.currentSet >= ex.sets;
        if (isLast) {
          const now = Date.now();
          const record: SessionRecord = {
            id: now.toString(36) + Math.random().toString(36).slice(2, 6),
            workoutId: current.workoutId,
            workoutTitle: wo.title,
            completedAt: new Date(now).toISOString(),
            durationSeconds: Math.floor((now - current.startedAt) / 1000),
            exercisesCompleted: wo.exercises.length,
            totalExercises: wo.exercises.length,
            setsCompleted: current.completedSets + 1,
            totalSets: current.totalSets,
          };
          saveSession(record);
          setSessionHistory((h) => [record, ...h]);
        }
      }
    }

    setActiveState((prev) => {
      if (!prev) return prev;
      const workout = getWorkoutById(prev.workoutId, loadCustomWorkouts());
      if (!workout) return prev;

      const exercise = workout.exercises[prev.exerciseIndex];
      const newCompletedSets = prev.completedSets + 1;
      const isLastExercise = prev.exerciseIndex >= workout.exercises.length - 1;
      const isLastSet = prev.currentSet >= exercise.sets;

      if (isLastExercise && isLastSet) {
        return { ...prev, completedSets: newCompletedSets, phase: "exercise", finishedAt: Date.now() };
      }

      if (exercise.restSeconds === 0) {
        // Skip rest phase entirely when no rest configured
        if (isLastSet) {
          return {
            ...prev,
            completedSets: newCompletedSets,
            exerciseIndex: prev.exerciseIndex + 1,
            currentSet: 1,
            phase: "exercise",
            restRemaining: 0,
          };
        }
        return {
          ...prev,
          completedSets: newCompletedSets,
          currentSet: prev.currentSet + 1,
          phase: "exercise",
          restRemaining: 0,
        };
      }

      return {
        ...prev,
        completedSets: newCompletedSets,
        phase: "rest",
        restRemaining: exercise.restSeconds,
      };
    });
  }, [activeState]);

  const skipRest = useCallback(() => {
    setActiveState((prev) => {
      if (!prev) return prev;
      const workout = getWorkoutById(prev.workoutId, loadCustomWorkouts());
      if (!workout) return prev;

      const exercise = workout.exercises[prev.exerciseIndex];
      const isLastSet = prev.currentSet >= exercise.sets;

      if (isLastSet) {
        const nextIndex = prev.exerciseIndex + 1;
        if (nextIndex >= workout.exercises.length) {
          return { ...prev, phase: "exercise", restRemaining: 0 };
        }
        return {
          ...prev,
          exerciseIndex: nextIndex,
          currentSet: 1,
          phase: "exercise",
          restRemaining: 0,
        };
      }

      return {
        ...prev,
        currentSet: prev.currentSet + 1,
        phase: "exercise",
        restRemaining: 0,
      };
    });
  }, []);

  const finishWorkout = useCallback(() => {
    setActiveState(null);
  }, []);

  const setRestRemaining = useCallback(
    (value: number | ((prev: number) => number)) => {
      setActiveState((prev) => {
        if (!prev) return prev;
        const newVal = typeof value === "function" ? value(prev.restRemaining) : value;
        return { ...prev, restRemaining: newVal };
      });
    },
    []
  );

  const addWorkout = useCallback((workout: Workout) => {
    setCustomWorkouts((prev) => {
      const next = [...prev, workout];
      saveCustomWorkouts(next);
      return next;
    });
  }, []);

  const updateWorkout = useCallback((workout: Workout) => {
    setCustomWorkouts((prev) => {
      const next = prev.map((w) => (w.id === workout.id ? workout : w));
      saveCustomWorkouts(next);
      return next;
    });
  }, []);

  const removeWorkout = useCallback((id: string) => {
    setCustomWorkouts((prev) => {
      const next = prev.filter((w) => w.id !== id);
      saveCustomWorkouts(next);
      return next;
    });
  }, []);

  const recordSession = useCallback((record: SessionRecord) => {
    saveSession(record);
    setSessionHistory((prev) => [record, ...prev]);
  }, []);

  const removeSession = useCallback((id: string) => {
    removeSessionById(id);
    setSessionHistory((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    clearSessionHistory();
    setSessionHistory([]);
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        activeState,
        selectedWorkout,
        allWorkouts,
        customWorkouts,
        sessionHistory,
        startWorkout,
        completeSet,
        skipRest,
        finishWorkout,
        setRestRemaining,
        addWorkout,
        updateWorkout,
        removeWorkout,
        recordSession,
        removeSession,
        clearHistory,
        language,
        setLanguage,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutContext() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkoutContext must be used within WorkoutProvider");
  return ctx;
}
