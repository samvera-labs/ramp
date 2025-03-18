import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { autoScroll, CANVAS_MESSAGE_TIMEOUT } from '@Services/utility-helpers';
import { LockedSVGIcon } from '@Services/svg-icons';
import { useActiveStructure, useCollapseExpandAll } from '@Services/ramp-hooks';

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
  structureContainerRef
}) => {
  const liRef = useRef(null);

  const { isCollapsed, updateSectionStatus } = useCollapseExpandAll();
  // Root structure items are always expanded
  const [sectionIsCollapsed, setSectionIsCollapsed] = useState(isRoot ? false : true);

  // Identify item as a SectionHeading for canvases in non-playlist contexts
  const isSectionHeading = useMemo(() => { return isCanvas && !isPlaylist; }, [isCanvas, isPlaylist]);
  const hasChildren = useMemo(() => { return items?.length > 0; }, [items]);

  const { currentNavItem, handleClick, isActiveLi,
    isActiveSection, isPlaylist, isPlaying, screenReaderTime } = useActiveStructure({
      itemId: id,
      liRef: isSectionHeading ? sectionRef : liRef,
      sectionRef,
      structureContainerRef,
      isCanvas,
      isEmpty,
      canvasDuration,
      setSectionIsCollapsed
    });

  /*
    Auto-scroll active structure item into view only when user is not actively
    interacting with structured navigation
  */
  useEffect(() => {
    if (liRef.current && currentNavItem?.id == id
      && liRef.current.isClicked != undefined && !liRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined
      && !structureContainerRef.current.isScrolling) {
      autoScroll(liRef.current, structureContainerRef);
    }
    // Reset isClicked if active structure item is set
    if (liRef.current) {
      liRef.current.isClicked = false;
    }
  }, [currentNavItem]);

  // Build aria-label based on the structure item and context
  const ariaLabel = useMemo(() => {
    if (isPlaylist) {
      return isEmpty
        ? `Restricted playlist item ${itemIndex} of ${sectionCount}, with label ${label} starts a ${CANVAS_MESSAGE_TIMEOUT / 1000} 
          second timer to auto-advance to next playlist item`
        : `Playlist item ${itemIndex} of ${sectionCount}, with label ${label} starting at ${screenReaderTime}`;
    } else if (isSectionHeading) {
      return id != undefined
        ? `Load media for Canvas ${itemIndex} of ${sectionCount}`
        : isRoot ? `Table of contents for ${label}` : `Section for Canvas ${itemIndex} of ${sectionCount} labelled ${label}`;
    } else {
      return `Structure item with label ${label} starting at ${screenReaderTime} in Canvas ${canvasIndex}`;
    }
  }, [screenReaderTime, isPlaylist, isSectionHeading]);

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
    if (isActiveSection) {
      toggleOpen(e);
    }
  };

  const handleSectionKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      handleSectionClick(e);
    }
  };

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
      <span className='collapse-expand-button'
        tabIndex={-1}
        aria-expanded={!sectionIsCollapsed ? 'true' : 'false'}
        aria-label={`${!sectionIsCollapsed ? 'Collapse' : 'Expand'} ${label} section`}
        data-testid='section-collapse-icon' onClick={toggleOpen}>
        <i className={cx(
          'arrow', !sectionIsCollapsed ? 'up' : 'down')}></i>
      </span>
    );
  };

  const renderListItem = () => {
    return (
      <Fragment key={rangeId}>
        {isSectionHeading // Render items as SectionHeadings in non-playlist contexts
          ? (
            <div className='ramp--structured-nav__section ramp--structured-nav__section-head-buttons'
              data-mediafrag={id ?? ''}
              tabIndex={-1}>
              <button
                data-testid={id == undefined ? 'listitem-section-span' : 'listitem-section-button'}
                ref={sectionRef}
                onClick={id != undefined ? handleSectionClick : null}
                onKeyDown={id != undefined ? handleSectionKeyDown : null}
                aria-label={ariaLabel}
                role="button"
                className={cx(
                  'ramp--structured-nav__section-title',
                  !id && 'not-clickable',
                  isActiveSection ? 'active' : ''
                )}
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
              (<span className='ramp--structured-nav__item-title'
                aria-label={label}
              >
                {label}
              </span>)
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


  const handleKeyDown = (e) => {
    e.preventDefault();
    console.log('Item: ', label, ' on focus');
    if (e.key === 'Enter' || e.key === 'Space') {
      handleClick(e);
      // Click section/timespan
    }
  };

  if (label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        role={isClickable ? "treeitem" : "presentation"}
        className={cx(
          'ramp--structured-nav__list-item',
          isSectionHeading ? 'section-list-item' : '',
          isActiveLi ? 'active' : '')
        }
        data-label={label}
        data-summary={summary}
        aria-expanded={items?.length > 0 ? 'true' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {renderListItem()}
        {(!sectionIsCollapsed || hasChildren) && (
          <ul className='ramp--structured-nav__list' role='group'>
            {items.map((item, index) => {
              return (
                <TreeNode
                  {...item}
                  key={index}
                  sectionCount={sectionCount}
                  sectionRef={sectionRef}
                  structureContainerRef={structureContainerRef}
                />
              );
            })}
          </ul>
        )}
      </li>
    );
  }
};

export default TreeNode;
