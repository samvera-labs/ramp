import React from 'react';
import PropTypes from 'prop-types';
import { CancelIcon, EditIcon, DeleteIcon, SaveIcon } from './SVGIcons';
import { validateTimeInput, timeToS } from '@Services/utility-helpers';

const MarkerRow = ({
  marker,
  handleSubmit,
  handleMarkerClick,
  handleDelete,
  hasAnnotationService,
  isEditing,
  toggleIsEditing
}) => {
  const [editing, setEditing] = React.useState(false);
  const [markerLabel, setMarkerLabel] = React.useState(marker.value);
  const [markerTime, setMarkerTime] = React.useState(marker.timeStr);
  const [markerOffset, setMarkerOffset] = React.useState(marker.time);
  const [isValid, setIsValid] = React.useState(true);
  const [tempMarker, setTempMarker] = React.useState();
  const [deleting, setDeleting] = React.useState(false);
  const [saveError, setSaveError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleEdit = () => {
    setTempMarker({ time: markerTime, label: markerLabel });
    setEditing(true);
    toggleIsEditing(true);
  };

  // Reset old information of the marker when edit action is cancelled
  const handleCancel = () => {
    setMarkerTime(tempMarker.time);
    setMarkerLabel(tempMarker.label);
    setTempMarker({});
    resetError();
    cancelAction();
  };

  // Submit edited information of the current marker
  const handleEditSubmit = async () => {
    setMarkerOffset(timeToS(markerTime));
    let statusCode = await handleSubmit(
      markerLabel,
      markerTime,
      marker.id,
      marker.canvasId
    );
    if (statusCode) {
      setSaveError(true);
      setErrorMessage('Marker update failed');
    } else {
      resetError();
      cancelAction();
    }
  };

  // Validate timestamps when typing
  const validateTime = (value) => {
    let isValid = validateTimeInput(value);
    setIsValid(isValid);
    setMarkerTime(value);
  };

  // Toggle delete confirmation
  const toggleDelete = () => {
    setDeleting(true);
    toggleIsEditing(true);
  };

  // Submit delete action
  const submitDelete = async () => {
    let statusCode = await handleDelete(marker.id);
    if (statusCode) {
      cancelAction();
      setSaveError(true);
      setErrorMessage('Marker delete failed.');
    } else {
      resetError();
      cancelAction();
    }
    // Reset delete error timeout
    setTimeout(() => {
      resetError();
    }, 1000);
  };

  const resetError = () => {
    setSaveError(false);
    setErrorMessage('');
  };

  // Reset edit state when edit/delete actions are finished
  const cancelAction = () => {
    setDeleting(false);
    setEditing(false);
    toggleIsEditing(false);
  };

  if (editing) {
    return (
      <tr>
        <td>
          <input
            id="label"
            data-testid="edit-label"
            value={markerLabel}
            type="text"
            className="ramp--markers-display__edit-marker"
            onChange={(e) => setMarkerLabel(e.target.value)}
            name="label" />
        </td>
        <td>
          <input
            className={`ramp--markers-display__edit-marker ${isValid ? 'time-valid' : 'time-invalid'}`}
            id="time"
            data-testid="edit-timestamp"
            value={markerTime}
            type="text"
            onChange={(e) => validateTime(e.target.value)}
            name="time" />
        </td>
        <td>
          <div className="marker-actions">
            {
              saveError &&
              <p className="ramp--markers-display__error-message">
                {errorMessage}
              </p>
            }
            <button
              type="submit"
              onClick={handleEditSubmit}
              disabled={!isValid}
              className="ramp--markers-display__edit-button"
              data-testid="edit-save-button"
            >
              <SaveIcon /> Save
            </button>
            <button
              className="ramp--markers-display__edit-button-danger"
              data-testid="edit-cancel-button"
              onClick={handleCancel}
            >
              <CancelIcon /> Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  } else if (deleting) {
    return (
      <tr>
        <td>
          <a
            href={`${marker.canvasId}#t=${markerOffset},`}
            onClick={(e) => handleMarkerClick(e)}
            data-offset={markerOffset}>
            {markerLabel}
          </a></td>
        <td>{markerTime}</td>
        <td>
          <div className="marker-actions">
            <p>Are you sure?</p>
            <button
              type="submit"
              className="ramp--markers-display__edit-button-danger"
              data-testid="delete-confirm-button"
              onClick={submitDelete}
            >
              <SaveIcon /> Yes
            </button>
            <button
              className="ramp--markers-display__edit-button"
              data-testid="delete-cancel-button"
              onClick={cancelAction}
            >
              <CancelIcon /> Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td>
          <a
            href={`${marker.canvasId}#t=${markerOffset},`}
            onClick={(e) => handleMarkerClick(e)}
            data-offset={markerOffset}>
            {markerLabel}
          </a></td>
        <td>{markerTime}</td>
        {hasAnnotationService &&
          <td>
            <div className="marker-actions">
              {
                saveError &&
                <p className="ramp--markers-display__error-message">
                  {errorMessage}
                </p>
              }
              <button
                onClick={handleEdit}
                className="ramp--markers-display__edit-button"
                data-testid="edit-button"
                disabled={isEditing}
              >
                <EditIcon /> Edit
              </button>
              <button
                className="ramp--markers-display__edit-button-danger"
                data-testid="delete-button"
                disabled={isEditing}
                onClick={toggleDelete}
              >
                <DeleteIcon /> Delete
              </button>
            </div>
          </td>}
      </tr>
    );
  }
};

MarkerRow.propTypes = {
  marker: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleMarkerClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  hasAnnotationService: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  toggleIsEditing: PropTypes.func.isRequired,
};

export default MarkerRow;
