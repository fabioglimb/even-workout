import { line } from 'even-toolkit/types';
import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { truncate } from 'even-toolkit/text-utils';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';

export const workoutListScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    const header = line('◆  E R   W O R K O U T  ◆', 'normal');
    const sep = line('', 'separator');
    const menuLines = buildScrollableList({
      items: snapshot.allWorkouts,
      highlightedIndex: nav.highlightedIndex,
      maxVisible: 7,
      formatter: (w) => {
        const diff = w.difficulty.slice(0, 3).toUpperCase();
        return truncate(`${w.title}  [${diff}]`, 54);
      },
    });
    return { lines: [header, sep, ...menuLines] };
  },

  action(action, nav, snapshot, ctx) {
    const allWorkouts = snapshot.allWorkouts;
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, allWorkouts.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const workout = allWorkouts[nav.highlightedIndex];
      if (workout) ctx.navigate(`/workout/${workout.id}`);
      return nav;
    }
    return nav;
  },
};
