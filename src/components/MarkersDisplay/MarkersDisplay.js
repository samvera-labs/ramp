import React from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { parsePlaylistAnnotations } from '@Services/playlist-parser';
import { canvasesInManifest } from '@Services/iiif-parser';
import { timeToS } from '@Services/utility-helpers';
import CreateMarker from './MarkerUtils/CreateMarker';
import MarkerRow from './MarkerUtils/MarkerRow';
import { useErrorBoundary } from "react-error-boundary";
import './MarkersDisplay.scss';

const MarkersDisplay = ({ showHeading = true, headingText = 'Markers' }) => {
  const { manifest, canvasIndex, playlist } = useManifestState();
  const { player } = usePlayerState();
  const manifestDispatch = useManifestDispatch();

  const { isEditing, hasAnnotationService, annotationServiceId } = playlist;

  const [errorMsg, setErrorMsg] = React.useState();

  const { showBoundary } = useErrorBoundary();

  const canvasIdRef = React.useRef();

  let playlistMarkersRef = React.useRef([]);
  const setPlaylistMarkers = (list) => {
    playlistMarkersRef.current = list;
  };

  // Retrieves the CRSF authenticity token when component is embedded in a Rails app.
  const csrfToken = document.getElementsByName('csrf-token')[0]?.content;

  React.useEffect(() => {
    if (manifest) {
      try {
        const playlistMarkers = parsePlaylistAnnotations(manifest);
        manifestDispatch({ markers: playlistMarkers, type: 'setPlaylistMarkers' });
        const canvases = canvasesInManifest(manifest);
        if (canvases != undefined && canvases?.length > 0) {
          canvasIdRef.current = canvases[canvasIndex].canvasId;
        }
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);

  React.useEffect(() => {
    if (playlist.markers?.length > 0) {
      let { canvasMarkers, error } = playlist.markers.filter((m) => m.canvasIndex === canvasIndex)[0];
      setPlaylistMarkers(canvasMarkers);
      setErrorMsg(error);
    }

    if (manifest) {
      try {
        const canvases = canvasesInManifest(manifest);
        if (canvases != undefined && canvases?.length > 0) {
          canvasIdRef.current = canvases[canvasIndex].canvasId;
        }
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [canvasIndex, playlist.markers]);

  const handleSubmit = (label, time, id) => {
    // Re-construct markers list for displaying in the player UI
    let editedMarkers = playlistMarkersRef.current.map(m => {
      if (m.id === id) {
        m.value = label;
        m.timeStr = time;
        m.time = timeToS(time);
      }
      return m;
    });
    setPlaylistMarkers(editedMarkers);
    manifestDispatch({ updatedMarkers: editedMarkers, type: 'setPlaylistMarkers' });
  };

  const handleDelete = (id) => {
    let remainingMarkers = playlistMarkersRef.current.filter(m => m.id != id);
    // Update markers in state for displaying in the player UI
    setPlaylistMarkers(remainingMarkers);
    manifestDispatch({ updatedMarkers: remainingMarkers, type: 'setPlaylistMarkers' });
  };

  const handleMarkerClick = (e) => {
    e.preventDefault();
    const currentTime = parseFloat(e.target.dataset['offset']);
    player.currentTime(currentTime);
  };

  const handleCreate = (newMarker) => {
    setPlaylistMarkers([...playlistMarkersRef.current, newMarker]);
    manifestDispatch({ updatedMarkers: playlistMarkersRef.current, type: 'setPlaylistMarkers' });
  };

  const toggleIsEditing = (flag) => {
    manifestDispatch({ isEditing: flag, type: 'setIsEditing' });
  };

  /** Get the current time of the playhead */
  const getCurrentTime = () => {
    if (player) {
      return player.currentTime();
    } else {
      return 0;
    }
  };

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
      {hasAnnotationService && (
        <CreateMarker
          newMarkerEndpoint={annotationServiceId}
          canvasId={canvasIdRef.current}
          handleCreate={handleCreate}
          getCurrentTime={getCurrentTime}
          csrfToken={csrfToken}
        />
      )}
      {playlistMarkersRef.current.length > 0 && (
        <table className="ramp--markers-display_table" data-testid="markers-display-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              {hasAnnotationService && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {playlistMarkersRef.current.map((marker, index) => (
              <MarkerRow
                key={index}
                marker={marker}
                handleSubmit={handleSubmit}
                handleMarkerClick={handleMarkerClick}
                handleDelete={handleDelete}
                hasAnnotationService={hasAnnotationService}
                isEditing={isEditing}
                toggleIsEditing={toggleIsEditing}
                csrfToken={csrfToken} />
            ))}
          </tbody>
        </table>
      )}
      {playlistMarkersRef.current.length == 0 && (
        <div
          className="ramp--markers-display__markers-empty"
          data-testid="markers-empty"
        >
          <p>{errorMsg}</p>
        </div>
      )}
    </div>
  );
};

MarkersDisplay.propTypes = {
  showHeading: PropTypes.bool,
  headingText: PropTypes.string,
};

export default MarkersDisplay;
