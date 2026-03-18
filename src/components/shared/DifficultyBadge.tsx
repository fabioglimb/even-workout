import { Badge } from "../ui/Badge";
import type { Workout } from "../../types/workout";

interface DifficultyBadgeProps {
  difficulty: Workout["difficulty"];
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <Badge variant={difficulty}>{difficulty}</Badge>;
}
