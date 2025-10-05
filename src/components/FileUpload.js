import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { extractTextFromFile, validateFile, getFileTypeDisplay } from '../services/fileProcessor';

const FileUpload = ({ onTextExtracted, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file) => {
    setError(null);
    setSuccess(false);
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setUploadedFile(file);
    setIsProcessing(true);
    
    try {
      // Extract text from file
      const result = await extractTextFromFile(file);
      
      if (result.success) {
        setSuccess(true);
        onTextExtracted(result.text);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
        setUploadedFile(null);
      }
    } catch (err) {
      setError('Failed to process file. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={`
          relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 touch-manipulation
          ${isDragOver 
            ? 'border-gray-900 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50 active:bg-gray-50'
          }
          ${uploadedFile ? 'bg-gray-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {!uploadedFile && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 sm:space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 px-2">
                Drop your resume here or tap to browse
              </p>
              <p className="text-xs text-gray-500 mt-1 px-2">
                Supports PDF, DOC, DOCX, and TXT files (max 10MB)
              </p>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 sm:space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">Processing file...</p>
              <p className="text-xs text-gray-500">Extracting text from your resume</p>
            </div>
          </motion.div>
        )}

        {uploadedFile && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 sm:space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="px-2">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">
                {getFileTypeDisplay(uploadedFile)} • {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors touch-manipulation py-1 px-2 rounded"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-start space-x-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center space-x-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>File processed successfully! Text has been extracted and loaded.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Format Help */}
      <div className="mt-3 sm:mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Supported formats:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-0.5">
          <div>• <strong>PDF:</strong> Best compatibility</div>
          <div>• <strong>DOCX:</strong> Modern Word docs</div>
          <div>• <strong>TXT:</strong> Plain text files</div>
          <div>• <strong>DOC:</strong> Limited support</div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
