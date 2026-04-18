import { TimerRing } from "even-toolkit/web";
import { useTranslation } from "../../hooks/useTranslation";

interface RestTimerProps {
  remaining: number;
  total: number;
  onSkip: () => void;
}

export function RestTimer({ remaining, total }: RestTimerProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[13px] tracking-[-0.13px] text-text-dim">{t('component.restPeriod')}</p>
      <TimerRing remaining={remaining} total={total} />
    </div>
  );
}
