import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import billService from "@/services/api/billService";
import BillsList from "@/components/organisms/BillsList";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddBiller, setShowAddBiller] = useState(false);
  const [billerSearch, setBillerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingBillers, setSearchingBillers] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [newBillerForm, setNewBillerForm] = useState({
    accountNumber: "",
    nickname: ""
  });

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await billService.getAll();
      setBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchBillers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchingBillers(true);
      const results = await billService.searchBillers(query);
      setSearchResults(results);
    } catch (err) {
      toast.error("Search failed: " + err.message);
    } finally {
      setSearchingBillers(false);
    }
  };

  const handleBillerSearch = (value) => {
    setBillerSearch(value);
    searchBillers(value);
  };

  const handleAddBiller = async (e) => {
    e.preventDefault();
    
    if (!selectedBiller || !newBillerForm.accountNumber) {
      toast.error("Please select a biller and enter account number");
      return;
    }

    try {
      const billerData = {
        billerId: selectedBiller.id,
        billerName: selectedBiller.name,
        category: selectedBiller.category,
        accountNumber: newBillerForm.accountNumber,
        icon: selectedBiller.icon
      };

      const newBill = await billService.addBiller(billerData);
      setBills(prev => [...prev, newBill]);
      
      // Reset form
      setSelectedBiller(null);
      setNewBillerForm({ accountNumber: "", nickname: "" });
      setBillerSearch("");
      setSearchResults([]);
      setShowAddBiller(false);
      
      toast.success("Biller added successfully");
    } catch (err) {
      toast.error("Failed to add biller: " + err.message);
    }
  };

  const getBillsSummary = () => {
    const due = bills.filter(bill => bill.status === "Due" || bill.status === "Overdue").length;
    const totalAmount = bills
      .filter(bill => bill.status === "Due" || bill.status === "Overdue")
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    return { due, totalAmount };
  };

  const { due, totalAmount } = getBillsSummary();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load bills" 
        description={error}
        onRetry={loadBills}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy">Bill Payments</h1>
          <p className="text-gray-600 mt-1">Manage and pay your bills easily</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddBiller(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Add Biller</span>
        </Button>
      </div>

      {/* Bills Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-warning/5 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bills Due</p>
              <p className="text-2xl font-bold text-navy">{due}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-error/5 to-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-navy">{formatAmount(totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-error to-red-500 rounded-full flex items-center justify-center">
              <ApperIcon name="IndianRupee" size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Auto-Pay Enabled</p>
              <p className="text-2xl font-bold text-navy">2</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Repeat" size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bills List */}
      <BillsList showDueOnly={false} />

      {/* Add Biller Modal */}
      {showAddBiller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy">Add New Biller</h3>
              <button
                onClick={() => setShowAddBiller(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBiller} className="space-y-4">
              <div>
                <Input
                  label="Search Biller"
                  placeholder="Search for electricity, mobile, etc."
                  value={billerSearch}
                  onChange={(e) => handleBillerSearch(e.target.value)}
                  leftIcon={<ApperIcon name="Search" size={18} />}
                />
                
                {searchingBillers && (
                  <div className="mt-2 text-center">
                    <Loading />
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                    {searchResults.map(biller => (
                      <motion.div
                        key={biller.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedBiller(biller)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedBiller?.id === biller.id
                            ? "border-sky bg-sky/5"
                            : "border-gray-200 hover:border-sky/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                            <ApperIcon name={biller.icon} size={16} className="text-sky" />
                          </div>
                          <div>
                            <p className="font-semibold text-navy text-sm">{biller.name}</p>
                            <Badge variant="secondary" size="small">
                              {biller.category}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {selectedBiller && (
                <>
                  <Input
                    label="Account Number / Consumer ID"
                    value={newBillerForm.accountNumber}
                    onChange={(e) => setNewBillerForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter your account number"
                    required
                  />
                  
                  <Input
                    label="Nickname (Optional)"
                    value={newBillerForm.nickname}
                    onChange={(e) => setNewBillerForm(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="e.g., Home Electricity"
                  />

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                        <ApperIcon name={selectedBiller.icon} size={20} className="text-sky" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy">{selectedBiller.name}</p>
                        <Badge variant="secondary" size="small">
                          {selectedBiller.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddBiller(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={!selectedBiller || !newBillerForm.accountNumber}
                >
                  Add Biller
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BillsPage;