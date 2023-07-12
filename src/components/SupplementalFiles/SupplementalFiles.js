import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { getRenderingFiles } from '@Services/iiif-parser';
import { fileDownload } from '@Services/utility-helpers';
import './SupplementalFiles.scss';

const SupplementalFiles = ({ itemHeading = "Item files", sectionHeading = "Section files" }) => {
  const { manifest, canvasIndex } = useManifestState();

  const [supplementalFiles, setSupplementalFiles] = React.useState();

  React.useEffect(() => {
    if (manifest) {
      let files = getRenderingFiles(manifest, canvasIndex);
      setSupplementalFiles(files);
    }
  }, [manifest, canvasIndex]);


  const handleDownload = (event, file) => {
    event.preventDefault();
    fileDownload(file.id, file.filename);
  };

  return (
    <div data-testid="supplemental-files" className="ramp--supplemental-files">
      <h4>{itemHeading}</h4>
      {supplementalFiles && supplementalFiles.map((file, index) => {
        return (
          <React.Fragment key={index}>
            <dd><a href={file.id} key={index} onClick={e => handleDownload(e, file)}>{file.label}</a></dd>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SupplementalFiles;
