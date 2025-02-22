import React from 'react';
import { useCollapseExpandAll } from '@Services/ramp-hooks';

const CollapseExpandButton = ({ numberOfSections }) => {
  const { collapseExpandAll, isCollapsed } = useCollapseExpandAll({});

  const handleClick = () => {
    collapseExpandAll();
  };

  return (
    <button className='ramp--structured-nav__collapse-all-btn'
      data-testid='collapse-expand-all-btn' onClick={handleClick}>
      {isCollapsed ? 'Expand' : 'Close'}
      {numberOfSections > 1 ? ` ${numberOfSections} Sections` : ' Section'}
      <i className={`arrow ${isCollapsed ? 'down' : 'up'}`}></i>
    </button>
  );
};

export default CollapseExpandButton;
