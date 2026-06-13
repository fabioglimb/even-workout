import type { Exercise } from "../types/workout";

/**
 * Returns the weight to use for a given set index (1-based or 0-based — both
 * supported via the same array index lookup as long as callers stay consistent).
 *
 * Falls back to `Exercise.weightKg` when no per-set override exists.
 */
export function getSetWeight(exercise: Exercise, setIndex: number): number | null {
  const override = exercise.setWeightsKg?.[setIndex];
  if (override !== undefined && override !== null) return override;
  return exercise.weightKg ?? null;
}
