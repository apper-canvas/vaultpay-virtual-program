import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const InsurancePage = () => {
  const [activeTab, setActiveTab] = useState("life");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [premiumCalculator, setPremiumCalculator] = useState({
    age: "",
    gender: "male",
    coverAmount: "",
    term: "20",
    smokingStatus: "no"
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    annualIncome: "",
    nominee: "",
    nomineeRelation: ""
  });

  const lifePlans = [
    {
      id: 1,
      name: "VaultPay Term Life",
      type: "Term Life",
      minAge: 18,
      maxAge: 65,
      minCover: 500000,
      maxCover: 10000000,
      features: ["No medical checkup up to ₹50L", "Tax benefits u/s 80C", "Rider options available", "Claim settlement ratio 98.2%"],
      color: "from-blue-500 to-indigo-600",
      icon: "Shield",
      premium: "Starting ₹500/month"
    },
    {
      id: 2,
      name: "VaultPay Whole Life",
      type: "Whole Life",
      minAge: 18,
      maxAge: 60,
      minCover: 1000000,
      maxCover: 50000000,
      features: ["Lifelong coverage", "Maturity benefits", "Loan against policy", "Guaranteed bonuses"],
      color: "from-green-500 to-emerald-600",
      icon: "Heart",
      premium: "Starting ₹1,200/month"
    },
    {
      id: 3,
      name: "VaultPay ULIP",
      type: "ULIP",
      minAge: 18,
      maxAge: 60,
      minCover: 1000000,
      maxCover: 25000000,
      features: ["Investment + Insurance", "Market-linked returns", "Tax benefits", "Flexible premium payment"],
      color: "from-purple-500 to-violet-600",
      icon: "TrendingUp",
      premium: "Starting ₹2,000/month"
    }
  ];

  const healthPlans = [
    {
      id: 4,
      name: "VaultPay Health Shield",
      type: "Individual Health",
      minAge: 18,
      maxAge: 65,
      minCover: 200000,
      maxCover: 10000000,
      features: ["Cashless treatment", "Pre & post hospitalization", "Day care procedures", "No room rent limit"],
      color: "from-red-500 to-pink-600",
      icon: "Heart",
      premium: "Starting ₹800/month"
    },
    {
      id: 5,
      name: "VaultPay Family Care",
      type: "Family Floater",
      minAge: 18,
      maxAge: 65,
      minCover: 500000,
      maxCover: 25000000,
      features: ["Family coverage", "Maternity benefits", "Newborn coverage", "Annual health checkup"],
      color: "from-teal-500 to-green-600",
      icon: "Users",
      premium: "Starting ₹1,500/month"
    },
    {
      id: 6,
      name: "VaultPay Critical Care",
      type: "Critical Illness",
      minAge: 18,
      maxAge: 65,
      minCover: 1000000,
      maxCover: 20000000,
      features: ["37 critical illnesses", "Lump sum payout", "Premium waiver", "Second medical opinion"],
      color: "from-orange-500 to-red-500",
      icon: "AlertTriangle",
      premium: "Starting ₹600/month"
    }
  ];

  const calculatePremium = () => {
    const { age, coverAmount, term } = premiumCalculator;
    if (!age || !coverAmount) {
      toast.error("Please enter age and cover amount");
      return;
    }

    const ageNum = parseInt(age);
    const cover = parseInt(coverAmount);
    const termYears = parseInt(term);

    // Mock premium calculation
    let basePremium = 0;
    
    if (activeTab === "life") {
      basePremium = (cover / 1000) * (ageNum * 0.5) * (termYears * 0.1);
      if (premiumCalculator.smokingStatus === "yes") {
        basePremium *= 1.5;
      }
      if (premiumCalculator.gender === "female") {
        basePremium *= 0.9; // Female discount
      }
    } else {
      basePremium = (cover / 1000) * (ageNum * 0.8) * 12;
    }

    const annualPremium = Math.round(basePremium);
    const monthlyPremium = Math.round(basePremium / 12);

    setCalculationResult({
      annualPremium,
      monthlyPremium,
      coverAmount: cover,
      totalPremium: annualPremium * termYears
    });
  };

  const handleApplicationSubmit = () => {
    if (!applicationData.fullName || !applicationData.email || !applicationData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    toast.success("Insurance application submitted successfully! Our team will contact you soon.");
    setShowApplicationForm(false);
    setApplicationData({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      occupation: "",
      annualIncome: "",
      nominee: "",
      nomineeRelation: ""
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentPlans = activeTab === "life" ? lifePlans : healthPlans;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Insurance</h1>
        <p className="text-gray-600 mt-1">Protect yourself and your loved ones</p>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1">
        <div className="flex rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("life")}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "life"
                ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <ApperIcon name="Shield" size={16} className="mr-2 inline-block" />
            Life Insurance
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "health"
                ? "bg-gradient-to-r from-sky to-blue-500 text-white"
                : "text-gray-600 hover:text-navy"
            }`}
          >
            <ApperIcon name="Heart" size={16} className="mr-2 inline-block" />
            Health Insurance
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Premium Calculator */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Calculator" size={20} className="mr-2" />
              Premium Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={premiumCalculator.age}
                  onChange={(e) => setPremiumCalculator(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Amount</label>
                <Input
                  type="number"
                  placeholder="₹10,00,000"
                  value={premiumCalculator.coverAmount}
                  onChange={(e) => setPremiumCalculator(prev => ({ ...prev, coverAmount: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                  value={premiumCalculator.gender}
                  onChange={(e) => setPremiumCalculator(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {activeTab === "life" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Term (Years)</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={premiumCalculator.term}
                    onChange={(e) => setPremiumCalculator(prev => ({ ...prev, term: e.target.value }))}
                  >
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                    <option value="25">25 Years</option>
                    <option value="30">30 Years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Smoking Status</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={premiumCalculator.smokingStatus}
                    onChange={(e) => setPremiumCalculator(prev => ({ ...prev, smokingStatus: e.target.value }))}
                  >
                    <option value="no">Non-Smoker</option>
                    <option value="yes">Smoker</option>
                  </select>
                </div>
              </div>
            )}

            <Button onClick={calculatePremium} className="w-full md:w-auto mb-4">
              Calculate Premium
            </Button>

            {calculationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monthly Premium</p>
                  <p className="text-xl font-bold text-sky">{formatCurrency(calculationResult.monthlyPremium)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Annual Premium</p>
                  <p className="text-xl font-bold text-teal">{formatCurrency(calculationResult.annualPremium)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cover Amount</p>
                  <p className="text-xl font-bold text-navy">{formatCurrency(calculationResult.coverAmount)}</p>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Insurance Plans */}
          <div className="space-y-4">
            {currentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <ApperIcon name={plan.icon} size={24} className="text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
                            <Badge variant="info" size="small" className="mt-1">
                              {plan.type}
                            </Badge>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Premium</p>
                            <p className="font-semibold text-success">{plan.premium}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Min Age</p>
                            <p className="font-semibold text-navy">{plan.minAge} years</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Max Age</p>
                            <p className="font-semibold text-navy">{plan.maxAge} years</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Min Cover</p>
                            <p className="font-semibold text-navy">{formatCurrency(plan.minCover)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Max Cover</p>
                            <p className="font-semibold text-navy">{formatCurrency(plan.maxCover)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Key Features</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-success rounded-full"></div>
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            size="small"
                            variant="outline"
                            onClick={() => {
                              setSelectedPlan(plan);
                              // Scroll to calculator
                              document.querySelector('.space-y-6').scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Get Quote
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowApplicationForm(true);
                            }}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Why Insurance */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="Info" size={20} className="mr-2" />
              Why Insurance?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Shield" size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Financial Protection</p>
                  <p className="text-xs text-gray-600">Secure your family's future</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-sky/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="TrendingUp" size={16} className="text-sky" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Tax Benefits</p>
                  <p className="text-xs text-gray-600">Save up to ₹1.5L under 80C</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Heart" size={16} className="text-teal" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Peace of Mind</p>
                  <p className="text-xs text-gray-600">Focus on what matters</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Claim Process */}
          <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
              <ApperIcon name="FileCheck" size={20} className="mr-2" />
              Quick Claim Process
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <span className="text-sm text-gray-700">Intimate the claim</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span className="text-sm text-gray-700">Submit documents</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span className="text-sm text-gray-700">Claim verification</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                  4
                </div>
                <span className="text-sm text-gray-700">Claim settlement</span>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 mt-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" size={16} className="text-success" />
                <span className="text-sm font-semibold text-navy">Average settlement time: 7 days</span>
              </div>
            </div>
          </Card>

          {/* Customer Support */}
          <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
            <div className="text-center">
              <ApperIcon name="Headphones" size={32} className="text-sky mx-auto mb-3" />
              <h4 className="font-semibold text-navy mb-2">Insurance Advisor</h4>
              <p className="text-sm text-gray-600 mb-4">
                Need help choosing the right plan? Our experts are here to help.
              </p>
              <div className="space-y-2">
                <Button size="small" className="w-full">
                  <ApperIcon name="Phone" size={16} className="mr-2" />
                  Call Expert
                </Button>
                <Button size="small" variant="outline" className="w-full">
                  <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                  Chat Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Company Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4">Why Choose Us</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Claim Settlement Ratio</span>
                <Badge variant="success">98.2%</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customers</span>
                <span className="font-semibold text-navy">50L+</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Network Hospitals</span>
                <span className="font-semibold text-navy">10,000+</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Claims Paid</span>
                <span className="font-semibold text-navy">₹5,000 Cr+</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">Apply for {selectedPlan.name}</h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Enter full name"
                    value={applicationData.fullName}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={applicationData.dateOfBirth}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Occupation
                  </label>
                  <Input
                    placeholder="Enter occupation"
                    value={applicationData.occupation}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, occupation: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter annual income"
                    value={applicationData.annualIncome}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, annualIncome: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nominee Name
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

              <div className="bg-sky/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" size={16} className="text-sky mt-1" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Next Steps:</strong><br />
                      1. Our representative will contact you within 24 hours<br />
                      2. Complete the proposal form and medical tests (if required)<br />
                      3. Policy will be issued after approval
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
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

export default InsurancePage;