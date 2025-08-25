import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const DocumentUpload = ({ 
  title, 
  description, 
  acceptedTypes = "image/*,application/pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
  required = false,
  onFileSelect,
  className 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === 'application/pdf') return file.type === 'application/pdf';
      return file.type === type;
    });

    if (!isValidType) {
      toast.error('Please select a valid file type (PNG, JPG, JPEG, or PDF)');
      return false;
    }

    return true;
  };

  const createFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview(null); // PDF preview would require additional library
    }
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setUploading(false);
          toast.success(`${file.name} uploaded successfully`);
          onFileSelect?.(file);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);
  };

  const handleFiles = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setSelectedFile(file);
    createFilePreview(file);
    simulateUpload(file);
  }, [maxSize, acceptedTypes, onFileSelect]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect?.(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-navy flex items-center space-x-2">
            <span>{title}</span>
            {required && <span className="text-error">*</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                dragActive ? "border-sky bg-sky/5" : "border-gray-300 hover:border-sky/50",
                "cursor-pointer"
              )}
              onClick={handleButtonClick}
            >
              <div className="space-y-4">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
                  dragActive ? "bg-sky text-white" : "bg-gray-100 text-gray-500"
                )}>
                  <ApperIcon 
                    name={dragActive ? "Upload" : "FileUp"} 
                    size={32} 
                  />
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-navy mb-2">
                    {dragActive ? "Drop file here" : "Upload Document"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  
                  <Button variant="outline" size="medium">
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Choose File
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Supported: PNG, JPG, JPEG, PDF • Max size: {Math.round(maxSize / 1024 / 1024)}MB
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* File Preview */}
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-start space-x-4">
                  {preview ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <ApperIcon name="FileText" size={24} className="text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    
                    {uploading && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-sky">Uploading...</span>
                          <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-sky to-teal h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    disabled={uploading}
                  >
                    <ApperIcon name="X" size={16} />
                  </button>
                </div>
              </div>

              {/* Upload Another Button */}
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="medium" 
                  onClick={handleButtonClick}
                  disabled={uploading}
                >
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Upload Different File
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DocumentUpload;