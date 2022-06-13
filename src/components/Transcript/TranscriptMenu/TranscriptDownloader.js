import { fileDownload } from '@Services/utility-helpers';
import React from 'react';

const TranscriptDownloader = ({ fileUrl, fileName }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fileDownload(fileUrl, fileName);
  };

  return (
    <button
      className="irmp--transcript_downloader"
      data-testid="transcript-downloader"
      onClick={handleDownload}
      href="#"
    >
      <span className="download-label"></span>
    </button>
  );
};

export default TranscriptDownloader;
