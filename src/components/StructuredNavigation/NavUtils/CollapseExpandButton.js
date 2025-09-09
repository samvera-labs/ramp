import React from 'react';
import { useCollapseExpandAll } from '@Services/ramp-hooks';

const CollapseExpandButton = ({ numberOfSections }) => {
  const { collapseExpandAll, isCollapsed } = useCollapseExpandAll({});

  const handleClick = () => {
    collapseExpandAll();
  };

  /**
   * Handle keydown event when focused on the button
   * @param {Event} e 
   */
  const handleKeyDown = (e) => {
    // Toggle collapse/expand all when 'Enter' key is pressed
    if (e.keyCode === 13) {
      e.preventDefault();
      handleClick();
    }
    // Expand all sections if they are collapsed and ArrowRight key is pressed
    if (isCollapsed && e.keyCode === 39) {
      handleClick();
    }
    // Collapse all sections if they are expanded and ArrowLeft key is pressed
    if (!isCollapsed && e.keyCode === 37) {
      handleClick();
    }
  };

  return (
    <button className='ramp--structured-nav__collapse-all-btn'
      data-testid='collapse-expand-all-btn' onClick={handleClick}
      onKeyDown={handleKeyDown} role='button'>
      {isCollapsed ? 'Expand' : 'Close'}
      {numberOfSections > 1 ? ` Sections` : ' Section'}
      <i className={`arrow ${isCollapsed ? 'down' : 'up'}`}></i>
    </button>
  );
};

export default CollapseExpandButton;
