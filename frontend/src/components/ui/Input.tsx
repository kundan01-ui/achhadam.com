import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  "w-full px-4 py-3 border-2 rounded-agricultural transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gray-200 focus:border-primary-green focus:ring-primary-green focus:ring-opacity-20",
        error: "border-error focus:border-error focus:ring-error focus:ring-opacity-20",
        success: "border-success focus:border-success focus:ring-success focus:ring-opacity-20",
        warning: "border-warning focus:border-warning focus:ring-warning focus:ring-opacity-20",
      },
      size: {
        sm: "px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm",
        md: "px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base",
        lg: "px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: true,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={cn("form-group", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: error ? "error" : variant, size, fullWidth, className }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-text-light mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };

