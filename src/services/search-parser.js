import { Annotation } from 'manifesto.js';
import { getCanvasId } from '@Services/iiif-parser';
import { getMediaFragment, groupBy } from '@Services/utility-helpers';
import { TRANSCRIPT_CUE_TYPES, TRANSCRIPT_MIME_TYPES, TRANSCRIPT_MOTIVATION } from './transcript-parser';

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
      if (anno.getMotivation() != TRANSCRIPT_MOTIVATION) return;

      const target = anno.getTarget();
      const targetURI = getCanvasId(target);
      const value = anno.getBody()[0].getProperty('value');
      const hitCount = findEmPositions(value, query)?.length;

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
  if (selectedTranscript.isTimed && filteredSearchHits != undefined) {
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

  searchHits.map((item) => {
    let { target, value, hitCount } = item;
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
          matchCount: hitCount,
          text: transcripts[transcriptId].text,
        });
      }
    } else {
      const hits = matchPartsInUntimedText(transcripts, value, query, traversedIds);
      transcriptLines = [...transcriptLines, ...hits];
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
 * @param {String} searchText matched text from content search
 * @param {String} query search query entered by the user
 * @param {Array} traversedIds already included transcript indices
 * @returns a list of matched transcript lines
 */
const matchPartsInUntimedText = (transcripts, searchText, query, traversedIds) => {
  // Get plain backend text and highlight positions
  const plainSearchText = stripHtml(searchText);
  const emPositions = findEmPositions(searchText, query);

  let currentOffset = 0;
  let hits = [];

  // When transcript is one single block match it against the text in search response
  if (transcripts?.length == 1) {
    const { id, text, textDisplayed } = transcripts[0];
    const cueText = textDisplayed || text;
    const cleanedCueText = stripHtml(cueText);

    if (cleanedCueText.includes(plainSearchText)) {
      traversedIds.push(id);
      return [{
        tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
        begin: undefined,
        end: undefined,
        id: id,
        match: addHighlightTags(searchText, cueText, query),
        matchCount: emPositions.length,
        text: cueText
      }];
    }
  }

  let lastTraversedId = traversedIds[traversedIds.length - 1] + 1 || 0;
  for (let i = lastTraversedId; i < transcripts.length; i++) {
    const { id, text, textDisplayed } = transcripts[i];
    const cueText = textDisplayed || text;
    const cueLength = cueText.length;

    // Find where this line appears in the search response, starting from currentOffset
    const startIdx = plainSearchText.indexOf(stripHtml(cueText), currentOffset);
    if (startIdx === -1) {
      continue;
    }
    const endIdx = startIdx + cueLength;

    // Find highlights that fall within this line
    const lineHighlights = emPositions
      .filter(pos => pos.start < endIdx && pos.end > startIdx)
      .map(pos => ({
        start: Math.max(0, pos.start - startIdx),
        end: Math.min(cueLength, pos.end - startIdx),
        content: pos.content
      }));

    // Apply ramp highlight class to this cue
    const match = applyHighlightTags(cueText, lineHighlights);

    traversedIds.push(id);
    hits.push({
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      begin: undefined,
      end: undefined,
      id, match,
      matchCount: lineHighlights.length,
      text: cueText
    });
    currentOffset = endIdx;
  }

  return hits;
};

/**
 * Apply text-highlight class for the search hits by comparing the text
 * from search response with the styled text in the transcript display
 * @param {String} searchResText search response text with <em> tags
 * @param {String} styledText styled text in transcript display
 * @returns {String}
 */
export const addHighlightTags = (searchResText, styledText, query) => {
  const emPositions = findEmPositions(searchResText, query);
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
const findEmPositions = (text, searchQuery) => {
  const emPositions = [];
  const emRegex = /<em>(.*?)<\/em>/g;
  let match;
  const plainSearchQ = searchQuery.replace(/[^\w']/g, '').toLowerCase();

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

  // Get plain text without HTML
  const plainText = stripHtml(text);

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
      content: match.content
    });

    plainTextIndex = endIndex;
    htmlPos = match.index + match.fullMatch.length;
  }

  if (emPositions.length <= 1) return emPositions;

  const merged = [];
  let i = 0;
  // Merge highlights when search query is a phrase/separated by a punctuation/white space
  while (i < emPositions.length) {
    let current = emPositions[i];
    let j = i + 1;

    // Look ahead to see to merge highlights for a single search query
    while (j < emPositions.length && emPositions[j].start <= current.end + 2
      && current.content.replace(/[^\w']/g, '').toLowerCase() != plainSearchQ
    ) {
      const nonTextContent = plainText.substring(current.end, emPositions[j].start);
      current = {
        start: current.start,
        end: emPositions[j].end,
        content: current.content + nonTextContent + emPositions[j].content
      };
      j++;
    }

    merged.push(current);
    i = j;
  }

  return merged;
};

/**
 * Get the plain text of a node including its children to identify nested HTML 
 * within search hit
 * @param {Object} node current HTML node
 * @returns {String}
 */
const getNodePlainText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue;
  if (node.nodeType === Node.ELEMENT_NODE) {
    let text = '';
    for (let child = node.firstChild; child; child = child.nextSibling) {
      text += getNodePlainText(child);
    }
    return text;
  }
  return '';
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
  tempDiv.innerHTML = targetText;

  function highlightInNode(node, highlights, offset = 0) {
    if (highlights.length === 0) return offset;
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      let newNodes = [];
      let curr = 0;
      let highlight = highlights.filter(h => h.start < offset + text.length && h.end > offset);

      if (highlight.length === 0) return offset + text.length;

      for (let i = 0; i < highlight.length; i++) {
        const h = highlight[i];
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
      for (let n of newNodes.reverse()) {
        node.after(n);
      }
      node.remove();
      return offset + text.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Check if any search hits matche the plain text of this node
      const nodeText = getNodePlainText(node);
      for (const h of highlights) {
        if (nodeText === h.content) {
          const span = document.createElement('span');
          span.className = 'ramp--transcript_highlight';
          // Add all children into the span
          while (node.firstChild) {
            span.appendChild(node.firstChild);
          }
          node.appendChild(span);
          return offset + nodeText.length;
        }
      }
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
  highlightInNode(tempDiv, positions);
  return tempDiv.innerHTML;
};

