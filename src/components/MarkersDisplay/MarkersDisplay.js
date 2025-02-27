import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { timeToHHmmss, timeToS } from '@Services/utility-helpers';
import CreateMarker from './MarkerUtils/CreateMarker';
import MarkerRow from './MarkerUtils/MarkerRow';
import { useErrorBoundary } from "react-error-boundary";
import './MarkersDisplay.scss';
import AnnotationsDisplay from './Annotations/AnnotationsDisplay';

/**
 * Display annotations from 'annotations' list associated with the current Canvas
 * @param {Object} props
 * @param {Boolean} props.showHeading
 * @param {String} props.headingText
 * @param {Array<String>} props.displayMotivations
 */
const MarkersDisplay = ({
  displayMotivations = [],
  headingText = 'Markers',
  showHeading = true,
  showMoreSettings,
}) => {
  // Default showMoreSettings
  const defaultShowMoreSettings = { enableShowMore: false, textLineLimit: 6 };

  // Fill in missing properties, e.g. if prop only set to { enableShowMore: true }
  showMoreSettings = { ...defaultShowMoreSettings, ...showMoreSettings, };

  const { allCanvases, canvasDuration, canvasIndex, playlist, annotations } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const { annotationServiceId, hasAnnotationService, isPlaylist } = playlist;
  const [_, setCanvasPlaylistsMarkers] = useState([]);
  const { showBoundary } = useErrorBoundary();
  const canvasIdRef = useRef();

  // Using a ref updates markers table immediately after marker edit/creation
  let canvasPlaylistsMarkersRef = useRef([]);
  const setCanvasMarkers = (list) => {
    setCanvasPlaylistsMarkers(...list);
    canvasPlaylistsMarkersRef.current = list;
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
      if (isPlaylist && annotations?.length > 0) {
        // Check if annotations are available for the current Canvas
        const { _, annotationSets } = annotations.filter((a) => a.canvasIndex === canvasIndex)[0];

        let playlistMarkers = [];
        // Filter all markers related to the current Canvas
        if (annotationSets?.length > 0) {
          playlistMarkers = annotationSets.map((a) => a.markers)
            .filter(m => m != undefined).flat();
        }
        // Convert annotations to markers for display and stor in state
        if (playlistMarkers?.length > 0) {
          const canvasMarkers = playlistMarkers.map((a) => convertAnnotationToMarker(a));
          manifestDispatch({ markers: { canvasIndex, canvasMarkers }, type: 'setPlaylistMarkers' });
          setCanvasMarkers(canvasMarkers ?? []);
        } else {
          manifestDispatch({ markers: { canvasIndex, canvasMarkers: [] }, type: 'setPlaylistMarkers' });
          setCanvasMarkers([]);
        }
      }

      if (allCanvases != undefined && allCanvases?.length > 0) {
        canvasIdRef.current = allCanvases[canvasIndex].canvasId;
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [isPlaylist, canvasIndex, annotations]);

  const convertAnnotationToMarker = (annotation) => {
    const { canvasId, id, time, value } = annotation;
    return {
      id: id,
      time: time.start || 0,
      timeStr: time.start ? timeToHHmmss(time.start, true, true) : '00:00:00',
      canvasId: canvasId,
      value: value?.length > 0 ? value[0].value : '',
    };
  };

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

  const handleDelete = useCallback((id) => {
    let remainingMarkers = canvasPlaylistsMarkersRef.current.filter(m => m.id != id);
    // Update markers in state for displaying in the player UI
    setCanvasMarkers(remainingMarkers);
    manifestDispatch({ updatedMarkers: remainingMarkers, type: 'setPlaylistMarkers' });
  });

  const handleCreate = useCallback((newMarker) => {
    setCanvasMarkers([...canvasPlaylistsMarkersRef.current, newMarker]);
    manifestDispatch({
      updatedMarkers: canvasPlaylistsMarkersRef.current,
      type: 'setPlaylistMarkers'
    });
  });

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
        <table className="ramp--markers-display_table" data-testid="markers-display-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
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
  }, [canvasPlaylistsMarkersRef.current]);

  return (
    <div className="ramp--markers-display"
      data-testid="markers-display">
      {showHeading && (
        <div
          className="ramp--markers-display__title"
          data-testid="markers-display-title"
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
      {(annotations && !isPlaylist) && (
        <AnnotationsDisplay
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

MarkersDisplay.propTypes = {
  displayMotivations: PropTypes.array,
  headingText: PropTypes.string,
  showHeading: PropTypes.bool,
  showMoreSettings: PropTypes.object,
};

export default MarkersDisplay;
