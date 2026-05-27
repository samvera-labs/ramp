/**
 * Probe a resource with a probe service defined with type='AuthProbeService2'. The
 * response indicates whether the resource requires authentication.
 * When token is provided, it is sent in the Authorization Header as a Bearer token to
 * confirm authorization.
 * https://iiif.io/api/auth/2.0/#probe-service-request
 * @param {String} probeUrl URL of the AuthProbeService2
 * @param {String} token access token from AuthAccessTokenService2 if exists
 * @returns {Promise<Object>} { status: Number, heading: Object, note: Object, substitute: Array }
 */
export async function probeResource(probeUrl, token = null) {
  const headers = new Headers({ 'Accept': 'application/json' });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(probeUrl, { headers });
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
      if (event.origin !== expectedOrigin) return;

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
 * Generate a random message ID for correlating postMessage responses
 * @returns {String} randomly generated, 36 character long v4 UUID
 */
function generateMessageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
}
