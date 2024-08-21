import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { fileDownload } from '@Services/utility-helpers';
import { useErrorBoundary } from "react-error-boundary";
import './SupplementalFiles.scss';

const SupplementalFiles = ({
  itemHeading = "Item files",
  sectionHeading = "Section files",
  showHeading = true
}) => {
  const { renderings } = useManifestState();

  const [manifestSupplementalFiles, setManifestSupplementalFiles] = React.useState();
  const [canvasSupplementalFiles, setCanvasSupplementalFiles] = React.useState();
  const [hasSectionFiles, setHasSectionFiles] = React.useState(false);

  const { showBoundary } = useErrorBoundary();

  React.useEffect(() => {
    if (renderings) {
      try {
        setManifestSupplementalFiles(renderings.manifest);

        let canvasFiles = renderings.canvas;
        setCanvasSupplementalFiles(canvasFiles);

        // Calculate number of total files for all the canvases
        const canvasFilesSize = canvasFiles.reduce((acc, f) => acc + f.files.length, 0);
        setHasSectionFiles(canvasFilesSize > 0 ? true : false);
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [renderings]);

  const hasFiles = () => {
    if (hasSectionFiles || manifestSupplementalFiles?.length > 0) {
      return true;
    }
    return false;
  };

  const handleDownload = (event, file) => {
    event.preventDefault();
    fileDownload(file.id, file.filename, file.fileExt, file.isMachineGen);
  };

  return (
    <div data-testid="supplemental-files" className="ramp--supplemental-files">
      {showHeading && (
        <div className="ramp--supplemental-files-heading" data-testid="supplemental-files-heading">
          <h4>Files</h4>
        </div>
      )}
      {hasFiles() && <div className="ramp--supplemental-files-display-content" data-testid="supplemental-files-display-content">
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
        {Array.isArray(canvasSupplementalFiles) && hasSectionFiles && (
          <React.Fragment>
            <h4>{sectionHeading}</h4>
            {canvasSupplementalFiles.map((canvasFiles, idx) => {
              let files = canvasFiles.files;
              return (
                files.length > 0 && (<dl key={`section-${idx}-label`}>
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
                </dl>)
              );

            })}
          </React.Fragment>
        )}
      </div>}
      {!hasFiles() && <div
        data-testid="supplemental-files-empty"
        className="ramp--supplemental-files-empty">
        <p>No Supplemental file(s) in Manifest</p>
      </div>}
    </div>
  );
};

export default SupplementalFiles;
