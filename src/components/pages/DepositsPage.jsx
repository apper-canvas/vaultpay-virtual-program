import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const DepositsPage = () => {
  const [activeTab, setActiveTab] = useState("fd");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [calculatorData, setCalculatorData] = useState({
    amount: "",
    tenure: "",
    frequency: "monthly"
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [applicationData, setApplicationData] = useState({
    amount: "",
    tenure: "",
    nominee: "",
    nomineeRelation: "",
    specialInstructions: ""
  });
  const [showApplication, setShowApplication] = useState(false);

  const fdPlans = [
    {
      id: 1,
      name: "Regular Fixed Deposit",
      minAmount: 10000,
      maxTenure: 10,
      interestRate: 6.75,
      features: ["Flexible tenure", "Loan against FD", "Auto-renewal option", "Premature withdrawal"],
      color: "from-sky to-blue-500",
      icon: "PiggyBank"
    },
    {
      id: 2,
      name: "Senior Citizen FD",
      minAmount: 5000,
      maxTenure: 5,
      interestRate: 7.25,
      features: ["Extra 0.5% interest", "Special rates for seniors", "No penalty fees", "Priority service"],
      color: "from-amber-500 to-orange-500",
      icon: "Crown"
    },
    {
      id: 3,
      name: "Tax Saver FD",
      minAmount: 100,
      maxTenure: 5,
      interestRate: 6.5,
      features: ["Tax deduction u/s 80C", "Lock-in period 5 years", "Interest taxable", "High returns"],
      color: "from-green-500 to-emerald-500",
      icon: "Shield"
    }
  ];

  const rdPlans = [
    {
      id: 4,
      name: "Monthly Recurring Deposit",
      minAmount: 500,
      maxTenure: 10,
      interestRate: 6.5,
      features: ["Monthly installments", "Flexible amount", "Loan facility", "Maturity amount guarantee"],
      color: "from-teal to-green-500",
      icon: "Calendar"
    },
    {
      id: 5,
      name: "Flexi Recurring Deposit",
      minAmount: 1000,
      maxTenure: 5,
      interestRate: 6.25,
      features: ["Variable installments", "Skip facility", "Top-up option", "Auto-debit convenience"],
      color: "from-purple-500 to-violet-500",
      icon: "Zap"
    }
  ];

  const calculateReturns = () => {
    const { amount, tenure } = calculatorData;
    if (!amount || !tenure) {
      toast.error("Please enter amount and tenure");
      return;
    }

    const principal = parseFloat(amount);
    const years = parseFloat(tenure);
    const rate = activeTab === "fd" ? 6.75 : 6.5;
    
    if (activeTab === "fd") {
      // Compound interest for FD
      const compoundedAmount = principal * Math.pow(1 + rate / 100, years);
      const interest = compoundedAmount - principal;
      
      setCalculationResult({
        principal,
        interest: interest.toFixed(2),
        maturityAmount: compoundedAmount.toFixed(2),
        monthlyInterest: (interest / (years * 12)).toFixed(2)
      });
    } else {
      // RD calculation
      const monthlyAmount = principal;
      const months = years * 12;
      const monthlyRate = rate / 1200;
      
      const maturityAmount = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalInvestment = monthlyAmount * months;
      const interest = maturityAmount - totalInvestment;
      
      setCalculationResult({
        monthlyAmount,
        totalInvestment: totalInvestment.toFixed(2),
        interest: interest.toFixed(2),
        maturityAmount: maturityAmount.toFixed(2)
      });
    }
  };

  const handleApplicationSubmit = () => {
    if (!applicationData.amount || !applicationData.tenure || !applicationData.nominee) {
      toast.error("Please fill all required fields");
      return;
    }

    toast.success("Application submitted successfully! You'll receive confirmation shortly.");
    setShowApplication(false);
    setApplicationData({
      amount: "",
      tenure: "",
      nominee: "",
      nomineeRelation: "",
      specialInstructions: ""
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const currentPlans = activeTab === "fd" ? fdPlans : rdPlans;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Fixed Deposits & Recurring Deposits</h1>
        <p className="text-gray-600 mt-1">Grow your savings with guaranteed returns</p>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1">
        <div className="flex rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("fd")}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "fd"
                ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <ApperIcon name="PiggyBank" size={16} className="mr-2 inline-block" />
            Fixed Deposits
          </button>
          <button
            onClick={() => setActiveTab("rd")}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "rd"
                ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <ApperIcon name="Calendar" size={16} className="mr-2 inline-block" />
            Recurring Deposits
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plans List */}
        <div className="xl:col-span-2 space-y-6">
          {/* Interest Rate Calculator */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Calculator" size={20} className="mr-2" />
              Returns Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {activeTab === "fd" ? "Investment Amount" : "Monthly Amount"}
                </label>
                <Input
                  type="number"
                  placeholder={`Min ₹${activeTab === "fd" ? "10,000" : "500"}`}
                  value={calculatorData.amount}
                  onChange={(e) => setCalculatorData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tenure (Years)
                </label>
                <Input
                  type="number"
                  placeholder="1-10 years"
                  value={calculatorData.tenure}
                  onChange={(e) => setCalculatorData(prev => ({ ...prev, tenure: e.target.value }))}
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={calculateReturns} className="w-full">
                  Calculate
                </Button>
              </div>
            </div>

            {calculationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {activeTab === "fd" ? (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Principal</p>
                      <p className="text-lg font-bold text-navy">{formatCurrency(calculationResult.principal)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Interest Earned</p>
                      <p className="text-lg font-bold text-success">{formatCurrency(calculationResult.interest)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maturity Amount</p>
                      <p className="text-lg font-bold text-sky">{formatCurrency(calculationResult.maturityAmount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Interest</p>
                      <p className="text-lg font-bold text-teal">{formatCurrency(calculationResult.monthlyInterest)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Amount</p>
                      <p className="text-lg font-bold text-navy">{formatCurrency(calculationResult.monthlyAmount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Investment</p>
                      <p className="text-lg font-bold text-teal">{formatCurrency(calculationResult.totalInvestment)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Interest Earned</p>
                      <p className="text-lg font-bold text-success">{formatCurrency(calculationResult.interest)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maturity Amount</p>
                      <p className="text-lg font-bold text-sky">{formatCurrency(calculationResult.maturityAmount)}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </Card>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all border-2 ${
                    selectedPlan?.id === plan.id 
                      ? 'border-sky shadow-xl' 
                      : 'border-transparent hover:border-gray-200 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          <ApperIcon name={plan.icon} size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
                          <Badge variant="success" size="small">
                            {plan.interestRate}% p.a.
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedPlan?.id === plan.id && (
                        <div className="w-6 h-6 bg-sky rounded-full flex items-center justify-center">
                          <ApperIcon name="Check" size={16} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Min Amount</p>
                        <p className="font-semibold text-navy">{formatCurrency(plan.minAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Max Tenure</p>
                        <p className="font-semibold text-navy">{plan.maxTenure} years</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Features</p>
                      <div className="space-y-1">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sky rounded-full"></div>
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="small"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan);
                        setShowApplication(true);
                      }}
                      className="w-full"
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Rates */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="TrendingUp" size={20} className="mr-2" />
              Current Rates
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FD - Regular</span>
                <Badge variant="success">6.75% p.a.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FD - Senior Citizen</span>
                <Badge variant="success">7.25% p.a.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">RD - Monthly</span>
                <Badge variant="info">6.50% p.a.</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax Saver FD</span>
                <Badge variant="warning">6.50% p.a.</Badge>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              *Rates are subject to change. Last updated: {new Date().toLocaleDateString()}
            </p>
          </Card>

          {/* Benefits */}
          <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Award" size={20} className="mr-2" />
              Why Choose Our Deposits?
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Shield" size={16} className="text-success mt-1" />
                <div>
                  <p className="text-sm font-semibold text-navy">100% Safe & Secure</p>
                  <p className="text-xs text-gray-600">DICGC insured up to ₹5 lakhs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ApperIcon name="Zap" size={16} className="text-success mt-1" />
                <div>
                  <p className="text-sm font-semibold text-navy">Instant Processing</p>
                  <p className="text-xs text-gray-600">Open deposits in minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ApperIcon name="CreditCard" size={16} className="text-success mt-1" />
                <div>
                  <p className="text-sm font-semibold text-navy">Loan Against FD</p>
                  <p className="text-xs text-gray-600">Up to 90% of deposit value</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ApperIcon name="RefreshCw" size={16} className="text-success mt-1" />
                <div>
                  <p className="text-sm font-semibold text-navy">Auto Renewal</p>
                  <p className="text-xs text-gray-600">Hassle-free reinvestment</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <div className="text-center">
              <ApperIcon name="Headphones" size={32} className="text-sky mx-auto mb-3" />
              <h4 className="font-semibold text-navy mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our deposit specialists are here to help you choose the right plan
              </p>
              <Button size="small" variant="outline" className="w-full">
                <ApperIcon name="Phone" size={16} className="mr-2" />
                Call 1800-XXX-XXXX
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Application Modal */}
      {showApplication && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">Apply for {selectedPlan.name}</h3>
              <button
                onClick={() => setShowApplication(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {activeTab === "fd" ? "Investment Amount *" : "Monthly Amount *"}
                  </label>
                  <Input
                    type="number"
                    placeholder={`Min ${formatCurrency(selectedPlan.minAmount)}`}
                    value={applicationData.amount}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tenure (Years) *
                  </label>
                  <Input
                    type="number"
                    placeholder={`Max ${selectedPlan.maxTenure} years`}
                    value={applicationData.tenure}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, tenure: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nominee Name *
                  </label>
                  <Input
                    placeholder="Enter nominee name"
                    value={applicationData.nominee}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, nominee: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={applicationData.nomineeRelation}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, nomineeRelation: e.target.value }))}
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="son">Son</option>
                    <option value="daughter">Daughter</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none resize-none"
                  rows={3}
                  placeholder="Any special instructions or preferences"
                  value={applicationData.specialInstructions}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                ></textarea>
              </div>

              <div className="bg-sky/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" size={16} className="text-sky mt-1" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Interest Rate:</strong> {selectedPlan.interestRate}% per annum<br />
                      <strong>Compounding:</strong> Quarterly<br />
                      <strong>Premature Withdrawal:</strong> Available with penalty
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApplication(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplicationSubmit}
                  className="w-full"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DepositsPage;