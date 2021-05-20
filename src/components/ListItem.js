import React, { useEffect, useRef } from 'react';
import List from './List';
import { getChildCanvases, getLabelValue } from '../services/iiif-parser';
import PropTypes from 'prop-types';
import { useManifestState } from '../context/manifest-context';
import { usePlayerDispatch } from '../context/player-context';
import { useManifestDispatch } from '../context/manifest-context';

const ListItem = ({ item, isTitle }) => {
  const playerDispatch = usePlayerDispatch();
  const manifestDispatch = useManifestDispatch();
  const { manifest, currentNavItem } = useManifestState();
  const childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest,
  });
  const subMenu =
    item.items && item.items.length > 0 && childCanvases.length === 0 ? (
      <List items={item.items} isChild={true} />
    ) : null;
  const liRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    playerDispatch({ clickedUrl: e.target.href, type: 'navClick' });
    manifestDispatch({ item: item, type: 'switchItem' });
  };

  const renderListItem = () => {
    const label = getLabelValue(item.label);
    if (childCanvases.length > 0) {
      return childCanvases.map((canvasId) => (
        <a key={canvasId} href={canvasId} onClick={handleClick}>
          {label}
        </a>
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

  useEffect(() => {
    if (currentNavItem == item) {
      liRef.current.className += ' active';
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
