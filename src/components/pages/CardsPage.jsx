import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import cardService from "@/services/api/cardService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardTransactions, setCardTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      loadCardTransactions(selectedCard.Id);
    }
  }, [selectedCard]);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cardService.getAll();
      setCards(data);
      if (data.length > 0) {
        setSelectedCard(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCardTransactions = async (cardId) => {
    try {
      setLoadingTransactions(true);
      const transactions = await cardService.getCardTransactions(cardId);
      setCardTransactions(transactions);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleToggleCard = async (cardId) => {
    try {
      const updatedCard = await cardService.toggleCardStatus(cardId);
      setCards(prev => prev.map(card => 
        card.Id === cardId ? updatedCard : card
      ));
      
      if (selectedCard && selectedCard.Id === cardId) {
        setSelectedCard(updatedCard);
      }
      
      toast.success(`Card ${updatedCard.status === "Active" ? "activated" : "blocked"} successfully`);
    } catch (err) {
      toast.error("Failed to update card status: " + err.message);
    }
  };

  const handleGeneratePin = async (cardId) => {
    try {
      const result = await cardService.generatePin(cardId);
      if (result.success) {
        toast.success(result.message);
      }
    } catch (err) {
      toast.error("Failed to generate PIN: " + err.message);
    }
  };

  const formatCardNumber = (last4, type) => {
    return `•••• •••• •••• ${last4}`;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getCardIcon = (network) => {
    switch (network) {
      case "Visa":
        return "CreditCard";
      case "Mastercard":
        return "CreditCard";
      case "RuPay":
        return "CreditCard";
      default:
        return "CreditCard";
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load cards" 
        description={error}
        onRetry={loadCards}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <Empty 
        type="cards"
        onAction={() => toast.info("Contact support to apply for cards")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">My Cards</h1>
        <p className="text-gray-600 mt-1">Manage your debit and credit cards</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cards List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCard(card)}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden border-0 hover:shadow-xl transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.cardColor} opacity-90`}></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                  
                  <div className="relative p-6 text-white min-h-[200px]">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <Badge 
                          variant="secondary" 
                          className="text-white border-white/30 bg-white/20 mb-2"
                        >
                          {card.type}
                        </Badge>
                        <p className="text-white/80 text-sm">{card.network}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ApperIcon name={getCardIcon(card.network)} size={24} className="text-white" />
                        <Badge 
                          variant={card.status === "Active" ? "success" : "error"}
                          className="text-white border-white/30 bg-white/20"
                        >
                          {card.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-white font-mono text-lg tracking-wider">
                          {formatCardNumber(card.last4, card.type)}
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/80 text-xs">Card Holder</p>
                          <p className="text-white font-semibold">{card.cardholderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-xs">Expires</p>
                          <p className="text-white font-semibold">{card.expiryMonth}/{card.expiryYear}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Card Transactions */}
          {selectedCard && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <ApperIcon name="Receipt" size={20} className="mr-2" />
                Recent Transactions
              </h3>
              
              {loadingTransactions ? (
                <Loading />
              ) : cardTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {cardTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky/10 to-teal/10 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={transaction.type === "ATM" ? "Banknote" : transaction.type === "Online" ? "Globe" : "Store"} 
                            size={18} 
                            className="text-sky" 
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-navy">{transaction.merchant}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                            <Badge variant="secondary" size="small">
                              {transaction.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-error">
                          -{formatAmount(transaction.amount)}
                        </p>
                        <Badge variant="success" size="small">
                          {transaction.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Empty 
                  type="transactions"
                  title="No transactions found"
                  description="Recent card transactions will appear here"
                />
              )}
            </Card>
          )}
        </div>

        {/* Card Controls Sidebar */}
        {selectedCard && (
          <div className="space-y-6">
            {/* Card Limits */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy mb-4">Card Limits</h3>
              
              {selectedCard.type === "Credit" ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Credit Used</span>
                      <span className="font-semibold">
                        {formatAmount(selectedCard.limits.usedCredit)} / {formatAmount(selectedCard.limits.creditLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky to-teal h-2 rounded-full"
                        style={{ 
                          width: `${(selectedCard.limits.usedCredit / selectedCard.limits.creditLimit * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Available Credit</span>
                      <span className="font-semibold text-success">
                        {formatAmount(selectedCard.limits.availableCredit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Minimum Due</span>
                      <span className="font-semibold text-error">
                        {formatAmount(selectedCard.limits.minimumDue)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily ATM Limit</span>
                    <span className="font-semibold">
                      {formatAmount(selectedCard.limits.usedATM)} / {formatAmount(selectedCard.limits.dailyATM)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily POS Limit</span>
                    <span className="font-semibold">
                      {formatAmount(selectedCard.limits.usedPOS)} / {formatAmount(selectedCard.limits.dailyPOS)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Online Limit</span>
                    <span className="font-semibold">
                      {formatAmount(selectedCard.limits.usedOnline)} / {formatAmount(selectedCard.limits.dailyOnline)}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Card Controls */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy mb-4">Card Controls</h3>
              
              <div className="space-y-3">
                <Button
                  variant={selectedCard.status === "Active" ? "danger" : "success"}
                  size="small"
                  onClick={() => handleToggleCard(selectedCard.Id)}
                  className="w-full"
                >
                  <ApperIcon 
                    name={selectedCard.status === "Active" ? "Lock" : "Unlock"} 
                    size={16} 
                    className="mr-2" 
                  />
                  {selectedCard.status === "Active" ? "Block Card" : "Unblock Card"}
                </Button>
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleGeneratePin(selectedCard.Id)}
                  className="w-full"
                >
                  <ApperIcon name="Key" size={16} className="mr-2" />
                  Generate New PIN
                </Button>
                
                <Button
                  variant="outline"
                  size="small"
                  className="w-full"
                >
                  <ApperIcon name="Settings" size={16} className="mr-2" />
                  Set Limits
                </Button>
                
                <Button
                  variant="outline"
                  size="small"
                  className="w-full"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download Statement
                </Button>
              </div>
            </Card>

            {/* Security Features */}
            <Card className="p-6 bg-gradient-to-br from-success/5 to-green-50">
              <div className="flex items-start space-x-3">
                <ApperIcon name="ShieldCheck" size={20} className="text-success mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-2">Security Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time fraud monitoring</li>
                    <li>• Instant block/unblock</li>
                    <li>• Transaction alerts</li>
                    <li>• Secure PIN generation</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsPage;