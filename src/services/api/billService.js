import billsData from "@/services/mockData/bills.json";

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class BillService {
  constructor() {
    this.bills = [...billsData];
  }

  async getAll() {
    await delay();
    return [...this.bills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getById(id) {
    await delay();
    const bill = this.bills.find(bill => bill.Id === parseInt(id));
    if (!bill) {
      throw new Error("Bill not found");
    }
    return { ...bill };
  }

  async getDueBills() {
    await delay();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate <= nextWeek && (bill.status === "Due" || bill.status === "Overdue");
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async payBill(billId, paymentData) {
    await delay(600); // Longer delay for payment processing
    const billIndex = this.bills.findIndex(bill => bill.Id === parseInt(billId));
    if (billIndex === -1) {
      throw new Error("Bill not found");
    }

    // Update bill status
    this.bills[billIndex].status = "Paid";
    this.bills[billIndex].lastPaid = new Date().toISOString().split("T")[0];
    
    // Create next bill cycle (simulate)
    const currentBill = this.bills[billIndex];
    const nextDueDate = new Date(currentBill.dueDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    
    const nextBill = {
      ...currentBill,
      Id: Math.max(...this.bills.map(b => b.Id)) + 1,
      dueDate: nextDueDate.toISOString().split("T")[0],
      status: "Upcoming"
    };
    
    this.bills.push(nextBill);

    return {
      success: true,
      transactionId: `TXN${Date.now()}`,
      paidBill: { ...this.bills[billIndex] },
      nextBill: { ...nextBill }
    };
  }

  async searchBillers(query) {
    await delay();
    // Mock biller search results
    const mockBillers = [
      { id: "ELECTRICITY_002", name: "BSES Delhi", category: "Utilities", icon: "Zap" },
      { id: "MOBILE_002", name: "Jio", category: "Mobile", icon: "Smartphone" },
      { id: "MOBILE_003", name: "Vi", category: "Mobile", icon: "Smartphone" },
      { id: "INTERNET_002", name: "BSNL Broadband", category: "Internet", icon: "Wifi" },
      { id: "GAS_002", name: "HP Gas", category: "Gas", icon: "Flame" },
      { id: "WATER_001", name: "Delhi Jal Board", category: "Utilities", icon: "Droplets" }
    ];

    if (!query) return mockBillers;
    
    return mockBillers.filter(biller =>
      biller.name.toLowerCase().includes(query.toLowerCase()) ||
      biller.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async addBiller(billerData) {
    await delay(500);
    const newBill = {
      Id: Math.max(...this.bills.map(b => b.Id)) + 1,
      billerId: billerData.billerId,
      billerName: billerData.billerName,
      amount: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Upcoming",
      category: billerData.category,
      accountNumber: billerData.accountNumber,
      icon: billerData.icon,
      lastPaid: null
    };

    this.bills.push(newBill);
    return { ...newBill };
  }
}

export default new BillService();