import type { Workout, SessionRecord } from "../types/workout";
import type { AppLanguage } from "../utils/i18n";
import { storageGet, storageSet, storageRemove } from "even-toolkit/storage";

const CUSTOM_WORKOUTS_KEY = "even-workout:custom-workouts";
const SESSION_HISTORY_KEY = "even-workout:session-history";
const SETTINGS_KEY = "even-workout:settings";

/** All storage keys — kept for reference */
export const ALL_STORAGE_KEYS = [CUSTOM_WORKOUTS_KEY, SESSION_HISTORY_KEY, SETTINGS_KEY];

// ── Language ──

export async function loadLanguage(): Promise<AppLanguage> {
  const settings = await storageGet<Record<string, unknown>>(SETTINGS_KEY, {});
  return (settings.language as AppLanguage) ?? 'en';
}

export async function saveLanguage(lang: AppLanguage): Promise<void> {
  const settings = await storageGet<Record<string, unknown>>(SETTINGS_KEY, {});
  settings.language = lang;
  await storageSet(SETTINGS_KEY, settings);
}

// ── Custom Workouts ──

export async function loadCustomWorkouts(): Promise<Workout[]> {
  return storageGet<Workout[]>(CUSTOM_WORKOUTS_KEY, []);
}

export async function saveCustomWorkouts(workouts: Workout[]): Promise<void> {
  await storageSet(CUSTOM_WORKOUTS_KEY, workouts);
}

// ── Session History ──

export async function loadSessionHistory(): Promise<SessionRecord[]> {
  return storageGet<SessionRecord[]>(SESSION_HISTORY_KEY, []);
}

export async function saveSession(record: SessionRecord): Promise<void> {
  const history = await loadSessionHistory();
  history.unshift(record);
  await storageSet(SESSION_HISTORY_KEY, history);
}

export async function removeSessionById(id: string): Promise<void> {
  const history = (await loadSessionHistory()).filter((s) => s.id !== id);
  await storageSet(SESSION_HISTORY_KEY, history);
}

export async function clearSessionHistory(): Promise<void> {
  await storageRemove(SESSION_HISTORY_KEY);
}
