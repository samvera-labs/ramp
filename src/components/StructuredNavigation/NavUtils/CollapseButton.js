import React from 'react';

const CollapseButton = ({ numberOfSections }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleClick = () => {
    setIsCollapsed(isCollapsed => !isCollapsed);
  };
  return <button className='ramp--structured-nav__collapse-all-btn' onClick={handleClick}>
    {isCollapsed ? 'Close' : 'Expand'} {numberOfSections}
    {numberOfSections > 1 ? ' Sections' : ' Section'}
    <i className={`arrow ${isCollapsed ? 'up' : 'down'}`}></i>
  </button>;
};

export default CollapseButton;
