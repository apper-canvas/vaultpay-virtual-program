import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  placeholder = "Search transactions...", 
  onSearch, 
  onFilter,
  showFilters = false,
  filters = {},
  className = ""
}) => {
  const [query, setQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleFilterToggle = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<ApperIcon name="Search" size={18} />}
            rightIcon={
              query && (
                <button
                  onClick={() => handleSearch("")}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              )
            }
            className="pr-12"
          />
        </div>
        
        {showFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleFilterToggle}
            className="relative"
          >
            <ApperIcon name="Filter" size={18} />
            {Object.keys(filters).length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal rounded-full"></div>
            )}
          </Button>
        )}
      </div>

      {showFilterPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) => onFilter?.({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-sky focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Type
              </label>
              <select
                value={filters.type || ""}
                onChange={(e) => onFilter?.({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-sky focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Amount Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ""}
                  onChange={(e) => onFilter?.({ ...filters, minAmount: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-sky focus:outline-none text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount || ""}
                  onChange={(e) => onFilter?.({ ...filters, maxAmount: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-sky focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-600">
              {Object.keys(filters).length} filter(s) applied
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="small"
                onClick={() => onFilter?.({})}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleFilterToggle}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;