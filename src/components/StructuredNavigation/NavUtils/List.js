import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {
  filterVisibleRangeItem,
  getChildCanvases,
  getItemId,
} from '../../../services/iiif-parser';
import { useManifestState } from '../../../context/manifest-context';

const List = ({ items, isChild, canvasInfo, isCanvasNode }) => {
  const manifestState = useManifestState();

  if (!manifestState.manifest) {
    return <p data-testid="list-error">No manifest in List yet</p>;
  }

  const collapsibleContent = (
    <ul
      data-testid="list"
      className="ramp--structured-nav__list"
      role="presentation">
      {items.map((item) => {
        const filteredItem = filterVisibleRangeItem({
          item,
          manifest: manifestState.manifest,
        });
        if (filteredItem) {
          const childCanvases = getChildCanvases({
            rangeId: filteredItem.id,
            manifest: manifestState.manifest,
          });
          const itemId = isCanvasNode
            ? canvasInfo.canvasId
            : getItemId(filteredItem);
          // Title items doesn't have children
          if (childCanvases.length == 0) {
            return (
              <ListItem
                key={filteredItem.id}
                item={filteredItem}
                isCanvasNode={isCanvasNode}
                canvasInfo={{ ...canvasInfo, canvasId: itemId }}
                isChild={false}
                isTitle={true}
              />
            );
          }
          return (
            <ListItem
              key={filteredItem.id}
              item={filteredItem}
              isCanvasNode={isCanvasNode}
              canvasInfo={{ ...canvasInfo, canvasId: itemId }}
              isChild={isChild}
              isTitle={false}
            />
          );
        } else {
          return (
            <List
              items={item.items}
              isCanvasNode={false}
              canvasInfo={canvasInfo}
              isChild={true}
            />
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
  isCanvasNode: PropTypes.bool
};

export default List;
