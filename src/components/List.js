import React, { useState } from 'react';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import { filterVisibleRangeItem, getLabelValue } from '../services/iiif-parser';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useManifestState } from '../context/manifest-context';

const List = (props) => {
  const [label, setLabel] = useState(getLabelValue(props.items[0].label));
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
        if (!filteredItem) {
          return null;
        }
        return (
          <ListItem
            key={filteredItem.id}
            item={filteredItem}
            isChild={props.isChild}
          />
        );
      })}
    </ul>
  );

  return (
    <React.Fragment>
      {!props.isChild ? collapsibleContent : collapsibleContent}
    </React.Fragment>
  );
};

List.propTypes = {
  items: PropTypes.array.isRequired,
  isChild: PropTypes.bool.isRequired,
};

export default List;

// Collapsible panel for structure for each section
const Collapsible = (props) => {
  const [open, setOpen] = useState(true);

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <div
        onClick={(e) => togglePanel(e)}
        className="structure-header"
        data-testid="collapsible"
      >
        {props.title}
        <FontAwesomeIcon className="fa-icon" icon={open ? faMinus : faPlus} />
      </div>
      <Collapse in={open}>
        <div className="structure-content">{props.children}</div>
      </Collapse>
    </React.Fragment>
  );
};
