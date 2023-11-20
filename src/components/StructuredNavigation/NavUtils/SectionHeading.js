import React from 'react';
import PropTypes from 'prop-types';

const SectionHeading = ({
  duration,
  label,
  itemIndex,
  canvasIndex,
  sectionRef,
  itemId,
  handleClick
}) => {
  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  /* Mark section heading as active when the current canvas index
  is equal to the item's index
  */
  React.useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current) {
      sectionRef.current.className += ' active';
    }
  }, [canvasIndex]);

  if (itemId != undefined) {
    return (
      <div className="ramp--structured-nav__section" data-testid="listitem-section"
        ref={sectionRef} data-mediafrag={itemId} data-label={itemLabelRef.current}>
        <button data-testid="listitem-section-button"
          ref={sectionRef} onClick={handleClick}>
          <span className="ramp--structured-nav__title"
            role="listitem"
            aria-label={itemLabelRef.current}
          >
            {`${itemIndex}. `}
            {itemLabelRef.current}
            {duration != '' &&
              <span className="ramp--structured-nav__section-duration">
                {duration}
              </span>}
          </span>
        </button>
      </div>
    );
  } else {
    return (
      <div className="ramp--structured-nav__section" data-testid="listitem-section"
        ref={sectionRef} data-label={itemLabelRef.current}>
        <span className="ramp--structured-nav__section-title"
          role="listitem"
          data-testid="listitem-section-span"
          aria-label={itemLabelRef.current}
        >
          {`${itemIndex}. `}
          {itemLabelRef.current}
          {duration != '' &&
            <span className="ramp--structured-nav__section-duration">
              {duration}
            </span>
          }
        </span>
      </div>
    );
  }
};

SectionHeading.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  canvasIndex: PropTypes.number,
  duration: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sectionRef: PropTypes.object.isRequired,
  itemId: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};

export default SectionHeading;
