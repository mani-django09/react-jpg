import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, Printer, X, ZoomIn, ZoomOut, RotateCw, RotateCcw, 
         ChevronDown, FileText, FileImage } from 'lucide-react';
import { toast } from 'react-hot-toast';

// src/components/pdf-converter/Components.js
export const LoadingOverlay = ({ type, progress, downloadDelay }) => {
  const messages = {
    processing: {
      title: "Processing Images",
      description: "Preparing your files for conversion..."
    },
    converting: {
      title: "Creating PDF",
      description: "Converting your images into a PDF document..."
    },
    downloading: {
      title: "Preparing Download",
      description: downloadDelay > 0 
        ? `Starting download in ${downloadDelay} seconds...`
        : "Getting your file ready..."
    },
    exporting: {
      title: "Exporting Files",
      description: "Preparing your files..."
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex flex-col items-center">
          {/* Spinner with countdown */}
          <div className="w-16 h-16 mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-blue-500 transition-all duration-300"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="48"
                cx="50"
                cy="50"
                strokeDasharray={`${downloadDelay ? (downloadDelay / 5) * 301 : progress * 3.01} 301`}
              />
            </svg>
            {downloadDelay > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-500">
                {downloadDelay}
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-2">
            {messages[type]?.title}
          </h3>
          <p className="text-gray-500 text-center mb-4">
            {messages[type]?.description}
          </p>

          {progress > 0 && !downloadDelay && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 15 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PreviewModal = ({ isOpen, onClose, file, onRotate }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !file) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const shareFile = new File([blob], file.name, { type: file.file.type });
        
        await navigator.share({
          files: [shareFile],
          title: 'Share Image',
          text: 'Check out this image'
        });
        toast.success('Shared successfully!');
      } else {
        handleDownload();
      }
    } catch (error) {
      toast.error('Unable to share');
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = file.preview;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleLocalRotate = (direction) => {
    const newRotation = rotation + (direction === 'left' ? -90 : 90);
    setRotation(newRotation);
    if (onRotate) {
      onRotate(file.id, direction);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full m-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
            <span className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(s => Math.min(2, s + 0.1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={() => handleLocalRotate('left')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleLocalRotate('right')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RotateCw className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="relative bg-gray-900 flex items-center justify-center overflow-auto">
          <div className="min-h-[60vh] flex items-center justify-center p-8">
            <motion.img
              src={file.preview}
              alt={file.name}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
              className="max-w-full max-h-[70vh] object-contain transition-transform duration-200"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ExportMenu = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'pdf',
      label: 'PDF Document',
      icon: FileText,
      description: 'Export as PDF file',
      formats: [
        { value: 'standard', label: 'Standard Quality' },
        { value: 'high', label: 'High Quality' },
        { value: 'compressed', label: 'Compressed PDF' }
      ]
    },
    {
      id: 'images',
      label: 'Image Files',
      icon: FileImage,
      description: 'Export as image files',
      formats: [
        { value: 'jpeg', label: 'JPEG Format' },
        { value: 'png', label: 'PNG Format' },
        { value: 'webp', label: 'WebP Format' }
      ]
    }
  ];

  return (
    <div 
      className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl 
                border border-gray-200 overflow-hidden z-50"
    >
      <div className="p-2">
        {exportOptions.map((option) => (
          <div key={option.id} className="rounded-lg overflow-hidden">
            <div className="px-3 py-2 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <option.icon className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{option.label}</h4>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2 pl-8 space-y-1">
                {option.formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => {
                      onExport(option.id, format.value);
                      onClose();
                    }}
                    className="w-full text-left text-sm px-2 py-1 rounded hover:bg-blue-50 
                             hover:text-blue-600 transition-colors"
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-red-600 font-medium">Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
