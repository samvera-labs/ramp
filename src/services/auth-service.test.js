import { probeResource, requestTokenViaIframe } from './auth-service';

describe('auth-service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('requestTokenViaIframe()', () => {
    const tokenServiceUrl = 'http://auth.example.com/token';
    const origin = 'http://example.com/ramp';
    const fixedMessageId = 'test-message-id-1234';
    let fakeIframe;
    beforeEach(() => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(fixedMessageId);
      fakeIframe = { src: '', parentNode: document.body, setAttribute: jest.fn() };
      jest.spyOn(document, 'createElement').mockReturnValueOnce(fakeIframe);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    });

    test('resolves with accessToken when token service request is successful', async () => {
      const promise = requestTokenViaIframe(tokenServiceUrl, origin);

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'http://auth.example.com',
        data: {
          '@context': 'http://iiif.io/api/auth/2/context.json',
          type: 'AuthAccessToken2',
          accessToken: 'test-token-abc',
          expiresIn: 300,
          messageId: fixedMessageId,
        },
      }));

      const result = await promise;
      expect(result.accessToken).toBe('test-token-abc');
      expect(result.expiresIn).toBe(300);
    });

    test('rejects when the token service returns an error message', async () => {
      const promise = requestTokenViaIframe(tokenServiceUrl, origin);

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'http://auth.example.com',
        data: {
          type: 'AuthAccessTokenError2',
          profile: 'invalidRequest',
          messageId: fixedMessageId,
        },
      }));

      await expect(promise).rejects.toThrow('invalidRequest');
    });

    test('rejects when the token service with mismatched origin', async () => {
      const promise = requestTokenViaIframe(tokenServiceUrl, origin);

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'http://malicious.example.com',
        data: { accessToken: 'not-real-token', messageId: fixedMessageId },
      }));

      await expect(promise).rejects.toThrow('Invalid origin');
    });

    test('sets messageId and origin query params on the iframe src', async () => {
      const promise = requestTokenViaIframe(tokenServiceUrl, origin);

      window.dispatchEvent(new MessageEvent('message', {
        origin: 'http://auth.example.com',
        data: {
          type: 'AuthAccessToken2',
          accessToken: 'access-token',
          messageId: fixedMessageId
        },
      }));
      await promise;

      const iframeSrc = new URL(fakeIframe.src);
      expect(iframeSrc.searchParams.get('messageId')).toBe(fixedMessageId);
      expect(iframeSrc.searchParams.get('origin')).toBe(origin);
    });
  });

  describe('probeResource()', () => {
    describe('sends a GET request to the probe URL', () => {
      test('without auth header when token is null', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          status: 401,
          json: jest.fn().mockResolvedValue({ errorHeading: { en: ['No access'] } }),
        });

        const result = await probeResource('http://example.com/probe', null);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = fetch.mock.calls[0];
        expect(url).toBe('http://example.com/probe');
        expect(options.headers.get('Authorization')).toBeNull();
        expect(result.status).toBe(401);
      });

      test('with auth header when token is provided', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValue({}),
        });

        await probeResource('http://example.com/probe', 'auth-token');

        const [, options] = fetch.mock.calls[0];
        expect(options.headers.get('Authorization')).toBe('Bearer auth-token');
      });
    });

    describe('return status', () => {
      test('200 and body on success', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue({ type: 'AuthProbeResult2', substitute: [] }),
        });

        const result = await probeResource('http://example.com/probe', 'token');
        expect(result.status).toBe(200);
        expect(result.substitute).toEqual([]);
        expect(result.type).toBe('AuthProbeResult2');
      });

      test('401 and empty body when response is not JSON', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          status: 401
        });

        const result = await probeResource('http://example.com/probe', null);
        expect(result.status).toBe(401);
      });
    });
  });
});
