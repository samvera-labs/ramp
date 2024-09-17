import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { timeToS } from '@Services/utility-helpers';
import CreateMarker from './MarkerUtils/CreateMarker';
import MarkerRow from './MarkerUtils/MarkerRow';
import { useErrorBoundary } from "react-error-boundary";
import './MarkersDisplay.scss';

const MarkersDisplay = ({ showHeading = true, headingText = 'Markers' }) => {
  const { allCanvases, canvasIndex, playlist } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const { hasAnnotationService, annotationServiceId, markers } = playlist;

  const [canvasPlaylistsMarkers, setCanvasPlaylistsMarkers] = useState([]);

  const { showBoundary } = useErrorBoundary();

  const canvasIdRef = useRef();

  let canvasPlaylistsMarkersRef = useRef([]);
  const setCanvasMarkers = (list) => {
    setCanvasPlaylistsMarkers(...list);
    canvasPlaylistsMarkersRef.current = list;
  };

  // Retrieves the CRSF authenticity token when component is embedded in a Rails app.
  const csrfToken = document.getElementsByName('csrf-token')[0]?.content;

  useEffect(() => {
    try {
      if (markers?.length > 0) {
        let { canvasMarkers } = markers.filter((m) => m.canvasIndex === canvasIndex)[0];
        setCanvasMarkers(canvasMarkers);

        if (allCanvases != undefined && allCanvases?.length > 0) {
          canvasIdRef.current = allCanvases[canvasIndex].canvasId;
        }
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [canvasIndex, markers]);

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

  return useMemo(() => {
    return (<div className="ramp--markers-display"
      data-testid="markers-display">
      {showHeading && (
        <div
          className="ramp--markers-display__title"
          data-testid="markers-display-title"
        >
          <h4>{headingText}</h4>
        </div>
      )}
      {hasAnnotationService && (
        <CreateMarker
          newMarkerEndpoint={annotationServiceId}
          canvasId={canvasIdRef.current}
          handleCreate={handleCreate}
          csrfToken={csrfToken}
        />
      )}
      {canvasPlaylistsMarkersRef.current.length > 0 && (
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
                hasAnnotationService={hasAnnotationService}
                toggleIsEditing={toggleIsEditing}
                csrfToken={csrfToken} />
            ))}
          </tbody>
        </table>
      )}
    </div>
    );
  }, [canvasPlaylistsMarkersRef.current, csrfToken]);
};

MarkersDisplay.propTypes = {
  showHeading: PropTypes.bool,
  headingText: PropTypes.string,
};

export default MarkersDisplay;
