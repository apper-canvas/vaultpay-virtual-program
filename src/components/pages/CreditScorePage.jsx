import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import creditScoreService from "@/services/api/creditScoreService";

const CreditScorePage = () => {
  const [creditData, setCreditData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCreditData();
  }, []);

  const loadCreditData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [data, history] = await Promise.all([
        creditScoreService.getCurrentScore(),
        creditScoreService.getScoreHistory()
      ]);
      
      setCreditData(data);
      setScoreHistory(history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshScore = async () => {
    try {
      setRefreshing(true);
      const updatedData = await creditScoreService.refreshScore();
      setCreditData(updatedData);
      toast.success("Credit score refreshed successfully!");
    } catch (err) {
      toast.error("Failed to refresh credit score");
    } finally {
      setRefreshing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 750) return "from-green-500 to-emerald-600";
    if (score >= 650) return "from-yellow-500 to-orange-500";
    if (score >= 550) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  const getScoreGrade = (score) => {
    if (score >= 750) return { grade: "Excellent", color: "success" };
    if (score >= 650) return { grade: "Good", color: "warning" };
    if (score >= 550) return { grade: "Fair", color: "warning" };
    return { grade: "Poor", color: "error" };
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
        message="Failed to load credit score" 
        description={error}
        onRetry={loadCreditData}
      />
    );
  }

  const scoreGrade = getScoreGrade(creditData.currentScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Credit Score</h1>
        <p className="text-gray-600 mt-1">Monitor and improve your creditworthiness</p>
      </div>

      {/* Current Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-navy via-sky to-teal text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Credit Score</h2>
                <p className="text-white/80">Last updated: {new Date(creditData.lastUpdated).toLocaleDateString()}</p>
              </div>
              
              <Button
                onClick={handleRefreshScore}
                loading={refreshing}
                variant="ghost"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-48 h-48 mb-4">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 144 144">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="transparent"
                      stroke="white"
                      strokeWidth="8"
                      strokeDasharray={`${(creditData.currentScore / 850) * 377} 377`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold">{creditData.currentScore}</div>
                    <div className="text-sm text-white/80">out of 850</div>
                  </div>
                </div>
                
                <Badge 
                  variant={scoreGrade.color} 
                  className="text-lg px-4 py-2 bg-white/20 text-white border-white/30"
                >
                  {scoreGrade.grade}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <ApperIcon name="TrendingUp" size={16} className="text-green-400" />
                      <span className="text-sm text-white/80">Change</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      +{creditData.monthlyChange}
                    </div>
                    <div className="text-xs text-white/60">This month</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <ApperIcon name="Calendar" size={16} className="text-blue-400" />
                      <span className="text-sm text-white/80">Next Update</span>
                    </div>
                    <div className="text-xl font-bold text-blue-400">
                      {creditData.nextUpdateDays}
                    </div>
                    <div className="text-xs text-white/60">Days</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Credit Utilization</span>
                    <span className="text-sm font-semibold">{creditData.utilization}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${creditData.utilization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Payment History</span>
                    <span className="text-sm font-semibold">{creditData.paymentHistory}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${creditData.paymentHistory}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Score Factors */}
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <ApperIcon name="BarChart3" size={20} className="text-sky" />
            <h3 className="text-xl font-bold text-navy">Score Factors</h3>
          </div>

          <div className="space-y-4">
            {creditData.factors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${factor.color} flex items-center justify-center`}>
                    <ApperIcon name={factor.icon} size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">{factor.name}</h4>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-navy">{factor.score}%</div>
                  <div className={`text-sm ${
                    factor.impact === 'positive' ? 'text-success' : 
                    factor.impact === 'negative' ? 'text-error' : 'text-gray-500'
                  }`}>
                    {factor.impact === 'positive' ? 'Good' : 
                     factor.impact === 'negative' ? 'Needs Attention' : 'Neutral'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Credit Report */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="FileText" size={20} className="text-teal" />
              <h3 className="text-lg font-bold text-navy">Credit Report</h3>
            </div>
            <Badge variant="info" size="small">Free</Badge>
          </div>

          <div className="space-y-4">
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <ApperIcon name="Download" size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-3">
                Get your detailed credit report
              </p>
              <Button variant="outline" size="small">
                Download Report
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Accounts</span>
                <span className="font-semibold text-navy">{creditData.activeAccounts}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Credit Limit</span>
                <span className="font-semibold text-navy">₹{creditData.totalCreditLimit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Credit Age</span>
                <span className="font-semibold text-navy">{creditData.creditAge} years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hard Inquiries</span>
                <span className="font-semibold text-navy">{creditData.hardInquiries}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Score History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" size={20} className="text-success" />
            <h3 className="text-xl font-bold text-navy">Score History</h3>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="small">6M</Button>
            <Button variant="ghost" size="small">1Y</Button>
            <Button variant="outline" size="small">All</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {scoreHistory.slice(-6).map((entry, index) => (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-xs text-gray-500 mb-2">
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-2xl font-bold text-navy mb-1">{entry.score}</div>
              <div className={`text-xs font-medium ${
                entry.change > 0 ? 'text-success' : 
                entry.change < 0 ? 'text-error' : 'text-gray-500'
              }`}>
                {entry.change > 0 ? '+' : ''}{entry.change}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Improvement Tips */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ApperIcon name="Lightbulb" size={20} className="text-warning" />
          <h3 className="text-xl font-bold text-navy">Improvement Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creditData.improvementTips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-sky/5 to-teal/5 rounded-lg border border-sky/20"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${tip.color} flex items-center justify-center flex-shrink-0`}>
                  <ApperIcon name={tip.icon} size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="small">
                      +{tip.impact} points
                    </Badge>
                    <span className="text-xs text-gray-500">{tip.timeframe}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Credit Monitoring */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Shield" size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy mb-1">Credit Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Get alerts for changes to your credit score and report
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="success" className="mb-2">Premium Feature</Badge>
            <div>
              <Button>
                Enable Monitoring
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-purple-200">
          <div className="text-center">
            <ApperIcon name="Bell" size={24} className="text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-navy text-sm">Real-time Alerts</h4>
            <p className="text-xs text-gray-600">Instant notifications</p>
          </div>
          <div className="text-center">
            <ApperIcon name="Eye" size={24} className="text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-navy text-sm">Identity Protection</h4>
            <p className="text-xs text-gray-600">Fraud monitoring</p>
          </div>
          <div className="text-center">
            <ApperIcon name="Smartphone" size={24} className="text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-navy text-sm">Mobile Access</h4>
            <p className="text-xs text-gray-600">Anytime, anywhere</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreditScorePage;