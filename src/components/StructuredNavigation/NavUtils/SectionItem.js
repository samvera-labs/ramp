import React from 'react';
import PropTypes from 'prop-types';

const AccordionArrow = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"
      style={{ height: 'auto', width: '2rem' }} className="structure-accordion-arrow">
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path d="M7 10L12 15L17 10" stroke="#000000" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

const SectionItem = React.memo(({ duration, itemsLength, label }) => {
  // Toggle collapse of the sections for each Canvas
  const showSection = React.useCallback((e) => {
    e.preventDefault();
    const sectionStructure = e.currentTarget.nextSibling;
    if (!sectionStructure) {
      return;
    }
    if (sectionStructure.classList.contains('active-section')) {
      sectionStructure.classList.remove('active-section');
      e.currentTarget.classList.remove('open');
      e.currentTarget.setAttribute('aria-expanded', true);
    } else {
      sectionStructure.classList.add('active-section');
      e.currentTarget.classList.add('open');
      e.currentTarget.setAttribute('aria-expanded', false);
    }
  });

  return (
    <button className="ramp--structured-nav__section-button"
      onClick={showSection}>
      <span className="ramp--structured-nav__section-title"
        role="listitem"
        aria-label={label}
      >
        {label}
        <span className="ramp--structured-nav__section-duration">
          {duration}
        </span>
      </span>
      {itemsLength > 0 ? <AccordionArrow /> : null}
    </button>
  );
});

SectionItem.propTypes = {
  duration: PropTypes.string.isRequired,
  itemsLength: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

export default SectionItem;
