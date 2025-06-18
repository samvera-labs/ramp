import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { parseMarkerAnnotation } from '@Services/playlist-parser';
import { validateTimeInput, timeToS, timeToHHmmss } from '@Services/utility-helpers';
import { SaveIcon, CancelIcon } from '@Services/svg-icons';
import { useMediaPlayer } from '@Services/ramp-hooks';

/**
 * Build and handle creation of new markers for playlists. This component is rendered
 * on page when the user has permissions to create new markers in a given playlist Manifest.
 * @param {Object} props
 * @param {String} props.newMarkerEndpoint annotationService to POST create markers request
 * @param {Number} props.canvasId URI of the current Canvas
 * @param {Function} props.handleCreate callback function to update global state
 * @param {String} props.csrfToken token to authenticate POST request
 */
const CreateMarker = ({ newMarkerEndpoint, canvasId, handleCreate, csrfToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [markerTime, setMarkerTime] = useState();
  let controller;

  const { getCurrentTime } = useMediaPlayer();

  useEffect(() => {
    // Close new marker form on Canvas change
    setIsOpen(false);

    // Remove all fetch requests on unmount
    return () => {
      controller?.abort();
    };
  }, [canvasId]);

  const handleAddMarker = () => {
    const currentTime = timeToHHmmss(getCurrentTime(), true, true);
    validateTime(currentTime);
    setIsOpen(true);
  };

  const handleCreateSubmit = useCallback((e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { label, time } = Object.fromEntries(formData.entries());
    const annotation = {
      type: "Annotation",
      motivation: "highlighting",
      body: {
        type: "TextualBody",
        format: "text/html",
        value: label,
      },
      target: `${canvasId}#t=${timeToS(time)}`
    };

    const requestOptions = {
      method: 'POST',
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
    fetch(newMarkerEndpoint, requestOptions, { signal: controller.signal })
      .then((response) => {
        if (response.status != 201) {
          throw new Error();
        } else {
          return response.json();
        }
      }).then((json) => {
        const newMarker = parseMarkerAnnotation(json);
        if (newMarker) {
          handleCreate(newMarker);
        }
        setIsOpen(false);
      })
      .catch((e) => {
        console.error('CreateMarker -> handleCreateMarker() -> failed to create annotation; ', e);
        setSaveError(true);
        setErrorMessage('Marker creation failed.');
      });
  }, [canvasId]);

  const handleCreateCancel = useCallback(() => {
    setIsOpen(false);
    setIsValid(false);
    setErrorMessage('');
    setSaveError(false);
  });

  const validateTime = (e) => {
    let value = e?.target?.value ?? e;
    setMarkerTime(value);
    let isValid = validateTimeInput(value);
    setIsValid(isValid);
  };

  return (
    <div className="ramp-markers-display__new-marker" data-testid="create-new-marker">
      <button
        type="submit"
        onClick={handleAddMarker}
        className="ramp--markers-display__edit-button"
        data-testid="create-new-marker-button"
      >
        Add New Marker
      </button>
      {isOpen &&
        (<form
          className="ramp--markers-display__new-marker-form"
          method="post"
          onSubmit={handleCreateSubmit}
          data-testid="create-new-marker-form"
        >
          <table className="create-marker-form-table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="new-marker-title">Title:</label>
                  <input
                    id="new-marker-title"
                    data-testid="create-marker-title"
                    type="text"
                    className="ramp--markers-display__create-marker"
                    name="label" />
                </td>
                <td>
                  <label htmlFor="new-marker-time">Time:</label>
                  <input
                    id="new-marker-time"
                    data-testid="create-marker-timestamp"
                    type="text"
                    className={cx(
                      'ramp--markers-display__create-marker',
                      isValid ? 'time-valid' : 'time-invalid'
                    )}
                    name="time"
                    value={markerTime}
                    onChange={validateTime} />

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
                      className="ramp--markers-display__edit-button"
                      data-testid="edit-save-button"
                      disabled={!isValid}
                    >
                      <SaveIcon /> Save
                    </button>
                    <button
                      className="ramp--markers-display__edit-button-danger"
                      data-testid="edit-cancel-button"
                      onClick={handleCreateCancel}
                    >
                      <CancelIcon /> Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>)
      }
    </div>
  );
};

CreateMarker.propTypes = {
  newMarkerEndpoint: PropTypes.string.isRequired,
  canvasId: PropTypes.string,
  handleCreate: PropTypes.func.isRequired,
  csrfToken: PropTypes.string
};

export default CreateMarker;
