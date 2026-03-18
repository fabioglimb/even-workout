import type { GlassAction, GlassNavState } from 'even-toolkit/types';
import type { WorkoutSnapshot } from './selectors';
import { t } from '../utils/i18n';
import {
  workoutDetailLineCount,
  historyLineCount,
  getActiveButtons,
  activeButtonIndex,
} from './selectors';

type Navigate = (path: string) => void;

interface WorkoutActions {
  startWorkout: (id: string) => void;
  completeSet: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
}

export function createActionHandler(navigate: Navigate, actions: WorkoutActions) {
  return function onGlassAction(
    action: GlassAction,
    nav: GlassNavState,
    snapshot: WorkoutSnapshot,
  ): GlassNavState {
    const lang = snapshot.language;

    switch (nav.screen) {
      // ── Workout List (home) ──
      case 'workout-list': {
        const allWorkouts = snapshot.allWorkouts;
        const maxIndex = allWorkouts.length - 1;
        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(maxIndex, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          const workout = allWorkouts[nav.highlightedIndex];
          if (workout) navigate(`/workout/${workout.id}`);
          return nav;
        }
        return nav;
      }

      // ── Workout Detail ──
      case 'workout-detail': {
        if (!snapshot.selectedWorkout) return nav;
        const maxScroll = workoutDetailLineCount(snapshot.selectedWorkout);

        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(maxScroll, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          actions.startWorkout(snapshot.selectedWorkout.id);
          navigate(`/workout/${snapshot.selectedWorkout.id}/active`);
          return nav;
        }
        if (action.type === 'GO_BACK') {
          navigate('/');
          return nav;
        }
        return nav;
      }

      // ── Active Workout ──
      case 'active': {
        if (!snapshot.activeState || !snapshot.selectedWorkout) return nav;

        // All sets done — show complete display, any action finishes
        if (snapshot.activeState.completedSets >= snapshot.activeState.totalSets) {
          if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
            actions.finishWorkout();
            navigate('/');
            return nav;
          }
          return nav;
        }

        const buttons = getActiveButtons(snapshot.activeState, snapshot.selectedWorkout, lang);

        if (action.type === 'HIGHLIGHT_MOVE') {
          const btnIdx = activeButtonIndex(nav, buttons.length);
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(buttons.length - 1, btnIdx + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          const btnIdx = activeButtonIndex(nav, buttons.length);
          const selected = buttons[btnIdx];
          if (selected === t('glass.done', lang)) {
            actions.completeSet();
            return nav;
          }
          if (selected === t('glass.skip', lang)) {
            actions.completeSet();
            return nav;
          }
          if (selected === t('glass.skipRest', lang)) {
            actions.skipRest();
            return nav;
          }
          return nav;
        }
        if (action.type === 'GO_BACK') {
          actions.finishWorkout();
          navigate(`/workout/${snapshot.selectedWorkout.id}`);
          return nav;
        }
        return nav;
      }

      // ── Complete ──
      case 'complete': {
        if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
          actions.finishWorkout();
          navigate('/');
          return nav;
        }
        return nav;
      }

      // ── History ──
      case 'history': {
        const maxScroll = historyLineCount(snapshot);
        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(maxScroll, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'GO_BACK') {
          navigate('/');
          return nav;
        }
        return nav;
      }

      // ── Editor ──
      case 'editor': {
        if (action.type === 'GO_BACK') {
          navigate('/');
          return nav;
        }
        return nav;
      }

      default:
        return nav;
    }
  };
}
