export type { AppLanguage } from '../utils/i18n';
export { APP_LANGUAGES } from '../utils/i18n';

export interface Workout {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  target: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  weightKg?: number | null;
  /** Optional per-set weight overrides. Falls back to `weightKg` when entry is missing. */
  setWeightsKg?: (number | null)[];
  restSeconds: number;
}

export interface SessionRecord {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;
  durationSeconds: number;
  exercisesCompleted: number;
  totalExercises: number;
  setsCompleted: number;
  totalSets: number;
}

export interface WorkoutScheduleEntry {
  id: string;
  workoutId: string;
  scheduledFor: string;
  scheduledTime?: string;
}

export type WorkoutPhase = "exercise" | "rest";

export interface ActiveWorkoutState {
  workoutId: string;
  exerciseIndex: number;
  currentSet: number;
  phase: WorkoutPhase;
  restRemaining: number;
  /** Seconds left for the current timed exercise. `null` for rep-based exercises. */
  exerciseRemaining: number | null;
  /** True while the exercise countdown is actively ticking. */
  exerciseRunning: boolean;
  startedAt: number;
  finishedAt: number | null;
  completedSets: number;
  totalSets: number;
}
