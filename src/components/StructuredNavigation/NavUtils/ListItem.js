import React from 'react';
import List from './List';
import PropTypes from 'prop-types';
import { usePlayerDispatch } from '../../../context/player-context';
import { useManifestState } from '../../../context/manifest-context';
import { autoScroll, checkSrcRange, getMediaFragment } from '@Services/utility-helpers';
import SectionHeading from './SectionHeading';

const LockedSVGIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '0.75rem', width: '0.75rem' }} className="structure-item-locked"
    >
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 
          1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 
          10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 
          21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 
          20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 
          10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 
          5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 
          10.0036V8Z" fill="#000000" />
      </g>
    </svg>
  );
};

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
        aria-label={itemLabelRef.current}
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
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  canvasDuration: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

export default ListItem;
