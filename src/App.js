import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import JpgToPdf from './components/pdf-converter/JpgToPdf';
import PdfToJpg from './components/pdf-converter/PdfToJpg';
import WordToPdf from './components/word-to-pdf/WordToPdf';
import PdfToWord from './components/pdf-to-word/PdfToWord';
import CompressPdf from './components/compress-pdf/CompressPdf';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;