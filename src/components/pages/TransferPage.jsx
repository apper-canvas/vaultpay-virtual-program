import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import beneficiaryService from "@/services/api/beneficiaryService";
import accountService from "@/services/api/accountService";
import transactionService from "@/services/api/transactionService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const TransferPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transferForm, setTransferForm] = useState({
    fromAccount: "",
    toBeneficiary: "",
    amount: "",
    method: "IMPS",
    note: ""
  });
  const [processing, setProcessing] = useState(false);
  const [showNewBeneficiaryForm, setShowNewBeneficiaryForm] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
    type: "IMPS",
    nickname: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [beneficiariesData, accountsData] = await Promise.all([
        beneficiaryService.getAll(),
        accountService.getAll()
      ]);
      
      setBeneficiaries(beneficiariesData);
      setAccounts(accountsData);
      
      // Set default from account
      if (accountsData.length > 0) {
        const primary = accountsData.find(acc => acc.type === "Savings") || accountsData[0];
        setTransferForm(prev => ({ ...prev, fromAccount: primary.Id.toString() }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    if (!transferForm.fromAccount || !transferForm.toBeneficiary || !transferForm.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setProcessing(true);
      
      const selectedBeneficiary = beneficiaries.find(b => b.Id === parseInt(transferForm.toBeneficiary));
      const selectedAccount = accounts.find(a => a.Id === parseInt(transferForm.fromAccount));
      
      // Check balance
      if (selectedAccount.balance < amount) {
        toast.error("Insufficient balance");
        return;
      }

      // Create transaction
      const transactionData = {
        accountId: transferForm.fromAccount,
        amount: -amount,
        type: "debit",
        category: "Transfer",
        merchant: selectedBeneficiary.name,
        description: transferForm.note || `Transfer to ${selectedBeneficiary.name}`,
        reference: `TXN${Date.now()}`
      };

      await transactionService.create(transactionData);
      
      // Update account balance
      await accountService.updateBalance(selectedAccount.Id, selectedAccount.balance - amount);
      
      toast.success(`₹${amount.toLocaleString("en-IN")} transferred successfully to ${selectedBeneficiary.name}`);
      
      // Reset form
      setTransferForm({
        fromAccount: transferForm.fromAccount,
        toBeneficiary: "",
        amount: "",
        method: "IMPS",
        note: ""
      });
    } catch (err) {
      toast.error("Transfer failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    
    if (!newBeneficiary.name || !newBeneficiary.accountNumber || !newBeneficiary.bankCode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const beneficiary = await beneficiaryService.create(newBeneficiary);
      setBeneficiaries(prev => [...prev, beneficiary]);
      setNewBeneficiary({
        name: "",
        accountNumber: "",
        bankCode: "",
        bankName: "",
        type: "IMPS",
        nickname: ""
      });
      setShowNewBeneficiaryForm(false);
      toast.success("Beneficiary added successfully");
    } catch (err) {
      toast.error("Failed to add beneficiary: " + err.message);
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(balance);
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load transfer data" 
        description={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy">Send Money</h1>
          <p className="text-gray-600 mt-1">Transfer funds instantly with UPI, IMPS & NEFT</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowNewBeneficiaryForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="UserPlus" size={18} />
          <span>Add Beneficiary</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleTransferSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    From Account
                  </label>
                  <select
                    value={transferForm.fromAccount}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, fromAccount: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky focus:outline-none bg-white"
                    required
                  >
                    {accounts.map(account => (
                      <option key={account.Id} value={account.Id}>
                        {account.type} - {formatBalance(account.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Transfer Method
                  </label>
                  <select
                    value={transferForm.method}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky focus:outline-none bg-white"
                  >
                    <option value="IMPS">IMPS (Instant)</option>
                    <option value="NEFT">NEFT (2-3 hours)</option>
                    <option value="RTGS">RTGS (Same day)</option>
                    <option value="UPI">UPI (Instant)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Select Beneficiary
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {beneficiaries.map(beneficiary => (
                    <motion.div
                      key={beneficiary.Id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTransferForm(prev => ({ ...prev, toBeneficiary: beneficiary.Id.toString() }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        transferForm.toBeneficiary === beneficiary.Id.toString()
                          ? "border-sky bg-sky/5"
                          : "border-gray-200 hover:border-sky/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky/20 to-teal/20 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} className="text-sky" />
                        </div>
                        <div>
                          <p className="font-semibold text-navy">{beneficiary.name}</p>
                          <p className="text-sm text-gray-600">{beneficiary.bankName}</p>
                          <Badge variant="secondary" size="small" className="mt-1">
                            {beneficiary.type}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  leftIcon={<ApperIcon name="IndianRupee" size={18} />}
                  required
                />

                <Input
                  label="Note (Optional)"
                  type="text"
                  placeholder="Add a note"
                  value={transferForm.note}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, note: e.target.value }))}
                  leftIcon={<ApperIcon name="MessageSquare" size={18} />}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={processing}
                className="w-full"
              >
                <ApperIcon name="Send" size={20} className="mr-2" />
                Send Money
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Transfer Amounts */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4">Quick Amounts</h3>
            <div className="grid grid-cols-2 gap-3">
              {[500, 1000, 2000, 5000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="small"
                  onClick={() => setTransferForm(prev => ({ ...prev, amount: amount.toString() }))}
                >
                  ₹{amount.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
          </Card>

          {/* Transfer Limits */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-navy mb-4">Transfer Limits</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IMPS Daily Limit</span>
                <span className="font-semibold">₹5,00,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">NEFT Daily Limit</span>
                <span className="font-semibold">₹10,00,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">UPI Daily Limit</span>
                <span className="font-semibold">₹1,00,000</span>
              </div>
            </div>
          </Card>

          {/* Security Info */}
          <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Shield" size={20} className="text-success mt-1" />
              <div>
                <h4 className="font-semibold text-navy mb-2">Secure Transfers</h4>
                <p className="text-sm text-gray-600">
                  All transfers are protected with multi-layer security and real-time fraud monitoring.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      {showNewBeneficiaryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy">Add New Beneficiary</h3>
              <button
                onClick={() => setShowNewBeneficiaryForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <Input
                label="Beneficiary Name"
                value={newBeneficiary.name}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <Input
                label="Account Number"
                value={newBeneficiary.accountNumber}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, accountNumber: e.target.value }))}
                required
              />
              
              <Input
                label="IFSC Code"
                value={newBeneficiary.bankCode}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, bankCode: e.target.value }))}
                required
              />
              
              <Input
                label="Bank Name"
                value={newBeneficiary.bankName}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, bankName: e.target.value }))}
              />
              
              <Input
                label="Nickname (Optional)"
                value={newBeneficiary.nickname}
                onChange={(e) => setNewBeneficiary(prev => ({ ...prev, nickname: e.target.value }))}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewBeneficiaryForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Add Beneficiary
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransferPage;