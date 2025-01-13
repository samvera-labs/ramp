
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { autoScroll, timeToHHmmss } from '@Services/utility-helpers';
import { useAnnotations, useMediaPlayer } from '@Services/ramp-hooks';
import { SUPPORTED_MOTIVATIONS } from '@Services/annotations-parser';

const AnnotationRow = ({ annotation, displayMotivations, autoScrollEnabled, containerRef }) => {
  const { id, canvasId, motivation, time, value } = annotation;

  const [isActive, setIsActive] = useState(false);

  const { player, currentTime } = useMediaPlayer();
  const { checkCanvas } = useAnnotations({ canvasId });

  const annotationRef = useRef(null);

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
    if (Math.floor(time?.start) === Math.floor(currentTime)) {
      setIsActive(true);
      autoScrollEnabled && autoScroll(annotationRef.current, containerRef, true);
    } else {
      setIsActive(false);
    }
  }, [currentTime]);

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
    const currTime = time?.start;
    if (player) {
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

  // Annotations with purpose tagging are displayed as tags next to time
  const tags = value.filter((v) => v.purpose.includes('tagging'));
  // Annotations with purpose commenting/supplementing/transcribing are displayed as text
  const texts = value.filter(
    (v) => SUPPORTED_MOTIVATIONS.some(m => v.purpose.includes(m))
  );

  if (canDisplay) {
    return (
      <li
        key={`li_${id}`}
        ref={annotationRef}
        onClick={handleOnClick}
        data-testid="annotation-row"
        className={cx(
          "ramp--annotations__annotation-row",
          isActive && 'active'
        )}
      >
        <div key={`row_${id}`} className="ramp--annotations__annotation-row-time-tags">
          <div key={`times_${id}`} className="ramp--annotations__annotation-times">
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
          <div key={`tags_${id}`} className="ramp--annotations__annotation-tags">
            {tags?.length > 0 && tags.map((tag, index) => {
              return (
                <p
                  key={`tag_${index}`}
                  className="ramp--annotations__annotation-tag"
                  style={{ backgroundColor: tag.tagColor }}>
                  {tag.value}
                </p>
              );
            })}
          </div>
        </div>
        {texts?.length > 0 && texts.map((text, index) => {
          return (
            <p
              key={`text_${index}`}
              className="ramp--annotations__annotation-text"
              dangerouslySetInnerHTML={{ __html: text.value }}>
            </p>
          );
        })}
      </li>
    );
  } else {
    return null;
  }
};

AnnotationRow.propTypes = {
  annotation: PropTypes.object.isRequired,
  displayMotivations: PropTypes.array.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired,
  containerRef: PropTypes.object.isRequired,
};

export default AnnotationRow;
