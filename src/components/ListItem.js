import React from 'react';
import List from './List';
import {
  getChildCanvases,
  getLabelValue,
  getMediaFragment,
  getItemId,
  getCanvasId,
} from '../services/iiif-parser';
import PropTypes from 'prop-types';
import { usePlayerDispatch, usePlayerState } from '../context/player-context';
import {
  useManifestDispatch,
  useManifestState,
} from '../context/manifest-context';
import { checkSrcRange } from '@Services/utility-helpers';

const ListItem = ({ item, isTitle }) => {
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();
  const { manifest, currentNavItem, canvasIndex } = useManifestState();
  const { playerRange } = usePlayerState();

  const childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest,
  });

  const subMenu =
    item.items && item.items.length > 0 && childCanvases.length === 0 ? (
      <List items={item.items} isChild={true} />
    ) : null;
  const liRef = React.useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    playerDispatch({ clickedUrl: e.target.href, type: 'navClick' });
    manifestDispatch({ item: item, type: 'switchItem' });
  };

  const isClickable = () => {
    const itemId = getItemId(item);
    const timeFragment = getMediaFragment(itemId);
    const isCanvas = canvasIndex + 1 == getCanvasId(itemId);
    const isInRange = checkSrcRange(timeFragment, playerRange);
    return isInRange || !isCanvas;
  };

  const renderListItem = () => {
    const label = getLabelValue(item.label);
    if (childCanvases.length > 0) {
      return childCanvases.map((canvasId) => (
        <React.Fragment key={canvasId}>
          <div className="tracker"></div>
          {isClickable() ? (
            <a href={canvasId} onClick={handleClick}>
              {label}
            </a>
          ) : (
            <span>{label}</span>
          )}
        </React.Fragment>
      ));
    }
    // When an item is a section title, show it as plain text
    if (isTitle) {
      return (
        <span className="irmp--structured-nav__section-title">{label}</span>
      );
    }
    return null;
  };

  React.useEffect(() => {
    if (liRef.current) {
      if (currentNavItem == item) {
        liRef.current.className += ' active';
      } else if (
        (currentNavItem == null || currentNavItem != item) &&
        liRef.current.classList.contains('active')
      ) {
        liRef.current.className -= ' active';
      }
    }
  }, [currentNavItem]);

  if (item.label != '') {
    return (
      <li
        data-testid="list-item"
        ref={liRef}
        className="irmp--structured-nav__list-item"
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
  item: PropTypes.object.isRequired,
  isChild: PropTypes.bool,
  isTitle: PropTypes.bool,
};

export default ListItem;
