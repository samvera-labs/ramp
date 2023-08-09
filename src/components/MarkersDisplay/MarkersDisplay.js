import React from 'react';
import PropTypes from 'prop-types';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';
import { createTimestamp, timeToHHmmss, parsePlaylistAnnotations, timeToS } from '@Services/utility-helpers';
import './MarkersDisplay.scss';

const MarkersDisplay = ({ showHeading = true }) => {
  const { manifest, canvasIndex, canvasDuration, playlist } = useManifestState();
  const manifestDispatch = useManifestDispatch();
  const { isEditing } = playlist;

  const [playlistMarkers, setPlaylistMarkers] = React.useState([]);

  React.useEffect(() => {
    if (manifest) {
      const { markers, error } = parsePlaylistAnnotations({
        manifest,
        canvasIndex,
      });
      setPlaylistMarkers(markers);
      manifestDispatch({ markers, type: 'setPlaylistMarkers' });
      console.log(markers);
    }
  }, [manifest, canvasIndex]);

  const handleSubmit = (label, time, id, canvasId) => {
    console.log('Label: ', label, ' Time: ', time);
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
      credentials: "include",
      body: JSON.stringify(annotation)
    };
    console.log(requestOptions);
    fetch(id, requestOptions)
      .then((response) => {
        console.log(response);
      });
    return;
  };

  return (
    <div className="ramp--markers-display">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {playlistMarkers.map((marker, index) => (
            <MarkerRow key={index} marker={marker} index={index} handleSubmit={handleSubmit} isEditing={isEditing} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarkerRow = ({ marker, index, handleSubmit, isEditing }) => {
  const manifestDispatch = useManifestDispatch();
  const [editing, setEditing] = React.useState(false);
  const [markerLabel, setMarkerLabel] = React.useState(marker.value);
  const [markerTime, setMarkerTime] = React.useState(marker.time);
  const [isValid, setIsValid] = React.useState();

  const handleEdit = () => {
    setEditing(true);
    manifestDispatch({ isEditing: true, type: 'setIsEditing' });
  };

  const handleCancel = () => {
    setEditing(false);
    manifestDispatch({ isEditing: false, type: 'setIsEditing' });
  };

  const handleEditSubmit = () => {
    handleCancel();
    handleSubmit(markerLabel, markerTime, marker.src, marker.canvasId);
  };

  const validateTimeInput = (value) => {
    const timeRegex = /^(([0-1][0-9])|([2][0-3])):([0-5][0-9])(:[0-5][0-9](?:[.]\d{1,3})?)?$/;
    setIsValid(timeRegex.test(value));
    setMarkerTime(value);
  };

  if (editing) {
    return (
      <tr>
        <td>
          <input
            id="label"
            value={markerLabel}
            onChange={(e) => setMarkerLabel(e.target.value)}
            name="label" />
        </td>
        <td>
          <input
            className={isValid ? '' : 'time-invalid'}
            id="time"
            value={markerTime}
            onChange={(e) => validateTimeInput(e.target.value)}
            name="time" />
        </td>
        <td>
          <button type="submit" onClick={handleEditSubmit}>Submit</button>
          <button className="danger" onClick={handleCancel}>Cancel</button>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className={isEditing ? 'tr-disabled' : ''}>
        <td>{markerLabel}</td>
        <td>{markerTime}</td>
        <td><button onClick={handleEdit}>Edit</button><button className="danger">Delete</button></td>
      </tr>
    );
  }

};

MarkersDisplay.propTypes = {
  showHeading: PropTypes.bool,
};

export default MarkersDisplay;

