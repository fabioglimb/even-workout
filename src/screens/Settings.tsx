import { Card, Select, Toggle, MultiSelect, useDrawerHeader } from 'even-toolkit/web';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { APP_LANGUAGES, type AppLanguage } from '../utils/i18n';
import { ALL_SMART_VIEW_FIELDS, type SmartViewField } from '../types/workout';
import { useTranslation } from '../hooks/useTranslation';

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <span className="text-[15px] tracking-[-0.15px] text-text font-normal">{label}</span>
        {description && <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

const FIELD_LABEL_KEYS: Record<SmartViewField, string> = {
  sets: 'settings.field.sets',
  reps: 'settings.field.reps',
  weight: 'settings.field.weight',
  rest: 'settings.field.rest',
  progress: 'settings.field.progress',
  exerciseNum: 'settings.field.exerciseNum',
  nextExercise: 'settings.field.nextExercise',
};

export default function Settings() {
  const { language, setLanguage, smartViewConfig, setSmartViewConfig } = useWorkoutContext();
  const { t } = useTranslation();
  useDrawerHeader({
    title: t('settings.title'),
    right: <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>,
  });

  const fieldOptions = ALL_SMART_VIEW_FIELDS.map((field) => ({
    value: field,
    label: t(FIELD_LABEL_KEYS[field]),
  }));

  return (
    <div className="px-3 pt-4 pb-8">
      {/* Language */}
      <SectionLabel>{t('settings.language')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.appLanguage')} description={t('settings.appLanguageDesc')}>
          <Select
            options={APP_LANGUAGES.map((l) => ({ value: l.id, label: l.name }))}
            value={language}
            onValueChange={(v) => setLanguage(v as AppLanguage)}
            className="w-[130px]"
          />
        </SettingRow>
      </Card>

      {/* Smart View */}
      <SectionLabel>{t('settings.smartView')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.smartViewEnabled')} description={t('settings.smartViewDesc')}>
          <Toggle
            checked={smartViewConfig.enabled}
            onChange={(checked) => setSmartViewConfig({ ...smartViewConfig, enabled: checked })}
          />
        </SettingRow>
        {smartViewConfig.enabled && (
          <>
            <SettingRow label={t('settings.defaultView')} description={t('settings.defaultViewDesc')}>
              <Select
                options={[
                  { value: 'full', label: t('settings.viewFull') },
                  { value: 'smart', label: t('settings.viewSmart') },
                ]}
                value={smartViewConfig.defaultMode}
                onValueChange={(v) => setSmartViewConfig({ ...smartViewConfig, defaultMode: v as 'full' | 'smart' })}
                className="w-[140px]"
              />
            </SettingRow>
            <SettingRow label={t('settings.smartViewFields')}>
              <MultiSelect
                options={fieldOptions}
                values={smartViewConfig.fields}
                onValuesChange={(values) => setSmartViewConfig({ ...smartViewConfig, fields: values as SmartViewField[] })}
                placeholder={t('settings.smartViewFields')}
                className="w-[180px]"
              />
            </SettingRow>
          </>
        )}
      </Card>

      {/* About */}
      <SectionLabel>{t('settings.about')}</SectionLabel>
      <Card>
        <SettingRow label={t('settings.aboutName')} description={t('settings.aboutDesc')}>
          <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>
        </SettingRow>
      </Card>
    </div>
  );
}
