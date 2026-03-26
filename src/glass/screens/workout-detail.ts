import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableContent, DEFAULT_CONTENT_SLOTS } from 'even-toolkit/glass-display-builders';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import type { Workout } from '../../types/workout';
import type { AppLanguage } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';

function workoutDetailLines(workout: Workout, lang: AppLanguage): string[] {
  const items: string[] = [];
  items.push(workout.title);
  const diff = workout.difficulty.slice(0, 3).toUpperCase();
  items.push(`${diff}  ${workout.estimatedMinutes}min  ${workout.target}`);
  items.push('');
  items.push(t('glass.exercises', lang));
  workout.exercises.forEach((ex, i) => {
    const rep = ex.reps ? `${ex.reps} ${t('glass.reps', lang)}` : `${ex.durationSeconds}s`;
    items.push(truncate(`${i + 1}. ${ex.name}  ${ex.sets}x${rep}`, 54));
  });
  return items;
}

/** Max scroll position for workout detail content */
export function workoutDetailLineCount(workout: Workout): number {
  const contentLength = workoutDetailLines(workout, 'en').length - 1;
  return Math.max(0, contentLength - DEFAULT_CONTENT_SLOTS);
}

export const workoutDetailScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    if (!snapshot.selectedWorkout) return { lines: [] };
    const workout = snapshot.selectedWorkout;
    const lang = snapshot.language;
    const all = workoutDetailLines(workout, lang);
    return buildScrollableContent({
      title: workout.title,
      actionBar: buildStaticActionBar([t('glass.start', lang)], 0),
      contentLines: all.slice(1),
      scrollPos: nav.highlightedIndex,
    });
  },

  action(action, nav, snapshot, ctx) {
    if (!snapshot.selectedWorkout) return nav;
    const maxScroll = workoutDetailLineCount(snapshot.selectedWorkout);

    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, maxScroll) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      ctx.startWorkout(snapshot.selectedWorkout.id);
      ctx.navigate(`/workout/${snapshot.selectedWorkout.id}/active`);
      return nav;
    }
    if (action.type === 'GO_BACK') {
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
