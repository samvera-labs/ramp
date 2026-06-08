import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthOverlay from './AuthOverlay';
import * as authService from '@Services/auth-service';

jest.mock('dompurify', () => ({ sanitize: (html) => html }));
jest.mock('@Services/auth-service', () => ({
  probeResource: jest.fn(),
  requestTokenViaIframe: jest.fn(),
}));

const mockAccessService = {
  id: 'http://example.com/auth/login',
  profile: 'active',
  label: { en: ['Login Required'] },
  heading: { en: ['Please Log In'] },
  note: { en: ['This application requires that you log in with your account to view this content.'] },
  confirmLabel: { en: ['Log In'] },
};

const defaultAuthService = {
  probe: {
    id: 'http://example.com/auth/probe',
    errorHeading: { en: ['No access'] },
    errorNote: { en: ['You do not have permission'] },
  },
  accessService: mockAccessService,
  tokenService: {
    id: 'http://example.com/auth/token',
    errorHeading: { en: ['Something went wrong'] },
    errorNote: { en: ['Could not get a token.'] },
  },
  restricted: false,
};

describe('AuthOverlay', () => {
  const onTokenReceivedMock = jest.fn();
  const onAuthStatusMock = jest.fn();
  const props = {
    authService: defaultAuthService,
    onTokenReceived: onTokenReceivedMock,
    onAuthStatus: onAuthStatusMock,
  };

  afterEach(() => jest.clearAllMocks());

  describe('renders successfully', () => {
    test('when authStatus=\'login-required\'', () => {
      render(<AuthOverlay {...props} authStatus='login-required' />);
      expect(screen.queryByTestId('auth-overlay')).toBeInTheDocument();
    });

    test('when authStatus=\'error\'', () => {
      render(<AuthOverlay {...props} authStatus='error' />);
      expect(screen.getByTestId('auth-overlay')).toBeInTheDocument();
    });
  });

  describe('does not render', () => {
    test('when authStatus=\'authorized\'', () => {
      render(<AuthOverlay {...props} authStatus='authorized' />);
      expect(screen.queryByTestId('auth-overlay')).not.toBeInTheDocument();
    });

    test('when authStatus=\'idle\'', () => {
      /* Mock probeResource to return 200, so that auth overlay is not
       displayed with authStatus='authorizd' */
      authService.probeResource.mockResolvedValue({ status: 200 });
      render(<AuthOverlay {...props} authStatus='idle' />);
      expect(screen.queryByTestId('auth-overlay')).not.toBeInTheDocument();
    });

    test('when authStatus=\'probing\'', () => {
      render(<AuthOverlay {...props} authStatus='probing' />);
      expect(screen.queryByTestId('auth-overlay')).not.toBeInTheDocument();
    });
  });

  describe('renders the login', () => {
    describe('from accessService\'s', () => {
      beforeEach(() => {
        render(<AuthOverlay {...props} authStatus='login-required' />);
      });

      test('heading and label', () => {
        expect(screen.getByText('Please Log In')).toBeInTheDocument();
        expect(screen.getByText('Login Required')).toBeInTheDocument();
      });

      test('note', () => {
        expect(screen.getByText('Login Required')).toHaveClass('ramp--auth-overlay__label');
        expect(screen.getByText('This application requires that you log in with your account to view this content.'))
          .toBeInTheDocument();
        expect(screen.getByText('This application requires that you log in with your account to view this content.'))
          .toHaveClass('ramp--auth-overlay__note');
      });

      test('confirmLabel as login button text', () => {
        expect(screen.getByTestId('auth-login-btn')).toHaveTextContent('Log In');
      });
    });

    describe('restricted overlay (no login/cancel buttons) when', () => {
      test('accessService is missing; shows probe errorHeading and errorNote', () => {
        render(<AuthOverlay {...props} authStatus='login-required'
          authService={{ ...defaultAuthService, accessService: null, restricted: true }} />);

        expect(screen.getByText('No access')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-login-btn')).not.toBeInTheDocument();
        expect(screen.queryByTestId('auth-cancel-btn')).not.toBeInTheDocument();
      });

      test('tokenService is missing; shows probe errorHeading and errorNote', () => {
        render(<AuthOverlay {...props} authStatus='login-required'
          authService={{ ...defaultAuthService, tokenService: null, restricted: true }} />);

        expect(screen.getByText('No access')).toBeInTheDocument();
        expect(screen.getByText('You do not have permission')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-login-btn')).not.toBeInTheDocument();
        expect(screen.queryByTestId('auth-cancel-btn')).not.toBeInTheDocument();
      });

      test('accessService, tokenService, and probe error info are all missing; shows default heading and note', () => {
        render(<AuthOverlay {...props} authStatus='login-required'
          authService={{
            probe: { id: 'http://example.com/auth/probe' },
            accessService: null, tokenService: null, restricted: true
          }} />);

        expect(screen.getByText('Restricted content')).toBeInTheDocument();
        expect(screen.getByText('Authentication is not available for this resource.')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-login-btn')).not.toBeInTheDocument();
        expect(screen.queryByTestId('auth-cancel-btn')).not.toBeInTheDocument();
      });
    });
  });

  describe('probes resource on first render and', () => {
    test('updates authStatus=\'login-required\' in state when probe returns 401', async () => {
      authService.probeResource.mockResolvedValue({ status: 401 });
      render(<AuthOverlay {...props} authStatus='idle' />);
      await waitFor(() => {
        expect(onAuthStatusMock).toHaveBeenCalledWith('login-required');
      });
    });

    test('updates authStatus=\'authorized\' in state when probe returns 200', async () => {
      authService.probeResource.mockResolvedValue({ status: 200 });
      render(<AuthOverlay {...props} authStatus='idle' />);
      await waitFor(() => {
        expect(onAuthStatusMock).toHaveBeenCalledWith('authorized');
      });
    });
  });

  describe('re-probes to confirm authorization and', () => {
    const updatedProps = {
      ...props,
      authStatus: 'login-required',
      authService: { ...defaultAuthService, accessService: { ...mockAccessService, profile: 'kiosk' } }
    };
    test('updates state when probe returns 200 with token', async () => {
      // Mock token acquisition and successful probe
      authService.requestTokenViaIframe.mockResolvedValue({ accessToken: 'valid-token' });
      authService.probeResource.mockResolvedValue({ status: 200 });

      // Test token acquisition flow with profile='kiosk' to skip login tab tracking
      render(<AuthOverlay {...updatedProps} />);

      // Simulate login button click user action
      fireEvent.click(screen.getByTestId('auth-login-btn'));

      await waitFor(() => {
        expect(authService.probeResource).toHaveBeenCalledWith('http://example.com/auth/probe', 'valid-token');
        expect(onTokenReceivedMock).toHaveBeenCalledWith('valid-token');
        expect(onAuthStatusMock).toHaveBeenCalledWith('authorized');
      });
    });

    test('displays an error when probe 401', async () => {
      authService.requestTokenViaIframe.mockResolvedValue({ accessToken: 'bad-token' });
      authService.probeResource.mockResolvedValue({
        status: 401,
        heading: { en: ['Something went wrong'] },
        note: { en: ['Could not get a token.'] },
      });
      render(<AuthOverlay {...updatedProps} />);

      fireEvent.click(screen.getByTestId('auth-login-btn'));

      // Wait for the component to update with the error state
      await waitFor(() => {
        expect(onAuthStatusMock).toHaveBeenCalledWith('error');
      });
      expect(onTokenReceivedMock).not.toHaveBeenCalled();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Could not get a token.')).toBeInTheDocument();
    });
  });

  describe('login button', () => {
    let mockTab;
    beforeEach(() => {
      mockTab = { closed: false };
      jest.spyOn(window, 'open').mockReturnValue(mockTab);
      authService.probeResource.mockResolvedValue({ status: 200 });
    });

    test('is rendered', () => {
      render(<AuthOverlay {...props} authStatus='login-required' />);
      expect(screen.queryByTestId('auth-login-btn')).toBeInTheDocument();
    });

    test('opens a login tab for profile=\'active\'', async () => {
      authService.requestTokenViaIframe.mockResolvedValue({ accessToken: 'new-token' });

      render(<AuthOverlay {...props} authStatus='login-required' />);
      fireEvent.click(screen.getByTestId('auth-login-btn'));

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('http://example.com/auth/login'),
        '_blank'
      );

      // Token is requested via requestTokenViaIframe() after the tab is closed
      mockTab.closed = true;
      await waitFor(() => {
        expect(authService.requestTokenViaIframe).toHaveBeenCalledWith(
          'http://example.com/auth/token', window.location.origin
        );
        expect(onTokenReceivedMock).toHaveBeenCalledWith('new-token');
      });
    });

    test('changes button text for relevant auth flow state', async () => {
      render(<AuthOverlay {...props} authStatus='login-required' />);

      // Button text changes to 'Waiting...' while waiting in the new tab for login
      fireEvent.click(screen.getByTestId('auth-login-btn'));
      expect(screen.getByTestId('auth-login-btn')).toHaveTextContent('Waiting…');

      // Button text resets to 'Log In' when tab is closed
      mockTab.closed = true;
      await waitFor(() => {
        expect(screen.getByTestId('auth-login-btn')).toHaveTextContent('Log In');
      });
    });

    test('requests token for without tab for profile=\'kiosk\'', async () => {
      authService.requestTokenViaIframe.mockResolvedValue({ accessToken: 'kiosk-token' });

      render(<AuthOverlay {...props} authStatus='login-required'
        authService={{
          ...defaultAuthService,
          accessService: { ...mockAccessService, profile: 'kiosk' },
        }} />);

      fireEvent.click(screen.getByTestId('auth-login-btn'));

      // Access token is requested without opening a new tab for login
      expect(window.open).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(onTokenReceivedMock).toHaveBeenCalledWith('kiosk-token');
      });
    });
  });

  describe('cancel button', () => {
    test('is rendered', () => {
      render(<AuthOverlay {...props} authStatus='login-required' />);
      expect(screen.queryByTestId('auth-cancel-btn')).toBeInTheDocument();
    });

    test('updates state with authStatus=\'cancelled\' when clicked', () => {
      render(<AuthOverlay {...props} authStatus='login-required' />);
      fireEvent.click(screen.getByTestId('auth-cancel-btn'));
      expect(onAuthStatusMock).toHaveBeenCalledWith('cancelled');
    });

    test('does not render the overlay when authStatus=\'cancelled\'', () => {
      render(<AuthOverlay {...props} authStatus='cancelled' />);
      expect(screen.queryByTestId('auth-overlay')).not.toBeInTheDocument();
    });
  });
});
