import cardsData from "@/services/mockData/cards.json";

// Simulate network delay
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

class CardService {
  constructor() {
    this.cards = [...cardsData];
  }

  async getAll() {
    await delay();
    return [...this.cards];
  }

  async getById(id) {
    await delay();
    const card = this.cards.find(card => card.Id === parseInt(id));
    if (!card) {
      throw new Error("Card not found");
    }
    return { ...card };
  }

  async getActiveCards() {
    await delay();
    return this.cards.filter(card => card.status === "Active");
  }

  async toggleCardStatus(id) {
    await delay(500); // Longer delay for security operation
    const cardIndex = this.cards.findIndex(card => card.Id === parseInt(id));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }

    const currentStatus = this.cards[cardIndex].status;
    this.cards[cardIndex].status = currentStatus === "Active" ? "Blocked" : "Active";
    
    // Update card color based on status
    if (this.cards[cardIndex].status === "Blocked") {
      this.cards[cardIndex].cardColor = "gradient-to-br from-gray-400 to-gray-600";
    } else {
      // Restore original color based on card type
      if (this.cards[cardIndex].type === "Credit") {
        this.cards[cardIndex].cardColor = "gradient-to-br from-teal to-sky";
      } else {
        this.cards[cardIndex].cardColor = "gradient-to-br from-navy to-sky";
      }
    }

    return { ...this.cards[cardIndex] };
  }

  async updateLimits(id, newLimits) {
    await delay(400);
    const cardIndex = this.cards.findIndex(card => card.Id === parseInt(id));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }

    this.cards[cardIndex].limits = { ...this.cards[cardIndex].limits, ...newLimits };
    return { ...this.cards[cardIndex] };
  }

  async getCardTransactions(cardId, limit = 10) {
    await delay();
    // Mock card-specific transactions
    const mockTransactions = [
      {
        Id: 101,
        amount: -1250.00,
        merchant: "Starbucks",
        date: "2024-01-20T10:30:00Z",
        status: "Completed",
        type: "POS"
      },
      {
        Id: 102,
        amount: -3200.00,
        merchant: "Amazon",
        date: "2024-01-19T16:45:00Z",
        status: "Completed",
        type: "Online"
      },
      {
        Id: 103,
        amount: -5000.00,
        merchant: "ATM Withdrawal",
        date: "2024-01-18T14:20:00Z",
        status: "Completed",
        type: "ATM"
      }
    ];

    return mockTransactions.slice(0, limit);
  }

  async generatePin(cardId) {
    await delay(800); // Longer delay for secure PIN generation
    const cardIndex = this.cards.findIndex(card => card.Id === parseInt(cardId));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }

    // Simulate PIN generation process
    return {
      success: true,
      message: "New PIN has been generated and sent to your registered mobile number",
      referenceId: `PIN${Date.now()}`
    };
  }
}

export default new CardService();