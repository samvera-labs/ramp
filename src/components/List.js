import React, { useState } from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import { filterVisibleRangeItem, getLabelValue } from '../services/iiif-parser';
import { useManifestState } from '../context/manifest-context';

const List = (props) => {
  const manifestState = useManifestState();

  if (!manifestState.manifest) {
    return <p>No manifest in List yet</p>;
  }

  const collapsibleContent = (
    <ul data-testid="list">
      {props.items.map((item) => {
        const filteredItem = filterVisibleRangeItem({
          item,
          manifest: manifestState.manifest,
        });
        if (filteredItem) {
          return (
            <ListItem
              key={filteredItem.id}
              item={filteredItem}
              isChild={props.isChild}
            />
          );
        } else {
          return (<List items={item.items} isChild={true} />);
        }
      })}
    </ul>
  );

  return (
    <React.Fragment>
      {collapsibleContent}
    </React.Fragment>
  );
};

List.propTypes = {
  items: PropTypes.array.isRequired,
  isChild: PropTypes.bool.isRequired,
};

export default List;