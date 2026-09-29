const PRESENTATION_4_CONTEXT = 'http://iiif.io/api/presentation/4/context.json';
const PLACEHOLDER_PROP = { '3': 'placeholderCanvas', '4': 'placeholderContainer' };
const ACCOMPANYING_PROP = { '3': 'accompanyingCanvas', '4': 'accompanyingContainer' };

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
 * Get the accompanying property name for a Canvas/Timeline or Annotation based on the
 * IIIF Presentation API version of the given Manifest.
 * - Presentation v3 -> 'accompanyingCanvas'
 * - Presentation v4 -> 'accompanyingContainer'
 * @function VersionParser#getAccompanyingProp
 * @param {String} version Presentation API version, as returned by getIIIFAPIVersion
 * @returns {String} 'accompanyingCanvas' | 'accompanyingContainer'
 */
export function getAccompanyingProp(version) {
  return ACCOMPANYING_PROP[version] || ACCOMPANYING_PROP['3'];
}

/**
 * Check if a motivation string value is contained in the 'motivation' read from the
 * IIIF resource in Manifest
 * @function VersionParser#hasMotivation
 * @param {String|Array} motivation 'motivation' value read off an Annotation
 * @param {String} expected given value to be checked whether it is included
 * @returns {Array}
 */
export function hasMotivation(motivation, expected) {
  const motivations = normalizeValues(motivation);
  return motivations.includes(expected);
}

/**
 * Normalize a value read off of an Annotation/AnnotationPage to an array. This allows to
 * read and parse properties in IIIF resources that have different formats in different
 * IIIF Presentation versions,
 * - 'motivation' -> in v3 it is conventionally a single String while it MUST be an array in v4
 * - 'provides' -> introduced in v4 and absent in v3 and in Annotation in v4 that haven't set it
 * @function VersionParser#normalizeValues
 * @param {String|Array} values values read off a IIIF resource
 * @returns 
 */
export function normalizeValues(values) {
  return [].concat(values ?? []);
}
