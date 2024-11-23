import React from 'react';
import { Sliders, Image, FileText, FileDown } from 'lucide-react';

const CompressionControls = ({ settings, onSettingsChange }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      {/* Image Quality */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Image className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">Image Quality</span>
          </div>
          <span className="text-sm text-gray-500">{settings.imageQuality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.imageQuality}
          onChange={(e) => handleSettingChange('imageQuality', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Smaller Size</span>
          <span>Better Quality</span>
        </div>
      </div>

      {/* Image Resolution */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Sliders className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">Image Resolution</span>
          </div>
          <span className="text-sm text-gray-500">{settings.imageScale}x</span>
        </div>
        <select
          value={settings.imageScale}
          onChange={(e) => handleSettingChange('imageScale', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="0.25">0.25x (Low Resolution)</option>
          <option value="0.5">0.5x (Medium Resolution)</option>
          <option value="0.75">0.75x (High Resolution)</option>
          <option value="1">1x (Original Resolution)</option>
        </select>
      </div>

      {/* Compression Method */}
      <div className="p-4 border-b">
        <div className="flex items-center mb-2">
          <FileText className="w-5 h-5 text-purple-500 mr-2" />
          <span className="text-sm font-medium">Compression Method</span>
        </div>
        <div className="space-y-2">
          {['lossless', 'balanced', 'aggressive'].map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="radio"
                name="compressionMethod"
                value={method}
                checked={settings.compressionMethod === method}
                onChange={(e) => handleSettingChange('compressionMethod', e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm capitalize">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="p-4 border-b">
        <div className="flex items-center mb-2">
          <Sliders className="w-5 h-5 text-orange-500 mr-2" />
          <span className="text-sm font-medium">Advanced Options</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.compressMetadata}
              onChange={(e) => handleSettingChange('compressMetadata', e.target.checked)}
              className="text-blue-600 rounded"
            />
            <span className="text-sm">Compress Metadata</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.removeUnused}
              onChange={(e) => handleSettingChange('removeUnused', e.target.checked)}
              className="text-blue-600 rounded"
            />
            <span className="text-sm">Remove Unused Elements</span>
          </label>
        </div>
      </div>

      {/* Estimated Output Size */}
      {settings.estimatedSize && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileDown className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium">Estimated Size</span>
            </div>
            <span className="text-sm text-gray-500">{settings.estimatedSize}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompressionControls;