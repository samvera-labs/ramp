import React from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { parsePlaylistAnnotations } from '@Services/playlist-parser';
import { canvasesInManifest } from '@Services/iiif-parser';
import { timeToS } from '@Services/utility-helpers';
import CreateMarker from './MarkerUtils/CreateMarker';
import MarkerRow from './MarkerUtils/MarkerRow';
import './MarkersDisplay.scss';

const MarkersDisplay = ({ showHeading = true, headingText = 'Markers' }) => {
  const { manifest, canvasIndex, playlist } = useManifestState();
  const { player } = usePlayerState();
  const manifestDispatch = useManifestDispatch();

  const { isEditing, hasAnnotationService, annotationServiceId } = playlist;

  const [errorMsg, setErrorMsg] = React.useState();
  const canvasIdRef = React.useRef();

  let playlistMarkersRef = React.useRef([]);
  const setPlaylistMarkers = (list) => {
    playlistMarkersRef.current = list;
  };

  React.useEffect(() => {
    if (manifest) {
      const { markers, error } = parsePlaylistAnnotations(manifest, canvasIndex);
      setPlaylistMarkers(markers);
      setErrorMsg(error);
      manifestDispatch({ markers, type: 'setPlaylistMarkers' });

      canvasIdRef.current = canvasesInManifest(manifest)[canvasIndex].canvasId;
    }
  }, [manifest, canvasIndex]);

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
    manifestDispatch({ markers: editedMarkers, type: 'setPlaylistMarkers' });
  };

  const handleDelete = (id) => {
    let remainingMarkers = playlistMarkersRef.current.filter(m => m.id != id);
    // Update markers in state for displaying in the player UI
    setPlaylistMarkers(remainingMarkers);
    manifestDispatch({ markers: remainingMarkers, type: 'setPlaylistMarkers' });
  };

  const handleMarkerClick = (e) => {
    e.preventDefault();
    const currentTime = parseFloat(e.target.dataset['offset']);
    player.currentTime(currentTime);
  };

  const handleCreate = (newMarker) => {
    setPlaylistMarkers([...playlistMarkersRef.current, newMarker]);
    manifestDispatch({ markers: [...playlistMarkersRef.current, newMarker], type: 'setPlaylistMarkers' });
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
                toggleIsEditing={toggleIsEditing} />
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

