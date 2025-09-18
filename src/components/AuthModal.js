import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { signInWithGoogle } from '../firebase/auth';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Google Sign In */}
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sign in with your Google account to sync your data across devices.
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;