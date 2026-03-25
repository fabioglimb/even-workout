import type { DisplayData, GlassNavState } from 'even-toolkit/types';
import { line, glassHeader } from 'even-toolkit/types';
import { renderTimerLines } from 'even-toolkit/timer-display';
import { buildActionBar, buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate, applyScrollIndicators } from 'even-toolkit/text-utils';
import type { Workout, ActiveWorkoutState, SessionRecord } from '../types/workout';
import type { AppLanguage } from '../utils/i18n';
import { t } from '../utils/i18n';
const G2_TEXT_LINES = 10;
const DETAIL_CONTENT_SLOTS = G2_TEXT_LINES - 3; // glassHeader = 3 visual lines

export interface WorkoutSnapshot {
  activeState: ActiveWorkoutState | null;
  selectedWorkout: Workout | null;
  allWorkouts: Workout[];
  sessionHistory: SessionRecord[];
  flashPhase: boolean;
  language: AppLanguage;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Workout List (home mode) ──

function workoutListDisplay(nav: GlassNavState, snapshot: WorkoutSnapshot): DisplayData {
  const allWorkouts = snapshot.allWorkouts;
  const maxVisible = 6;
  const hi = nav.highlightedIndex;

  // Centered sliding window
  let start = 0;
  if (allWorkouts.length > maxVisible) {
    start = Math.max(0, Math.min(hi - Math.floor(maxVisible / 2), allWorkouts.length - maxVisible));
  }

  const visible = allWorkouts.slice(start, start + maxVisible).map((w, i) => {
    const idx = start + i;
    const diff = w.difficulty.slice(0, 3).toUpperCase();
    const text = truncate(`${w.title}  [${diff}]`, 54);
    return line(text, 'normal', idx === hi);
  });

  applyScrollIndicators(visible, start, allWorkouts.length, maxVisible, (t) => line(t, 'meta', false));

  return { lines: visible };
}

// ── Workout Detail ──
// Scrollable content with header + [Start] action bar

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
  return Math.max(0, contentLength - DETAIL_CONTENT_SLOTS);
}

function workoutDetailDisplay(workout: Workout, nav: GlassNavState, lang: AppLanguage): DisplayData {
  const all = workoutDetailLines(workout, lang);
  const content = all.slice(1);
  const contentSlots = DETAIL_CONTENT_SLOTS;

  // Fixed header
  const lines = [...glassHeader(workout.title, buildStaticActionBar([t('glass.start', lang)], 0))];

  // Window the content
  const scrollPos = nav.highlightedIndex;
  const start = Math.max(0, Math.min(scrollPos, content.length - contentSlots));
  const visible = content.slice(start, start + contentSlots);

  for (const text of visible) {
    lines.push(line(text, 'meta', false));
  }

  // Scroll indicators on content area
  const contentLines = lines.slice(2);
  applyScrollIndicators(contentLines, start, content.length, contentSlots, (t) => line(t, 'meta', false));
  lines.splice(2, contentLines.length, ...contentLines);

  return { lines };
}

// ── Active Workout ──

export function getActiveButtons(state: ActiveWorkoutState, workout: Workout, lang: AppLanguage): string[] {
  if (state.phase === 'rest') return [t('glass.skipRest', lang)];
  return [t('glass.done', lang), t('glass.skip', lang)];
}

export function activeButtonIndex(nav: GlassNavState, buttonCount: number): number {
  return Math.min(nav.highlightedIndex, buttonCount - 1);
}

function activeDisplay(state: ActiveWorkoutState, workout: Workout, nav: GlassNavState, flash: boolean, lang: AppLanguage): DisplayData {
  const exercise = workout.exercises[state.exerciseIndex];
  const buttons = getActiveButtons(state, workout, lang);
  const btnIdx = activeButtonIndex(nav, buttons.length);
  const actionBar = buildActionBar(buttons, btnIdx, null, flash);
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
}

// ── Complete ──

function completeDisplay(state: ActiveWorkoutState, nav: GlassNavState, lang: AppLanguage): DisplayData {
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

// ── Editor ──

function editorDisplay(lang: AppLanguage): DisplayData {
  return {
    lines: [
      ...glassHeader(t('glass.editWorkout', lang), buildStaticActionBar([t('glass.back', lang)], 0)),
      line(t('glass.usePhone', lang), 'meta'),
    ],
  };
}

// ── History ──

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
  return Math.max(0, contentLength - DETAIL_CONTENT_SLOTS);
}

function historyDisplay(snapshot: WorkoutSnapshot, nav: GlassNavState): DisplayData {
  const lang = snapshot.language;
  const all = historyLines(snapshot);
  const content = all.slice(1);
  const contentSlots = DETAIL_CONTENT_SLOTS;

  const lines = [...glassHeader(t('glass.history', lang).toUpperCase(), buildStaticActionBar([t('glass.back', lang)], 0))];

  const scrollPos = nav.highlightedIndex;
  const start = Math.max(0, Math.min(scrollPos, content.length - contentSlots));
  const visible = content.slice(start, start + contentSlots);

  for (const text of visible) {
    lines.push(line(text, 'meta', false));
  }

  const contentLines = lines.slice(2);
  applyScrollIndicators(contentLines, start, content.length, contentSlots, (t) => line(t, 'meta', false));
  lines.splice(2, contentLines.length, ...contentLines);

  return { lines };
}

// ── Router ──

export function toDisplayData(snapshot: WorkoutSnapshot, nav: GlassNavState): DisplayData {
  const lang = snapshot.language;
  switch (nav.screen) {
    case 'workout-list':
      return workoutListDisplay(nav, snapshot);
    case 'workout-detail': {
      if (snapshot.selectedWorkout) return workoutDetailDisplay(snapshot.selectedWorkout, nav, lang);
      return workoutListDisplay(nav, snapshot);
    }
    case 'active': {
      if (snapshot.activeState && snapshot.selectedWorkout) {
        if (snapshot.activeState.completedSets >= snapshot.activeState.totalSets) {
          return completeDisplay(snapshot.activeState, nav, lang);
        }
        return activeDisplay(snapshot.activeState, snapshot.selectedWorkout, nav, snapshot.flashPhase, lang);
      }
      return workoutListDisplay(nav, snapshot);
    }
    case 'complete': {
      if (snapshot.activeState) return completeDisplay(snapshot.activeState, nav, lang);
      return workoutListDisplay(nav, snapshot);
    }
    case 'editor':
      return editorDisplay(lang);
    case 'history':
      return historyDisplay(snapshot, nav);
    default:
      return workoutListDisplay(nav, snapshot);
  }
}
