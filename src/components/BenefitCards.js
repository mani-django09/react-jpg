import React from 'react';
import { Laptop, Monitor, Cog, Zap, Infinity, Wifi } from 'lucide-react';

const BenefitCards = () => {
  const benefits = [
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "No installation necessary",
      description: "PDF24's online tools work directly in the web browser. You do not need to install any software. This means you can use the PDF24 tools on any device with an Internet connection.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Supports your system",
      description: "PDF24 supports all current operating systems and browsers. Whether on Windows, Linux, MACs or smartphones, PDF24 does a good job almost everywhere.",
      iconBg: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: "Saves your resources",
      description: "The PDF24 Online Tools process files on special PDF24 servers. Your system is not burdened in the process and therefore does not need any special requirements.",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "100% free of charge",
      description: "You can use all PDF24 tools free of charge and without any restrictions. This is achieved via some advertising on the web pages. PDF24 is not greedy, but smart.",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: <Infinity className="w-8 h-8" />,
      title: "No limits",
      description: "There are no artificial limits at PDF24. Thanks to our scalable infrastructure, we can make everything that the PDF24 tools can do available to users.",
      iconBg: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Online and Offline",
      description: "PDF24's online tools process files on special PDF24 servers. If you prefer to work offline, you can install the PDF24 Creator and receive all PDF24 tools as an offline version.",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid for benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className={`flex justify-center mb-6`}>
                <div className={`${benefit.iconBg} ${benefit.iconColor} p-4 rounded-lg`}>
                  {benefit.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitCards;