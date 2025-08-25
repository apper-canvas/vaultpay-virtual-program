import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const OffersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userRewards, setUserRewards] = useState({
    points: 2450,
    cashback: 1250,
    level: "Gold",
    nextLevelPoints: 500
  });

  // Mock offers data
  const [offers, setOffers] = useState([]);
  const [featuredOffers, setFeaturedOffers] = useState([]);

  const categories = [
    { id: "all", name: "All Offers", icon: "Grid3x3" },
    { id: "shopping", name: "Shopping", icon: "ShoppingBag" },
    { id: "food", name: "Food & Dining", icon: "Coffee" },
    { id: "travel", name: "Travel", icon: "Plane" },
    { id: "fuel", name: "Fuel", icon: "Fuel" },
    { id: "bills", name: "Bill Payments", icon: "Receipt" },
    { id: "entertainment", name: "Entertainment", icon: "Film" }
  ];

  useEffect(() => {
    loadOffersData();
  }, []);

  const loadOffersData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOffers = [
        {
          id: 1,
          title: "20% Cashback on Grocery Shopping",
          description: "Get instant cashback on grocery purchases at selected stores",
          category: "shopping",
          cashbackRate: "20%",
          maxCashback: "₹500",
          validUntil: "2024-02-29",
          terms: "Minimum transaction ₹1000. Valid at partner stores only.",
          featured: true,
          image: "grocery",
          color: "from-green-500 to-emerald-600"
        },
        {
          id: 2,
          title: "50% Off on Food Delivery",
          description: "Save big on your favorite food delivery apps",
          category: "food",
          discount: "50%",
          maxDiscount: "₹200",
          validUntil: "2024-01-31",
          terms: "Valid on first 3 orders. Maximum discount ₹200 per order.",
          featured: true,
          image: "food",
          color: "from-orange-500 to-red-500"
        },
        {
          id: 3,
          title: "10X Reward Points on Travel",
          description: "Earn 10X points on flight and hotel bookings",
          category: "travel",
          rewardMultiplier: "10X",
          validUntil: "2024-03-31",
          terms: "Valid on domestic and international bookings. Points credited within 7 days.",
          featured: false,
          image: "travel",
          color: "from-blue-500 to-indigo-600"
        },
        {
          id: 4,
          title: "₹5 Cashback per Litre on Fuel",
          description: "Instant cashback on fuel purchases at any petrol pump",
          category: "fuel",
          cashbackRate: "₹5/L",
          maxCashback: "₹300",
          validUntil: "2024-04-30",
          terms: "Valid at all fuel stations. Cashback credited instantly.",
          featured: false,
          image: "fuel",
          color: "from-yellow-500 to-orange-500"
        },
        {
          id: 5,
          title: "Zero Processing Fee on Bill Payments",
          description: "Pay utility bills without any processing charges",
          category: "bills",
          benefit: "Zero Fee",
          validUntil: "2024-12-31",
          terms: "Valid on electricity, water, gas, and broadband bill payments.",
          featured: true,
          image: "bills",
          color: "from-purple-500 to-pink-500"
        },
        {
          id: 6,
          title: "Buy 1 Get 1 Movie Tickets",
          description: "Get free movie tickets on weekend bookings",
          category: "entertainment",
          offer: "Buy 1 Get 1",
          validUntil: "2024-02-15",
          terms: "Valid on Saturday and Sunday shows. Limited to premium multiplexes.",
          featured: false,
          image: "movie",
          color: "from-indigo-500 to-purple-600"
        }
      ];

      setOffers(mockOffers);
      setFeaturedOffers(mockOffers.filter(offer => offer.featured));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOfferActivate = (offerId) => {
    toast.success("Offer activated successfully! You can now enjoy the benefits.");
    // Simulate offer activation logic
  };

  const handleRedeemRewards = () => {
    toast.success("Rewards redemption initiated! Check your account in 2-3 business days.");
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
        message="Failed to load offers" 
        description={error}
        onRetry={loadOffersData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-navy">Offers & Rewards</h1>
        <p className="text-gray-600 mt-1">Exclusive deals and rewards just for you</p>
      </div>

      {/* Rewards Summary */}
      <Card className="p-6 bg-gradient-to-r from-sky/5 to-teal/5 border border-sky/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Star" size={24} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-navy">{userRewards.points.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Reward Points</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="IndianRupee" size={24} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-navy">₹{userRewards.cashback.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Cashback</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-navy">{userRewards.level}</p>
            <p className="text-sm text-gray-600">Membership</p>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleRedeemRewards}
              className="w-full"
              variant="primary"
            >
              <ApperIcon name="Gift" size={16} className="mr-2" />
              Redeem Rewards
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              {userRewards.nextLevelPoints} points to Platinum
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon="Search"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              size="small"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name={category.icon} size={14} />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Offers */}
      {featuredOffers.length > 0 && selectedCategory === "all" && !searchTerm && (
        <div>
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center">
            <ApperIcon name="Zap" size={24} className="mr-2" />
            Featured Offers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-r ${offer.color} relative`}>
                    <div className="absolute top-4 right-4">
                      <Badge variant="success" className="bg-white/20 text-white border-white/30">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-lg">{offer.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      {offer.cashbackRate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Cashback Rate</span>
                          <span className="font-semibold text-navy">{offer.cashbackRate}</span>
                        </div>
                      )}
                      {offer.maxCashback && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Cashback</span>
                          <span className="font-semibold text-navy">{offer.maxCashback}</span>
                        </div>
                      )}
                      {offer.discount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Discount</span>
                          <span className="font-semibold text-navy">{offer.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Valid Until</span>
                        <span className="font-semibold text-navy">{new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleOfferActivate(offer.id)}
                      className="w-full"
                      variant="primary"
                    >
                      Activate Offer
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Offers */}
      <div>
        <h2 className="text-xl font-bold text-navy mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <ApperIcon name="Grid3x3" size={24} className="mr-2" />
            {selectedCategory === "all" ? "All Offers" : categories.find(c => c.id === selectedCategory)?.name} 
            <span className="ml-2 text-sm text-gray-500">({filteredOffers.length})</span>
          </div>
        </h2>
        
        {filteredOffers.length === 0 ? (
          <Card className="p-12 text-center">
            <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">No offers found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-navy">{offer.title}</h3>
                        {offer.featured && (
                          <Badge variant="warning" size="small">Featured</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    </div>
                    
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${offer.color} flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon 
                        name={categories.find(c => c.id === offer.category)?.icon || "Gift"} 
                        size={20} 
                        className="text-white" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {offer.cashbackRate && (
                      <div>
                        <p className="text-xs text-gray-500">Cashback</p>
                        <p className="font-semibold text-success">{offer.cashbackRate}</p>
                      </div>
                    )}
                    {offer.discount && (
                      <div>
                        <p className="text-xs text-gray-500">Discount</p>
                        <p className="font-semibold text-success">{offer.discount}</p>
                      </div>
                    )}
                    {offer.rewardMultiplier && (
                      <div>
                        <p className="text-xs text-gray-500">Rewards</p>
                        <p className="font-semibold text-success">{offer.rewardMultiplier} Points</p>
                      </div>
                    )}
                    {offer.benefit && (
                      <div>
                        <p className="text-xs text-gray-500">Benefit</p>
                        <p className="font-semibold text-success">{offer.benefit}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Valid Until</p>
                      <p className="font-semibold text-navy">{new Date(offer.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mb-4">
                    <p className="text-xs text-gray-500">{offer.terms}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleOfferActivate(offer.id)}
                      className="flex-1"
                      variant="primary"
                      size="small"
                    >
                      Activate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="small"
                      className="px-3"
                    >
                      <ApperIcon name="Share" size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Program Info */}
      <Card className="p-6 bg-gradient-to-r from-purple/5 to-pink-50 border border-purple/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Trophy" size={24} className="text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-navy mb-2">VaultPay Rewards Program</h3>
            <p className="text-gray-600 mb-4">
              Earn points on every transaction and unlock exclusive benefits. The more you use VaultPay, the more you earn!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <ApperIcon name="Award" size={20} className="mx-auto mb-2 text-yellow-500" />
                <p className="font-semibold text-navy">Silver</p>
                <p className="text-xs text-gray-500">0-999 points</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg border-2 border-yellow-400">
                <ApperIcon name="Medal" size={20} className="mx-auto mb-2 text-yellow-500" />
                <p className="font-semibold text-navy">Gold</p>
                <p className="text-xs text-gray-500">1000-4999 points</p>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <ApperIcon name="Crown" size={20} className="mx-auto mb-2 text-purple-500" />
                <p className="font-semibold text-navy">Platinum</p>
                <p className="text-xs text-gray-500">5000+ points</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" size="small">1 Point = ₹1 Transaction</Badge>
              <Badge variant="info" size="small">No Expiry</Badge>
              <Badge variant="premium" size="small">Instant Redemption</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OffersPage;