import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';

export const editorScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot) {
    const lang = snapshot.language;
    return {
      lines: [
        ...glassHeader(t('glass.editWorkout', lang), buildStaticActionBar([t('glass.back', lang)], 0)),
        line(t('glass.usePhone', lang), 'meta'),
      ],
    };
  },

  action(action, nav, _snapshot, ctx) {
    if (action.type === 'GO_BACK') {
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
