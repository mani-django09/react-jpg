import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft,
  ChevronRight,
  Search,
  Tool,
} from 'lucide-react';

const PdfViewerToolbar = ({ 
  currentPage,
  totalPages,
  zoom,
  onZoomChange,
  onPageChange 
}) => {
  const handlePageInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(2, zoom + 0.1));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.5, zoom - 0.1));
  };

  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-white border-b border-gray-200">
      {/* Page Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageInput}
            className="w-16 text-center border rounded-lg px-2 py-1"
          />
          <span className="text-gray-600">/ {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2 border-l border-r border-gray-200 px-4">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <span className="text-sm min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Tools */}
      <div className="flex items-center space-x-2">
        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <Tool className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PdfViewerToolbar;