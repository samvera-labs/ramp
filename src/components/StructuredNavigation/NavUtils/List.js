import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

/**
 * Build a section of structure using a <ul> HTML element, this can represent
 * a title Range with children or canvas Range with children.
 * This element helps build the nested ranges in structures, as it is being
 * called recuresively in ListItem and SectionHeading components.
 * @param {Object} props
 * @param {Array} props.items a list of structure items under a title/section
 * @param {Object} props.sectionRef React ref of the current section/canvas
 * @param {Object} props.structureContainerRef React ref of the parent container
 * @param {Boolean} props.isPlaylist
 */
const List = (({ items, sectionRef, structureContainerRef }) => {
  const collapsibleContent = (
    <ul
      data-testid="list"
      className="ramp--structured-nav__list"
      role="list"
    >
      {items.map((item, index) => {
        return <ListItem
          {...item}
          sectionRef={sectionRef}
          key={index}
          structureContainerRef={structureContainerRef}
        />;
      })}
    </ul>
  );

  return <>{collapsibleContent}</>;
});

List.propTypes = {
  items: PropTypes.array.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
};

export default List;
