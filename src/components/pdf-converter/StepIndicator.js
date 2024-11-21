import React from 'react';
import { Upload, Image, Download } from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Upload', icon: Upload },
    { number: 2, title: 'Preview', icon: Image },
    { number: 3, title: 'Download', icon: Download }
  ];

  return (
    <div className="flex justify-center items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`flex items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.number ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <step.icon size={16} />
            </div>
            <span className="ml-2 text-sm font-medium">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 ${
              currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;