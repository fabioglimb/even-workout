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
  // ── Settings ──
  'settings.title': {
    en: 'Settings', it: 'Impostazioni', es: 'Ajustes', fr: 'Paramètres', de: 'Einstellungen',
    pt: 'Configurações', ja: '設定', zh: '设置', ko: '설정', ru: 'Настройки',
  },
  'settings.language': {
    en: 'Language', it: 'Lingua', es: 'Idioma', fr: 'Langue', de: 'Sprache',
    pt: 'Idioma', ja: '言語', zh: '语言', ko: '언어', ru: 'Язык',
  },
  'settings.appLanguage': {
    en: 'App Language', it: 'Lingua App', es: 'Idioma de la App', fr: 'Langue de l\'app', de: 'App-Sprache',
    pt: 'Idioma do App', ja: 'アプリの言語', zh: '应用语言', ko: '앱 언어', ru: 'Язык приложения',
  },
  'settings.appLanguageDesc': {
    en: 'Language for the app interface', it: 'Lingua dell\'interfaccia', es: 'Idioma de la interfaz', fr: 'Langue de l\'interface', de: 'Sprache der Oberfläche',
    pt: 'Idioma da interface', ja: 'インターフェースの言語', zh: '界面语言', ko: '인터페이스 언어', ru: 'Язык интерфейса',
  },
  'settings.about': {
    en: 'About', it: 'Info', es: 'Acerca de', fr: 'À propos', de: 'Info',
    pt: 'Sobre', ja: '情報', zh: '关于', ko: '정보', ru: 'О приложении',
  },
  'settings.aboutName': {
    en: 'ER Workout', it: 'ER Workout', es: 'ER Workout', fr: 'ER Workout', de: 'ER Workout',
    pt: 'ER Workout', ja: 'ER Workout', zh: 'ER Workout', ko: 'ER Workout', ru: 'ER Workout',
  },
  'settings.aboutDesc': {
    en: 'Workout tracking companion for G2 smart glasses', it: 'Compagno di allenamento per occhiali G2', es: 'Compañero de entrenamiento para gafas G2', fr: 'Compagnon d\'entraînement pour lunettes G2', de: 'Trainingsbegleiter für G2-Brillen',
    pt: 'Companheiro de treino para óculos G2', ja: 'G2スマートグラス用ワークアウト', zh: 'G2智能眼镜运动伴侣', ko: 'G2 스마트 글래스 운동 도우미', ru: 'Помощник для тренировок на очках G2',
  },

  // ── Workout List ──
  'workoutList.new': {
    en: '+ New', it: '+ Nuovo', es: '+ Nuevo', fr: '+ Nouveau', de: '+ Neu',
    pt: '+ Novo', ja: '+ 新規', zh: '+ 新建', ko: '+ 새로', ru: '+ Новая',
  },

  'nav.training': {
    en: 'Training', it: 'Allenamento', es: 'Training', fr: 'Training', de: 'Training',
    pt: 'Training', ja: 'Training', zh: 'Training', ko: 'Training', ru: 'Training',
  },
  'nav.workouts': {
    en: 'Workouts', it: 'Allenamenti', es: 'Workouts', fr: 'Workouts', de: 'Workouts',
    pt: 'Workouts', ja: 'Workouts', zh: 'Workouts', ko: 'Workouts', ru: 'Workouts',
  },
  'nav.history': {
    en: 'History', it: 'Cronologia', es: 'History', fr: 'History', de: 'History',
    pt: 'History', ja: 'History', zh: 'History', ko: 'History', ru: 'History',
  },

  // ── Calendar ──
  'calendar.title': {
    en: 'Calendar', it: 'Calendario', es: 'Calendar', fr: 'Calendar', de: 'Calendar',
    pt: 'Calendar', ja: 'Calendar', zh: 'Calendar', ko: 'Calendar', ru: 'Calendar',
  },
  'calendar.forDate': {
    en: 'Plan for', it: 'Piano per', es: 'Plan for', fr: 'Plan for', de: 'Plan for',
    pt: 'Plan for', ja: 'Plan for', zh: 'Plan for', ko: 'Plan for', ru: 'Plan for',
  },
  'calendar.workout': {
    en: 'Workout', it: 'Allenamento', es: 'Workout', fr: 'Workout', de: 'Workout',
    pt: 'Workout', ja: 'Workout', zh: 'Workout', ko: 'Workout', ru: 'Workout',
  },
  'calendar.schedule': {
    en: 'Schedule', it: 'Programma', es: 'Schedule', fr: 'Schedule', de: 'Schedule',
    pt: 'Schedule', ja: 'Schedule', zh: 'Schedule', ko: 'Schedule', ru: 'Schedule',
  },
  'calendar.time': {
    en: 'Time', it: 'Ora', es: 'Time', fr: 'Time', de: 'Time',
    pt: 'Time', ja: 'Time', zh: 'Time', ko: 'Time', ru: 'Time',
  },
  'calendar.pickTime': {
    en: 'Pick Time', it: 'Scegli orario', es: 'Pick Time', fr: 'Pick Time', de: 'Pick Time',
    pt: 'Pick Time', ja: 'Pick Time', zh: 'Pick Time', ko: 'Pick Time', ru: 'Pick Time',
  },
  'calendar.emptyDay': {
    en: 'No workouts scheduled for this day yet.', it: 'Nessun allenamento programmato per questo giorno.', es: 'No workouts scheduled for this day yet.', fr: 'No workouts scheduled for this day yet.', de: 'No workouts scheduled for this day yet.',
    pt: 'No workouts scheduled for this day yet.', ja: 'No workouts scheduled for this day yet.', zh: 'No workouts scheduled for this day yet.', ko: 'No workouts scheduled for this day yet.', ru: 'No workouts scheduled for this day yet.',
  },
  'calendar.noWorkouts': {
    en: 'No workouts yet', it: 'Nessun allenamento', es: 'No workouts yet', fr: 'No workouts yet', de: 'No workouts yet',
    pt: 'No workouts yet', ja: 'No workouts yet', zh: 'No workouts yet', ko: 'No workouts yet', ru: 'No workouts yet',
  },
  'calendar.noWorkoutsDesc': {
    en: 'Create a workout first, then assign it to days in your routine calendar.', it: 'Crea prima un allenamento, poi assegnalo ai giorni del tuo calendario.', es: 'Create a workout first, then assign it to days in your routine calendar.', fr: 'Create a workout first, then assign it to days in your routine calendar.', de: 'Create a workout first, then assign it to days in your routine calendar.',
    pt: 'Create a workout first, then assign it to days in your routine calendar.', ja: 'Create a workout first, then assign it to days in your routine calendar.', zh: 'Create a workout first, then assign it to days in your routine calendar.', ko: 'Create a workout first, then assign it to days in your routine calendar.', ru: 'Create a workout first, then assign it to days in your routine calendar.',
  },
  'calendar.totalPlanned': {
    en: 'Planned', it: 'Programmati', es: 'Planned', fr: 'Planned', de: 'Planned',
    pt: 'Planned', ja: 'Planned', zh: 'Planned', ko: 'Planned', ru: 'Planned',
  },
  'calendar.thisWeek': {
    en: 'This Week', it: 'Questa Settimana', es: 'This Week', fr: 'This Week', de: 'This Week',
    pt: 'This Week', ja: 'This Week', zh: 'This Week', ko: 'This Week', ru: 'This Week',
  },
  'calendar.planned': {
    en: 'planned', it: 'programmati', es: 'planned', fr: 'planned', de: 'planned',
    pt: 'planned', ja: 'planned', zh: 'planned', ko: 'planned', ru: 'planned',
  },

  // ── Workout Detail ──
  'detail.notFound': {
    en: 'Workout not found', it: 'Allenamento non trovato', es: 'Entrenamiento no encontrado', fr: 'Entraînement introuvable', de: 'Training nicht gefunden',
    pt: 'Treino não encontrado', ja: 'ワークアウトが見つかりません', zh: '未找到锻炼', ko: '운동을 찾을 수 없습니다', ru: 'Тренировка не найдена',
  },
  'detail.exercises': {
    en: 'exercises', it: 'esercizi', es: 'ejercicios', fr: 'exercices', de: 'Übungen',
    pt: 'exercícios', ja: 'エクササイズ', zh: '项练习', ko: '운동', ru: 'упражнений',
  },
  'detail.sets': {
    en: 'sets', it: 'serie', es: 'series', fr: 'séries', de: 'Sätze',
    pt: 'séries', ja: 'セット', zh: '组', ko: '세트', ru: 'подходов',
  },
  'detail.reps': {
    en: 'reps', it: 'ripetizioni', es: 'repeticiones', fr: 'répétitions', de: 'Wdh',
    pt: 'repetições', ja: '回', zh: '次', ko: '회', ru: 'повторов',
  },
  'detail.startWorkout': {
    en: 'Start Workout', it: 'Inizia Allenamento', es: 'Iniciar Entrenamiento', fr: 'Démarrer l\'Entraînement', de: 'Training starten',
    pt: 'Iniciar Treino', ja: 'ワークアウト開始', zh: '开始锻炼', ko: '운동 시작', ru: 'Начать тренировку',
  },
  'detail.schedule': {
    en: 'Schedule', it: 'Programma', es: 'Schedule', fr: 'Schedule', de: 'Schedule',
    pt: 'Schedule', ja: 'Schedule', zh: 'Schedule', ko: 'Schedule', ru: 'Schedule',
  },
  'detail.edit': {
    en: 'Edit', it: 'Modifica', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten',
    pt: 'Editar', ja: '編集', zh: '编辑', ko: '편집', ru: 'Редактировать',
  },
  'detail.delete': {
    en: 'Delete', it: 'Elimina', es: 'Eliminar', fr: 'Supprimer', de: 'Löschen',
    pt: 'Excluir', ja: '削除', zh: '删除', ko: '삭제', ru: 'Удалить',
  },
  'detail.deleteTitle': {
    en: 'Delete Workout?', it: 'Eliminare l\'allenamento?', es: '¿Eliminar entrenamiento?', fr: 'Supprimer l\'entraînement ?', de: 'Training löschen?',
    pt: 'Excluir treino?', ja: 'ワークアウトを削除しますか？', zh: '删除锻炼？', ko: '운동을 삭제하시겠습니까?', ru: 'Удалить тренировку?',
  },
  'detail.deleteDesc': {
    en: 'This will permanently remove this workout. This action cannot be undone.', it: 'L\'allenamento verrà eliminato definitivamente.', es: 'Esto eliminará permanentemente este entrenamiento.', fr: 'L\'entraînement sera supprimé définitivement.', de: 'Das Training wird dauerhaft gelöscht.',
    pt: 'Este treino será removido permanentemente.', ja: 'ワークアウトは完全に削除されます。', zh: '此操作将永久删除该锻炼，无法撤销。', ko: '이 운동이 영구적으로 삭제됩니다.', ru: 'Тренировка будет удалена безвозвратно.',
  },
  'detail.cancel': {
    en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen',
    pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ru: 'Отмена',
  },
  'detail.exercise': {
    en: 'Exercise', it: 'Esercizio', es: 'Ejercicio', fr: 'Exercice', de: 'Übung',
    pt: 'Exercício', ja: 'エクササイズ', zh: '练习', ko: '운동', ru: 'Упражнение',
  },
  'detail.repsDur': {
    en: 'Reps/Dur', it: 'Rip/Dur', es: 'Reps/Dur', fr: 'Reps/Dur', de: 'Wdh/Dauer',
    pt: 'Reps/Dur', ja: '回数/時間', zh: '次数/时长', ko: '횟수/시간', ru: 'Повт/Длит',
  },
  'detail.rest': {
    en: 'Rest', it: 'Pausa', es: 'Descanso', fr: 'Repos', de: 'Pause',
    pt: 'Descanso', ja: '休憩', zh: '休息', ko: '휴식', ru: 'Отдых',
  },
  'detail.kg': {
    en: 'Kg', it: 'Kg', es: 'Kg', fr: 'Kg', de: 'Kg',
    pt: 'Kg', ja: 'Kg', zh: 'Kg', ko: 'Kg', ru: 'Кг',
  },

  // ── Workout Editor ──
  'editor.newWorkout': {
    en: 'New Workout', it: 'Nuovo Allenamento', es: 'Nuevo Entrenamiento', fr: 'Nouvel Entraînement', de: 'Neues Training',
    pt: 'Novo Treino', ja: '新規ワークアウト', zh: '新建锻炼', ko: '새 운동', ru: 'Новая тренировка',
  },
  'editor.editWorkout': {
    en: 'Edit Workout', it: 'Modifica Allenamento', es: 'Editar Entrenamiento', fr: 'Modifier l\'Entraînement', de: 'Training bearbeiten',
    pt: 'Editar Treino', ja: 'ワークアウト編集', zh: '编辑锻炼', ko: '운동 편집', ru: 'Редактировать тренировку',
  },
  'editor.workout': {
    en: 'Workout', it: 'Allenamento', es: 'Entrenamiento', fr: 'Entraînement', de: 'Training',
    pt: 'Treino', ja: 'ワークアウト', zh: '锻炼', ko: '운동', ru: 'Тренировка',
  },
  'editor.name': {
    en: 'Name', it: 'Nome', es: 'Nombre', fr: 'Nom', de: 'Name',
    pt: 'Nome', ja: '名前', zh: '名称', ko: '이름', ru: 'Название',
  },
  'editor.workoutName': {
    en: 'Workout name', it: 'Nome allenamento', es: 'Nombre del entrenamiento', fr: 'Nom de l\'entraînement', de: 'Trainingsname',
    pt: 'Nome do treino', ja: 'ワークアウト名', zh: '锻炼名称', ko: '운동 이름', ru: 'Название тренировки',
  },
  'editor.difficulty': {
    en: 'Difficulty', it: 'Difficoltà', es: 'Dificultad', fr: 'Difficulté', de: 'Schwierigkeit',
    pt: 'Dificuldade', ja: '難易度', zh: '难度', ko: '난이도', ru: 'Сложность',
  },
  'editor.beginner': {
    en: 'Beginner', it: 'Principiante', es: 'Principiante', fr: 'Débutant', de: 'Anfänger',
    pt: 'Iniciante', ja: '初級', zh: '初级', ko: '초급', ru: 'Начинающий',
  },
  'editor.intermediate': {
    en: 'Intermediate', it: 'Intermedio', es: 'Intermedio', fr: 'Intermédiaire', de: 'Fortgeschritten',
    pt: 'Intermediário', ja: '中級', zh: '中级', ko: '중급', ru: 'Средний',
  },
  'editor.advanced': {
    en: 'Advanced', it: 'Avanzato', es: 'Avanzado', fr: 'Avancé', de: 'Profi',
    pt: 'Avançado', ja: '上級', zh: '高级', ko: '상급', ru: 'Продвинутый',
  },
  'editor.targetMuscles': {
    en: 'Target Muscles', it: 'Muscoli Target', es: 'Músculos Objetivo', fr: 'Muscles Ciblés', de: 'Zielmuskulatur',
    pt: 'Músculos Alvo', ja: '対象筋肉', zh: '目标肌群', ko: '대상 근육', ru: 'Целевые мышцы',
  },
  'editor.targetPlaceholder': {
    en: 'e.g. Chest, Back', it: 'es. Petto, Schiena', es: 'ej. Pecho, Espalda', fr: 'ex. Poitrine, Dos', de: 'z.B. Brust, Rücken',
    pt: 'ex. Peito, Costas', ja: '例：胸、背中', zh: '例如：胸部、背部', ko: '예: 가슴, 등', ru: 'напр. Грудь, Спина',
  },
  'editor.estMinutes': {
    en: 'Est. Minutes', it: 'Min. Stimati', es: 'Min. Estimados', fr: 'Min. Estimées', de: 'Geschätzte Min.',
    pt: 'Min. Estimados', ja: '推定時間（分）', zh: '预计分钟', ko: '예상 시간(분)', ru: 'Ожид. минут',
  },
  'editor.exercises': {
    en: 'Exercises', it: 'Esercizi', es: 'Ejercicios', fr: 'Exercices', de: 'Übungen',
    pt: 'Exercícios', ja: 'エクササイズ', zh: '练习项目', ko: '운동 목록', ru: 'Упражнения',
  },
  'editor.exercise': {
    en: 'Exercise', it: 'Esercizio', es: 'Ejercicio', fr: 'Exercice', de: 'Übung',
    pt: 'Exercício', ja: 'エクササイズ', zh: '练习', ko: '운동', ru: 'Упражнение',
  },
  'editor.exerciseName': {
    en: 'Exercise name', it: 'Nome esercizio', es: 'Nombre del ejercicio', fr: 'Nom de l\'exercice', de: 'Übungsname',
    pt: 'Nome do exercício', ja: 'エクササイズ名', zh: '练习名称', ko: '운동 이름', ru: 'Название упражнения',
  },
  'editor.sets': {
    en: 'Sets', it: 'Serie', es: 'Series', fr: 'Séries', de: 'Sätze',
    pt: 'Séries', ja: 'セット', zh: '组数', ko: '세트', ru: 'Подходы',
  },
  'editor.reps': {
    en: 'Reps', it: 'Rip', es: 'Reps', fr: 'Reps', de: 'Wdh',
    pt: 'Reps', ja: '回数', zh: '次数', ko: '횟수', ru: 'Повт',
  },
  'editor.kg': {
    en: 'Kg', it: 'Kg', es: 'Kg', fr: 'Kg', de: 'Kg',
    pt: 'Kg', ja: 'Kg', zh: 'Kg', ko: 'Kg', ru: 'Кг',
  },
  'editor.secs': {
    en: 'Secs', it: 'Sec', es: 'Seg', fr: 'Sec', de: 'Sek',
    pt: 'Seg', ja: '秒', zh: '秒', ko: '초', ru: 'Сек',
  },
  'editor.restS': {
    en: 'Rest(s)', it: 'Pausa(s)', es: 'Desc(s)', fr: 'Repos(s)', de: 'Pause(s)',
    pt: 'Desc(s)', ja: '休憩(秒)', zh: '休息(秒)', ko: '휴식(초)', ru: 'Отдых(с)',
  },
  'editor.type': {
    en: 'Type', it: 'Tipo', es: 'Tipo', fr: 'Type', de: 'Typ',
    pt: 'Tipo', ja: 'タイプ', zh: '类型', ko: '유형', ru: 'Тип',
  },
  'editor.timed': {
    en: 'Timed', it: 'A tempo', es: 'Tiempo', fr: 'Chrono', de: 'Zeit',
    pt: 'Tempo', ja: '時間制', zh: '计时', ko: '시간제', ru: 'По времени',
  },
  'editor.addExercise': {
    en: 'Add Exercise', it: 'Aggiungi Esercizio', es: 'Añadir Ejercicio', fr: 'Ajouter un Exercice', de: 'Übung hinzufügen',
    pt: 'Adicionar Exercício', ja: 'エクササイズ追加', zh: '添加练习', ko: '운동 추가', ru: 'Добавить упражнение',
  },
  'editor.cancel': {
    en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen',
    pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ru: 'Отмена',
  },
  'editor.saveChanges': {
    en: 'Save Changes', it: 'Salva Modifiche', es: 'Guardar Cambios', fr: 'Enregistrer', de: 'Änderungen speichern',
    pt: 'Salvar Alterações', ja: '変更を保存', zh: '保存更改', ko: '변경 저장', ru: 'Сохранить изменения',
  },
  'editor.createWorkout': {
    en: 'Create Workout', it: 'Crea Allenamento', es: 'Crear Entrenamiento', fr: 'Créer l\'Entraînement', de: 'Training erstellen',
    pt: 'Criar Treino', ja: 'ワークアウト作成', zh: '创建锻炼', ko: '운동 만들기', ru: 'Создать тренировку',
  },

  // ── Active Workout ──
  'active.skipRest': {
    en: 'Skip Rest', it: 'Salta Pausa', es: 'Saltar Descanso', fr: 'Passer le Repos', de: 'Pause überspringen',
    pt: 'Pular Descanso', ja: '休憩をスキップ', zh: '跳过休息', ko: '휴식 건너뛰기', ru: 'Пропустить отдых',
  },
  'active.title': {
    en: 'Active Workout', it: 'Allenamento Attivo', es: 'Active Workout', fr: 'Active Workout', de: 'Active Workout',
    pt: 'Active Workout', ja: 'Active Workout', zh: 'Active Workout', ko: 'Active Workout', ru: 'Active Workout',
  },
  'active.allSetsComplete': {
    en: 'All Sets Complete', it: 'Tutte le Serie Complete', es: 'Todas las Series Completadas', fr: 'Toutes les Séries Terminées', de: 'Alle Sätze abgeschlossen',
    pt: 'Todas as Séries Completas', ja: '全セット完了', zh: '全部完成', ko: '모든 세트 완료', ru: 'Все подходы выполнены',
  },
  'active.greatWork': {
    en: 'Great Work!', it: 'Ottimo Lavoro!', es: '¡Buen Trabajo!', fr: 'Bon Travail !', de: 'Gute Arbeit!',
    pt: 'Ótimo Trabalho!', ja: 'お疲れ様！', zh: '做得好！', ko: '수고했어요!', ru: 'Отличная работа!',
  },
  'active.finishWorkout': {
    en: 'Finish Workout', it: 'Termina Allenamento', es: 'Terminar Entrenamiento', fr: 'Terminer l\'Entraînement', de: 'Training beenden',
    pt: 'Terminar Treino', ja: 'ワークアウト終了', zh: '结束锻炼', ko: '운동 완료', ru: 'Завершить тренировку',
  },
  'active.completeSet': {
    en: 'Complete Set', it: 'Completa Serie', es: 'Completar Serie', fr: 'Terminer la Série', de: 'Satz abschließen',
    pt: 'Completar Série', ja: 'セット完了', zh: '完成组数', ko: '세트 완료', ru: 'Завершить подход',
  },
  'active.sets': {
    en: 'sets', it: 'serie', es: 'series', fr: 'séries', de: 'Sätze',
    pt: 'séries', ja: 'セット', zh: '组', ko: '세트', ru: 'подх.',
  },

  // ── Workout Complete ──
  'complete.noData': {
    en: 'No workout data', it: 'Nessun dato', es: 'Sin datos', fr: 'Pas de données', de: 'Keine Daten',
    pt: 'Sem dados', ja: 'データなし', zh: '无数据', ko: '데이터 없음', ru: 'Нет данных',
  },
  'complete.backToWorkouts': {
    en: 'Back to Workouts', it: 'Torna agli Allenamenti', es: 'Volver a Entrenamientos', fr: 'Retour aux Entraînements', de: 'Zurück zu Trainings',
    pt: 'Voltar aos Treinos', ja: 'ワークアウト一覧へ', zh: '返回锻炼列表', ko: '운동 목록으로', ru: 'К тренировкам',
  },
  'complete.workoutComplete': {
    en: 'Workout Complete', it: 'Allenamento Completo', es: 'Entrenamiento Completado', fr: 'Entraînement Terminé', de: 'Training abgeschlossen',
    pt: 'Treino Completo', ja: 'ワークアウト完了', zh: '锻炼完成', ko: '운동 완료', ru: 'Тренировка завершена',
  },
  'complete.sessionFinished': {
    en: 'Session finished', it: 'Sessione terminata', es: 'Sesión finalizada', fr: 'Séance terminée', de: 'Sitzung beendet',
    pt: 'Sessão finalizada', ja: 'セッション終了', zh: '训练结束', ko: '세션 완료', ru: 'Сессия завершена',
  },
  'complete.duration': {
    en: 'Duration', it: 'Durata', es: 'Duración', fr: 'Durée', de: 'Dauer',
    pt: 'Duração', ja: '時間', zh: '时长', ko: '시간', ru: 'Время',
  },
  'complete.sets': {
    en: 'Sets', it: 'Serie', es: 'Series', fr: 'Séries', de: 'Sätze',
    pt: 'Séries', ja: 'セット', zh: '组数', ko: '세트', ru: 'Подходы',
  },
  'complete.exercises': {
    en: 'Exercises', it: 'Esercizi', es: 'Ejercicios', fr: 'Exercices', de: 'Übungen',
    pt: 'Exercícios', ja: 'エクササイズ', zh: '练习', ko: '운동', ru: 'Упражнения',
  },

  // ── Session History ──
  'history.title': {
    en: 'History', it: 'Storico', es: 'Historial', fr: 'Historique', de: 'Verlauf',
    pt: 'Histórico', ja: '履歴', zh: '历史', ko: '기록', ru: 'История',
  },
  'history.totalWorkouts': {
    en: 'Total Workouts', it: 'Allenamenti Totali', es: 'Entrenamientos Totales', fr: 'Entraînements Totaux', de: 'Trainings Gesamt',
    pt: 'Treinos Totais', ja: '合計ワークアウト', zh: '总锻炼次数', ko: '총 운동 횟수', ru: 'Всего тренировок',
  },
  'history.thisWeek': {
    en: 'This Week', it: 'Questa Settimana', es: 'Esta Semana', fr: 'Cette Semaine', de: 'Diese Woche',
    pt: 'Esta Semana', ja: '今週', zh: '本周', ko: '이번 주', ru: 'Эта неделя',
  },
  'history.noSessions': {
    en: 'No sessions yet', it: 'Nessuna sessione', es: 'Sin sesiones aún', fr: 'Aucune séance', de: 'Noch keine Sitzungen',
    pt: 'Nenhuma sessão', ja: 'セッションなし', zh: '暂无记录', ko: '세션 없음', ru: 'Нет сессий',
  },
  'history.noSessionsDesc': {
    en: 'Complete a workout to see it here.', it: 'Completa un allenamento per vederlo qui.', es: 'Completa un entrenamiento para verlo aquí.', fr: 'Terminez un entraînement pour le voir ici.', de: 'Schließe ein Training ab, um es hier zu sehen.',
    pt: 'Complete um treino para vê-lo aqui.', ja: 'ワークアウトを完了するとここに表示されます。', zh: '完成锻炼后将在此显示。', ko: '운동을 완료하면 여기에 표시됩니다.', ru: 'Завершите тренировку, чтобы увидеть её здесь.',
  },
  'history.clearTitle': {
    en: 'Clear All History?', it: 'Cancellare tutto lo storico?', es: '¿Borrar todo el historial?', fr: 'Effacer tout l\'historique ?', de: 'Gesamten Verlauf löschen?',
    pt: 'Limpar todo o histórico?', ja: '全履歴を消去しますか？', zh: '清除全部历史？', ko: '모든 기록을 삭제하시겠습니까?', ru: 'Очистить всю историю?',
  },
  'history.clearDesc': {
    en: 'This will permanently delete all workout sessions. This action cannot be undone.', it: 'Tutte le sessioni verranno eliminate definitivamente.', es: 'Esto eliminará permanentemente todas las sesiones.', fr: 'Toutes les séances seront supprimées définitivement.', de: 'Alle Sitzungen werden dauerhaft gelöscht.',
    pt: 'Todas as sessões serão excluídas permanentemente.', ja: 'すべてのセッションが完全に削除されます。', zh: '所有训练记录将被永久删除，无法撤销。', ko: '모든 운동 세션이 영구적으로 삭제됩니다.', ru: 'Все сессии будут удалены безвозвратно.',
  },
  'history.clearAll': {
    en: 'Clear All', it: 'Cancella Tutto', es: 'Borrar Todo', fr: 'Tout Effacer', de: 'Alles löschen',
    pt: 'Limpar Tudo', ja: 'すべて消去', zh: '全部清除', ko: '모두 삭제', ru: 'Очистить всё',
  },
  'history.sets': {
    en: 'sets', it: 'serie', es: 'series', fr: 'séries', de: 'Sätze',
    pt: 'séries', ja: 'セット', zh: '组', ko: '세트', ru: 'подх.',
  },
  'history.exercises': {
    en: 'exercises', it: 'esercizi', es: 'ejercicios', fr: 'exercices', de: 'Übungen',
    pt: 'exercícios', ja: 'エクササイズ', zh: '项练习', ko: '운동', ru: 'упражнений',
  },

  // ── Shared Components ──
  'component.restPeriod': {
    en: 'Rest Period', it: 'Periodo di Pausa', es: 'Periodo de Descanso', fr: 'Période de Repos', de: 'Pausenzeit',
    pt: 'Período de Descanso', ja: '休憩時間', zh: '休息时间', ko: '휴식 시간', ru: 'Период отдыха',
  },
  'component.currentExercise': {
    en: 'Current Exercise', it: 'Esercizio Corrente', es: 'Ejercicio Actual', fr: 'Exercice en Cours', de: 'Aktuelle Übung',
    pt: 'Exercício Atual', ja: '現在のエクササイズ', zh: '当前练习', ko: '현재 운동', ru: 'Текущее упражнение',
  },
  'component.setOf': {
    en: 'of', it: 'di', es: 'de', fr: 'de', de: 'von',
    pt: 'de', ja: '/', zh: '/', ko: '/', ru: 'из',
  },
  'component.upNext': {
    en: 'Up Next', it: 'Prossimo', es: 'Siguiente', fr: 'Suivant', de: 'Als Nächstes',
    pt: 'Próximo', ja: '次のエクササイズ', zh: '下一个', ko: '다음', ru: 'Далее',
  },

  // ── Glass translations (existing) ──
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
  'glass.timer': {
    en: 'Timer', it: 'Timer', es: 'Temporizador', fr: 'Minuteur', de: 'Timer',
    pt: 'Temporizador', ja: 'タイマー', zh: '计时器', ko: '타이머', ru: 'Таймер',
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
