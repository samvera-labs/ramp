import React from 'react';

// Handled file types for downloads
const validFileExtensions = ['doc', 'docx', 'json', 'js', 'srt', 'txt', 'vtt'];

const TranscriptDownloader = ({ fileUrl, fileName }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    const extension = fileUrl.split('.').reverse()[0];
    // If unhandled file type use .doc
    const fileExtension = validFileExtensions.includes(extension)
      ? extension
      : 'doc';
    fetch(fileUrl)
      .then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          console.log(url);
          let a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.${fileExtension}`;
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
