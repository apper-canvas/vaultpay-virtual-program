import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const inputId = React.useId();

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-navy"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-3 border-2 border-gray-200 rounded-lg",
            "focus:border-sky focus:ring-4 focus:ring-sky/10 focus:outline-none",
            "transition-all duration-200",
            "placeholder:text-gray-500",
            "bg-white text-navy font-medium",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-error focus:border-error focus:ring-error/10",
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-600">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;