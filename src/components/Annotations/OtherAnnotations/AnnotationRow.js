import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autoScroll, screenReaderFriendlyText, timeToHHmmss } from '@Services/utility-helpers';
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
   * Click event handler for annotations displayed in the UI.
   * Seek the player to;
   * - start time of an Annotation with a time range
   * - timestamp of an Annotation with a single time-point.
   */
  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    checkCanvas(annotation);

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
   * Validate and handle click events on a link in the annotation text
   * @param {Event} e 
   * @returns 
   */
  const handleLinkClicks = (e) => {
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
  };

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
   * @param {Event} e keyboard event
   * @returns 
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleOnClick(e);
    }
  };

  if (canDisplay) {
    return (
      <div
        key={`li_${index}`}
        ref={annotationRef}
        data-testid='annotation-row'
        className={cx(
          'ramp--annotations__annotation-row',
          isActive && 'active'
        )}
        aria-label={screenReaderFriendlyText(textToShow)}
      >
        <div key={`row_${index}`}
          role='button'
          tabIndex={index === 0 ? 0 : -1}
          onClick={handleOnClick}
          onKeyDown={handleKeyDown}
          data-testid='annotation-row-button'
          className='ramp--annotations__annotation-row-time-tags'>
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
              onClick={handleLinkClicks}
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
            >
              {isShowMoreRef.current ? 'Show more' : 'Show less'}
            </button>)
          }
        </div>
      </div>
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
