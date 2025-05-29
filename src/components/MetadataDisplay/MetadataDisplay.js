import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { getMetadata } from '@Services/iiif-parser';
import './MetadataDisplay.scss';

/** 
 * Parse and display metadata, rights, and requiredStatement information
 * related to the current resource. The display of the scope of this information
 * can be customized using props as needed.
 * @param {Object} props
 * @param {Boolean} props.displayOnlyCanvasMetadata
 * @param {Boolean} props.displayAllMetadata
 * @param {Boolean} props.displayTitle
 * @param {Boolean} props.showHeading
 * @param {String} props.itemHeading
 * @param {String} props.sectionHeaading
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

  const [manifestMetadata, setManifestMetadata] = useState();
  // Metadata for all Canavases in state
  const [canvasesMetadata, _setCanvasesMetadata] = useState();
  // Current Canvas metadata in state
  const [canvasMetadata, setCanvasMetadata] = useState();
  // Boolean flags set according to user props to hide/show metadata
  const [showManifestMetadata, setShowManifestMetadata] = useState();
  const [showCanvasMetadata, setShowCanvasMetadata] = useState();

  const [manifestRights, setManifestRights] = useState();
  const [canvasRights, setCanvasRights] = useState();
  const [hasMetadata, setHasMetadata] = useState(false);

  let canvasesMetadataRef = useRef();
  const setCanvasesMetadata = (m) => {
    _setCanvasesMetadata(m);
    canvasesMetadataRef.current = m;
  };
  /**
   * On the initialization of the component read metadata from the Manifest
   * and/or Canvases based on the input props and set the initial set(s) of
   * metadata in the component's state
   */
  useEffect(() => {
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
        setHasMetadata(manifestMeta?.length > 0);
      }
      if (parsedMetadata.rights?.length > 0) {
        setManifestRights(parsedMetadata.rights);
      }
    }
  }, [manifest]);

  /**
   * When displaying current Canvas's metadata in the component, update the metadata
   * in the component's state listening to the canvasIndex changes in the central
   * state
   */
  useEffect(() => {
    if (canvasIndex >= 0 && showCanvasMetadata) {
      setCanvasMetadataInState();
    }
  }, [canvasIndex]);

  /**
   * Set canvas metadata in state
   */
  const setCanvasMetadataInState = () => {
    const canvasData = canvasesMetadataRef.current
      .filter((m) => m.canvasindex === canvasIndex)[0];
    if (canvasData != undefined) {
      let { metadata, rights } = canvasData;
      if (!displayTitle && metadata != undefined) {
        metadata = metadata.filter(md => md.label.toLowerCase() != 'title');
      }
      setCanvasMetadata(metadata);
      setHasMetadata(metadata?.length > 0);
      if (rights != undefined && rights?.length > 0) {
        setCanvasRights(rights);
      }
    }
  };

  const buildMetadata = (metadata) => {
    let metadataPairs = [];
    if (metadata?.length > 0) {
      metadata.map((md, index) => {
        metadataPairs.push(
          <Fragment key={index}>
            <dt>{md.label}</dt>
            <dd dangerouslySetInnerHTML={{ __html: md.value }}></dd>
          </Fragment>
        );
      });
    }
    return <dl>{metadataPairs}</dl>;
  };

  const manifestMetadataBlock = useMemo(() => {
    if (showManifestMetadata && manifestMetadata?.length > 0) {
      return (<>
        {displayAllMetadata && <span>{itemHeading}</span>}
        {buildMetadata(manifestMetadata)}
        {manifestRights?.length > 0 && (
          <span
            className='ramp--metadata-rights-heading'
            data-testid='manifest-rights'>
            Rights
          </span>
        )}
        {buildMetadata(manifestRights)}
      </>
      );
    }
  }, [manifestMetadata]);

  const canvasMetadataBlock = useMemo(() => {
    if (showCanvasMetadata && canvasMetadata?.length > 0) {
      return (<>
        {displayAllMetadata && <span>{sectionHeaading}</span>}
        {buildMetadata(canvasMetadata)}
        {canvasRights?.length > 0 && (
          <span
            className='ramp--metadata-rights-heading'
            data-testid='canvas-rights'>
            Rights
          </span>
        )}
        {buildMetadata(canvasRights)}
      </>);
    }
  }, [canvasMetadata]);

  return (
    <div
      data-testid='metadata-display'
      className='ramp--metadata-display'
      role='complementary'
      aria-label='metadata display'
    >
      {showHeading && (
        <div className='ramp--metadata-display-title' data-testid='metadata-display-title'>
          <h4>Details</h4>
        </div>
      )}
      {hasMetadata
        ? (
          <div className='ramp--metadata-display-content'>
            {manifestMetadataBlock}
            {canvasMetadataBlock}
          </div>
        )
        : (
          <div
            data-testid='metadata-display-message'
            className='ramp--metadata-display-message'>
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

