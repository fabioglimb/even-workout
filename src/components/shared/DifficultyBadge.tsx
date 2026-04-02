import { Badge } from "even-toolkit/web";
import type { Workout } from "../../types/workout";
import { useTranslation } from "../../hooks/useTranslation";

const variantMap: Record<Workout["difficulty"], "positive" | "accent" | "negative"> = {
  beginner: "positive",
  intermediate: "accent",
  advanced: "negative",
};

const difficultyKeyMap: Record<Workout["difficulty"], string> = {
  beginner: "editor.beginner",
  intermediate: "editor.intermediate",
  advanced: "editor.advanced",
};

interface DifficultyBadgeProps {
  difficulty: Workout["difficulty"];
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { t } = useTranslation();
  return <Badge variant={variantMap[difficulty]}>{t(difficultyKeyMap[difficulty])}</Badge>;
}
