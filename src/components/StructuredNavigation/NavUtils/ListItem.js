import React from 'react';
import List from './List';
import {
  getChildCanvases,
  getLabelValue,
  getItemId,
  getCanvasId,
  canvasesInManifest,
} from '../../../services/iiif-parser';
import PropTypes from 'prop-types';
import { usePlayerDispatch, usePlayerState } from '../../../context/player-context';
import {
  useManifestDispatch,
  useManifestState,
} from '../../../context/manifest-context';
import { checkSrcRange, getMediaFragment } from '@Services/utility-helpers';

const ListItem = ({ item, isChild, isTitle }) => {
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();
  const { manifest, currentNavItem, canvasIndex } = useManifestState();
  const { playerRange } = usePlayerState();
  const [itemId, setItemId] = React.useState(getItemId(item));
  const [itemLabel, setItemLabel] = React.useState(getLabelValue(item.label));

  const childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest,
  });

  const subMenu =
    item.items && item.items.length > 0 && childCanvases.length === 0 ? (
      <List items={item.items} isChild={true} label={itemLabel} />
    ) : null;
  const liRef = React.useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    playerDispatch({ clickedUrl: e.target.href, type: 'navClick' });

    let navItem = {
      id: itemId,
      label: itemLabel,
      isTitleTimespan: isChild || isTitle
    };
    manifestDispatch({ item: navItem, type: 'switchItem' });
  };

  const isClickable = () => {
    const timeFragment = getMediaFragment(itemId, playerRange.end);
    let isCanvas = false;
    if (canvasIndex != undefined) {
      const currentCanvasId = canvasesInManifest(manifest)[canvasIndex];
      isCanvas = currentCanvasId == getCanvasId(itemId);
    }
    const isInRange = checkSrcRange(timeFragment, playerRange);
    return isInRange || !isCanvas;
  };

  const renderListItem = () => {
    if (childCanvases.length > 0) {
      return childCanvases.map((canvasId) => (
        <React.Fragment key={canvasId}>
          <div className="tracker"></div>
          {isClickable() ? (
            <a href={canvasId} onClick={handleClick}>
              {itemLabel}
            </a>
          ) : (
            <span role="listitem" aria-label={itemLabel}>{itemLabel}</span>
          )}
        </React.Fragment>
      ));
    }
    // When an item is a section title, show it as plain text
    if (isTitle) {
      return (
        <span className="ramp--structured-nav__section-title"
          role="listitem"
          aria-label={itemLabel}
        >
          {itemLabel}
        </span>
      );
    }
    return null;
  };

  React.useEffect(() => {
    if (liRef.current) {
      if (currentNavItem && currentNavItem.id == itemId) {
        liRef.current.className += ' active';
      } else if (
        (currentNavItem == null || currentNavItem.id != itemId) &&
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
        className="ramp--structured-nav__list-item"
        aria-label={itemLabel}
        role="listitem"
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
