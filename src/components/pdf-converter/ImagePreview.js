import React from 'react';
import { X, Move } from 'lucide-react';

const ImagePreview = ({ file, index, provided, onRemove }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="relative group bg-white rounded-lg shadow-sm"
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200">
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onRemove}
              className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
          <div 
            {...provided.dragHandleProps}
            className="absolute top-2 left-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          >
            <Move size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
      <div className="p-2 text-sm text-gray-600">
        <p className="truncate">{file.name}</p>
        <p className="text-xs text-gray-400">
          {(file.size / 1024).toFixed(1)} KB • Page {index + 1}
        </p>
      </div>
    </div>
  );
};

export default ImagePreview;