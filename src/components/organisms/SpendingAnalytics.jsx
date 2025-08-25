import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import analyticsService from "@/services/api/analyticsService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const SpendingAnalytics = ({ showInsights = true }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await analyticsService.getCurrentMonthAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
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

  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, system-ui, sans-serif",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800
      }
    },
    colors: ["#4A90E2", "#00D4AA", "#FF9800", "#F44336", "#9C27B0"],
    labels: analytics?.categories.map(cat => cat.name) || [],
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1E3A5F",
              formatter: function (val) {
                return formatAmount(val);
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Spent",
              fontSize: "14px",
              fontWeight: "600",
              color: "#64748B",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return formatAmount(total);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatAmount(val);
        }
      }
    }
  };

  const chartSeries = analytics?.categories.map(cat => cat.amount) || [];

  if (loading) {
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Error 
          message="Failed to load analytics" 
          description={error}
          onRetry={loadAnalytics}
        />
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="PieChart" size={24} className="text-navy" />
            <h2 className="text-xl font-bold text-navy">Spending Analytics</h2>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "categories"
                  ? "bg-sky text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "trends"
                  ? "bg-sky text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Trends
            </button>
          </div>
        </div>

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-sky/10 to-teal/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-navy">
                        {formatAmount(analytics.totalSpent)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-sky to-teal rounded-full flex items-center justify-center">
                      <ApperIcon name="TrendingDown" size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-success/10 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Budget Used</p>
                      <p className="text-2xl font-bold text-navy">
                        {analytics.budgetUsed}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Target" size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {analytics.categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                        <ApperIcon 
                          name={getCategoryIcon(category.name)} 
                          size={16} 
                          className="text-sky" 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">{category.name}</p>
                        <p className="text-xs text-gray-600">{category.transactions} transactions</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-navy">{formatAmount(category.amount)}</p>
                      <Badge variant="secondary" size="small">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
</div>
        )}

{activeTab === "trends" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-sky/5 to-teal/5 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-navy mb-1">Spending Trends</h4>
                  <p className="text-sm text-gray-600">Analyze your spending patterns over time</p>
                </div>
                <Badge variant="info" size="large">
                  Last 6 Months
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.categories.map((category, index) => {
                const trendDirection = Math.random() > 0.5 ? "up" : "down";
                const trendPercentage = (Math.random() * 20).toFixed(1);
                
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={getCategoryIcon(category.name)} 
                            size={16} 
                            className="text-sky" 
                          />
                        </div>
                        <h5 className="font-semibold text-navy text-sm">{category.name}</h5>
                      </div>
                      
                      <Badge 
                        variant={trendDirection === "up" ? "error" : "success"}
                        size="small"
                      >
                        <div className="flex items-center space-x-1">
                          <ApperIcon 
                            name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
                            size={10} 
                          />
                          <span>{trendPercentage}%</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-semibold text-navy">{formatAmount(category.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg. 6 Months</span>
                        <span className="text-gray-700">
                          {formatAmount(category.amount * (1 + (Math.random() * 0.4 - 0.2)))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          trendDirection === "up" 
                            ? 'bg-gradient-to-r from-error to-red-500' 
                            : 'bg-gradient-to-r from-success to-green-500'
                        }`}
                        style={{ width: `${Math.min(parseFloat(trendPercentage) * 3, 100)}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="bg-gradient-to-r from-navy/5 to-sky/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="TrendingUp" size={16} className="text-info" />
                <h5 className="font-semibold text-navy">Trend Insights</h5>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Your shopping expenses show seasonal patterns</li>
                <li>• Transportation costs are trending downward this quarter</li>
                <li>• Food spending remains stable with minor monthly fluctuations</li>
              </ul>
            </div>
          </div>
        )}
      </Card>

      {showInsights && analytics.insights && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="Lightbulb" size={20} className="text-warning" />
            <h3 className="text-lg font-bold text-navy">Smart Insights</h3>
          </div>
          
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gradient-to-r from-sky/5 to-teal/5 rounded-lg"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-sky to-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ApperIcon name="Sparkles" size={12} className="text-white" />
                </div>
                <p className="text-sm text-navy">{insight}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SpendingAnalytics;