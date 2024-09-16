import React from 'react';
import PropTypes from 'prop-types';
import { autoScroll } from '@Services/utility-helpers';
import List from './List';
import { useActiveSection, useActiveStructure } from '@Services/structure';

const SectionHeading = ({
  duration,
  label,
  itemIndex,
  canvasIndex,
  sectionRef,
  itemId,
  isRoot,
  structureContainerRef,
  hasChildren,
  items,
}) => {
  let itemIdRef = React.useRef();
  itemIdRef.current = itemId;

  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  const { handleClick } = useActiveStructure({
    itemIdRef,
    liRef: sectionRef,
    sectionRef,
    structureContainerRef,
    isCanvas: true,
    canvasDuration: duration
  });

  const { isActive } = useActiveSection({ itemIndex });

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = (e) => {
    setIsOpen(!isOpen);
    sectionRef.current.isOpen = true;
  };

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

  const sectionClassName = `ramp--structured-nav__section${isActive}`;

  if (itemId != undefined) {
    return (
      <div className={sectionClassName}
        role="listitem" data-testid="listitem-section"
        ref={sectionRef} data-mediafrag={itemId} data-label={itemLabelRef.current}>
        <div className="section-head-buttons">
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
          {hasChildren && <button className="collapse-expand-button" onClick={toggleOpen}>
            {isOpen ? "-" : "+"}
          </button>}
        </div>
        {isOpen && hasChildren && (
          <List
            items={items}
            sectionRef={sectionRef}
            key={itemId}
            structureContainerRef={structureContainerRef}
          />
        )}
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
  structureContainerRef: PropTypes.object.isRequired,
  hasChildren: PropTypes.bool,
};

export default SectionHeading;
