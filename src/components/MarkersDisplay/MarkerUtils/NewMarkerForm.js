import React from 'react';
import PropTypes from 'prop-types';
import { createNewAnnotation, parseMarkerAnnotation } from '@Services/playlist-parser';
import { validateTimeInput, timeToS } from '@Services/utility-helpers';
import { SaveIcon, CancelIcon } from './SVGIcons';

const NewMarkerForm = ({ newMarkerEndpoint, canvasId, handleCreate }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);
  const [saveError, setSaveError] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('Test message');

  const handleAddMarker = (e) => {
    setIsOpen(true);
  };

  const handleCreateSubmit = async (e) => {
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
      headers: {
        'Accept': 'application/json',
        'Avalon-Api-Key': '',
      },
      body: JSON.stringify(annotation)
    };
    const statusCode = await fetch(newMarkerEndpoint, requestOptions)
      .then((response) => {
        if (response.status != 201) {
          return response.status;
        } else {
          return response.json();
        }
      }).then((json) => {
        console.log(json);
        const anno = createNewAnnotation(json);
        const newMarker = parseMarkerAnnotation(anno);
        if (newMarker) {
          handleCreate(newMarker);
        }
        return null;
      })
      .catch((e) => {
        console.error('Failed to create annotation; ', e);
        setSaveError(true);
        setErrorMessage('Marker creation failed.');
      });
    return statusCode;
  };

  const handleCreateCancel = () => {
    setIsOpen(false);
    setIsValid(false);
    setErrorMessage('');
    setSaveError(false);
  };

  const validateTime = (value) => {
    let isValid = validateTimeInput(value);
    setIsValid(isValid);
  };

  return (
    <div className="ramp-markers-display__new-marker">
      <button
        type="submit"
        onClick={handleAddMarker}
        className="ramp--markers-display__edit-button"
      >Add New Marker</button>
      {isOpen &&
        (<form
          className="ramp--markers-display__new-marker-form"
          method="post"
          onSubmit={handleCreateSubmit}
        >
          <table className="create-marker-form-table">
            <tr>
              <td>
                <label htmlFor="new-marker-label">Label:</label>
                <input
                  id="new-marker-label"
                  data-testid="create-marker-label"
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
                  placeholder='00:00:00.000'
                  onChange={(e) => validateTime(e.target.value)} />
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
          </table>
        </form>)
      }
    </div>
  );
};

NewMarkerForm.propTypes = {
  newMarkerEndpoint: PropTypes.string.isRequired,
  canvasId: PropTypes.string,
  handleCreate: PropTypes.func.isRequired,
};

export default NewMarkerForm;
