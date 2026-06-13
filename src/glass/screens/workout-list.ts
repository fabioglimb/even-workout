import { line } from 'even-toolkit/types';
import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { truncate } from 'even-toolkit/text-utils';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';

/**
 * Order workouts with favorites first. Array.sort is stable, so the relative
 * order within each group is preserved. Both display() and action() MUST use
 * this same ordering so the highlighted index maps to the same workout the
 * user sees — otherwise selecting a starred item opens the wrong workout.
 */
function sortByFavorite(snapshot: WorkoutSnapshot) {
  const favSet = new Set(snapshot.favoriteIds);
  const sorted = [...snapshot.allWorkouts].sort(
    (a, b) => (favSet.has(a.id) ? 0 : 1) - (favSet.has(b.id) ? 0 : 1),
  );
  return { favSet, sorted };
}

export const workoutListScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    const header = line('◆  E R   W O R K O U T  ◆', 'normal');
    const sep = line('', 'separator');
    const { favSet, sorted } = sortByFavorite(snapshot);
    const menuLines = buildScrollableList({
      items: sorted,
      highlightedIndex: nav.highlightedIndex,
      maxVisible: 7,
      formatter: (w) => {
        const diff = w.difficulty.slice(0, 3).toUpperCase();
        const star = favSet.has(w.id) ? '★ ' : '';
        return truncate(`${star}${w.title}  [${diff}]`, 54);
      },
    });
    return { lines: [header, sep, ...menuLines] };
  },

  action(action, nav, snapshot, ctx) {
    const { sorted } = sortByFavorite(snapshot);
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, sorted.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const workout = sorted[nav.highlightedIndex];
      if (workout) ctx.navigate(`/workout/${workout.id}`);
      return nav;
    }
    return nav;
  },
};
