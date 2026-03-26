import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';
import { formatDuration } from '../shared';

export const completeScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    if (!snapshot.activeState) return { lines: [] };
    const state = snapshot.activeState;
    const lang = snapshot.language;
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
  },

  action(action, nav, _snapshot, ctx) {
    if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
      ctx.finishWorkout();
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
