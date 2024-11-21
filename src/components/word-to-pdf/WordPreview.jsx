import React from 'react';
import { 
  Download, 
  Share, 
  PenTool,
  Printer,
  ChevronRight,
  RotateCw,
  Check,
  Trash2,
  Pencil,
  FileText,
  FileDown,
  Merge,
  Edit2,
  Lock
} from 'lucide-react';
const ContinueTools = [
  {
    name: 'Compress',
    icon: <FileDown className="w-4 h-4 text-red-600" />,
    bgColor: 'bg-red-50'
  },
  {
    name: 'Merge',
    icon: <Merge className="w-4 h-4 text-blue-600" />,
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Annotate',
    icon: <Edit2 className="w-4 h-4 text-green-600" />,
    bgColor: 'bg-green-50'
  },
  {
    name: 'Sign',
    icon: <PenTool className="w-4 h-4 text-purple-600" />,
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Protect',
    icon: <Lock className="w-4 h-4 text-orange-600" />,
    bgColor: 'bg-orange-50'
  }
];

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
export const ConvertedPreview = ({ file }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Main Preview */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow">
          {file.preview ? (
            <img 
              src={file.preview} 
              alt={file.name}
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-[1/1.4] flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col fixed right-0 top-0 h-full">
        {/* Status Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Done</span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>{file.name}</span>
              <span className="text-gray-400">.pdf</span>
            </div>
            <div>{file.size} - 1 page</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="p-4 space-y-4">
          {/* Download Button */}
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                           flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>

          {/* Export As */}
          <div className="w-full">
            <button className="w-full border border-gray-200 text-gray-700 px-4 py-2 rounded-lg
                             hover:bg-gray-50 flex items-center justify-between">
              <span>Export As</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-6 py-3 border-t border-b">
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
              <Share className="w-5 h-5" />
              <span className="text-xs">Share</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </button>
          </div>
        </div>

        {/* Continue with Other Tools */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Continue in</h4>
          <div className="space-y-2">
            <ContinueOption 
              icon={<Compress className="w-4 h-4 text-red-600" />}
              label="Compress"
              bgColor="bg-red-50"
            />
            <ContinueOption 
              icon={<Merge className="w-4 h-4 text-blue-600" />}
              label="Merge"
              bgColor="bg-blue-50"
            />
            <ContinueOption 
              icon={<Edit className="w-4 h-4 text-green-600" />}
              label="Annotate"
              bgColor="bg-green-50"
            />
            <ContinueOption 
              icon={<Lock className="w-4 h-4 text-purple-600" />}
              label="Protect"
              bgColor="bg-purple-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContinueOption = ({ icon, label, bgColor }) => (
  <button className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
    <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <span className="text-gray-700">{label}</span>
    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
  </button>
);