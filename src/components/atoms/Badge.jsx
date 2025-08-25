import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "medium",
  children, 
  ...props 
}, ref) => {
const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20";
      case "error":
        return "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20";
      case "warning":
        return "bg-gradient-to-r from-warning/10 to-orange-100 text-warning border border-warning/20";
      case "info":
        return "bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20";
      case "secondary":
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300";
      case "outline":
        return "border-2 border-sky text-sky bg-transparent";
case "premium":
        return "bg-gradient-to-r from-sky/10 to-teal/10 text-navy border border-sky/30 premium-shadow";
      case "completed":
        return "bg-gradient-to-r from-success/20 to-green-200 text-success border border-success/30";
      case "almost":
        return "bg-gradient-to-r from-info/20 to-blue-200 text-info border border-info/30";
      case "progress":
        return "bg-gradient-to-r from-warning/20 to-orange-200 text-warning border border-warning/30";
      case "budget-alert":
        return "bg-gradient-to-r from-error/20 to-red-200 text-error border border-error/30 animate-pulse";
      case "budget-warning":
        return "bg-gradient-to-r from-warning/20 to-orange-200 text-warning border border-warning/30";
      case "budget-safe":
        return "bg-gradient-to-r from-success/20 to-green-200 text-success border border-success/30";
      default:
        return "bg-gradient-to-r from-sky/10 to-teal/10 text-sky border border-sky/20";
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-2 py-1 text-xs";
      case "medium":
        return "px-3 py-1 text-sm";
      case "large":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1 text-sm";
    }
  };

  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap transition-all duration-200";

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;