import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import DocumentUpload from "@/components/molecules/DocumentUpload";
import kycService from "@/services/api/kycService";

const KYCOnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] = useState(null);
  
  // Form data state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    panNumber: "",
    occupation: ""
  });
  
  const [documents, setDocuments] = useState({
    identityProof: null,
    addressProof: null,
    photo: null
  });
  
  const [addressInfo, setAddressInfo] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Basic details and identity information",
      icon: "User"
    },
    {
      id: "documents",
      title: "Document Upload", 
      description: "Upload required verification documents",
      icon: "FileText"
    },
    {
      id: "address",
      title: "Address Verification",
      description: "Current residential address details",
      icon: "MapPin"
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review all information and submit",
      icon: "CheckCircle"
    }
  ];

  useEffect(() => {
    initializeKYC();
  }, []);

  const initializeKYC = async () => {
    try {
      setLoading(true);
      const newApplication = await kycService.startApplication();
      setApplication(newApplication);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return kycService.validatePersonalInfo(personalInfo);
      case 1:
        return kycService.validateDocuments(documents);
      case 2:
        return kycService.validateAddressInfo(addressInfo);
      default:
        return { isValid: true, errors: [] };
    }
  };

  const handleNext = async () => {
    const validation = validateCurrentStep();
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setSubmitting(true);
    try {
      let updatedApplication;
      
      switch (currentStep) {
        case 0:
          updatedApplication = await kycService.savePersonalInfo(application.Id, personalInfo);
          break;
        case 1:
          // Documents are uploaded individually, just proceed
          updatedApplication = application;
          break;
        case 2:
          updatedApplication = await kycService.saveAddressInfo(application.Id, addressInfo);
          break;
      }
      
      setApplication(updatedApplication);
      setCurrentStep(prev => prev + 1);
      toast.success("Information saved successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const submittedApplication = await kycService.submitApplication(application.Id);
      setApplication(submittedApplication);
      toast.success("KYC application submitted successfully!");
      
      // Show success modal or redirect after delay
      setTimeout(() => {
        navigate("/more");
      }, 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = async (docType, file) => {
    if (!file) {
      setDocuments(prev => ({ ...prev, [docType]: null }));
      return;
    }

    try {
      await kycService.uploadDocument(application.Id, docType, file);
      setDocuments(prev => ({ ...prev, [docType]: file }));
      toast.success(`${docType} uploaded successfully`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to initialize KYC process" 
        description={error}
        onRetry={initializeKYC}
      />
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={personalInfo}
            onChange={setPersonalInfo}
          />
        );
      case 1:
        return (
          <DocumentUploadStep
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
          />
        );
      case 2:
        return (
          <AddressVerificationStep
            data={addressInfo}
            onChange={setAddressInfo}
          />
        );
      case 3:
        return (
          <ReviewStep
            personalInfo={personalInfo}
            documents={documents}
            addressInfo={addressInfo}
            application={application}
            onSubmit={handleSubmitApplication}
            submitting={submitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-navy">eKYC Verification</h1>
        <p className="text-gray-600 mt-2">Complete your identity verification to unlock all banking features</p>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index <= currentStep 
                    ? "bg-gradient-to-r from-sky to-teal text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {index < currentStep ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-semibold ${
                    index <= currentStep ? "text-navy" : "text-gray-500"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 max-w-20">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                  index < currentStep ? "bg-sky" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0 || submitting}
          >
            <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            loading={submitting}
            disabled={submitting}
          >
            Next
            <ApperIcon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      )}

      {/* Compliance Notice */}
      <Card className="p-4 bg-gradient-to-r from-sky/5 to-teal/5 border border-sky/20">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Shield" size={20} className="text-sky mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-navy mb-1">Data Security & Compliance</p>
            <p className="text-gray-600">
              All information is encrypted and processed in compliance with RBI guidelines, 
              PMLA regulations, and data protection laws. Your data is secure and used only for verification purposes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Personal Information Step Component
const PersonalInfoStep = ({ data, onChange }) => {
  const handleInputChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-navy mb-2">Personal Information</h2>
          <p className="text-gray-600">Please provide your accurate personal details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={data.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            placeholder="Enter your first name"
          />
          
          <Input
            label="Last Name"
            value={data.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            placeholder="Enter your last name"
          />
          
          <Input
            label="Date of Birth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
          
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Gender *</label>
            <select
              value={data.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky focus:ring-4 focus:ring-sky/10 focus:outline-none transition-all duration-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <Input
            label="Phone Number"
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            required
            placeholder="+91 XXXXX XXXXX"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            placeholder="your.email@example.com"
          />
          
          <Input
            label="PAN Number"
            value={data.panNumber}
            onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
            required
            placeholder="ABCDE1234F"
            maxLength="10"
          />
          
          <Input
            label="Occupation"
            value={data.occupation}
            onChange={(e) => handleInputChange("occupation", e.target.value)}
            placeholder="Your occupation"
          />
        </div>
      </div>
    </Card>
  );
};

// Document Upload Step Component
const DocumentUploadStep = ({ documents, onDocumentUpload }) => {
  const documentRequirements = kycService.getDocumentRequirements();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-navy mb-2">Document Upload</h2>
            <p className="text-gray-600">Upload clear, legible copies of the required documents</p>
          </div>

          {/* Requirements Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800 mb-2">Document Requirements:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Documents should be clear and legible</li>
                  <li>• File size should not exceed 5MB</li>
                  <li>• Supported formats: PNG, JPG, JPEG, PDF</li>
                  <li>• Documents should not be expired</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Identity Proof */}
      <DocumentUpload
        title="Identity Proof"
        description="Upload any government-issued photo ID (PAN Card, Aadhaar, Passport, Driving License)"
        required
        onFileSelect={(file) => onDocumentUpload("identityProof", file)}
      />

      {/* Address Proof */}
      <DocumentUpload
        title="Address Proof"
        description="Upload address verification document (Aadhaar, Utility Bill, Bank Statement, Rent Agreement)"
        required
        onFileSelect={(file) => onDocumentUpload("addressProof", file)}
      />

      {/* Photo */}
      <DocumentUpload
        title="Photograph"
        description="Upload a recent passport-size photograph"
        acceptedTypes="image/*"
        maxSize={2 * 1024 * 1024} // 2MB
        required
        onFileSelect={(file) => onDocumentUpload("photo", file)}
      />

      {/* Upload Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-bold text-navy">Upload Status</h3>
          {Object.entries(documentRequirements).map(([docType, requirements]) => (
            <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  documents[docType] ? "bg-success text-white" : "bg-gray-300"
                }`}>
                  {documents[docType] ? (
                    <ApperIcon name="Check" size={14} />
                  ) : (
                    <ApperIcon name="Clock" size={14} />
                  )}
                </div>
                <span className="font-medium text-navy capitalize">
                  {docType.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <Badge
                variant={documents[docType] ? "success" : "secondary"}
                size="small"
              >
                {documents[docType] ? "Uploaded" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Address Verification Step Component
const AddressVerificationStep = ({ data, onChange }) => {
  const handleInputChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-navy mb-2">Address Verification</h2>
          <p className="text-gray-600">Please provide your current residential address</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Address Line 1"
            value={data.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            required
            placeholder="House/Flat No., Building Name, Street"
          />
          
          <Input
            label="Address Line 2"
            value={data.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            placeholder="Locality, Area (Optional)"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={data.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
              placeholder="Enter your city"
            />
            
            <Input
              label="State"
              value={data.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              required
              placeholder="Enter your state"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="PIN Code"
              value={data.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              required
              placeholder="6-digit PIN code"
              maxLength="6"
            />
            
            <Input
              label="Country"
              value={data.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Review Step Component
const ReviewStep = ({ personalInfo, documents, addressInfo, application, onSubmit, submitting }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information Review */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="User" size={20} className="mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold text-navy">{personalInfo.firstName} {personalInfo.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Birth</p>
            <p className="font-semibold text-navy">{personalInfo.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold text-navy">{personalInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-600">PAN Number</p>
            <p className="font-semibold text-navy">{personalInfo.panNumber}</p>
          </div>
        </div>
      </Card>

      {/* Documents Review */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="FileText" size={20} className="mr-2" />
          Uploaded Documents
        </h3>
        <div className="space-y-3">
          {Object.entries(documents).map(([docType, file]) => (
            <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileCheck" size={16} className="text-success" />
                <span className="font-medium text-navy capitalize">
                  {docType.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <Badge variant="success" size="small">Uploaded</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Address Review */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
          <ApperIcon name="MapPin" size={20} className="mr-2" />
          Address Information
        </h3>
        <div className="text-sm">
          <p className="font-semibold text-navy mb-2">Current Address:</p>
          <p className="text-gray-700 leading-relaxed">
            {addressInfo.addressLine1}
            {addressInfo.addressLine2 && `, ${addressInfo.addressLine2}`}
            <br />
            {addressInfo.city}, {addressInfo.state} - {addressInfo.pincode}
            <br />
            {addressInfo.country}
          </p>
        </div>
      </Card>

      {/* Final Submit */}
      <Card className="p-6 bg-gradient-to-r from-sky/5 to-teal/5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-sky to-teal rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="CheckCircle" size={32} className="text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-navy mb-2">Ready to Submit</h3>
            <p className="text-gray-600 mb-6">
              Please review all the information above. Once submitted, your application will be processed within 2-3 business days.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onSubmit}
              loading={submitting}
              disabled={submitting}
              size="large"
            >
              <ApperIcon name="Send" size={20} className="mr-2" />
              Submit KYC Application
            </Button>
            
            <p className="text-xs text-gray-500">
              By submitting, you agree that all information provided is accurate and complete.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KYCOnboardingPage;