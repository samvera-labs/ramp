import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useManifestState } from '../../context/manifest-context';
import { getMetadata } from '@Services/iiif-parser';
import './MetadataDisplay.scss';
import cx from 'classnames';

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
 * @param {String} props.sectionHeading
 */
const MetadataDisplay = ({
  displayOnlyRangeMetadata = false,
  displayOnlyCanvasMetadata = false,
  displayAllMetadata = false,
  displayTitle = true,
  showHeading = true,
  itemHeading = 'Item Details',
  sectionHeading = 'Section Details'
}) => {
  const { manifest, canvasIndex, currentNavItem } = useManifestState();

  const [manifestMetadata, setManifestMetadata] = useState();
  // Metadata for all Canavases in state
  const [canvasesMetadata, _setCanvasesMetadata] = useState();
  // Current Canvas metadata in state
  const [canvasMetadata, setCanvasMetadata] = useState();
  // Boolean flags set according to user props to hide/show metadata
  const [showManifestMetadata, setShowManifestMetadata] = useState();
  const [showCanvasMetadata, setShowCanvasMetadata] = useState();
  const [showRangeMetadata, setShowRangeMetadata] = useState();

  const [manifestRights, setManifestRights] = useState();
  const [canvasRights, setCanvasRights] = useState();

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
      const showCanvas = (displayOnlyCanvasMetadata || displayAllMetadata) && !displayOnlyRangeMetadata;
      setShowCanvasMetadata(showCanvas);
      const showManifest = (!displayOnlyCanvasMetadata || displayAllMetadata) && !displayOnlyRangeMetadata;
      setShowManifestMetadata(showManifest);

      // Display Range metadata only when specified in the props
      const showRange = displayOnlyRangeMetadata || displayAllMetadata || !displayOnlyCanvasMetadata;
      setShowRangeMetadata(showRange);

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
        {displayAllMetadata && <span>{sectionHeading}</span>}
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

  const rangeMetadataBlock = useMemo(() => {
    if (showRangeMetadata && currentNavItem?.metadata?.length > 0) {
      return (<>
        <span>{currentNavItem.label}</span>
        {buildMetadata(currentNavItem.metadata)}
      </>);
    }
  }, [currentNavItem, showRangeMetadata]);

  const hasMetadata = manifestMetadata?.length > 0
    || canvasMetadata?.length > 0
    || (showRangeMetadata && currentNavItem?.metadata?.length > 0);

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
          <div className={cx(
            'ramp--metadata-display-content',
            showHeading && 'with-heading'
          )}>
            {manifestMetadataBlock}
            {canvasMetadataBlock}
            {rangeMetadataBlock}
          </div>
        )
        : (
          <div
            data-testid='metadata-display-message'
            className={cx(
              'ramp--metadata-display-message',
              showHeading && 'with-heading'
            )}>
            <p>No valid Metadata is in the Manifest/Canvas(es)</p>
          </div>
        )
      }
    </div>
  );
};

MetadataDisplay.propTypes = {
  /** Display only the active Range metadata without Manifest-level metadata. */
  displayOnlyRangeMetadata: PropTypes.bool,
  /** Display only the active Canvas metadata without Manifest-level metadata. */
  displayOnlyCanvasMetadata: PropTypes.bool,
  /** Display metadata for both the active Canvas and the Manifest. */
  displayAllMetadata: PropTypes.bool,
  /** Show/hide the title field from the metadata display if 'title' is included in the current set of
   * metadata. This helps to avoid duplicating the display of title information on the page,
   * when the title is already visible in some other part of the page. */
  displayTitle: PropTypes.bool,
  /** Show/hide the component heading. */
  showHeading: PropTypes.bool,
  /** Heading label for the Manifest-level metadata list. */
  itemHeading: PropTypes.string,
  /** Heading label for the Canvas-level metadata list. */
  sectionHeading: PropTypes.string
};

export default MetadataDisplay;

