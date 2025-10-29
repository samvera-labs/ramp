import React, { createRef, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { autoScroll, CANVAS_MESSAGE_TIMEOUT } from '@Services/utility-helpers';
import { LockedSVGIcon } from '@Services/svg-icons';
import { useActiveStructure, useCollapseExpandAll } from '@Services/ramp-hooks';

/**
 * Build leaf-level nodes in the structures in Manifest. These nodes can be
 * either timespans (with media fragment) or titles (w/o media fragment).
 * @param {Object} props
 * @param {Number} props.canvasDuration duration of the Canvas associated with the item
 * @param {Number} props.canvasIndex index of the Canvas associated with the item
 * @param {Number} props.duration duration of the item
 * @param {String} props.id media fragemnt of the item
 * @param {Boolean} props.isTitle flag to indicate item w/o mediafragment
 * @param {Boolean} props.isCanvas flag to indicate item is at Canvas-level
 * @param {Boolean} props.isClickable flag to indicate item is within resource duration
 * @param {Boolean} props.isEmpty flag to indicate Canvas associated with item is inaccessible
 * @param {String} props.label text label of the item
 * @param {String} props.summary summary associated with the item (in playlist context)
 * @param {String} props.homepage homepage associated with the item (in playlist context)
 * @param {String} props.isRoot root level node for structure
 * @param {Array} props.items list of children for the item
 * @param {Number} props.itemIndex index of the item within the section/canvas
 * @param {String} props.rangeId unique id of the item
 * @param {Number} props.sectionCount total number of sections in structure
 * @param {Object} props.sectionRef React ref of the section element associated with the item
 * @param {Object} props.structureContainerRef React ref of the structure container
 * @param {Object} props.times start and end times of structure item
 * @param {Function} props.setFocusedItem set the focused item as active item for keyboard navigation
 */
const TreeNode = ({
  canvasDuration,
  canvasIndex,
  duration,
  id,
  isTitle,
  isCanvas,
  isClickable,
  isEmpty,
  label,
  summary,
  homepage,
  isRoot,
  items,
  itemIndex,
  rangeId,
  sectionCount,
  sectionRef,
  structureContainerRef,
  times,
  setFocusedItem,
}) => {
  const liRef = useRef(null);

  const { isCollapsed, updateSectionStatus } = useCollapseExpandAll();
  // Root structure items are always expanded
  const [sectionIsCollapsed, setSectionIsCollapsed] = useState(isRoot ? false : true);

  const { currentNavItem, handleClick, isActiveLi,
    isActiveSection, isPlaylist, screenReaderTime } = useActiveStructure({
      itemId: id,
      itemIndex,
      liRef,
      sectionRef,
      structureContainerRef,
      isCanvas,
      isEmpty,
      canvasDuration,
      setSectionIsCollapsed,
      times,
    });

  // Identify item as a section for canvases in non-playlist contexts
  const isSection = useMemo(() => { return isCanvas && !isPlaylist; }, [isCanvas, isPlaylist]);

  // Determine if the item has children
  const hasChildren = useMemo(() => { return items?.length > 0; }, [items]);

  /*
    Auto-scroll active structure item with mediafragment into view only when user 
    is not actively interacting with structured navigation
  */
  useEffect(() => {
    if (liRef.current && currentNavItem?.id == id
      && liRef.current.isClicked != undefined && !liRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined
      && !structureContainerRef.current.isScrolling
      && !isTitle) {
      autoScroll(liRef.current, structureContainerRef);
    }
    // Reset isClicked if active structure item is set
    if (liRef.current) {
      liRef.current.isClicked = false;
    }
  }, [currentNavItem]);

  // Collapse/Expand section when all sections are collapsed/expanded respectively
  useEffect(() => {
    // Do nothing for root structure items
    if (!isRoot && isCollapsed != sectionIsCollapsed) setSectionIsCollapsed(isCollapsed);
  }, [isCollapsed]);

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  useEffect(() => {
    if (canvasIndex + 1 === itemIndex && sectionRef.current
      && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined
      && !structureContainerRef.current.isScrolling
      && isSection) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    if (sectionRef.current) sectionRef.current.isClicked = false;
  }, [canvasIndex, isSection]);

  useEffect(() => {
    if (isActiveSection && isSection) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
  }, [isActiveSection, isSection]);

  // Build aria-label based on the structure item and context
  const ariaLabel = useMemo(() => {
    if (isPlaylist) {
      return isEmpty
        ? `Restricted playlist item ${itemIndex}${label} starts a ${CANVAS_MESSAGE_TIMEOUT / 1000} 
          second timer to auto-advance to next playlist item`
        : `Playlist item ${itemIndex}${label} ${duration} starting at ${screenReaderTime}`;
    } else if (isSection) {
      return id != undefined
        ? `Load media for Canvas ${itemIndex},${label},${duration}`
        : isRoot ? `Table of contents for ${label},${duration}` : `Section for Canvas ${itemIndex}${label},${duration}`;
    } else {
      return `Structure item with label ${itemIndex}${label} ${duration} starting at ${screenReaderTime} in Canvas ${canvasIndex}`;
    }
  }, [screenReaderTime, isPlaylist, isSection]);

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

  // Handle click on section heading button
  const handleSectionClick = (e) => {
    handleClick(e);
    if (isActiveSection) toggleOpen();
  };

  /**
   * Handle keydown event when focused on a clickable section item.
   * When the section doesn't have a Canvas linked to it, simply perform UI
   * updates of expand/collapse of the focused section for recognized keydown
   * events.
   * @param {Event} e 
   */
  const handleSectionKeyDown = (e) => {
    // Expand section and update player for keypresses on Enter/Space keys
    if (e.keyCode === 13 || e.keyCode === 32) {
      // Update state only for time-synced sections, i.e. Canvas ref with a mediafragment
      if (id != undefined) handleClick(e);
      // Only toggle collapsible section is it's collapsed
      if (sectionIsCollapsed) toggleOpen();
    }
    // If the section is collapsed, toggle it on ArrowRight keypress
    if (e.keyCode == 39 && sectionIsCollapsed) {
      toggleOpen();
    }
    // If the section is expanded, toggle it on ArrowLeft keypress
    if (e.keyCode === 37 && !sectionIsCollapsed) {
      toggleOpen();
      /**
       * When section is collapsed update the focused item in StructuredNavigation 
       * to move focus to the next section on next ArrowDown keypress.
       * activeItem is used in the keydown event handler to re-calculate the next
       * focusable item in the UI outside of the collapsed section.
       */
      setFocusedItem(e.target);
    }
    // If the section is expanded, move focus to the first child on ArrowRight keypress
    if (e.keyCode === 39 && !sectionIsCollapsed && liRef.current) {
      const children = liRef.current.querySelectorAll('a.ramp--structured-nav__item-link');
      if (children?.length > 0) {
        children[0].focus();
        setFocusedItem(children[0]);
      }
      e.stopPropagation();
    }
  };

  const handleLinkKeyDown = (e) => {
    // ArrowRight keypress does nothing, prevent +5 second jump in playerHotKeys
    if (e.keyCode === 39) {
      e.stopPropagation();
    }
    // ArrowLeft kepress moves the focus to the current section item
    if (e.keyCode === 37 && sectionRef.current) {
      sectionRef.current.focus();
      /**
       * Set activeItem as the current section item. 
       * This helps to navigate to the first child on the next ArrowDown keypress 
       * event without jumping to the previously focused child.
       */
      setFocusedItem(sectionRef.current);
    }
    // Activate the timespan link on Space key press
    if (e.keyCode === 32) {
      handleClick(e);
    }
  };

  const collapsibleButton = () => {
    return (
      <span className='collapse-expand-button'
        tabIndex={-1}
        role='button'
        aria-expanded={!sectionIsCollapsed ? 'true' : 'false'}
        aria-label={`${!sectionIsCollapsed ? 'Collapse' : 'Expand'} ${label} section`}
        data-testid='section-collapse-icon' onClick={toggleOpen}>
        <i className={cx(
          'arrow', !sectionIsCollapsed ? 'up' : 'down')}></i>
      </span>
    );
  };

  const renderTreeNode = () => {
    return (
      <Fragment key={rangeId}>
        {isSection // Render items as SectionHeadings in non-playlist contexts
          ? (
            <div className={cx(
              'ramp--structured-nav__section',
              'ramp--structured-nav__section-head-buttons',
              isActiveSection ? 'active' : ''
            )}
              data-testid='treeitem-section'
              data-mediafrag={id ?? ''}
              tabIndex={-1}
            >
              <button
                data-testid={id == undefined ? 'treeitem-section-span' : 'treeitem-section-button'}
                ref={sectionRef}
                /**
                 * Attach onClick handler only for sections with a Canvas reference.
                 * For non-time synced sections, this function is provided via the
                 * click handler in collapse/expand arrow button.
                 */
                onClick={id != undefined ? handleSectionClick : null}
                onKeyDown={handleSectionKeyDown}
                aria-label={ariaLabel}
                role='button'
                className={cx(
                  'ramp--structured-nav__section-title',
                  id == undefined && 'not-clickable',
                  isActiveSection ? 'active' : ''
                )}
                tabIndex={-1}
              >
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
            </div>)
          : <>
            {isTitle
              ?
              (<span className='ramp--structured-nav__item-title'>{label}</span>)
              : (
                <Fragment key={id}>
                  <div className="tracker"></div>
                  {isClickable ? (
                    <a
                      role='button'
                      className='ramp--structured-nav__item-link'
                      href={homepage && homepage != '' ? homepage : id}
                      aria-label={ariaLabel}
                      onClick={handleClick}
                      onKeyDown={handleLinkKeyDown}
                      tabIndex={-1}>
                      {isEmpty && <LockedSVGIcon />}
                      {`${itemIndex}.`}
                      <span className='structured-nav__item-label' aria-label={label}>
                        {label} {duration.length > 0 ? ` (${duration})` : ''}
                      </span>
                    </a>
                  ) : (
                    <span aria-label={label}>{label}</span>
                  )}
                </Fragment>
              )
            }
          </>
        }
      </Fragment>
    );
  };

  if (label != '') {
    return (
      <li
        data-testid='tree-item'
        ref={liRef}
        role='treeitem'
        className={cx(
          'ramp--structured-nav__tree-item',
          isSection ? 'section-tree-item' : '',
          isActiveLi ? 'active' : '')
        }
        data-label={label}
        data-summary={summary}
        aria-expanded={items?.length > 0 ? 'true' : undefined}
        aria-posinset={isPlaylist ? itemIndex : null}
      >
        {renderTreeNode()}
        {(!sectionIsCollapsed && hasChildren) && (
          <ul className='ramp--structured-nav__tree' role='group' data-testid='tree-group'>
            {items.map((item, index) => {
              // Create a new ref for sections, pass parent's ref for non-sections
              const childRef = (item.isCanvas && !isPlaylist) ? createRef() : sectionRef;
              return (
                <TreeNode
                  {...item}
                  key={index}
                  sectionCount={sectionCount}
                  sectionRef={childRef}
                  structureContainerRef={structureContainerRef}
                  setFocusedItem={setFocusedItem}
                />
              );
            })}
          </ul>
        )}
      </li>
    );
  }
};

TreeNode.propTypes = {
  canvasDuration: PropTypes.number.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  id: PropTypes.string,
  isTitle: PropTypes.bool.isRequired,
  isCanvas: PropTypes.bool.isRequired,
  isClickable: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string,
  homepage: PropTypes.string,
  isRoot: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  sectionCount: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
  times: PropTypes.object.isRequired,
  setFocusedItem: PropTypes.func,
};

export default TreeNode;
