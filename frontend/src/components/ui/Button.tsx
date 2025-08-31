import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-agricultural font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-green hover:bg-secondary-green text-white shadow-agricultural hover:shadow-card-hover focus:ring-primary-green",
        secondary: "bg-white hover:bg-neutral-gray text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-white",
        outline: "bg-transparent hover:bg-primary-green text-primary-green hover:text-white border-2 border-primary-green",
        ghost: "bg-transparent hover:bg-neutral-gray text-text-dark hover:text-primary-green",
        danger: "bg-error hover:bg-red-600 text-white shadow-agricultural hover:shadow-card-hover focus:ring-error",
        success: "bg-success hover:bg-green-600 text-white shadow-agricultural hover:shadow-card-hover focus:ring-success",
      },
      size: {
        sm: "h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
        md: "h-9 sm:h-10 px-3 sm:px-4 py-2 text-sm sm:text-base",
        lg: "h-10 sm:h-11 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg",
        xl: "h-11 sm:h-12 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

