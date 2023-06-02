import React from 'react';
import PropTypes from 'prop-types';
import { fileDownload } from '@Services/utility-helpers';

const TranscriptDownloader = ({ fileUrl, fileName, machineGenerated }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fileDownload(fileUrl, fileName, machineGenerated);
  };

  return (
    <button
      className="ramp--transcript_downloader"
      data-testid="transcript-downloader"
      onClick={handleDownload}
      href="#"
    >
      <span className="download-label"></span>
    </button>
  );
};

TranscriptDownloader.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  machineGenerated: PropTypes.bool.isRequired
};

export default TranscriptDownloader;
