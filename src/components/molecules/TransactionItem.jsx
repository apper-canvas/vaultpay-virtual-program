import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TransactionItem = ({ transaction, onClick, index = 0 }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      "Food & Dining": "UtensilsCrossed",
      "Transportation": "Car",
      "Shopping": "ShoppingBag",
      "Utilities": "Zap",
      "Healthcare": "Heart",
      "Entertainment": "Play",
      "Salary": "Briefcase",
      "Business": "Building2",
      "ATM": "Banknote"
    };
    return icons[category] || "CircleDot";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "secondary";
    }
  };

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group"
      onClick={() => onClick?.(transaction)}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
        transaction.amount < 0 
          ? "bg-gradient-to-br from-error/10 to-red-100" 
          : "bg-gradient-to-br from-success/10 to-green-100"
      }`}>
        <ApperIcon 
          name={getCategoryIcon(transaction.category)} 
          size={20} 
          className={transaction.amount < 0 ? "text-error" : "text-success"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-navy truncate group-hover:text-sky transition-colors">
            {transaction.merchant}
          </h4>
          <span className={`font-bold ${
            transaction.amount < 0 ? "text-error" : "text-success"
          }`}>
            {formatAmount(transaction.amount)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              {transaction.description}
            </span>
            {transaction.category && (
              <Badge variant="secondary" size="small">
                {transaction.category}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">
              {format(new Date(transaction.date), "MMM dd")}
            </span>
            <Badge variant={getStatusColor(transaction.status)} size="small">
              {transaction.status}
            </Badge>
          </div>
        </div>
      </div>

      <ApperIcon 
        name="ChevronRight" 
        size={16} 
        className="text-gray-400 ml-2 group-hover:text-sky transition-colors" 
      />
    </motion.div>
  );
};

export default TransactionItem;