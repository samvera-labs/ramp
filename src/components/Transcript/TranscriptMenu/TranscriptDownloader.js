import React from 'react';

const TranscriptDownloader = ({ fileUrl, fileName }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    fetch(fileUrl)
      .then((response) => {
        // console.log(response);
        response.blob().then((blob) => {
          console.log(blob);
          let url = window.URL.createObjectURL(blob);
          console.log(url);
          let a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // fetch(fileUrl, { responseType: 'blob' })
    //   .then((response) => {
    //     const json = JSON.stringify(response.data);
    //     const blob = new Blob([response.data], {
    //       type: 'application/json',
    //     });
    //     const link = document.createElement('a');
    //     link.href = URL.createObjectURL(blob);
    //     link.download = fileName;
    //     link.click();
    //     URL.revokeObjectURL(link.href);
    //   })
    //   .catch((error) => console.error(error));
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
