import { toast } from "react-toastify";

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock credit score data
let creditScoreData = {
  currentScore: 742,
  previousScore: 728,
  monthlyChange: 14,
  lastUpdated: "2024-12-07T10:00:00Z",
  nextUpdateDays: 23,
  utilization: 28,
  paymentHistory: 96,
  activeAccounts: 5,
  totalCreditLimit: 850000,
  creditAge: 8.5,
  hardInquiries: 2,
  factors: [
    {
      name: "Payment History",
      description: "Your track record of on-time payments",
      score: 96,
      impact: "positive",
      icon: "CheckCircle",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Credit Utilization",
      description: "How much credit you're using vs. available",
      score: 72,
      impact: "neutral",
      icon: "CreditCard",
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Credit History Length",
      description: "How long you've had credit accounts",
      score: 88,
      impact: "positive",
      icon: "Clock",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Credit Mix",
      description: "Variety of credit account types",
      score: 65,
      impact: "neutral",
      icon: "BarChart",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "New Credit",
      description: "Recently opened accounts and inquiries",
      score: 58,
      impact: "negative",
      icon: "AlertTriangle",
      color: "from-red-500 to-red-600"
    }
  ],
  improvementTips: [
    {
      title: "Lower Credit Utilization",
      description: "Keep your credit card balances below 30% of your credit limits",
      impact: 25,
      timeframe: "2-3 months",
      icon: "TrendingDown",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Pay Bills On Time",
      description: "Set up automatic payments to ensure you never miss due dates",
      impact: 35,
      timeframe: "3-6 months",
      icon: "Calendar",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Avoid New Hard Inquiries",
      description: "Limit applications for new credit cards or loans",
      impact: 15,
      timeframe: "6-12 months",
      icon: "Shield",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Keep Old Accounts Open",
      description: "Maintain older credit accounts to improve your credit history",
      impact: 20,
      timeframe: "Ongoing",
      icon: "Archive",
      color: "from-teal-500 to-teal-600"
    }
  ]
};

let scoreHistory = [
  { Id: 1, date: "2024-06-01", score: 698, change: -5 },
  { Id: 2, date: "2024-07-01", score: 712, change: 14 },
  { Id: 3, date: "2024-08-01", score: 720, change: 8 },
  { Id: 4, date: "2024-09-01", score: 718, change: -2 },
  { Id: 5, date: "2024-10-01", score: 728, change: 10 },
  { Id: 6, date: "2024-11-01", score: 742, change: 14 }
];

let nextId = 7;

class CreditScoreService {
  async getCurrentScore() {
    await delay(600);
    return { ...creditScoreData };
  }

  async getScoreHistory(months = 12) {
    await delay(400);
    return scoreHistory
      .slice(-months)
      .map(entry => ({ ...entry }));
  }

  async refreshScore() {
    await delay(1200);
    
    // Simulate score update with small random change
    const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
    const newScore = Math.max(300, Math.min(850, creditScoreData.currentScore + change));
    
    creditScoreData.previousScore = creditScoreData.currentScore;
    creditScoreData.currentScore = newScore;
    creditScoreData.monthlyChange = change;
    creditScoreData.lastUpdated = new Date().toISOString();
    creditScoreData.nextUpdateDays = 30;
    
    // Add to history
    scoreHistory.push({
      Id: nextId++,
      date: new Date().toISOString(),
      score: newScore,
      change: change
    });
    
    // Keep only last 24 entries
    if (scoreHistory.length > 24) {
      scoreHistory = scoreHistory.slice(-24);
    }
    
    return { ...creditScoreData };
  }

  async getScoreTrend(period = '6months') {
    await delay(300);
    
    const periods = {
      '3months': 3,
      '6months': 6,
      '1year': 12,
      '2years': 24
    };
    
    const months = periods[period] || 6;
    const trend = scoreHistory.slice(-months);
    
    return {
      data: trend,
      averageChange: trend.reduce((sum, entry) => sum + entry.change, 0) / trend.length,
      trend: trend.length > 1 ? 
        (trend[trend.length - 1].score > trend[0].score ? 'improving' : 'declining') : 
        'stable'
    };
  }

  async getFactorDetails(factorName) {
    await delay(200);
    
    const factor = creditScoreData.factors.find(f => f.name === factorName);
    if (!factor) {
      throw new Error("Factor not found");
    }
    
    // Return detailed information about the factor
    const factorDetails = {
      ...factor,
      history: [
        { month: 'Jan', value: factor.score - 8 },
        { month: 'Feb', value: factor.score - 5 },
        { month: 'Mar', value: factor.score - 3 },
        { month: 'Apr', value: factor.score - 1 },
        { month: 'May', value: factor.score + 2 },
        { month: 'Jun', value: factor.score }
      ],
      recommendations: this.getFactorRecommendations(factorName)
    };
    
    return factorDetails;
  }

  getFactorRecommendations(factorName) {
    const recommendations = {
      "Payment History": [
        "Set up automatic payments for all bills",
        "Pay at least the minimum amount on time",
        "Consider payment reminders or alerts"
      ],
      "Credit Utilization": [
        "Keep balances below 30% of credit limits",
        "Pay down existing balances",
        "Consider requesting credit limit increases"
      ],
      "Credit History Length": [
        "Keep older accounts open",
        "Avoid closing your oldest credit card",
        "Use old accounts occasionally to keep them active"
      ],
      "Credit Mix": [
        "Consider having different types of credit",
        "Maintain a mix of revolving and installment credit",
        "Don't open accounts just for credit mix"
      ],
      "New Credit": [
        "Avoid opening multiple accounts in short periods",
        "Only apply for credit when necessary",
        "Space out credit applications"
      ]
    };
    
    return recommendations[factorName] || [];
  }

  async updateCreditGoal(goalData) {
    await delay(500);
    
    // Validate goal data
    if (!goalData.targetScore || goalData.targetScore < 300 || goalData.targetScore > 850) {
      throw new Error("Invalid target score");
    }
    
    if (!goalData.timeframe || goalData.timeframe < 1 || goalData.timeframe > 60) {
      throw new Error("Invalid timeframe");
    }
    
    const goal = {
      Id: Date.now(),
      targetScore: goalData.targetScore,
      currentScore: creditScoreData.currentScore,
      timeframe: goalData.timeframe,
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      actions: []
    };
    
    return goal;
  }

  async getCreditRecommendations() {
    await delay(400);
    
    const score = creditScoreData.currentScore;
    let recommendations = [];
    
    if (score < 650) {
      recommendations = [
        {
          priority: 'high',
          category: 'Payment History',
          action: 'Set up automatic payments',
          impact: 'high',
          timeframe: '1-3 months'
        },
        {
          priority: 'high',
          category: 'Credit Utilization',
          action: 'Pay down credit card balances',
          impact: 'high',
          timeframe: '1-2 months'
        },
        {
          priority: 'medium',
          category: 'Credit Mix',
          action: 'Consider a secured credit card',
          impact: 'medium',
          timeframe: '3-6 months'
        }
      ];
    } else if (score < 750) {
      recommendations = [
        {
          priority: 'medium',
          category: 'Credit Utilization',
          action: 'Lower utilization below 10%',
          impact: 'medium',
          timeframe: '2-4 months'
        },
        {
          priority: 'low',
          category: 'Credit History',
          action: 'Keep old accounts active',
          impact: 'low',
          timeframe: '6-12 months'
        }
      ];
    } else {
      recommendations = [
        {
          priority: 'low',
          category: 'Maintenance',
          action: 'Monitor credit report regularly',
          impact: 'preventive',
          timeframe: 'Ongoing'
        }
      ];
    }
    
    return recommendations;
  }

  async simulateScoreImprovement(actions) {
    await delay(800);
    
    // Calculate potential score improvement based on actions
    const actionImpacts = {
      'pay_down_balances': 15,
      'set_autopay': 20,
      'dispute_errors': 25,
      'increase_limits': 10,
      'diversify_credit': 8
    };
    
    const totalImpact = actions.reduce((sum, action) => {
      return sum + (actionImpacts[action] || 0);
    }, 0);
    
    const projectedScore = Math.min(850, creditScoreData.currentScore + totalImpact);
    
    return {
      currentScore: creditScoreData.currentScore,
      projectedScore,
      improvement: projectedScore - creditScoreData.currentScore,
      timeframe: '3-6 months',
      actions: actions.map(action => ({
        action,
        impact: actionImpacts[action] || 0,
        description: this.getActionDescription(action)
      }))
    };
  }

  getActionDescription(action) {
    const descriptions = {
      'pay_down_balances': 'Pay down credit card balances to reduce utilization',
      'set_autopay': 'Set up automatic payments to ensure on-time payments',
      'dispute_errors': 'Dispute any errors found on your credit report',
      'increase_limits': 'Request credit limit increases to lower utilization ratio',
      'diversify_credit': 'Add different types of credit accounts'
    };
    
    return descriptions[action] || 'Unknown action';
  }

  // Credit monitoring features
  async enableMonitoring() {
    await delay(600);
    
    return {
      enabled: true,
      features: [
        'Real-time score alerts',
        'Credit report monitoring',
        'Identity theft protection',
        'Monthly score updates',
        'Personalized recommendations'
      ],
      nextAlert: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async getAlerts() {
    await delay(300);
    
    return [
      {
        Id: 1,
        type: 'score_change',
        title: 'Credit Score Updated',
        message: 'Your credit score increased by 14 points',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
      },
      {
        Id: 2,
        type: 'new_account',
        title: 'New Account Detected',
        message: 'A new credit account was opened in your name',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'warning'
      }
    ];
  }

  // Utility methods
  getScoreRange(score) {
    if (score >= 800) return { range: 'Exceptional', color: 'green' };
    if (score >= 740) return { range: 'Very Good', color: 'blue' };
    if (score >= 670) return { range: 'Good', color: 'yellow' };
    if (score >= 580) return { range: 'Fair', color: 'orange' };
    return { range: 'Poor', color: 'red' };
  }

  calculateTimeToGoal(currentScore, targetScore, monthlyImprovement = 10) {
    const difference = targetScore - currentScore;
    if (difference <= 0) return 0;
    
    return Math.ceil(difference / monthlyImprovement);
  }
}

export default new CreditScoreService();