
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { timeToHHmmss } from '@Services/utility-helpers';
import { useAnnotations, useMediaPlayer } from '@Services/ramp-hooks';

const AnnotationRow = ({ annotation, displayMotivations }) => {
  const { id, canvasId, motivation, time, value } = annotation;
  const { start, end } = time;

  const { player } = useMediaPlayer();
  const { isCurrentCanvas } = useAnnotations({ canvasId });

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
   * Seek the player to;
   * - start time of an Annotation with a time range
   * - timestamp of an Annotation with a single time-point
   * on click event on each Annotation
   */
  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    if (isCurrentCanvas) {
      const currentTime = start;
      if (player) {
        const { start, end } = player.targets[0];
        switch (true) {
          case currentTime >= start && currentTime <= end:
            player.currentTime(currentTime);
            break;
          case currentTime < start:
            player.currentTime(start);
            break;
          case currentTime > end:
            player.currentTime(end);
            break;
        }
      }
    }
  }, [annotation, player]);

  // Annotations with purpose tagging are displayed as tags next to time
  const tags = value.filter((v) => v.purpose.includes('tagging'));
  // Annotations with purpose commenting/supplementing are displayed as text
  const texts = value.filter(
    (v) => v.purpose.includes('commenting') || v.purpose.includes('supplementing')
  );

  if (canDisplay) {
    return (
      <li
        key={`li_${id}`}
        onClick={handleOnClick}
        data-testid="annotation-row"
        className="ramp--annotations__annotation-row"
      >
        <div key={`row_${id}`} className="ramp--annotations__annotation-row-time-tags">
          <div key={`times_${id}`} className="ramp--annotations__annotation-times">
            {start != undefined && (
              <span
                className="ramp--annotations__annotation-start-time"
                data-testid="annotation-start-time"
              >
                {timeToHHmmss(start, true)}
              </span>
            )}
            {end != undefined && (
              <span
                className="ramp--annotations__annotation-end-time"
                data-testid="annotation-end-time"
              >
                {` - ${timeToHHmmss(end, true)}`}
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
};

export default AnnotationRow;
