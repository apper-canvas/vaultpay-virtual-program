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
    return {
      totalBudget: 45000,
      totalSpent: current.totalSpent,
      budgetUsed: current.budgetUsed,
      remainingBudget: 45000 - current.totalSpent,
      categories: current.categories.map(category => ({
        ...category,
        budget: Math.floor(category.amount * 1.3), // Assume budget is 30% more than spent
        isOverBudget: Math.random() > 0.8 // 20% chance of being over budget
      }))
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