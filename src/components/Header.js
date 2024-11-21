import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, FileType, File, Lock, Unlock, 
         MessageSquare, Scissors, RotateCw, Upload, Combine, 
         FilePlus, FileDown, ImageIcon, Chrome } from 'lucide-react';

const Header = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toolsCategories = [
    {
      title: "Convert to PDF",
      tools: [
        { name: "JPG to PDF", icon: <ImageIcon className="w-5 h-5" />, link: "/jpg-to-pdf" },
        { name: "Word to PDF", icon: <FileText className="w-5 h-5" />, link: "/word-to-pdf" },
        { name: "PowerPoint to PDF", icon: <FileText className="w-5 h-5" />, link: "/ppt-to-pdf" },
        { name: "Excel to PDF", icon: <FileText className="w-5 h-5" />, link: "/excel-to-pdf" }
      ]
    },
    {
      title: "Convert from PDF",
      tools: [
        { name: "PDF to Word", icon: <FileType className="w-5 h-5" />, link: "/pdf-to-word" },
        { name: "PDF to JPG", icon: <ImageIcon className="w-5 h-5" />, link: "/pdf-to-jpg" },
        { name: "PDF to PPT", icon: <FileText className="w-5 h-5" />, link: "/pdf-to-ppt" },
        { name: "PDF to Excel", icon: <FileText className="w-5 h-5" />, link: "/pdf-to-excel" }
      ]
    },
    {
      title: "Basic Tools",
      tools: [
        { name: "Merge PDF", icon: <Combine className="w-5 h-5" />, link: "/merge-pdf" },
        { name: "Split PDF", icon: <Scissors className="w-5 h-5" />, link: "/split-pdf" },
        { name: "Compress PDF", icon: <FileDown className="w-5 h-5" />, link: "/compress-pdf" },
        { name: "Rotate PDF", icon: <RotateCw className="w-5 h-5" />, link: "/rotate-pdf" }
      ]
    },
    {
      title: "Advanced Tools",
      tools: [
        { name: "Protect PDF", icon: <Lock className="w-5 h-5" />, link: "/protect-pdf" },
        { name: "Unlock PDF", icon: <Unlock className="w-5 h-5" />, link: "/unlock-pdf" },
        { name: "Sign PDF", icon: <MessageSquare className="w-5 h-5" />, link: "/sign-pdf" },
        { name: "Add Page Numbers", icon: <FilePlus className="w-5 h-5" />, link: "/add-page-numbers" }
      ]
    }
  ];

  return (
    <header className="sticky top-0 bg-white border-b z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">I</span>
              <span className="text-red-500 text-2xl px-0.5">❤</span>
              <span className="text-2xl font-bold">PDF</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link 
                to="/merge-pdf" 
                className="px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900"
              >
                MERGE PDF
              </Link>
              <Link 
                to="/split-pdf" 
                className="px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900"
              >
                SPLIT PDF
              </Link>
              <Link 
                to="/compress-pdf" 
                className="px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900"
              >
                COMPRESS PDF
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 flex items-center">
                  CONVERT PDF
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <button 
                  className="px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 flex items-center"
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                >
                  ALL PDF TOOLS
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* All Tools Dropdown */}
                {isToolsOpen && (
                  <div className="absolute top-full left-0 w-screen max-w-6xl bg-white shadow-lg rounded-lg mt-1 -ml-[500px] border">
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-6">
                        {toolsCategories.map((category, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.tools.map((tool, toolIndex) => (
                                <li key={toolIndex}>
                                  <Link
                                    to={tool.link}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm py-1"
                                    onClick={() => setIsToolsOpen(false)}
                                  >
                                    <span className="text-gray-400">{tool.icon}</span>
                                    <span>{tool.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <Download className="w-5 h-5" />
            </button>
            <button className="px-3 py-1.5 text-[13px] text-gray-700 hover:text-gray-900">
              Login
            </button>
            <button className="px-4 py-1.5 text-[13px] font-medium text-white bg-red-500 rounded hover:bg-red-600">
              Sign up
            </button>
            <button className="p-2 text-gray-700 hover:text-gray-900 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for closing dropdown when clicking outside */}
      {isToolsOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20" 
          onClick={() => setIsToolsOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;