import { useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useGlasses } from 'even-toolkit/useGlasses';
import { useFlashPhase } from 'even-toolkit/useFlashPhase';
import { createScreenMapper, createIdExtractor, getHomeTiles } from 'even-toolkit/glass-router';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { workoutSplash } from './splash';
import { toDisplayData, onGlassAction, type WorkoutSnapshot } from './selectors';
import type { WorkoutActions } from './shared';

const deriveScreen = createScreenMapper([
  { pattern: '/', screen: 'workout-list' },
  { pattern: /^\/editor(\/|$)/, screen: 'editor' },
  { pattern: '/history', screen: 'history' },
  { pattern: /^\/workout\/[^/]+\/active$/, screen: 'active' },
  { pattern: /^\/workout\/[^/]+\/complete$/, screen: 'complete' },
  { pattern: /^\/workout\/[^/]+$/, screen: 'workout-detail' },
], 'workout-list');

const extractWorkoutId = createIdExtractor(/^\/workout\/([^/]+)/);

const homeTiles = getHomeTiles(workoutSplash);

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

  // Build context with side effects for screen action handlers
  const ctxRef = useRef<WorkoutActions>({
    navigate,
    startWorkout,
    completeSet,
    skipRest,
    finishWorkout,
  });
  ctxRef.current = { navigate, startWorkout, completeSet, skipRest, finishWorkout };

  // Wrap the router's onGlassAction to inject context
  const handleGlassAction = useCallback(
    (action: Parameters<typeof onGlassAction>[0], nav: Parameters<typeof onGlassAction>[1], snap: WorkoutSnapshot) =>
      onGlassAction(action, nav, snap, ctxRef.current),
    [],
  );

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction: handleGlassAction,
    deriveScreen,
    appName: 'ER WORKOUT',
    splash: workoutSplash,
    getPageMode: (screen) => screen === 'workout-list' ? 'home' : 'text',
    homeImageTiles: homeTiles,
  });

  return null;
}
