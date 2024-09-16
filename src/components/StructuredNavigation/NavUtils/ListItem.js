import React from 'react';
import List from './List';
import PropTypes from 'prop-types';
import { LockedSVGIcon } from '@Services/svg-icons';
import { useActiveStructure } from '@Services/structure';

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

  const { handleClick, isActive } = useActiveStructure({
    itemIdRef, liRef, sectionRef, structureContainerRef,
    isCanvas,
    canvasDuration,
  });

  const renderListItem = () => {
    return (
      <React.Fragment key={rangeId}>
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
      </React.Fragment>
    );
  };

  if (label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        className={`ramp--structured-nav__list-item'${isActive}`}
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
