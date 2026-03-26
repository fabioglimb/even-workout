import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import { renderTimerLines } from 'even-toolkit/timer-display';
import { buildActionBar } from 'even-toolkit/action-bar';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav';
import type { ActiveWorkoutState, Workout } from '../../types/workout';
import type { AppLanguage } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';
import { formatDuration } from '../shared';

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
    const lines = [...glassHeader(truncate(exercise?.name ?? '', 30), actionBar)];

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
