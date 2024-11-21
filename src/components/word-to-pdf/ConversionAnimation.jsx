import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

export const ConversionAnimation = ({ progress, fileName }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center space-x-12 mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-24 h-32 bg-blue-50 rounded-lg flex items-center justify-center"
          >
            <FileText className="w-12 h-12 text-blue-600" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-8 h-8 text-blue-600" />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-24 h-32 bg-red-50 rounded-lg flex items-center justify-center"
          >
            <FileText className="w-12 h-12 text-red-600" />
          </motion.div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Converting to PDF...</h3>
          <p className="text-sm text-gray-500">{fileName}</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};