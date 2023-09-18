import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = React.memo(({ items, sectionRef }) => {
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
            sectionRef={sectionRef}
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
