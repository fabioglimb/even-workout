import type { Workout, SessionRecord } from "../types/workout";
import type { AppLanguage } from "../utils/i18n";
import { storageGetSync, storageSet, storageRemove } from "even-toolkit/storage";

const CUSTOM_WORKOUTS_KEY = "even-workout:custom-workouts";
const SESSION_HISTORY_KEY = "even-workout:session-history";
const SETTINGS_KEY = "even-workout:settings";

/** All storage keys — used by hydrateFromSDK at startup */
export const ALL_STORAGE_KEYS = [CUSTOM_WORKOUTS_KEY, SESSION_HISTORY_KEY, SETTINGS_KEY];

// ── Language ──

export function loadLanguage(): AppLanguage {
  try {
    const settings = storageGetSync<Record<string, unknown>>(SETTINGS_KEY, {});
    if (settings.language) return settings.language as AppLanguage;
  } catch { /* ignore */ }
  return 'en';
}

export function saveLanguage(lang: AppLanguage): void {
  try {
    const settings = storageGetSync<Record<string, unknown>>(SETTINGS_KEY, {});
    settings.language = lang;
    storageSet(SETTINGS_KEY, settings);
  } catch { /* ignore */ }
}

// ── Custom Workouts ──

export function loadCustomWorkouts(): Workout[] {
  return storageGetSync<Workout[]>(CUSTOM_WORKOUTS_KEY, []);
}

export function saveCustomWorkouts(workouts: Workout[]): void {
  storageSet(CUSTOM_WORKOUTS_KEY, workouts);
}

// ── Session History ──

export function loadSessionHistory(): SessionRecord[] {
  return storageGetSync<SessionRecord[]>(SESSION_HISTORY_KEY, []);
}

export function saveSession(record: SessionRecord): void {
  const history = loadSessionHistory();
  history.unshift(record);
  storageSet(SESSION_HISTORY_KEY, history);
}

export function removeSessionById(id: string): void {
  const history = loadSessionHistory().filter((s) => s.id !== id);
  storageSet(SESSION_HISTORY_KEY, history);
}

export function clearSessionHistory(): void {
  storageRemove(SESSION_HISTORY_KEY);
}
