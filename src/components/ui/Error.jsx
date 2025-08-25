import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  description = "Please try again or contact support if the problem persists.",
  onRetry,
  type = "default"
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "payment":
        return "CreditCard";
      case "authentication":
        return "Lock";
      default:
        return "AlertTriangle";
    }
  };

  return (
    <motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
    <motion.div
        initial={{
            scale: 0
        }}
        animate={{
            scale: 1
        }}
        transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10
        }}
        className="w-16 h-16 bg-gradient-to-br from-error to-red-400 rounded-full flex items-center justify-center mb-6 premium-shadow-lg">
        <ApperIcon name={getErrorIcon()} size={32} className="text-white" />
    </motion.div>
    <motion.div
        initial={{
            opacity: 0,
            y: 10
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            delay: 0.3
        }}
        className="space-y-4 max-w-md">
        <h3 className="text-xl font-bold text-navy">{message}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        {onRetry && <motion.button
            whileHover={{
                scale: 1.05
            }}
            whileTap={{
                scale: 0.95
            }}
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky to-teal text-white font-semibold rounded-lg premium-shadow hover:shadow-lg transition-all duration-200 space-x-2">
            <ApperIcon name="RotateCcw" size={16} />
            <span>Try Again</span>
        </motion.button>}
    </motion.div>
    <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        transition={{
            delay: 0.5
        }}
        className="mt-8 text-sm text-gray-500"
        className="mt-8 text-sm text-gray-500">
        <p>Need help? Our AI assistant is here 24/7</p>
        <button
            className="text-sky hover:text-teal transition-colors duration-200 font-medium">Start AI Chat
                    </button>
    </motion.div></motion.div>
  );
};

export default Error;