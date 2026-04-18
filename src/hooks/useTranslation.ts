import { useCallback } from 'react';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { t as translate } from '../utils/i18n';

export function useTranslation() {
  const { language } = useWorkoutContext();
  const t = useCallback((key: string) => translate(key, language), [language]);
  return { t, lang: language };
}
