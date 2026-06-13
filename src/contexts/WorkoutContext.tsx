import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Workout, ActiveWorkoutState, Exercise, SessionRecord, WorkoutScheduleEntry } from "../types/workout";
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
  loadWorkoutSchedule,
  saveWorkoutSchedule,
} from "../data/persistence";
import { storageGet, storageSet } from 'even-toolkit/storage';

interface WorkoutContextValue {
  activeState: ActiveWorkoutState | null;
  selectedWorkout: Workout | null;
  allWorkouts: Workout[];
  customWorkouts: Workout[];
  sessionHistory: SessionRecord[];
  scheduleEntries: WorkoutScheduleEntry[];
  loaded: boolean;
  startWorkout: (workoutId: string) => void;
  completeSet: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
  setRestRemaining: (value: number | ((prev: number) => number)) => void;
  startExerciseTimer: () => void;
  pauseExerciseTimer: () => void;
  setExerciseRemaining: (value: number | ((prev: number) => number)) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  moveWorkout: (from: number, to: number) => void;
  recordSession: (record: SessionRecord) => void;
  removeSession: (id: string) => void;
  clearHistory: () => void;
  scheduleWorkout: (workoutId: string, scheduledFor: string, scheduledTime?: string) => void;
  removeScheduledWorkout: (id: string) => void;
  moveScheduledWorkout: (id: string, scheduledFor: string, scheduledTime?: string) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeState, setActiveState] = useState<ActiveWorkoutState | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>(presetWorkouts);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [scheduleEntries, setScheduleEntries] = useState<WorkoutScheduleEntry[]>([]);
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Keep a ref to the latest customWorkouts so sync callbacks (state updaters) can read it
  const workoutsRef = useRef(customWorkouts);
  workoutsRef.current = customWorkouts;

  useEffect(() => {
    async function init() {
      const [saved, history, lang, schedule, favs] = await Promise.all([
        loadCustomWorkouts(),
        loadSessionHistory(),
        loadLanguage(),
        loadWorkoutSchedule(),
        storageGet<string[]>('workout-favorites', []),
      ]);

      // Only adopt stored workouts when the read actually returned data.
      // On an empty read — genuine first launch OR a transient/cold storage
      // read (e.g. returning from the Even Realities settings) — we keep the
      // in-memory presets and DO NOT write to storage. Persisting here would
      // overwrite real custom workouts with presets on a transient empty read,
      // which is what caused users to lose their saved workouts. Storage is
      // now only ever written by an explicit user mutation.
      if (saved.length > 0) {
        setCustomWorkouts(saved);
      }

      setSessionHistory(history);
      setScheduleEntries(schedule);
      setLanguageState(lang);
      if (favs) setFavoriteIds(favs);
      setLoaded(true);
    }
    init();
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      storageSet('workout-favorites', next);
      return next;
    });
  }, []);

  const allWorkouts = customWorkouts;

  const selectedWorkout = activeState
    ? getWorkoutById(activeState.workoutId, allWorkouts) ?? null
    : null;

  const startWorkout = useCallback((workoutId: string) => {
    const workout = getWorkoutById(workoutId, workoutsRef.current);
    if (!workout) return;
    const firstExercise: Exercise | undefined = workout.exercises[0];
    setActiveState({
      workoutId,
      exerciseIndex: 0,
      currentSet: 1,
      phase: "exercise",
      restRemaining: 0,
      exerciseRemaining: firstExercise?.durationSeconds ?? null,
      exerciseRunning: false,
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
      const cw = workoutsRef.current;
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
      const workout = getWorkoutById(prev.workoutId, workoutsRef.current);
      if (!workout) return prev;

      const exercise = workout.exercises[prev.exerciseIndex];
      const newCompletedSets = prev.completedSets + 1;
      const isLastExercise = prev.exerciseIndex >= workout.exercises.length - 1;
      const isLastSet = prev.currentSet >= exercise.sets;

      if (isLastExercise && isLastSet) {
        return {
          ...prev,
          completedSets: newCompletedSets,
          phase: "exercise",
          finishedAt: Date.now(),
          exerciseRunning: false,
        };
      }

      if (exercise.restSeconds === 0) {
        // Skip rest phase entirely when no rest configured
        if (isLastSet) {
          const nextEx = workout.exercises[prev.exerciseIndex + 1];
          return {
            ...prev,
            completedSets: newCompletedSets,
            exerciseIndex: prev.exerciseIndex + 1,
            currentSet: 1,
            phase: "exercise",
            restRemaining: 0,
            exerciseRemaining: nextEx?.durationSeconds ?? null,
            exerciseRunning: false,
          };
        }
        return {
          ...prev,
          completedSets: newCompletedSets,
          currentSet: prev.currentSet + 1,
          phase: "exercise",
          restRemaining: 0,
          exerciseRemaining: exercise.durationSeconds ?? null,
          exerciseRunning: false,
        };
      }

      return {
        ...prev,
        completedSets: newCompletedSets,
        phase: "rest",
        restRemaining: exercise.restSeconds,
        exerciseRunning: false,
      };
    });
  }, [activeState]);

  const skipRest = useCallback(() => {
    setActiveState((prev) => {
      if (!prev) return prev;
      const workout = getWorkoutById(prev.workoutId, workoutsRef.current);
      if (!workout) return prev;

      const exercise = workout.exercises[prev.exerciseIndex];
      const isLastSet = prev.currentSet >= exercise.sets;

      if (isLastSet) {
        const nextIndex = prev.exerciseIndex + 1;
        if (nextIndex >= workout.exercises.length) {
          return { ...prev, phase: "exercise", restRemaining: 0, exerciseRunning: false };
        }
        const nextEx = workout.exercises[nextIndex];
        return {
          ...prev,
          exerciseIndex: nextIndex,
          currentSet: 1,
          phase: "exercise",
          restRemaining: 0,
          exerciseRemaining: nextEx?.durationSeconds ?? null,
          exerciseRunning: false,
        };
      }

      return {
        ...prev,
        currentSet: prev.currentSet + 1,
        phase: "exercise",
        restRemaining: 0,
        exerciseRemaining: exercise.durationSeconds ?? null,
        exerciseRunning: false,
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

  const startExerciseTimer = useCallback(() => {
    setActiveState((prev) => {
      if (!prev || prev.exerciseRemaining === null || prev.exerciseRemaining <= 0) return prev;
      return { ...prev, exerciseRunning: true };
    });
  }, []);

  const pauseExerciseTimer = useCallback(() => {
    setActiveState((prev) => {
      if (!prev) return prev;
      return { ...prev, exerciseRunning: false };
    });
  }, []);

  const setExerciseRemaining = useCallback(
    (value: number | ((prev: number) => number)) => {
      setActiveState((prev) => {
        if (!prev || prev.exerciseRemaining === null) return prev;
        const newVal = typeof value === "function" ? value(prev.exerciseRemaining) : value;
        return { ...prev, exerciseRemaining: newVal };
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

  const moveWorkout = useCallback((from: number, to: number) => {
    setCustomWorkouts((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
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

  const scheduleWorkout = useCallback((workoutId: string, scheduledFor: string, scheduledTime = '07:00') => {
    setScheduleEntries((prev) => {
      if (prev.some((entry) =>
        entry.workoutId === workoutId &&
        entry.scheduledFor === scheduledFor &&
        (entry.scheduledTime ?? '07:00') === scheduledTime,
      )) {
        return prev;
      }
      const next = [...prev, {
        id: `${workoutId}:${scheduledFor}:${scheduledTime}:${Date.now().toString(36)}`,
        workoutId,
        scheduledFor,
        scheduledTime,
      }].sort((a, b) => {
        if (a.scheduledFor !== b.scheduledFor) return a.scheduledFor.localeCompare(b.scheduledFor);
        if ((a.scheduledTime ?? '07:00') !== (b.scheduledTime ?? '07:00')) {
          return (a.scheduledTime ?? '07:00').localeCompare(b.scheduledTime ?? '07:00');
        }
        return a.workoutId.localeCompare(b.workoutId);
      });
      saveWorkoutSchedule(next);
      return next;
    });
  }, []);

  const removeScheduledWorkout = useCallback((id: string) => {
    setScheduleEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      saveWorkoutSchedule(next);
      return next;
    });
  }, []);

  const moveScheduledWorkout = useCallback((id: string, scheduledFor: string, scheduledTime = '07:00') => {
    setScheduleEntries((prev) => {
      const next = prev
        .map((entry) => entry.id === id ? { ...entry, scheduledFor, scheduledTime } : entry)
        .sort((a, b) => {
          if (a.scheduledFor !== b.scheduledFor) return a.scheduledFor.localeCompare(b.scheduledFor);
          if ((a.scheduledTime ?? '07:00') !== (b.scheduledTime ?? '07:00')) {
            return (a.scheduledTime ?? '07:00').localeCompare(b.scheduledTime ?? '07:00');
          }
          return a.workoutId.localeCompare(b.workoutId);
        });
      saveWorkoutSchedule(next);
      return next;
    });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        activeState,
        selectedWorkout,
        allWorkouts,
        customWorkouts,
        sessionHistory,
        scheduleEntries,
        loaded,
        startWorkout,
        completeSet,
        skipRest,
        finishWorkout,
        setRestRemaining,
        startExerciseTimer,
        pauseExerciseTimer,
        setExerciseRemaining,
        addWorkout,
        updateWorkout,
        removeWorkout,
        moveWorkout,
        recordSession,
        removeSession,
        clearHistory,
        scheduleWorkout,
        removeScheduledWorkout,
        moveScheduledWorkout,
        language,
        setLanguage,
        favoriteIds,
        toggleFavorite,
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
