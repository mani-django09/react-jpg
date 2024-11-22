import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';

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
      if (navigator.share) {
        await navigator.share({
          title: file.name,
          text: 'Check out this converted document',
          url: file.url
        });
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(file.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share file');
    }
  },

  printPdf: (file) => {
    try {
      const printUrl = file.preview || file.url;
      if (!printUrl) {
        toast.error('Print preview not available');
        return;
      }

      // Create an iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = function() {
        try {
          // Add print specific styles
          const style = document.createElement('style');
          style.textContent = `
            @media print {
              @page { margin: 0; }
              body { margin: 1.6cm; }
            }
          `;
          iframe.contentDocument.head.appendChild(style);

          // Start print
          setTimeout(() => {
            try {
              iframe.contentWindow.print();
              // Remove the iframe after printing
              setTimeout(() => document.body.removeChild(iframe), 1000);
            } catch (e) {
              console.error('Print error:', e);
              document.body.removeChild(iframe);
              toast.error('Print failed. Please try downloading and printing manually.');
            }
          }, 1000);
        } catch (e) {
          console.error('Print setup error:', e);
          document.body.removeChild(iframe);
          toast.error('Failed to prepare document for printing');
        }
      };

      // Load the PDF in the iframe
      iframe.src = `${printUrl}#toolbar=0&view=FitH`;

    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print document');
      
      // Fallback - open in new window
      try {
        window.open(file.preview || file.url, '_blank');
      } catch (fallbackError) {
        console.error('Print fallback error:', fallbackError);
        toast.error('Please try downloading and printing manually');
    }
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