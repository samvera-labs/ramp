import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { timeToS } from '@Services/utility-helpers';
import CreateMarker from './MarkerAnnotations/CreateMarker';
import MarkerRow from './MarkerAnnotations/MarkerRow';
import { useErrorBoundary } from 'react-error-boundary';
import './Annotations.scss';
import AnnotationList from './OtherAnnotations/AnnotationList';
import { useAnnotations } from '@Services/ramp-hooks';

/**
 * Display annotations from 'annotations' list associated with the current Canvas
 * @param {Object} props
 * @param {Boolean} props.showHeading
 * @param {String} props.headingText
 * @param {Array<String>} props.displayMotivations
 */
const Annotations = ({
  displayMotivations = [],
  headingText = 'Annotations',
  showHeading = true,
  showMoreSettings,
}) => {
  // Default showMoreSettings
  const defaultShowMoreSettings = { enableShowMore: false, textLineLimit: 6 };

  // Fill in missing properties, e.g. if prop only set to { enableShowMore: true }
  showMoreSettings = { ...defaultShowMoreSettings, ...showMoreSettings, };

  const { allCanvases, annotations, canvasDuration, canvasIndex, playlist } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  // Parse and store annotations and markers in global state on Manifest load and Canvas changes 
  useAnnotations();

  const { annotationServiceId, hasAnnotationService, isPlaylist, markers } = playlist;
  const [canvasPlaylistsMarkers, setCanvasPlaylistsMarkers] = useState([]);
  const { showBoundary } = useErrorBoundary();
  const canvasIdRef = useRef();

  // Using a ref updates markers table immediately after marker edit/creation
  let canvasPlaylistsMarkersRef = useRef([]);
  const setCanvasMarkers = (list) => {
    // Sort markers chronologically for the display
    list.sort((a, b) => a.time - b.time);
    canvasPlaylistsMarkersRef.current = list;
    // Trigger re-render with sorted list
    setCanvasPlaylistsMarkers([...list]);
  };

  // Retrieves the CRSF authenticity token when component is embedded in a Rails app.
  const csrfToken = document.getElementsByName('csrf-token')[0]?.content;

  /**
   * For playlist manifests, this component is used to display annotations
   * with 'highlighting' motivations. These are single time-point annotations used
   * as markers in playlists.
   */
  useEffect(() => {
    try {
      if (isPlaylist && markers?.length > 0) {
        // Check if markers are available for the current Canvas and update state
        const canvasMarkers = markers.filter((a) => a.canvasIndex === canvasIndex);
        if (canvasMarkers?.length > 0) {
          setCanvasMarkers(canvasMarkers[0].canvasMarkers);
        } else {
          setCanvasMarkers([]);
        }
      }

      if (allCanvases != undefined && allCanvases?.length > 0) {
        canvasIdRef.current = allCanvases[canvasIndex].canvasId;
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [isPlaylist, canvasIndex, markers]);

  /**
   * Handle highlighting annotation creation and editing submission in
   * playlist manifests.
   * @param {String} label label of the marker
   * @param {String} time time of the marker in HH:MM:SS format
   * @param {String} id unique identifier of the marker
   */
  const handleSubmit = useCallback((label, time, id) => {
    // Re-construct markers list for displaying in the player UI
    let editedMarkers = canvasPlaylistsMarkersRef.current.map(m => {
      if (m.id === id) {
        m.value = label;
        m.timeStr = time;
        m.time = timeToS(time);
      }
      return m;
    });
    setCanvasMarkers(editedMarkers);
    manifestDispatch({ updatedMarkers: editedMarkers, type: 'setPlaylistMarkers' });
  });

  /**
   * Handle deletion of a highlighting annotation marker in playlist manifests.
   * @param {String} id unique identifier of the marker to delete
   */
  const handleDelete = useCallback((id) => {
    let remainingMarkers = canvasPlaylistsMarkersRef.current.filter(m => m.id != id);
    // Update markers in state for displaying in the player UI
    setCanvasMarkers(remainingMarkers);
    manifestDispatch({ updatedMarkers: remainingMarkers, type: 'setPlaylistMarkers' });
  });

  /**
   * Handle creation of a new highlighting annotation marker in playlist manifests.
   * @param {Object} newMarker new marker object to add to the markers list
   * @param {String} newMarker.id unique identifier of the new marker
   * @param {Number} newMarker.time time of the new marker in seconds
   * @param {String} newMarker.timeStr time of the new marker in HH:MM:SS format
   * @param {Number} newMarker.canvasId index of the Canvas where the marker is created
   * @param {String} newMarker.value label of the new marker
   */
  const handleCreate = useCallback((newMarker) => {
    setCanvasMarkers([...canvasPlaylistsMarkersRef.current, newMarker]);
    manifestDispatch({
      updatedMarkers: canvasPlaylistsMarkersRef.current,
      type: 'setPlaylistMarkers'
    });
  });

  /**
   * Toggle editing state for the markers table in playlist manifests.
   * @param {Boolean} flag true to enable editing, false to disable
   */
  const toggleIsEditing = useCallback((flag) => {
    manifestDispatch({ isEditing: flag, type: 'setIsEditing' });
  });

  const createMarker = useMemo(() => {
    if (hasAnnotationService) {
      return (
        <CreateMarker
          newMarkerEndpoint={annotationServiceId}
          canvasId={canvasIdRef.current}
          handleCreate={handleCreate}
          csrfToken={csrfToken}
        />
      );
    }
  }, [hasAnnotationService, canvasIdRef.current, csrfToken]);

  const markersTable = useMemo(() => {
    if (canvasPlaylistsMarkersRef.current.length > 0) {
      return (
        <table className='ramp--markers-display_table' data-testid='markers-display-table'>
          <thead>
            <tr>
              <th><label htmlFor='marker-edit-label'>Name</label></th>
              <th><label htmlFor='marker-edit-time'>Time</label></th>
              {hasAnnotationService && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {canvasPlaylistsMarkersRef.current.map((marker, index) => (
              <MarkerRow
                key={index}
                marker={marker}
                handleSubmit={handleSubmit}
                handleDelete={handleDelete}
                toggleIsEditing={toggleIsEditing}
                csrfToken={csrfToken} />
            ))}
          </tbody>
        </table>
      );
    }
  }, [canvasPlaylistsMarkers]);

  return (
    <div className='ramp--annotations-display'
      data-testid='annotations-display'
      role='complementary'
      aria-label='annotations display'
    >
      {showHeading && (
        <div
          className='ramp--annotations__title'
          data-testid='annotations-display-title'
        >
          <h4>{headingText}</h4>
        </div>
      )}
      {isPlaylist && (
        <>
          {createMarker}
          {markersTable}
        </>
      )}
      {(annotations?.length > 0 && !isPlaylist) && (
        <AnnotationList
          annotations={annotations}
          canvasIndex={canvasIndex}
          displayMotivations={displayMotivations}
          duration={canvasDuration}
          showMoreSettings={showMoreSettings}
        />
      )}
    </div>
  );
};

Annotations.propTypes = {
  displayMotivations: PropTypes.array,
  headingText: PropTypes.string,
  showHeading: PropTypes.bool,
  showMoreSettings: PropTypes.object,
};

export default Annotations;
