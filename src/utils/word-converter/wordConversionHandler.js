import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import mammoth from 'mammoth';

export const WordConversionHandler = {
  processFile: async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            // Convert Word content to HTML
            const arrayBuffer = reader.result;
            let content = '';
            
            try {
              const result = await mammoth.convertToHtml({ arrayBuffer });
              content = result.value;
            } catch (err) {
              console.error('Mammoth conversion error:', err);
              content = await WordConversionHandler.extractTextContent(arrayBuffer);
            }

            const documentPreview = `data:image/svg+xml;base64,${btoa(`
              <svg width="100%" height="100%" viewBox="0 0 595 842" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="white"/>
                <text x="50" y="50" font-family="Arial" font-size="12" fill="#666">
                  <tspan x="50" dy="1.2em">${file.name}</tspan>
                  <tspan x="50" dy="1.2em">Content preview...</tspan>
                </text>
                ${content.slice(0, 500)}
              </svg>
            `)}`;

            resolve({
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: WordConversionHandler.formatFileSize(file.size),
              type: file.type,
              preview: documentPreview,
              originalFile: file,
              content: content
            });
          } catch (error) {
            reject(new Error('Failed to process document content'));
          }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error('Failed to process file'));
      }
    });
  },

  convertToPdf: async (file) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
  
      pdf.setFont('helvetica');
      pdf.setFontSize(12);
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      const maxWidth = pageWidth - (margin * 2);
  
      // Add document title
      pdf.setFontSize(16);
      pdf.text(file.name.replace(/\.(doc|docx|rtf|odt)$/i, ''), margin, margin);
      
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(file.content, maxWidth);
      let y = margin + 30;
  
      // Track number of pages
      let pageCount = 1;
  
      for (let i = 0; i < lines.length; i++) {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          pageCount++;
          y = margin;
        }
        pdf.text(lines[i], margin, y);
        y += 15;
      }
  
      // Create both blob URL and data URL
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const dataUrl = pdf.output('dataurlstring');
  
      // Calculate file size
      const fileSize = WordConversionHandler.formatFileSize(pdfBlob.size);
  
      return {
        name: file.name.replace(/\.(doc|docx|rtf|odt)$/i, '.pdf'),
        size: fileSize || '0 KB', // Provide fallback size
        pages: pageCount || 1, // Provide fallback page count
        preview: dataUrl,
        url: blobUrl,
        blob: pdfBlob,
        content: file.content,
        convertedFrom: file.name,
        metadata: {
          pageCount: pageCount,
          fileSize: fileSize,
          fileName: file.name.replace(/\.(doc|docx|rtf|odt)$/i, '.pdf')
        }
      };
    } catch (error) {
      throw new Error('Failed to convert file: ' + error.message);
    }
  },
  downloadPdf: async (file) => {
    try {
      // Create a blob URL if we don't have one
      const downloadUrl = file.url || URL.createObjectURL(file.blob) || file.preview;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL if we created one
      if (downloadUrl !== file.url && downloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  },

  sharePdf: async (file) => {
    try {
      // Create a blob if we don't have one
      const pdfBlob = file.blob || await fetch(file.preview).then(r => r.blob());
      const shareData = {
        files: [new File([pdfBlob], file.name, { type: 'application/pdf' })]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        // Try file sharing first
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else if (navigator.share) {
        // Fallback to URL sharing
        await navigator.share({
          title: file.name,
          text: 'Check out this converted PDF',
          url: file.url || file.preview
        });
        toast.success('Shared successfully!');
      } else if (navigator.clipboard) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(file.url || file.preview);
        toast.success('Link copied to clipboard!');
      } else {
        // Final fallback - download
        await WordConversionHandler.downloadPdf(file);
      }
    } catch (error) {
      if (error.name !== 'AbortError') { // Don't show error if user cancelled
        console.error('Share error:', error);
        toast.error('Failed to share file');
      }
    }
  },

  printPdf: async (file) => {
    try {
      // Create a print window
      const printWindow = window.open('', '_blank');
      
      // Write the print document content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print ${file.name}</title>
            <style>
              @page {
                margin: 1cm;
                size: A4;
              }
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .header {
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
              }
              .content {
                line-height: 1.6;
                font-size: 12pt;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 16pt;">${file.name}</h1>
            </div>
            <div class="content">
              ${file.content}
            </div>
            <script>
              // Function to handle print
              function doPrint() {
                try {
                  window.print();
                  setTimeout(() => window.close(), 500);
                } catch (e) {
                  console.error('Print error:', e);
                }
              }
              // Wait for content to load
              document.addEventListener('DOMContentLoaded', () => {
                // Small delay to ensure content is rendered
                setTimeout(doPrint, 500);
              });
            </script>
          </body>
        </html>
      `);
  
      // Close the document writing
      printWindow.document.close();
  
      // Fallback in case the print doesn't trigger automatically
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          try {
            printWindow.print();
            setTimeout(() => printWindow.close(), 500);
          } catch (e) {
            console.error('Print fallback error:', e);
            printWindow.close();
            toast.error('Print dialog failed to open');
          }
        }
      }, 1000);
  
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print document');
    }
  },
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  extractTextContent: async (arrayBuffer) => {
    const textDecoder = new TextDecoder('utf-8');
    let content = textDecoder.decode(arrayBuffer);
    return content.replace(/[^\x20-\x7E\n]/g, '');
  }
};

export default WordConversionHandler;