import { toast } from "react-toastify";

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock KYC data storage
let kycApplications = [];
let applicationIdCounter = 1000;

class KYCService {
  constructor() {
    this.steps = [
      { id: 'personal', title: 'Personal Information', completed: false },
      { id: 'documents', title: 'Document Upload', completed: false },
      { id: 'address', title: 'Address Verification', completed: false },
      { id: 'review', title: 'Review & Submit', completed: false }
    ];
  }

  async startApplication() {
    await delay(300);
    const applicationId = `KYC${applicationIdCounter++}`;
    
    const newApplication = {
      Id: applicationId,
      status: 'in_progress',
      currentStep: 'personal',
      personalInfo: {},
      documents: {},
      addressInfo: {},
      submittedAt: null,
      createdAt: new Date().toISOString(),
      completionPercentage: 0
    };

    kycApplications.push(newApplication);
    return { ...newApplication };
  }

  async getApplication(id) {
    await delay(200);
    const application = kycApplications.find(app => app.Id === id);
    if (!application) {
      throw new Error("KYC application not found");
    }
    return { ...application };
  }

  async savePersonalInfo(applicationId, personalInfo) {
    await delay(400);
    const application = kycApplications.find(app => app.Id === applicationId);
    if (!application) {
      throw new Error("KYC application not found");
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneNumber', 'email', 'panNumber'];
    const missingFields = requiredFields.filter(field => !personalInfo[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate PAN format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(personalInfo.panNumber)) {
      throw new Error("Invalid PAN number format");
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      throw new Error("Invalid email format");
    }

    application.personalInfo = { ...personalInfo };
    application.currentStep = 'documents';
    application.completionPercentage = 25;
    
    return { ...application };
  }

  async uploadDocument(applicationId, documentType, file) {
    await delay(800); // Simulate upload time
    const application = kycApplications.find(app => app.Id === applicationId);
    if (!application) {
      throw new Error("KYC application not found");
    }

    // Simulate document processing
    const documentInfo = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      verificationStatus: 'pending'
    };

    application.documents[documentType] = documentInfo;

    // Check if all required documents are uploaded
    const requiredDocs = ['identityProof', 'addressProof', 'photo'];
    const uploadedDocs = Object.keys(application.documents);
    const allDocsUploaded = requiredDocs.every(doc => uploadedDocs.includes(doc));

    if (allDocsUploaded) {
      application.currentStep = 'address';
      application.completionPercentage = 50;
    }

    return { ...application };
  }

  async saveAddressInfo(applicationId, addressInfo) {
    await delay(400);
    const application = kycApplications.find(app => app.Id === applicationId);
    if (!application) {
      throw new Error("KYC application not found");
    }

    // Validate required address fields
    const requiredFields = ['addressLine1', 'city', 'state', 'pincode', 'country'];
    const missingFields = requiredFields.filter(field => !addressInfo[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required address fields: ${missingFields.join(', ')}`);
    }

    // Validate pincode
    if (!/^\d{6}$/.test(addressInfo.pincode)) {
      throw new Error("Invalid pincode format");
    }

    application.addressInfo = { ...addressInfo };
    application.currentStep = 'review';
    application.completionPercentage = 75;

    return { ...application };
  }

  async submitApplication(applicationId) {
    await delay(1000); // Simulate processing time
    const application = kycApplications.find(app => app.Id === applicationId);
    if (!application) {
      throw new Error("KYC application not found");
    }

    // Final validation
    if (!application.personalInfo.firstName || !application.documents.identityProof || !application.addressInfo.addressLine1) {
      throw new Error("Application incomplete - missing required information");
    }

    application.status = 'submitted';
    application.submittedAt = new Date().toISOString();
    application.completionPercentage = 100;
    application.estimatedReviewTime = '2-3 business days';

    // Simulate automatic verification for demo
    setTimeout(() => {
      application.status = 'approved';
      application.approvedAt = new Date().toISOString();
    }, 3000);

    return { ...application };
  }

  async getApplicationStatus(applicationId) {
    await delay(200);
    const application = kycApplications.find(app => app.Id === applicationId);
    if (!application) {
      throw new Error("KYC application not found");
    }

    return {
      status: application.status,
      currentStep: application.currentStep,
      completionPercentage: application.completionPercentage,
      submittedAt: application.submittedAt,
      estimatedReviewTime: application.estimatedReviewTime
    };
  }

  async verifyOTP(applicationId, otp) {
    await delay(500);
    // Simple OTP validation for demo
    if (otp !== '123456') {
      throw new Error("Invalid OTP");
    }

    const application = kycApplications.find(app => app.Id === applicationId);
    if (application) {
      application.otpVerified = true;
    }

    return { verified: true };
  }

  getStepProgress(currentStep) {
    const steps = ['personal', 'documents', 'address', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    return {
      currentStep: currentIndex + 1,
      totalSteps: steps.length,
      percentage: ((currentIndex + 1) / steps.length) * 100
    };
  }

  validateStep(stepId, data) {
    switch (stepId) {
      case 'personal':
        return this.validatePersonalInfo(data);
      case 'documents':
        return this.validateDocuments(data);
      case 'address':
        return this.validateAddressInfo(data);
      default:
        return { isValid: true, errors: [] };
    }
  }

  validatePersonalInfo(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.length < 2) {
      errors.push("First name must be at least 2 characters");
    }
    
    if (!data.lastName || data.lastName.length < 2) {
      errors.push("Last name must be at least 2 characters");
    }
    
    if (!data.dateOfBirth) {
      errors.push("Date of birth is required");
    }
    
    if (!data.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)) {
      errors.push("Invalid PAN number format");
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email address");
    }

    return { isValid: errors.length === 0, errors };
  }

  validateDocuments(documents) {
    const errors = [];
    const requiredDocs = ['identityProof', 'addressProof', 'photo'];
    
    requiredDocs.forEach(doc => {
      if (!documents[doc]) {
        errors.push(`${doc} is required`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  validateAddressInfo(data) {
    const errors = [];
    
    if (!data.addressLine1 || data.addressLine1.length < 5) {
      errors.push("Address line 1 must be at least 5 characters");
    }
    
    if (!data.city || data.city.length < 2) {
      errors.push("City is required");
    }
    
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) {
      errors.push("Invalid pincode format");
    }

    return { isValid: errors.length === 0, errors };
  }

  // Regulatory compliance helpers
  getComplianceInfo() {
    return {
      regulations: [
        "Reserve Bank of India (RBI) Guidelines",
        "Prevention of Money Laundering Act (PMLA)",
        "Know Your Customer (KYC) Norms",
        "Aadhaar Authentication Guidelines"
      ],
      dataRetention: "7 years as per regulatory requirements",
      dataProtection: "All data encrypted and stored securely",
      privacyPolicy: "Data used only for verification purposes"
    };
  }

  getDocumentRequirements() {
    return {
      identityProof: {
        accepted: ["PAN Card", "Aadhaar Card", "Passport", "Driving License"],
        format: "PNG, JPG, JPEG, PDF",
        maxSize: "5MB",
        requirements: "Clear, legible, not expired"
      },
      addressProof: {
        accepted: ["Aadhaar Card", "Utility Bill", "Bank Statement", "Rent Agreement"],
        format: "PNG, JPG, JPEG, PDF",
        maxSize: "5MB",
        requirements: "Issued within last 3 months"
      },
      photo: {
        accepted: ["Passport-size photograph"],
        format: "PNG, JPG, JPEG",
        maxSize: "2MB",
        requirements: "Recent, clear, front-facing"
      }
    };
  }
}

export default new KYCService();