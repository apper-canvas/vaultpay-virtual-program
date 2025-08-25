import analyticsData from "@/services/mockData/analytics.json";

// Simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

class AnalyticsService {
  constructor() {
    this.analytics = [...analyticsData];
  }

  async getCurrentMonthAnalytics() {
    await delay();
    return { ...this.analytics[0] };
  }

  async getSpendingByCategory(months = 1) {
    await delay();
    const current = this.analytics[0];
    return current.categories.map(category => ({
      ...category,
      trend: Math.random() > 0.5 ? "up" : "down",
      change: (Math.random() * 30 - 15).toFixed(1) // -15% to +15%
    }));
  }
async getBudgetProgress() {
    await delay();
    const current = this.analytics[0];
    
    // Create realistic budget scenarios
    const budgetMultipliers = {
      "Food & Dining": 1.2,
      "Transportation": 1.4,
      "Shopping": 0.9, // Over budget scenario
      "Utilities": 1.6,
      "Healthcare": 2.0
    };
    
    const categories = current.categories.map(category => {
      const multiplier = budgetMultipliers[category.name] || 1.3;
      const budget = Math.floor(category.amount * multiplier);
      const isOverBudget = category.amount > budget;
      
      return {
        ...category,
        budget,
        isOverBudget,
        remainingBudget: budget - category.amount,
        utilizationPercentage: Math.min((category.amount / budget * 100), 150).toFixed(1)
      };
    });
    
    const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
    const remainingBudget = totalBudget - current.totalSpent;
    
    return {
      totalBudget,
      totalSpent: current.totalSpent,
      budgetUsed: ((current.totalSpent / totalBudget) * 100).toFixed(1),
      remainingBudget,
      categories,
      alertsCount: categories.filter(cat => cat.isOverBudget).length,
      warningsCount: categories.filter(cat => !cat.isOverBudget && (cat.amount / cat.budget * 100) >= 75).length
    };
  }

  async getBudgetAnalytics() {
    await delay();
    const budgetData = await this.getBudgetProgress();
    const current = this.analytics[0];
    
    // Generate budget insights
    const insights = [];
    const overBudgetCategories = budgetData.categories.filter(cat => cat.isOverBudget);
    const highUsageCategories = budgetData.categories.filter(cat => !cat.isOverBudget && (cat.amount / cat.budget * 100) >= 75);
    
    if (overBudgetCategories.length > 0) {
      insights.push(`You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}`);
    }
    
    if (highUsageCategories.length > 0) {
      insights.push(`${highUsageCategories.length} ${highUsageCategories.length === 1 ? 'category is' : 'categories are'} nearing budget limits`);
    }
    
    const bestCategory = budgetData.categories.reduce((best, cat) => {
      const currentUsage = cat.amount / cat.budget * 100;
      const bestUsage = best.amount / best.budget * 100;
      return currentUsage < bestUsage ? cat : best;
    });
    
    insights.push(`Great job managing your ${bestCategory.name} spending!`);
    
    if (budgetData.remainingBudget > 0) {
      insights.push(`You have ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(budgetData.remainingBudget)} left in your budget`);
    }
    
    return {
      ...budgetData,
      insights,
      recommendations: [
        "Consider setting up spending alerts at 75% of budget",
        "Review and adjust budgets monthly based on spending patterns",
        "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings"
      ]
    };
  }

  async getSavingsProgress() {
    await delay();
    const current = this.analytics[0];
    return {
      savingsGoal: current.savingsGoal,
      savedThisMonth: current.savedThisMonth,
      progressPercentage: (current.savedThisMonth / current.savingsGoal * 100).toFixed(1),
      projectedSavings: current.savedThisMonth * 12,
      monthlyTarget: current.savingsGoal / 12
    };
  }

  async getInsights() {
    await delay();
    const current = this.analytics[0];
    const additionalInsights = [
      "You saved ₹2,500 by cooking at home this month",
      "Your transportation costs decreased by 20%",
      "Consider setting up an auto-transfer to savings",
      "You're spending 5% more on subscriptions than last month"
    ];
    
    return [
      ...current.insights,
      ...additionalInsights.slice(0, 2)
    ];
  }

  async getMonthlyComparison(months = 6) {
    await delay();
    // Generate mock monthly data
    const monthlyData = [];
    const monthNames = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    
    for (let i = 0; i < months; i++) {
      monthlyData.push({
        month: monthNames[i] || `Month ${i + 1}`,
        income: 45000 + Math.random() * 10000,
        expenses: 30000 + Math.random() * 15000,
        savings: 10000 + Math.random() * 8000
      });
    }
    
    return monthlyData;
  }
}

export default new AnalyticsService();