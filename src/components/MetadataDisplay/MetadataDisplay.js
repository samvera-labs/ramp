import React from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { getMetadata } from '@Services/iiif-parser';
import './MetadataDisplay.scss';

/** 
 * @param {Boolean} param0 display only Canvas metadata when set to true with other props are default
 * @param {Boolean} param1 display both Manifest and Canvas metadata when set to true
 * @param {Boolean} param2 hide the title in the metadata when set to false, defaults to true 
 * @param {Boolean} param3 hide the heading UI component when set to false, defaults to true
 * @returns 
 */
const MetadataDisplay = ({
  displayOnlyCanvasMetadata = false,
  displayAllMetadata = false,
  displayTitle = true,
  showHeading = true,
  itemHeading = 'Item Details',
  sectionHeaading = 'Section Details',
}) => {
  const { manifest, canvasIndex } = useManifestState();

  const [manifestMetadata, setManifestMetadata] = React.useState();
  // Metadata for all Canavases in state
  const [canvasesMetadata, _setCanvasesMetadata] = React.useState();
  // Current Canvas metadata in state
  const [canvasMetadata, setCanvasMetadata] = React.useState();
  // Boolean flags set according to user props to hide/show metadata
  const [showManifestMetadata, setShowManifestMetadata] = React.useState();
  const [showCanvasMetadata, setShowCanvasMetadata] = React.useState();

  let canvasesMetadataRef = React.useRef();
  const setCanvasesMetadata = (m) => {
    _setCanvasesMetadata(m);
    canvasesMetadataRef.current = m;
  };
  /**
   * On the initialization of the component read metadata from the Manifest
   * and/or Canvases based on the input props and set the initial set(s) of
   * metadata in the component's state
   */
  React.useEffect(() => {
    if (manifest) {
      // Display Canvas metadata only when specified in the props
      const showCanvas = displayOnlyCanvasMetadata || displayAllMetadata;
      setShowCanvasMetadata(showCanvas);
      const showManifest = !displayOnlyCanvasMetadata || displayAllMetadata;
      setShowManifestMetadata(showManifest);

      // Parse metadata from Manifest
      const parsedMetadata = getMetadata(manifest, showCanvas);

      // Set Manifest and Canvas metadata in the state variables according to props
      if (showCanvas) {
        setCanvasesMetadata(parsedMetadata.canvasMetadata);
        setCanvasMetadataInState();
      }
      if (showManifest) {
        let manifestMeta = parsedMetadata.manifestMetadata;
        if (!displayTitle) {
          manifestMeta = manifestMeta.filter(md => md.label.toLowerCase() != 'title');
        }
        setManifestMetadata(manifestMeta);
      }
    }
  }, [manifest]);

  /**
   * When displaying current Canvas's metadata in the component, update the metadata
   * in the component's state listening to the canvasIndex changes in the central
   * state
   */
  React.useEffect(() => {
    if (canvasIndex >= 0 && showCanvasMetadata) {
      setCanvasMetadataInState();
    }
  }, [canvasIndex]);

  /**
   * Set canvas metadata in state
   */
  const setCanvasMetadataInState = () => {
    let canvasData = canvasesMetadataRef.current
      .filter((m) => m.canvasindex === canvasIndex)[0].metadata;
    if (!displayTitle) {
      canvasData = canvasData.filter(md => md.label.toLowerCase() != 'title');
    }
    setCanvasMetadata(canvasData);
  };
  /**
   * Distinguish whether there is any metadata to be displayed
   * @returns {Boolean}
   */
  const hasMetadata = () => {
    return canvasMetadata?.length > 0 || manifestMetadata?.length > 0;
  };

  return (
    <div
      data-testid="metadata-display"
      className="ramp--metadata-display">
      {showHeading && (
        <div className="ramp--metadata-display-title" data-testid="metadata-display-title">
          <h4>Details</h4>
        </div>
      )}
      {hasMetadata() && (
        <div className="ramp--metadata-display-content">
          {showManifestMetadata && manifestMetadata?.length > 0 && (
            <React.Fragment>
              {displayAllMetadata && <p>{itemHeading}</p>}
              {manifestMetadata.map((md, index) => {
                return (
                  <React.Fragment key={index}>
                    <dt>{md.label}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: md.value }}></dd>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          )}
          {showCanvasMetadata && canvasMetadata?.length > 0 && (
            <React.Fragment>
              {displayAllMetadata && <p>{sectionHeaading}</p>}
              {canvasMetadata.map((md, index) => {
                return (
                  <React.Fragment key={index}>
                    <dt>{md.label}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: md.value }}></dd>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          )}
        </div>
      )
      }
      {
        !hasMetadata() && (
          <div
            data-testid="metadata-display-message"
            className="ramp--metadata-display-message">
            <p>No valid Metadata is in the Manifest/Canvas(es)</p>
          </div>
        )
      }
    </div>

  );
};

MetadataDisplay.propTypes = {
  displayOnlyCanvasMetadata: PropTypes.bool,
  displayAllMetadata: PropTypes.bool,
  displayTitle: PropTypes.bool,
  showHeading: PropTypes.bool,
  itemHeading: PropTypes.string,
  sectionHeaading: PropTypes.string,
};

export default MetadataDisplay;

