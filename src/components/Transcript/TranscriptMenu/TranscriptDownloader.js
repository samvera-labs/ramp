import React from 'react';

const TranscriptDownloader = ({ fileUrl, fileName }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  // React.useEffect(() => {
  //   window.addEventListener('click', setIsVisible(!isVisible));

  //   return () => {
  //     window.removeEventListener('click', () => {});
  //   };
  // }, []);

  const handleDownload = () => {
    setIsVisible(!isVisible);
  };

  const downloadFile = (e) => {
    e.preventDefault();
    fetch(fileUrl).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      });
    });
    setIsVisible(!isVisible);
  };

  return (
    <React.Fragment>
      <div
        className="irmp--transcript_downloader"
        data-testid="transcript-downloader"
      >
        <div className="transcript_downloadbtn" title="Download">
          <a onClick={handleDownload}>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </a>
        </div>
      </div>
      {isVisible && (
        <a
          className="transcript_download-confirm"
          onClick={downloadFile}
          href="#"
        >
          <span>Download this file</span>
        </a>
      )}
    </React.Fragment>
  );
};

export default TranscriptDownloader;
