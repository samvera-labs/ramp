import { getCanvasId } from "./iiif-parser";
import { parseTranscriptData } from "./transcript-parser";
import {
  getLabelValue, getMediaFragment, handleFetchErrors,
  identifySupplementingAnnotation,
  parseTimeStrings, sortAnnotations
} from "./utility-helpers";

// Global variable to store random tag colors for the current tags
let TAG_COLORS = [];

/**
 * Linked annotation file types with possible time synced annotations.
 * Assume application/json file types point to an external AnnotationPage resource.
 */
const TIME_SYNCED_FORMATS = ['text/vtt', 'text/srt', 'application/json'];

// Supported motivations for annotations
// Remove 'transcribing' once testing for Aviary manifests are completed.
export const SUPPORTED_MOTIVATIONS = ['commenting', 'supplementing', 'transcribing'];

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
              // Only add WebVTT, SRT, and JSON files as annotations
              const timeSynced = TIME_SYNCED_FORMATS.includes(body.format);
              if (timeSynced) {
                const annotationInfo = parseAnnotationBody(body, annotationMotivation)[0];
                if (annotationInfo != undefined) {
                  annotationSet = {
                    ...annotationInfo,
                    canvasId: target,
                    id: id,
                    motivation: annotationMotivation,
                  };
                  annotationSets.push(annotationSet);
                }
              }
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

  // Group timed annotations by start time
  items = groupAnnotationsByTime(items);

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
 * { format: String, purpose: Array<String>, value: String, tagColor: undefined || String }
 */
function parseTextualBody(textualBody, motivations) {
  let annotationBody = {};
  let tagColor;
  if (textualBody) {
    const { format, label, motivation, purpose, value } = textualBody;
    let annotationPurpose = purpose != undefined ? purpose : motivation;
    if (annotationPurpose == undefined && SUPPORTED_MOTIVATIONS.some(m => motivations.includes(m))) {
      // Filter only the motivations that are displayed as texts
      annotationPurpose = motivations.filter((m) => SUPPORTED_MOTIVATIONS.includes(m));
    }

    // If a label is given; combine label/value pairs to display
    const bodyValue = label != undefined
      ? `<strong>${getLabelValue(label)}</strong>: ${value}`
      : value;

    annotationBody = {
      format: format,
      /**
       * Use purpose instead of motivation, as it is specific to 'TextualBody' type.
       * 'purpose'/'motivation' can have 0 or more values.
       * Reference: https://www.w3.org/TR/annotation-model/#motivation-and-purpose
       */
      purpose: Array.isArray(annotationPurpose) ? annotationPurpose : [annotationPurpose],
      value: bodyValue,
    };
    if (annotationPurpose == ['tagging']) {
      const hasColor = TAG_COLORS.filter((c) => c.tag == value);
      if (hasColor?.length > 0) {
        tagColor = hasColor[0].color;
      } else {
        tagColor = generateColor(TAG_COLORS?.length > 0
          ? TAG_COLORS.map((c) => c.color)
          : []);
        TAG_COLORS.push({ tag: value, color: tagColor });
      }
      annotationBody.tagColor = tagColor;
    }
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
        const { format, id, label } = body;
        // Skip linked annotations that are captions in Avalon manifests
        let sType = identifySupplementingAnnotation(id);
        if (sType !== 2) {
          values.push({
            format: format,
            label: getLabelValue(label),
            url: id,
            /**
             * 'linkedResource' property helps to make parsing the choice in 
             * 'fetchAndParseLinkedAnnotations()' in AnnotationLayerSelect.
             */
            linkedResource: format != 'application/json',
          });
        }
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

/**
 * Generate a random color for annotation sets compliant with WCAG
 * 2.0 level AA for normat text
 * Reference: https://stackoverflow.com/q/43193341/4878529
 * @returns {String} HSL color code
 */
function generateColor(existingColors) {
  let newColor;
  const getNewColor = () => {
    const hue = Math.floor(Math.random() * 360);
    /**
     * saturation and lightness are set fixed values to acheive 
     * WCAG compliant contrast ratio of 4.5 for normal texts
     */
    const saturation = 80;
    const lightness = 90;
    newColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  getNewColor();

  // If the generated color is already used generate another color
  if (existingColors.length > 0 && existingColors.includes(newColor)) {
    getNewColor();
  } else {
    return newColor;
  }
};

/**
 * Group a given set of annotations by their start times.
 * Some manifest producers create separate annotations for same timestamp,
 * and these annotations are then need to be merged into one to accurately 
 * display them in the UI.
 * @param {Array} annotations a list of timed annotations
 * @returns {Array}
 */
function groupAnnotationsByTime(annotations) {
  let groupedAnnotations = annotations.reduce((grouped, annotation) => {
    if (annotation.time != undefined) {
      const start = annotation.time.start;
      // Create an element in the map for a new start time
      if (!grouped[start]) {
        grouped[start] = [];
        grouped[start].push(annotation);
      } else {
        // Insert current annotation's value into existing annotations
        const current = grouped[start][0];
        current.value.push(annotation.value[0]);
      }
    }
    return grouped;
  }, {});

  // Get only the annotations from the map
  const annotationArray = Object.values(groupedAnnotations).flat();
  return annotationArray;
}
