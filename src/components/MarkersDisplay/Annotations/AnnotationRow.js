import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autoScroll, timeToHHmmss } from '@Services/utility-helpers';
import { useAnnotations, useMediaPlayer } from '@Services/ramp-hooks';
import { SUPPORTED_MOTIVATIONS } from '@Services/annotations-parser';

const AnnotationRow = ({
  annotation,
  autoScrollEnabled,
  containerRef,
  displayedAnnotations,
  displayMotivations,
  index,
  showMoreSettings,
}) => {
  const { canvasId, motivation, time, value } = annotation;
  const { enableShowMore, textLineLimit: MAX_LINES } = showMoreSettings;

  const [isActive, setIsActive] = useState(false);
  // Text displayed for the annotation
  const [textToShow, setTextToShow] = useState(0);
  // If annotation has a longer text; truncated text to fit number of MAX_LINES in the display
  const [truncatedText, setTruncatedText] = useState('');
  const [hasLongerText, setHasLongerText] = useState(false);
  // State variables to store information related to overflowing tags in the annotation
  const [hasLongerTags, setLongerTags] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

  const { player, currentTime } = useMediaPlayer();
  const { checkCanvas, inPlayerRange } = useAnnotations({
    canvasId,
    startTime: time?.start,
    endTime: time?.end,
    currentTime,
    displayedAnnotations
  });

  // React refs for UI elements
  const annotationRef = useRef(null);
  const annotationTagsRef = useRef(null);
  const annotationTimesRef = useRef(null);
  const annotationTextsRef = useRef(null);
  const moreTagsButtonRef = useRef(null);

  const isShowMoreRef = useRef(true);
  const setIsShowMoreRef = (state) => isShowMoreRef.current = state;

  /**
   * Display only the annotations with at least one of the specified motivations
   * when the component is initialized.
   * The default value of 'displayMotivations' is set to an empty array, 
   * in which case the component displays all annotations related to Canvas.
   */
  const canDisplay = useMemo(() => {
    return displayMotivations?.length > 0
      ? displayMotivations.some(m => motivation.includes(m))
      : true;
  }, [annotation]);

  /**
   * When there multiple annotations in the same time range, auto-scroll to
   * the annotation with the start time that is closest to the current time
   * of the player.
   * This allows a better user experience when auto-scroll is enabled during playback, 
   * and there are multiple annotations that falls within the same time range.
   */
  useEffect(() => {
    inPlayerRange ? setIsActive(true) : setIsActive(false);
    if (autoScrollEnabled && inPlayerRange) {
      autoScroll(annotationRef.current, containerRef, true);
    }
  }, [inPlayerRange]);

  /**
   * Click event handler for annotations displayed.
   * An annotation can have links embedded in the text; and the click event's
   * target is a link, then open the link in the same page.
   * If the click event's target is the text or the timestamp of the
   * annotation, then seek the player to;
   * - start time of an Annotation with a time range
   * - timestamp of an Annotation with a single time-point.
   */
  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    checkCanvas();

    // Do nothing when clicked on 'Show more'/'Show less' button
    if (e.target.tagName === 'BUTTON') return;

    // Handle click on a link in the text in the same tab without seeking the player
    if (e.target.tagName == 'A') {
      // Check if the href value is a valid URL before navigation
      const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
      const href = e.target.getAttribute('href');
      if (!href?.match(urlRegex)) {
        e.preventDefault();
      } else {
        window.open(e.target.href, '_self');
        return;
      }
    }
    const currTime = time?.start;
    if (player && player?.targets?.length > 0) {
      const { start, end } = player.targets[0];
      switch (true) {
        case currTime >= start && currTime <= end:
          player.currentTime(currTime);
          break;
        case currTime < start:
          player.currentTime(start);
          break;
        case currTime > end:
          player.currentTime(end);
          break;
      }
    }
  }, [annotation, player]);

  // TextualBodies with purpose tagging to be displayed as tags next to time range
  const tags = useMemo(() => {
    return value.filter((v) => v.purpose.includes('tagging'));
  }, [value]);

  // TextualBodies with supported purpose (motivation) values to be displayed as text
  const texts = useMemo(() => {
    const textsToShow = value.filter(
      (v) => SUPPORTED_MOTIVATIONS.some(m => v.purpose.includes(m))
    );
    if (textsToShow?.length > 0) {
      // Join texts with line breaks into a single text block
      const annotationText = textsToShow.map((t) => t.value).join('<br>');
      return annotationText;
    } else {
      return '';
    }
  }, [value]);

  /**
   * Truncate annotation text based on the width of the element on the page.
   * Use a ResizeObserver to re-calculate truncated texts based on Annotations
   * container re-size events
   */
  useEffect(() => {
    const textBlock = annotationTextsRef.current;
    let canvas, observer;
    const calcTruncatedText = () => {
      if (textBlock && texts?.length > 0) {
        const textBlockWidth = textBlock.clientWidth;
        const fontSize = parseFloat(getComputedStyle(textBlock).fontSize);
        if (!isNaN(fontSize)) {
          // Create a temporary canvas element to measure average character width
          canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.font = getComputedStyle(textBlock).font;

          // Calculate average character width based on the specified font in CSS
          const textWidth = context.measureText(texts).width;
          const avgCharWidth = textWidth / texts.length;

          // Calculate maximum number of characters that can be shown on avg character width
          const charsPerLine = textBlockWidth / avgCharWidth;

          /**
           * To account for spaces at the end of line breaks, calculate max character for
           * half a line width less than given MAX_LINES count
           */
          const maxCharactersToShow = charsPerLine * (MAX_LINES - 1)
            + Math.floor(charsPerLine / 2);

          let elementText = texts;

          /**
           * When texts has line breaks with shorter text in each line, pad each shorter line 
           * until the length of it reaches the calculated charsPerLine number
           */
          if (texts.includes('<br>')) {
            const lines = texts.split('<br>');
            let paddedText = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.length < charsPerLine) {
                // Account for the space for <br> for line breaks
                const maxLineLength = charsPerLine > 4 ? charsPerLine - 4 : 0;
                paddedText.push(line.padEnd(maxLineLength));
              } else {
                // Do nothing if text length is longer than charsPerLine
                paddedText.push(line);
              }
            }
            elementText = paddedText.join('<br>');
          }

          // Truncate text if the annotation text is longer than max character count
          if (elementText.length > maxCharactersToShow) {
            const truncated = `${elementText.slice(0, maxCharactersToShow)}...`;
            setTextToShow(truncated);
            setTruncatedText(truncated);
            setIsShowMoreRef(true);
            setHasLongerText(true);
          } else {
            setTextToShow(elementText);
            setHasLongerText(false);
          }
        }
      }
    };

    // Only truncate text if `enableShowMore` is turned ON
    if (enableShowMore) {
      // Use a ResizeObserver to truncate the text as the Annotations container re-sizes
      observer = new ResizeObserver(entries => {
        requestAnimationFrame(() => {
          for (let entry of entries) {
            calcTruncatedText();
          }
        });
      });
      // Truncate text on load
      calcTruncatedText();
    } else {
      setTextToShow(texts);
    }

    // Cleanup observer and temp canvas element on component un-mount
    return () => {
      canvas?.remove();
      observer?.disconnect();
    };
  }, [texts]);

  /**
   * Hide annotation tags when they overflow the width of the annotation 
   * container on the page
   */
  useEffect(() => {
    /**
     * Use ResizeObserver to hide/show tags as the annotations component re-sizes. 
     * Using it along with 'requestAnimationFrame' optimizes the animation
     * when container is contunuously being re-sized.
     */
    const observer = new ResizeObserver(entries => {
      requestAnimationFrame(() => {
        for (let entry of entries) {
          const hasOverflowingTags = toggleTagsView(true);
          // Update state
          setLongerTags(hasOverflowingTags);
          setShowMoreTags(hasOverflowingTags);
        }
      });
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup observer on component un-mount
    return () => {
      observer?.disconnect();
    };
  }, [tags]);

  /**
   * Hide/show tags in the Annotation when the tags overflow the annotation
   * component's width.
   * This function is called in the ResizeObserver, as well as a callback function
   * within the click event handler of the show more/less tags button to re-render 
   * tags as needed.
   * @param {Boolean} hideTags 
   * @returns {Boolean}
   */
  const toggleTagsView = (hideTags) => {
    let hasOverflowingTags = false;
    // Tags and times UI elements on the page
    const tagsBlock = annotationTagsRef.current;
    const timesBlock = annotationTimesRef.current;
    if (tagsBlock && timesBlock && tags?.length > 0) {
      /* Reset the grid-column to its default if it was previously set */
      tagsBlock.style.gridColumn = '';
      const timesBlockWidth = timesBlock?.clientWidth || 0;
      // Available space to render tags for the current annotation
      const availableTagsWidth = tagsBlock.parentElement.clientWidth - timesBlockWidth;
      if (tagsBlock.children?.length > 0) {
        // 20 is an approximate width of the button, since this element gets rendered later
        const moreTagsButtonWidth = moreTagsButtonRef.current?.clientWidth || 20;
        // Reserve space for show more tags button
        let spaceForTags = availableTagsWidth - moreTagsButtonWidth;
        let hasLongerChild = false;
        for (let i = 0; i < tagsBlock.children.length; i++) {
          const child = tagsBlock.children[i];
          // Reset 'hidden' class in each tag
          if (child.classList.contains('hidden')) child.classList.remove('hidden');
          // Check if at least one tag has longer text than the available space
          if (child.clientWidth > availableTagsWidth) hasLongerChild = true;
          if (hideTags && child != moreTagsButtonRef.current) {
            spaceForTags = spaceForTags - child.clientWidth;
            // If the space left is shorter than the more tags button, hide the rest of the tags
            if (spaceForTags < moreTagsButtonWidth) {
              hasOverflowingTags = true;
              child.classList.add('hidden');
            }
          }
        }
        /* Make the tags block span the full width of the time and tags container if 
        there are tags with longer text */
        if (hasLongerChild) {
          tagsBlock.style.gridColumn = '1 / -1';
        }
      }
    }
    return hasOverflowingTags;
  };

  /**
   * Click event handler for the 'Show more'/'Show less' button for
   * each annotation text.
   */
  const handleShowMoreLessClick = () => {
    if (!isShowMoreRef.current) {
      setTextToShow(truncatedText);
    } else {
      setTextToShow(texts);
    }
    setIsShowMoreRef(!isShowMoreRef.current);
  };

  /**
   * Click event handler for show/hide overflowing tags button for
   * each annotation row.
   */
  const handleShowMoreTagsClicks = () => {
    const nextState = !showMoreTags;
    toggleTagsView(nextState);
    setShowMoreTags(nextState);
  };

  /**
   * Enable keyboard activation of the show/hide overflowing tags
   * button for 'Space' (32) and 'Enter' (13) keys.
   */
  const handleShowMoreTagsKeyDown = (e) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      handleShowMoreTagsClicks();
    }
  };

  if (canDisplay) {
    return (
      <li
        key={`li_${index}`}
        ref={annotationRef}
        onClick={handleOnClick}
        data-testid="annotation-row"
        className={cx(
          "ramp--annotations__annotation-row",
          isActive && 'active'
        )}
      >
        <div key={`row_${index}`} className="ramp--annotations__annotation-row-time-tags">
          <div
            key={`times_${index}`}
            className="ramp--annotations__annotation-times"
            ref={annotationTimesRef}
          >
            {time?.start != undefined && (
              <span
                className="ramp--annotations__annotation-start-time"
                data-testid="annotation-start-time">
                {timeToHHmmss(time?.start, true, true)}
              </span>
            )}
            {time?.end != undefined && (
              <span
                className="ramp--annotations__annotation-end-time"
                data-testid="annotation-end-time">
                {` - ${timeToHHmmss(time?.end, true, true)}`}
              </span>
            )}
          </div>
          <div
            key={`tags_${index}`}
            className="ramp--annotations__annotation-tags"
            ref={annotationTagsRef}
          >
            {tags?.length > 0 && tags.map((tag, i) => {
              return (
                <p
                  key={`tag_${i}`}
                  className="ramp--annotations__annotation-tag"
                  data-testid={`annotation-tag-${i}`}
                  style={{ backgroundColor: tag.tagColor }}
                >
                  {tag.value}
                </p>
              );
            })}
            {hasLongerTags && (
              <button
                key={`show-more-tags_${index}`}
                role='button'
                aria-label={showMoreTags ? 'Show hidden tags' : 'Hide overflowing tags'}
                aria-pressed={showMoreTags ? 'false' : 'true'}
                className="ramp--annotations__show-more-tags"
                data-testid='show-more-annotation-tags'
                onClick={handleShowMoreTagsClicks}
                onKeyDown={handleShowMoreTagsKeyDown}
                ref={moreTagsButtonRef}
              >
                <i className={`arrow ${showMoreTags ? 'right' : 'left'}`}></i>
              </button>
            )}
          </div>
        </div>
        <div
          key={`text_${index}`}
          className="ramp--annotations__annotation-texts"
          ref={annotationTextsRef}
        >
          {textToShow?.length > 0 && (
            <p
              key={`text_${index}`}
              data-testid={`annotation-text-${index}`}
              className="ramp--annotations__annotation-text"
              dangerouslySetInnerHTML={{ __html: textToShow }}
            ></p>
          )}
          {(hasLongerText && enableShowMore) &&
            (<button
              key={`show-more_${index}`}
              role='button'
              aria-label={isShowMoreRef.current ? 'show full text' : 'hide long text'}
              aria-pressed={isShowMoreRef.current ? 'false' : 'true'}
              className="ramp--annotations__show-more-less"
              data-testid={`annotation-show-more-${index}`}
              onClick={handleShowMoreLessClick}
            >
              {isShowMoreRef.current ? 'Show more' : 'Show less'}
            </button>)
          }
        </div>
      </li >
    );
  } else {
    return null;
  }
};

AnnotationRow.propTypes = {
  annotation: PropTypes.object.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired,
  containerRef: PropTypes.object.isRequired,
  displayedAnnotations: PropTypes.array,
  displayMotivations: PropTypes.array.isRequired,
  index: PropTypes.number,
  showMoreSettings: PropTypes.object.isRequired,
};

export default AnnotationRow;
