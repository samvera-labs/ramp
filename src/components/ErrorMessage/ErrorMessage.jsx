import React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from "react-error-boundary";
import './ErrorMessage.scss';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="ramp--error-message__alert">
      <span
        className="ramp--error-message__message"
        dangerouslySetInnerHTML={{ __html: error.message }}>
      </span>
      <button
        className="ramp--error-message__reset-button"
        onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

const ErrorMessage = ({
  message,
  children
}) => {
  return (
    <ErrorBoundary FallbackComponent={Fallback}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
      }}>
      {children}
    </ErrorBoundary>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  children: PropTypes.object
};


export default ErrorMessage;
