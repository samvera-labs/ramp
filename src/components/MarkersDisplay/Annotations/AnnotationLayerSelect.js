import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  parseExternalAnnotationPage,
  parseExternalAnnotationResource
} from '@Services/annotations-parser';

const AnnotationLayerSelect = ({ annotationLayers = [], duration = 0 }) => {
  const [selectedAnnotationLayers, setSelectedAnnotationLayers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

  useEffect(() => {
    if (annotationLayers?.length > 0) {
      // Sort annotation sets alphabetically
      annotationLayers.sort((a, b) => a.label.localeCompare(b.label));
      // Select the first annotation set on page load
      setSelectedAnnotationLayers([annotationLayers[0].label]);
      fetchAndParseLinkedAnnotations(annotationLayers[0]);
      setDisplayAnnotations(annotationLayers[0].label);
    }
  }, [annotationLayers]);

  const isSelected = (layer) => selectedAnnotationLayers.includes(layer.label);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  /**
   * Event handler for the check-box for each annotation layer in the dropdown
   * @param {Object} annotationLayer checked/unchecked layer
   */
  const handleSelect = async (annotationLayer) => {
    fetchAndParseLinkedAnnotations(annotationLayer);

    // Update selected annotation layers list to update UI as checked/unchecked
    setSelectedAnnotationLayers((prev) =>
      isSelected(annotationLayer)
        ? prev.filter((item) => item !== annotationLayer.label)
        : [...prev, annotationLayer.label]
    );
  };

  /**
   * Fetch linked annotations and parse its content only on first time selection
   * of the annotation layer
   * @param {Object} annotationLayer checked/unchecked layer
   */
  const fetchAndParseLinkedAnnotations = async (annotationLayer) => {
    if (!isSelected(annotationLayer)) {
      let annotations = [];
      // Only fetch and parse AnnotationPage for the first time selection
      if (annotationLayer.url && !annotationLayer.items) {
        // Parse linked annotations as AnnotationPage json
        if (!annotationLayer?.linkedResource) {
          let parsedAnnotationPage = await parseExternalAnnotationPage(annotationLayer.url, duration);
          annotations = parsedAnnotationPage?.length > 0 ? parsedAnnotationPage[0].items : [];
          annotationLayer.items = annotations;
        }
        // Parse linked annotations of other types, e.g. WebVTT, SRT, plain text, etc.
        else {
          let annotations = await parseExternalAnnotationResource(annotationLayer);
          annotationLayer.items = annotations.tData;
        }
      }
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
        annotationLayers.map((annotationLayer) => {
          fetchAndParseLinkedAnnotations(annotationLayer);
          // Mark all annotationLayers as selected if they were not already selected
          setSelectedAnnotationLayers((prev) =>
            !isSelected(annotationLayer) ? [...prev, annotationLayer.label] : [...prev]
          );
        })
      );
    } else {
      // Clear all selections
      setSelectedAnnotationLayers([]);
    }

    // Close the dropdown
    toggleDropdown();
  };

  return (
    <div className="ramp--annotatations__multi-select">
      <div className="ramp--annotations__multi-select-header" onClick={toggleDropdown}>
        {selectedAnnotationLayers.length > 0
          ? `${selectedAnnotationLayers.length} of ${annotationLayers.length} layers selected`
          : "Select Annotation layer(s)"}
        <span className={`annotations-dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <ul className="annotations-dropdown-menu">
          {
            // Only show select all option when there's more than one annotation layer
            annotationLayers?.length > 1 &&
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
          {annotationLayers.map((annotationLayer, index) => (
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
    </div>
  );
};

AnnotationLayerSelect.propTypes = {
  annotationLayers: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
};

export default AnnotationLayerSelect;
