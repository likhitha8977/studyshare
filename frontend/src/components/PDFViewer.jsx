import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./PDFViewer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ pdfUrl, maxPages = 10 }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please try again.");
    setLoading(false);
  }

  const displayPages = Math.min(numPages || 0, maxPages);

  return (
    <div className="pdf-viewer">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          <p className="ml-4 text-gray-600">Loading PDF...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=""
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-4">
          {!loading && !error && numPages && (
            <>
              {Array.from(new Array(displayPages), (el, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="border border-gray-300 shadow-sm"
                >
                  <div className="bg-gray-100 px-3 py-1 text-sm text-gray-600 border-b">
                    Page {index + 1} of {numPages}
                    {displayPages < numPages && index + 1 === displayPages && (
                      <span className="ml-2 text-violet-600 font-semibold">
                        (Preview limited to {maxPages} pages)
                      </span>
                    )}
                  </div>
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={600}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </Document>

      {!loading && !error && numPages > displayPages && (
        <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded text-center">
          <p className="text-violet-800 font-semibold">
            📄 This document has {numPages} pages. Preview shows first{" "}
            {displayPages} pages.
          </p>
          <p className="text-violet-600 text-sm mt-1">
            Download or purchase to view the complete document.
          </p>
        </div>
      )}
    </div>
  );
}
