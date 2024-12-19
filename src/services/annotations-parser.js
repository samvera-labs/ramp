import { getCanvasId } from "./iiif-parser";
import { parseTranscriptData } from "./transcript-parser";
import {
  getLabelValue, getMediaFragment, handleFetchErrors,
  parseTimeStrings, sortAnnotations
} from "./utility-helpers";

/**
 * Parse annotation sets relevant to the current Canvas in a
 * given Manifest.
 * If the AnnotationPage contains linked resources as annotations,
 * returns information related to the linked resource.
 * If the AnnotationPage contains TextualBody type annotations,
 * returns information related to each text annotation.
 * @param {Object} manifest
 * @param {Number} canvasIndex 
 * @returns {Array}
 */
export function parseAnnotationSets(manifest, canvasIndex) {
  let canvas = null;
  let annotationSets = [];

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return null;
  }

  const canvases = manifest.items;
  if (canvases?.length != 0 && canvases[canvasIndex] != undefined) {
    canvas = canvases[canvasIndex];

    const annotations = canvas.annotations;
    const duration = Number(canvas.duration);

    annotationSets = parseAnnotationPages(annotations, duration);
    return { canvasIndex, annotationSets };
  } else {
    return null;
  }
};

/**
 * Fetch and parse linked AnnotationPage json file
 * @function parseExternalAnnotationPage
 * @param {String} url URL of the linked AnnotationPage .json
 * @param {Number} duration Canvas duration
 * @returns {Object} JSON object for the annotations
 * 
 */
export async function parseExternalAnnotationPage(url, duration) {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:\/?#[\]@!$&'()*+,;=]*)?\.json$/;

  // Validate given URL
  if (url == undefined || url.match(urlRegex) == null) {
    return [];
  } else {
    let fileData = null;

    // get file type
    await fetch(url)
      .then(handleFetchErrors)
      .then(function (response) {
        fileData = response;
      })
      .catch((error) => {
        console.error(
          'annotations-parser -> parseExternalAnnotationPage() -> fetching transcript -> ',
          error
        );
        return [];
      });

    if (fileData == null) {
      return [];
    } else {
      try {
        const annotationPage = await fileData.json();
        const annotations = parseAnnotationPages([annotationPage], duration);
        return annotations;
      } catch (e) {
        console.error(
          'annotations-parser -> parseExternalAnnotationPage() -> Error: parsing AnnotationPage at, ',
          url
        );
        return [];
      }
    }
  }
}

/**
 * Parse a annotations in a given list of AnnotationPage objects.
 * @function parseAnnotationPage
 * @param {Array} annotationPages AnnotationPage from either Canvas or linked .json
 * @param {Number} duration Canvas duration
 * @returns {Array<Object>} a parsed list of annotations in the AnnotationPage
 * [{ label: String, items: Array<Object> }]
 */
function parseAnnotationPages(annotationPages, duration) {
  let annotationSets = [];
  if (annotationPages?.length > 0 && annotationPages[0].type === 'AnnotationPage') {
    annotationPages.map((annotation) => {
      if (annotation.type === 'AnnotationPage') {
        let annotationSet = { label: getLabelValue(annotation.label) };
        if (annotation.items?.length > 0) {
          if (isExternalAnnotation(annotation.items[0]?.body)) {
            annotation.items.map((item) => {
              const { body, id, motivation, target } = item;
              const annotationMotivation = Array.isArray(motivation) ? motivation : [motivation];
              annotationSet = {
                ...parseAnnotationBody(body, annotationMotivation)[0],
                linkedResource: true,
                canvasId: target,
                id: id,
                motivation: annotationMotivation,
              };
              annotationSets.push(annotationSet);
            });
          } else {
            annotationSet.items = parseAnnotationItems(annotation.items, duration);
            annotationSets.push(annotationSet);
          }
        } else {
          annotationSet.url = annotation.id;
          annotationSet.format = 'application/json';
          annotationSets.push(annotationSet);
        }
      }
    });
  }
  return annotationSets;
}

/**
 * Determine whether a given Annotation has a linked resource or
 * a TextualBody with text values in its 'body' property.
 * @function isExternalAnnotaion
 * @param {Array} annotationBody array of 'body' in Annotation
 * @returns {Boolean}
 */
function isExternalAnnotation(annotationBody) {
  if (!Array.isArray(annotationBody)) annotationBody = [annotationBody];

  return annotationBody.map((body) => {
    return body.type != 'TextualBody';
  }).reduce((acc, current) => acc && current,
    true);
}

/**
 * Parse each Annotation in a given AnnotationPage resource
 * @function parseAnnotationItems
 * @param {Array} annotations list of annotations from AnnotationPage
 * @param {Number} duration Canvas duration
 * @returns {Array} array of JSON objects for each Annotation
 * [{ 
 *  motivation: Array<String>, 
 *  id: String, 
 *  times: { start: Number, end: Number || undefined }, 
 *  canvasId: URI, 
 *  value: [ return type of parseTextualBody() ]
 * }]
 */
export function parseAnnotationItems(annotations, duration) {
  if (annotations == undefined || annotations?.length == 0) {
    return [];
  }
  let items = [];
  annotations.map((annotation) => {
    let canvasId, times;
    if (typeof annotation?.target === 'string') {
      canvasId = getCanvasId(annotation.target);
      times = getMediaFragment(annotation.target, duration);
    } else {
      // Might want to re-visit based on the implementation changes in AVAnnotate manifests
      const { source, selector } = annotation?.target;
      canvasId = source.id;
      times = parseSelector(selector, duration);
    }
    const motivations = Array.isArray(annotation.motivation)
      ? annotation.motivation : [annotation.motivation];
    items.push({
      motivation: motivations,
      id: annotation.id,
      time: times,
      canvasId,
      value: parseAnnotationBody(annotation.body, motivations),
    });
  });

  // Sort by start time of annotations
  items = sortAnnotations(items);
  return items;
};

/**
 * Parse different types of temporal selectors given in an Annotation
 * @function parseSelector
 * @param {Object} selector Selector object from an Annotation
 * @param {Number} duration Canvas duration
 * @returns {Object} start, end times of an Annotation
 */
function parseSelector(selector, duration) {
  const selectorType = selector.type;
  let times = {};
  switch (selectorType) {
    case 'FragmentSelector':
      times = parseTimeStrings(selector.value.split('t=')[1], duration);
      break;
    case 'PointSelector':
      times = { start: Number(selector.t), end: undefined };
      break;
    // FIXME:: Remove this, as this is an invalid format from previous AVAnnotate
    case 'RangeSelector':
      times = parseTimeStrings(selector.t);
      break;
  }
  return times;
};

/**
 * Parse value of a TextualBody into a JSON object
 * @function parseTextualBody
 * @param {Object} textualBody TextualBody type object
 * @param {Array} motivations motivation(s) of Annotation/AnnotationPage
 * @returns {Object} JSON object for TextualBody value
 * { format: String, purpose: Array<String>, value: String }
 */
function parseTextualBody(textualBody, motivations) {
  let annotationBody = {};
  // List of motivations that is displayed as text in the UI
  const textualMotivations = ['commenting', 'supplementing'];
  if (textualBody) {
    let purpose = textualBody.purpose ? textualBody.purpose : textualBody.motivation;
    if (purpose == undefined && textualMotivations.some(m => motivations.includes(m))) {
      // Filter only the motivations that are displayed as texts
      purpose = motivations.filter((m) => textualMotivations.includes(m));
    }
    annotationBody = {
      format: textualBody.format,
      /**
       * Use purpose instead of motivation, as it is specific to 'TextualBody' type.
       * 'purpose'/'motivation' can have 0 or more values.
       * Reference: https://www.w3.org/TR/annotation-model/#motivation-and-purpose
       */
      purpose: Array.isArray(purpose) ? purpose : [purpose],
      value: textualBody.value,
    };
  }
  return annotationBody;
}

/**
 * Parse 'body' of an Annotation into a JSON object.
 * @function parseAnnotationBody
 * @param {Array || Object} annotationBody body property of an Annotation
 * @param {Array} motivations motivation(s) of Annotation/AnnotationPage
 */
function parseAnnotationBody(annotationBody, motivations) {
  if (!Array.isArray(annotationBody)) {
    annotationBody = [annotationBody];
  }

  let values = [];
  annotationBody.map((body) => {
    const type = body.type;
    switch (type) {
      case 'TextualBody':
        values.push(parseTextualBody(body, motivations));
        break;
      case 'Text':
        values.push({
          format: body.format,
          label: getLabelValue(body.label),
          url: body.id,
        });
        break;
    }
  });
  return values;
}

/**
 * A wrapper function around 'parseTranscriptData()' from 'transcript-parser' module.
 * Converts the data from linked resources in annotations in a Manifest/Canvas 
 * into a format expected in the 'Annotations' component for displaying.
 * Parse linked resources (WebVTT, SRT, MS Doc, etc.) in a given Annotation
 * into a list of JSON objects to a format similar to annotations with
 * 'TextualBody' type in an AnnotationPage.
 * @function parseExternalAnnotationResource
 * @param {Object} annotation Annotation for the linked resource
 * @returns {Array} parsed data from a linked resource in the same format as
 * the return type of parseAnnotationItems() function.
 */
export async function parseExternalAnnotationResource(annotation) {
  const { canvasId, format, id, motivation, url } = annotation;
  const { tData } = await parseTranscriptData(url, format);
  return tData.map((data) => {
    const { begin, end, text } = data;
    return {
      canvasId,
      id,
      motivation,
      time: { start: begin, end },
      value: [{ format: 'text/plain', purpose: motivation, value: text }],
    };
  });
}

