import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Upload, 
  Download, 
  FileText, 
  FileDown,
  Lock, 
  Image,
  Sliders,
  File,
  ArrowLeft,
  Printer,
  Share,
  Check,
  ChevronDown,
  ChevronRight,
  PenTool,
  AlignJustify,
  Shield
} from 'lucide-react';

import SimpleDownloadButton from './SimpleDownloadButton';
import PreviewArea from './PreviewArea';
import ConversionAnimation from './ConversionAnimation';
import PdfCompressionHandler from '../../utils/pdf-compressor/pdfCompressionHandler';
import CompressionControls from './CompressionControls';

const FEATURE_CARDS = [
    {
      icon: FileDown,
      title: "Smart Compression",
      description: "Reduce PDF file size while maintaining quality",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Secure Processing",
      description: "All processing happens in your browser",
      color: "text-green-500"
    },
    {
      icon: Sliders,
      title: "Custom Settings",
      description: "Fine-tune compression to your needs",
      color: "text-purple-500"
    }
  ];

const COMPRESSION_PRESETS = {
  HIGH_QUALITY: {
    name: 'High Quality',
    desc: 'Best quality, larger file size',
    settings: { imageQuality: 90, imageScale: '1', compressionMethod: 'lossless' }
  },
  BALANCED: {
    name: 'Balanced',
    desc: 'Good quality, medium size',
    settings: { imageQuality: 70, imageScale: '0.75', compressionMethod: 'balanced' }
  },
  SMALL_SIZE: {
    name: 'Small Size',
    desc: 'Maximum compression',
    settings: { imageQuality: 50, imageScale: '0.5', compressionMethod: 'aggressive' }
  }
};

const TOOL_OPTIONS = [
  { 
    name: 'Convert to Word', 
    Icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    path: '/pdf-to-word'
  },
  { 
    name: 'Merge', 
    Icon: File,
    color: 'text-green-600',
    bg: 'bg-green-50',
    path: '/merge-pdf'
  },
  { 
    name: 'Annotate', 
    Icon: AlignJustify,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    path: '/annotate-pdf'
  },
  { 
    name: 'Sign', 
    Icon: PenTool,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    path: '/sign-pdf'
  }
];

const FAQ_ITEMS = [
  {
    id: 1,
    question: "How do I compress a PDF?",
    answer: "Simply drag and drop your PDF file onto the compressor, or click to select your file. Choose your preferred compression level and the process will start automatically."
  },
  {
    id: 2,
    question: "Will I lose quality?",
    answer: "Our smart compression algorithms maintain the best possible quality while reducing file size. You can choose between different compression levels based on your needs."
  },
  {
    id: 3,
    question: "What's the maximum file size?",
    answer: "You can compress PDF files up to 50MB in size. The output file size will depend on your chosen compression level."
  }
];

const CompressPdf = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingType, setLoadingType] = useState('');
  const [progress, setProgress] = useState(0);
  // Updated state management
  const [state, setState] = useState({
    files: [],
    currentStep: 'upload',
    compressedFile: null,
    isCompressing: false,
    compressionProgress: 0,
    originalSize: 0,
    compressedSize: 0,
    compressionSettings: {
      pageRanges: '',
      rotation: 0,
      splitSize: 5,
      enableSplitting: false,
      password: '',
      enableEncryption: false,
      optimizeForWeb: true,
      fastWebView: true,
      outputFormat: 'pdf',
      title: '',
      author: ''
    }
  });


  // ... keep useEffect for loading history ...

  const saveToHistory = useCallback((originalFile, processedFile) => {
    try {
      const historyItem = {
        fileName: originalFile.name,
        originalSize: originalFile.size,
        compressedSize: processedFile.compressedSize || processedFile.size,
        date: new Date().toISOString(),
        compressionRatio: processedFile.compressionRatio || 
          ((1 - (processedFile.compressedSize || processedFile.size) / originalFile.size) * 100).toFixed(1)
      };

      setUploadHistory(prev => {
        const newHistory = [historyItem, ...prev].slice(0, 10);
        localStorage.setItem('compressionHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, []);

  const handleFileSelect = useCallback(async (selectedFiles) => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setState(prev => ({ ...prev, isCompressing: true, compressionProgress: 0 }));

    try {
      for (const file of selectedFiles) {
        if (!file.type.match('application/pdf')) {
          throw new Error('Invalid file type. Please select a PDF file.');
        }

        if (file.size > 50 * 1024 * 1024) {
          throw new Error('File size exceeds 50MB limit.');
        }

        if (file.size === 0) {
          throw new Error('File appears to be empty.');
        }

        const processedFile = await PdfCompressionHandler.processFile(file);
        setState(prev => ({
          ...prev,
          files: [...prev.files, processedFile],
          currentStep: 'compressing',
          originalSize: file.size
        }));

        const result = await PdfCompressionHandler.processPdfWithSettings(
          processedFile,
          state.compressionSettings
        );

        if (Array.isArray(result)) {
          setState(prev => ({
            ...prev,
            compressedFile: result[0],
            compressedFiles: result,
            compressedSize: result.reduce((total, file) => total + file.compressedSize, 0),
            currentStep: 'complete'
          }));
        } else {
          setState(prev => ({
            ...prev,
            compressedFile: result,
            compressedSize: result.compressedSize || result.size,
            currentStep: 'complete'
          }));
        }

        saveToHistory(file, result);
        toast.success('Processing completed successfully!');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.message);
      setState(prev => ({ ...prev, currentStep: 'upload' }));
    } finally {
      setIsProcessing(false);
      setState(prev => ({ 
        ...prev, 
        isCompressing: false, 
        compressionProgress: 100 
      }));
    }
  }, [state.compressionSettings, saveToHistory]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleSettingsChange = useCallback((newSettings) => {
    setState(prev => ({
      ...prev,
      compressionSettings: {
        ...prev.compressionSettings,
        ...newSettings
      }
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      if (!state.compressedFile) {
        toast.error('No file to download');
        return;
      }

      if (Array.isArray(state.compressedFiles)) {
        // Download all split files
        for (const file of state.compressedFiles) {
          await PdfCompressionHandler.downloadPdf(file);
        }
        toast.success('All files downloaded successfully');
      } else {
        // Download single file
        await PdfCompressionHandler.downloadPdf(state.compressedFile);
        toast.success('Download started successfully');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  }, [state.compressedFile, state.compressedFiles]);

  const handleShare = useCallback(async () => {
    try {
      if (!state.compressedFile) {
        toast.error('No file to share');
        return;
      }
      await PdfCompressionHandler.sharePdf(state.compressedFile);
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share file');
    }
  }, [state.compressedFile]);

  const handlePrint = useCallback(async () => {
    try {
      if (!state.compressedFile) {
        toast.error('No file to print');
        return;
      }
      await PdfCompressionHandler.printPdf(state.compressedFile);
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print file');
    }
  }, [state.compressedFile]);

  const renderUploadArea = () => (
    <div className="space-y-8">
      <div
        className="w-full max-w-xl mx-auto p-12 border-2 border-dashed border-gray-300 
                   rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => !state.isCompressing && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
          accept=".pdf"
          multiple
        />
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Drop PDF documents here
        </h3>
        <p className="text-sm text-gray-500">
          or click to browse
        </p>
        <div className="mt-4 text-xs text-gray-500">
          Supports: PDF (Max 50MB)
        </div>
      </div>

      {/* Compression Presets */}
      <div className="max-w-xl mx-auto">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Compression Level</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(COMPRESSION_PRESETS).map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSettingsChange(preset.settings)}
              className={`p-4 border rounded-lg text-left transition-colors hover:border-blue-500
                         ${JSON.stringify(preset.settings) === JSON.stringify(state.compressionSettings) 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200'}`}
            >
              <div className="font-medium text-gray-900">{preset.name}</div>
              <div className="text-sm text-gray-500">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
  {FEATURE_CARDS.map((card, index) => (
    <div 
      key={index} 
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50">
          <card.icon className={`w-6 h-6 ${card.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
          <p className="text-sm text-gray-600">{card.description}</p>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );

  const renderCompressedView = () => (
    <div className="flex flex-1">
      <PreviewArea convertedFile={state.compressedFile} />
  
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Compression Complete</h3>
          <p className="text-sm text-gray-500 mt-1">
            Original: {(state.originalSize / 1024 / 1024).toFixed(2)} MB<br />
            Compressed: {(state.compressedSize / 1024 / 1024).toFixed(2)} MB<br />
            Reduction: {((1 - state.compressedSize / state.originalSize) * 100).toFixed(1)}%
          </p>
        </div>

        <CompressionControls 
          settings={state.compressionSettings}
          onSettingsChange={handleSettingsChange}
        />
  
        <div className="p-4 space-y-4 mt-auto">
          <SimpleDownloadButton 
            file={state.compressedFile}
            onDownload={handleDownload}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUploadHistory = () => (
    <div className="mt-8">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Compressions</h4>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compressed Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reduction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uploadHistory.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.originalSize / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.compressedSize / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {item.compressionRatio}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Compress PDF Online
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reduce PDF file size while maintaining quality. Fast, easy, and 100% free!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-4 py-3">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            </div>

            <div className="p-4">
              {state.currentStep === 'upload' && renderUploadArea()}
              {state.currentStep === 'compressing' && (
                <ConversionAnimation
                  progress={state.compressionProgress}
                  fileName={state.files[0]?.name}
                />
              )}
              {state.currentStep === 'complete' && renderCompressedView()}
              {state.currentStep === 'upload' && uploadHistory.length > 0 && renderUploadHistory()}
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.id}
                className="group bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <summary className="flex justify-between items-center p-4 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" 
                  />
                </summary>
                <div className="p-4 text-gray-600 border-t border-gray-200">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Tools Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More PDF Tools
            </h2>
            <p className="text-gray-600">
              Explore our other PDF tools to handle all your document needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOOL_OPTIONS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => navigate(tool.path)}
                className={`p-4 rounded-lg ${tool.bg} hover:opacity-90 transition-opacity`}
              >
                <tool.Icon className={`w-6 h-6 ${tool.color} mx-auto mb-2`} />
                <div className="text-sm font-medium text-gray-900">{tool.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              The PDF software trusted by millions of users
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your trusted one-stop app for compressing PDF files. 
              Enjoy all the tools you need to work efficiently with your digital documents.
            </p>
            
            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Free</div>
                <div className="text-sm text-gray-600">No Hidden Costs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Fast</div>
                <div className="text-sm text-gray-600">Processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Call-to-Action */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to compress your PDFs?
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="w-5 h-5 mr-2" />
              Compress PDF Now
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {state.compressedFile && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-green-500 animate-fade-in">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <div className="font-medium text-gray-900">Compression Complete!</div>
              <div className="text-sm text-gray-500">
                Size reduced by {((1 - state.compressedSize / state.originalSize) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
     );
    };

export default CompressPdf;