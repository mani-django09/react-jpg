// src/components/word-to-pdf/ErrorDisplay.js
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorDisplay = ({ fileName, error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">
          Error processing {fileName}
        </h3>
        <div className="mt-2 text-sm text-red-700">
          {error}
        </div>
      </div>
    </div>
  </div>
);