import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import AccountCard from "@/components/molecules/AccountCard";
import QuickActions from "@/components/molecules/QuickActions";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import BillsList from "@/components/organisms/BillsList";
import SpendingAnalytics from "@/components/organisms/SpendingAnalytics";
import RecentTransactions from "@/components/organisms/RecentTransactions";
import BudgetProgress from "@/components/molecules/BudgetProgress";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import accountService from "@/services/api/accountService";
import savingsGoalService from "@/services/api/savingsGoalService";
const HomePage = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [accountsData, totalData, savingsData] = await Promise.all([
        accountService.getAll(),
        accountService.getTotalBalance(),
        savingsGoalService.getProgressSummary()
      ]);
      
      setAccounts(accountsData);
      setTotalBalance(totalData);
      setSavingsProgress(savingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(balance);
  };

  const handleAccountClick = (account) => {
    console.log("Account clicked:", account);
  };

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
        message="Failed to load dashboard" 
        description={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy via-sky to-teal rounded-xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold mb-2">
                Good Morning, John! 👋
              </h1>
              <p className="text-white/80">
                Welcome back to your financial dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <ApperIcon name="Bell" size={20} className="text-white" />
              </button>
              <Badge variant="success" className="bg-white/20 text-white border-white/30">
                All Systems Good
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold">{formatBalance(totalBalance)}</p>
            </div>
<div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors" onClick={() => window.location.href = '/credit-score'}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/80 text-sm">Credit Score</p>
                <ApperIcon name="TrendingUp" size={16} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">742</p>
              <div className="flex items-center space-x-1 mt-1">
                <Badge variant="success" className="text-xs px-2 py-0.5 bg-green-400/20 text-green-400 border-green-400/30">
                  Excellent
                </Badge>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Savings Goals</p>
              <p className="text-2xl font-bold">
                {savingsProgress ? `${savingsProgress.overallProgress}%` : "0%"} Complete
              </p>
</div>
          </div>
        </div>
      </motion.div>

      {/* Account Cards */}
      <div>
        <h2 className="text-xl font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="Wallet" size={24} className="mr-2" />
          Your Accounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <AccountCard
              key={account.Id}
              account={account}
              isMain={account.type === "Savings"}
              onClick={handleAccountClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="Zap" size={24} className="mr-2" />
          Quick Actions
        </h2>
        <QuickActions />
      </div>

{/* Budget Progress */}
      <div>
        <h2 className="text-xl font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="Target" size={24} className="mr-2" />
          Budget Overview
        </h2>
        <BudgetProgress compact={true} limit={3} />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RecentTransactions limit={5} />
          
          <SpendingAnalytics showInsights={true} />
        </div>

        <div className="space-y-6">
          <BillsList showDueOnly={true} limit={4} />
{/* Savings Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Target" size={20} className="text-success" />
                <h3 className="text-lg font-bold text-navy">Savings Overview</h3>
              </div>
              <button
                onClick={() => window.location.href = '/savings-goals'}
                className="text-sky hover:text-sky/80 text-sm font-medium"
              >
                View All Goals →
              </button>
            </div>
            
            <div className="space-y-4">
              {savingsProgress ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Goals</span>
                    <span className="font-semibold text-navy">{savingsProgress.totalGoals}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-success to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(savingsProgress.overallProgress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatBalance(savingsProgress.totalCurrentAmount)} saved
                    </span>
                    <span className="text-success font-semibold">
                      {savingsProgress.overallProgress}% complete
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Completed Goals</span>
                    <Badge variant="success" size="small">
                      {savingsProgress.completedGoals}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Target" size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No savings goals yet</p>
                  <button 
                    onClick={() => window.location.href = '/savings-goals'}
                    className="text-sky hover:text-sky/80 text-sm font-medium mt-2"
                  >
                    Create your first goal
                  </button>
                </div>
              )}
            </div>
          </Card>

{/* AI Chat Support */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-teal/5 border-sky/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="MessageCircle" size={20} className="text-sky" />
                <h3 className="text-lg font-bold text-navy">AI Support</h3>
              </div>
              <Badge variant="success" size="small" className="bg-green-100 text-green-700">
                24/7 Online
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Bot" size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      "Hi! I can help you with account balance, transfers, bill payments, and more. Chat with me anytime!"
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Globe" size={12} />
                        <span>Multilingual</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Users" size={12} />
                        <span>Human Handoff</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Instant responses</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-sky rounded-full"></div>
                  <span>Banking expertise</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-teal rounded-full"></div>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Always available</span>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 pt-2 border-t border-gray-200">
                Click the chat button to get started →
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;