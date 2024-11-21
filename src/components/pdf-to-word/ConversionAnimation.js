import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

const ConversionAnimation = ({ progress, fileName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-full max-w-md">
        {/* Conversion Icons */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-500" />
            </div>
            <span className="mt-2 text-sm text-gray-600">PDF</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-gray-400" />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <span className="mt-2 text-sm text-gray-600">DOCX</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Converting document...</h3>
          <p className="text-sm text-gray-500">{fileName}</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">{progress}% complete</p>
      </div>
    </div>
  );
};

export default ConversionAnimation;