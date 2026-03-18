export type AppLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh' | 'ko' | 'ru';

export const APP_LANGUAGES: { id: AppLanguage; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'it', name: 'Italiano' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Français' },
  { id: 'de', name: 'Deutsch' },
  { id: 'pt', name: 'Português' },
  { id: 'ja', name: '日本語' },
  { id: 'zh', name: '中文' },
  { id: 'ko', name: '한국어' },
  { id: 'ru', name: 'Русский' },
];

const translations: Record<string, Record<AppLanguage, string>> = {
  'glass.start': {
    en: 'Start', it: 'Inizia', es: 'Iniciar', fr: 'Démarrer', de: 'Start',
    pt: 'Iniciar', ja: '開始', zh: '开始', ko: '시작', ru: 'Старт',
  },
  'glass.exercises': {
    en: 'EXERCISES', it: 'ESERCIZI', es: 'EJERCICIOS', fr: 'EXERCICES', de: 'ÜBUNGEN',
    pt: 'EXERCÍCIOS', ja: 'エクササイズ', zh: '练习', ko: '운동', ru: 'УПРАЖНЕНИЯ',
  },
  'glass.reps': {
    en: 'reps', it: 'rip', es: 'reps', fr: 'reps', de: 'Wdh',
    pt: 'reps', ja: '回', zh: '次', ko: '회', ru: 'повт',
  },
  'glass.rest': {
    en: 'REST', it: 'PAUSA', es: 'DESCANSO', fr: 'REPOS', de: 'PAUSE',
    pt: 'DESCANSO', ja: '休憩', zh: '休息', ko: '휴식', ru: 'ОТДЫХ',
  },
  'glass.set': {
    en: 'Set', it: 'Serie', es: 'Serie', fr: 'Série', de: 'Satz',
    pt: 'Série', ja: 'セット', zh: '组', ko: '세트', ru: 'Подход',
  },
  'glass.progress': {
    en: 'Progress', it: 'Progresso', es: 'Progreso', fr: 'Progrès', de: 'Fortschritt',
    pt: 'Progresso', ja: '進捗', zh: '进度', ko: '진행', ru: 'Прогресс',
  },
  'glass.sets': {
    en: 'sets', it: 'serie', es: 'series', fr: 'séries', de: 'Sätze',
    pt: 'séries', ja: 'セット', zh: '组', ko: '세트', ru: 'подх',
  },
  'glass.skipRest': {
    en: 'Skip Rest', it: 'Salta pausa', es: 'Saltar', fr: 'Passer', de: 'Überspringen',
    pt: 'Pular', ja: 'スキップ', zh: '跳过休息', ko: '건너뛰기', ru: 'Пропустить',
  },
  'glass.done': {
    en: 'Done', it: 'Fatto', es: 'Hecho', fr: 'Fait', de: 'Fertig',
    pt: 'Feito', ja: '完了', zh: '完成', ko: '완료', ru: 'Готово',
  },
  'glass.skip': {
    en: 'Skip', it: 'Salta', es: 'Saltar', fr: 'Passer', de: 'Überspr.',
    pt: 'Pular', ja: 'スキップ', zh: '跳过', ko: '건너뛰기', ru: 'Пропуск',
  },
  'glass.finish': {
    en: 'Finish', it: 'Fine', es: 'Terminar', fr: 'Terminer', de: 'Beenden',
    pt: 'Terminar', ja: '終了', zh: '结束', ko: '완료', ru: 'Завершить',
  },
  'glass.complete': {
    en: 'COMPLETE', it: 'COMPLETO', es: 'COMPLETO', fr: 'TERMINÉ', de: 'FERTIG',
    pt: 'COMPLETO', ja: '完了', zh: '完成', ko: '완료', ru: 'ГОТОВО',
  },
  'glass.home': {
    en: 'Home', it: 'Home', es: 'Inicio', fr: 'Accueil', de: 'Home',
    pt: 'Início', ja: 'ホーム', zh: '主页', ko: '홈', ru: 'Главная',
  },
  'glass.history': {
    en: 'History', it: 'Storico', es: 'Historial', fr: 'Historique', de: 'Verlauf',
    pt: 'Histórico', ja: '履歴', zh: '历史', ko: '기록', ru: 'История',
  },
  'glass.workoutComplete': {
    en: 'WORKOUT COMPLETE!', it: 'ALLENAMENTO COMPLETO!', es: '¡ENTRENAMIENTO COMPLETO!',
    fr: 'ENTRAÎNEMENT TERMINÉ!', de: 'TRAINING ABGESCHLOSSEN!', pt: 'TREINO COMPLETO!',
    ja: 'ワークアウト完了!', zh: '锻炼完成!', ko: '운동 완료!', ru: 'ТРЕНИРОВКА ЗАВЕРШЕНА!',
  },
  'glass.greatWork': {
    en: 'Great Work!', it: 'Ottimo Lavoro!', es: '¡Buen Trabajo!',
    fr: 'Bon Travail!', de: 'Gute Arbeit!', pt: 'Ótimo Trabalho!',
    ja: 'お疲れ様!', zh: '做得好!', ko: '수고했어요!', ru: 'Отличная работа!',
  },
  'glass.allSetsComplete': {
    en: 'ALL SETS COMPLETE', it: 'TUTTE LE SERIE COMPLETE', es: 'TODAS LAS SERIES COMPLETAS',
    fr: 'TOUTES LES SÉRIES TERMINÉES', de: 'ALLE SÄTZE FERTIG', pt: 'TODAS AS SÉRIES COMPLETAS',
    ja: '全セット完了', zh: '全部完成', ko: '모든 세트 완료', ru: 'ВСЕ ПОДХОДЫ ВЫПОЛНЕНЫ',
  },
  'glass.finishWorkout': {
    en: 'Finish', it: 'Fine', es: 'Terminar', fr: 'Terminer', de: 'Beenden',
    pt: 'Terminar', ja: '終了', zh: '结束', ko: '완료', ru: 'Завершить',
  },
  'glass.duration': {
    en: 'Duration', it: 'Durata', es: 'Duración', fr: 'Durée', de: 'Dauer',
    pt: 'Duração', ja: '時間', zh: '时长', ko: '시간', ru: 'Время',
  },
  'glass.editWorkout': {
    en: 'EDIT WORKOUT', it: 'MODIFICA', es: 'EDITAR', fr: 'MODIFIER', de: 'BEARBEITEN',
    pt: 'EDITAR', ja: '編集', zh: '编辑', ko: '편집', ru: 'РЕДАКТИРОВАТЬ',
  },
  'glass.back': {
    en: 'Back', it: 'Indietro', es: 'Atrás', fr: 'Retour', de: 'Zurück',
    pt: 'Voltar', ja: '戻る', zh: '返回', ko: '뒤로', ru: 'Назад',
  },
  'glass.usePhone': {
    en: 'Use phone to edit', it: 'Usa il telefono', es: 'Usa el teléfono',
    fr: 'Utilisez le téléphone', de: 'Telefon verwenden', pt: 'Use o celular',
    ja: 'スマホで編集', zh: '用手机编辑', ko: '폰에서 편집', ru: 'Ред. на телефоне',
  },
  'glass.total': {
    en: 'Total', it: 'Totale', es: 'Total', fr: 'Total', de: 'Gesamt',
    pt: 'Total', ja: '合計', zh: '总计', ko: '총', ru: 'Всего',
  },
  'glass.sessions': {
    en: 'sessions', it: 'sessioni', es: 'sesiones', fr: 'séances', de: 'Sitzungen',
    pt: 'sessões', ja: 'セッション', zh: '次训练', ko: '세션', ru: 'сессий',
  },
  'glass.noSessions': {
    en: 'No sessions yet', it: 'Nessuna sessione', es: 'Sin sesiones',
    fr: 'Aucune séance', de: 'Keine Sitzungen', pt: 'Nenhuma sessão',
    ja: 'セッションなし', zh: '暂无记录', ko: '세션 없음', ru: 'Нет сессий',
  },
};

export function t(key: string, lang: AppLanguage): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? key;
}

export function getLanguageName(lang: AppLanguage): string {
  const found = APP_LANGUAGES.find((l) => l.id === lang);
  return found?.name ?? lang;
}
