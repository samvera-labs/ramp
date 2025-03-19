import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import List from './List';
import SectionHeading from './SectionHeading';
import PropTypes from 'prop-types';
import { autoScroll, CANVAS_MESSAGE_TIMEOUT } from '@Services/utility-helpers';
import { LockedSVGIcon } from '@Services/svg-icons';
import { useActiveStructure } from '@Services/ramp-hooks';

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
 * @param {Array} props.items list of children for the item
 * @param {Number} props.itemIndex index of the item within the section/canvas
 * @param {String} props.rangeId unique id of the item
 * @param {Object} props.sectionRef React ref of the section element associated with the item
 * @param {Object} props.structureContainerRef React ref of the structure container
 */
const ListItem = ({
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
  sectionRef,
  structureContainerRef,
  times,
}) => {
  const liRef = useRef(null);

  const { handleClick, isActiveLi, currentNavItem, isPlaylist, screenReaderTime } = useActiveStructure({
    itemId: id, liRef, sectionRef, structureContainerRef,
    isCanvas,
    isEmpty,
    canvasDuration,
    times,
  });

  // Identify item as a SectionHeading for canvases in non-playlist contexts
  const isSectionHeading = isCanvas && !isPlaylist;

  // Build rest of structure items for li items, i.e. non-SectionHeadings
  const subMenu =
    items && items.length > 0 && !isSectionHeading ? (
      <List items={items} sectionRef={sectionRef}
        structureContainerRef={structureContainerRef}
      />
    ) : null;

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
        ? `Restricted playlist item labelled ${label} starts a ${CANVAS_MESSAGE_TIMEOUT / 1000} 
        second timer to auto-advance to next playlist item`
        : `Playlist item labelled ${label} starting at ${screenReaderTime}`;
    } else {
      return `Structure item labelled ${label} starting at ${screenReaderTime} in Canvas ${canvasIndex}`;
    }
  }, [screenReaderTime, isPlaylist]);

  const renderListItem = () => {
    return (
      <Fragment key={rangeId}>
        {isSectionHeading // Render items as SectionHeadings in non-playlist contexts
          ? <SectionHeading
            key={`${label}-${itemIndex}`}
            itemIndex={itemIndex}
            duration={duration}
            label={label}
            sectionRef={sectionRef}
            itemId={id}
            isRoot={isRoot}
            structureContainerRef={structureContainerRef}
            hasChildren={items?.length > 0}
            items={items}
            times={times} />
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
                    <>
                      <a
                        role='button'
                        className='ramp--structured-nav__item-link'
                        href={homepage && homepage != '' ? homepage : id}
                        aria-label={ariaLabel}
                        onClick={handleClick}>
                        {isEmpty && <LockedSVGIcon />}
                        {`${itemIndex}.`}
                        <span className='structured-nav__item-label' aria-label={label}>
                          {label} {duration.length > 0 ? ` (${duration})` : ''}
                        </span>
                      </a>
                    </>
                  ) : (
                    <span aria-label={label}>{label}</span>
                  )}
                </Fragment>
              )
            }
          </>}
      </Fragment>
    );
  };

  if (label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        role="listitem"
        className={cx(
          'ramp--structured-nav__list-item',
          isSectionHeading ? 'section-list-item' : '',
          isActiveLi ? 'active' : '')
        }
        data-label={label}
        data-summary={summary}
      >
        {renderListItem()}
        {subMenu}
      </li>
    );
  } else {
    return null;
  }
};

ListItem.propTypes = {
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
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
  times: PropTypes.object.isRequired,
};

export default ListItem;
