import React, { useEffect, useMemo, useState } from 'react';
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
  const { isCollapsed, updateSectionStatus } = useCollapseExpandAll();
  // Root structure items are always expanded
  const [sectionIsCollapsed, setSectionIsCollapsed] = useState(isRoot ? false : true);

  const toggleOpen = () => {
    // Update collapse/expand status in the component state
    setSectionIsCollapsed(!sectionIsCollapsed);
    /**
     * Update section status in 'useCollapseExpandAll' hook, to keep track of
     * collapse/expand statuses of each section in UI. When all these are manually updated,
     * use it to change the 'isCollapsed' global state variable accordingly.
     */
    updateSectionStatus(itemIndex - 1, !sectionIsCollapsed);
  };

  const { isActiveSection, canvasIndex, handleClick, isPlaying } = useActiveStructure({
    itemIndex, isRoot,
    itemId,
    liRef: sectionRef,
    sectionRef,
    structureContainerRef,
    isCanvas: true,
    isEmpty: false,
    canvasDuration: duration,
    setSectionIsCollapsed
  });

  // Collapse/Expand section when all sections are collapsed/expanded respectively
  useEffect(() => {
    // Do nothing for root structure items
    if (!isRoot) setSectionIsCollapsed(isCollapsed);
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

  useEffect(() => {
    if (isPlaying && isActiveSection) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
  }, [isPlaying]);

  const collapsibleButton = () => {
    return (
      <button className='collapse-expand-button'
        aria-expanded={!sectionIsCollapsed ? 'true' : 'false'}
        aria-label={`${!sectionIsCollapsed ? 'Collapse' : 'Expand'} ${label} section`}
        data-testid='section-collapse-icon' onClick={toggleOpen}>
        <i className={cx(
          'arrow', !sectionIsCollapsed ? 'up' : 'down')}></i>
      </button>);
  };

  const ariaLabel = useMemo(() => {
    return itemId != undefined
      ? `Load media for Canvas ${itemIndex} labelled ${label} into the player`
      : isRoot ? `Table of contents for ${label}` : `Section for Canvas ${itemIndex} labelled ${label}`;
  }, [itemId]);

  return (
    <div className={cx(
      'ramp--structured-nav__section',
      isActiveSection ? 'active' : ''
    )}
      role='listitem' data-testid='listitem-section'
      ref={sectionRef} data-label={label}
      data-mediafrag={itemId ?? ''}>
      <div className='ramp--structured-nav__section-head-buttons'>
        <button
          data-testid={itemId == undefined ? 'listitem-section-span' : 'listitem-section-button'}
          ref={sectionRef}
          onClick={itemId != undefined ? handleClick : null}
          aria-label={ariaLabel}
          className={cx(
            'ramp--structured-nav__section-title',
            !itemId && 'not-clickable'
          )}>
          <span className='ramp--structured-nav__title' aria-label={label}>
            {isRoot ? '' : `${itemIndex}.`}
            <span className='ramp--structured-nav__section-label'>{label}</span>
            {duration != '' &&
              <span className='ramp--structured-nav__section-duration'>
                {duration}
              </span>}
          </span>
        </button>
        {/* Root is rendered as a non-collapsible section */}
        {hasChildren && !isRoot && collapsibleButton()}
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
