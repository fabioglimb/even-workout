import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-surface-lighter text-text-secondary",
        beginner: "bg-difficulty-beginner/20 text-difficulty-beginner",
        intermediate: "bg-difficulty-intermediate/20 text-difficulty-intermediate",
        advanced: "bg-difficulty-advanced/20 text-difficulty-advanced",
        cyan: "bg-cyan-accent/20 text-cyan-accent",
        orange: "bg-orange-accent/20 text-orange-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
