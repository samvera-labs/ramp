import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AnnotationLayerSelect from './AnnotationLayerSelect';
import '../MarkersDisplay.scss';

const AnnotationsDisplay = ({ annotations, canvasIndex, duration, annotationMotivations }) => {
  const [canvasAnnotationLayers, setCanvasAnnotationLayers] = useState([]);

  useEffect(() => {
    if (annotations?.length > 0) {
      const { _, annotationSets } = annotations
        .filter((a) => a.canvasIndex === canvasIndex)[0];
      setCanvasAnnotationLayers(annotationSets);
    }
  }, [annotations, canvasIndex]);

  if (canvasAnnotationLayers?.length > 0) {
    return (
      <div className="ramp--annotations__display"
        data-testid="annotations-display">
        <div className="ramp--annotations__select">
          <label>Annotation layers: </label>
          <AnnotationLayerSelect
            annotationLayers={canvasAnnotationLayers}
            duration={duration}
          />
        </div>
      </div>
    );
  }
};

AnnotationsDisplay.propTypes = {
  annotations: PropTypes.array.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  annotationMotivations: PropTypes.array.isRequired,
};

export default AnnotationsDisplay;
