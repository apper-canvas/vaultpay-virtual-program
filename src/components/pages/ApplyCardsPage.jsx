import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const ApplyCardsPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [applicationStep, setApplicationStep] = useState(1);
  const [formData, setFormData] = useState({
    cardType: "",
    income: "",
    employment: "",
    employer: "",
    experience: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    panCard: "",
    aadhar: ""
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cardTypes = [
    {
      id: 1,
      name: "VaultPay Classic",
      type: "Credit",
      annualFee: 0,
      creditLimit: "Up to ₹2,00,000",
      cashback: "1% on all purchases",
      features: ["No annual fee", "Contactless payments", "EMI facility", "24/7 support"],
      color: "from-sky to-blue-500",
      icon: "CreditCard",
      eligibility: { minIncome: 25000, minAge: 21 }
    },
    {
      id: 2,
      name: "VaultPay Gold",
      type: "Credit",
      annualFee: 999,
      creditLimit: "Up to ₹5,00,000",
      cashback: "2% on dining & shopping",
      features: ["Airport lounge access", "Fuel surcharge waiver", "Travel insurance", "Reward points"],
      color: "from-amber-500 to-orange-500",
      icon: "Crown",
      eligibility: { minIncome: 50000, minAge: 25 }
    },
    {
      id: 3,
      name: "VaultPay Platinum",
      type: "Credit",
      annualFee: 2999,
      creditLimit: "Up to ₹10,00,000",
      cashback: "5% on premium brands",
      features: ["Concierge services", "Golf privileges", "Priority banking", "International lounge"],
      color: "from-slate-600 to-gray-700",
      icon: "Diamond",
      eligibility: { minIncome: 100000, minAge: 25 }
    },
    {
      id: 4,
      name: "VaultPay Debit",
      type: "Debit",
      annualFee: 199,
      creditLimit: "Based on account balance",
      cashback: "0.5% on all transactions",
      features: ["Free ATM withdrawals", "Online shopping", "Bill payments", "UPI payments"],
      color: "from-teal to-green-500",
      icon: "CreditCard",
      eligibility: { minIncome: 15000, minAge: 18 }
    }
  ];

  const checkEligibility = () => {
    if (!selectedCard || !formData.income || !formData.employment) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const income = parseInt(formData.income);
      const age = 25; // Mock age
      const card = cardTypes.find(c => c.id === selectedCard.id);
      
      let eligible = true;
      let reasons = [];
      
      if (income < card.eligibility.minIncome) {
        eligible = false;
        reasons.push(`Minimum income requirement: ₹${card.eligibility.minIncome.toLocaleString()}`);
      }
      
      if (age < card.eligibility.minAge) {
        eligible = false;
        reasons.push(`Minimum age requirement: ${card.eligibility.minAge} years`);
      }

      setEligibilityResult({
        eligible,
        reasons,
        score: eligible ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 50
      });
      
      setLoading(false);
      
      if (eligible) {
        toast.success("Great! You're eligible for this card");
        setApplicationStep(2);
      } else {
        toast.error("Unfortunately, you don't meet the eligibility criteria");
      }
    }, 2000);
  };

  const submitApplication = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      toast.success("Application submitted successfully! You'll receive updates on your registered email.");
      setApplicationStep(3);
      setLoading(false);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (applicationStep === 3) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-success/5 to-green-50">
            <div className="w-16 h-16 bg-gradient-to-br from-success to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={32} className="text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-navy mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">Your {selectedCard?.name} application has been received and is under review.</p>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Application ID</span>
                <span className="font-mono font-semibold">CC{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Expected Processing</span>
                <span className="font-semibold">3-5 business days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="warning">Under Review</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/cards'}
                className="w-full"
              >
                View My Cards
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setApplicationStep(1);
                  setSelectedCard(null);
                  setEligibilityResult(null);
                  setFormData({
                    cardType: "",
                    income: "",
                    employment: "",
                    employer: "",
                    experience: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    panCard: "",
                    aadhar: ""
                  });
                }}
                className="w-full"
              >
                Apply for Another Card
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Apply for Cards</h1>
        <p className="text-gray-600 mt-1">Choose the perfect card for your lifestyle</p>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${applicationStep >= 1 ? 'text-sky' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${applicationStep >= 1 ? 'bg-sky text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-semibold">Choose Card</span>
          </div>
          
          <div className={`flex-1 h-2 mx-4 rounded-full ${applicationStep >= 2 ? 'bg-sky' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${applicationStep >= 2 ? 'text-sky' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${applicationStep >= 2 ? 'bg-sky text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-semibold">Application</span>
          </div>
          
          <div className={`flex-1 h-2 mx-4 rounded-full ${applicationStep >= 3 ? 'bg-sky' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-2 ${applicationStep >= 3 ? 'text-success' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${applicationStep >= 3 ? 'bg-success text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-semibold">Confirmation</span>
          </div>
        </div>
      </Card>

      {applicationStep === 1 && (
        <>
          {/* Card Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardTypes.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all border-2 ${
                    selectedCard?.id === card.id 
                      ? 'border-sky shadow-xl' 
                      : 'border-transparent hover:border-gray-200 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                          <ApperIcon name={card.icon} size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy">{card.name}</h3>
                          <Badge variant={card.type === "Credit" ? "info" : "success"} size="small">
                            {card.type} Card
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedCard?.id === card.id && (
                        <div className="w-6 h-6 bg-sky rounded-full flex items-center justify-center">
                          <ApperIcon name="Check" size={16} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Annual Fee</p>
                        <p className="font-semibold text-navy">
                          {card.annualFee === 0 ? "Free" : formatCurrency(card.annualFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Credit Limit</p>
                        <p className="font-semibold text-navy">{card.creditLimit}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Benefit</p>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Gift" size={16} className="text-success" />
                        <span className="text-sm font-semibold text-navy">{card.cashback}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Features</p>
                      <div className="space-y-1">
                        {card.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-sky rounded-full"></div>
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                        {card.features.length > 2 && (
                          <p className="text-xs text-sky">+{card.features.length - 2} more benefits</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Eligibility Check */}
          {selectedCard && (
            <Card className="p-6 bg-gradient-to-br from-sky/5 to-blue-50">
              <h3 className="text-lg font-bold text-navy mb-4">Check Your Eligibility</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Income *
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter monthly income"
                    value={formData.income}
                    onChange={(e) => handleInputChange('income', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none"
                    value={formData.employment}
                    onChange={(e) => handleInputChange('employment', e.target.value)}
                  >
                    <option value="">Select employment type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
              </div>

              {eligibilityResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-4 ${
                    eligibilityResult.eligible 
                      ? 'bg-success/10 border border-success/20' 
                      : 'bg-error/10 border border-error/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <ApperIcon 
                      name={eligibilityResult.eligible ? "CheckCircle" : "XCircle"} 
                      size={20} 
                      className={eligibilityResult.eligible ? "text-success" : "text-error"} 
                    />
                    <div>
                      <p className={`font-semibold ${eligibilityResult.eligible ? "text-success" : "text-error"}`}>
                        {eligibilityResult.eligible ? "You're eligible!" : "Not eligible"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Eligibility Score: {eligibilityResult.score}/100
                      </p>
                      {eligibilityResult.reasons.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-2">
                          {eligibilityResult.reasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <Button
                onClick={checkEligibility}
                loading={loading}
                className="w-full md:w-auto"
              >
                <ApperIcon name="Search" size={16} className="mr-2" />
                Check Eligibility
              </Button>
            </Card>
          )}
        </>
      )}

      {applicationStep === 2 && selectedCard && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-navy mb-6">Complete Your Application</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  placeholder="Enter full name as per PAN"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PAN Card Number *
                </label>
                <Input
                  placeholder="Enter PAN number"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Address *
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none resize-none"
                rows={3}
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              ></textarea>
            </div>

            <div className="bg-sky/5 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" size={20} className="text-sky mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-2">Required Documents</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PAN Card copy</li>
                    <li>• Aadhaar Card copy</li>
                    <li>• Latest 3 months salary slips</li>
                    <li>• Bank statements (6 months)</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Documents will be collected during verification process
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setApplicationStep(1)}
                className="w-full md:w-auto"
              >
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back
              </Button>
              
              <Button
                onClick={submitApplication}
                loading={loading}
                className="w-full"
              >
                <ApperIcon name="Send" size={16} className="mr-2" />
                Submit Application
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApplyCardsPage;