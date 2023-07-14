import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { getRenderingFiles, getSupplementingFiles } from '@Services/iiif-parser';
import { fileDownload } from '@Services/utility-helpers';
import './SupplementalFiles.scss';

const SupplementalFiles = ({ itemHeading = "Item files", sectionHeading = "Section files", showHeading = true }) => {
  const { manifest } = useManifestState();

  const [manifestSupplementalFiles, setManifestSupplementalFiles] = React.useState();
  const [canvasSupplementalFiles, setCanvasSupplementalFiles] = React.useState();

  React.useEffect(() => {
    if (manifest) {
      let renderings = getRenderingFiles(manifest);

      let manifestFiles = renderings.manifest;
      setManifestSupplementalFiles(manifestFiles);

      let annotations = getSupplementingFiles(manifest);
      let canvasFiles = renderings.canvas;
      canvasFiles.map((canvas, index) => canvas.files = canvas.files.concat(annotations[index].files));
      canvasFiles = canvasFiles.filter(canvasFiles => canvasFiles.files.length > 0 );
      setCanvasSupplementalFiles(canvasFiles);
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
      <div className="ramp--supplemental-files-display-content" data-testid="supplemental-files-display-content">
	{Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && ( <h4>{itemHeading}</h4> )}
	{Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && (
          <dl>
	    {manifestSupplementalFiles.map((file, index) => {
	      return (
		<React.Fragment key={index}>
		    <dd><a href={file.id} key={index} onClick={e => handleDownload(e, file)}>{file.label}</a></dd>
		</React.Fragment>
	      );
	    })}
          </dl>
	)}
	{Array.isArray(canvasSupplementalFiles) && canvasSupplementalFiles.length > 0 && ( <h4>{sectionHeading}</h4> )}
	{Array.isArray(canvasSupplementalFiles) && canvasSupplementalFiles.length > 0 && canvasSupplementalFiles.map((canvasFiles, idx) => {
	    let files = canvasFiles.files;
	    return (
	      <React.Fragment key={idx}>
                <dl>
		  <dt>{canvasFiles.label}</dt>
		  {files.map((file, index) => {
		    return (
		      <React.Fragment>
			<dd><a href={file.id} key={index} onClick={e => handleDownload(e, file)}>{file.label}</a></dd>
		      </React.Fragment>
		    );
		  })}
                </dl>
	      </React.Fragment>
	    );
	  }
	)}
      </div>
    </div>
  );
};

export default SupplementalFiles;
