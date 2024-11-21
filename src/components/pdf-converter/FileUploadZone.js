import React from 'react';
import { Upload } from 'lucide-react';

const FileUploadZone = ({ onFileSelect, fileInputRef, isProcessing }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    onFileSelect(files);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => onFileSelect(e.target.files)}
          accept="image/*"
          className="hidden"
          multiple
        />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Drag & drop your images here
        </h3>
        <p className="text-gray-500 mb-4">or click to browse files</p>
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select Files
        </button>
      </div>
    </div>
  );
};

export default FileUploadZone;