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
  isRoot,
  handleClick,
  structureContainerRef
}) => {
  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  React.useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current
      && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    sectionRef.current.isClicked = false;
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
          {isRoot ? '' : `${itemIndex}. `}
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
  isRoot: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
};

export default SectionHeading;
