import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CancelIcon, EditIcon, DeleteIcon, SaveIcon } from '@Services/svg-icons';
import { validateTimeInput, timeToS } from '@Services/utility-helpers';
import { useMarkers, useMediaPlayer } from '@Services/ramp-hooks';

/**
 * Build a table row for each 'highlighting; annotation in the current Canvas in the Manifest.
 * These are timepoint annotations. When user has permissions to edit annotations, an actions
 * column is populated for each annotation with edit and delete actions.
 * @param {Object} props
 * @param {Object} props.marker each marker parsed from annotations
 * @param {Function} props.handleSubmit callback func to update state on marker edit action
 * @param {Function} props.handleDelete callback func to update state on marker delete action
 * @param {Function} props.toggleIsEditing callback function to update global state
 * @param {String} props.csrfToken token to authenticate POST request
 */
const MarkerRow = ({
  marker,
  handleSubmit,
  handleDelete,
  toggleIsEditing,
  csrfToken
}) => {
  const [editing, setEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [tempMarker, setTempMarker] = useState();
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let controller;

  const { hasAnnotationService, isDisabled } = useMarkers();
  const { player } = useMediaPlayer();

  // Remove all fetch requests on unmount
  useEffect(() => {
    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    setMarkerLabel(marker.value);
    setMarkerTime(marker.timeStr);
  }, [marker]);

  let markerLabelRef = useRef(marker.value);
  const setMarkerLabel = (label) => {
    markerLabelRef.current = label;
  };

  let markerOffsetRef = useRef(timeToS(marker.timeStr));
  let markerTimeRef = useRef(marker.timeStr);
  const setMarkerTime = (time) => {
    markerTimeRef.current = time;
    markerOffsetRef.current = timeToS(time);
  };

  const handleEdit = () => {
    setTempMarker({ time: markerTimeRef.current, label: markerLabelRef.current });
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
  const handleEditSubmit = () => {
    const annotation = {
      type: "Annotation",
      motivation: "highlighting",
      body: {
        type: "TextualBody",
        format: "text/html",
        value: markerLabelRef.current,
      },
      id: marker.id,
      target: `${marker.canvasId}#t=${timeToS(markerTimeRef.current)}`
    };
    const requestOptions = {
      method: 'PUT',
      /** NOTE: In avalon try this option */
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        // 'Avalon-Api-Key': '',
      },
      body: JSON.stringify(annotation)
    };
    if (csrfToken !== undefined) { requestOptions.headers['X-CSRF-Token'] = csrfToken; };
    controller = new AbortController();
    fetch(marker.id, requestOptions, { signal: controller.signal })
      .then((response) => {
        if (response.status != 201) {
          throw new Error();
        } else {
          handleSubmit(markerLabelRef.current, markerTimeRef.current, marker.id);
          resetError();
          cancelAction();
        }
      })
      .catch((e) => {
        console.error('MarkerRow -> handleEditSubmit -> failed to update annotation; ', e);
        setSaveError(true);
        setErrorMessage('Marker update failed');
      });
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
  const submitDelete = () => {
    const requestOptions = {
      method: 'DELETE',
      /** NOTE: In avalon try this option */
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        // 'Avalon-Api-Key': '',
      }
    };
    if (csrfToken !== undefined) { requestOptions.headers['X-CSRF-Token'] = csrfToken; };
    // API call for DELETE
    controller = new AbortController();
    fetch(marker.id, requestOptions, { signal: controller.signal })
      .then((response) => {
        if (response.status != 200) {
          throw new Error();
        } else {
          handleDelete(marker.id);
          resetError();
          cancelAction();
        }
      })
      .catch((e) => {
        console.error('MarkerRow -> submitDelete() -> failed to delete annotation; ', e);
        cancelAction();
        setSaveError(true);
        setErrorMessage('Marker delete failed.');
        setTimeout(() => {
          resetError();
        }, 1500);
      });
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

  const handleMarkerClick = useCallback((e) => {
    e.preventDefault();
    const currentTime = parseFloat(e.target.dataset['offset']);
    if (player) {
      const { start, end } = player.targets[0];
      switch (true) {
        case currentTime >= start && currentTime <= end:
          player.currentTime(currentTime);
          break;
        case currentTime < start:
          player.currentTime(start);
          break;
        case currentTime > end:
          player.currentTime(end);
          break;
        default:
          break;
      }
    }
  }, [player]);

  if (editing) {
    return (
      <tr>
        <td>
          <input
            id="marker-edit-label"
            data-testid="edit-label"
            defaultValue={markerLabelRef.current}
            type="text"
            className="ramp--markers-display__edit-marker"
            onChange={(e) => setMarkerLabel(e.target.value)}
            name="label" />
        </td>
        <td>
          <input
            className={cx(
              'ramp--markers-display__edit-marker',
              isValid ? 'time-valid' : 'time-invalid'
            )}
            id="marker-edit-time"
            data-testid="edit-timestamp"
            defaultValue={markerTimeRef.current}
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
            href={`${marker.canvasId}#t=${markerOffsetRef.current},`}
            onClick={(e) => handleMarkerClick(e)}
            data-offset={markerOffsetRef.current}>
            {markerLabelRef.current}
          </a></td>
        <td>{markerTimeRef.current}</td>
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
      <tr data-testid="marker-row">
        <td>
          <a
            href={`${marker.canvasId}#t=${markerOffsetRef.current},`}
            onClick={(e) => handleMarkerClick(e)}
            data-offset={markerOffsetRef.current}>
            {markerLabelRef.current}
          </a></td>
        <td>{markerTimeRef.current}</td>
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
                disabled={isDisabled}
              >
                <EditIcon /> Edit
              </button>
              <button
                className="ramp--markers-display__edit-button-danger"
                data-testid="delete-button"
                disabled={isDisabled}
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
  handleDelete: PropTypes.func.isRequired,
  toggleIsEditing: PropTypes.func.isRequired,
  csrfToken: PropTypes.string
};

export default MarkerRow;
