import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getLabelValue, sanitizeHTML } from '@Services/utility-helpers';
import { probeResource, requestTokenViaIframe } from '@Services/auth-service';
import './VideoJSPlayer.scss';

/**
 * Display authentication dialog and handle login/logout interactions for IIIF resources
 * protected by IIIF Auth 2.0 spec. 
 * It is rendered over the VideoJS player when a Canvas has an AuthProbeService2 defined.
 * The flow is as follows;
 * 1. On page load: probe the resource without a token to determine if login is required
 * 2. Login: performs the authnentication flow based on the access service profile and gets a token
 * 3. On token received: re-probe with token to confirm authorization, or show error if probe fails
 * 4. Logout button (if present): open logout URL in new tab, clear token
 * @param {Object} props
 * @param {Object} props.authService
 * @param {String} props.authToken
 * @param {String} props.authStatus
 * @param {Function} props.onTokenReceived
 * @param {Function} props.onAuthStatus
 */
function AuthOverlay({ authService, authToken, authStatus, onTokenReceived, onAuthStatus }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginTabRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const { probe, accessService, tokenService, logoutService } = authService;

  // Probe without token on page load to determine if login is required
  useEffect(() => {
    if (authStatus !== 'idle') return;
    onAuthStatus('probing');
    probeResource(probe.id, null)
      .then(({ status }) => {
        if (status === 200) {
          onAuthStatus('authorized');
        } else {
          onAuthStatus('login-required');
        }
      })
      .catch(() => {
        onAuthStatus('login-required');
      });
  }, []);

  // Cleanup login tab pollin interval on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollIntervalRef.current);
    };
  }, []);

  /**
   * Acquire token via a hidden iframe using postMessage API, then save this token
   * and update the auth status in state.
   * For successful token acquisistion, re-probe the resource with a header carrying
   * the token as Bearer token to confirm authorization.
   */
  const acquireToken = () => {
    if (!tokenService) return;
    const origin = window.location.origin;
    requestTokenViaIframe(tokenService.id, origin)
      .then(async ({ accessToken }) => {
        // Re-probe the resource with token
        const { status, heading, note } = await probeResource(probe.id, accessToken);
        if (status === 200) {
          setErrorMessage(null);
          onTokenReceived(accessToken);
          onAuthStatus('authorized');
        } else {
          const errHeading = heading ? getLabelValue(heading) : getLabelValue(probe?.errorHeading);
          const errNote = note ? getLabelValue(note) : getLabelValue(probe?.errorNote);
          setErrorMessage({ heading: errHeading, note: errNote });
          onAuthStatus('error');
          setIsLoggingIn(false);
        }
      })
      .catch(() => {
        setErrorMessage({
          heading: getLabelValue(tokenService.errorHeading) || 'Authentication failed',
          note: getLabelValue(tokenService.errorNote) || 'Could not obtain an access token.',
        });
        onAuthStatus('error');
        setIsLoggingIn(false);
      });
  };

  /**
   * Handle login button click based on the access service profile:
   * - kiosk: acquire token via iframe
   * - active: open a login tab, poll for it closing, then acquire token via iframe
   * If popup is blocked, fall back to direct token acquisition without opening a login tab
   */
  const handleLogin = () => {
    if (!accessService || isLoggingIn) return;
    setIsLoggingIn(true);
    setErrorMessage(null);

    if (accessService.profile === 'kiosk') {
      acquireToken();
      return;
    }

    // Open login tab, poll for it closing for active profile
    const loginUrl = `${accessService.id}?origin=${encodeURIComponent(window.location.origin)}`;
    // Do NOT use 'noopener' here, it breaks window ref and breaks the polling
    const tab = window.open(loginUrl, '_blank');
    loginTabRef.current = tab;

    // When popup is blocked use token acquisition via iframe without opening login tab
    if (!tab) {
      acquireToken();
      return;
    }

    // Start polling for login tab status to detect tab closing and initiate token acquisition
    pollIntervalRef.current = setInterval(() => {
      if (loginTabRef.current && loginTabRef.current.closed) {
        clearInterval(pollIntervalRef.current);
        loginTabRef.current = null;
        acquireToken();
      }
    }, 500);
  };

  /**
   * Handle Logout button click
   */
  const handleLogout = () => {
    if (!logoutService) return;
    window.open(logoutService.id, '_blank', 'noopener');
    onTokenReceived(null);
    onAuthStatus('idle');
  };

  /**
   * Handle Cancel button click, close login tab if open, clear polling interval,
   * and reset auth status in state
   */
  const handleCancel = () => {
    clearInterval(pollIntervalRef.current);
    if (loginTabRef.current && !loginTabRef.current.closed) {
      loginTabRef.current.close();
      loginTabRef.current = null;
    }
    setIsLoggingIn(false);
    onAuthStatus('cancelled');
  };

  const loginLabel = accessService
    ? getLabelValue(accessService.confirmLabel) || getLabelValue(accessService.label) || 'Log in'
    : 'Log in';
  const headingText = accessService
    ? getLabelValue(accessService.heading) || getLabelValue(accessService.label)
    : null;
  const noteText = accessService ? getLabelValue(accessService.note) : null;
  // Only show logout when the user already has a token and a logout service is provided
  const logoutLabel = (logoutService && authToken) ? getLabelValue(logoutService.label) || 'Log out' : null;

  if (authStatus === 'authorized' || authStatus === 'idle' || authStatus === 'probing' || authStatus === 'cancelled') {
    return null;
  }

  return (
    <div className='ramp--auth-overlay' data-testid='auth-overlay' role='region' aria-label='Authentication required'>
      <div className='ramp--auth-overlay__content'>
        {errorMessage ? (
          <>
            {errorMessage.heading && (
              <p className='ramp--auth-overlay__error-heading' dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMessage.heading) }} />
            )}
            {errorMessage.note && (
              <p className='ramp--auth-overlay__error-note' dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMessage.note) }} />
            )}
          </>
        ) : (
          <>
            {headingText && (
              <p className='ramp--auth-overlay__heading' dangerouslySetInnerHTML={{ __html: sanitizeHTML(headingText) }} />
            )}
            {noteText && (
              <p className='ramp--auth-overlay__note' dangerouslySetInnerHTML={{ __html: sanitizeHTML(noteText) }} />
            )}
          </>
        )}
        <div className='ramp--auth-overlay__actions'>
          <button className='ramp--auth-overlay__login-btn' onClick={handleLogin} disabled={isLoggingIn} data-testid='auth-login-btn'>
            {isLoggingIn ? 'Waiting…' : loginLabel}
          </button>
          {logoutLabel && (
            <button className='ramp--auth-overlay__logout-btn' onClick={handleLogout} data-testid='auth-logout-btn'>
              {logoutLabel}
            </button>
          )}
          <button className='ramp--auth-overlay__cancel-btn' onClick={handleCancel} data-testid='auth-cancel-btn'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

AuthOverlay.propTypes = {
  authService: PropTypes.shape({
    probe: PropTypes.object.isRequired,
    accessService: PropTypes.object,
    tokenService: PropTypes.object,
    logoutService: PropTypes.object,
  }).isRequired,
  authToken: PropTypes.string,
  authStatus: PropTypes.string.isRequired,
  onTokenReceived: PropTypes.func.isRequired,
  onAuthStatus: PropTypes.func.isRequired,
};

export default AuthOverlay;
