import { Card, Select, useDrawerHeader } from 'even-toolkit/web';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { APP_LANGUAGES, type AppLanguage } from '../utils/i18n';
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

export default function Settings() {
  const { language, setLanguage } = useWorkoutContext();
  const { t } = useTranslation();
  useDrawerHeader({
    title: t('settings.title'),
    right: <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>,
  });

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
