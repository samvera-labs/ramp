import React from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import SectionHeading from './SectionHeading';

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
const List = (({ items, sectionRef, structureContainerRef, isPlaylist }) => {
  const collapsibleContent = (
    <ul
      data-testid="list"
      className="ramp--structured-nav__list"
      role="presentation"
    >
      {items.map((item, index) => {
        // Render canvas items as SectionHeadings in non-playlist contexts
        if (item.isCanvas && !isPlaylist) {
          return <SectionHeading
            key={`${item.label}-${index}`}
            itemIndex={index + 1}
            duration={item.duration}
            label={item.label}
            sectionRef={sectionRef}
            itemId={item.id}
            isRoot={item.isRoot}
            structureContainerRef={structureContainerRef}
            hasChildren={item.items?.length > 0}
            items={item.items}
          />;
        } else {
          return <ListItem
            {...item}
            sectionRef={sectionRef}
            key={index}
            structureContainerRef={structureContainerRef}
          />;
        }
      })}
    </ul>
  );

  return <>{collapsibleContent}</>;
});

List.propTypes = {
  items: PropTypes.array.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
  isPlaylist: PropTypes.bool.isRequired,
};

export default List;
