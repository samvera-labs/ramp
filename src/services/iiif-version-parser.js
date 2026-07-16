const PRESENTATION_4_CONTEXT = 'http://iiif.io/api/presentation/4/context.json';
const PLACEHOLDER_PROP = { '3': 'placeholderCanvas', '4': 'placeholderContainer' };

/**
 * Determine the Presentation API version of a given Manifest from its
 * '@context' property. Defaults to '3' when '@context' is missing or
 * unrecognized. This is based on the fact that, Ramp initially only
 * supported v3 without restrictions.
 * @function VersionParser#getIIIFAPIVersion
 * @param {Object} manifest IIIF Manifest
 * @returns {String} IIIF Presentation API version ('3' or '4')
 */
export function getIIIFAPIVersion(manifest) {
  const context = manifest?.['@context'];
  const contexts = [].concat(context ?? []);
  return contexts.includes(PRESENTATION_4_CONTEXT) ? '4' : '3';
}

/**
 * Get the placeholder property name for a Canvas/Timeline or Annotation based on the
 * IIIF Presentation API version of the given Manifest.
 * - Presentation v3 -> 'placeholderCanvas'
 * - Presentation v4 -> 'placeholderContainer'
 * @function VersionParser#getPlaceholderProp
 * @param {String} version Presentation API version, as returned by getIIIFAPIVersion
 * @returns {String} 'placeholderCanvas' | 'placeholderContainer'
 */
export function getPlaceholderProp(version) {
  return PLACEHOLDER_PROP[version] || PLACEHOLDER_PROP['3'];
}

/**
 * Normalize an Annotation/AnnotationPage's 'motivation' to an array and if an expected
 * motivation value is given check for its existence. Otherwise return the normalized
 * motivation vlaues. This allows to read and parse 'motivation' values for both Presentations
 * v3 and v4;
 * - in Presentation v3 'motivation' is conventionally a single String (e.g. 'painting')
 * - in Presentation v4 'motivation' is required to be an Array of strings (e.g. ['painting'])
 * @function VersionParser#normalizeMotivation
 * @param {String|Array} motivation 'motivation' value read off an Annotation
 * @param {String|Null} expected given value to be checked whether it is included
 * @returns {Array}
 */
export function resolveMotivation(motivation, expected = null) {
  const motivations = [].concat(motivation ?? []);
  if (expected != null) {
    return motivations.includes(expected);
  }
  return motivations;
}
