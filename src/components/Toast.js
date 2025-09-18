import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Toast = ({ isVisible, type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${getBgColor()}`}>
            {getIcon()}
            <span className="text-gray-900 font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;