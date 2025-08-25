import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  children, 
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-sky to-teal text-white shadow-lg hover:shadow-xl hover:scale-[1.02]";
      case "secondary":
        return "bg-white text-navy border-2 border-gray-200 hover:border-sky hover:text-sky shadow-md hover:shadow-lg";
      case "outline":
        return "border-2 border-sky text-sky bg-transparent hover:bg-sky hover:text-white";
      case "ghost":
        return "text-navy hover:bg-gray-100 hover:text-sky";
      case "danger":
        return "bg-gradient-to-r from-error to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]";
case "success":
        return "bg-gradient-to-r from-success to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]";
      case "budget-alert":
        return "bg-gradient-to-r from-error to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] animate-pulse";
      default:
        return "bg-gradient-to-r from-sky to-teal text-white shadow-lg hover:shadow-xl hover:scale-[1.02]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-3 py-2 text-sm rounded-lg";
      case "medium":
        return "px-6 py-3 text-base rounded-lg";
      case "large":
        return "px-8 py-4 text-lg rounded-xl";
      case "icon":
        return "p-2 rounded-lg";
      default:
        return "px-6 py-3 text-base rounded-lg";
    }
  };

  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sky/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={cn(
        baseStyles,
        getVariantStyles(),
        getSizeStyles(),
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;