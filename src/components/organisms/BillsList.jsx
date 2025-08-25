import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import billService from "@/services/api/billService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const BillsList = ({ showDueOnly = false, limit = null }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingBillId, setPayingBillId] = useState(null);

  useEffect(() => {
    loadBills();
  }, [showDueOnly]);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = showDueOnly ? await billService.getDueBills() : await billService.getAll();
      setBills(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (billId) => {
    try {
      setPayingBillId(billId);
      
      const paymentData = {
        amount: bills.find(b => b.Id === billId)?.amount,
        method: "UPI",
        accountId: "1"
      };

      const result = await billService.payBill(billId, paymentData);
      
      if (result.success) {
        toast.success(`Bill payment successful! Transaction ID: ${result.transactionId}`);
        loadBills(); // Reload bills
      }
    } catch (err) {
      toast.error("Payment failed: " + err.message);
    } finally {
      setPayingBillId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Due":
        return "warning";
      case "Overdue":
        return "error";
      case "Paid":
        return "success";
      case "Upcoming":
        return "info";
      default:
        return "secondary";
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
          message="Failed to load bills" 
          description={error}
          onRetry={loadBills}
        />
      </Card>
    );
  }

  if (bills.length === 0) {
    return (
      <Card className="p-6">
        <Empty 
          type="bills"
          onAction={() => {/* Add biller logic */}}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" size={24} className="text-navy" />
            <h2 className="text-xl font-bold text-navy">
              {showDueOnly ? "Due Bills" : "All Bills"}
            </h2>
          </div>
          
          {showDueOnly && bills.length > 0 && (
            <Badge variant="warning" size="large">
              {bills.length} Due
            </Badge>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {bills.map((bill, index) => {
          const daysUntilDue = getDaysUntilDue(bill.dueDate);
          
          return (
            <motion.div
              key={bill.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky/10 to-teal/10 rounded-full flex items-center justify-center">
                    <ApperIcon 
                      name={bill.icon} 
                      size={24} 
                      className="text-sky" 
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-navy">{bill.billerName}</h3>
                    <p className="text-sm text-gray-600">{bill.accountNumber}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        Due: {format(new Date(bill.dueDate), "MMM dd, yyyy")}
                      </span>
                      {daysUntilDue <= 3 && daysUntilDue > 0 && (
                        <Badge variant="warning" size="small">
                          {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
                        </Badge>
                      )}
                      {daysUntilDue < 0 && (
                        <Badge variant="error" size="small">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-lg font-bold text-navy">
                    {formatAmount(bill.amount)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(bill.status)} size="small">
                      {bill.status}
                    </Badge>
                    
                    {(bill.status === "Due" || bill.status === "Overdue") && (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handlePayBill(bill.Id)}
                        loading={payingBillId === bill.Id}
                        className="min-w-[80px]"
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!showDueOnly && limit && bills.length >= limit && (
        <div className="p-4 bg-gray-50 border-t">
          <Button
            variant="ghost"
            className="w-full text-sky hover:text-teal"
          >
            View All Bills
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BillsList;