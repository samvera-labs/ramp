import React from 'react';

const TranscriptDownloader = ({ fileUrl, fileName }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fetch(fileUrl)
      .then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="irmp--transcript_downloader"
      data-testid="transcript-downloader"
    >
      <button
        onClick={handleDownload}
        href="#"
        data-testid="transcript-downloadbtn"
      >
        <span className="download-label"></span>
      </button>
    </div>
  );
};

export default TranscriptDownloader;
