import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { parseMetadata } from '@Services/iiif-parser';
import './MetadataDisplay.scss';

const MetadataDisplay = ({ displayTitle = true, showHeading = true }) => {
  const { manifest } = useManifestState();

  const [metadata, setMetadata] = React.useState();

  React.useEffect(() => {
    if (manifest) {
      let parsedMetadata = parseMetadata(manifest);
      if (!displayTitle) {
        parsedMetadata = parsedMetadata.filter(md => md.label.toLowerCase() != 'title');
      }
      setMetadata(parsedMetadata);
    }
  }, [manifest]);

  if (metadata && metadata.length > 0) {
    return (
      <div
        data-testid="metadata-display"
        className="ramp--metadata-display">
        {showHeading && (
          <div className="ramp--metadata-display-title" data-testid="metadata-display-title">
            <h4>Details</h4>
          </div>
        )}
        <div className="ramp--metadata-display-content">
          {metadata.map((md, i) => {
            return (
              <React.Fragment key={i}>
                <dt>{md.label}</dt>
                <dd dangerouslySetInnerHTML={{ __html: md.value }}></dd>
              </React.Fragment>
            );
          })
          }
        </div>
      </div>
    );
  } else {
    return null;
  }
};

MetadataDisplay.propTypes = {
  displayTitle: PropTypes.bool,
  showHeading: PropTypes.bool,
};

export default MetadataDisplay;

