import React from 'react';
import List from './List';
import {
  getChildCanvases,
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
import { checkSrcRange, getLabelValue, getMediaFragment } from '@Services/utility-helpers';

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

const ListItem = ({ item, isCanvasNode, canvasInfo, isChild, isTitle }) => {
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();
  const { manifest, currentNavItem, canvasIndex } = useManifestState();
  const { playerRange } = usePlayerState();
  const [itemId, _setItemId] = React.useState();
  const [itemLabel, setItemLabel] = React.useState(getLabelValue(item.label));
  const [isEmpty, setIsEmpty] = React.useState(false);

  let itemIdRef = React.useRef(getItemId(item));
  const setItemId = (id) => {
    itemIdRef.current = id;
    _setItemId(id);
  };

  React.useEffect(() => {
    if (canvasInfo != undefined) {
      setIsEmpty(canvasInfo.isEmpty);
      let id = isCanvasNode
        ? `${canvasInfo.canvasId}#t=${playerRange.start},`
        : canvasInfo.canvasId;
      setItemId(id);
    }
  }, [canvasInfo]);

  const childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest,
  });

  const subMenu =
    item.items && item.items.length > 0 && childCanvases.length === 0 ? (
      <List
        items={item.items}
        isCanvasNode={false}
        canvasInfo={canvasInfo}
        isChild={true} />
    ) : null;
  const liRef = React.useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    playerDispatch({ clickedUrl: e.target.href, type: 'navClick' });

    let navItem = {
      id: e.target.href,
      label: itemLabel,
      isTitleTimespan: isChild || isTitle
    };
    manifestDispatch({ item: navItem, type: 'switchItem' });
  };

  const isClickable = () => {
    const timeFragment = getMediaFragment(itemId, playerRange.end);
    let isCanvas = false;
    if (canvasIndex != undefined) {
      const currentCanvas = canvasesInManifest(manifest)[canvasIndex];
      isCanvas = currentCanvas.canvasId == getCanvasId(itemId);
    }
    const isInRange = timeFragment == undefined
      ? true
      : checkSrcRange(timeFragment, playerRange);
    return isInRange || !isCanvas;
  };

  const renderListItem = () => {
    if (childCanvases.length > 0) {
      return childCanvases.map((canvasId) => (
        <React.Fragment key={canvasId}>
          <div className="tracker"></div>
          {isClickable() ? (
            <React.Fragment>
              {isEmpty && <LockedSVGIcon />}
              <a href={canvasId} onClick={handleClick}>
                {itemLabel}
              </a>
            </React.Fragment>
          ) : (
            <span role="listitem" aria-label={itemLabel}>{itemLabel}</span>
          )}
        </React.Fragment>
      ));
    }
    // When an item is a section title, show it as plain text
    if (isTitle) {
      return (
        <React.Fragment>
          {isCanvasNode ? (
            <React.Fragment>
              <div className="tracker"></div>
              <a href={itemId} onClick={handleClick}>
                {itemLabel}
              </a>
            </React.Fragment>
          ) : (
            <span className="ramp--structured-nav__section-title"
              role="listitem"
              aria-label={itemLabel}
            >
              {itemLabel}
            </span>
          )}
        </React.Fragment>
      );
    }
    return null;
  };

  React.useEffect(() => {
    if (liRef.current) {
      if (currentNavItem && currentNavItem.id == itemIdRef.current) {
        liRef.current.className += ' active';
      } else if (
        (currentNavItem == null || currentNavItem.id != itemIdRef.current) &&
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
  isCanvasNode: PropTypes.bool.isRequired,
  isChild: PropTypes.bool,
  isTitle: PropTypes.bool,
};

export default ListItem;
