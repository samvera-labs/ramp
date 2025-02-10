import React, { useCallback, useEffect, useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

  useEffect(() => {
    // Reset state when Canvas changes
    setSelectedAnnotationSets([]);
    setDisplayedAnnotationSets([]);
    setSelectedAll(false);
    setIsOpen(false);

    if (canvasAnnotationSets?.length > 0) {
      // Sort annotation sets alphabetically
      canvasAnnotationSets.sort((a, b) => a.label.localeCompare(b.label));
      // Select the first annotation set on page load
      findOrFetchandParseLinkedAnnotations(canvasAnnotationSets[0]);
    }
  }, [canvasAnnotationSets]);

  const isSelected = useCallback((set) => {
    return selectedAnnotationSets.includes(set.label);
  }, [selectedAnnotationSets]);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  /**
   * Event handler for the check-box for each annotation set in the dropdown
   * @param {Object} annotationSet checked/unchecked set
   */
  const handleSelect = async (annotationSet) => {
    findOrFetchandParseLinkedAnnotations(annotationSet);

    // Uncheck and clear annotation set in state
    if (isSelected(annotationSet)) clearSelection(annotationSet);
  };

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
   * Event handler for the checkbox for 'Show all Annotation sets' option
   * Check/uncheck all Annotation sets as slected/not-selected
   */
  const handleSelectAll = async () => {
    const selectAllUpdated = !selectedAll;
    setSelectedAll(selectAllUpdated);
    if (selectAllUpdated) {
      await Promise.all(
        canvasAnnotationSets.map((annotationSet) => {
          findOrFetchandParseLinkedAnnotations(annotationSet);
        })
      );
    } else {
      // Clear all selections
      setSelectedAnnotationSets([]);
      setDisplayedAnnotationSets([]);
    }

    // Close the dropdown
    toggleDropdown();
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

  if (canvasAnnotationSets?.length > 0) {
    return (
      <div className="ramp--annotations__multi-select" data-testid="annotation-multi-select">
        <div className="ramp--annotations__multi-select-header" onClick={toggleDropdown}>
          {selectedAnnotationSets.length > 0
            ? `${selectedAnnotationSets.length} of ${canvasAnnotationSets.length} sets selected`
            : "Select Annotation set(s)"}
          <span className={`annotations-dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>
        {isOpen && (
          <ul className="annotations-dropdown-menu">
            {
              // Only show select all option when there's more than one annotation set
              canvasAnnotationSets?.length > 1 &&
              <li key="select-all" className="annotations-dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAll}
                    onChange={handleSelectAll}
                  />
                  Show all Annotation sets
                </label>
              </li>
            }
            {canvasAnnotationSets.map((annotationSet, index) => (
              <li key={`annotaion-set-${index}`} className="annotations-dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={isSelected(annotationSet)}
                    onChange={() => handleSelect(annotationSet)}
                  />
                  {annotationSet.label}
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="ramp--annotations__scroll" data-testid="annotations-scroll">
          <input
            type="checkbox"
            id="scroll-check"
            name="scrollcheck"
            aria-checked={autoScrollEnabled}
            title='Auto-scroll with media'
            checked={autoScrollEnabled}
            onChange={() => { setAutoScrollEnabled(!autoScrollEnabled); }}
          />
          <label htmlFor="scroll-check" title='Auto-scroll with media'>
            Auto-scroll with media
          </label>
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
