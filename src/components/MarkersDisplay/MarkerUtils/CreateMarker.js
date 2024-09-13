import React from 'react';
import PropTypes from 'prop-types';
import { parseMarkerAnnotation } from '@Services/playlist-parser';
import { validateTimeInput, timeToS, timeToHHmmss } from '@Services/utility-helpers';
import { SaveIcon, CancelIcon } from '@Services/svg-icons';
import { usePlayer } from '@Services/markers';

const CreateMarker = ({ newMarkerEndpoint, canvasId, handleCreate, csrfToken }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [saveError, setSaveError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [markerTime, setMarkerTime] = React.useState();
  let controller;

  const { getCurrentTime, _ } = usePlayer();

  React.useEffect(() => {
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

  const handleCreateSubmit = React.useCallback((e) => {
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

  const handleCreateCancel = React.useCallback(() => {
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
    <div className="ramp-markers-display__new-marker">
      <button
        type="submit"
        onClick={handleAddMarker}
        className="ramp--markers-display__edit-button"
        data-testid="create-new-marker-button"
      >Add New Marker</button>
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
                    className={`ramp--markers-display__create-marker ${isValid ? 'time-valid' : 'time-invalid'}`}
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
};

export default CreateMarker;
