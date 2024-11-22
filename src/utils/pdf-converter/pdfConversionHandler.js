import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export const PdfConversionHandler = {
  processFile: async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result;
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            // Create a preview URL
            const previewUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }));

            resolve({
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: PdfConversionHandler.formatFileSize(file.size),
              type: file.type,
              preview: previewUrl,
              pages: pageCount,
              originalFile: file,
              content: arrayBuffer
            });
          } catch (error) {
            reject(new Error('Failed to process PDF content'));
          }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error('Failed to process file'));
      }
    });
  },

  convertToWord: async (file) => {
    try {
      // Create a simple text content (in real app, you'd use a proper conversion library)
      const docxBlob = new Blob([file.content], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      return {
        name: file.name.replace('.pdf', '.docx'),
        size: PdfConversionHandler.formatFileSize(docxBlob.size),
        pages: file.pages,
        preview: file.preview,
        url: URL.createObjectURL(docxBlob),
        blob: docxBlob,
        content: file.content,
        convertedFrom: file.name
      };
    } catch (error) {
      throw new Error('Failed to convert file: ' + error.message);
    }
  },

  downloadWord: (file) => {
    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  },

  sharePdf: async (file) => {
    try {
      // First try using the Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: file.name,
            text: 'Shared PDF document',
            url: window.location.href
          });
          toast.success('Shared successfully!');
          return;
        } catch (error) {
          if (error.name !== 'AbortError') {
            throw error;
          }
        }
      }

      // Fallback to copying to clipboard
      const shareMessage = `Check out this document: ${file.name}\n${window.location.href}`;
      await navigator.clipboard.writeText(shareMessage);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      // Final fallback - download the file
      try {
        if (file.blob) {
          saveAs(file.blob, file.name); // Using saveAs directly
          toast.success('File downloaded successfully');
        } else if (file.preview) {
          const response = await fetch(file.preview);
          const blob = await response.blob();
          saveAs(blob, file.name);
          toast.success('File downloaded successfully');
        } else {
          toast.error('Unable to share or download file');
        }
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        toast.error('Failed to share or download file');
      }
    }
  },

  printPdf: async (file) => {
    try {
      // Get the blob for printing
      let printBlob = file.blob;
      if (!printBlob && file.preview) {
        const response = await fetch(file.preview);
        printBlob = await response.blob();
      }

      if (!printBlob) {
        throw new Error('No printable content available');
      }

      const printUrl = URL.createObjectURL(printBlob);
      
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.src = printUrl;

      // Add iframe to document
      document.body.appendChild(iframe);

      // Wait for iframe to load
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printError) {
          console.error('Print error:', printError);
          toast.error('Failed to print. Please try downloading and printing manually.');
        }

        // Cleanup after print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(printUrl);
        }, 1000);
      };

    } catch (error) {
      console.error('Print setup error:', error);
      toast.error('Failed to prepare document for printing');
      throw error;
    }
  },
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

export default PdfConversionHandler;