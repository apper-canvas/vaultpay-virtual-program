import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import transactionService from "@/services/api/transactionService";
import TransactionItem from "@/components/molecules/TransactionItem";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const RecentTransactions = ({ limit = 5, showHeader = true }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecentTransactions();
  }, [limit]);

  const loadRecentTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getRecent(limit);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionClick = (transaction) => {
    // Navigate to transaction details or show modal
    console.log("Transaction clicked:", transaction);
  };

  const handleViewAll = () => {
    navigate("/transactions");
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Loading type="skeleton" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Error 
          message="Failed to load transactions" 
          description={error}
          onRetry={loadRecentTransactions}
        />
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <Empty 
          type="transactions"
          onAction={() => navigate("/transfer")}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Receipt" size={24} className="text-navy" />
            <h2 className="text-xl font-bold text-navy">Recent Transactions</h2>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            onClick={handleViewAll}
            className="text-sky hover:text-teal"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.Id}
            transaction={transaction}
            onClick={handleTransactionClick}
            index={index}
          />
        ))}
      </div>

      {showHeader && transactions.length >= limit && (
        <div className="p-4 bg-gray-50 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewAll}
            className="w-full flex items-center justify-center space-x-2 py-3 text-sky hover:text-teal font-semibold transition-colors"
          >
            <span>View All Transactions</span>
            <ApperIcon name="ArrowRight" size={16} />
          </motion.button>
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;