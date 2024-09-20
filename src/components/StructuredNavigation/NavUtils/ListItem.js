import React from 'react';
import List from './List';
import PropTypes from 'prop-types';
import { autoScroll } from '@Services/utility-helpers';
import { LockedSVGIcon } from '@Services/svg-icons';
import { useActiveStructure } from '@Services/ramp-hooks';

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
  const liRef = React.useRef(null);

  const { handleClick, isActiveLi, currentNavItem, isPlaylist } = useActiveStructure({
    itemId: id, liRef, sectionRef,
    isCanvas,
    canvasDuration,
  });

  const subMenu =
    items && items.length > 0 ? (
      <List items={items} sectionRef={sectionRef}
        structureContainerRef={structureContainerRef}
        isPlaylist={isPlaylist}
      />
    ) : null;

  /*
    Auto-scroll active structure item into view only when user is not actively
    interacting with structured navigation
  */
  React.useEffect(() => {
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

  const renderListItem = () => {
    return (
      <React.Fragment key={rangeId}>
        <React.Fragment>
          {isTitle
            ?
            (<span className="ramp--structured-nav__item-title"
              role="listitem"
              aria-label={label}
            >
              {label}
            </span>)
            : (
              <React.Fragment key={id}>
                <div className="tracker"></div>
                {isClickable ? (
                  <React.Fragment>
                    {isEmpty && <LockedSVGIcon />}
                    <a role="listitem"
                      href={homepage && homepage != '' ? homepage : id}
                      onClick={handleClick}>
                      {`${itemIndex}. `}{label} {duration.length > 0 ? ` (${duration})` : ''}
                    </a>
                  </React.Fragment>
                ) : (
                  <span role="listitem" aria-label={label}>{label}</span>
                )}
              </React.Fragment>
            )
          }
        </React.Fragment>
      </React.Fragment>
    );
  };

  if (label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        className={`ramp--structured-nav__list-item${isActiveLi ? ' active' : ''}`}
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
