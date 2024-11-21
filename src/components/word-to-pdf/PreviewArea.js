import React from 'react';
import { FileText } from 'lucide-react';

const PreviewArea = ({ convertedFile }) => {
  const renderPreview = () => {
    if (!convertedFile?.preview) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Preview not available</p>
            <p className="text-sm text-gray-400">The document can still be downloaded</p>
          </div>
        </div>
      );
    }

    if (convertedFile.preview.startsWith('data:application/pdf')) {
      // Add #toolbar=0 to hide the PDF viewer toolbar
      const previewUrl = `${convertedFile.preview}#toolbar=0&navpanes=0&scrollbar=0`;
      return (
        <iframe
          src={previewUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="PDF Preview"
          style={{ 
            width: '100%', 
            height: '100%',
            overflow: 'hidden'
          }}
        />
      );
    }

    return (
      <div className="absolute inset-0">
        <div className="relative h-full">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
            <img 
              src={convertedFile.preview} 
              alt="Document Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="relative max-w-4xl mx-auto" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;