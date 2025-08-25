import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import accountService from "@/services/api/accountService";
import savingsGoalService from "@/services/api/savingsGoalService";
import AccountCard from "@/components/molecules/AccountCard";
import QuickActions from "@/components/molecules/QuickActions";
import RecentTransactions from "@/components/organisms/RecentTransactions";
import BillsList from "@/components/organisms/BillsList";
import SpendingAnalytics from "@/components/organisms/SpendingAnalytics";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
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
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">This Month Spent</p>
              <p className="text-2xl font-bold">₹33,400</p>
<div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Savings Goals</p>
              <p className="text-2xl font-bold">
                {savingsProgress ? `${savingsProgress.overallProgress}%` : "0%"} Complete
              </p>
            </div>
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

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="CreditCard" size={16} className="text-sky" />
                  </div>
                  <span className="text-sm text-gray-600">Active Cards</span>
                </div>
                <span className="font-semibold text-navy">2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-warning/20 to-orange-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="FileText" size={16} className="text-warning" />
                  </div>
                  <span className="text-sm text-gray-600">Pending Bills</span>
                </div>
                <Badge variant="warning" size="small">3</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-success/20 to-green-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="TrendingUp" size={16} className="text-success" />
                  </div>
                  <span className="text-sm text-gray-600">This Month</span>
                </div>
                <span className="text-success font-semibold">+12%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;