import { createGlassScreenRouter } from 'even-toolkit/glass-screen-router';
import type { WorkoutSnapshot, WorkoutActions } from './shared';
import { workoutListScreen } from './screens/workout-list';
import { workoutDetailScreen, buildWorkoutDetailSplit } from './screens/workout-detail';
import { activeScreen, buildActiveSplit } from './screens/active';
import { completeScreen } from './screens/complete';
import { editorScreen } from './screens/editor';
import { historyScreen } from './screens/history';
import type { GlassNavState, SplitData } from 'even-toolkit/types';

export type { WorkoutSnapshot, WorkoutActions };
export { workoutDetailLineCount } from './screens/workout-detail';
export { historyLineCount } from './screens/history';

export const { toDisplayData, onGlassAction } = createGlassScreenRouter<WorkoutSnapshot, WorkoutActions>({
  'workout-list': workoutListScreen,
  'workout-detail': workoutDetailScreen,
  'active': activeScreen,
  'complete': completeScreen,
  'editor': editorScreen,
  'history': historyScreen,
}, 'workout-list');

export function toSplitData(snapshot: WorkoutSnapshot, nav: GlassNavState): SplitData {
  switch (nav.screen) {
    case 'workout-detail':
      return buildWorkoutDetailSplit(snapshot, nav);
    case 'active':
      return buildActiveSplit(snapshot, nav);
    default:
      return { header: '', panes: ['', ''] };
  }
}
