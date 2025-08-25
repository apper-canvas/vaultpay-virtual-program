import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import analyticsService from "@/services/api/analyticsService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const BudgetProgress = ({ showHeader = true, limit = null, compact = false }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await analyticsService.getBudgetProgress();
      setBudgetData(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percentage, isOverBudget) => {
    if (isOverBudget) return "from-error to-red-500";
    if (percentage >= 90) return "from-warning to-orange-500";
    if (percentage >= 75) return "from-yellow-400 to-orange-400";
    return "from-success to-green-500";
  };

  const getBudgetStatus = (percentage, isOverBudget) => {
    if (isOverBudget) return { text: "Over Budget", variant: "error" };
    if (percentage >= 90) return { text: "Critical", variant: "warning" };
    if (percentage >= 75) return { text: "High Usage", variant: "warning" };
    return { text: "On Track", variant: "success" };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Food & Dining": "UtensilsCrossed",
      "Transportation": "Car",
      "Shopping": "ShoppingBag",
      "Utilities": "Zap",
      "Healthcare": "Heart"
    };
    return icons[category] || "CircleDot";
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !budgetData) {
    return (
      <Card className="p-6">
        <div className="text-center py-4">
          <ApperIcon name="AlertTriangle" size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Unable to load budget data</p>
          <Button variant="ghost" size="small" onClick={loadBudgetData} className="mt-2">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const categoriesToShow = limit ? budgetData.categories.slice(0, limit) : budgetData.categories;
  const overBudgetCategories = budgetData.categories.filter(cat => cat.isOverBudget).length;
  const criticalCategories = budgetData.categories.filter(cat => !cat.isOverBudget && (cat.amount / cat.budget * 100) >= 90).length;

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" size={24} className="text-navy" />
            <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-navy`}>
              Budget Progress
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {overBudgetCategories > 0 && (
              <Badge variant="error" size="small">
                {overBudgetCategories} Over Budget
              </Badge>
            )}
            {criticalCategories > 0 && (
              <Badge variant="warning" size="small">
                {criticalCategories} Critical
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Overall Budget Summary */}
      {!compact && (
        <div className="bg-gradient-to-r from-sky/5 to-teal/5 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-lg font-bold text-navy">{formatAmount(budgetData.totalBudget)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-lg font-bold text-navy">{formatAmount(budgetData.totalSpent)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className={`text-lg font-bold ${budgetData.remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
                {formatAmount(Math.abs(budgetData.remainingBudget))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Usage</p>
              <Badge 
                variant={budgetData.budgetUsed > 100 ? "error" : budgetData.budgetUsed > 90 ? "warning" : "success"}
                size="small"
              >
                {budgetData.budgetUsed.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Category Progress Bars */}
      <div className="space-y-4">
        {categoriesToShow.map((category, index) => {
          const percentage = (category.amount / category.budget * 100);
          const status = getBudgetStatus(percentage, category.isOverBudget);
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                category.isOverBudget 
                  ? 'border-error/30 bg-error/5' 
                  : percentage >= 90
                  ? 'border-warning/30 bg-warning/5'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    category.isOverBudget 
                      ? 'bg-gradient-to-br from-error/20 to-red-200' 
                      : 'bg-gradient-to-br from-sky/20 to-teal/20'
                  }`}>
                    <ApperIcon 
                      name={getCategoryIcon(category.name)} 
                      size={20} 
                      className={category.isOverBudget ? "text-error" : "text-sky"} 
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">{category.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatAmount(category.amount)} of {formatAmount(category.budget)}
                    </p>
                  </div>
                </div>
                
                <Badge variant={status.variant} size="small">
                  {status.text}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(percentage, category.isOverBudget)} transition-all duration-1000`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                  />
                  {category.isOverBudget && (
                    <motion.div
                      className="h-full bg-gradient-to-r from-error/60 to-red-400/60 absolute"
                      initial={{ width: "100%" }}
                      animate={{ width: `${percentage - 100}%` }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                      style={{ marginLeft: '100%', marginTop: '-12px' }}
                    />
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                  <span>0%</span>
                  <span className={`font-semibold ${
                    category.isOverBudget ? 'text-error' : 
                    percentage >= 90 ? 'text-warning' : 'text-navy'
                  }`}>
                    {percentage.toFixed(1)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Alert Messages */}
              {(category.isOverBudget || percentage >= 75) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    category.isOverBudget 
                      ? 'bg-error/10 text-error' 
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  <ApperIcon 
                    name={category.isOverBudget ? "AlertTriangle" : "AlertCircle"} 
                    size={16} 
                  />
                  <p className="text-sm font-medium">
                    {category.isOverBudget 
                      ? `Exceeded budget by ${formatAmount(category.amount - category.budget)}`
                      : `Approaching budget limit - ${formatAmount(category.budget - category.amount)} remaining`
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {!compact && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="small" className="flex items-center space-x-2">
              <ApperIcon name="Settings" size={16} />
              <span>Adjust Budgets</span>
            </Button>
            <Button variant="ghost" size="small" className="flex items-center space-x-2">
              <ApperIcon name="TrendingDown" size={16} />
              <span>Spending Tips</span>
            </Button>
            <Button variant="ghost" size="small" className="flex items-center space-x-2">
              <ApperIcon name="Bell" size={16} />
              <span>Set Alerts</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BudgetProgress;