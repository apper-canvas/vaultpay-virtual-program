import transactionsData from "@/services/mockData/transactions.json";

// Simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await delay();
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay();
    const transaction = this.transactions.find(transaction => transaction.Id === parseInt(id));
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  }

  async getByAccountId(accountId) {
    await delay();
    return this.transactions
      .filter(transaction => transaction.accountId === accountId.toString())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getRecent(limit = 5) {
    await delay();
    return [...this.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async create(transactionData) {
    await delay();
    const highestId = Math.max(...this.transactions.map(t => t.Id));
    const newTransaction = {
      Id: highestId + 1,
      ...transactionData,
      date: new Date().toISOString(),
      status: "Completed"
    };
    this.transactions.unshift(newTransaction);
    return { ...newTransaction };
  }

  async searchTransactions(query, filters = {}) {
    await delay();
    let filtered = [...this.transactions];

    if (query) {
      filtered = filtered.filter(transaction => 
        transaction.merchant.toLowerCase().includes(query.toLowerCase()) ||
        transaction.description.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(transaction => transaction.category === filters.category);
    }

    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.dateTo));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default new TransactionService();