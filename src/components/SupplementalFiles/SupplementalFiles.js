import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useManifestState } from '../../context/manifest-context';
import { useErrorBoundary } from 'react-error-boundary';
import './SupplementalFiles.scss';

/**
 * Display supplemental files as downloadable links, referenced in both 
 * manifest and at each canvas as rendering files.
 * @param {Object} props
 * @param {String} props.itemHeading
 * @param {String} props.sectionHeaading
 * @param {Boolean} props.showHeading
 */
const SupplementalFiles = ({
  itemHeading = 'Item files',
  sectionHeading = 'Section files',
  showHeading = true
}) => {
  const { renderings } = useManifestState();

  const [manifestSupplementalFiles, setManifestSupplementalFiles] = useState();
  const [canvasSupplementalFiles, setCanvasSupplementalFiles] = useState();
  const [hasSectionFiles, setHasSectionFiles] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    try {
      setManifestSupplementalFiles(renderings?.manifest);

      let canvasFiles = renderings?.canvas;
      let canvasFilesSize = 0;
      if (canvasFiles) {
        setCanvasSupplementalFiles(canvasFiles);

        // Calculate number of total files for all the canvases
        canvasFilesSize = canvasFiles.reduce((acc, f) => acc + f.files.length, 0);
        setHasSectionFiles(canvasFilesSize > 0 ? true : false);
      }

      if (canvasFilesSize > 0 || renderings?.manifest?.length > 0) {
        setHasFiles(true);
      } else {
        setHasFiles(false);
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [renderings]);

  const filesDisplay = useMemo(() => {
    return (
      <>
        {hasFiles && <div className='ramp--supplemental-files-display-content'
          data-testid='supplemental-files-display-content'>
          {Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && (
            <>
              <h4>{itemHeading}</h4>
              <dl key='item-files'>
                {manifestSupplementalFiles.map((file, index) => {
                  return (
                    <Fragment key={index}>
                      <dd key={`item-file-${index}`}>
                        <a href={file.id} key={index}>
                          {file.label}
                        </a>
                      </dd>
                    </Fragment>
                  );
                })}
              </dl>
            </>
          )}
          {Array.isArray(canvasSupplementalFiles) && hasSectionFiles && (
            <>
              <h4>{sectionHeading}</h4>
              {canvasSupplementalFiles.map((canvasFiles, idx) => {
                let files = canvasFiles.files;
                return (
                  files.length > 0 && (<dl key={`section-${idx}-label`}>
                    <dt key={canvasFiles.label}>{canvasFiles.label}</dt>
                    {files.map((file, index) => {
                      return (
                        <dd key={`section-${idx}-file-${index}`}>
                          <a href={file.id} key={index}>
                            {file.label}
                          </a>
                        </dd>
                      );
                    })}
                  </dl>)
                );

              })}
            </>
          )}
        </div>}
        {!hasFiles && <div
          data-testid='supplemental-files-empty'
          className='ramp--supplemental-files-empty'>
          <p>No Supplemental file(s) in Manifest</p>
        </div>}
      </>
    );
  }, [hasFiles, hasSectionFiles]);

  return <div data-testid='supplemental-files' className='ramp--supplemental-files' role='complementary' aria-label='supplemental files'>
    {showHeading && (
      <div className='ramp--supplemental-files-heading' data-testid='supplemental-files-heading'>
        <h4>Files</h4>
      </div>
    )}
    {filesDisplay}
  </div>;
};

export default SupplementalFiles;
