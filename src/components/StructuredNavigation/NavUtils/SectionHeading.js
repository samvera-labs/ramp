import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { autoScroll } from '@Services/utility-helpers';
import List from './List';
import { useActiveStructure, useCollapseExpandAll } from '@Services/ramp-hooks';

/**
 * Build Canvas level range items. When the range has child elements nested make it
 * collapsible.
 * @param {Object} props
 * @param {Number} props.duration range duration
 * @param {Boolean} props.hasChildren flag to indicate presence of child structure in range
 * @param {String} props.itemId media fragment if associated with the range
 * @param {Number} props.itemIndex index of the canvas in structures
 * @param {Array} props.items list of children structure items in range 
 * @param {Boolean} props.isRoot flag to indicate root range on top of structures
 * @param {String} props.label text label to be displayed
 * @param {Object} props.sectionRef React ref of the section element associated with the item
 * @param {Object} props.structureContainerRef React ref of the structure container
 */
const SectionHeading = ({
  duration,
  hasChildren = false,
  itemId,
  itemIndex,
  items,
  isRoot = false,
  label,
  sectionRef,
  structureContainerRef,
}) => {
  const { isCollapsed } = useCollapseExpandAll();
  const [sectionIsCollapsed, setSectionIsCollapsed] = useState(true || isCollapsed);

  const toggleOpen = () => {
    setSectionIsCollapsed(!sectionIsCollapsed);
  };

  const { isActiveSection, canvasIndex, handleClick } = useActiveStructure({
    itemIndex, isRoot,
    itemId,
    liRef: sectionRef,
    sectionRef,
    isCanvas: true,
    canvasDuration: duration,
    setSectionIsCollapsed
  });

  // Collapse/Expand current section when all sections are collapsed/expanded respectively
  useEffect(() => {
    isCollapsed ? setSectionIsCollapsed(true) : setSectionIsCollapsed(false);
  }, [isCollapsed]);

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current
      && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined
      && !structureContainerRef.current.isScrolling) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    sectionRef.current.isClicked = false;
  }, [canvasIndex]);

  const collapsibleButton = () => {
    return (
      <button className='collapse-expand-button'
        data-testid='section-collapse-icon' onClick={toggleOpen}>
        <i className={cx(
          'arrow', !sectionIsCollapsed ? 'up' : 'down')}></i>
      </button>);
  };

  return (
    <div className={cx(
      'ramp--structured-nav__section',
      isActiveSection ? 'active' : ''
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
      {!sectionIsCollapsed && hasChildren && (
        <List
          items={items}
          sectionRef={sectionRef}
          key={itemId}
          structureContainerRef={structureContainerRef} />
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
