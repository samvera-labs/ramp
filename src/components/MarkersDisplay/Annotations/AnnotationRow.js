
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { timeToHHmmss } from '@Services/utility-helpers';

const AnnotationRow = ({ annotation, displayMotivations }) => {
  const { id, canvasId, motivation, time, value } = annotation;
  const { start, end } = time;

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

  const handleOnClick = () => {
    console.log(value);
  };

  const tags = value.filter((v) => v.purpose.includes('tagging'));
  const texts = value.filter((v) => v.purpose.includes('commenting') || v.purpose.includes('supplementing'));

  if (canDisplay) {
    return (
      <li
        role="listitem"
        key={id}
        onClick={handleOnClick}
        data-testid="annotation-row"
        className="ramp--annotations__annotation-row"
      >
        <div className="ramp--annotations__annotation-row-time-tags">
          <div className="ramp--annotations__annotation-times">
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
          <div className="ramp--annotations__annotation-tags">
            {tags?.length > 0 && tags.map((tag) => {
              return <p className="ramp--annotations__annotation-tag">{tag.value}</p>;
            })}
          </div>
        </div>

        {texts?.length > 0 && texts.map((tag) => {
          return <p className="ramp--annotations__annotation-text">{tag.value}</p>;
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
