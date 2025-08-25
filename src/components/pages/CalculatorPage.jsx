import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("sip");
  
  // SIP Calculator State
  const [sipData, setSipData] = useState({
    amount: "",
    tenure: "",
    expectedReturn: "12"
  });
  const [sipResult, setSipResult] = useState(null);

  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    loanAmount: "",
    tenure: "",
    interestRate: "8.5"
  });
  const [emiResult, setEmiResult] = useState(null);

  // Compound Interest Calculator State
  const [compoundData, setCompoundData] = useState({
    principal: "",
    rate: "8",
    time: "",
    compound: "12"
  });
  const [compoundResult, setCompoundResult] = useState(null);

  // Lumpsum Calculator State
  const [lumpsumData, setLumpsumData] = useState({
    amount: "",
    tenure: "",
    expectedReturn: "12"
  });
  const [lumpsumResult, setLumpsumResult] = useState(null);

  // Retirement Calculator State
  const [retirementData, setRetirementData] = useState({
    currentAge: "",
    retirementAge: "",
    monthlyExpenses: "",
    inflationRate: "6",
    expectedReturn: "10"
  });
  const [retirementResult, setRetirementResult] = useState(null);

  const calculatorTabs = [
    { id: "sip", name: "SIP Calculator", icon: "TrendingUp" },
    { id: "emi", name: "EMI Calculator", icon: "Home" },
    { id: "compound", name: "Compound Interest", icon: "Percent" },
    { id: "lumpsum", name: "Lumpsum Calculator", icon: "DollarSign" },
    { id: "retirement", name: "Retirement Planning", icon: "Clock" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSIP = () => {
    const { amount, tenure, expectedReturn } = sipData;
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
    toast.success("SIP calculation completed!");
  };

  const calculateEMI = () => {
    const { loanAmount, tenure, interestRate } = emiData;
    if (!loanAmount || !tenure) {
      toast.error("Please enter loan amount and tenure");
      return;
    }

    const principal = parseFloat(loanAmount);
    const months = parseFloat(tenure) * 12;
    const monthlyRate = parseFloat(interestRate) / 1200;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    setEmiResult({
      emi: emi.toFixed(0),
      totalAmount: totalAmount.toFixed(0),
      totalInterest: totalInterest.toFixed(0)
    });
    toast.success("EMI calculation completed!");
  };

  const calculateCompound = () => {
    const { principal, rate, time, compound } = compoundData;
    if (!principal || !time) {
      toast.error("Please enter principal amount and time period");
      return;
    }

    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compound);

    const amount = p * Math.pow((1 + r/n), n*t);
    const interest = amount - p;

    setCompoundResult({
      principal: p.toFixed(0),
      maturityAmount: amount.toFixed(0),
      interestEarned: interest.toFixed(0)
    });
    toast.success("Compound interest calculation completed!");
  };

  const calculateLumpsum = () => {
    const { amount, tenure, expectedReturn } = lumpsumData;
    if (!amount || !tenure) {
      toast.error("Please enter investment amount and tenure");
      return;
    }

    const principal = parseFloat(amount);
    const years = parseFloat(tenure);
    const rate = parseFloat(expectedReturn) / 100;

    const maturityAmount = principal * Math.pow((1 + rate), years);
    const totalGains = maturityAmount - principal;

    setLumpsumResult({
      investment: principal.toFixed(0),
      maturityAmount: maturityAmount.toFixed(0),
      totalGains: totalGains.toFixed(0)
    });
    toast.success("Lumpsum calculation completed!");
  };

  const calculateRetirement = () => {
    const { currentAge, retirementAge, monthlyExpenses, inflationRate, expectedReturn } = retirementData;
    if (!currentAge || !retirementAge || !monthlyExpenses) {
      toast.error("Please fill all required fields");
      return;
    }

    const yearsToRetirement = parseFloat(retirementAge) - parseFloat(currentAge);
    const currentExpenses = parseFloat(monthlyExpenses) * 12;
    const inflation = parseFloat(inflationRate) / 100;
    const returns = parseFloat(expectedReturn) / 100;

    // Calculate future expenses at retirement
    const futureAnnualExpenses = currentExpenses * Math.pow((1 + inflation), yearsToRetirement);
    
    // Assuming 25 years after retirement
    const requiredCorpus = futureAnnualExpenses * 25;
    
    // Monthly SIP required
    const monthlyRate = returns / 12;
    const months = yearsToRetirement * 12;
    const monthlySIP = (requiredCorpus * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

    setRetirementResult({
      yearsToRetirement: yearsToRetirement,
      futureExpenses: futureAnnualExpenses.toFixed(0),
      requiredCorpus: requiredCorpus.toFixed(0),
      monthlySIP: monthlySIP.toFixed(0)
    });
    toast.success("Retirement planning calculation completed!");
  };

  const resetCalculator = () => {
    switch(activeTab) {
      case "sip":
        setSipData({ amount: "", tenure: "", expectedReturn: "12" });
        setSipResult(null);
        break;
      case "emi":
        setEmiData({ loanAmount: "", tenure: "", interestRate: "8.5" });
        setEmiResult(null);
        break;
      case "compound":
        setCompoundData({ principal: "", rate: "8", time: "", compound: "12" });
        setCompoundResult(null);
        break;
      case "lumpsum":
        setLumpsumData({ amount: "", tenure: "", expectedReturn: "12" });
        setLumpsumResult(null);
        break;
      case "retirement":
        setRetirementData({ currentAge: "", retirementAge: "", monthlyExpenses: "", inflationRate: "6", expectedReturn: "10" });
        setRetirementResult(null);
        break;
    }
    toast.info("Calculator reset!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Financial Calculator</h1>
        <p className="text-gray-600 mt-1">Plan your finances with precision</p>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1">
        <div className="flex overflow-x-auto gap-1">
          {calculatorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                  : "text-gray-600 hover:text-navy hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy flex items-center">
                <ApperIcon 
                  name={calculatorTabs.find(tab => tab.id === activeTab)?.icon} 
                  size={20} 
                  className="mr-2" 
                />
                {calculatorTabs.find(tab => tab.id === activeTab)?.name}
              </h3>
              <Button variant="outline" size="small" onClick={resetCalculator}>
                <ApperIcon name="RotateCcw" size={14} className="mr-2" />
                Reset
              </Button>
            </div>

            {/* SIP Calculator */}
            {activeTab === "sip" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Monthly Investment Amount (₹)"
                    type="number"
                    placeholder="1,000"
                    value={sipData.amount}
                    onChange={(e) => setSipData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Input
                    label="Investment Period (Years)"
                    type="number"
                    placeholder="10"
                    value={sipData.tenure}
                    onChange={(e) => setSipData(prev => ({ ...prev, tenure: e.target.value }))}
                  />
                </div>
                <Input
                  label="Expected Annual Return (%)"
                  type="number"
                  placeholder="12"
                  value={sipData.expectedReturn}
                  onChange={(e) => setSipData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                />
                <Button onClick={calculateSIP} className="w-full">
                  <ApperIcon name="Calculator" size={16} className="mr-2" />
                  Calculate SIP
                </Button>
              </div>
            )}

            {/* EMI Calculator */}
            {activeTab === "emi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Loan Amount (₹)"
                    type="number"
                    placeholder="10,00,000"
                    value={emiData.loanAmount}
                    onChange={(e) => setEmiData(prev => ({ ...prev, loanAmount: e.target.value }))}
                  />
                  <Input
                    label="Loan Tenure (Years)"
                    type="number"
                    placeholder="20"
                    value={emiData.tenure}
                    onChange={(e) => setEmiData(prev => ({ ...prev, tenure: e.target.value }))}
                  />
                </div>
                <Input
                  label="Interest Rate (% per annum)"
                  type="number"
                  placeholder="8.5"
                  value={emiData.interestRate}
                  onChange={(e) => setEmiData(prev => ({ ...prev, interestRate: e.target.value }))}
                />
                <Button onClick={calculateEMI} className="w-full">
                  <ApperIcon name="Calculator" size={16} className="mr-2" />
                  Calculate EMI
                </Button>
              </div>
            )}

            {/* Compound Interest Calculator */}
            {activeTab === "compound" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Principal Amount (₹)"
                    type="number"
                    placeholder="1,00,000"
                    value={compoundData.principal}
                    onChange={(e) => setCompoundData(prev => ({ ...prev, principal: e.target.value }))}
                  />
                  <Input
                    label="Time Period (Years)"
                    type="number"
                    placeholder="5"
                    value={compoundData.time}
                    onChange={(e) => setCompoundData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Annual Interest Rate (%)"
                    type="number"
                    placeholder="8"
                    value={compoundData.rate}
                    onChange={(e) => setCompoundData(prev => ({ ...prev, rate: e.target.value }))}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Compounding Frequency
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky focus:ring-4 focus:ring-sky/10 focus:outline-none"
                      value={compoundData.compound}
                      onChange={(e) => setCompoundData(prev => ({ ...prev, compound: e.target.value }))}
                    >
                      <option value="1">Annually</option>
                      <option value="2">Semi-Annually</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                      <option value="365">Daily</option>
                    </select>
                  </div>
                </div>
                <Button onClick={calculateCompound} className="w-full">
                  <ApperIcon name="Calculator" size={16} className="mr-2" />
                  Calculate Compound Interest
                </Button>
              </div>
            )}

            {/* Lumpsum Calculator */}
            {activeTab === "lumpsum" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Investment Amount (₹)"
                    type="number"
                    placeholder="1,00,000"
                    value={lumpsumData.amount}
                    onChange={(e) => setLumpsumData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Input
                    label="Investment Period (Years)"
                    type="number"
                    placeholder="10"
                    value={lumpsumData.tenure}
                    onChange={(e) => setLumpsumData(prev => ({ ...prev, tenure: e.target.value }))}
                  />
                </div>
                <Input
                  label="Expected Annual Return (%)"
                  type="number"
                  placeholder="12"
                  value={lumpsumData.expectedReturn}
                  onChange={(e) => setLumpsumData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                />
                <Button onClick={calculateLumpsum} className="w-full">
                  <ApperIcon name="Calculator" size={16} className="mr-2" />
                  Calculate Lumpsum Returns
                </Button>
              </div>
            )}

            {/* Retirement Calculator */}
            {activeTab === "retirement" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Current Age (Years)"
                    type="number"
                    placeholder="30"
                    value={retirementData.currentAge}
                    onChange={(e) => setRetirementData(prev => ({ ...prev, currentAge: e.target.value }))}
                  />
                  <Input
                    label="Retirement Age (Years)"
                    type="number"
                    placeholder="60"
                    value={retirementData.retirementAge}
                    onChange={(e) => setRetirementData(prev => ({ ...prev, retirementAge: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Current Monthly Expenses (₹)"
                    type="number"
                    placeholder="50,000"
                    value={retirementData.monthlyExpenses}
                    onChange={(e) => setRetirementData(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                  />
                  <Input
                    label="Inflation Rate (%)"
                    type="number"
                    placeholder="6"
                    value={retirementData.inflationRate}
                    onChange={(e) => setRetirementData(prev => ({ ...prev, inflationRate: e.target.value }))}
                  />
                </div>
                <Input
                  label="Expected Return on Investment (%)"
                  type="number"
                  placeholder="10"
                  value={retirementData.expectedReturn}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                />
                <Button onClick={calculateRetirement} className="w-full">
                  <ApperIcon name="Calculator" size={16} className="mr-2" />
                  Calculate Retirement Plan
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Results Display */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="BarChart3" size={20} className="mr-2" />
              Calculation Results
            </h3>
            
            {/* SIP Results */}
            {activeTab === "sip" && sipResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Investment</span>
                    <span className="font-semibold text-navy">{formatCurrency(sipResult.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Gains</span>
                    <span className="font-semibold text-success">{formatCurrency(sipResult.totalGains)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Maturity Value</span>
                    <span className="font-bold text-sky text-lg">{formatCurrency(sipResult.maturityAmount)}</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Investment vs Returns</span>
                    <span>{((sipResult.totalGains / sipResult.totalInvestment) * 100).toFixed(1)}% gain</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky to-teal h-2 rounded-full" 
                      style={{ width: `${(sipResult.totalGains / sipResult.maturityAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMI Results */}
            {activeTab === "emi" && emiResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly EMI</span>
                    <span className="font-bold text-sky text-lg">{formatCurrency(emiResult.emi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Interest</span>
                    <span className="font-semibold text-error">{formatCurrency(emiResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="font-bold text-navy">{formatCurrency(emiResult.totalAmount)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Compound Interest Results */}
            {activeTab === "compound" && compoundResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Principal Amount</span>
                    <span className="font-semibold text-navy">{formatCurrency(compoundResult.principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interest Earned</span>
                    <span className="font-semibold text-success">{formatCurrency(compoundResult.interestEarned)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Maturity Amount</span>
                    <span className="font-bold text-sky text-lg">{formatCurrency(compoundResult.maturityAmount)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lumpsum Results */}
            {activeTab === "lumpsum" && lumpsumResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment</span>
                    <span className="font-semibold text-navy">{formatCurrency(lumpsumResult.investment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Gains</span>
                    <span className="font-semibold text-success">{formatCurrency(lumpsumResult.totalGains)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Maturity Value</span>
                    <span className="font-bold text-sky text-lg">{formatCurrency(lumpsumResult.maturityAmount)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Retirement Results */}
            {activeTab === "retirement" && retirementResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Years to Retirement</span>
                    <span className="font-semibold text-navy">{retirementResult.yearsToRetirement} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Required Corpus</span>
                    <span className="font-semibold text-error">{formatCurrency(retirementResult.requiredCorpus)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-gray-700">Monthly SIP Required</span>
                    <span className="font-bold text-sky text-lg">{formatCurrency(retirementResult.monthlySIP)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!sipResult && !emiResult && !compoundResult && !lumpsumResult && !retirementResult && (
              <div className="text-center py-8">
                <ApperIcon name="Calculator" size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Enter values and calculate to see results</p>
              </div>
            )}
          </Card>

          {/* Financial Tips */}
          <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Lightbulb" size={20} className="mr-2" />
              Financial Tips
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Start investing early to benefit from compounding</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">SIP helps in rupee cost averaging</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Plan for retirement at least 30 years in advance</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <p className="text-gray-700">Keep EMI under 40% of your monthly income</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" size="small" className="w-full">
                <ApperIcon name="Download" size={14} className="mr-2" />
                Download Results
              </Button>
              <Button variant="outline" size="small" className="w-full">
                <ApperIcon name="Share2" size={14} className="mr-2" />
                Share Calculation
              </Button>
              <Button variant="outline" size="small" className="w-full">
                <ApperIcon name="BookOpen" size={14} className="mr-2" />
                View Guide
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;