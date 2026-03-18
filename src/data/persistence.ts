import type { Workout, SessionRecord } from "../types/workout";

import type { AppLanguage } from "../utils/i18n";

const CUSTOM_WORKOUTS_KEY = "even-workout:custom-workouts";
const SESSION_HISTORY_KEY = "even-workout:session-history";

const SETTINGS_KEY = "even-workout:settings";

export function loadLanguage(): AppLanguage {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.language) return settings.language as AppLanguage;
    }
  } catch {
    // ignore
  }
  return 'en';
}

export function saveLanguage(lang: AppLanguage): void {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const settings = raw ? JSON.parse(raw) : {};
    settings.language = lang;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadCustomWorkouts(): Workout[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomWorkouts(workouts: Workout[]): void {
  localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
}

export function loadSessionHistory(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSION_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(record: SessionRecord): void {
  const history = loadSessionHistory();
  history.unshift(record);
  localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
}

export function removeSessionById(id: string): void {
  const history = loadSessionHistory().filter((s) => s.id !== id);
  localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
}

export function clearSessionHistory(): void {
  localStorage.removeItem(SESSION_HISTORY_KEY);
}
