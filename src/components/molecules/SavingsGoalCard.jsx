import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SavingsGoalCard = ({ 
  goal, 
  onContribute, 
  onEdit, 
  onDelete,
  className,
  ...props 
}) => {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const isCompleted = progressPercentage >= 100;
  
  // Calculate estimated completion based on average monthly contribution
  const averageMonthlyContribution = goal.monthlyContribution || (goal.currentAmount / 6); // Assume 6 months of contributions
  const monthsRemaining = averageMonthlyContribution > 0 ? Math.ceil(remainingAmount / averageMonthlyContribution) : 0;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusVariant = () => {
    if (isCompleted) return "success";
    if (progressPercentage >= 75) return "info";
    if (progressPercentage >= 50) return "warning";
    return "secondary";
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (progressPercentage >= 75) return "Almost There";
    if (progressPercentage >= 50) return "On Track";
    return "Getting Started";
  };

  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    const amount = parseFloat(contributionAmount);
    if (amount > remainingAmount) {
      toast.error("Contribution amount exceeds remaining goal amount");
      return;
    }

    setIsProcessing(true);
    try {
      await onContribute(goal.Id, amount);
      setContributionAmount("");
      setShowContributeModal(false);
      toast.success(`₹${amount.toLocaleString()} contributed successfully!`);
    } catch (error) {
      toast.error("Failed to process contribution");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`)) {
      onDelete(goal.Id);
      toast.success("Savings goal deleted successfully");
    }
  };

  return (
    <>
      <Card 
        className={cn("p-6 hover:shadow-xl transition-all duration-300", className)}
        {...props}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isCompleted 
                  ? "bg-gradient-to-br from-success/20 to-green-200" 
                  : "bg-gradient-to-br from-sky/20 to-teal/20"
              )}>
                <ApperIcon 
                  name={goal.icon || "Target"} 
                  size={24} 
                  className={isCompleted ? "text-success" : "text-sky"} 
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy line-clamp-1">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant()} size="small">
                {getStatusText()}
              </Badge>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(goal)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Goal"
                >
                  <ApperIcon name="Edit2" size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Goal"
                >
                  <ApperIcon name="Trash2" size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-navy">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isCompleted
                    ? "bg-gradient-to-r from-success to-green-500"
                    : "bg-gradient-to-r from-sky to-teal"
                )}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {formatCurrency(goal.currentAmount)} saved
              </span>
              <span className="font-semibold text-navy">
                {formatCurrency(goal.targetAmount)} goal
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-lg font-bold text-navy">
                {isCompleted ? "₹0" : formatCurrency(remainingAmount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Target Date</p>
              <p className="text-lg font-bold text-navy">
                {formatDate(goal.targetDate)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isCompleted && (
            <div className="flex items-center space-x-3 pt-2">
              <Button
                onClick={() => setShowContributeModal(true)}
                className="flex-1"
                variant="primary"
                size="small"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Contribute
              </Button>
              <Button
                onClick={() => onEdit(goal)}
                variant="outline"
                size="small"
              >
                <ApperIcon name="Settings" size={16} />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Contribution Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">Add Contribution</h3>
              <button
                onClick={() => setShowContributeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                    max={remainingAmount}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Remaining: {formatCurrency(remainingAmount)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowContributeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContribute}
                  variant="primary"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Contribution"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SavingsGoalCard;