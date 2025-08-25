import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item.",
  actionText = "Get Started",
  onAction,
  icon = "Plus",
  type = "default"
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "transactions":
        return {
          icon: "Receipt",
          title: "No transactions found",
          description: "Your transaction history will appear here once you start making payments.",
          actionText: "Make a Payment"
        };
      case "beneficiaries":
        return {
          icon: "Users",
          title: "No beneficiaries added",
          description: "Add beneficiaries to make quick and easy money transfers.",
          actionText: "Add Beneficiary"
        };
      case "cards":
        return {
          icon: "CreditCard",
          title: "No cards found",
          description: "Your cards will be displayed here. Contact support to add cards.",
          actionText: "Contact Support"
        };
      case "bills":
        return {
          icon: "FileText",
          title: "No bills to pay",
          description: "Your upcoming bills will be shown here. Add billers to get started.",
          actionText: "Add Biller"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          actionText: "Clear Filters"
        };
      default:
        return { icon, title, description, actionText };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 10 }}
        className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 float-animation"
      >
        <ApperIcon name={config.icon} size={36} className="text-gray-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-bold text-navy">{config.title}</h3>
        <p className="text-gray-600 leading-relaxed">{config.description}</p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky to-teal text-white font-semibold rounded-lg premium-shadow hover:shadow-lg transition-all duration-200 space-x-2 mt-6"
          >
            <ApperIcon name={config.icon} size={16} />
            <span>{config.actionText}</span>
          </motion.button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid grid-cols-3 gap-4 text-center max-w-xs opacity-50"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded"></div>
            <div className="w-3/4 h-2 bg-gray-100 rounded mx-auto"></div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Empty;