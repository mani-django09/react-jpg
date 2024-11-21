import { toast } from 'react-hot-toast';

export const validateWordFile = (file) => {
  // Supported MIME types
  const supportedTypes = {
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/rtf': '.rtf',
    'application/vnd.oasis.opendocument.text': '.odt'
  };

  // Check by file extension as well (more reliable sometimes)
  const supportedExtensions = ['.doc', '.docx', '.rtf', '.odt'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

  const errors = [];
  const maxSize = 50 * 1024 * 1024; // 50MB

  // Check file type
  if (!supportedTypes[file.type] && !supportedExtensions.includes(fileExtension)) {
    errors.push(`File type not supported. Please upload a Word document (${supportedExtensions.join(', ')})`);
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size is ${formatFileSize(maxSize)}`);
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileType: supportedTypes[file.type] || fileExtension
  };
};

export const processWordFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Process the file
      try {
        resolve({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          preview: reader.result,
          originalFile: file,
          processed: true
        });
      } catch (error) {
        reject(new Error('Failed to process file: ' + error.message));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onabort = () => reject(new Error('File reading aborted'));

    // Start reading the file
    try {
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(new Error('Failed to start file reading: ' + error.message));
    }
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};