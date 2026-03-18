import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatTime } from "../../utils/format";

interface RestTimerProps {
  remaining: number;
  onSkip: () => void;
}

export function RestTimer({ remaining, onSkip }: RestTimerProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="text-center border-orange-accent/30"
    >
      <p className="text-xs uppercase tracking-widest text-orange-accent mb-4">
        Rest Period
      </p>
      <p
        className="text-orange-accent font-bold tabular-nums mb-6"
        style={{ fontSize: "72px", lineHeight: 1 }}
      >
        {formatTime(remaining)}
      </p>
      <Button variant="orange" size="lg" onClick={onSkip}>
        Skip Rest
      </Button>
    </Card>
  );
}
