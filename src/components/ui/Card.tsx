import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { HTMLAttributes } from "react";

const cardVariants = cva("rounded-sm border border-surface-lighter", {
  variants: {
    variant: {
      default: "bg-surface",
      elevated: "bg-surface-light",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}
