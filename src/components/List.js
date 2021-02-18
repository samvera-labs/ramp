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
    <ul data-testid="list" className="irmp--structured-nav__list">
      {props.items.map((item) => {
        const filteredItem = filterVisibleRangeItem({
          item,
          manifest: manifestState.manifest,
        });
        if (filteredItem) {
          // Use titles list to determine the current item as a timespan or a title node
          if (props.titles.indexOf(filteredItem) >= 0) {
            return (
              <ListItem
                key={filteredItem.id}
                item={filteredItem}
                isChild={false}
                isTitle={true}
                titles={props.titles}
              />
            );
          }
          return (
            <ListItem
              key={filteredItem.id}
              item={filteredItem}
              isChild={props.isChild}
              isTitle={false}
              titles={props.titles}
            />
          );
        } else {
          return (
            <List items={item.items} isChild={true} titles={props.titles} />
          );
        }
      })}
    </ul>
  );

  return <React.Fragment>{collapsibleContent}</React.Fragment>;
};

List.propTypes = {
  items: PropTypes.array.isRequired,
  isChild: PropTypes.bool.isRequired,
};

export default List;
