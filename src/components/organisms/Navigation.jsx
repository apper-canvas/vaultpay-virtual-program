import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

const navigationItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "Transfer", icon: "ArrowRightLeft", path: "/transfer" },
    { name: "Bills", icon: "FileText", path: "/bills" },
    { name: "Savings", icon: "Target", path: "/savings-goals" },
    { name: "Cards", icon: "CreditCard", path: "/cards" },
    { name: "Profile", icon: "User", path: "/profile" },
    { name: "More", icon: "Grid3x3", path: "/more" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden lg:flex fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 flex-col premium-shadow-lg z-40">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky to-teal rounded-xl flex items-center justify-center">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text">VaultPay</h1>
              <p className="text-sm text-gray-600">Digital Banking</p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-sky/10 to-teal/10 text-sky border-l-4 border-sky"
                    : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                }`}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={isActive(item.path) ? "text-sky" : "text-gray-500"}
                />
                <span className="font-semibold">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

<div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-sky/10 to-teal/10 rounded-xl p-4 text-center">
            <ApperIcon name="MessageCircle" size={32} className="text-sky mx-auto mb-2" />
            <p className="text-sm font-semibold text-navy mb-1">AI Chat Support</p>
            <p className="text-xs text-gray-600">Get instant help 24/7</p>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Visible on mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 premium-shadow-lg">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "text-sky bg-sky/5"
                  : "text-gray-600"
              }`}
            >
              <ApperIcon 
                name={item.icon} 
                size={22} 
                className={isActive(item.path) ? "text-sky" : "text-gray-500"}
              />
              <span className={`text-xs font-medium ${
                isActive(item.path) ? "text-sky" : "text-gray-600"
              }`}>
                {item.name}
              </span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar - Visible on mobile only */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 premium-shadow">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky to-teal rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={18} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-lg gradient-text">VaultPay</h1>
          </div>

<div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => handleNavigation('/profile')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ApperIcon name="User" size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for mobile layouts */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navigation;