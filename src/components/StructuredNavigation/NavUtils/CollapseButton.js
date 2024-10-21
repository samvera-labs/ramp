import React from 'react';
import { useCollapseExpandAll } from '@Services/ramp-hooks';

const CollapseButton = ({ numberOfSections }) => {
  const { collapseExpandAll, isCollapsed } = useCollapseExpandAll({});

  const handleClick = () => {
    collapseExpandAll();
  };

  return <button className='ramp--structured-nav__collapse-all-btn' onClick={handleClick}>
    {isCollapsed ? 'Expand' : 'Close'} {numberOfSections}
    {numberOfSections > 1 ? ' Sections' : ' Section'}
    <i className={`arrow ${isCollapsed ? 'down' : 'up'}`}></i>
  </button>;
};

export default CollapseButton;
