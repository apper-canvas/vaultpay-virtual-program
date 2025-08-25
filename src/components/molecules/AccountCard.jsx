import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const AccountCard = ({ account, isMain = false, onClick, index = 0 }) => {
  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(balance);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case "Savings":
        return "PiggyBank";
      case "Current":
        return "Building2";
      case "Fixed Deposit":
        return "TrendingUp";
      default:
        return "Wallet";
    }
  };

  const getAccountGradient = (type) => {
    switch (type) {
      case "Savings":
        return "from-sky via-blue-500 to-blue-600";
      case "Current":
        return "from-teal via-green-500 to-green-600";
      case "Fixed Deposit":
        return "from-purple-500 via-purple-600 to-purple-700";
      default:
        return "from-gray-500 via-gray-600 to-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer border-0 ${
          isMain ? "premium-shadow-lg" : "premium-shadow"
        }`}
        onClick={() => onClick?.(account)}
        hover={true}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getAccountGradient(account.type)} opacity-90`}></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ApperIcon 
                  name={getAccountIcon(account.type)} 
                  size={20} 
                  className="text-white" 
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{account.type}</h3>
                <p className="text-white/80 text-sm">{account.nickname}</p>
              </div>
            </div>
            
            <Badge 
              variant={account.status === "Active" ? "success" : "secondary"}
              size="small"
              className="text-white border-white/30 bg-white/20"
            >
              {account.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Available Balance</span>
              {isMain && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ApperIcon name="Eye" size={14} className="text-white" />
                </motion.button>
              )}
            </div>
            
            <div className="gradient-text">
              <p className="text-2xl font-bold text-white">
                {formatBalance(account.balance)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs">Account Number</p>
              <p className="text-white font-mono text-sm">{account.accountNumber}</p>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ApperIcon name="ArrowUpRight" size={16} className="text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ApperIcon name="MoreVertical" size={16} className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AccountCard;