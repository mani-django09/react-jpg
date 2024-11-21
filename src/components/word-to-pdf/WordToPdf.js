// src/components/word-to-pdf/WordToPdf.js

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

import { 
  Upload, 
  Download, 
  FileText, 
  FileDown,
  Lock, 
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

import { FEATURE_CARDS, FAQ_ITEMS } from './constants';
import { WordConversionHandler } from '../../utils/word-converter/wordConversionHandler';
import { ConversionAnimation } from './ConversionAnimation';
import PreviewArea from './PreviewArea';


// Define the tool options
const TOOL_OPTIONS = [
  { 
    name: 'Compress', 
    Icon: FileDown,
    color: 'text-red-600',
    bg: 'bg-red-50',
    path: '/compress-pdf'
  },
  { 
    name: 'Merge', 
    Icon: File,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    path: '/merge-pdf'
  },
  { 
    name: 'Annotate', 
    Icon: AlignJustify,
    color: 'text-green-600',
    bg: 'bg-green-50',
    path: '/annotate-pdf'
  },
  { 
    name: 'Sign', 
    Icon: PenTool,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    path: '/sign-pdf'
  },
  { 
    name: 'Protect', 
    Icon: Shield,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    path: '/protect-pdf'
  }
];

const WordToPdf = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload');
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  // File handling
  const handleFileSelect = useCallback(async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
  
    setIsConverting(true);
    setConversionProgress(0);
  
    for (const file of selectedFiles) {
      try {
        // Validate file type
        if (!file.type.match(/(msword|wordprocessingml|rtf|opendocument)/)) {
          toast.error(`${file.name} is not a valid Word document`);
          continue;
        }
  
        // Validate file size
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 50MB size limit`);
          continue;
        }
  
        // Process file
        const processedFile = await WordConversionHandler.processFile(file);
        setFiles(prev => [...prev, processedFile]);
        
        // Start conversion
        setCurrentStep('converting');
        
        // Simulate conversion progress
        for (let i = 0; i <= 100; i += 10) {
          setConversionProgress(i);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
  
        // Convert to PDF
        const converted = await WordConversionHandler.convertToPdf(processedFile);
        setConvertedFile(converted);
        setCurrentStep('complete');
        
        toast.success('Conversion completed successfully!');
      } catch (error) {
        console.error('Conversion error:', error);
        toast.error(`Failed to process ${file.name}: ${error.message}`);
      }
    }
  
    setIsConverting(false);
    setConversionProgress(0);
  }, []);
  // Drag and drop handling
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  // Component sections
  const renderFeatureCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {FEATURE_CARDS.map(card => {
        const IconComponent = card.Icon;
        return (
          <div 
            key={card.id} 
            className={`${card.color} rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Upload Area
  const renderUploadArea = () => (
    <div className="space-y-8">
      <div
        className="w-full max-w-xl mx-auto p-12 border-2 border-dashed border-gray-300 
                   rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => !isConverting && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
          accept=".doc,.docx,.rtf,.odt"
          multiple
        />
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Drop Word documents here
        </h3>
        <p className="text-sm text-gray-500">
          or click to browse
        </p>
        <div className="mt-4 text-xs text-gray-500">
          Supports: DOC, DOCX, RTF, ODT (Max 50MB)
        </div>
      </div>
      {renderFeatureCards()}
    </div>
  );

  // Converted View
  const renderConvertedView = () => (
    <div className="flex flex-1">
      {/* Preview Area */}
      <PreviewArea convertedFile={convertedFile} />
  
      {/* Actions Sidebar */}
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
            <div className="truncate">{convertedFile.name}</div>
            <div>{convertedFile.size} - {convertedFile.pages} pages</div>
          </div>
        </div>
  
        {/* Actions */}
        <div className="p-4 space-y-4">
          <button
            onClick={() => WordConversionHandler.downloadPdf(convertedFile)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                     flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
  
          <div className="flex justify-center space-x-6 py-3 border-t border-b">
            <button
              onClick={() => WordConversionHandler.sharePdf(convertedFile)}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
            >
              <Share className="w-5 h-5" />
              <span className="text-xs">Share</span>
            </button>
            <button
              onClick={() => WordConversionHandler.printPdf(convertedFile)}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </button>
          </div>
        </div>
  
        {/* Tool Options */}
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium mb-3">Continue in</h4>
          <div className="space-y-2">
            {TOOL_OPTIONS.map(tool => {
              const IconComponent = tool.Icon;
              return (
                <button
                  key={tool.name}
                  onClick={() => navigate(tool.path)}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg group"
                >
                  <div className={`w-8 h-8 ${tool.bg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <span className="text-gray-700">{tool.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              );
            })}
          </div>
        </div>
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
              Convert Word to PDF Online
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your Word documents into high-quality PDF files. Fast, easy, and 100% free!
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
              {currentStep === 'upload' && renderUploadArea()}
              {currentStep === 'converting' && (
                <ConversionAnimation
                  progress={conversionProgress}
                  fileName={files[0]?.name}
                />
              )}
              {currentStep === 'complete' && renderConvertedView()}
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

      {/* Trust Banner */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              The PDF software trusted by millions of users
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your trusted one-stop app for converting Word to PDF with ease. 
              Enjoy all the tools you need to work efficiently with your digital documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordToPdf;