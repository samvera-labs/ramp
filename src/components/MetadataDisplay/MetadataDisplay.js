import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { getMetadata } from '@Services/iiif-parser';
import './MetadataDisplay.scss';

/** 
 * @param {Boolean} param0 read canvas-level metadata when set to true, defaults to false
 * @param {Boolean} param1 hide the title in the metadata when set to false, defaults to true 
 * @param {Boolean} param2 hide the heading UI component when set to false, defaults to true
 * @returns 
 */
const MetadataDisplay = ({ readCanvasMetadata = false, displayTitle = true, showHeading = true }) => {
  const { manifest, canvasIndex } = useManifestState();

  const [metadata, setMetadata] = React.useState();
  const [canvasMetadata, setCanvasMetadata] = React.useState();

  /**
   * On the initialization of the component read metadata from the Manifest
   * or Canvases based on the input props and set the initial set of metadata
   * in the component's state
   */
  React.useEffect(() => {
    if (manifest) {
      let initMetadata = [];
      const parsedMetadata = getMetadata(manifest, readCanvasMetadata);
      if (readCanvasMetadata) {
        setCanvasMetadata(parsedMetadata.canvasMetadata);
        initMetadata = parsedMetadata
          .canvasMetadata
          .filter((m) => m.canvasindex === canvasIndex)[0].metadata;
      } else {
        initMetadata = parsedMetadata.manifestMetadata;
      }
      if (!displayTitle) {
        initMetadata = initMetadata.filter(md => md.label.toLowerCase() != 'title');
      }
      setMetadata(initMetadata);
    }
  }, [manifest]);

  /**
   * When displaying Canvas-level metadata in the component, update the metadata
   * in the component's state listening to the canvasIndex changes in the central
   * state
   */
  React.useEffect(() => {
    if (canvasIndex >= 0 && readCanvasMetadata && canvasMetadata != undefined) {
      let currentMetadata = canvasMetadata
        .filter((m) => m.canvasindex === canvasIndex)[0].metadata;
      if (!displayTitle) {
        currentMetadata = currentMetadata.filter(md => md.label.toLowerCase() != 'title');
      }
      setMetadata(currentMetadata);
    }
  }, [canvasIndex]);

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
    return (<div
      data-testid="metadata-display"
      className="ramp--metadata-display">
      <p>No valid Metadata is in the Manifest/Canvas(es)</p>
    </div>);
  }
};

MetadataDisplay.propTypes = {
  readCanvasMetadata: PropTypes.bool,
  displayTitle: PropTypes.bool,
  showHeading: PropTypes.bool,
};

export default MetadataDisplay;

