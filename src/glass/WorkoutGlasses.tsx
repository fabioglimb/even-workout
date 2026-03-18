import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useGlasses } from 'even-toolkit/useGlasses';
import { useFlashPhase } from 'even-toolkit/useFlashPhase';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { workoutSplash } from './splash';
import { toDisplayData, type WorkoutSnapshot } from './selectors';
import { createActionHandler } from './actions';

function deriveScreen(path: string): string {
  if (path === '/') return 'workout-list';
  if (/^\/editor(\/|$)/.test(path)) return 'editor';
  if (path === '/history') return 'history';
  if (/^\/workout\/[^/]+\/active$/.test(path)) return 'active';
  if (/^\/workout\/[^/]+\/complete$/.test(path)) return 'complete';
  if (/^\/workout\/[^/]+$/.test(path)) return 'workout-detail';
  return 'workout-list';
}

function extractWorkoutId(path: string): string | null {
  const match = path.match(/^\/workout\/([^/]+)/);
  return match ? match[1] : null;
}

const allTiles = workoutSplash.getTiles();
const homeTiles = allTiles.length > 0 ? [allTiles[0]!] : [];

export function WorkoutGlasses() {
  const {
    activeState,
    selectedWorkout,
    allWorkouts,
    sessionHistory,
    startWorkout,
    completeSet,
    skipRest,
    finishWorkout,
    language,
  } = useWorkoutContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = deriveScreen(location.pathname) === 'active';
  const flashPhase = useFlashPhase(isActive);

  // Derive selected workout from URL (like kitchen), not from activeState
  const currentWorkoutId = extractWorkoutId(location.pathname);
  const urlWorkout = currentWorkoutId
    ? allWorkouts.find((w) => w.id === currentWorkoutId) ?? null
    : null;

  const snapshotRef = useMemo(() => ({
    current: null as WorkoutSnapshot | null,
  }), []);

  const snapshot: WorkoutSnapshot = {
    activeState,
    selectedWorkout: urlWorkout ?? selectedWorkout,
    allWorkouts,
    sessionHistory,
    flashPhase,
    language,
  };
  snapshotRef.current = snapshot;

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef]);

  const onGlassAction = useMemo(
    () => createActionHandler(navigate, { startWorkout, completeSet, skipRest, finishWorkout }),
    [navigate, startWorkout, completeSet, skipRest, finishWorkout],
  );

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction,
    deriveScreen,
    appName: 'EVENWORKOUT',
    splash: workoutSplash,
    getPageMode: (screen) => screen === 'workout-list' ? 'home' : 'text',
    homeImageTiles: homeTiles,
  });

  return null;
}
