import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  parseExternalAnnotationPage,
  parseExternalAnnotationResource
} from '@Services/annotations-parser';

const AnnotationSetSelect = ({
  canvasAnnotationSets = [],
  duration = 0,
  setDisplayedAnnotationSets,
  setAutoScrollEnabled,
  autoScrollEnabled,
}) => {
  const [selectedAnnotationSets, setSelectedAnnotationSets] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [timedAnnotationSets, setTimedAnnotationSets] = useState([]);

  const multiSelectRef = useRef(null);
  const selectButtonRef = useRef(null);
  const dropDownRef = useRef(null);

  // Need to keep this as a state variable for re-rendering UI
  const [isOpen, _setIsOpen] = useState(false);
  // Use a ref to keep track of the dropdown state in the event listener
  const isOpenRef = useRef(false);
  const setIsOpen = (value) => {
    isOpenRef.current = value;
    _setIsOpen(value);
  };
  const toggleDropdown = () => setIsOpen(!isOpenRef.current);

  // Index of the focused option in the list
  const currentIndex = useRef(0);
  const setCurrentIndex = (i) => currentIndex.current = i;

  useEffect(() => {
    // Reset state when Canvas changes
    setSelectedAnnotationSets([]);
    setDisplayedAnnotationSets([]);
    setSelectedAll(false);
    setIsOpen(false);

    if (canvasAnnotationSets?.length > 0) {
      // Sort annotation sets alphabetically
      const annotationSets = canvasAnnotationSets.sort((a, b) => a.label.localeCompare(b.label));
      setTimedAnnotationSets(annotationSets);
      // Select the first annotation set on page load
      findOrFetchandParseLinkedAnnotations(annotationSets[0]);
    } else {
      setTimedAnnotationSets([]);
    }

    // Add event listener to close the dropdown when clicking outside of it
    document.addEventListener('click', handleClickOutside);

    // Remove event listener on unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [canvasAnnotationSets]);

  const isSelected = useCallback((set) => {
    return selectedAnnotationSets.includes(set.label);
  }, [selectedAnnotationSets]);

  /**
   * Fetch linked annotations and parse its content only on first time selection
   * of the annotation set
   * @param {Object} annotationSet checked/unchecked set
   */
  const findOrFetchandParseLinkedAnnotations = async (annotationSet) => {
    let items = annotationSet.items;
    if (!isSelected(annotationSet)) {
      // Only fetch and parse AnnotationPage for the first time selection
      if (annotationSet.url && !annotationSet.items) {
        // Parse linked annotations as AnnotationPage json
        if (!annotationSet?.linkedResource) {
          let parsedAnnotationPage = await parseExternalAnnotationPage(annotationSet.url, duration);
          items = parsedAnnotationPage?.length > 0 ? parsedAnnotationPage[0].items : [];
        }
        // Parse linked annotations of other types, e.g. WebVTT, SRT, plain text, etc.
        else {
          let annotations = await parseExternalAnnotationResource(annotationSet);
          items = annotations;
        }
      }
      // Mark annotation set as selected
      makeSelection(annotationSet, items);
    }
  };

  /**
 * Remove unchecked annotation and its label from state. This function updates
 * as a wrapper for updating both state variables in one place to avoid inconsistencies
 * @param {Object} annotationSet selected annotation set
 */
  const clearSelection = (annotationSet) => {
    setSelectedAnnotationSets((prev) => prev.filter((item) => item !== annotationSet.label));
    setDisplayedAnnotationSets((prev) => prev.filter((a) => a.label != annotationSet.label));
  };

  /**
   * Add checked annotation and its label to state. This function updates
   * as a wrapper for updating both state variables in one place to avoid inconsistencies
   * @param {Object} annotationSet selected annotation set
   * @param {Array} items list of timed annotations
   */
  const makeSelection = (annotationSet, items) => {
    annotationSet.items = items;
    setSelectedAnnotationSets((prev) => [...prev, annotationSet.label]);
    setDisplayedAnnotationSets((prev) => [...prev, annotationSet]);
  };

  /**
   * Event handler for the checkbox for 'Show all Annotation sets' option
   * Check/uncheck all Annotation sets as slected/not-selected
   */
  const handleSelectAll = async (e) => {
    const selectAllUpdated = !selectedAll;
    setSelectedAll(selectAllUpdated);
    if (selectAllUpdated) {
      await Promise.all(
        timedAnnotationSets.map((annotationSet) => {
          findOrFetchandParseLinkedAnnotations(annotationSet);
        })
      );
    } else {
      // Clear all selections
      setSelectedAnnotationSets([]);
      setDisplayedAnnotationSets([]);
    }

    // Stop propogation of the event to stop bubbling this event upto playerHotKeys
    e.stopPropagation();

    // Close the dropdown
    toggleDropdown();
  };

  /**
   * Event handler for the check-box for each annotation set in the dropdown
   * @param {Object} annotationSet checked/unchecked set
   */
  const handleSelect = async (annotationSet) => {
    findOrFetchandParseLinkedAnnotations(annotationSet);

    // Uncheck and clear annotation set in state
    if (isSelected(annotationSet)) clearSelection(annotationSet);
  };

  // Close the dropdown when clicked outside of it
  const handleClickOutside = (e) => {
    if (!multiSelectRef?.current?.contains(e.target) && isOpenRef.current) {
      setIsOpen(false);
    }
  };

  /**
   * Open/close the dropdown and move focus to the first option in the drowdown
   * menu as needed based on the keys pressed when dropdown is in focus
   * @param {Event} e keydown event from dropdown button
   */
  const handleDropdownKeyPress = (e) => {
    // Close the dropdown on 'Escape' keypress if it is open
    if (e.key === 'Escape') {
      e.preventDefault();
      if (isOpenRef.current) toggleDropdown();
    }

    // Toggle dropdown on Enter/Space keypresses
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
    // Open the dropdown and move focus to first option on ArrowDown/ArrowUp keypresses
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!isOpenRef.current) {
        setIsOpen(true);
        // Keep the container scrolled to top. Without this the first option 
        // gets out of view when dropdown is programatically opened
        setTimeout(() => {
          if (dropDownRef.current) dropDownRef.current.scrollTop = 0;
        }, 0);
      }

      // Move focus to the first option in the list
      const firstOption = document.querySelector(".annotations-dropdown-item");
      if (firstOption) {
        firstOption.focus();
        setCurrentIndex(0);
      }
    }
  };

  /**
   * Handle keyboard events for each annotation set option.
   * @param {Event} e keyboard event
   */
  const handleAnnotationSetKeyPress = (e) => {
    const allOptions = dropDownRef.current.children;
    let nextIndex = currentIndex.current;
    switch (e.key) {
      case 'Enter':
      case ' ':
        // On Enter/Space select the focused annotation set
        e.preventDefault();
        const option = timedAnnotationSets.filter((a) => e.target.id == a.label)[0];
        if (option != undefined) {
          handleSelect(option);
        } else {
          handleSelectAll(e);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Move to next option on ArrowDown keypress and wraps to first option when end is reached
        nextIndex = (currentIndex.current + 1) % allOptions.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Move to previous option on ArrowUp keypress and wraps to last option when top is reached
        nextIndex = (currentIndex.current - 1 + allOptions.length) % allOptions.length;
        break;
      case 'Escape':
        e.preventDefault();
        // Close the dropdown and move focus to dropdown button
        toggleDropdown();
        selectButtonRef.current.focus();
        break;
      case 'Tab':
        // Close dropdown and move focus out to the next element in the DOM
        toggleDropdown();
        break;
    }

    // Update focus on the selected option using ArrowDown/ArrowUp keys
    if (nextIndex !== currentIndex.current) {
      allOptions[nextIndex].focus();
      setCurrentIndex(nextIndex);
    }
  };

  /**
   * Handle keydown event for the checkbox for turning auto-scroll on/off
   * @param {Event} e keydown event
   */
  const handleAutoScrollKeyPress = (e) => {
    if (e.key == ' ' || e.key == 'Enter') {
      e.preventDefault();
      setAutoScrollEnabled((prev) => !prev);
    }
  };

  if (timedAnnotationSets?.length > 0) {
    return (
      <div className='ramp--annotations__select'>
        <label>Annotation sets: </label>
        <div
          className='ramp--annotations__multi-select'
          data-testid='annotation-multi-select'
          ref={multiSelectRef}
        >
          <span
            className='ramp--annotations__multi-select-header'
            onClick={toggleDropdown}
            onKeyDown={handleDropdownKeyPress}
            aria-haspopup='listbox'
            aria-expanded={isOpen}
            aria-controls='annotations-dropdown-menu'
            id='dropdown-button'
            role='button'
            tabIndex={0}
            ref={selectButtonRef}
          >
            {selectedAnnotationSets.length > 0
              ? `${selectedAnnotationSets.length} of ${timedAnnotationSets.length} sets selected`
              : 'Select Annotation set(s)'}
            <span className={`annotations-dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
          </span>
          {isOpen && (
            <ul
              className='annotations-dropdown-menu'
              role='listbox'
              aria-labelledby='dropdown-button'
              aria-multiselectable={true}
              tabIndex={-1}
              ref={dropDownRef}>
              {
                // Only show select all option when there's more than one annotation set
                timedAnnotationSets?.length > 1 &&
                <li key='select-all'
                  className='annotations-dropdown-item'
                  role='option' tabIndex={0}
                  aria-selected={selectedAll}
                  onKeyDown={handleAnnotationSetKeyPress}
                  id='select-all-annotation-sets'
                >
                  <label>
                    <input
                      type='checkbox'
                      aria-checked={selectedAll}
                      checked={selectedAll}
                      onChange={handleSelectAll}
                      tabIndex={0}
                      role='checkbox'
                    />
                    Show all Annotation sets
                  </label>
                </li>
              }
              {timedAnnotationSets.map((annotationSet, index) => (
                <li key={`annotaion-set-${index}`}
                  className='annotations-dropdown-item'
                  role='option' tabIndex={0}
                  aria-selected={isSelected(annotationSet)}
                  onKeyDown={handleAnnotationSetKeyPress}
                  id={annotationSet.label}
                >
                  <label>
                    <input
                      type='checkbox'
                      aria-checked={isSelected(annotationSet)}
                      checked={isSelected(annotationSet)}
                      onChange={() => handleSelect(annotationSet)}
                      tabIndex={0}
                      role='checkbox'
                    />
                    {annotationSet.label}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className='ramp--annotations__scroll' data-testid='annotations-scroll'>
            <input
              type='checkbox'
              id='scroll-check'
              name='scrollcheck'
              aria-checked={autoScrollEnabled}
              title='Auto-scroll with media'
              checked={autoScrollEnabled}
              onChange={() => { setAutoScrollEnabled(!autoScrollEnabled); }}
              onKeyDown={handleAutoScrollKeyPress}
            />
            <label htmlFor='scroll-check' title='Auto-scroll with media'>
              Auto-scroll with media
            </label>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  };
};

AnnotationSetSelect.propTypes = {
  canvasAnnotationSets: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  setDisplayedAnnotationSets: PropTypes.func.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired,
};

export default AnnotationSetSelect;
