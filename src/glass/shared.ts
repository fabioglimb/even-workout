import type { ActiveWorkoutState, Workout, SessionRecord } from '../types/workout';
import type { AppLanguage } from '../utils/i18n';
import { truncate } from 'even-toolkit/text-utils';
import { glassHeader, renderTextPageLines } from 'even-toolkit/types';

export interface WorkoutSnapshot {
  activeState: ActiveWorkoutState | null;
  selectedWorkout: Workout | null;
  allWorkouts: Workout[];
  sessionHistory: SessionRecord[];
  flashPhase: boolean;
  language: AppLanguage;
  favoriteIds: string[];
}

export interface WorkoutActions {
  navigate: (path: string) => void;
  startWorkout: (id: string) => void;
  completeSet: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const SPLIT_HEADER_WIDTH = 28;
export const SPLIT_LEFT_WIDTH = 21;
export const SPLIT_RIGHT_WIDTH = 15;
export const SPLIT_PANE_LINES = 8;
const SPLIT_LINE_PREFIX = '  ';

export function buildSplitHeader(title: string, actionBar?: string, truncateTitle = true): string {
  const headerWidth = Math.max(1, SPLIT_HEADER_WIDTH - SPLIT_LINE_PREFIX.length);
  const maxTitle = actionBar
    ? Math.max(10, Math.floor(headerWidth / 2), headerWidth - actionBar.length - 2)
    : headerWidth;
  const resolvedTitle = truncateTitle ? truncate(title, maxTitle) : title;
  const resolvedStandaloneTitle = truncateTitle ? truncate(title, headerWidth) : title;
  return renderTextPageLines(glassHeader(actionBar ? resolvedTitle : resolvedStandaloneTitle, actionBar));
}

export function wordWrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }
    if (`${current} ${word}`.length <= maxChars) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildPaneText(lines: string[], width: number, scrollPos = 0, slots = SPLIT_PANE_LINES): string {
  const contentWidth = Math.max(1, width - SPLIT_LINE_PREFIX.length);
  const normalized = lines.flatMap((entry) => {
    if (!entry) return [''];
    return wordWrap(entry, contentWidth);
  });

  const start = Math.max(0, Math.min(scrollPos, Math.max(0, normalized.length - slots)));
  const visible = normalized.slice(start, start + slots);

  while (visible.length < slots) visible.push('');

  if (start > 0 && visible.length > 0) visible[0] = '▲';
  if (start + slots < normalized.length && visible.length > 0) visible[visible.length - 1] = '▼';

  return visible
    .map((entry) => (entry ? `${SPLIT_LINE_PREFIX}${truncate(entry, contentWidth)}` : ''))
    .join('\n');
}
