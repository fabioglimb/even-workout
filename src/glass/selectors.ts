import { createGlassScreenRouter } from 'even-toolkit/glass-screen-router';
import type { WorkoutSnapshot, WorkoutActions } from './shared';
import { workoutListScreen } from './screens/workout-list';
import { workoutDetailScreen } from './screens/workout-detail';
import { activeScreen } from './screens/active';
import { completeScreen } from './screens/complete';
import { editorScreen } from './screens/editor';
import { historyScreen } from './screens/history';

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
