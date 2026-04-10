import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableContent } from 'even-toolkit/glass-display-builders';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import type { SplitData } from 'even-toolkit/types';
import type { Workout } from '../../types/workout';
import type { AppLanguage } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';
import { buildPaneText, buildSplitHeader, wordWrap } from '../shared';

const DETAIL_LEFT_WIDTH = 32;
const DETAIL_RIGHT_WIDTH = 26;
const DETAIL_LAYOUT = { leftWidth: 310 };

function workoutDetailLines(workout: Workout, lang: AppLanguage): string[] {
  const items: string[] = [];
  items.push(workout.title);
  const diff = workout.difficulty.slice(0, 3).toUpperCase();
  items.push(`${diff}  ${workout.estimatedMinutes}min  ${workout.target}`);
  items.push('');
  items.push(t('glass.exercises', lang));
  workout.exercises.forEach((ex, i) => {
    const rep = ex.reps ? `${ex.reps} ${t('glass.reps', lang)}` : `${ex.durationSeconds}s`;
    items.push(truncate(`${i + 1}) ${ex.name}  ${ex.sets}x${rep}`, 54));
  });
  return items;
}

function workoutExerciseLines(workout: Workout, lang: AppLanguage): string[] {
  return workout.exercises.map((ex, i) => {
    const rep = ex.reps ? `${ex.reps} ${t('glass.reps', lang)}` : `${ex.durationSeconds}s`;
    const load = ex.weightKg ? ` ${ex.weightKg}kg` : '';
    return `${i + 1}) ${ex.name} ${ex.sets}x${rep}${load}`;
  });
}

function difficultySpades(difficulty: string): string {
  const d = difficulty.toLowerCase();
  const label = d.charAt(0).toUpperCase() + d.slice(1);
  if (d === 'easy' || d === 'beginner') return `${label} ♠`;
  if (d === 'hard' || d === 'advanced') return `${label} ♠♠♠`;
  return `${label} ♠♠`;
}

function workoutSummaryLines(workout: Workout): string[] {
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const targetWords = workout.target.split(/\s+/).filter(Boolean);
  const targetLines: string[] = [];
  let current = '';

  for (const word of targetWords) {
    const limit = targetLines.length === 0 ? DETAIL_RIGHT_WIDTH - 2 : DETAIL_RIGHT_WIDTH;
    if (!current) {
      current = word;
      continue;
    }
    if (`${current} ${word}`.length <= limit) {
      current = `${current} ${word}`;
    } else {
      targetLines.push(targetLines.length === 0 ? `◆ ${current}` : current);
      current = word;
    }
  }
  if (current) targetLines.push(targetLines.length === 0 ? `◆ ${current}` : current);

  return [
    ...targetLines,
    `◆ ${difficultySpades(workout.difficulty)}`,
    `◆ ${workout.estimatedMinutes} min`,
    `◆ ${workout.exercises.length} ex`,
    `◆ ${totalSets} sets`,
  ];
}

export function buildWorkoutDetailSplit(snapshot: WorkoutSnapshot, nav: { highlightedIndex: number }): SplitData {
  const workout = snapshot.selectedWorkout;
  if (!workout) {
    return { header: buildSplitHeader('Workout'), panes: ['', ''] };
  }

  return {
    header: buildSplitHeader(workout.title, buildStaticActionBar([t('glass.start', snapshot.language)], 0)),
    panes: [
      buildPaneText(workoutExerciseLines(workout, snapshot.language), DETAIL_LEFT_WIDTH, nav.highlightedIndex),
      buildPaneText(workoutSummaryLines(workout), DETAIL_RIGHT_WIDTH, 0),
    ],
    layout: DETAIL_LAYOUT,
  };
}

/** Max scroll position for workout detail content */
export function workoutDetailLineCount(workout: Workout): number {
  const contentLength = workoutExerciseLines(workout, 'en').flatMap((line) => wordWrap(line, DETAIL_LEFT_WIDTH)).length;
  return Math.max(0, contentLength - 8);
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
