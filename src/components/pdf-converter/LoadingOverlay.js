import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = ({ type, progress }) => {
  const content = {
    processing: {
      title: "Processing Images",
      description: "Preparing your files for conversion..."
    },
    converting: {
      title: "Creating PDF",
      description: "Converting your images to PDF format..."
    },
    downloading: {
      title: "Preparing Download",
      description: "Getting your PDF file ready..."
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          {/* Spinner */}
          <motion.div 
            className="relative w-20 h-20 mb-6"
          >
            <motion.div 
              className="absolute inset-0 border-4 border-blue-100 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Content */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            {content[type]?.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-6"
          >
            {content[type]?.description}
          </motion.p>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100">
                  <motion.div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold inline-block text-blue-600 mt-2">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;