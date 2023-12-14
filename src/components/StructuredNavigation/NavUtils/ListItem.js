import React from 'react';
import List from './List';
import PropTypes from 'prop-types';
import { usePlayerDispatch } from '../../../context/player-context';
import { useManifestState } from '../../../context/manifest-context';
import SectionHeading from './SectionHeading';

const LockedSVGIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '0.75rem', width: '0.75rem' }} className="structure-item-locked"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
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
  items,
  itemIndex,
  rangeId,
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

    playerDispatch({ clickedUrl: itemIdRef.current, type: 'navClick' });
  });

  React.useEffect(() => {
    /* Add 'active' class only when the current item is
    either a playlist item when a playlist manifest is displayed
    or a non-canvase level item when a regular manifest is displayed  */
    if ((liRef.current && isPlaylist) || (liRef.current && !isCanvas)) {
      if (currentNavItem && currentNavItem.id == itemIdRef.current) {
        liRef.current.className += ' active';
        autoScroll(liRef.current);
      } else if (
        (currentNavItem == null || currentNavItem.id != itemIdRef.current) &&
        liRef.current.classList.contains('active')
      ) {
        liRef.current.className -= ' active';
      }
    }
  }, [currentNavItem]);

  const autoScroll = (currentItem) => {
    let currentItemOffset = currentItem.offsetTop;

    // Scroll the current active item into the view within
    // the StructuredNavigation component
    structureContainerRef.current.scrollTop =
      ((currentItemOffset / 2) - structureContainerRef.current.clientHeight);
  };

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
                      <a href={itemIdRef.current} onClick={handleClick}>
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
        className="ramp--structured-nav__list-item"
        aria-label={itemLabelRef.current}
        role="listitem"
        data-label={itemLabelRef.current}
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
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

export default ListItem;
