import React, { memo } from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = memo(function List({ items }) {
  const collapsibleContent = (
    <ul
      data-testid="list"
      className="ramp--structured-nav__list"
      role="presentation"
    >
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
});

List.propTypes = {
  items: PropTypes.array.isRequired,
};

export default List;
