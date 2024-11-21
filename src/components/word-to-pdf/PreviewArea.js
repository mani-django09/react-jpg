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

    // Check if preview is SVG data
    if (convertedFile.preview.startsWith('data:image/svg+xml')) {
      return (
        <div 
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: atob(convertedFile.preview.split(',')[1]) }}
        />
      );
    }

    // For PDF preview
    if (convertedFile.preview.startsWith('data:application/pdf')) {
      return (
        <iframe
          src={convertedFile.preview}
          className="absolute inset-0 w-full h-full"
          title="PDF Preview"
          type="application/pdf"
        />
      );
    }

    // Fallback to image preview
    return (
      <img 
        src={convertedFile.preview} 
        alt="Document Preview"
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => {
          console.error('Preview load error:', e);
          e.target.onerror = null;
          e.target.closest('.relative').innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div class="text-center p-4">
                <p class="text-gray-500">Preview not available</p>
                <p class="text-sm text-gray-400">The document can still be downloaded</p>
              </div>
            </div>
          `;
        }}
      />
    );
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative pt-[141.4%]"> {/* A4 aspect ratio */}
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;