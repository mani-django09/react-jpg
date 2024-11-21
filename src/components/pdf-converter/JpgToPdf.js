import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Upload, Download, Settings, ChevronDown, X, Plus, 
  RotateCcw, RotateCw, Share, Printer, Lock, FileText, 
  Trash2, Edit2, Check, ArrowLeft
} from 'lucide-react';
import jsPDF from 'jspdf';
import { LoadingOverlay, PreviewModal, ExportMenu, ErrorBoundary } from './Components';

const JpgToPdf = () => {
  // States
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('upload');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [downloadDelay, setDownloadDelay] = useState(0);
  
  const fileInputRef = useRef(null);

  // Utility Functions
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const processedImg = new Image();
        processedImg.onload = () => resolve(processedImg);
        processedImg.src = canvas.toDataURL('image/jpeg', 1.0);
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const normalizeRotation = (degrees) => {
    return ((degrees % 360) + 360) % 360;
  };

  // File Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (event) => {
    handleFiles(Array.from(event.target.files));
  };

  const handleFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
  
    setLoadingType('processing');
    setIsProcessing(true);
    setProgress(0);
  
    try {
      const validFiles = [];
      const validImageTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'image/webp', 'image/bmp', 'image/tiff'
      ];
      
      for (const file of selectedFiles) {
        if (!validImageTypes.includes(file.type)) {
          toast.error(`${file.name} is not a supported image type`);
          continue;
        }
  
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 10MB size limit`);
          continue;
        }
  
        try {
          const preview = await readFileAsDataURL(file);
          validFiles.push({
            id: Math.random().toString(36).substring(7),
            file,
            preview,
            name: file.name,
            size: file.size,
            rotation: 0
          });
  
          setProgress((validFiles.length / selectedFiles.length) * 100);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          toast.error(`Failed to process ${file.name}`);
        }
      }
  
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        setCurrentStep('preview');
        toast.success(`Added ${validFiles.length} images`);
      }
    } catch (error) {
      toast.error('Error processing files');
    } finally {
      setIsProcessing(false);
      setLoadingType(null);
      setProgress(0);
    }
  };

  // File Manipulation
  const handleRotate = (fileId, direction) => {
    setFiles(prev => 
      prev.map(file => {
        if (file.id === fileId) {
          const newRotation = normalizeRotation(
            file.rotation + (direction === 'left' ? -90 : 90)
          );
          return { ...file, rotation: newRotation };
        }
        return file;
      })
    );
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (files.length <= 1) {
      setCurrentStep('upload');
      setPdfBlob(null);
    }
  };
  const handleConvertToPdf = async () => {
    if (files.length === 0) return;
  
    setLoadingType('converting');
    setIsProcessing(true);
    setProgress(0);
  
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < files.length; i++) {
        if (i > 0) pdf.addPage();
  
        const img = await createImage(files[i].preview);
        const { width: pdfWidth, height: pdfHeight } = pdf.internal.pageSize;
        
        // Calculate dimensions to maintain aspect ratio
        const imgRatio = img.width / img.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let renderWidth = pdfWidth;
        let renderHeight = pdfWidth / imgRatio;
  
        if (renderHeight > pdfHeight) {
          renderHeight = pdfHeight;
          renderWidth = pdfHeight * imgRatio;
        }
  
        const x = (pdfWidth - renderWidth) / 2;
        const y = (pdfHeight - renderHeight) / 2;
  
        // Handle rotation
        if (files[i].rotation !== 0) {
          const rotationAngle = (files[i].rotation % 360);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (rotationAngle === 90 || rotationAngle === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }
  
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotationAngle * Math.PI) / 180);
          ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();
  
          const rotatedImage = new Image();
          await new Promise((resolve) => {
            rotatedImage.onload = resolve;
            rotatedImage.src = canvas.toDataURL('image/jpeg', 1.0);
          });
  
          pdf.addImage(
            rotatedImage,
            'JPEG',
            x,
            y,
            renderWidth,
            renderHeight,
            `img_${i}`,
            'FAST'
          );
        } else {
          pdf.addImage(
            img,
            'JPEG',
            x,
            y,
            renderWidth,
            renderHeight,
            `img_${i}`,
            'FAST'
          );
        }
  
        setProgress(((i + 1) / files.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
  
      const blob = pdf.output('blob');
      setPdfBlob(blob);
      setCurrentStep('complete');
      toast.success('PDF created successfully!');
    } catch (error) {
      console.error('PDF creation error:', error);
      toast.error('Failed to create PDF');
    } finally {
      setIsProcessing(false);
      setLoadingType(null);
      setProgress(0);
    }
  };

  // Action Handlers
  const handleShare = async () => {
    if (!pdfBlob || currentStep !== 'complete' || isProcessing) return;
  
    try {
      if (navigator.share && pdfBlob) {
        const file = new File([pdfBlob], 'document.pdf', { type: 'application/pdf' });
        await navigator.share({
          files: [file],
          title: 'Share PDF',
          text: 'Check out this PDF'
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      toast.error('Unable to share');
    }
  };
  
  const handlePrint = () => {
    if (!pdfBlob || currentStep !== 'complete' || isProcessing) return;
  
    const url = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  };
  
  const handleDownload = async () => {
    if (!pdfBlob || currentStep !== 'complete' || isProcessing) return;
  
    setLoadingType('downloading');
    setIsProcessing(true);
  
    try {
      // 5 second countdown
      for(let i = 5; i > 0; i--) {
        setDownloadDelay(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
  
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setDownloadDelay(0);
      setIsProcessing(false);
      setLoadingType(null);
    }
  };

  const handleStartOver = () => {
    if (isProcessing) return;
    setFiles([]);
    setPdfBlob(null);
    setCurrentStep('upload');
    setShowExportMenu(false);
    setDownloadDelay(0);
  };

  const handleExport = async (type, format) => {
    if (isProcessing) return;
    setLoadingType('exporting');
    setIsProcessing(true);
    setProgress(0);
  
    try {
      if (type === 'pdf') {
        const pdf = new jsPDF();
        
        for (let i = 0; i < files.length; i++) {
          if (i > 0) pdf.addPage();
          
          const img = await createImage(files[i].preview);
          const { width: pdfWidth, height: pdfHeight } = pdf.internal.pageSize;
          
          const quality = format === 'high' ? 1 : 
                         format === 'compressed' ? 0.5 : 0.8;
          
          // ... (same PDF creation logic as handleConvertToPdf)
          
          setProgress(((i + 1) / files.length) * 100);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
  
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `converted_${Date.now()}_${format}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
  
      } else if (type === 'images') {
        for (let i = 0; i < files.length; i++) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = await createImage(files[i].preview);
  
          canvas.width = img.width;
          canvas.height = img.height;
  
          if (files[i].rotation !== 0) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((files[i].rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }
  
          ctx.drawImage(img, 0, 0);
  
          if (files[i].rotation !== 0) {
            ctx.restore();
          }
  
          const mimeType = format === 'png' ? 'image/png' : 
                          format === 'webp' ? 'image/webp' : 'image/jpeg';
          const quality = format === 'jpeg' ? 0.92 : undefined;
          
          const dataUrl = canvas.toDataURL(mimeType, quality);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `image_${i + 1}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          setProgress(((i + 1) / files.length) * 100);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
  
      toast.success(`Export completed!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export files');
    } finally {
      setIsProcessing(false);
      setLoadingType(null);
      setProgress(0);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <Toaster position="top-right" />

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

        {/* Image Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedFile && (
            <PreviewModal
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              file={selectedFile}
              onRotate={handleRotate}
            />
          )}
        </AnimatePresence>

        {/* Left Panel - Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center p-4 border-b bg-white">
            <button 
              onClick={handleStartOver}
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
                    accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff"
                    multiple
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Drop your images here
                  </h3>
                  <p className="text-sm text-gray-500">
                    or click to browse
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    Supports JPG, PNG, GIF, WebP, BMP, TIFF • Up to 10MB per file
                  </div>
                </div>
              </div>
            )}

            {(currentStep === 'preview' || currentStep === 'complete') && (
              <div className="max-w-3xl mx-auto">
                {files.map((file, index) => (
                  <div key={file.id} className="mb-4 group relative">
                    <img
                      src={file.preview}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-lg"
                      style={{ transform: `rotate(${file.rotation}deg)` }}
                    />
                    {currentStep === 'preview' && !isProcessing && (
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 
                                    group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRotate(file.id, 'left')}
                          className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRotate(file.id, 'right')}
                          className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Page number indicator */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 
                                  rounded text-sm">
                      Page {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Tools */}
        <div className="w-80 bg-white border-l flex flex-col">
          {/* Status Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2 mb-2">
              {currentStep === 'complete' ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Done</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  <span className="font-medium text-gray-600">In Progress</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {files.length > 0 ? (
                <>
                  <div className="truncate">{files[0].name}</div>
                  <div>
                    {pdfBlob ? 
                      `${(pdfBlob.size / 1024).toFixed(1)} KB • ${files.length} pages` : 
                      `${files.length} images selected`
                    }
                  </div>
                </>
              ) : (
                'No files selected'
              )}
            </div>
          </div>
{/* Action Buttons */}
<div className="p-4 space-y-2">
            {currentStep === 'preview' && (
              <div className="space-y-2">
                <button
                  onClick={handleConvertToPdf}
                  disabled={isProcessing || files.length === 0}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                           flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>Convert to PDF</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 
                           flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Images</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff"
                  multiple
                  className="hidden"
                  key={files.length}
                  disabled={isProcessing}
                />
              </div>
            )}

            {currentStep === 'complete' && (
              <>
                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                           flex items-center justify-center space-x-2 relative overflow-hidden
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>
                      {downloadDelay > 0 ? `Downloading in ${downloadDelay}s...` : 'Download'}
                    </span>
                    {!downloadDelay && <ChevronDown className="w-4 h-4 ml-1" />}
                  </div>
                  {downloadDelay > 0 && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-blue-400"
                      style={{
                        width: `${(downloadDelay / 5) * 100}%`,
                        transition: 'width 1s linear'
                      }}
                    />
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isProcessing}
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 
                             flex items-center justify-between disabled:opacity-50"
                  >
                    <span>Export As</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <ExportMenu
                    isOpen={showExportMenu}
                    onClose={() => setShowExportMenu(false)}
                    onExport={handleExport}
                  />
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          {currentStep === 'complete' && pdfBlob && (
            <div className="flex justify-around p-4 border-t border-b">
              <button
                onClick={handleShare}
                disabled={isProcessing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group 
                         disabled:opacity-50 disabled:cursor-not-allowed"
                title="Share"
              >
                <Share className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
              </button>
              <button
                onClick={handlePrint}
                disabled={isProcessing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group
                         disabled:opacity-50 disabled:cursor-not-allowed"
                title="Print"
              >
                <Printer className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
              </button>
              <button
                onClick={handleStartOver}
                disabled={isProcessing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group
                         disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
              </button>
            </div>
          )}

          {/* Tools */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium mb-3">Continue with</h3>
            <div className="space-y-2">
              {[
                { icon: FileText, label: 'Compress PDF', action: () => toast.info('Compress feature coming soon') },
                { icon: Lock, label: 'Protect PDF', action: () => toast.info('Protection feature coming soon') },
                { icon: Edit2, label: 'Edit PDF', action: () => toast.info('Edit feature coming soon') }
              ].map((tool) => (
                <button
                  key={tool.label}
                  onClick={tool.action}
                  disabled={isProcessing}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg 
                           flex items-center group transition-colors disabled:opacity-50"
                >
                  <tool.icon className="w-5 h-5 mr-3 text-gray-600 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">{tool.label}</span>
                  <ChevronDown className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Start Over Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleStartOver}
              disabled={isProcessing}
              className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Start over</span>
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default JpgToPdf;