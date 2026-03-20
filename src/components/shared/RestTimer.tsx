import { TimerRing } from "even-toolkit/web";

interface RestTimerProps {
  remaining: number;
  total: number;
  onSkip: () => void;
}

export function RestTimer({ remaining, total }: RestTimerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[13px] tracking-[-0.13px] text-text-dim">Rest Period</p>
      <TimerRing remaining={remaining} total={total} />
    </div>
  );
}
