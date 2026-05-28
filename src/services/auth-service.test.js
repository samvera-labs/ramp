import { requestTokenViaIframe } from './auth-service';

describe('auth-service', () => {
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

    afterEach(() => {
      jest.restoreAllMocks();
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
});
