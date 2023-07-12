import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { getRenderingFiles } from '@Services/iiif-parser';
import { fileDownload } from '@Services/utility-helpers';
import './SupplementalFiles.scss';

const SupplementalFiles = ({ itemHeading = "Item files", sectionHeading = "Section files", showHeading = true }) => {
  const { manifest } = useManifestState();

  const [manifestSupplementalFiles, setManifestSupplementalFiles] = React.useState();
  const [canvasSupplementalFiles, setCanvasSupplementalFiles] = React.useState();

  React.useEffect(() => {
    if (manifest) {
      let renderings = getRenderingFiles(manifest);
      setManifestSupplementalFiles(renderings.manifest);
      setCanvasSupplementalFiles(renderings.canvas);
    }
  }, [manifest]);


  const handleDownload = (event, file) => {
    event.preventDefault();
    fileDownload(file.id, file.filename);
  };

  return (
    <div data-testid="supplemental-files" className="ramp--supplemental-files">
      {showHeading && (
	<div className="ramp--supplemental-files-heading" data-testid="supplemental-files-heading">
	  <h4>Files</h4>
	</div>
      )}
      {manifestSupplementalFiles && ( <h4>{itemHeading}</h4> )}
      {manifestSupplementalFiles && manifestSupplementalFiles.map((file, index) => {
	  return (
	    <React.Fragment key={index}>
	      <dd><a href={file.id} key={index} onClick={e => handleDownload(e, file)}>{file.label}</a></dd>
	    </React.Fragment>
	  );
	}
      )}
      {canvasSupplementalFiles && ( <h4>{sectionHeading}</h4> )}
      {canvasSupplementalFiles && canvasSupplementalFiles.flatMap((canvasFiles, idx) => {
          let files = canvasFiles.files;
          if (files == []) return []; // Skip rendering if canvas doesn't have any supplemental files
	  return (
	    <React.Fragment key={idx}>
              <dt>{canvasFiles.label}</dt>
              {files.map((file, index) => {
                return (
                  <React.Fragment>
                    <dd><a href={file.id} key={index} onClick={e => handleDownload(e, file)}>{file.label}</a></dd>
                  </React.Fragment>
                );
              })}
	    </React.Fragment>
	  );
	}
      )}
    </div>
  );
};

export default SupplementalFiles;
