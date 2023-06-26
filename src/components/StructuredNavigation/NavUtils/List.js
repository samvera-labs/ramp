import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {
  filterVisibleRangeItem,
  getChildCanvases,
} from '../../../services/iiif-parser';
import { useManifestState } from '../../../context/manifest-context';

const List = (props) => {
  const manifestState = useManifestState();

  if (!manifestState.manifest) {
    return <p data-testid="list-error">No manifest in List yet</p>;
  }

  const collapsibleContent = (
    <ul data-testid="list" className="ramp--structured-nav__list">
      {props.items.map((item) => {
        const filteredItem = filterVisibleRangeItem({
          item,
          manifest: manifestState.manifest,
        });
        if (filteredItem) {
          const childCanvases = getChildCanvases({
            rangeId: filteredItem.id,
            manifest: manifestState.manifest,
          });
          // Title items doesn't have children
          if (childCanvases.length == 0) {
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
