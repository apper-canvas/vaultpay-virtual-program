import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: "Send Money",
      description: "UPI, IMPS, NEFT",
      icon: "Send",
      color: "from-sky to-blue-500",
      route: "/transfer"
    },
    {
      id: 2,
      title: "Pay Bills",
      description: "Utilities & more",
      icon: "FileText",
      color: "from-teal to-green-500",
      route: "/bills"
    },
    {
      id: 3,
      title: "Scan QR",
      description: "Quick payments",
      icon: "QrCode",
      color: "from-purple-500 to-pink-500",
      route: "/qr-scan"
    },
    {
      id: 4,
      title: "Add Money",
      description: "Load wallet",
      icon: "Plus",
      color: "from-orange-500 to-red-500",
      route: "/add-money"
    }
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card 
            className="p-4 cursor-pointer hover:shadow-xl border-0 bg-gradient-to-br from-white to-gray-50"
            onClick={() => handleActionClick(action.route)}
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center premium-shadow-lg`}>
                <ApperIcon 
                  name={action.icon} 
                  size={24} 
                  className="text-white" 
                />
              </div>
              
              <div>
                <h3 className="font-bold text-navy text-sm">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;