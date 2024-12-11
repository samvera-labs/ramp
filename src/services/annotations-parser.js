import { getCanvasId } from "./iiif-parser";
import { getLabelValue, getMediaFragment, parseTimeStrings } from "./utility-helpers";

export function parseAnnotationSets(manifest, canvasIndex) {
  let canvas = null;
  let annotationSets = [];

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return null;
  }

  // return an error when the given Manifest doesn't have any Canvas(es)
  const canvases = manifest.items;
  if (canvases?.length != 0 && canvases[canvasIndex] != undefined) {
    canvas = canvases[canvasIndex];

    const annotations = canvas.annotations;
    const duration = Number(canvas.duration);

    if (annotations?.length > 0 && annotations[0].type === 'AnnotationPage') {
      annotations.map((annotation) => {
        if (annotation.type === 'AnnotationPage') {
          let annotationSet = { label: getLabelValue(annotation.label) };
          if (annotation.items?.length > 0) {
            annotationSet.items = parseAnnotationItems(annotation.items, duration);
          } else {
            annotationSet.url = annotation.id;
          }
          annotationSets.push(annotationSet);
        }
      });
    }
  }

  return { canvasIndex, annotationSets };
};

/**
 * Parse each Annotation in a given AnnotationPage resource
 * @param {Array} annotations list of annotations from AnnotationPage
 * @param {Number} duration Canvas duration
 * @returns {Array} array of JSON objects for each Annotation
 * [{ 
 *  motivation: Array<String>, 
 *  id: String, 
 *  times: { start: Number, end: Number || undefined }, 
 *  canvasId: URI, 
 *  body: [ return type of parseTextualBody() ]
 * }]
 */
export function parseAnnotationItems(annotations, duration) {
  if (annotations == undefined || annotations?.length == 0) {
    return [];
  }
  let items = [];
  annotations.map((annotation) => {
    let canvasId, times;
    if (typeof annotation.target === 'string') {
      canvasId = getCanvasId(annotation.target);
      times = getMediaFragment(annotation.target, duration);
    } else {
      // Might want to re-visit based on the implementation changes in AVAnnotate manifests
      const { source, selector } = annotation.target;
      canvasId = source.id;
      times = parseSelector(selector, duration);
    }
    items.push({
      motivation: Array.isArray(annotation.motivation)
        ? annotation.motivation : [annotation.motivation],
      id: annotation.id,
      times: times,
      canvasId,
      body: parseAnnotationBody(annotation.body)
    });
  });

  // Sort by start time of annotations
  items.sort((a, b) => a.times?.start - b.times?.start);
  return items;
};

/**
 * Parse different types of temporal selectors given in an Annotation
 * @param {Object} selector Selector object from an Annotation
 * @param {Number} duration Canvas duration
 * @returns {Object} start, end times of an Annotation
 */
function parseSelector(selector, duration) {
  const selectorType = selector.type;
  let times;
  switch (selectorType) {
    case 'FragmentSelector':
      times = parseTimeStrings(selector.value.split('t=')[1], duration);
      break;
    case 'PointSelector':
      times = { start: Number(selector.t), end: undefined };
      break;
    default:
      break;
  }
  return times;
};

/**
 * Parse value of a TextualBody into a JSON object
 * @param {Object} textualBody TextualBody type object
 * @returns {Object} JSON object for TextualBody value
 * { format: String, purpose: Array<String>, value: String }
 */
function parseTextualBody(textualBody) {
  const purpose = textualBody.purpose ? textualBody.purpose : textualBody.motivation;
  const annotationBody = {
    format: textualBody.format,
    /**
     * Use purpose instead of motivation, as it is specific to 'TextualBody' type.
     * 'purpose'/'motaivation' can have 0 or more values.
     * Reference: https://www.w3.org/TR/annotation-model/#motivation-and-purpose
     */
    purpose: Array.isArray(purpose) ? purpose : [purpose],
    value: textualBody.value,
  };
  return annotationBody;
}

/**
 * Parse 'body' of an Annotation into a JSON object.
 * @param {Array || Object} annotationBody body property of an Annotation
 */
function parseAnnotationBody(annotationBody) {
  if (!Array.isArray(annotationBody)) {
    annotationBody = [annotationBody];
  }

  let values = [];
  annotationBody.map((body) => {
    const type = body.type;
    switch (type) {
      case 'TextualBody':
        values.push(parseTextualBody(body));
        break;
      case 'Text':
        values.push({
          format: body.format,
          value: getLabelValue(body.label),
          url: body.id,
          isExternal: true,
        });
        break;
      default:
        break;
    }
  });
  return values;
}
