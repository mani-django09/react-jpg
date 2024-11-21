import React from 'react';
import { motion } from 'framer-motion';

export const ConversionAnimation = ({ fileName, fileSize }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="max-w-[400px] mx-auto">
          {/* Word to PDF Animation */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6 bg-blue-50 rounded-lg"
            >
              <div className="w-16 h-20 border-2 border-blue-500 rounded-lg relative">
                <div className="absolute inset-2 bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">DOC</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6 bg-red-50 rounded-lg"
            >
              <div className="w-16 h-20 border-2 border-red-500 rounded-lg relative">
                <div className="absolute inset-2 bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">PDF</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* File Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Converting to PDF...</h3>
            <p className="text-sm text-gray-500">
              {fileName} ({fileSize})
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            This might take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};
