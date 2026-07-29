import React from 'react';

/**
 * Component for typable combobox for the Manifest URL field in the demo site. 
 * Renders an input field and a list of sample manifests from Ramp in a dropdown menu.
 * Reference: the combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * in W3C's a11y design patterns library.
 */
const InputComboBox = ({ value, options, onChange }) => {
  // Expand the dropdown on initial page load to highlight the pre-loaded sample Manifests
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  /* Filter the available options based on the user query typed into the input field */
  const filteredOptions = React.useMemo(() => {
    const query = value?.trim().toLowerCase();
    if (!query) {
      return options;
    }
    return options.filter(({ label, url }) =>
      label.toLowerCase().includes(query) || url.toLowerCase().includes(query));
  }, [value, options]);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectOption = (option) => {
    onChange(option.url);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Handle 'keyDown' event for the combobox
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.shiftKey) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setActiveIndex((prev) => (prev + 1 >= filteredOptions.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setActiveIndex((prev) => (prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
        e.preventDefault();
        selectOption(filteredOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div className='ramp-demo__combobox' ref={containerRef}>
      <input type='url'
        id='manifesturl'
        name='manifesturl'
        role='combobox'
        aria-expanded={isOpen}
        aria-controls='manifesturl-listbox'
        aria-autocomplete='list'
        autoComplete='off'
        value={value}
        placeholder='Type your Manifest URL / Select from our example manifests...'
        className='ramp-demo__manifest-input'
        ref={inputRef}
        onChange={(e) => { onChange(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown} />
      {isOpen && filteredOptions.length > 0 && (
        <ul role='listbox' id='manifesturl-listbox' className='ramp-demo__combobox-listbox'>
          {filteredOptions.map((option, index) => (
            <li key={option.url}
              role='option'
              aria-selected={index === activeIndex}
              className={`ramp-demo__combobox-option${index === activeIndex ? ' is-active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); selectOption(option); }}>
              <span className='ramp-demo__combobox-option-label'>{option.label}</span>
              <span className='ramp-demo__combobox-option-url'>{option.url}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputComboBox;
