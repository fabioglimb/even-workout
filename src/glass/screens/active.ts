import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import type { SplitData } from 'even-toolkit/types';
import { renderTimerLines } from 'even-toolkit/timer-display';
import { buildActionBar } from 'even-toolkit/action-bar';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav';
import type { ActiveWorkoutState, Workout } from '../../types/workout';
import type { AppLanguage } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';
import { buildPaneText, buildSplitHeader, formatDuration } from '../shared';

const ACTIVE_LEFT_WIDTH = 13;
const ACTIVE_RIGHT_WIDTH = 24;
const ACTIVE_LAYOUT = { leftWidth: 208 };
const REST_LEFT_WIDTH = ACTIVE_LEFT_WIDTH;
const REST_RIGHT_WIDTH = ACTIVE_RIGHT_WIDTH;
const REST_LAYOUT = ACTIVE_LAYOUT;

function getActiveButtons(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  if (state.phase === 'rest') return [t('glass.skipRest', lang)];
  return [t('glass.done', lang), t('glass.skip', lang)];
}

function completeDisplay(state: ActiveWorkoutState, lang: AppLanguage) {
  const elapsed = formatDuration((state.finishedAt ?? Date.now()) - state.startedAt);
  return {
    lines: [
      ...glassHeader(t('glass.complete', lang), buildStaticActionBar([t('glass.finishWorkout', lang)], 0)),
      line(t('glass.allSetsComplete', lang), 'meta'),
      line('', 'normal'),
      line(t('glass.greatWork', lang), 'normal'),
      line('', 'normal'),
      line(`${t('glass.duration', lang)}: ${elapsed}`, 'meta'),
      line(`${t('glass.sets', lang)}: ${state.completedSets}/${state.totalSets}`, 'meta'),
    ],
  };
}

function formatExercisePrescription(exercise: Workout['exercises'][0], lang: AppLanguage): string {
  if (exercise.reps !== null) return `${exercise.reps} ${t('glass.reps', lang)}`;
  return `${exercise.durationSeconds}s`;
}

function withSpacerRows(lines: string[]): string[] {
  return lines.flatMap((line, index) => index < lines.length - 1 ? [line, ''] : [line]);
}

function buildExerciseLeftLines(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  const exercise = workout.exercises[state.exerciseIndex];
  if (!exercise) return [];

  return withSpacerRows([
    `• ${t('glass.set', lang)} ${state.currentSet}/${exercise.sets}`,
    `• ${formatExercisePrescription(exercise, lang)}`,
    exercise.weightKg ? `• ${exercise.weightKg}kg` : '',
    `• REST ${exercise.restSeconds}s`,
  ].filter(Boolean));
}

function buildExerciseRightLines(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  const exercise = workout.exercises[state.exerciseIndex];
  const nextExercise = workout.exercises[state.exerciseIndex + 1] ?? null;
  if (!exercise) return [];

  return withSpacerRows([
    `◆ ${t('glass.progress', lang)} ${state.completedSets}/${state.totalSets}`,
    `◆ EX ${state.exerciseIndex + 1}/${workout.exercises.length}`,
    nextExercise ? `▶ NEXT ${nextExercise.name}` : `▶ LAST ${exercise.name}`,
  ]);
}

function buildRestLeftLines(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  const exercise = workout.exercises[state.exerciseIndex];
  if (!exercise) return [];
  const isLastSet = state.currentSet >= exercise.sets;
  const nextSet = isLastSet ? 1 : state.currentSet + 1;
  const nextExercise = isLastSet ? workout.exercises[state.exerciseIndex + 1] ?? null : exercise;
  const nextTotal = nextExercise?.sets ?? exercise.sets;

  return withSpacerRows([
    `• ${t('glass.progress', lang)} ${state.completedSets}/${state.totalSets}`,
    `• ${t('glass.set', lang)} ${nextSet}/${nextTotal}`,
    `• ${exercise.restSeconds}s`,
  ]);
}

function buildRestRightLines(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  const exercise = workout.exercises[state.exerciseIndex];
  const isLastSet = (exercise?.sets ?? 0) > 0 && state.currentSet >= (exercise?.sets ?? 0);
  const nextExercise = isLastSet ? workout.exercises[state.exerciseIndex + 1] ?? null : exercise;
  const restTotal = exercise?.restSeconds ?? 30;
  return [
    `◆ ${t('glass.rest', lang)}`,
    '',
    ...renderTimerLines({
      running: true,
      remaining: state.restRemaining,
      total: restTotal,
    }, 14, REST_RIGHT_WIDTH),
    '',
    nextExercise ? `▶ NEXT ${nextExercise.name}` : '',
  ];
}

export function buildActiveSplit(snapshot: WorkoutSnapshot, nav: { highlightedIndex: number }): SplitData {
  if (!snapshot.activeState || !snapshot.selectedWorkout) {
    return { header: buildSplitHeader('Workout'), left: '', right: '' };
  }

  const state = snapshot.activeState;
  const workout = snapshot.selectedWorkout;
  const lang = snapshot.language;

  if (state.completedSets >= state.totalSets) {
    return {
      header: buildSplitHeader(t('glass.complete', lang), buildStaticActionBar([t('glass.finishWorkout', lang)], 0)),
      left: buildPaneText([
        t('glass.allSetsComplete', lang),
        '',
        t('glass.greatWork', lang),
      ], ACTIVE_LEFT_WIDTH, 0),
      right: buildPaneText([
        `◆ ${t('glass.duration', lang).toUpperCase()}`,
        formatDuration((state.finishedAt ?? Date.now()) - state.startedAt),
        '',
        `◆ ${state.completedSets}/${state.totalSets}`,
        t('glass.sets', lang),
      ], ACTIVE_RIGHT_WIDTH, 0),
      layout: ACTIVE_LAYOUT,
    };
  }

  const exercise = workout.exercises[state.exerciseIndex];
  const buttons = getActiveButtons(state, workout, lang);
  const selectedButtonIndex = clampIndex(nav.highlightedIndex, buttons.length);
  const actionBar = buildActionBar(buttons, selectedButtonIndex, null, snapshot.flashPhase);
  const header = buildSplitHeader(exercise?.name ?? '', actionBar, false);

  if (state.phase === 'rest') {
    return {
      header,
      left: buildPaneText(buildRestLeftLines(state, workout, lang), REST_LEFT_WIDTH, 0),
      right: buildPaneText(buildRestRightLines(state, workout, lang), REST_RIGHT_WIDTH, 0),
      layout: REST_LAYOUT,
    };
  }

  return {
    header,
    left: buildPaneText(buildExerciseLeftLines(state, workout, lang), ACTIVE_LEFT_WIDTH, 0),
    right: buildPaneText(buildExerciseRightLines(state, workout, lang), ACTIVE_RIGHT_WIDTH, 0),
    layout: ACTIVE_LAYOUT,
  };
}

export const activeScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    if (!snapshot.activeState || !snapshot.selectedWorkout) return { lines: [] };
    const state = snapshot.activeState;
    const workout = snapshot.selectedWorkout;
    const lang = snapshot.language;

    if (state.completedSets >= state.totalSets) {
      return completeDisplay(state, lang);
    }

    const exercise = workout.exercises[state.exerciseIndex];
    const buttons = getActiveButtons(state, workout, lang);
    const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
    const actionBar = buildActionBar(buttons, btnIdx, null, snapshot.flashPhase);
    const lines = [...glassHeader(exercise?.name ?? '', actionBar)];

    if (state.phase === 'rest') {
      const restTotal = exercise?.restSeconds ?? 30;
      const timerLines = renderTimerLines({
        running: true,
        remaining: state.restRemaining,
        total: restTotal,
      });
      lines.push(line(t('glass.rest', lang), 'normal'));
      lines.push(line('', 'normal'));
      for (const tl of timerLines) {
        lines.push(line(tl, 'normal'));
      }
    } else {
      const rep = exercise?.reps ? `${exercise.reps} ${t('glass.reps', lang)}` : `${exercise?.durationSeconds}s`;
      lines.push(line(`${t('glass.set', lang)} ${state.currentSet}/${exercise?.sets}  ${rep}`, 'normal'));
    }

    lines.push(line('', 'normal'));
    lines.push(line(`${t('glass.progress', lang)}: ${state.completedSets}/${state.totalSets} ${t('glass.sets', lang)}`, 'meta'));
    return { lines };
  },

  action(action, nav, snapshot, ctx) {
    if (!snapshot.activeState || !snapshot.selectedWorkout) return nav;
    const state = snapshot.activeState;
    const workout = snapshot.selectedWorkout;
    const lang = snapshot.language;

    if (state.completedSets >= state.totalSets) {
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        ctx.finishWorkout();
        ctx.navigate('/');
        return nav;
      }
      return nav;
    }

    const buttons = getActiveButtons(state, workout, lang);

    if (action.type === 'HIGHLIGHT_MOVE') {
      const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
      return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
      const selected = buttons[btnIdx];
      if (selected === t('glass.done', lang)) {
        ctx.completeSet();
        return nav;
      }
      if (selected === t('glass.skip', lang)) {
        ctx.completeSet();
        return nav;
      }
      if (selected === t('glass.skipRest', lang)) {
        ctx.skipRest();
        return nav;
      }
      return nav;
    }
    if (action.type === 'GO_BACK') {
      ctx.finishWorkout();
      ctx.navigate(`/workout/${workout.id}`);
      return nav;
    }
    return nav;
  },
};
