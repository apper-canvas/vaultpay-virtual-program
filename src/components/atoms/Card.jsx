import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  hover = true,
  gradient = false,
  ...props 
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return "premium-shadow-lg";
      case "outlined":
        return "border-2 border-gray-200 shadow-sm";
      case "glass":
        return "glassmorphic border border-white/20";
      case "gradient":
        return "bg-gradient-to-br from-sky/10 to-teal/10 border border-sky/20";
      default:
        return "premium-shadow bg-white";
    }
  };

  const baseStyles = "rounded-xl transition-all duration-300";
  
  const CardComponent = hover ? motion.div : "div";
  const motionProps = hover ? {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1, ease: "easeOut" }
    }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={cn(
        baseStyles,
        getVariantStyles(),
        hover && "cursor-pointer hover:shadow-xl",
        gradient && "bg-gradient-to-br from-white via-sky/5 to-teal/10",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;