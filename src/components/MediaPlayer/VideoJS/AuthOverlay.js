import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getLabelValue, sanitizeHTML } from '@Services/utility-helpers';
import { probeResource, requestTokenViaIframe } from '@Services/auth-service';
import './VideoJSPlayer.scss';

/**
 * Display authentication dialog and handle login interaction for IIIF resources
 * protected by IIIF Auth 2.0 spec. 
 * It is rendered over the VideoJS player when a Canvas has an AuthProbeService2 defined.
 * The flow is as follows;
 * 1. On page load: probe the resource without a token to determine if login is required
 * 2. Login: performs the authnentication flow based on the access service profile and gets a token
 * 3. On token received: re-probe with token to confirm authorization, or show error if probe fails
 * @param {Object} props
 * @param {Object} props.authService
 * @param {String} props.authStatus
 * @param {Function} props.onTokenReceived
 * @param {Function} props.onAuthStatus
 */
function AuthOverlay({ authService, authStatus, onTokenReceived, onAuthStatus }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginTabRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const { probe, accessService, tokenService } = authService;

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
          const errHeading = heading ? getLabelValue(heading)
            : probe?.heading ? getLabelValue(probe?.errorHeading) : 'Something went wrong';
          const errNote = note ? getLabelValue(note)
            : probe?.errorNote ? getLabelValue(probe?.errorNote) : 'Could not confirm authorization with token.';
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
        // Reset button state immediately so the button is not stuck on 'Waiting...'
        setIsLoggingIn(false);
        acquireToken();
      }
    }, 500);
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

  const confirmLabel = getLabelValue(accessService?.confirmLabel) || 'Log in';
  const loginLabel = getLabelValue(accessService?.label) || 'Login';
  const headingText = getLabelValue(accessService?.heading) ?? null;
  const noteText = getLabelValue(accessService?.note) ?? null;

  // Do not show the auth overlay when auth status doesn't indicate that login is required
  if (authStatus === 'authorized' || authStatus === 'idle' || authStatus === 'probing' || authStatus === 'cancelled') {
    return null;
  }

  return (
    <div className='ramp--auth-overlay' data-testid='auth-overlay' role='region' aria-label={loginLabel}>
      <div className='ramp--auth-overlay__content'>
        {errorMessage ? (
          <>
            {errorMessage.heading && (
              <div className='ramp--auth-overlay__header error'>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMessage.heading) }} />
              </div>
            )}
            {errorMessage.note && (
              <div className='ramp--auth-overlay__body'>
                <p className='ramp--auth-overlay__error-note' dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMessage.note) }} />
              </div>
            )}
          </>
        ) : (
          <>
            {headingText && (
              <div className='ramp--auth-overlay__header'>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(headingText) }} />
              </div>
            )}
            <div className='ramp--auth-overlay__body'>
              <p className='ramp--auth-overlay__label' dangerouslySetInnerHTML={{ __html: sanitizeHTML(loginLabel) }} />
              {noteText && (
                <p className='ramp--auth-overlay__note' dangerouslySetInnerHTML={{ __html: sanitizeHTML(noteText) }} />
              )}
            </div>
          </>
        )}
        {authStatus != 'error' && (
          <div className='ramp--auth-overlay__actions'>
            <button className='ramp--auth-overlay__login-btn' onClick={handleLogin} disabled={isLoggingIn} data-testid='auth-login-btn'>
              {isLoggingIn ? 'Waiting…' : confirmLabel}
            </button>
            <button className='ramp--auth-overlay__cancel-btn' onClick={handleCancel} data-testid='auth-cancel-btn'>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div >
  );
}

AuthOverlay.propTypes = {
  authService: PropTypes.shape({
    probe: PropTypes.object.isRequired,
    accessService: PropTypes.object,
    tokenService: PropTypes.object,
  }).isRequired,
  authStatus: PropTypes.string.isRequired,
  onTokenReceived: PropTypes.func.isRequired,
  onAuthStatus: PropTypes.func.isRequired,
};

export default AuthOverlay;
