import { 
  Settings, 
  File, 
  Upload, 
  Lock, 
  Download, 
  FileText 
} from 'lucide-react';

export const FEATURE_CARDS = [
  {
    id: 1,
    title: "High Quality Conversion",
    description: "Convert Word to high-quality PDF while maintaining formatting",
    Icon: Settings,
    color: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    title: "Batch Processing",
    description: "Convert multiple Word documents at once",
    Icon: File,
    color: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: 3,
    title: "Simple to Use",
    description: "User-friendly interface for quick conversion",
    Icon: Upload,
    color: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    title: "100% Secure",
    description: "Your files are processed securely and automatically deleted",
    Icon: Lock,
    color: "bg-red-50",
    iconColor: "text-red-600"
  },
  {
    id: 5,
    title: "Free to Use",
    description: "Convert Word to PDF completely free with no limitations",
    Icon: Download,
    color: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: 6,
    title: "Maintain Formatting",
    description: "Preserve original document formatting and layout",
    Icon: FileText,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600"
  }
];

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "How do I convert Word to PDF?",
    answer: "Simply drag and drop your Word document into the upload area, or click to select a file. Once uploaded, click 'Convert to PDF'. After conversion, you can download your PDF file."
  },
  {
    id: 2,
    question: "What file types are supported?",
    answer: "We support DOC, DOCX, RTF, and ODT files. Make sure your file is in one of these formats before uploading."
  },
  {
    id: 3,
    question: "Is the formatting preserved?",
    answer: "Yes! Our converter maintains all formatting including fonts, images, tables, and layouts from your original Word document."
  },
  {
    id: 4,
    question: "What's the maximum file size allowed?",
    answer: "The maximum file size limit is 50MB for Word documents. For larger files, you may need to split your document first."
  },
  {
    id: 5,
    question: "Is it secure to use this converter?",
    answer: "Yes, your files are processed securely and automatically deleted after conversion. We don't store any of your files or data."
  },
  {
    id: 6,
    question: "Can I convert multiple files?",
    answer: "Yes! You can convert multiple Word documents at once. Simply select all the files you want to convert and upload them together."
  }
];