import type { ActiveWorkoutState, Workout, SessionRecord } from '../types/workout';
import type { AppLanguage } from '../utils/i18n';

export interface WorkoutSnapshot {
  activeState: ActiveWorkoutState | null;
  selectedWorkout: Workout | null;
  allWorkouts: Workout[];
  sessionHistory: SessionRecord[];
  flashPhase: boolean;
  language: AppLanguage;
}

export interface WorkoutActions {
  navigate: (path: string) => void;
  startWorkout: (id: string) => void;
  completeSet: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
