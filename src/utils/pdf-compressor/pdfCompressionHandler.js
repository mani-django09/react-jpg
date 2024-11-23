import { PDFDocument } from 'pdf-lib';
import { toast } from 'react-hot-toast';

class PdfCompressionHandler {
  static async processFile(file) {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file input');
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      const previewUrl = URL.createObjectURL(
        new Blob([arrayBuffer], { type: 'application/pdf' })
      );

      return {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: this.formatFileSize(file.size),
        originalSize: file.size,
        type: file.type,
        preview: previewUrl,
        pages: pageCount,
        originalFile: file,
        content: arrayBuffer
      };
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  static async processPdfWithSettings(file, settings) {
    try {
      // Load the PDF document with basic options
      const pdfDoc = await PDFDocument.load(file.content, { 
        ignoreEncryption: true,
      });

      // Create a new document to copy into
      const newPdfDoc = await PDFDocument.create();

      // Copy all pages from the original
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => newPdfDoc.addPage(page));

      // Apply basic optimization settings
      newPdfDoc.setLanguage('en-US');
      newPdfDoc.setTitle(settings.title || '');
      newPdfDoc.setAuthor(settings.author || '');
      newPdfDoc.setProducer('PDF Processor');
      newPdfDoc.setCreator('PDF Processor Web App');

      // Save with compression settings
      const pdfBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        compress: true
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Clean up old URL if exists
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      return {
        name: this.getOutputFileName(file.name),
        size: this.formatFileSize(blob.size),
        originalSize: file.originalSize,
        compressedSize: blob.size,
        pages: newPdfDoc.getPageCount(),
        preview: url,
        url: url,
        blob: blob,
        content: pdfBytes
      };
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to process PDF with settings');
    }
  }

  static getOutputFileName(originalName) {
    const baseName = originalName.replace(/\.pdf$/i, '');
    const timestamp = new Date().getTime();
    return `${baseName}_processed_${timestamp}.pdf`;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async downloadPdf(file) {
    try {
      if (!file?.url && !file?.preview) {
        throw new Error('No downloadable content');
      }
      const link = document.createElement('a');
      link.href = file.url || file.preview;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download file');
    }
  }

  static async sharePdf(file) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: file.name,
          text: 'Processed PDF Document',
          url: file.url || file.preview
        });
      } else {
        await navigator.clipboard.writeText(file.url || file.preview);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      throw new Error('Failed to share file');
    }
  }

  static async printPdf(file) {
    try {
      const printWindow = window.open(file.url || file.preview, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Print error:', error);
      throw new Error('Failed to print file');
    }
  }
}

export default PdfCompressionHandler;