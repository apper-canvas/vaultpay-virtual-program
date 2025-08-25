import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(null); // 'personal', 'security', 'preferences', null
  
  // Mock user data - would come from service in real app
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@vaultpay.com",
    phone: "+91 9876543210",
    dateOfBirth: "1990-01-15",
    address: "123 Tech Street, Bangalore, Karnataka 560001",
    accountNumber: "****1234",
    ifscCode: "VPAY0001234",
    accountStatus: "Active",
    joinDate: "2023-01-15",
    kycStatus: "Verified",
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: "English"
  });

  const [editForm, setEditForm] = useState({});

  const handleEdit = (section) => {
    setEditMode(section);
    setEditForm({ ...userProfile });
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserProfile({ ...editForm });
      setEditMode(null);
      toast.success(`${section} updated successfully!`);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditForm({});
  };

  const handleToggleNotification = async (type) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserProfile(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
      
      const notificationName = type.replace(/([A-Z])/g, ' $1').toLowerCase();
      toast.success(`${notificationName} ${userProfile[type] ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error("Failed to update notification setting");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-sky to-teal rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold mb-1">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-white/80 mb-2">{userProfile.email}</p>
              <div className="flex items-center space-x-3">
                <Badge variant="success" className="bg-white/20 text-white border-white/30">
                  <ApperIcon name="Shield" size={14} className="mr-1" />
                  {userProfile.kycStatus}
                </Badge>
                <Badge variant="success" className="bg-white/20 text-white border-white/30">
                  {userProfile.accountStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="User" size={20} className="text-sky" />
              <h2 className="text-lg font-bold text-navy">Personal Information</h2>
            </div>
            {editMode !== 'personal' && (
              <Button 
                variant="ghost" 
                size="small"
                onClick={() => handleEdit('personal')}
                className="text-sky hover:text-sky/80"
              >
                <ApperIcon name="Edit3" size={16} className="mr-1" />
                Edit
              </Button>
            )}
          </div>

          {editMode === 'personal' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={editForm.firstName || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, firstName: e.target.value}))}
                />
                <Input
                  label="Last Name"
                  value={editForm.lastName || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, lastName: e.target.value}))}
                />
              </div>
              
              <Input
                label="Email Address"
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm(prev => ({...prev, email: e.target.value}))}
              />
              
              <Input
                label="Phone Number"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm(prev => ({...prev, phone: e.target.value}))}
              />
              
              <Input
                label="Date of Birth"
                type="date"
                value={editForm.dateOfBirth || ''}
                onChange={(e) => setEditForm(prev => ({...prev, dateOfBirth: e.target.value}))}
              />
              
              <Input
                label="Address"
                value={editForm.address || ''}
                onChange={(e) => setEditForm(prev => ({...prev, address: e.target.value}))}
                multiline
                rows={3}
              />
              
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => handleSave('Personal Information')}
                  loading={loading}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <p className="text-navy font-semibold">{userProfile.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <p className="text-navy font-semibold">{userProfile.lastName}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-navy font-semibold">{userProfile.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-navy font-semibold">{userProfile.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-navy font-semibold">{formatDate(userProfile.dateOfBirth)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-navy font-semibold text-sm leading-relaxed">{userProfile.address}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Account & Security */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={20} className="text-success" />
              <h2 className="text-lg font-bold text-navy">Security & Account</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="font-semibold text-navy mb-3">Account Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Number</span>
                  <span className="font-mono text-navy">{userProfile.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">IFSC Code</span>
                  <span className="font-mono text-navy">{userProfile.ifscCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-navy">{formatDate(userProfile.joinDate)}</span>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-navy mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Smartphone" size={18} className="text-sky" />
                    <div>
                      <p className="text-sm font-medium text-navy">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Extra security for your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('twoFactorEnabled')}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      userProfile.twoFactorEnabled ? 'bg-success' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      userProfile.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <Button variant="ghost" className="w-full justify-start text-sky">
                  <ApperIcon name="Key" size={16} className="mr-2" />
                  Change Password
                </Button>

                <Button variant="ghost" className="w-full justify-start text-sky">
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download Account Statement
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences & Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Settings" size={20} className="text-teal" />
              <h2 className="text-lg font-bold text-navy">Preferences</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <div>
              <h3 className="font-semibold text-navy mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" size={16} className="text-sky" />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('emailNotifications')}
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      userProfile.emailNotifications ? 'bg-success' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      userProfile.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="MessageSquare" size={16} className="text-sky" />
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('smsNotifications')}
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      userProfile.smsNotifications ? 'bg-success' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      userProfile.smsNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Bell" size={16} className="text-sky" />
                    <span className="text-sm text-gray-700">Push Notifications</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('pushNotifications')}
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      userProfile.pushNotifications ? 'bg-success' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      userProfile.pushNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-navy mb-4">App Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Moon" size={16} className="text-sky" />
                    <span className="text-sm text-gray-700">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotification('darkMode')}
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      userProfile.darkMode ? 'bg-success' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      userProfile.darkMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Globe" size={16} className="text-sky" />
                    <span className="text-sm text-gray-700">Language</span>
                  </div>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 text-navy focus:outline-none focus:border-sky">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-navy mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-sky">
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Data
                </Button>
                <Button variant="ghost" className="w-full justify-start text-warning">
                  <ApperIcon name="LogOut" size={16} className="mr-2" />
                  Sign Out
                </Button>
                <Button variant="ghost" className="w-full justify-start text-error">
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;