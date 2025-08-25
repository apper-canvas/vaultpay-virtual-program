import savingsGoalsData from "@/services/mockData/savingsGoals.json";

// Simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

class SavingsGoalService {
  constructor() {
    this.goals = [...savingsGoalsData];
    this.nextId = Math.max(...this.goals.map(goal => goal.Id)) + 1;
  }

  async getAll() {
    await delay();
    return [...this.goals];
  }

  async getById(id) {
    await delay();
    const goal = this.goals.find(goal => goal.Id === parseInt(id));
    if (!goal) {
      throw new Error("Savings goal not found");
    }
    return { ...goal };
  }

  async create(goalData) {
    await delay();
    const newGoal = {
      Id: this.nextId++,
      ...goalData,
      currentAmount: 0,
      monthlyContribution: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.goals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, updatedData) {
    await delay();
    const goalIndex = this.goals.findIndex(goal => goal.Id === parseInt(id));
    if (goalIndex === -1) {
      throw new Error("Savings goal not found");
    }
    
    this.goals[goalIndex] = {
      ...this.goals[goalIndex],
      ...updatedData,
      Id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.goals[goalIndex] };
  }

  async delete(id) {
    await delay();
    const goalIndex = this.goals.findIndex(goal => goal.Id === parseInt(id));
    if (goalIndex === -1) {
      throw new Error("Savings goal not found");
    }
    
    const deletedGoal = this.goals.splice(goalIndex, 1)[0];
    return { ...deletedGoal };
  }

  async addContribution(id, amount) {
    await delay();
    const goalIndex = this.goals.findIndex(goal => goal.Id === parseInt(id));
    if (goalIndex === -1) {
      throw new Error("Savings goal not found");
    }

    const goal = this.goals[goalIndex];
    const newCurrentAmount = goal.currentAmount + parseFloat(amount);
    
    // Don't allow contributions that exceed the target
    if (newCurrentAmount > goal.targetAmount) {
      throw new Error("Contribution would exceed target amount");
    }

    // Update the goal with new contribution
    this.goals[goalIndex] = {
      ...goal,
      currentAmount: newCurrentAmount,
      monthlyContribution: this.calculateMonthlyContribution(goal, amount),
      updatedAt: new Date().toISOString()
    };

    return { ...this.goals[goalIndex] };
  }

  calculateMonthlyContribution(goal, newContribution) {
    // Simple calculation: average of current monthly contribution and new contribution
    // In a real app, this would track contribution history
    const currentMonthly = goal.monthlyContribution || 0;
    return (currentMonthly + newContribution) / 2;
  }

  async getProgressSummary() {
    await delay();
    const totalGoals = this.goals.length;
    const completedGoals = this.goals.filter(goal => 
      goal.currentAmount >= goal.targetAmount
    ).length;
    
    const totalTargetAmount = this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress: overallProgress.toFixed(1)
    };
  }

  async getUpcomingDeadlines(daysAhead = 30) {
    await delay();
    const now = new Date();
    const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
    
    return this.goals.filter(goal => {
      const targetDate = new Date(goal.targetDate);
      return targetDate >= now && targetDate <= futureDate && goal.currentAmount < goal.targetAmount;
    }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }

  async getGoalsByStatus(status = "active") {
    await delay();
    return this.goals.filter(goal => {
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
      
      switch (status) {
        case "completed":
          return progressPercentage >= 100;
        case "almost_complete":
          return progressPercentage >= 75 && progressPercentage < 100;
        case "in_progress":
          return progressPercentage > 0 && progressPercentage < 75;
        case "just_started":
          return progressPercentage === 0;
        default:
          return progressPercentage < 100; // active goals
      }
    });
  }
}

export default new SavingsGoalService();