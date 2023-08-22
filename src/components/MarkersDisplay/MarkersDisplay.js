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
  const [errorMsg, setErrorMsg] = React.useState();

  React.useEffect(() => {
    if (manifest) {
      const { markers, error } = parsePlaylistAnnotations({
        manifest,
        canvasIndex,
      });
      setPlaylistMarkers(markers);
      setErrorMsg(error);
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

  if (playlistMarkers.length > 0) {
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
  } else {
    return <p>{errorMsg}</p>;
  }
};

const EditIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'white', height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <path fillRule="evenodd" clipRule="evenodd"
        d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 
        4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 
        16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 
        18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 
        16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 
        2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 
        4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 
        6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 
        15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 
        6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 
        4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 
        21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 
        18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 
        19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"
        fill="#fffff" />
    </svg>
  );
};

const DeleteIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M10 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M14 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M4 7H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );
};

const SaveIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Interface / Check">
          <path id="Vector" d="M6 12L10.2426 16.2426L18.727 7.75732" stroke="#ffffff"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </g>
    </svg>
  );
};

const CancelIcon = () => {
  return (
    <svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> <title>cancel2</title>
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 
        0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 
        0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
        0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 
        1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 
        0.396 0.396 1.038 0 1.435l-6.096 6.096z">
        </path>
      </g>
    </svg>
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
            type="text"
            onChange={(e) => setMarkerLabel(e.target.value)}
            name="label" />
        </td>
        <td>
          <input
            className={isValid ? '' : 'time-invalid'}
            id="time"
            value={markerTime}
            type="text"
            onChange={(e) => validateTimeInput(e.target.value)}
            name="time" />
        </td>
        <td>
          <button type="submit" onClick={handleEditSubmit}>
            <SaveIcon /> Save
          </button>
          <button className="danger" onClick={handleCancel}>
            <CancelIcon /> Cancel
          </button>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className={isEditing ? 'tr-disabled' : ''}>
        <td>{markerLabel}</td>
        <td>{markerTime}</td>
        <td>
          <button onClick={handleEdit}>
            <EditIcon /> Edit
          </button>
          <button className="danger">
            <DeleteIcon /> Delete
          </button>
        </td>
      </tr>
    );
  }

};

MarkersDisplay.propTypes = {
  showHeading: PropTypes.bool,
};

export default MarkersDisplay;

