import React from 'react';
import PropTypes from 'prop-types';

const AccordionArrow = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"
      style={{ height: 'auto', width: '2rem' }} className="structure-accordion-arrow" data-testid="section-accordion-arrow">
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

const SectionButton = ({ duration, label, itemsLength, sectionRef }) => {
  let itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  // Toggle collapse of the sections for each Canvas
  const showSection = (e) => {
    e.preventDefault();
    const sectionStructure = e.currentTarget.nextSibling;
    if (!sectionStructure) {
      return;
    }
    if (sectionStructure.classList.contains('active-section')) {
      sectionStructure.classList.remove('active-section');
      e.currentTarget.classList.remove('open');
      e.currentTarget.setAttribute('aria-expanded', false);
    } else {
      sectionStructure.classList.add('active-section');
      e.currentTarget.classList.add('open');
      e.currentTarget.setAttribute('aria-expanded', true);
    }
  };

  return (
    <button className="ramp--structured-nav__section-button" data-testid="listitem-section-button"
      onClick={showSection} ref={sectionRef}>
      <span className="ramp--structured-nav__section-title"
        role="listitem"
        aria-label={itemLabelRef.current}
      >
        {itemLabelRef.current}
        {duration != '' &&
          <span className="ramp--structured-nav__section-duration">
            {duration}
          </span>}
      </span>
      {itemsLength > 0 ? <AccordionArrow /> : null}
    </button>
  );

};

SectionButton.propTypes = {
  duration: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  itemsLength: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired
};

export default SectionButton;
