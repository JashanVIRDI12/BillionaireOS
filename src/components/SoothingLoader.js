import React from 'react';
import { motion } from 'framer-motion';

const SoothingLoader = ({ message = "Loading your data...", icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      {/* Animated Icon Container */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 border-2 border-gray-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 w-12 h-12 border-2 border-gray-400 border-t-black rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Icon */}
        {Icon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-6 h-6 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Loading Text */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-lg font-medium text-gray-900">{message}</p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50 -z-10"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Skeleton loader for list items
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white border-2 border-gray-200 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center space-x-4">
            {/* Skeleton checkbox */}
            <motion.div
              className="w-12 h-12 bg-gray-200 rounded-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Skeleton text */}
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-gray-200 rounded w-3/4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="h-3 bg-gray-100 rounded w-1/2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
            
            {/* Skeleton button */}
            <motion.div
              className="w-8 h-8 bg-gray-200 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Card skeleton for stats/summary cards
export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="space-y-3">
            <motion.div
              className="w-8 h-8 bg-gray-300 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="h-6 bg-gray-300 rounded w-16"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="h-3 bg-gray-200 rounded w-20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SoothingLoader;