import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import transactionService from "@/services/api/transactionService";
import TransactionItem from "@/components/molecules/TransactionItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const categories = [
    "All Categories",
    "Food & Dining",
    "Transportation", 
    "Shopping",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Salary",
    "Business",
    "ATM"
  ];

  const transactionTypes = [
    "All Types",
    "debit",
    "credit"
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, selectedCategory, selectedType, dateFrom, dateTo]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(transaction => transaction.category === selectedCategory);
    }

    // Type filter
    if (selectedType && selectedType !== "All Types") {
      filtered = filtered.filter(transaction => transaction.type === selectedType);
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) <= new Date(dateTo)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("");
    setDateFrom("");
    setDateTo("");
  };

  const exportTransactions = () => {
    const csvContent = [
      ["Date", "Merchant", "Description", "Amount", "Category", "Status"],
      ...filteredTransactions.map(t => [
        format(new Date(t.date), "yyyy-MM-dd"),
        t.merchant,
        t.description,
        t.amount,
        t.category,
        t.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Transactions exported successfully!");
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionModal = () => {
    setSelectedTransaction(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const calculateSummary = () => {
    const totalTransactions = filteredTransactions.length;
    const totalIncome = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return { totalTransactions, totalIncome, totalExpenses };
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        message="Failed to load transaction history" 
        description={error}
        onRetry={loadTransactions}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy via-sky to-teal rounded-xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Transaction History 📊
              </h1>
              <p className="text-white/80">
                View and manage all your financial transactions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <ApperIcon name="Filter" size={20} className="mr-2" />
                Filters
              </Button>
              <Button
                onClick={exportTransactions}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <ApperIcon name="Download" size={20} className="mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Transactions</p>
              <p className="text-2xl font-bold">{summary.totalTransactions}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-200">{formatAmount(summary.totalIncome)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-200">{formatAmount(-summary.totalExpenses)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-shrink-0"
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear
            </Button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                  >
                    {categories.map(category => (
                      <option key={category} value={category === "All Categories" ? "" : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                  >
                    {transactionTypes.map(type => (
                      <option key={type} value={type === "All Types" ? "" : type}>
                        {type === "All Types" ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Transactions List */}
      {currentTransactions.length > 0 ? (
        <>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {currentTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.Id}
                  transaction={transaction}
                  onClick={handleTransactionClick}
                  index={index}
                />
              ))}
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-sky text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Empty
          icon="Receipt"
          title="No Transactions Found"
          description="No transactions match your current filters"
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">Transaction Details</h3>
              <button
                onClick={closeTransactionModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    selectedTransaction.amount < 0 
                      ? "bg-gradient-to-br from-error/10 to-red-100" 
                      : "bg-gradient-to-br from-success/10 to-green-100"
                  }`}>
                    <ApperIcon 
                      name={selectedTransaction.amount < 0 ? "ArrowDown" : "ArrowUp"} 
                      size={24} 
                      className={selectedTransaction.amount < 0 ? "text-error" : "text-success"}
                    />
                  </div>
                  <h4 className="text-2xl font-bold text-navy mb-1">
                    {formatAmount(selectedTransaction.amount)}
                  </h4>
                  <Badge 
                    variant={selectedTransaction.status === "Completed" ? "success" : "warning"}
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Merchant</span>
                  <span className="font-semibold text-navy">{selectedTransaction.merchant}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-navy">
                    {format(new Date(selectedTransaction.date), "PPP")}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="secondary">{selectedTransaction.category}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm text-navy">TXN{selectedTransaction.Id}</span>
                </div>

                {selectedTransaction.description && (
                  <div>
                    <span className="text-gray-600 block mb-1">Description</span>
                    <p className="text-navy bg-gray-50 p-3 rounded-lg">
                      {selectedTransaction.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  onClick={closeTransactionModal}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Receipt will be sent to your email");
                    closeTransactionModal();
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  <ApperIcon name="Receipt" size={16} className="mr-2" />
                  Get Receipt
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;