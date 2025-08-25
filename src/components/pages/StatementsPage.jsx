import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import transactionService from "@/services/api/transactionService";
import accountService from "@/services/api/accountService";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const StatementsPage = () => {
  const [statements, setStatements] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatement, setSelectedStatement] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [accountsData, statementsData] = await Promise.all([
        accountService.getAll(),
        loadExistingStatements()
      ]);
      
      setAccounts(accountsData);
      setStatements(statementsData);
      
      if (accountsData.length > 0) {
        setSelectedAccount(accountsData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingStatements = async () => {
    // Simulate existing statements
    const mockStatements = [];
    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), i);
      mockStatements.push({
        Id: i + 1,
        accountId: "1",
        period: format(date, "MMMM yyyy"),
        dateFrom: format(startOfMonth(date), "yyyy-MM-dd"),
        dateTo: format(endOfMonth(date), "yyyy-MM-dd"),
        transactionCount: Math.floor(Math.random() * 50) + 10,
        totalIncome: Math.floor(Math.random() * 50000) + 10000,
        totalExpenses: Math.floor(Math.random() * 40000) + 8000,
        generatedAt: format(endOfMonth(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        status: i < 2 ? "draft" : "finalized",
        type: "monthly"
      });
    }
    return mockStatements;
  };

  const generateStatement = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account");
      return;
    }

    let dateFrom, dateTo, periodLabel;

    if (selectedPeriod === "custom") {
      if (!customDateFrom || !customDateTo) {
        toast.error("Please select custom date range");
        return;
      }
      dateFrom = customDateFrom;
      dateTo = customDateTo;
      periodLabel = `${format(new Date(dateFrom), "MMM dd")} - ${format(new Date(dateTo), "MMM dd, yyyy")}`;
    } else {
      const now = new Date();
      switch (selectedPeriod) {
        case "monthly":
          dateFrom = format(startOfMonth(now), "yyyy-MM-dd");
          dateTo = format(endOfMonth(now), "yyyy-MM-dd");
          periodLabel = format(now, "MMMM yyyy");
          break;
        case "quarterly":
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          dateFrom = format(quarterStart, "yyyy-MM-dd");
          dateTo = format(new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0), "yyyy-MM-dd");
          periodLabel = `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
          break;
        case "yearly":
          dateFrom = format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd");
          dateTo = format(new Date(now.getFullYear(), 11, 31), "yyyy-MM-dd");
          periodLabel = now.getFullYear().toString();
          break;
      }
    }

    setGenerating(true);
    try {
      // Simulate statement generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactions = await transactionService.searchTransactions("", {
        dateFrom,
        dateTo
      });

      const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const newStatement = {
        Id: Math.max(...statements.map(s => s.Id), 0) + 1,
        accountId: selectedAccount,
        period: periodLabel,
        dateFrom,
        dateTo,
        transactionCount: transactions.length,
        totalIncome,
        totalExpenses,
        generatedAt: new Date().toISOString(),
        status: "draft",
        type: selectedPeriod
      };

      setStatements(prev => [newStatement, ...prev]);
      toast.success("Statement generated successfully!");
    } catch (err) {
      toast.error("Failed to generate statement");
    } finally {
      setGenerating(false);
    }
  };

  const downloadStatement = async (statement) => {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would generate and download a PDF
      const fileName = `statement_${statement.period.replace(/\s+/g, '_')}_${statement.Id}.pdf`;
      toast.success(`${fileName} downloaded successfully!`);
    } catch (err) {
      toast.error("Failed to download statement");
    }
  };

  const finalizeStatement = async (statementId) => {
    try {
      const statementIndex = statements.findIndex(s => s.Id === statementId);
      if (statementIndex === -1) return;

      const updatedStatements = [...statements];
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        status: "finalized"
      };
      
      setStatements(updatedStatements);
      toast.success("Statement finalized successfully!");
    } catch (err) {
      toast.error("Failed to finalize statement");
    }
  };

  const viewStatementDetails = (statement) => {
    setSelectedStatement(statement);
  };

  const closeStatementModal = () => {
    setSelectedStatement(null);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "finalized":
        return "success";
      case "draft":
        return "warning";
      default:
        return "secondary";
    }
  };

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
        message="Failed to load statements" 
        description={error}
        onRetry={loadInitialData}
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
                Account Statements 📄
              </h1>
              <p className="text-white/80">
                Generate and download your account statements
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Total Statements</p>
              <p className="text-2xl font-bold">{statements.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Finalized</p>
              <p className="text-2xl font-bold">
                {statements.filter(s => s.status === "finalized").length}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-1">Drafts</p>
              <p className="text-2xl font-bold">
                {statements.filter(s => s.status === "draft").length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Generate Statement */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={24} className="text-navy" />
            <h2 className="text-xl font-bold text-navy">Generate New Statement</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
            >
              {accounts.map(account => (
                <option key={account.Id} value={account.Id.toString()}>
                  {account.name} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period Type
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {selectedPeriod === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky/20 focus:border-sky"
                />
              </div>
            </>
          )}
        </div>

        <Button
          onClick={generateStatement}
          disabled={generating}
          className="w-full md:w-auto"
        >
          {generating ? (
            <>
              <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
              Generating Statement...
            </>
          ) : (
            <>
              <ApperIcon name="FileText" size={20} className="mr-2" />
              Generate Statement
            </>
          )}
        </Button>
      </Card>

      {/* Statements List */}
      <div className="grid grid-cols-1 gap-4">
        {statements.map((statement, index) => (
          <motion.div
            key={statement.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-navy">
                      Statement - {statement.period}
                    </h3>
                    <Badge variant={getStatusColor(statement.status)} size="small">
                      {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="block font-medium">Period</span>
                      <span>{format(new Date(statement.dateFrom), "MMM dd")} - {format(new Date(statement.dateTo), "MMM dd, yyyy")}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Transactions</span>
                      <span>{statement.transactionCount}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Total Income</span>
                      <span className="text-success">{formatAmount(statement.totalIncome)}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Total Expenses</span>
                      <span className="text-error">{formatAmount(statement.totalExpenses)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Generated on {format(new Date(statement.generatedAt), "PPP")}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => viewStatementDetails(statement)}
                  >
                    <ApperIcon name="Eye" size={16} className="mr-1" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => downloadStatement(statement)}
                  >
                    <ApperIcon name="Download" size={16} className="mr-1" />
                    Download
                  </Button>

                  {statement.status === "draft" && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => finalizeStatement(statement.Id)}
                    >
                      <ApperIcon name="Check" size={16} className="mr-1" />
                      Finalize
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Statement Detail Modal */}
      {selectedStatement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">
                Statement Details - {selectedStatement.period}
              </h3>
              <button
                onClick={closeStatementModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Statement Header */}
              <div className="bg-gradient-to-r from-sky/10 to-teal/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-navy">Account Statement</h4>
                  <Badge variant={getStatusColor(selectedStatement.status)}>
                    {selectedStatement.status.charAt(0).toUpperCase() + selectedStatement.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Statement ID:</span>
                    <span className="font-mono ml-2">STMT-{selectedStatement.Id.toString().padStart(6, '0')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Generated:</span>
                    <span className="ml-2">{format(new Date(selectedStatement.generatedAt), "PPP")}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Period:</span>
                    <span className="ml-2">
                      {format(new Date(selectedStatement.dateFrom), "MMM dd")} - {format(new Date(selectedStatement.dateTo), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Transactions:</span>
                    <span className="ml-2">{selectedStatement.transactionCount}</span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="ArrowUp" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-xl font-bold text-success">
                        {formatAmount(selectedStatement.totalIncome)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="ArrowDown" size={20} className="text-error" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-xl font-bold text-error">
                        {formatAmount(selectedStatement.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="TrendingUp" size={20} className="text-sky" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Flow</p>
                      <p className={`text-xl font-bold ${
                        selectedStatement.totalIncome - selectedStatement.totalExpenses >= 0 
                          ? "text-success" 
                          : "text-error"
                      }`}>
                        {formatAmount(selectedStatement.totalIncome - selectedStatement.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={closeStatementModal}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    downloadStatement(selectedStatement);
                    closeStatementModal();
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download PDF
                </Button>
                {selectedStatement.status === "draft" && (
                  <Button
                    onClick={() => {
                      finalizeStatement(selectedStatement.Id);
                      closeStatementModal();
                    }}
                    variant="primary"
                    className="flex-1"
                  >
                    <ApperIcon name="Check" size={16} className="mr-2" />
                    Finalize
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StatementsPage;