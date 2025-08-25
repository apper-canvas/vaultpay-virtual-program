import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const InvestmentsPage = () => {
  const [activeTab, setActiveTab] = useState("mutual-funds");
  const [selectedFund, setSelectedFund] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [sipCalculator, setSipCalculator] = useState({
    amount: "",
    tenure: "",
    expectedReturn: "12"
  });
  const [sipResult, setSipResult] = useState(null);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [investmentData, setInvestmentData] = useState({
    amount: "",
    type: "lumpsum",
    sipAmount: "",
    sipDate: "1"
  });

  const mutualFunds = [
    {
      id: 1,
      name: "VaultPay Large Cap Fund",
      category: "Large Cap",
      nav: 245.67,
      return1y: 15.8,
      return3y: 12.4,
      return5y: 14.2,
      expense: 0.85,
      rating: 5,
      riskLevel: "Moderate",
      color: "from-blue-500 to-indigo-600",
      aum: "₹12,450 Cr",
      manager: "Rahul Sharma"
    },
    {
      id: 2,
      name: "VaultPay Mid Cap Growth",
      category: "Mid Cap",
      nav: 186.43,
      return1y: 24.6,
      return3y: 18.7,
      return5y: 16.9,
      expense: 1.25,
      rating: 4,
      riskLevel: "High",
      color: "from-purple-500 to-violet-600",
      aum: "₹8,750 Cr",
      manager: "Priya Patel"
    },
    {
      id: 3,
      name: "VaultPay Flexi Cap Fund",
      category: "Flexi Cap",
      nav: 198.92,
      return1y: 18.3,
      return3y: 15.1,
      return5y: 13.8,
      expense: 1.05,
      rating: 4,
      riskLevel: "Moderate-High",
      color: "from-teal-500 to-green-600",
      aum: "₹15,200 Cr",
      manager: "Amit Kumar"
    },
    {
      id: 4,
      name: "VaultPay Debt Fund",
      category: "Debt",
      nav: 156.78,
      return1y: 7.2,
      return3y: 8.4,
      return5y: 8.9,
      expense: 0.65,
      rating: 3,
      riskLevel: "Low",
      color: "from-green-500 to-emerald-600",
      aum: "₹9,850 Cr",
      manager: "Sunita Rao"
    },
    {
      id: 5,
      name: "VaultPay ELSS Tax Saver",
      category: "ELSS",
      nav: 234.15,
      return1y: 21.4,
      return3y: 16.8,
      return5y: 15.6,
      expense: 1.15,
      rating: 5,
      riskLevel: "High",
      color: "from-orange-500 to-red-500",
      aum: "₹6,750 Cr",
      manager: "Vikash Singh"
    }
  ];

  const portfolioSummary = {
    totalValue: 125000,
    totalInvestment: 98000,
    currentGain: 27000,
    gainPercentage: 27.55,
    monthlyInvestment: 15000,
    activeSips: 5
  };

  useEffect(() => {
    // Mock portfolio data
    setPortfolioData([
      { fund: "VaultPay Large Cap Fund", invested: 35000, current: 42500, returns: 21.4 },
      { fund: "VaultPay Mid Cap Growth", invested: 28000, current: 36400, returns: 30.0 },
      { fund: "VaultPay ELSS Tax Saver", invested: 25000, current: 31250, returns: 25.0 },
      { fund: "VaultPay Debt Fund", invested: 10000, current: 10850, returns: 8.5 }
    ]);
  }, []);

  const calculateSIP = () => {
    const { amount, tenure, expectedReturn } = sipCalculator;
    if (!amount || !tenure) {
      toast.error("Please enter SIP amount and tenure");
      return;
    }

    const monthlyAmount = parseFloat(amount);
    const months = parseFloat(tenure) * 12;
    const monthlyReturn = parseFloat(expectedReturn) / 1200;

    const maturityAmount = monthlyAmount * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn);
    const totalInvestment = monthlyAmount * months;
    const totalGains = maturityAmount - totalInvestment;

    setSipResult({
      totalInvestment: totalInvestment.toFixed(0),
      totalGains: totalGains.toFixed(0),
      maturityAmount: maturityAmount.toFixed(0)
    });
  };

  const handleInvestment = () => {
    if (!investmentData.amount) {
      toast.error("Please enter investment amount");
      return;
    }

    toast.success(`Investment of ₹${investmentData.amount} initiated successfully!`);
    setShowInvestmentForm(false);
    setInvestmentData({
      amount: "",
      type: "lumpsum",
      sipAmount: "",
      sipDate: "1"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        size={12}
        className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Investments</h1>
        <p className="text-gray-600 mt-1">Build wealth through smart investing</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-sky/5 to-blue-50">
          <div className="flex items-center space-x-3">
            <ApperIcon name="TrendingUp" size={24} className="text-sky" />
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-lg font-bold text-navy">{formatCurrency(portfolioSummary.totalValue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/5 to-green-50">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Target" size={24} className="text-success" />
            <div>
              <p className="text-sm text-gray-600">Total Gains</p>
              <p className="text-lg font-bold text-success">
                +{formatCurrency(portfolioSummary.currentGain)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-teal/5 to-green-50">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Repeat" size={24} className="text-teal" />
            <div>
              <p className="text-sm text-gray-600">Monthly SIP</p>
              <p className="text-lg font-bold text-navy">{formatCurrency(portfolioSummary.monthlyInvestment)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple/5 to-purple-50">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Activity" size={24} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Active SIPs</p>
              <p className="text-lg font-bold text-navy">{portfolioSummary.activeSips}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <Card className="p-1">
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("mutual-funds")}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
                  activeTab === "mutual-funds"
                    ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                    : "text-gray-600 hover:text-navy"
                }`}
              >
                <ApperIcon name="TrendingUp" size={16} className="mr-2 inline-block" />
                Mutual Funds
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
                  activeTab === "portfolio"
                    ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                    : "text-gray-600 hover:text-navy"
                }`}
              >
                <ApperIcon name="PieChart" size={16} className="mr-2 inline-block" />
                My Portfolio
              </button>
            </div>
          </Card>

          {activeTab === "mutual-funds" && (
            <>
              {/* Mutual Funds List */}
              <div className="space-y-4">
                {mutualFunds.map((fund, index) => (
                  <motion.div
                    key={fund.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fund.color} flex items-center justify-center`}>
                            <ApperIcon name="TrendingUp" size={24} className="text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-navy">{fund.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary" size="small">{fund.category}</Badge>
                                  <div className="flex items-center space-x-1">
                                    {getRatingStars(fund.rating)}
                                  </div>
                                  <Badge 
                                    variant={fund.riskLevel === "Low" ? "success" : fund.riskLevel === "Moderate" ? "warning" : "error"} 
                                    size="small"
                                  >
                                    {fund.riskLevel} Risk
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-sm text-gray-600">NAV</p>
                                <p className="text-lg font-bold text-navy">₹{fund.nav}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">1Y Return</p>
                                <p className={`font-semibold ${fund.return1y > 0 ? 'text-success' : 'text-error'}`}>
                                  {fund.return1y > 0 ? '+' : ''}{fund.return1y}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">3Y Return</p>
                                <p className={`font-semibold ${fund.return3y > 0 ? 'text-success' : 'text-error'}`}>
                                  {fund.return3y > 0 ? '+' : ''}{fund.return3y}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">5Y Return</p>
                                <p className={`font-semibold ${fund.return5y > 0 ? 'text-success' : 'text-error'}`}>
                                  {fund.return5y > 0 ? '+' : ''}{fund.return5y}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Expense</p>
                                <p className="font-semibold text-navy">{fund.expense}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600">AUM</p>
                                <p className="font-semibold text-navy">{fund.aum}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <span>Fund Manager: {fund.manager}</span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  size="small"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedFund(fund);
                                    setInvestmentData(prev => ({ ...prev, type: "sip" }));
                                    setShowInvestmentForm(true);
                                  }}
                                >
                                  Start SIP
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setSelectedFund(fund);
                                    setInvestmentData(prev => ({ ...prev, type: "lumpsum" }));
                                    setShowInvestmentForm(true);
                                  }}
                                >
                                  Invest Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {activeTab === "portfolio" && (
            <>
              {/* Portfolio Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                  <ApperIcon name="PieChart" size={20} className="mr-2" />
                  Portfolio Performance
                </h3>
                
                <div className="space-y-4">
                  {portfolioData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-navy">{item.fund}</p>
                        <p className="text-sm text-gray-600">
                          Invested: {formatCurrency(item.invested)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-navy">{formatCurrency(item.current)}</p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={item.returns > 0 ? "success" : "error"} 
                            size="small"
                          >
                            {item.returns > 0 ? '+' : ''}{item.returns}%
                          </Badge>
                          <p className={`text-sm font-semibold ${item.returns > 0 ? 'text-success' : 'text-error'}`}>
                            {item.returns > 0 ? '+' : ''}{formatCurrency(item.current - item.invested)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                  <ApperIcon name="Activity" size={20} className="mr-2" />
                  Recent Transactions
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="ArrowUpRight" size={14} className="text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">SIP - VaultPay Large Cap</p>
                        <p className="text-xs text-gray-600">Jan 1, 2024</p>
                      </div>
                    </div>
                    <p className="font-bold text-success">+₹5,000</p>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="ArrowUpRight" size={14} className="text-success" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">Investment - VaultPay Mid Cap</p>
                        <p className="text-xs text-gray-600">Dec 28, 2023</p>
                      </div>
                    </div>
                    <p className="font-bold text-success">+₹10,000</p>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="ArrowDownRight" size={14} className="text-error" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-sm">Redemption - VaultPay Debt Fund</p>
                        <p className="text-xs text-gray-600">Dec 25, 2023</p>
                      </div>
                    </div>
                    <p className="font-bold text-error">-₹2,500</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SIP Calculator */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Calculator" size={20} className="mr-2" />
              SIP Calculator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Investment
                </label>
                <Input
                  type="number"
                  placeholder="₹1,000"
                  value={sipCalculator.amount}
                  onChange={(e) => setSipCalculator(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <Input
                  type="number"
                  placeholder="10"
                  value={sipCalculator.tenure}
                  onChange={(e) => setSipCalculator(prev => ({ ...prev, tenure: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Return (% p.a.)
                </label>
                <Input
                  type="number"
                  placeholder="12"
                  value={sipCalculator.expectedReturn}
                  onChange={(e) => setSipCalculator(prev => ({ ...prev, expectedReturn: e.target.value }))}
                />
              </div>
              
              <Button onClick={calculateSIP} className="w-full" size="small">
                Calculate
              </Button>

              {sipResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Invested Amount</span>
                    <span className="font-semibold text-navy">{formatCurrency(sipResult.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Gains</span>
                    <span className="font-semibold text-success">{formatCurrency(sipResult.totalGains)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Maturity Value</span>
                    <span className="font-bold text-sky">{formatCurrency(sipResult.maturityAmount)}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Market Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="BarChart3" size={20} className="mr-2" />
              Market Insights
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nifty 50</span>
                <div className="text-right">
                  <p className="font-semibold text-navy">21,456.78</p>
                  <Badge variant="success" size="small">+1.2%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sensex</span>
                <div className="text-right">
                  <p className="font-semibold text-navy">71,234.56</p>
                  <Badge variant="success" size="small">+0.8%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gold (per 10g)</span>
                <div className="text-right">
                  <p className="font-semibold text-navy">₹61,450</p>
                  <Badge variant="error" size="small">-0.3%</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Investment Tips */}
          <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Lightbulb" size={20} className="mr-2" />
              Investment Tips
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Start early to benefit from compounding</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Diversify across different fund categories</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Review and rebalance periodically</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Stay invested for long-term goals</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentForm && selectedFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">
                {investmentData.type === "sip" ? "Start SIP" : "Make Investment"} - {selectedFund.name}
              </h3>
              <button
                onClick={() => setShowInvestmentForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-sky/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current NAV</span>
                  <span className="font-bold text-navy">₹{selectedFund.nav}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Investment Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={investmentData.type}
                    onChange={(e) => setInvestmentData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="lumpsum">Lumpsum</option>
                    <option value="sip">SIP</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Min ₹500"
                    value={investmentData.amount}
                    onChange={(e) => setInvestmentData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>

              {investmentData.type === "sip" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SIP Date
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={investmentData.sipDate}
                    onChange={(e) => setInvestmentData(prev => ({ ...prev, sipDate: e.target.value }))}
                  >
                    <option value="1">1st of every month</option>
                    <option value="5">5th of every month</option>
                    <option value="10">10th of every month</option>
                    <option value="15">15th of every month</option>
                    <option value="25">25th of every month</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowInvestmentForm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvestment}
                  className="w-full"
                >
                  {investmentData.type === "sip" ? "Start SIP" : "Invest Now"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsPage;