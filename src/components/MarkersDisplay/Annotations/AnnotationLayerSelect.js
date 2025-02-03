import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  parseExternalAnnotationPage,
  parseExternalAnnotationResource
} from '@Services/annotations-parser';

const AnnotationLayerSelect = ({
  canvasAnnotationLayers = [],
  duration = 0,
  setDisplayedAnnotationLayers,
  setAutoScrollEnabled,
  autoScrollEnabled,
}) => {
  const [selectedAnnotationLayers, setSelectedAnnotationLayers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

  useEffect(() => {
    // Reset state when Canvas changes
    setSelectedAnnotationLayers([]);
    setDisplayedAnnotationLayers([]);
    setSelectedAll(false);
    setIsOpen(false);

    if (canvasAnnotationLayers?.length > 0) {
      // Sort annotation sets alphabetically
      canvasAnnotationLayers.sort((a, b) => a.label.localeCompare(b.label));
      // Select the first annotation set on page load
      findOrFetchandParseLinkedAnnotations(canvasAnnotationLayers[0]);
    }
  }, [canvasAnnotationLayers]);

  const isSelected = useCallback((layer) => {
    return selectedAnnotationLayers.includes(layer.label);
  }, [selectedAnnotationLayers]);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  /**
   * Event handler for the check-box for each annotation layer in the dropdown
   * @param {Object} annotationLayer checked/unchecked layer
   */
  const handleSelect = async (annotationLayer) => {
    findOrFetchandParseLinkedAnnotations(annotationLayer);

    // Uncheck and clear annotation layer in state
    if (isSelected(annotationLayer)) clearSelection(annotationLayer);
  };

  /**
   * Fetch linked annotations and parse its content only on first time selection
   * of the annotation layer
   * @param {Object} annotationLayer checked/unchecked layer
   */
  const findOrFetchandParseLinkedAnnotations = async (annotationLayer) => {
    let items = annotationLayer.items;
    if (!isSelected(annotationLayer)) {
      // Only fetch and parse AnnotationPage for the first time selection
      if (annotationLayer.url && !annotationLayer.items) {
        // Parse linked annotations as AnnotationPage json
        if (!annotationLayer?.linkedResource) {
          let parsedAnnotationPage = await parseExternalAnnotationPage(annotationLayer.url, duration);
          items = parsedAnnotationPage?.length > 0 ? parsedAnnotationPage[0].items : [];
        }
        // Parse linked annotations of other types, e.g. WebVTT, SRT, plain text, etc.
        else {
          let annotations = await parseExternalAnnotationResource(annotationLayer);
          items = annotations;
        }
      }
      // Mark annotation layer as selected
      makeSelection(annotationLayer, items);
    }
  };

  /**
   * Event handler for the checkbox for 'Show all Annotation layers' option
   * Check/uncheck all Annotation layers as slected/not-selected
   */
  const handleSelectAll = async () => {
    const selectAllUpdated = !selectedAll;
    setSelectedAll(selectAllUpdated);
    if (selectAllUpdated) {
      await Promise.all(
        canvasAnnotationLayers.map((annotationLayer) => {
          findOrFetchandParseLinkedAnnotations(annotationLayer);
        })
      );
    } else {
      // Clear all selections
      setSelectedAnnotationLayers([]);
      setDisplayedAnnotationLayers([]);
    }

    // Close the dropdown
    toggleDropdown();
  };

  /**
   * Remove unchecked annotation and its label from state. This function updates
   * as a wrapper for updating both state variables in one place to avoid inconsistencies
   * @param {Object} annotationLayer selected annotation layer
   */
  const clearSelection = (annotationLayer) => {
    setSelectedAnnotationLayers((prev) => prev.filter((item) => item !== annotationLayer.label));
    setDisplayedAnnotationLayers((prev) => prev.filter((a) => a.label != annotationLayer.label));
  };

  /**
   * Add checked annotation and its label to state. This function updates
   * as a wrapper for updating both state variables in one place to avoid inconsistencies
   * @param {Object} annotationLayer selected annotation layer
   * @param {Array} items list of timed annotations
   */
  const makeSelection = (annotationLayer, items) => {
    annotationLayer.items = items;
    setSelectedAnnotationLayers((prev) => [...prev, annotationLayer.label]);
    setDisplayedAnnotationLayers((prev) => [...prev, annotationLayer]);
  };

  if (canvasAnnotationLayers?.length > 0) {
    return (
      <div className="ramp--annotations__multi-select" data-testid="annotation-multi-select">
        <div className="ramp--annotations__multi-select-header" onClick={toggleDropdown}>
          {selectedAnnotationLayers.length > 0
            ? `${selectedAnnotationLayers.length} of ${canvasAnnotationLayers.length} layers selected`
            : "Select Annotation layer(s)"}
          <span className={`annotations-dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>
        {isOpen && (
          <ul className="annotations-dropdown-menu">
            {
              // Only show select all option when there's more than one annotation layer
              canvasAnnotationLayers?.length > 1 &&
              <li key="select-all" className="annotations-dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAll}
                    onChange={handleSelectAll}
                  />
                  Show all Annotation layers
                </label>
              </li>
            }
            {canvasAnnotationLayers.map((annotationLayer, index) => (
              <li key={`annotaion-layer-${index}`} className="annotations-dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={isSelected(annotationLayer)}
                    onChange={() => handleSelect(annotationLayer)}
                  />
                  {annotationLayer.label}
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

AnnotationLayerSelect.propTypes = {
  canvasAnnotationLayers: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  setDisplayedAnnotationLayers: PropTypes.func.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired,
};

export default AnnotationLayerSelect;
