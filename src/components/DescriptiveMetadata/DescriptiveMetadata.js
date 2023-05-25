import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { parseMetadata } from '@Services/iiif-parser';
import './DescriptiveMetadata.scss';

const DescriptiveMetadata = ({ displayTitle = true }) => {
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
        data-testid="descriptive-metadata"
        className="ramp--descriptive-metadata">
        <div className="metadata-title">
          <h4>Details</h4>
        </div>
        <div className="metadata-content">
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

DescriptiveMetadata.propTypes = {
  displayTitle: PropTypes.bool
};

export default DescriptiveMetadata;

