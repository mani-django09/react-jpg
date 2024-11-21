import React from 'react';
import BenefitCards from './BenefitCards';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  FileType,
  File, 
  Lock,
  Unlock,
  MessageSquare,
  Scissors,
  RotateCw,
  Download,
  Upload,
  Combine,
  FileDown,
  ArrowRight,
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    switch (tool.title) {
      case 'JPG to PDF':
        navigate('/jpg-to-pdf');
        break;
      case 'PDF to JPG':
        navigate('/pdf-to-jpg');
        break;
      case 'Word to PDF':
        navigate('/word-to-pdf');
        break;
      case 'PDF to Word':
        navigate('/pdf-to-word');
        break;
      case 'Compress PDF':
        navigate('/compress-pdf');
        break;
      case 'Protect PDF':
        navigate('/protect-pdf');
        break;
      case 'Unlock PDF':
        navigate('/unlock-pdf');
        break;
      case 'Split PDF':
        navigate('/split-pdf');
        break;
      case 'Merge PDF':
        navigate('/merge-pdf');
        break;
      case 'Compress Image':
        navigate('/compress-image');
        break;
      default:
        console.log('Route not implemented yet');
    }
  };

  const tools = [
    {
      id: 1,
      title: 'JPG to PDF',
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      description: 'Convert JPG images to PDF format',
      color: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'PDF to JPG',
      icon: <Download className="w-6 h-6 text-orange-600" />,
      description: 'Convert PDF to JPG or extract images from PDF',
      color: 'bg-orange-50'
    },
    {
      id: 3,
      title: 'Word to PDF',
      icon: <FileText className="w-6 h-6 text-green-600" />,
      description: 'Convert Word documents to PDF format',
      color: 'bg-green-50'
    },
    {
      id: 4,
      title: 'PDF to Word',
      icon: <FileType className="w-6 h-6 text-blue-600" />,
      description: 'Convert PDF files to editable Word documents',
      color: 'bg-blue-50'
    },
    {
      id: 5,
      title: 'Compress PDF',
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      description: 'Electronically Compress PDF documents',
      color: 'bg-purple-50'
    },
    {
      id: 6,
      title: 'Protect PDF',
      icon: <Lock className="w-6 h-6 text-red-600" />,
      description: 'Encrypt PDF with a password',
      color: 'bg-red-50'
    },
    {
      id: 7,
      title: 'Unlock PDF',
      icon: <Unlock className="w-6 h-6 text-green-600" />,
      description: 'Remove password protection from PDF',
      color: 'bg-green-50'
    },
    {
      id: 8,
      title: 'Split PDF',
      icon: <Scissors className="w-6 h-6 text-orange-600" />,
      description: 'Split PDF into multiple files',
      color: 'bg-orange-50'
    },
    {
      id: 9,
      title: 'Merge PDF',
      icon: <Combine className="w-6 h-6 text-blue-600" />,
      description: 'Combine multiple PDFs into one file',
      color: 'bg-blue-50'
    },
    {
      id: 10,
      title: 'Compress PDF',
      icon: <FileDown className="w-6 h-6 text-purple-600" />,
      description: 'Reduce PDF file size',
      color: 'bg-purple-50'
    },
    {
      id: 11,
      title: 'Compress Image',
      icon: <RotateCw className="w-6 h-6 text-green-600" />,
      description: 'Rotate PDF pages',
      color: 'bg-green-50'
    },
  ];

  const solutions = [
    {
      title: 'Desktop App',
      description: 'Work with PDFs offline on your Windows PC',
      icon: <File className="w-8 h-8 text-gray-600 mb-3" />,
      buttonText: 'Download'
    },
    {
      title: 'Mobile App',
      description: 'Work with PDFs on your iOS or Android device',
      icon: <File className="w-8 h-8 text-gray-600 mb-3" />,
      buttonText: 'Download'
    },
    {
      title: 'API Integration',
      description: 'Integrate PDF tools into your application',
      icon: <File className="w-8 h-8 text-gray-600 mb-3" />,
      buttonText: 'Learn more'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 sm:py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className={`${tool.color} rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{tool.title}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <BenefitCards />

      {/* Additional Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why choose our PDF tools?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="text-xl font-semibold mb-2">Easy to Use</div>
                <p className="text-gray-600">Simple interface for quick and efficient PDF operations</p>
              </div>
              <div className="p-6">
                <div className="text-xl font-semibold mb-2">100% Secure</div>
                <p className="text-gray-600">Your files are automatically deleted after processing</p>
              </div>
              <div className="p-6">
                <div className="text-xl font-semibold mb-2">Free to Use</div>
                <p className="text-gray-600">All basic tools are free with no hidden costs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              The PDF software trusted by millions of users
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your trusted one-stop app for editing PDF with ease. 
              Enjoy all the tools you need to work efficiently with your digital documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;