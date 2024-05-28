import React from 'react';
import List from './List';
import PropTypes from 'prop-types';
import { usePlayerDispatch } from '../../../context/player-context';
import { useManifestState } from '../../../context/manifest-context';
import { autoScroll, checkSrcRange, getMediaFragment } from '@Services/utility-helpers';
import { LockedSVGIcon } from '@Services/svg-icons';
import SectionHeading from './SectionHeading';

const ListItem = ({
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
  canvasDuration,
  sectionRef,
  structureContainerRef
}) => {
  const playerDispatch = usePlayerDispatch();
  const { canvasIndex, currentNavItem, playlist } = useManifestState();
  const { isPlaylist } = playlist;

  let itemIdRef = React.useRef();
  itemIdRef.current = id;

  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  let itemSummaryRef = React.useRef();
  itemSummaryRef.current = summary;

  const subMenu =
    items && items.length > 0 ? (
      <List items={items} sectionRef={sectionRef}
        structureContainerRef={structureContainerRef}
      />
    ) : null;

  const liRef = React.useRef(null);

  const handleClick = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { start, end } = getMediaFragment(itemIdRef.current, canvasDuration);
    const inRange = checkSrcRange({ start, end }, { end: canvasDuration });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({ clickedUrl: itemIdRef.current, type: 'navClick' });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
    }
  });

  React.useEffect(() => {
    /*
      Auto-scroll active structure item into view only when user is not actively
      interacting with structured navigation
    */
    if (liRef.current && currentNavItem?.id == itemIdRef.current
      && liRef.current.isClicked != undefined && !liRef.current.isClicked
      && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling) {
      autoScroll(liRef.current, structureContainerRef);
    }
    liRef.current.isClicked = false;
  }, [currentNavItem]);

  const renderListItem = () => {
    return (
      <React.Fragment key={rangeId}>
        {/* For playlist views omit the accordion style display of structure for canvas-level items */}
        {isCanvas && !isPlaylist
          ?
          <React.Fragment>
            <SectionHeading
              itemIndex={itemIndex}
              canvasIndex={canvasIndex}
              duration={duration}
              label={label}
              sectionRef={sectionRef}
              itemId={itemIdRef.current}
              isRoot={isRoot}
              handleClick={handleClick}
              structureContainerRef={structureContainerRef}
            />
          </React.Fragment>
          :
          <React.Fragment>
            {isTitle
              ?
              (<span className="ramp--structured-nav__item-title"
                role="listitem"
                aria-label={itemLabelRef.current}
              >
                {itemLabelRef.current}
              </span>)
              : (
                <React.Fragment key={id}>
                  <div className="tracker"></div>
                  {isClickable ? (
                    <React.Fragment>
                      {isEmpty && <LockedSVGIcon />}
                      <a role="listitem"
                        href={homepage && homepage != '' ? homepage : itemIdRef.current}
                        onClick={handleClick}>
                        {`${itemIndex}. `}{itemLabelRef.current} {duration.length > 0 ? ` (${duration})` : ''}
                      </a>
                    </React.Fragment>
                  ) : (
                    <span role="listitem" aria-label={itemLabelRef.current}>{itemLabelRef.current}</span>
                  )}
                </React.Fragment>
              )
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  };

  if (label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        className={
          'ramp--structured-nav__list-item' +
          `${(itemIdRef.current != undefined && (currentNavItem?.id === itemIdRef.current)
            && (isPlaylist || !isCanvas) && currentNavItem?.canvasIndex === canvasIndex + 1)
            ? ' active'
            : ''
          }`
        }
        data-label={itemLabelRef.current}
        data-summary={itemSummaryRef.current}
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
  duration: PropTypes.string.isRequired,
  id: PropTypes.string,
  isTitle: PropTypes.bool.isRequired,
  isCanvas: PropTypes.bool.isRequired,
  isClickable: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string,
  homepage: PropTypes.string,
  isRoot: PropTypes.bool,
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  canvasDuration: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

export default ListItem;
