import React from 'react';
import PropTypes from 'prop-types';
import { fileDownload } from '@Services/utility-helpers';

const TranscriptDownloader = ({ fileUrl, fileName, machineGenerated, fileExt }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fileDownload(fileUrl, fileName, fileExt, machineGenerated);
  };

  return (
    <button
      className="ramp--transcript_downloader"
      data-testid="transcript-downloader"
      onClick={handleDownload}
      href="#"
      aria-label="Transcript download button"
    >
      <span className="download-label"></span>
    </button>
  );
};

TranscriptDownloader.propTypes = {
  fileUrl: PropTypes.string,
  fileName: PropTypes.string,
  machineGenerated: PropTypes.bool,
  fileExt: PropTypes.string,
};

export default TranscriptDownloader;
