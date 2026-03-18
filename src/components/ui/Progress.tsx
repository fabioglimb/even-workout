import { cn } from "../../utils/cn";
import type { HTMLAttributes } from "react";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: "cyan" | "orange";
}

export function Progress({ value, color = "cyan", className, ...props }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 1);
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-lighter", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          color === "cyan" ? "bg-cyan-accent" : "bg-orange-accent"
        )}
        style={{ width: `${clampedValue * 100}%` }}
      />
    </div>
  );
}
