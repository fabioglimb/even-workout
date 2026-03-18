import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent disabled:opacity-50 disabled:pointer-events-none rounded-sm",
  {
    variants: {
      variant: {
        primary: "bg-cyan-accent text-black hover:bg-cyan-accent-dark",
        secondary: "bg-surface-light text-text-primary hover:bg-surface-lighter",
        orange: "bg-orange-accent text-black hover:bg-orange-accent-dark",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-light",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
