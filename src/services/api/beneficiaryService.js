import beneficiariesData from "@/services/mockData/beneficiaries.json";

// Simulate network delay
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

class BeneficiaryService {
  constructor() {
    this.beneficiaries = [...beneficiariesData];
  }

  async getAll() {
    await delay();
    return [...this.beneficiaries].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id) {
    await delay();
    const beneficiary = this.beneficiaries.find(beneficiary => beneficiary.Id === parseInt(id));
    if (!beneficiary) {
      throw new Error("Beneficiary not found");
    }
    return { ...beneficiary };
  }

  async create(beneficiaryData) {
    await delay(500); // Longer delay for verification simulation
    const highestId = Math.max(...this.beneficiaries.map(b => b.Id));
    const newBeneficiary = {
      Id: highestId + 1,
      ...beneficiaryData,
      verified: true,
      addedDate: new Date().toISOString().split("T")[0]
    };
    this.beneficiaries.push(newBeneficiary);
    return { ...newBeneficiary };
  }

  async update(id, updateData) {
    await delay();
    const beneficiaryIndex = this.beneficiaries.findIndex(beneficiary => beneficiary.Id === parseInt(id));
    if (beneficiaryIndex === -1) {
      throw new Error("Beneficiary not found");
    }
    this.beneficiaries[beneficiaryIndex] = { ...this.beneficiaries[beneficiaryIndex], ...updateData };
    return { ...this.beneficiaries[beneficiaryIndex] };
  }

  async delete(id) {
    await delay();
    const beneficiaryIndex = this.beneficiaries.findIndex(beneficiary => beneficiary.Id === parseInt(id));
    if (beneficiaryIndex === -1) {
      throw new Error("Beneficiary not found");
    }
    const deleted = this.beneficiaries.splice(beneficiaryIndex, 1)[0];
    return { ...deleted };
  }

  async searchBeneficiaries(query) {
    await delay();
    if (!query) return this.getAll();
    
    const filtered = this.beneficiaries.filter(beneficiary =>
      beneficiary.name.toLowerCase().includes(query.toLowerCase()) ||
      beneficiary.nickname.toLowerCase().includes(query.toLowerCase()) ||
      beneficiary.bankName.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export default new BeneficiaryService();