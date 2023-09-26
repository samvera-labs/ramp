import React from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { usePlayerState } from '../../context/player-context';
import { parsePlaylistAnnotations } from '@Services/playlist-parser';
import { canvasesInManifest } from '@Services/iiif-parser';
import { timeToS } from '@Services/utility-helpers';
import NewMarkerForm from './MarkerUtils/NewMarkerForm';
import MarkerRow from './MarkerUtils/MarkerRow';
import './MarkersDisplay.scss';

const MarkersDisplay = ({ showHeading = true, headingText = 'Markers' }) => {
  const { manifest, canvasIndex, playlist } = useManifestState();
  const { player } = usePlayerState();
  const manifestDispatch = useManifestDispatch();

  const { isEditing, hasAnnotationService, annotationServiceId } = playlist;

  const [playlistMarkers, setPlaylistMarkers] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState();
  const canvasIdRef = React.useRef();

  React.useEffect(() => {
    if (manifest) {
      const { markers, error } = parsePlaylistAnnotations(manifest, canvasIndex);
      setPlaylistMarkers(markers);
      setErrorMsg(error);
      manifestDispatch({ markers, type: 'setPlaylistMarkers' });

      canvasIdRef.current = canvasesInManifest(manifest)[canvasIndex].canvasId;
    }
  }, [manifest, canvasIndex]);

  const handleSubmit = async (label, time, id, canvasId) => {
    // Re-construct markers list for displaying in the player UI
    let editedMarkers = playlistMarkers.map(m => {
      if (m.id === id) {
        m.value = label;
        m.timeStr = time;
        m.time = timeToS(time);
      }
      return m;
    });

    // Call the annotation service to update the marker in the back-end
    const annotation = {
      type: "Annotation",
      motivation: "highlighting",
      body: {
        type: "TextualBody",
        format: "text/html",
        value: label,
      },
      id: id,
      target: `${canvasId}#t=${timeToS(time)}`
    };
    const requestOptions = {
      method: 'PUT',
      /** NOTE: In avalon try this option */
      // credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Avalon-Api-Key': '',
      },
      body: JSON.stringify(annotation)
    };
    const statusCode = await fetch(id, requestOptions)
      .then((response) => {
        if (response.status != 201) {
          return response.status;
        } else {
          setPlaylistMarkers(editedMarkers);
          manifestDispatch({ markers: editedMarkers, type: 'setPlaylistMarkers' });
          return null;
        }
      })
      .catch((e) => {
        console.error('Failed to update annotation; ', e);
      });
    return statusCode;
  };

  const handleDelete = async (id) => {
    /* TODO:: Udate the state once the API call is successful */
    // Update markers in state for displaying in the player UI
    let remainingMarkers = playlistMarkers.filter(m => m.id != id);

    const requestOptions = {
      method: 'DELETE',
      /** NOTE: In avalon try this option */
      // credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Avalon-Api-Key': '',
      }
    };
    // API call for DELETE
    const statusCode = await fetch(id, requestOptions)
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          return response.status;
        } else {
          setPlaylistMarkers(remainingMarkers);
          manifestDispatch({ markers: remainingMarkers, type: 'setPlaylistMarkers' });
          return null;
        }
      })
      .catch((e) => {
        console.error('Failed to delete annotation; ', e);
      });
    return statusCode;
  };

  const handleMarkerClick = (e) => {
    e.preventDefault();
    const currentTime = parseFloat(e.target.dataset['offset']);
    player.currentTime(currentTime);
  };

  const handleCreate = (newMarker) => {
    setPlaylistMarkers([...playlistMarkers, newMarker]);
    manifestDispatch({ markers: playlistMarkers, type: 'setPlaylistMarkers' });
  };

  const toggleIsEditing = (flag) => {
    manifestDispatch({ isEditing: flag, type: 'setIsEditing' });
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
        <NewMarkerForm
          newMarkerEndpoint={annotationServiceId}
          canvasId={canvasIdRef.current}
          handleCreate={handleCreate}
        />
      )}
      {playlistMarkers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              {hasAnnotationService && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {playlistMarkers.map((marker, index) => (
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
      {playlistMarkers.length == 0 && (
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

