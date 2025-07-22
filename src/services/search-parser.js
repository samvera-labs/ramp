import { Annotation } from 'manifesto.js';
import { getCanvasId } from '@Services/iiif-parser';
import { getMediaFragment, groupBy } from '@Services/utility-helpers';
import { TRANSCRIPT_CUE_TYPES, TRANSCRIPT_MIME_TYPES } from './transcript-parser';

/**
 * Parse the content search response from the search service, and then use it to calculate
 * number of search hits for each transcripts, and create a list of matched transcript
 * lines for the search in the current transcript
 * @param {Object} response JSON response from content search API
 * @param {String} query search query from transcript search
 * @param {Array} trancripts content of the displayed transcript with ids
 * @param {Object} selectedTranscript url and timed/non-timed info of the selected transcript
 * @param {Array} canvasTranscripts transcripts info for the current canvas
 * @returns a list of matched transcript lines for the current search
 */
export const parseContentSearchResponse = (response, query, trancripts, selectedTranscript, canvasTranscripts) => {
  if (!response || response === undefined) return [];

  let hitCounts = [];
  let searchHits = [];

  if (response.items?.length > 0) {
    let items = response.items;
    items.map((item) => {
      const anno = new Annotation(item);
      // Exclude annotations without supplementing motivation
      if (anno.getMotivation() != 'supplementing') return;

      const target = anno.getTarget();
      const targetURI = getCanvasId(target);
      const value = anno.getBody()[0].getProperty('value');
      const hitCount = getHitCountForCue(value, query, true);
      searchHits.push({ target, targetURI, value, hitCount });
    });
  }
  // Group search responses by transcript
  const allSearchHits = groupBy(searchHits, 'targetURI');

  // Get the timed transcript formats
  const timedTextFormats = [...TRANSCRIPT_MIME_TYPES.webvtt, ...TRANSCRIPT_MIME_TYPES.srt];

  // Calculate search hit count for each transcript in the Canvas
  for (const [key, value] of Object.entries(allSearchHits)) {
    const fileFormat = canvasTranscripts.filter((ct) => ct.url == key)[0].format;
    const isTimed = timedTextFormats.includes(fileFormat);
    let searchHits = value;
    // For timed transcripts remove search response where target doesn't have media-fragments
    if (isTimed) {
      searchHits = value.filter((v) => v.target != v.targetURI);
    }
    hitCounts.push({
      transcriptURL: key,
      numberOfHits: searchHits.reduce((acc, a) => acc + a.hitCount, 0)
    });
  }

  let filteredSearchHits = allSearchHits[selectedTranscript.url];
  // Cleanup search hits based on the target, where target doesn't have 
  // media fragment information for timed transcript
  if (selectedTranscript.isTimed) {
    filteredSearchHits = filteredSearchHits.filter((s) => s.target != s.targetURI);
  }

  // Get all the matching transcript lines with the query in the current transcript
  const matchedTranscriptLines = getMatchedTranscriptLines(filteredSearchHits, query, trancripts);
  return { matchedTranscriptLines, hitCounts, allSearchHits };
};

/**
 * Create a list matched transcript lines for the current search for the displayed transcript
 * @param {Array} searchHits a list of matched transcript lines with ids from the current transcript
 * @param {String} query search query
 * @param {Array} transcripts list of all the transcript lines from the current transcript
 * @returns a list of matched transcrip lines in the current transcript
 */
export const getMatchedTranscriptLines = (searchHits, query, transcripts) => {
  const qStr = query.trim().toLocaleLowerCase();
  let transcriptLines = [];

  if (searchHits === undefined) return;

  let traversedIds = [];

  searchHits.map((item, index) => {
    let { target, value } = item;
    // Read time offsets and text of the search hit
    const timeRange = getMediaFragment(target);

    // Replace all HTML tags
    const mappedText = value.replace(/<\/?[^>]+>/gi, '');

    let start = 0, end = 0;
    let transcriptId = undefined;
    if (timeRange != undefined) {
      // For timed-text
      start = timeRange.start; end = timeRange.end;
      transcriptId = transcripts.findIndex((t) => t.begin == start && t.end == end);

      const queryText = qStr.match((/[a-zA-Z]+/gi))
        ? qStr.match((/[a-zA-Z]+/gi))[0]
        : qStr;
      const matchOffset = mappedText.toLocaleLowerCase().indexOf(queryText);

      if (matchOffset !== -1 && transcriptId != -1) {
        const match = addHighlightTags(value, transcripts[transcriptId].text, query);

        transcriptLines.push({
          tag: TRANSCRIPT_CUE_TYPES.timedCue,
          begin: start,
          end: end,
          id: transcriptId,
          match,
          matchCount: item.hitCount,
          text: value,
        });
      }
    } else {
      /**
       * For non timed text, there's no unique id to match the search response to the transcript
       * lines in the UI. So use filter() method instead of findIndex() method to get all matching
       * transcript lines in the display.
       * Use traversedIds array to remember the ids of already processed transcript lines in the list
       * to avoid duplication in the matches.
       */
      const hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
      traversedIds = hitsInfo.traversedIds;
      transcriptLines = [...transcriptLines, ...hitsInfo.hits];

      /**
       * When backend has a single block of text which is chuncked in the UI this helps to
       * traverse all transcript cues. 
       */
      while (index === searchHits.length - 1 && traversedIds?.length < transcripts.length) {
        const hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
        traversedIds = hitsInfo.traversedIds;
        transcriptLines = [...transcriptLines, ...hitsInfo.hits];
      }
    }
  });
  return transcriptLines;
};

/**
 * Build a list of matched indexed transcript lines from content search response.
 * In Avalon, docx and plain text files are chunked by paragraphs seperated by 2 or
 * more new line characters. So, depending on the way the file is formatted the search
 * response could include chunks of the text or the full text.
 * In the library (mammoth) used in Transcript component to display docx files; the text is chunked
 * into paragraphs seperated by one or more new line characters.
 * And the search response doesn't include any text styling in the docx files. Therefore the 
 * text with style information is reformatted to include text highlights from the search response.
 * This function uses the search response to calculate the hit counts and mark them for each indexed transcript
 * line in the front-end to get the correct counts.
 * @param {Array} transcripts indexed transcript text in UI
 * @param {String} mappedText matched text from content search
 * @param {String} query search query entered by the user
 * @param {Array} traversedIds already included transcript indices
 * @returns a list of matched transcript lines
 */
const matchPartsInUntimedText = (transcripts, mappedText, query, traversedIds) => {
  const escapedQ = buildRegexReadyText(query, true, false);
  // Get hit counts for the current text, ignore matches with query preceded by - or '
  let qRegex = new RegExp(String.raw`\b${escapedQ}\b`, 'gi');
  let matched = [];
  // Start from the next cue after the last traveresed cue in the transcript
  let lastTraversedId = traversedIds[traversedIds.length - 1] + 1 || 0;

  /**
   * For untimed text the search response text could be either,
   * - mapped one to one with the cue text in Transcript component
   * - include a part of the cue text in Transcript component
   * When none of these work check if the cue text contains the search query
   */
  for (let i = lastTraversedId; i < transcripts.length; i++) {
    const t = transcripts[i];
    const cleanedText = t.text.replace(/<\/?[^>]+>/gi, '').trim();
    const matches = [...cleanedText.matchAll(qRegex)];
    const mappedTextCleaned = mappedText.trim();

    if (mappedTextCleaned == cleanedText
      || (mappedTextCleaned.includes(cleanedText) && matches?.length > 0)) {
      t.matchCount = matches?.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else if (matches?.length > 0) {
      t.matchCount = [...mappedTextCleaned.matchAll(qRegex)]?.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else {
      traversedIds.push(t.id);
    }
  }

  let hits = [];
  matched.map((m) => {
    const value = addStyledHighlights(m.textDisplayed, query);
    const match = markMatchedParts(value, query, m.matchCount, true);
    hits.push({
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      begin: undefined,
      end: undefined,
      id: m.id,
      match,
      matchCount: m.matchCount,
      text: value
    });
  });
  return { hits, traversedIds };
};

/**
 * Generic function to mark the matched transcript text in the cue where the output has
 * <span class="ramp--transcript_highlight"></span> surrounding the matched parts
 * within the cue.
 * @param {String} text matched transcript text/cue
 * @param {String} query current search query
 * @param {Numner} hitCount number of hits returned in the search response
 * @param {Boolean} hasHighlight boolean flag to indicate text has <em> tags
 * @returns matched cue with HTML tags added for marking the hightlight 
 */
const markMatchedParts = (text, query, hitCount, hasHighlight = false) => {
  if (text === undefined || !text) return;
  let count = 0;
  let replacerFn = (match) => {
    const cleanedMatch = match.replace(/<\/?[^>]+>/gi, '');
    // Only add highlights to search hits in the search response
    if (count < hitCount) {
      count++;
      return `<span class="ramp--transcript_highlight">${cleanedMatch}</span>`;
    } else {
      return cleanedMatch;
    }
  };
  let queryFormatted = query;
  /**
   * Content search response for a phrase search like 'Mr. Bungle' gives the response
   * with highlights in the matched text as <em>Mr</em>. <em>Bungle</em>.
   * So reconstruct the search query in the UI to match this phrase in the response.
   */
  if (hasHighlight) {
    queryFormatted = buildRegexReadyText(query);
  }

  /**
   * Content search API returns cues including "Mr. Bungle" as matches for both search queries
   * "mr bungle" and "mr. bungle".
   * When "mr bungle" is searched this function handles highlighting since the regex fails to
   * identify the matches in the cues.
   */
  let altReplace = () => {
    const matches = [...text.matchAll(/<\/?[^>]+>/gi)];
    if (matches?.length === 0) return;
    let startIndex = 0;
    let newStr = '';
    for (let j = 0; j < matches.length && count < hitCount;) {
      // Set offset to count matches based on the # of words in the phrase search query
      const splitQ = query.split(/[\s-,\?]/);
      const offset = splitQ?.length > 0
        ? (splitQ?.length * 2) - 1 : 1;

      if (matches[j] === undefined && matches[j + offset] === undefined) return;

      // Indices of start and end of the highlighted text including <em> tags
      const firstIndex = matches[j].index;
      const lastIndex = matches[j + offset].index + matches[j + offset][0].length;
      const prefix = text.slice(startIndex, firstIndex);
      const cleanedMatch = text.slice(firstIndex, lastIndex).replace(/<\/?[^>]+>/gi, '');
      newStr = `${newStr}${prefix}<span class="ramp--transcript_highlight">${cleanedMatch}</span>`;
      startIndex = lastIndex;
      j = +(offset + 1);
      count++;
      if (j == matches.length) {
        newStr = `${newStr}${text.slice(startIndex)}`;
      }
    }
    return newStr;
  };

  try {
    const queryRegex = new RegExp(String.raw`${queryFormatted}`, 'gi');
    if ([...text.matchAll(queryRegex)]?.length === 0) {
      const highlighted = altReplace();
      return highlighted;
    } else {
      return text.replace(queryRegex, replacerFn);
    }
  } catch (e) {
    console.log('Error building RegExp for query: ', query);
  }

};

/**
 * For docx files the content search response text doesn't have the formatted
 * styles in the Word document (e.g. bold text wrapped in <strong> tags). So,
 * use the styled text formatted with mammoth in the UI to add highlights from
 * the content search response.
 * @param {String} text string to be formatted
 * @param {String} query string to find and replace with <em> tags
 * @returns a string formatted with highlights
 */
const addStyledHighlights = (text, query) => {
  if (text === undefined || !text) return;
  let replacerFn = (match) => {
    const cleanedMatch = buildRegexReadyText(match, false, true);
    return cleanedMatch;
  };

  // Regex to get matches in the text while ignoring matches with query preceded by - or '
  let queryregex = new RegExp(String.raw`\b${buildRegexReadyText(query, true, false)}\b`, 'gi');
  const styled = text.replace(queryregex, replacerFn);
  return styled;
};

/**
 * Format a given string by escaping punctuations characters and grouping 
 * punctuations and text, to make it feasible to be used to build a regular
 * expression accurately.
 * @param {String} text string to be formatted with hightlights
 * @param {Boolean} regExpReady flag to indicate the usage of the output as a regular exp
 * @param {Boolean} addHightlight flag to indicate to/not to add <em> tags
 * @returns string with <em> tags
 */
const buildRegexReadyText = (text, regExpReady = true, addHightlight = true) => {
  // Text matches in the string
  const matches = [...text.matchAll(/[a-zA-Z']+/gi)];
  // Punctuation matches in the string
  const punctuationMatches = [...text.matchAll(/([.+?"^${}\-|[\]\\])/g)];

  /**
   * If no punctuations are found within the text return text with highlights
   * For RegExp ready strings: ignore matches followed by - or '
   * e.g. omit matches as "Bungle's" when search query is "bungle"
   */
  if (punctuationMatches?.length === 0) {
    const textFormatted = addHightlight ? text.split(' ').map(t => `<em>${t}</em>`).join(' ') : text;
    const textRegex = regExpReady ? `${textFormatted}(?!['\w*])` : textFormatted;
    return textRegex;
  }

  let highlighted = '';
  let startIndex = 0;
  let i = 0;
  while (i < matches.length) {
    const match = matches[i];
    let textMatch = addHightlight ? `<em>${match[0]}</em>` : match[0];
    /**
     * When build RegExp ready string with punctuation blocks in the given string;
     * - use * quantifier for blocks either at the start/end of the string to match zero or more times
     * - use + quantifier for blocks in the middle of the string to match one or more times
     * This pattern is build according the response from the content search API results.
     */
    let punctMatch = startIndex === 0
      ? `(${text.slice(startIndex, match.index)})*`
      : `(${text.slice(startIndex, match.index)})+`;
    highlighted = regExpReady
      ? `${highlighted}${punctMatch}(${textMatch})`
      : `${highlighted}${text.slice(startIndex, match.index)}${textMatch}`;
    startIndex = match.index + match[0].length;
    if (i === matches?.length - 1) {
      highlighted = regExpReady
        ? `${highlighted}(${text.slice(startIndex)})*`
        : `${highlighted}${text.slice(startIndex)}`;
    }
    i++;
  }

  // Escape punctuation characters in string for RegExp ready strings
  let escapePunctuation = (str) => {
    const punctuationRegex = /([.?^${}|[\]\\])/g;
    return str.replace(punctuationRegex, '\\$1');
  };
  return regExpReady ? escapePunctuation(highlighted) : highlighted;
};

/**
 * Calculate hit counts for each matched transcript cue
 * @param {String} text matched transcript cue text
 * @param {String} query search query from UI
 * @param {Boolean} hasHighlight flag indicating has <em> tags or not
 * @returns 
 */
const getHitCountForCue = (text, query, hasHighlight = false) => {
  /*
    Content search API highlights each word in the given phrase in the response.
    Threfore, use first word in the query seperated by a white space to get the hit
    counts for each cue.
    Use regex with any punctuation followed by a white space to split the query.
    e.g. query: Mr. bungle => search response: <em>Mr</em>. <em>Bungle</em>
  */
  const partialQ = query.split(/[\s.,!?;:]/)[0];
  const cleanedPartialQ = partialQ.replace(/[\[\]\-]/gi, '');
  const hitTerm = hasHighlight ? buildRegexReadyText(partialQ) : cleanedPartialQ;
  const highlightedTerm = new RegExp(String.raw`${hitTerm}`, 'gi');
  const hitCount = [...text.matchAll(highlightedTerm)]?.length;
  return hitCount;
};

/**
 * Apply text-highlight class for the search hits by comparing the text
 * from search response with the styled text in the transcript display
 * @param {String} searchResText search response text with <em> tags
 * @param {String} styledText styled text in transcript display
 * @returns {String}
 */
export const addHighlightTags = (searchResText, styledText) => {
  const emPositions = findEmPositions(searchResText);
  return applyHighlightTags(styledText, emPositions);
};

/**
 * Extract plain text content from a text with HTML tags
 * @param {String} html text with HTML tags
 * @returns {String}
 */
const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Find all <em> tag positions and merge consecutive ones where
 * the search query it truncated into multiple strings by a
 * punctuation or white space
 * @param {String} text with <em> tags from search response
 * @returns {Array}
 */
const findEmPositions = (text) => {
  const emPositions = [];
  const emRegex = /<em>(.*?)<\/em>/g;
  let match;

  // Find all individual <em> positions
  const allMatches = [];
  while ((match = emRegex.exec(text)) !== null) {
    allMatches.push({
      content: match[1],
      index: match.index,
      fullMatch: match[0]
    });
  }

  if (allMatches.length === 0) return emPositions;

  // Calculate positions in plain text
  let plainTextIndex = 0;
  let htmlPos = 0;

  for (const match of allMatches) {
    // Find position in plain text up to this <em> tag
    const prefix = stripHtml(text.substring(htmlPos, match.index));
    const startIndex = plainTextIndex + prefix.length;
    const endIndex = startIndex + match.content.length;

    emPositions.push({
      start: startIndex,
      end: endIndex,
    });

    plainTextIndex = endIndex;
    htmlPos = match.index + match.fullMatch.length;
  }

  if (emPositions.length <= 1) return emPositions;
  emPositions.sort((a, b) => a.start - b.start);

  const merged = [];
  let i = 0;
  // Merge highlights when search query is a phrase/separated by a punctuation/white space
  while (i < emPositions.length) {
    let current = emPositions[i];
    let j = i + 1;

    // Look ahead to see if there are consecutive positions with single character gaps
    while (j < emPositions.length && emPositions[j].start <= current.end + 2) {
      current = {
        start: current.start,
        end: emPositions[j].end,
      };
      j++;
    }

    merged.push(current);
    i = j;
  }

  return merged;
};

/**
 * Apply text-highlight class to the merged search hits
 * @param {String} targetText text to apply text-highlight class
 * @param {Array} positions highlight indices in the text
 * @returns {String}
 */
const applyHighlightTags = (targetText, positions) => {
  if (positions.length === 0) return targetText;

  // Create a DOM element to parse the HTML
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!tempDiv) {
    // For non-browser environments: return original
    return targetText;
  }
  tempDiv.innerHTML = targetText;

  // Recursively walk and highlight text nodes
  function highlightInNode(node, highlights, offset = 0) {
    if (highlights.length === 0) return offset;
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      let newNodes = [];
      let curr = 0;
      let relHighlights = highlights.filter(h =>
        h.start < offset + text.length && h.end > offset
      );
      if (relHighlights.length === 0) return offset + text.length;
      relHighlights.sort((a, b) => a.start - b.start);
      for (let i = 0; i < relHighlights.length; i++) {
        const h = relHighlights[i];
        const start = Math.max(0, h.start - offset);
        const end = Math.min(text.length, h.end - offset);
        if (curr < start) {
          newNodes.push(document.createTextNode(text.slice(curr, start)));
        }
        const span = document.createElement('span');
        span.className = 'ramp--transcript_highlight';
        span.textContent = text.slice(start, end);
        newNodes.push(span);
        curr = end;
      }
      if (curr < text.length) {
        newNodes.push(document.createTextNode(text.slice(curr)));
      }
      // Replace the text node with the new nodes
      for (let n of newNodes.reverse()) {
        node.after(n);
      }
      node.remove();
      return offset + text.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      let child = node.firstChild;
      let childOffset = offset;
      while (child) {
        const next = child.nextSibling;
        childOffset = highlightInNode(child, highlights, childOffset);
        child = next;
      }
      return childOffset;
    } else {
      return offset;
    }
  }

  // Map positions to highlights
  highlightInNode(tempDiv, positions);
  return tempDiv.innerHTML;
};

