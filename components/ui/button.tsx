import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const primaryStyles =
  "bg-primary text-primary-foreground shadow-[0_12px_28px_-16px_rgba(27,42,94,0.9)] hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-[0_16px_34px_-18px_rgba(27,42,94,0.95)] active:translate-y-0";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-heading text-sm font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: primaryStyles,
        primary: primaryStyles,
        secondary:
          "bg-accent text-accent-foreground shadow-[0_12px_28px_-16px_rgba(232,93,44,0.9)] hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-[0_16px_34px_-18px_rgba(232,93,44,0.95)] active:translate-y-0",
        outline:
          "border border-primary/20 bg-transparent text-primary hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary-50 dark:border-primary-200/25 dark:text-primary-100 dark:hover:bg-white/10",
        ghost:
          "text-primary hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-0.5 hover:bg-destructive/90",
        link: "rounded-none px-0 text-primary underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-100 dark:hover:text-accent-300",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
