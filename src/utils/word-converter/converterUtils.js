// src/utils/word-converter/converterUtils.js
export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };
  
  export const generateFileName = (originalName) => {
    const timestamp = new Date().getTime();
    return `converted_${timestamp}.pdf`;
  };
  
  export const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          originalFile: file
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  export const convertToPdf = async (file) => {
    // Simulate conversion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      name: file.name.replace(/\.(doc|docx|rtf|odt)$/i, '.pdf'),
      size: '132 KB',
      pages: 1,
      preview: file.preview,
      url: file.preview
    };
  };