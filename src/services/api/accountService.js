import accountsData from "@/services/mockData/accounts.json";

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class AccountService {
  constructor() {
    this.accounts = [...accountsData];
  }

  async getAll() {
    await delay();
    return [...this.accounts];
  }

  async getById(id) {
    await delay();
    const account = this.accounts.find(account => account.Id === parseInt(id));
    if (!account) {
      throw new Error("Account not found");
    }
    return { ...account };
  }

  async getTotalBalance() {
    await delay();
    return this.accounts.reduce((total, account) => {
      if (account.type !== "Fixed Deposit") {
        return total + account.balance;
      }
      return total;
    }, 0);
  }

  async getPrimaryAccount() {
    await delay();
    const primary = this.accounts.find(account => account.type === "Savings");
    return primary ? { ...primary } : null;
  }

  async updateBalance(id, newBalance) {
    await delay();
    const accountIndex = this.accounts.findIndex(account => account.Id === parseInt(id));
    if (accountIndex === -1) {
      throw new Error("Account not found");
    }
    this.accounts[accountIndex].balance = newBalance;
    return { ...this.accounts[accountIndex] };
  }
}

export default new AccountService();