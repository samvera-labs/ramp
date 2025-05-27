import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autoScroll, timeToHHmmss } from '@Services/utility-helpers';
import { useAnnotationRow, useMediaPlayer, useShowMoreOrLess } from '@Services/ramp-hooks';
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
  const { player, currentTime } = useMediaPlayer();
  const { checkCanvas, inPlayerRange } = useAnnotationRow({
    canvasId,
    annotationId: annotation.id,
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

  // Track the index of the focused link/button within the annotation
  const focusedIndex = useRef(-1);
  const setFocusedIndex = (i) => focusedIndex.current = i;

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
   * Display only the annotations with at least one of the specified motivations
   * when the component is initialized.
   * The default value of 'displayMotivations' is set to an empty array, 
   * in which case the component displays all annotations related to Canvas.
   */
  const canDisplay = useMemo(() => {
    return displayMotivations?.length > 0
      ? displayMotivations.some(m => motivation.includes(m))
      : true;
  }, [annotation, displayMotivations]);

  // Custom hook to handle show more/less functionality for texts and tags
  const {
    hasLongerTags,
    hasLongerText,
    setShowMoreTags,
    showMoreTags,
    setTextToShow,
    textToShow,
    toggleTagsView,
    truncatedText } = useShowMoreOrLess({
      autoScrollEnabled,
      enableShowMore,
      inPlayerRange,
      MAX_LINES,
      refs: {
        annotationRef, annotationTagsRef, annotationTextsRef, annotationTimesRef,
        containerRef, moreTagsButtonRef
      },
      setIsShowMoreRef, setIsActive,
      tags, texts
    });

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
    checkCanvas(annotation);

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


  /**
   * Click event handler for the 'Show more'/'Show less' button for
   * each annotation text.
   */
  const handleShowMoreLessClick = () => {
    if (!isShowMoreRef.current) {
      setTextToShow(truncatedText);
      // Scroll to the top of the annotation when 'Show less' button is clicked
      autoScroll(annotationRef.current, containerRef, true);
    } else {
      setTextToShow(texts);
    }
    setIsShowMoreRef(!isShowMoreRef.current);
  };

  /**
   * Keydown event handler for show more/less button in the annotation text
   * @param {Event} e keydown event
   */
  const handleShowMoreLessKeydown = (e) => {
    if (e.key == 'Enter' || e.key == ' ') {
      e.preventDefault();
      handleShowMoreLessClick();
    }
  };

  /**
   * Click event handler for show/hide overflowing tags button for
   * each annotation row.
   */
  const handleShowMoreTagsClicks = () => {
    const nextState = !showMoreTags;
    toggleTagsView(nextState);
    setShowMoreTags(nextState);
    // Scroll to the top of the annotation when 'Show less' button is clicked
    if (nextState) {
      autoScroll(annotationRef.current, containerRef, true);
    }
  };

  /**
   * Enable keyboard activation of the show/hide overflowing tags
   * button for 'Space' (32) and 'Enter' (13) keys.
   */
  const handleShowMoreTagsKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleShowMoreTagsClicks();
    }
  };

  /**
   * Seek the player to the start time of the activated annotation, and mark it as active
   * when using Enter/Space keys to select the focused annotation
   * Trap focus within the annotation to navigate through any links or buttons in the
   * annotation row display when Tab key is pressed
   * @param {Event} e keyboard event
   * @returns 
   */
  const handleKeyDown = (e) => {
    // Get links/buttons inside the annotation row
    const linksAndButtons = annotationRef.current.querySelectorAll('button, a');
    const handleTab = (e) => {
      let nextIndex = focusedIndex.current;
      // Allow tabbing through links/buttons if they exist, and do nothing if not
      if (linksAndButtons?.length > 0) {
        if (e.shiftKey) {
          // When focused on a link/button that is not the first in annotation trap
          // focus within the annotation else let the event bubble up to move focus
          // away from the focused annotation
          if (focusedIndex.current > 0) {
            nextIndex = (focusedIndex.current - 1) % linksAndButtons.length;
            // Stop the event from bubbling up to keydown event handler in parent element in AnnotationDisplay
            e.stopPropagation();
          }
          // Prevent default behavior. Focus shifts to the link/button prior to the one at nextIndex without this
          e.preventDefault();
        } else {
          nextIndex = (focusedIndex.current + 1) % linksAndButtons.length;
          e.preventDefault();
        }

        // Focus on link/button if it exists
        if (linksAndButtons[nextIndex]) {
          linksAndButtons[nextIndex].focus();
          setFocusedIndex(nextIndex);
        }
      }
    };

    if (e.key === 'Enter' || e.key === ' ') {
      handleOnClick(e);
    }

    // Allow tab through any existing links/buttons inside the annotation
    if (e.key === 'Tab') {
      handleTab(e);
    }
  };

  if (canDisplay) {
    return (
      <li
        key={`li_${index}`}
        role='option'
        tabIndex={index === 0 ? 0 : -1}
        ref={annotationRef}
        onClick={handleOnClick}
        onKeyDown={handleKeyDown}
        data-testid='annotation-row'
        className={cx(
          'ramp--annotations__annotation-row',
          isActive && 'active'
        )}
      >
        <div key={`row_${index}`} className='ramp--annotations__annotation-row-time-tags'>
          <div
            key={`times_${index}`}
            className='ramp--annotations__annotation-times'
            ref={annotationTimesRef}
          >
            {time?.start != undefined && (
              <span
                className='ramp--annotations__annotation-start-time'
                data-testid='annotation-start-time'>
                {timeToHHmmss(time?.start, true, true)}
              </span>
            )}
            {time?.end != undefined && (
              <span
                className='ramp--annotations__annotation-end-time'
                data-testid='annotation-end-time'>
                {` - ${timeToHHmmss(time?.end, true, true)}`}
              </span>
            )}
          </div>
          <div
            key={`tags_${index}`}
            className='ramp--annotations__annotation-tags'
            data-testid={`annotation-tags-${index}`}
            ref={annotationTagsRef}
          >
            {tags?.length > 0 && tags.map((tag, i) => {
              return (
                <p
                  key={`tag_${i}`}
                  className='ramp--annotations__annotation-tag'
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
                className='ramp--annotations__show-more-tags'
                data-testid={`show-more-annotation-tags-${index}`}
                onClick={handleShowMoreTagsClicks}
                onKeyDown={handleShowMoreTagsKeyDown}
                ref={moreTagsButtonRef}
                tabIndex={-1}
              >
                <i className={`arrow ${showMoreTags ? 'right' : 'left'}`}></i>
              </button>
            )}
          </div>
        </div>
        <div
          key={`text_${index}`}
          className='ramp--annotations__annotation-texts'
          ref={annotationTextsRef}
        >
          {textToShow?.length > 0 && (
            <p
              key={`text_${index}`}
              data-testid={`annotation-text-${index}`}
              className='ramp--annotations__annotation-text'
              dangerouslySetInnerHTML={{ __html: textToShow }}
            ></p>
          )}
          {(hasLongerText && enableShowMore) &&
            (<button
              key={`show-more_${index}`}
              role='button'
              aria-label={isShowMoreRef.current ? 'show more' : 'show less'}
              aria-pressed={isShowMoreRef.current ? 'false' : 'true'}
              className='ramp--annotations__show-more-less'
              data-testid={`annotation-show-more-${index}`}
              onClick={handleShowMoreLessClick}
              onKeyDown={handleShowMoreLessKeydown}
              tabIndex={-1}
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
