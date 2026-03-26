import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableContent, DEFAULT_CONTENT_SLOTS } from 'even-toolkit/glass-display-builders';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import { t } from '../../utils/i18n';
import type { WorkoutSnapshot, WorkoutActions } from '../shared';

function historyLines(snapshot: WorkoutSnapshot): string[] {
  const lang = snapshot.language;
  const items: string[] = [];
  items.push(t('glass.history', lang).toUpperCase());
  items.push(`${t('glass.total', lang)}: ${snapshot.sessionHistory.length} ${t('glass.sessions', lang)}`);
  if (snapshot.sessionHistory.length === 0) {
    items.push(t('glass.noSessions', lang));
  } else {
    snapshot.sessionHistory.forEach((s) => {
      const date = new Date(s.completedAt);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      items.push(truncate(`${y}-${m}-${d} ${s.workoutTitle}`, 54));
    });
  }
  return items;
}

export function historyLineCount(snapshot: WorkoutSnapshot): number {
  const contentLength = historyLines(snapshot).length - 1;
  return Math.max(0, contentLength - DEFAULT_CONTENT_SLOTS);
}

export const historyScreen: GlassScreen<WorkoutSnapshot, WorkoutActions> = {
  display(snapshot, nav) {
    const lang = snapshot.language;
    const all = historyLines(snapshot);
    return buildScrollableContent({
      title: t('glass.history', lang).toUpperCase(),
      actionBar: buildStaticActionBar([t('glass.back', lang)], 0),
      contentLines: all.slice(1),
      scrollPos: nav.highlightedIndex,
    });
  },

  action(action, nav, snapshot, ctx) {
    const maxScroll = historyLineCount(snapshot);
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, maxScroll) };
    }
    if (action.type === 'GO_BACK') {
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
