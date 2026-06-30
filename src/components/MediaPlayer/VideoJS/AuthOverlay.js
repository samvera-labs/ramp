import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getLabelValue, sanitizeHTML } from '@Services/utility-helpers';
import { probeResource, requestLogout, requestTokenViaIframe } from '@Services/auth-service';
import { SearchArrow, SignOutIcon, UserIcon } from '@Services/svg-icons';
import './VideoJSPlayer.scss';

/**
 * Display authentication dialog and handle login interaction for IIIF resources
 * protected by IIIF Auth 2.0 spec.
 * It is rendered over the VideoJS player when a Canvas has an AuthProbeService2 defined.
 * The flow is as follows;
 * 1. On page load: probe the resource without a token to determine if login is required
 * 2. Login: performs the authnentication flow based on the access service profile and gets a token
 * 3. On token received: re-probe with token to confirm authorization, or show error if probe fails
 * 4. On authorized: shows a persistent authenticated badge for video players with 'Log out' option when
 * there is a logout service with type='AuthLogoutService2'. Audio players show an equivalent control
 * in the player's contro-bar instead (see VideoJSAuthMenu custom component).
 * @param {Object} props
 * @param {Object} props.authService
 * @param {String} props.authStatus
 * @param {Boolean} props.isVideo
 * @param {Function} props.onTokenReceived
 * @param {Function} props.onAuthStatus
 * @param {Function} props.onLogout
 */
function AuthOverlay({ authService, authStatus, isVideo, onTokenReceived, onAuthStatus, onLogout }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const loginTabRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const badgeRef = useRef(null);

  const { probe, accessService, tokenService, logoutService, restricted } = authService;

  useEffect(() => {
    /* When the resource access is restricted without required access services, update auth status to 'error' in state and
    set 'errorMessage' in component state with probe's 'errorHeading' & 'errorNote' if they are defined. */
    if (restricted) {
      onAuthStatus('error');
      const restrictedHeading = getLabelValue(probe?.errorHeading) || 'Restricted content';
      const restrictedNote = getLabelValue(probe?.errorNote) || 'Authentication is not available for this resource.';
      setErrorMessage({ heading: restrictedHeading, note: restrictedNote });
      return;
    }
    // Otherwise, probe without token on page load and again after logout resets status to
    // 'idle' to determine whether login is required
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
  }, [authStatus]);

  // Close the logout menu on outside click or Escape, and restore focus to the badge button
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        badgeRef.current?.querySelector('button')?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event handlers
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

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
          const errHeading = getLabelValue(heading) || probe.errorHeading;
          const errNote = getLabelValue(note) || probe.errorNote;
          setErrorMessage({ heading: errHeading, note: errNote });
          onAuthStatus('error');
          setIsLoggingIn(false);
        }
      })
      .catch(() => {
        setErrorMessage({
          heading: tokenService.errorHeading, note: tokenService.errorNote,
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
    if (isLoggingIn) return;
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

  // Do not show the auth overlay when auth status doesn't indicate that login is required
  if (authStatus === 'idle' || authStatus === 'probing' || authStatus === 'cancelled') {
    return null;
  }

  if (authStatus === 'authorized') {
    /* When authenticated; display a persistent authenticated badge with a logout menu.
    Skip this if,
     - the current player is audio-only, as they show an equivalent control in the control-bar
     - the logoutService is undefined
    */
    if (!isVideo || !logoutService) {
      return null;
    }

    const handleLogout = () => {
      setMenuOpen(false);
      // Requires requestLogout to be called here for the new tab to open
      requestLogout(logoutService.id);
      onLogout();
    };

    return (
      <div className='ramp--auth-overlay__badge-container' ref={badgeRef}>
        <button
          className='ramp--auth-overlay__badge'
          onClick={() => setMenuOpen((mo) => !mo)}
          aria-haspopup='true' aria-expanded={menuOpen}
          aria-label={`Account menu for sign-out`}
        >
          <UserIcon />
          <span className='ramp--auth-overlay__badge-name'>Authenticated</span>
          <SearchArrow flip={menuOpen} />
        </button>
        {menuOpen && (
          <div className='ramp--auth-overlay__badge-menu' role='menu'>
            {logoutService.label && (
              <>
                <p className='ramp--auth-overlay__badge-menu-name'>{logoutService.label}</p>
                <div className='ramp--auth-overlay__badge-menu-divider' />
              </>
            )}
            <button
              className='ramp--auth-overlay__badge-menu-logout'
              onClick={handleLogout}
              role='menuitem'
            >
              <SignOutIcon /> Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  const { confirmLabel, label, heading, note } = accessService;
  return (
    <div className='ramp--auth-overlay' data-testid='auth-overlay' role='region' aria-label={label}>
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
            {heading && (
              <div className='ramp--auth-overlay__header' data-testid='auth-overlay-heading'>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />
              </div>
            )}
            <div className='ramp--auth-overlay__body'>
              <p className='ramp--auth-overlay__label' dangerouslySetInnerHTML={{ __html: sanitizeHTML(label) }} />
              {note && (
                <p className='ramp--auth-overlay__note' data-testid='auth-overlay-note' dangerouslySetInnerHTML={{ __html: sanitizeHTML(note) }} />
              )}
            </div>
          </>
        )}
        {(authStatus != 'error' && !restricted) && (
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
    logoutService: PropTypes.object,
    restricted: PropTypes.bool.isRequired,
  }).isRequired,
  authStatus: PropTypes.string.isRequired,
  isVideo: PropTypes.bool,
  onTokenReceived: PropTypes.func.isRequired,
  onAuthStatus: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};

export default AuthOverlay;
