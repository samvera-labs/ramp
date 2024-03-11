import React from 'react';
import PropTypes from 'prop-types';
import { autoScroll } from '@Services/utility-helpers';

const SectionHeading = ({
  duration,
  label,
  itemIndex,
  canvasIndex,
  sectionRef,
  itemId,
  handleClick,
  structureContainerRef
}) => {
  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  // Auto-scroll active section into view
  React.useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
  }, [canvasIndex]);

  const sectionClassName = `ramp--structured-nav__section${canvasIndex + 1 === itemIndex ? ' active' : ''}`;

  if (itemId != undefined) {
    return (
      <div className={sectionClassName}
        role="listitem" data-testid="listitem-section"
        ref={sectionRef} data-mediafrag={itemId} data-label={itemLabelRef.current}>
        <button data-testid="listitem-section-button"
          ref={sectionRef} onClick={handleClick}>
          <span className="ramp--structured-nav__title"
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
      <div className={sectionClassName}
        data-testid="listitem-section"
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
  structureContainerRef: PropTypes.object.isRequired,
};

export default SectionHeading;
