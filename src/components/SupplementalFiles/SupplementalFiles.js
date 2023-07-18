import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { getRenderingFiles, getSupplementingFiles } from '@Services/iiif-parser';
import { fileDownload } from '@Services/utility-helpers';
import './SupplementalFiles.scss';

const SupplementalFiles = ({ itemHeading = "Item files", sectionHeading = "Section files", showHeading = true }) => {
  const { manifest } = useManifestState();

  const [manifestSupplementalFiles, setManifestSupplementalFiles] = React.useState();
  const [canvasSupplementalFiles, setCanvasSupplementalFiles] = React.useState();
  const [hasFiles, setHasFiles] = React.useState(false);

  React.useEffect(() => {
    if (manifest) {
      let renderings = getRenderingFiles(manifest);

      let manifestFiles = renderings.manifest;
      setManifestSupplementalFiles(manifestFiles);

      let annotations = getSupplementingFiles(manifest);
      let canvasFiles = renderings.canvas;
      canvasFiles.map((canvas, index) => canvas.files = canvas.files.concat(annotations[index].files));
      canvasFiles = canvasFiles.filter(canvasFiles => canvasFiles.files.length > 0);
      setCanvasSupplementalFiles(canvasFiles);

      if (canvasFiles?.length > 0 && manifestFiles?.length > 0) {
        setHasFiles(true);
      }
    }
  }, [manifest]);


  const handleDownload = (event, file) => {
    event.preventDefault();
    fileDownload(file.id, file.filename, file.fileExt);
  };

  return (
    <div data-testid="supplemental-files" className="ramp--supplemental-files">
      {showHeading && (
        <div className="ramp--supplemental-files-heading" data-testid="supplemental-files-heading">
          <h4>Files</h4>
        </div>
      )}
      {hasFiles && <div className="ramp--supplemental-files-display-content" data-testid="supplemental-files-display-content">
        {Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && (
          <React.Fragment>
            <h4>{itemHeading}</h4>
            <dl key="item-files">
              {manifestSupplementalFiles.map((file, index) => {
                return (
                  <React.Fragment key={index}>
                    <dd key={`item-file-${index}`}>
                      <a href={file.id} key={index} onClick={e => handleDownload(e, file)}>
                        {file.label}
                      </a>
                    </dd>
                  </React.Fragment>
                );
              })}
            </dl>
          </React.Fragment>
        )}
        {Array.isArray(canvasSupplementalFiles) && canvasSupplementalFiles.length > 0 && (
          <React.Fragment>
            <h4>{sectionHeading}</h4>
            {canvasSupplementalFiles.map((canvasFiles, idx) => {
              let files = canvasFiles.files;
              return (
                <dl key={`section-${idx}-label`}>
                  <dt key={canvasFiles.label}>{canvasFiles.label}</dt>
                  {files.map((file, index) => {
                    return (
                      <dd key={`section-${idx}-file-${index}`}>
                        <a href={file.id} key={index} onClick={e => handleDownload(e, file)}>
                          {file.label}
                        </a>
                      </dd>
                    );
                  })}
                </dl>
              );
            })}
          </React.Fragment>
        )}
      </div>}
      {!hasFiles && <div
        data-testid="supplemental-files-empty"
        className="ramp--supplemental-files-empty">
        <p>No Supplemental Files in Manifest</p>
      </div>}
    </div>
  );
};

export default SupplementalFiles;
