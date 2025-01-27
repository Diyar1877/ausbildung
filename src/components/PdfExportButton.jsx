import React from 'react';
import html2pdf from 'html2pdf.js';

const PdfExportButton = ({ post }) => {
  const exportToPdf = () => {
    const postElement = document.querySelector('.post-content');
    
    const opt = {
      margin: 1,
      filename: `${post.title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(postElement).save();
  };

  return (
    <button
      onClick={exportToPdf}
      className="text-gray-500 hover:text-blue-500 transition-colors"
      title="Als PDF exportieren"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
};

export default PdfExportButton;
