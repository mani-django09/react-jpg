import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SimpleDownloadButton = ({ onDownload, file }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    if (!file || isDownloading) return;

    setIsDownloading(true);

    try {
      await onDownload(file);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDownloading}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                 flex items-center justify-center space-x-2 transition-all duration-300
                 disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
      <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
    </button>
  );
};

export default SimpleDownloadButton;