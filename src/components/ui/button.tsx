import { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-500 hover:scale-105 focus:ring-primary-500 active:scale-95 shadow-soft",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-500 hover:scale-105 focus:ring-secondary-500 active:scale-95 shadow-soft",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white hover:scale-105 focus:ring-primary-500 active:scale-95",
        ghost: "text-foreground hover:bg-background-secondary hover:scale-105 focus:ring-primary-500 active:scale-95",
      },
      size: {
        default: "px-8 py-3 text-base",
        sm: "px-6 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
