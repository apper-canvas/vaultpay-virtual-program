import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SpendingAnalytics from "@/components/organisms/SpendingAnalytics";
import analyticsService from "@/services/api/analyticsService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const AnalyticsPage = () => {
  const [budgetAnalytics, setBudgetAnalytics] = useState(null);
  const [savingsProgress, setSavingsProgress] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [budgetData, savingsData, insightsData] = await Promise.all([
        analyticsService.getBudgetAnalytics(),
        analyticsService.getSavingsProgress(),
        analyticsService.getInsights()
      ]);
      
      setBudgetAnalytics(budgetData);
      setSavingsProgress(savingsData);
      setInsights(insightsData);
      
      toast.success("Analytics data loaded successfully");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load analytics data");
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

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 75) return "warning";
    return "success";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message="Failed to load analytics" 
          description={error}
          onRetry={loadAnalyticsData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">Analytics & Insights</h1>
              <p className="text-gray-600">Comprehensive view of your financial health</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === "overview"
                    ? "bg-sky text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView("detailed")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === "detailed"
                    ? "bg-sky text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        {activeView === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-navy">
                      {budgetAnalytics && formatAmount(budgetAnalytics.totalBudget)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="Target" size={24} className="text-sky" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-navy">
                      {budgetAnalytics && formatAmount(budgetAnalytics.totalSpent)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-error/20 to-red-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="TrendingDown" size={24} className="text-error" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget Used</p>
                    <p className="text-2xl font-bold text-navy">
                      {budgetAnalytics && budgetAnalytics.budgetUsed}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-orange-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="PieChart" size={24} className="text-warning" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Savings Progress</p>
                    <p className="text-2xl font-bold text-navy">
                      {savingsProgress && savingsProgress.progressPercentage}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-green-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="TrendingUp" size={24} className="text-success" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Budget Alerts */}
            {budgetAnalytics && (budgetAnalytics.alertsCount > 0 || budgetAnalytics.warningsCount > 0) && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
                  <h3 className="text-lg font-bold text-navy">Budget Alerts</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgetAnalytics.alertsCount > 0 && (
                    <div className="bg-gradient-to-r from-error/10 to-red-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="AlertCircle" size={16} className="text-error" />
                        <span className="font-semibold text-error">
                          {budgetAnalytics.alertsCount} Over Budget
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Categories exceeding their allocated budgets
                      </p>
                    </div>
                  )}
                  
                  {budgetAnalytics.warningsCount > 0 && (
                    <div className="bg-gradient-to-r from-warning/10 to-orange-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="AlertTriangle" size={16} className="text-warning" />
                        <span className="font-semibold text-warning">
                          {budgetAnalytics.warningsCount} Near Limit
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Categories approaching their budget limits
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Smart Insights */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Sparkles" size={20} className="text-sky" />
                <h3 className="text-lg font-bold text-navy">Smart Insights</h3>
              </div>
              
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gradient-to-r from-sky/5 to-teal/5 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-sky to-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ApperIcon name="Lightbulb" size={12} className="text-white" />
                    </div>
                    <p className="text-sm text-navy">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Savings Progress */}
            {savingsProgress && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ApperIcon name="Target" size={20} className="text-success" />
                  <h3 className="text-lg font-bold text-navy">Savings Progress</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Monthly Goal</p>
                    <p className="text-xl font-bold text-navy">
                      {formatAmount(savingsProgress.monthlyTarget)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Saved This Month</p>
                    <p className="text-xl font-bold text-success">
                      {formatAmount(savingsProgress.savedThisMonth)}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Progress</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-xl font-bold text-navy">{savingsProgress.progressPercentage}%</p>
                      <Badge variant={getProgressColor(parseFloat(savingsProgress.progressPercentage))}>
                        {parseFloat(savingsProgress.progressPercentage) >= 100 ? "Complete" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 bg-gradient-to-r from-success to-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(parseFloat(savingsProgress.progressPercentage), 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {activeView === "detailed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SpendingAnalytics showInsights={true} />
            
            {budgetAnalytics && (
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <ApperIcon name="BarChart3" size={24} className="text-navy" />
                  <h2 className="text-xl font-bold text-navy">Budget Recommendations</h2>
                </div>
                
                <div className="space-y-3">
                  {budgetAnalytics.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-gradient-to-r from-navy/5 to-sky/5 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-navy to-sky rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ApperIcon name="CheckCircle" size={12} className="text-white" />
                      </div>
                      <p className="text-sm text-navy">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;