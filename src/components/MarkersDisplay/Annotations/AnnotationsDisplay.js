import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AnnotationLayerSelect from './AnnotationLayerSelect';
import '../MarkersDisplay.scss';
import AnnotationRow from './AnnotationRow';
import { sortAnnotations } from '@Services/utility-helpers';

const AnnotationsDisplay = ({ annotations, canvasIndex, duration, displayMotivations }) => {
  const [canvasAnnotationLayers, setCanvasAnnotationLayers] = useState([]);
  const [displayedAnnotationLayers, setDisplayedAnnotationLayers] = useState([]);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const annotationDisplayRef = useRef(null);

  /**
   * Filter and merge annotations parsed from either an AnnotationPage or a linked
   * resource in Annotation objects within an AnnotationPage for selected annotation
   * layers.
   */
  const displayedAnnotations = useMemo(() => {
    return displayedAnnotationLayers?.length > 0
      ? sortAnnotations(displayedAnnotationLayers.map((a) => a.items).flat())
      : [];
  }, [displayedAnnotationLayers]);

  /**
   * Check if the annotations related to the Canvas have motivation(s) specified
   * by the user when the component is initialized.
   * If none of the annotations in the Canvas has at least one the specified
   * motivation(s), then a message is displayed to the user.
   */
  const hasDisplayAnnotations = useMemo(() => {
    if (displayedAnnotations?.length > 0 && displayedAnnotations[0] != undefined) {
      const motivations = displayedAnnotations.map((a) => a.motivation);
      return displayMotivations?.length > 0
        ? displayMotivations.some(m => motivations.includes(m))
        : true;
    }
  }, [displayedAnnotations]);

  /**
   * Update annotation sets for the current Canvas
   */
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
            setDisplayedAnnotationLayers={setDisplayedAnnotationLayers}
            setAutoScrollEnabled={setAutoScrollEnabled}
            autoScrollEnabled={autoScrollEnabled}
          />
        </div>
        <div className="ramp--annotations__content" tabIndex={0} ref={annotationDisplayRef}>
          {hasDisplayAnnotations && displayedAnnotations != undefined
            && displayedAnnotations?.length > 0 && (
              <ul>
                {displayedAnnotations.map((annotation, index) => {
                  return (
                    <AnnotationRow
                      key={index}
                      annotation={annotation}
                      displayMotivations={displayMotivations}
                      autoScrollEnabled={autoScrollEnabled}
                      containerRef={annotationDisplayRef}
                    />
                  );
                })}
              </ul>
            )
          }
          {!hasDisplayAnnotations && displayMotivations?.length != 0 && (
            <p>{`No Annotations with ${displayMotivations.join('/')} motivation.`}</p>
          )}
        </div>
      </div>
    );
  }
};

AnnotationsDisplay.propTypes = {
  annotations: PropTypes.array.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  displayMotivations: PropTypes.array.isRequired,
};

export default AnnotationsDisplay;
