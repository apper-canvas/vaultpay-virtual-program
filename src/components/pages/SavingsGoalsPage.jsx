import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import savingsGoalService from "@/services/api/savingsGoalService";
import SavingsGoalCard from "@/components/molecules/SavingsGoalCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    targetDate: "",
    icon: "Target"
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const goalIcons = [
    { name: "Target", label: "General" },
    { name: "Home", label: "House" },
    { name: "Car", label: "Vehicle" },
    { name: "Plane", label: "Travel" },
    { name: "GraduationCap", label: "Education" },
    { name: "Heart", label: "Wedding" },
    { name: "Smartphone", label: "Gadgets" },
    { name: "Gamepad2", label: "Entertainment" }
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await savingsGoalService.getAll();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => 
      (goal.currentAmount / goal.targetAmount) >= 1
    ).length;
    const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetAmount: "",
      targetDate: "",
      icon: "Target"
    });
    setEditingGoal(null);
  };

  const handleCreateGoal = async () => {
    if (!formData.title || !formData.targetAmount || !formData.targetDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      toast.error("Target amount must be greater than 0");
      return;
    }

    const targetDate = new Date(formData.targetDate);
    if (targetDate <= new Date()) {
      toast.error("Target date must be in the future");
      return;
    }

    setIsProcessing(true);
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        monthlyContribution: 0
      };

      if (editingGoal) {
        await savingsGoalService.update(editingGoal.Id, goalData);
        toast.success("Savings goal updated successfully!");
      } else {
        await savingsGoalService.create(goalData);
        toast.success("Savings goal created successfully!");
      }

      await loadGoals();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save savings goal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContribute = async (goalId, amount) => {
    await savingsGoalService.addContribution(goalId, amount);
    await loadGoals();
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate,
      icon: goal.icon
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (goalId) => {
    try {
      await savingsGoalService.delete(goalId);
      await loadGoals();
    } catch (error) {
      toast.error("Failed to delete savings goal");
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        message="Failed to load savings goals" 
        description={error}
        onRetry={loadGoals}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy via-sky to-teal rounded-xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Savings Goals 🎯
              </h1>
              <p className="text-white/80">
                Track your progress towards financial milestones
              </p>
            </div>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              New Goal
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Goals</p>
              <p className="text-2xl font-bold">{stats.totalGoals}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold">{stats.completedGoals}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Saved</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalCurrentAmount)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Overall Progress</p>
              <p className="text-2xl font-bold">{stats.overallProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SavingsGoalCard
                goal={goal}
                onContribute={handleContribute}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Empty
          icon="Target"
          title="No Savings Goals"
          description="Create your first savings goal to start tracking your financial progress"
          actionLabel="Create Goal"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Create/Edit Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Dream Vacation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your goal"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {goalIcons.map(icon => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: icon.name }))}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1 ${
                        formData.icon === icon.name
                          ? "border-sky bg-sky/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ApperIcon 
                        name={icon.name} 
                        size={24} 
                        className={formData.icon === icon.name ? "text-sky" : "text-gray-500"} 
                      />
                      <span className={`text-xs ${
                        formData.icon === icon.name ? "text-sky" : "text-gray-600"
                      }`}>
                        {icon.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGoal}
                  variant="primary"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      {editingGoal ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsPage;