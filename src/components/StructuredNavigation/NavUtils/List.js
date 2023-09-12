import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import { useManifestState } from '../../../context/manifest-context';

const List = ({ items }) => {
  const manifestState = useManifestState();

  if (!manifestState.manifest) {
    return <p data-testid="list-error">No manifest in yet</p>;
  }

  const collapsibleContent = (
    <ul
      data-testid="list"
      key={Math.random()}
      className="ramp--structured-nav__list"
      role="presentation">
      {items.map((item, index) => {
        if (item) {
          return <ListItem
            {...item}
            key={index}
          />;
        }
      })}
    </ul>
  );

  return <React.Fragment>{collapsibleContent}</React.Fragment>;
};

List.propTypes = {
  items: PropTypes.array.isRequired,
};

export default List;
