import React from 'react';
import PropTypes from 'prop-types';
import { fileDownload } from '@Services/utility-helpers';
import { FileDownloadIcon } from '@Services/svg-icons';

/**
 * Build the file download button for the displayed transcript file
 * in the transcript viewer.
 * @param {Object} props
 * @param {String} fileUrl downloadable link to the file in server
 * @param {String} fileName 
 * @param {Boolean} machineGenerated set to true for machine generated files
 * @param {String} fileExt extension of the file
 */
const TranscriptDownloader = ({ fileUrl, fileName, machineGenerated, fileExt }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fileDownload(fileUrl, fileName, fileExt, machineGenerated);
  };

  return (
    <button
      className="ramp--transcript_menu_button ramp--transcript_downloader"
      data-testid="transcript-downloader"
      onClick={handleDownload}
      href="#"
      aria-label="Transcript download button"
    >
      <FileDownloadIcon />
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
