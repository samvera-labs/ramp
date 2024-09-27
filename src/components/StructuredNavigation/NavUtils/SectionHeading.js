import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { autoScroll } from '@Services/utility-helpers';
import List from './List';
import { useActiveStructure } from '@Services/ramp-hooks';

const SectionHeading = ({
  duration,
  label,
  itemIndex,
  sectionRef,
  itemId,
  isRoot = false,
  structureContainerRef,
  hasChildren = false,
  items,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = (e) => {
    setIsOpen(!isOpen);
    sectionRef.current.isOpen = true;
  };

  const { isActiveSection, canvasIndex, handleClick, isPlaylist } = useActiveStructure({
    itemIndex, isRoot,
    itemId,
    liRef: sectionRef,
    sectionRef,
    isCanvas: true,
    canvasDuration: duration,
    setIsOpen
  });

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  React.useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current
      && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined
      && !structureContainerRef.current.isScrolling) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    sectionRef.current.isClicked = false;
  }, [canvasIndex]);

  const collapsibleButton = () => {
    return (<button className='collapse-expand-button'
      data-testid='section-collapse-icon' onClick={toggleOpen}>
      <i className={cx(
        'arrow', isOpen ? 'up' : 'down')}></i>
    </button>);
  };

  return (
    <div className={cx(
      'ramp--structured-nav__section',
      isActiveSection ? ' active' : ''
    )}
      role="listitem" data-testid="listitem-section"
      ref={sectionRef} data-label={label}
      data-mediafrag={itemId ?? ''}>
      <div className="section-head-buttons">
        <button
          data-testid={itemId == undefined ? "listitem-section-span" : "listitem-section-button"}
          ref={sectionRef} onClick={handleClick}
          className={cx(
            'ramp--structured-nav__section-title',
            !itemId && 'not-clickable'
          )}>
          <span className="ramp--structured-nav__title"
            aria-label={label}
            role="listitem"
          >
            {isRoot ? '' : `${itemIndex}. `}
            {label}
            {duration != '' &&
              <span className="ramp--structured-nav__section-duration">
                {duration}
              </span>}
          </span>
        </button>
        {hasChildren && collapsibleButton()}
      </div>
      {isOpen && hasChildren && (
        <List
          items={items}
          sectionRef={sectionRef}
          key={itemId}
          structureContainerRef={structureContainerRef}
          isPlaylist={isPlaylist} />
      )}
    </div>
  );
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
  items: PropTypes.array,
};

export default SectionHeading;
