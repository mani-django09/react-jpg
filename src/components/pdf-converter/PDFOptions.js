import React from 'react';

const PDFOptions = ({ options, onChange }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-4">PDF Settings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Orientation</label>
          <select
            value={options.orientation}
            onChange={(e) => onChange({ ...options, orientation: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Page Size</label>
          <select
            value={options.pageSize}
            onChange={(e) => onChange({ ...options, pageSize: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Quality</label>
          <select
            value={options.quality}
            onChange={(e) => onChange({ ...options, quality: parseFloat(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm"
          >
            <option value="0.6">Low</option>
            <option value="0.8">Medium</option>
            <option value="1">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Margin (mm)</label>
          <input
            type="number"
            value={options.margin}
            onChange={(e) => onChange({ ...options, margin: parseInt(e.target.value) })}
            min="0"
            max="50"
            className="w-full rounded-md border-gray-300 shadow-sm text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fitToPage"
            checked={options.fitToPage}
            onChange={(e) => onChange({ ...options, fitToPage: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm"
          />
          <label htmlFor="fitToPage" className="text-sm text-gray-700">
            Fit images to page
          </label>
        </div>
      </div>
    </div>
  );
};

export default PDFOptions;