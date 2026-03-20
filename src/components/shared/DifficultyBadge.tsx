import { Badge } from "even-toolkit/web";
import type { Workout } from "../../types/workout";

const variantMap: Record<Workout["difficulty"], "positive" | "accent" | "negative"> = {
  beginner: "positive",
  intermediate: "accent",
  advanced: "negative",
};

interface DifficultyBadgeProps {
  difficulty: Workout["difficulty"];
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <Badge variant={variantMap[difficulty]}>{difficulty}</Badge>;
}
