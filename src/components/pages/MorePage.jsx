import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const MorePage = () => {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: "Account & Banking",
items: [
        {
          icon: "ShieldCheck",
          title: "eKYC Verification",
          description: "Complete identity verification process",
          route: "/kyc-onboarding",
          color: "from-emerald-500 to-green-600",
          badge: "Required"
        },
        {
          icon: "User",
          title: "Profile Settings",
          description: "Manage your personal information",
          route: "/profile",
          color: "from-sky to-blue-500"
        },
        {
          icon: "Receipt",
          title: "Transaction History",
          description: "View all your transactions",
          route: "/transactions",
          color: "from-teal to-green-500"
        },
        {
          icon: "Download",
          title: "Statements",
          description: "Download account statements",
          route: "/statements",
          color: "from-purple-500 to-pink-500"
        },
        {
          icon: "Target",
          title: "Savings Goals",
          description: "Track your financial goals",
          route: "/goals",
          color: "from-orange-500 to-red-500"
        }
      ]
    },
    {
      title: "Services",
      items: [
        {
          icon: "CreditCard",
          title: "Apply for Cards",
          description: "Get new credit or debit cards",
          route: "/apply-cards",
          color: "from-indigo-500 to-blue-600"
        },
        {
          icon: "PiggyBank",
          title: "Fixed Deposits",
          description: "Open FDs and recurring deposits",
          route: "/deposits",
          color: "from-green-500 to-emerald-600"
        },
        {
          icon: "TrendingUp",
          title: "Investments",
          description: "Mutual funds and SIPs",
          route: "/investments",
          color: "from-purple-600 to-violet-600"
        },
        {
          icon: "Shield",
          title: "Insurance",
          description: "Life and health insurance",
          route: "/insurance",
          color: "from-red-500 to-pink-600"
        }
      ]
    },
    {
      title: "Support & Security",
      items: [
        {
          icon: "MessageSquare",
          title: "24/7 Chat Support",
          description: "Get instant help from our team",
          route: "/support",
          color: "from-cyan-500 to-blue-500",
          badge: "Live"
        },
        {
          icon: "Lock",
          title: "Security Settings",
          description: "Biometric and app lock settings",
          route: "/security",
          color: "from-amber-500 to-orange-500"
        },
        {
          icon: "MapPin",
          title: "Branch & ATM Locator",
          description: "Find nearest branches and ATMs",
          route: "/locator",
          color: "from-emerald-500 to-green-600"
        },
        {
          icon: "Headphones",
          title: "Contact Us",
          description: "Phone, email, and feedback",
          route: "/contact",
          color: "from-slate-500 to-gray-600"
        }
      ]
    },
    {
      title: "Analytics & Insights",
      items: [
        {
          icon: "PieChart",
          title: "Spending Analytics",
          description: "Detailed expense analysis",
          route: "/analytics",
          color: "from-violet-500 to-purple-600"
        },
        {
          icon: "Calculator",
          title: "Financial Calculator",
          description: "EMI, SIP, and tax calculators",
          route: "/calculator",
          color: "from-rose-500 to-pink-600"
        },
        {
          icon: "Award",
          title: "Credit Score",
          description: "Check and improve your score",
          route: "/credit-score",
          color: "from-yellow-500 to-orange-500",
          badge: "Free"
        },
        {
          icon: "Gift",
          title: "Offers & Rewards",
          description: "Exclusive deals and cashbacks",
          route: "/offers",
          color: "from-pink-500 to-rose-600",
          badge: "New"
        }
      ]
    }
  ];

const handleItemClick = (route) => {
    if (route === "/support") {
      // Simulate chat support
      console.log("Opening chat support...");
    } else {
      navigate(route);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">More Services</h1>
        <p className="text-gray-600 mt-1">Explore all banking services and features</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-sky/5 to-blue-50">
          <div className="w-12 h-12 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Star" size={24} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-navy">4.8</p>
          <p className="text-sm text-gray-600">App Rating</p>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-teal/5 to-green-50">
          <div className="w-12 h-12 bg-gradient-to-br from-teal to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Users" size={24} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-navy">10M+</p>
          <p className="text-sm text-gray-600">Customers</p>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-purple/5 to-purple-50">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="MapPin" size={24} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-navy">5000+</p>
          <p className="text-sm text-gray-600">Branches</p>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-orange/5 to-orange-50">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" size={24} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-navy">24/7</p>
          <p className="text-sm text-gray-600">Support</p>
        </Card>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <div key={section.title} className="space-y-4">
          <h2 className="text-xl font-bold text-navy">{section.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:shadow-xl border-0 bg-gradient-to-br from-white to-gray-50"
                  onClick={() => handleItemClick(item.route)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center premium-shadow-lg`}>
                        <ApperIcon 
                          name={item.icon} 
                          size={24} 
                          className="text-white" 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-navy">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "Live" ? "success" : item.badge === "New" ? "warning" : "info"}
                              size="small"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <ApperIcon 
                      name="ChevronRight" 
                      size={20} 
                      className="text-gray-400 group-hover:text-sky transition-colors" 
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Emergency Contacts */}
      <Card className="p-6 bg-gradient-to-r from-error/5 to-red-50 border border-error/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-error to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Phone" size={24} className="text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-navy mb-2">Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Lost Card Helpline</p>
                <p className="text-lg font-bold text-error">1800-XXX-XXXX</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Fraud Report</p>
                <p className="text-lg font-bold text-error">1800-XXX-YYYY</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky to-teal rounded-xl flex items-center justify-center">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">VaultPay v2.1.0</h3>
              <p className="text-sm text-gray-600">Secure Digital Banking</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <button className="hover:text-sky transition-colors">Privacy Policy</button>
            <button className="hover:text-sky transition-colors">Terms of Service</button>
            <button className="hover:text-sky transition-colors">About Us</button>
          </div>
          
          <p className="text-xs text-gray-500">
            Licensed by Reserve Bank of India • Member DICGC • ISO 27001 Certified
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MorePage;