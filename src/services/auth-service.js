/**
 * Probe a resource with a probe service defined with type='AuthProbeService2'. The
 * response indicates whether the resource requires authentication.
 * When token is provided, it is sent in the Authorization Header as a Bearer token to
 * confirm authorization.
 * https://iiif.io/api/auth/2.0/#probe-service-request
 * @param {String} probeUrl URL of the AuthProbeService2
 * @param {String} token access token from AuthAccessTokenService2 if exists
 * @returns {Promise<Object>} { status: Number, heading: Object, note: Object, substitute: Array, authIsExternal: Boolean }
 */
export async function probeResource(probeUrl, token = null) {
  const headers = new Headers({ 'Accept': 'application/json' });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const requestOptions = { headers };
  const response = await fetch(probeUrl, requestOptions);

  /* Avalon reuses the media resource's HLS manifest endpoint as the probe service 'id',
  rather than a dedicated service endpoint for 'AuthProbeService2'.
  This endpoint action doesn't render an spec-compliant 'AuthProbeResult2' JSON body on GET. It behaves
  as follows:
  - with no token, it either streams the manifest (if the request is authorized without a token) or responds 401
  - with a token it renders a JSON without a body for a success/failed auth request
  But, a HEAD request is handled uniformly across the board, returning success/fail via status code alone.
  This fallback to the HEAD request whenever GET doesn't give a usable status, helps to determine the auth
  status of a given resource without triggering the auth prompt when Ramp is used within Avalon. */
  if (response.status === 406) {
    const headResponse = await fetch(probeUrl, { ...requestOptions, method: 'HEAD' });
    // 'authIsExternal' signals that auth status was derived a fallback HEAD response
    return { status: headResponse.status, authIsExternal: true };
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    // For non-JSON response, return empty body
  }
  return { status: response.status, ...body };
}

/**
 * Request an access token from a token service with type='AuthAccessTokenService2'
 * using a hidden iframe and postMessage API.
 * https://iiif.io/api/auth/2.0/#access-token-service-request
 * @param {String} tokenServiceUrl URL of the AuthAccessTokenService2
 * @param {String} origin window.location.origin of the IIIF client
 * @returns {Promise<Object>} { accessToken: String, expiresIn: Number }
 */
export function requestTokenViaIframe(tokenServiceUrl, origin) {
  return new Promise((resolve, reject) => {
    // A random value to correlate the token service requests
    const messageId = generateMessageId();
    let iframe = null;
    let timeoutId = null;

    const expectedOrigin = new URL(tokenServiceUrl).origin;

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timeoutId);
      // Remove the iframe immediately after receiving the response
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      iframe = null;
    };

    const onMessage = (event) => {
      /* Validate event.origin against token service origin to prevent accepting
       messages from malicious origins */
      if (event.origin !== expectedOrigin) {
        reject(new Error('Invalid origin'));
      }

      const data = event.data;
      if (!data || (data.messageId && data.messageId !== messageId)) return;
      cleanup();
      if (data.type === 'AuthAccessTokenError2' || data.error) {
        reject(new Error(data.profile || data.error || 'Token request failed'));
      } else if (data.accessToken) {
        resolve({ accessToken: data.accessToken, expiresIn: data.expiresIn });
      } else {
        reject(new Error('Unexpected token service response'));
      }
    };

    // Register an event listener to listen for dispatched messages via postMessage API
    window.addEventListener('message', onMessage);

    // Set a timeout for token service response to prevent hanging if something goes wrong
    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Token service timed out'));
    }, 10000);

    iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display:none;width:0;height:0;border:0');
    iframe.setAttribute('title', '');
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const url = new URL(tokenServiceUrl);
    url.searchParams.set('messageId', messageId);
    url.searchParams.set('origin', origin);
    iframe.src = url.toString();
  });
}

/**
 * Request logout from the logout service with type='AuthLogoutService2'.
 * According to the IIIF Auth 2.0 spec, the logout action presents the results of a
 * GET request on the logout service’s URI in a separate tab/window with an address bar.
 * https://iiif.io/api/auth/2.0/#logout-interaction
 * @param {String} logoutServiceId URL of the AuthLogoutService2
 */
export function requestLogout(logoutServiceId) {
  window.open(logoutServiceId, '_blank');
}

/**
 * Generate a random message ID for correlating postMessage responses
 * @returns {String} randomly generated, 36 character long v4 UUID
 */
function generateMessageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
}
