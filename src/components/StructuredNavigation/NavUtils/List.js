import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = (({ items, sectionRef, structureContainerRef }) => {
  // const collapsibleContent = (
  //   <ul
  //     data-testid="list"
  //     className="ramp--structured-nav__list"
  //     role="presentation"
  //   >
  //     {items.map((item, index) => {
  //       if (item) {
  //         return <ListItem
  //           {...item}
  //           sectionRef={sectionRef}
  //           key={index}
  //           structureContainerRef={structureContainerRef}
  //         />;
  //       }
  //     })}
  //   </ul>
  // );

  return (<React.Fragment>
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
            structureContainerRef={structureContainerRef}
          />;
        }
      })}
    </ul>
  </React.Fragment>);
});

List.propTypes = {
  items: PropTypes.array.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

export default List;
