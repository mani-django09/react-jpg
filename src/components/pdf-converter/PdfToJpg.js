import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Settings, 
  ChevronDown, 
  X, 
  Plus, 
  RotateCcw, 
  RotateCw, 
  Share, 
  Printer, 
  Lock, 
  FileText,
  File, 
  Trash2, 
  Edit2, 
  Check, 
  ArrowLeft, 
  Eye,
  FileDown,
  Link,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';



// Constants
const pdfjsVersion = '3.11.174';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

// Feature Cards Data
const FEATURE_CARDS = [
  {
    id: 1,
    title: "High Quality Conversion",
    description: "Convert PDF to high-resolution JPG images while maintaining quality",
    icon: <Settings className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-50"
  },
  {
    id: 2,
    title: "Batch Processing",
    description: "Convert multiple PDF pages at once with ease",
    icon: <File className="w-6 h-6 text-green-600" />,
    color: "bg-green-50"
  },
  {
    id: 3,
    title: "Simple to Use",
    description: "User-friendly interface for quick and efficient conversion",
    icon: <Upload className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-50"
  },
  {
    id: 4,
    title: "100% Secure",
    description: "Your files are processed securely and automatically deleted",
    icon: <Lock className="w-6 h-6 text-red-600" />,
    color: "bg-red-50"
  },
  {
    id: 5,
    title: "Free to Use",
    description: "Convert PDFs to JPG completely free with no limitations",
    icon: <Download className="w-6 h-6 text-orange-600" />,
    color: "bg-orange-50"
  },
  {
    id: 6,
    title: "Download Options",
    description: "Download individual images or as a ZIP file",
    icon: <FileDown className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-50"
  }
];

// FAQ Data
const FAQ_ITEMS = [
  {
    id: 1,
    question: "How do I convert PDF to JPG?",
    answer: "Simply drag and drop your PDF file into the upload area, or click to select a file. Once uploaded, select the pages you want to convert and click 'Convert to JPG'. After conversion, you can download your JPG files individually or as a ZIP file."
  },
  {
    id: 2,
    question: "What's the maximum file size allowed?",
    answer: "The maximum file size limit is 50MB for PDF files. For larger files, you may need to split your PDF into smaller parts first using our PDF Split tool."
  },
  {
    id: 3,
    question: "How good is the image quality?",
    answer: "Our converter maintains high image quality during conversion. The output JPGs are optimized for both quality and file size. You can also choose different quality settings when exporting."
  },
  {
    id: 4,
    question: "Can I convert multiple pages?",
    answer: "Yes! You can select multiple pages from your PDF to convert. You can choose specific pages, or use the 'Select All' option. The converted JPG files can be downloaded individually or as a ZIP file."
  },
  {
    id: 5,
    question: "Is it secure to use this converter?",
    answer: "Yes, your files are processed securely on our servers and automatically deleted after conversion. We don't store any of your files or data. All processing is done in your browser for maximum privacy."
  },
  {
    id: 6,
    question: "What can I do with the converted JPGs?",
    answer: "After conversion, you can download, share, or print your JPGs. You can also use our image tools to edit, compress, or resize the converted images if needed."
  }
];

// Utility Functions
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const generateImageFromPdfPage = async (page, scale = 2) => {
  try {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image from PDF page');
  }
};
// Hero Section Component
const HeroSection = () => (
  <div className="bg-gradient-to-b from-gray-50 to-white border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Convert PDF to JPG Online
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your PDF documents into high-quality JPG images. Fast, easy, and 100% free!
        </p>
      </div>
          </div>
  </div>
);

// Loading Overlay Component
const LoadingOverlay = ({ type, progress, downloadDelay }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div className="text-center">
        <div className="mb-4">
          {type === 'processing' && 'Processing your PDF...'}
          {type === 'converting' && 'Converting pages to JPG...'}
          {type === 'downloading' && (
            downloadDelay ? `Starting download in ${downloadDelay}s...` : 'Preparing download...'
          )}
        </div>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// FAQ Section Component
const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openItem === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openItem === faq.id && (
                <div className="p-4 pt-0">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component
const PreviewModal = ({ image, isOpen, onClose, onShare, onPrint, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Preview</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <img src={image} alt="Preview" className="max-w-full mx-auto" />
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Share className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg"
          >
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
const ExportMenu = ({ isOpen, onClose, onExport, imageUrl }) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      format: 'jpeg',
      name: 'JPEG',
      icon: <FileText className="w-4 h-4" />,
      description: 'Best for photos and complex images'
    },
    {
      format: 'png',
      name: 'PNG',
      icon: <FileText className="w-4 h-4" />,
      description: 'Best for screenshots and simple images'
    },
    {
      format: 'webp',
      name: 'WebP',
      icon: <FileText className="w-4 h-4" />,
      description: 'Modern format with better compression'
    }
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-2 space-y-1">
        {exportOptions.map((option) => (
          <button
            key={option.format}
            onClick={() => {
              onExport(option.format);
              onClose();
            }}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200">
                {option.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{option.name}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Add export handler in PdfToJpg component
const handleExport = async (format) => {
  if (isProcessing) return;
  setLoadingType('exporting');
  setIsProcessing(true);
  setProgress(0);

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = selectedPreviewImage;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let mimeType;
    let quality;
    switch (format) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        quality = 0.9;
        break;
      default:
        mimeType = 'image/jpeg';
        quality = 0.92;
    }

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `converted-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export image');
  } finally {
    setIsProcessing(false);
    setLoadingType(null);
    setProgress(100);
  }
};

// Then use the ExportMenu in your buttons/actions

const ActionsSidebar = ({ fileName, onDownload, onShare, onPrint, onDelete, onStartOver }) => (
  <div className="w-80 bg-white border-l flex flex-col">
    {/* Status Header */}
    <div className="p-4 border-b">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">Done</span>
      </div>
      <div className="text-sm text-gray-600">
        <span>{fileName}</span>
        <span className="text-gray-400">.jpg</span>
      </div>
    </div>

    {/* Main Actions */}
    <div className="p-4 space-y-3">
      {/* Download Button */}
      <button
        onClick={onDownload}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 
                 flex items-center justify-center space-x-2 group"
      >
        <Download className="w-5 h-5" />
        <span>Download</span>
      </button>

      {/* Share and Print Actions */}
      <div className="flex justify-center space-x-4 py-2 border-t border-b">
        <button
          onClick={onShare}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center"
          title="Share"
        >
          <Share className="w-5 h-5 text-gray-600 mb-1" />
          <span className="text-xs text-gray-600">Share</span>
        </button>
        <button
          onClick={onPrint}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center"
          title="Print"
        >
          <Printer className="w-5 h-5 text-gray-600 mb-1" />
          <span className="text-xs text-gray-600">Print</span>
        </button>
      </div>

      {/* Start Over */}
      <button
        onClick={onStartOver}
        className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 mt-4"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Start over</span>
      </button>
    </div>
  </div>
);
// Upload Area Component
const UploadArea = ({ isProcessing, fileInputRef, handleDragOver, handleDrop, handleFileSelect }) => (
  <div className="space-y-8">
    <div className="h-full flex items-center justify-center">
      <div
        className="w-full max-w-xl p-12 border-2 border-dashed border-gray-300 rounded-lg 
                  text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          className="hidden"
          disabled={isProcessing}
        />
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Drop your PDF here
        </h3>
        <p className="text-sm text-gray-500">
          or click to browse
        </p>
        <div className="mt-4 text-xs text-gray-500">
          Maximum file size: 50MB
        </div>
      </div>
    </div>

    {/* Feature Cards Grid */}
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Why Choose Our PDF to JPG Converter
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_CARDS.map(card => (
          <div
            key={card.id}
            className={`${card.color} rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main PdfToJpg Component
const PdfToJpg = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('upload');
  const [loadingType, setLoadingType] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadDelay, setDownloadDelay] = useState(0);
  const [pdfPreview, setPdfPreview] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);


  // Handlers
  const handleBackClick = () => {
    if (isProcessing) return;
    if (currentStep === 'upload') {
      navigate('/');
    } else {
      handleStartOver();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleStartOver = () => {
    if (isProcessing) return;
    setFiles([]);
    setPdfPreview([]);
    setSelectedPages([]);
    setCurrentStep('upload');
    setSelectedPreviewImage(null);
    setShowPreviewModal(false);
    setDownloadDelay(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectAllPages = () => {
    if (files.length === 0) return;
    setSelectedPages(Array.from({ length: files[0].pageCount }, (_, i) => i));
  };

  const handleDeselectAllPages = () => {
    setSelectedPages([]);
  };

  const handlePageSelection = (pageIndex) => {
    setSelectedPages(prev => {
      if (prev.includes(pageIndex)) {
        return prev.filter(p => p !== pageIndex);
      } else {
        return [...prev, pageIndex].sort((a, b) => a - b);
      }
    });
  };

  const handleShare = async (imageUrl) => {
    try {
      const shareData = {
        title: 'Converted Image',
        text: 'Check out this converted image',
        url: imageUrl
      };
  
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share image');
    }
  };
  
  const handlePrint = useCallback((imageUrl) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Write the print content to the iframe
      const contentWindow = iframe.contentWindow;
      contentWindow.document.open();
      contentWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Image</title>
            <style>
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
                display: block;
                margin: auto;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                img {
                  width: 100%;
                  height: auto;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img 
              src="${imageUrl}" 
              alt="Print Preview"
              onload="window.print(); window.onafterprint = function() { window.close(); }"
            />
          </body>
        </html>
      `);
      contentWindow.document.close();
  
      // Handle print completion
      iframe.onload = () => {
        setTimeout(() => {
          try {
            contentWindow.focus();
            contentWindow.print();
            
            // Clean up
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 1000);
            
            toast.success('Print started successfully');
          } catch (error) {
            console.error('Print error:', error);
            toast.error('Failed to print. Please try again.');
          }
        }, 500);
      };
  
    } catch (error) {
      console.error('Print setup error:', error);
      toast.error('Failed to setup print. Please try again.');
      
      // Fallback method if iframe fails
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Image</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                  object-fit: contain;
                }
                @media print {
                  body { margin: 0; }
                  img { 
                    width: 100%;
                    height: auto;
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <img 
                src="${imageUrl}" 
                alt="Print Preview"
                onload="setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 500);"
              />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        toast.error('Pop-up blocked. Please allow pop-ups and try again.');
      }
    }
  }, []);
  
  // Add print button with loading state
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Updated print button
  <button
    onClick={async (e) => {
      e.stopPropagation();
      if (isPrinting) return;
      
      setIsPrinting(true);
      try {
        await handlePrint(imageUrl);
      } finally {
        setTimeout(() => setIsPrinting(false), 1000);
      }
    }}
    disabled={isPrinting}
    className={`p-2 bg-white rounded-full hover:bg-gray-100 transition-colors ${
      isPrinting ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    title="Print"
  >
    {isPrinting ? (
      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
    ) : (
      <Printer className="w-5 h-5 text-green-600" />
    )}
  </button>
  
  
  const handleDelete = (imageUrl) => {
    setPdfPreview(prev => prev.filter(url => url !== imageUrl));
    setShowPreviewModal(false);
    toast.success('Image deleted successfully!');
  
    // If there are no more images, go back to upload state
    if (pdfPreview.length <= 1) {
      setCurrentStep('upload');
      setFiles([]);
      setSelectedPages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Add this ShareModal component
  const ShareModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;
  
    const shareOptions = [
      {
        name: 'Copy Link',
        icon: <Link className="w-5 h-5" />,
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(imageUrl);
            toast.success('Link copied to clipboard!');
            onClose();
          } catch (error) {
            toast.error('Failed to copy link');
          }
        }
      },
      {
        name: 'Download',
        icon: <Download className="w-5 h-5" />,
        onClick: () => {
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `converted-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onClose();
        }
      }
    ];
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Share Image</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {option.icon}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Updated image grid with action buttons
  {pdfPreview.map((imageUrl, index) => (
    <div 
      key={index} 
      className="relative rounded-lg overflow-hidden shadow-lg group"
    >
      <img
        src={imageUrl}
        alt={`Converted Page ${index + 1}`}
        className="w-full aspect-[3/4] object-cover cursor-pointer"
        onClick={() => {
          setSelectedPreviewImage(imageUrl);
          setShowPreviewModal(true);
        }}
      />
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 
                    rounded text-sm">
        Page {index + 1}
      </div>
      
      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity flex items-center justify-center gap-4">
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrint(imageUrl);
          }}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          title="Print"
        >
          <Printer className="w-5 h-5 text-green-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(imageUrl);
          }}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  ))}
  
  // Add state for share modal
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Add ShareModal component to your return statement
  <ShareModal
    isOpen={showShareModal}
    onClose={() => setShowShareModal(false)}
    imageUrl={selectedPreviewImage}
  />
  // File Processing Handlers
  const handleFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
  
    setLoadingType('processing');
    setIsProcessing(true);
    setProgress(0);
  
    try {
      const validFiles = [];
      
      for (const file of selectedFiles) {
        if (file.type !== 'application/pdf') {
          toast.error(`${file.name} is not a PDF file`);
          continue;
        }
  
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 50MB size limit`);
          continue;
        }
  
        try {
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(arrayBuffer);
          const pageCount = pdf.getPageCount();
          
          const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
          const pdfDoc = await loadingTask.promise;
          const previewImages = [];
          
          for (let i = 1; i <= pageCount; i++) {
            const page = await pdfDoc.getPage(i);
            const imageUrl = await generateImageFromPdfPage(page, 1);
            previewImages.push(imageUrl);
            setProgress((i / pageCount) * 100);
          }
          
          validFiles.push({
            id: Math.random().toString(36).substring(7),
            file,
            preview: previewImages,
            name: file.name,
            size: file.size,
            pageCount,
          });
  
          setSelectedPages(Array.from({ length: pageCount }, (_, i) => i));
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error(`Failed to process ${file.name}: ${error.message}`);
        }
      }
  
      if (validFiles.length > 0) {
        setFiles(validFiles);
        setPdfPreview(validFiles[0].preview);
        setCurrentStep('preview');
        toast.success(`Added ${validFiles.length} PDF files`);
      }
    } catch (error) {
      console.error('Error in handleFiles:', error);
      toast.error('Error processing files: ' + error.message);
    } finally {
      setIsProcessing(false);
      setLoadingType(null);
      setProgress(0);
    }
  };
  const handleDownload = async () => {
    if (!pdfPreview.length || isProcessing) return;

    setLoadingType('downloading');
    setIsProcessing(true);

    try {
      // Start countdown
      for(let i = 5; i > 0; i--) {
        setDownloadDelay(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Handle multiple images
      if (pdfPreview.length > 1) {
        const zip = new JSZip();
        
        // Add each image to the zip file
        pdfPreview.forEach((imageUrl, index) => {
          const base64Data = imageUrl.split(',')[1];
          zip.file(`page_${index + 1}.jpg`, base64Data, { base64: true });
        });

        // Generate and download zip file
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `converted_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Download single image
        const link = document.createElement('a');
        link.href = pdfPreview[0];
        link.download = `converted_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download: ' + error.message);
    } finally {
      setDownloadDelay(0);
      setIsProcessing(false);
      setLoadingType(null);
    }
  };
  const handleShowMoreTools = () => {
    setShowMoreTools(true);
    // Optional: Navigate to tools page or show modal
    navigate('/tools');
  };
  
  const handleConvertToJpg = async () => {
    if (files.length === 0 || selectedPages.length === 0) return;

    setLoadingType('converting');
    setIsProcessing(true);
    setProgress(0);

    try {
      const images = [];
      const file = files[0];
      const arrayBuffer = await readFileAsArrayBuffer(file.file);
      const pdfDoc = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
      
      for (let i = 0; i < selectedPages.length; i++) {
        const pageNum = selectedPages[i] + 1;
        const page = await pdfDoc.getPage(pageNum);
        const imageUrl = await generateImageFromPdfPage(page, 2);
        images.push({
          data: imageUrl,
          name: `${file.name.replace('.pdf', '')}_page_${pageNum}.jpg`
        });
        setProgress(((i + 1) / selectedPages.length) * 100);
      }

      setPdfPreview(images.map(img => img.data));
      setCurrentStep('complete');
      toast.success('Conversion completed successfully!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
      setLoadingType(null);
      setProgress(0);
    }
  };

  // Component Return
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex h-full">
            {/* Left Panel - Preview Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center p-4 border-b">
                <button 
                  onClick={handleBackClick}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-auto p-4">
                {currentStep === 'upload' && (
                  <UploadArea
                    isProcessing={isProcessing}
                    fileInputRef={fileInputRef}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleFileSelect={handleFileSelect}
                  />
                )}

                {currentStep === 'preview' && (
                  <div className="max-w-4xl mx-auto">
                    {/* Page Selection Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Select pages to convert
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSelectAllPages}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Select All
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={handleDeselectAllPages}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

      {/* Add this section for the page counter */}
      {currentStep === 'preview' && (
        <div className="mt-auto p-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Selected pages:</span>
            <span className="font-medium">
              {selectedPages.length} / {files[0]?.pageCount || 0}
            </span>
          </div>
        </div>
      )}

                    {/* Page Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {files[0]?.preview.map((pagePreview, index) => (
                        <div
                          key={index}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden
                                    ${selectedPages.includes(index) ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
                          onClick={() => handlePageSelection(index)}
                        >
                          <img
                            src={pagePreview}
                            alt={`Page ${index + 1}`}
                            className="w-full aspect-[3/4] object-cover"
                          />
                          <div
                            className={`absolute inset-0 flex items-center justify-center
                                      ${selectedPages.includes(index) ? 'bg-blue-500/10' : 'bg-black/0 group-hover:bg-black/5'}
                                      transition-colors`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                        ${selectedPages.includes(index) 
                                          ? 'border-blue-500 bg-blue-500 text-white' 
                                          : 'border-gray-400 bg-white group-hover:border-blue-500'}`}
                            >
                              {selectedPages.includes(index) && <Check className="w-4 h-4" />}
                            </div>
                            </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 
                                        rounded text-sm">
                            Page {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Step with Preview */}
                {currentStep === 'complete' && (
                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pdfPreview.map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className="relative rounded-lg overflow-hidden shadow-lg group"
                        >
                          <img
                            src={imageUrl}
                            alt={`Converted Page ${index + 1}`}
                            className="w-full aspect-[3/4] object-cover"
                            onClick={() => {
                              setSelectedPreviewImage(imageUrl);
                              setShowPreviewModal(true);
                            }}
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 
                                        rounded text-sm">
                            Page {index + 1}
                          </div>
                          
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                        transition-opacity flex items-center justify-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(imageUrl);
                              }}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="Share"
                            >
                              <Share className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrint(imageUrl);
                              }}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="Print"
                            >
                              <Printer className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(imageUrl);
                              }}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

{/* Right Panel - Tools */}
<div className="w-80 bg-white border-l flex flex-col">
  {currentStep === 'complete' ? (
    // Complete State with ActionsSidebar
    <ActionsSidebar 
      fileName={files[0]?.name.replace('.pdf', '')}
      onDownload={() => handleDownload()}
      onShare={() => handleShare(selectedPreviewImage)}
      onPrint={() => handlePrint(selectedPreviewImage)}
      onDelete={() => handleDelete(selectedPreviewImage)}
      onStartOver={handleStartOver}
    />
  ) : (
    // Preview State with Convert Button
    <>
      {/* Status Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
          <span className="font-medium text-gray-600">In Progress</span>
        </div>
        <div className="text-sm text-gray-600">
          {files.length > 0 ? (
            <>
              <div className="truncate">{files[0].name}</div>
              <div>
                {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
              </div>
            </>
          ) : (
            'No file selected'
          )}
        </div>
      </div>

      {/* Action Buttons for Preview State */}
      <div className="p-4 space-y-2">
        {currentStep === 'preview' && (
          <button
            onClick={handleConvertToJpg}
            disabled={isProcessing || selectedPages.length === 0}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 
                     flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>Convert to JPG</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  )}

  {/* Dynamic Content Based on State */}
  {currentStep === 'complete' && (
    <>

      {/* Smart Tips Section */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-yellow-400 text-lg">💡</span>
            <h3 className="text-sm font-medium">Smart tip!</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Looks like you're working with images. Why not try:
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/pdf-ocr')}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-red-600" />
                </div>
                <span>PDF OCR</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => navigate('/compress')}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <span>Compress</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => navigate('/merge')}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-purple-600" />
                </div>
                <span>Merge</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <button 
            onClick={() => setShowMoreTools(true)}
            className="text-blue-600 text-sm mt-3 hover:underline"
          >
            Show more
          </button>
        </div>
      </div>

      </>
  )}
  

              {/* Tools Section */}
              {currentStep === 'complete' && (
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 
                               hover:bg-gray-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview All</span>
                    </button>
                    <button

                      onClick={() => handleDownload()}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 
                               hover:bg-gray-50 rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
{/* Add this right before your preview grid in the complete step section */}
<div className="mb-4 flex justify-between items-center">
  <button
    onClick={() => setSelectMode(!selectMode)}
    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
  >
    <Check className="w-4 h-4" />
    <span>{selectMode ? 'Cancel Selection' : 'Select Multiple'}</span>
  </button>
  {selectMode && (
    <div className="flex space-x-4">
      <button
        onClick={() => setSelectedImages(pdfPreview)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Select All
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setSelectedImages([])}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Deselect All
      </button>
    </div>
  )}
</div>
      {/* Preview Modal */}
      <PreviewModal
        image={selectedPreviewImage}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onShare={() => handleShare(selectedPreviewImage)}
        onPrint={() => handlePrint(selectedPreviewImage)}
        onDelete={() => handleDelete(selectedPreviewImage)}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loadingType && (
          <LoadingOverlay 
            type={loadingType} 
            progress={progress}
            downloadDelay={downloadDelay}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfToJpg;