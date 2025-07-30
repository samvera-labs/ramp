import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AnnotationSetSelect from './AnnotationSetSelect';
import '../Annotations.scss';
import AnnotationRow from './AnnotationRow';
import { autoScroll, sortAnnotations } from '@Services/utility-helpers';
import Spinner from '@Components/Spinner';
import { SUPPORTED_MOTIVATIONS } from '@Services/annotations-parser';

const AnnotationList = ({ annotations, canvasIndex, duration, displayMotivations, showMoreSettings }) => {
  const [canvasAnnotationSets, setCanvasAnnotationSets] = useState([]);
  const [displayedAnnotationSets, setDisplayedAnnotationSets] = useState([]);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const annotationDisplayRef = useRef(null);
  const annotationRowContainerRef = useRef(null);

  // Index of the focused annotation row in the list
  const currentIndex = useRef(0);
  const setCurrentIndex = (i) => currentIndex.current = i;

  /**
   * Update annotation sets for the current Canvas
   */
  useEffect(() => {
    // Re-set isLoading on Canvas change
    setIsLoading(true);

    if (annotations?.length > 0) {
      const { _, annotationSets } = annotations
        .filter((a) => a.canvasIndex === canvasIndex)[0];
      // Filter timed annotationSets to be displayed in Annotations component
      // Avoids PDF, Docx files linked as 'supplementing' annotations
      if (annotationSets?.length > 0) {
        setCanvasAnnotationSets(annotationSets.filter((a) => a.timed));
      }
    }
  }, [annotations, canvasIndex]);

  /**
   * Filter and merge annotations parsed from either an AnnotationPage or a linked
   * resource in Annotation objects within an AnnotationPage for selected annotation
   * sets.
   */
  const displayedAnnotations = useMemo(() => {
    return displayedAnnotationSets?.length > 0
      ? sortAnnotations(displayedAnnotationSets.map((a) => a.items).flat())
      : [];
  }, [displayedAnnotationSets]);

  /**
   * Identify any of the displayed annotation sets have linked resource(s).
   * This value is used to initiate a delayed state update to the 'isLoading'
   * variable, to stop displaying a no annotations message while fetch requests
   * are in progress.
   */
  const hasExternalAnnotations = useMemo(() => {
    return displayedAnnotationSets?.length > 0
      ? displayedAnnotationSets.map((a) => a.linkedResource).reduce((acc, curr) => {
        return acc || curr;
      }, false)
      : false;
  }, [displayedAnnotationSets]);

  /**
   * Set timeout function with an AbortController
   * @param {Function} callback 
   * @param {Number} delay milliseconds number to wait
   * @param {Object} signal abort signal from AbortController
   */
  const setTimeoutWithAbort = (callback, delay, signal) => {
    if (signal?.aborted) { return; }
    const timeOutId = setTimeout(() => {
      if (!signal?.aborted) { callback(); }
    }, delay);
    // Listener to abort signal to clear existing timeout
    signal?.addEventListener('abort', () => {
      clearTimeout(timeOutId);
    });
  };

  /**
   * Check if the annotations related to the Canvas have motivation(s) specified
   * by the user when the component is initialized.
   * If none of the annotations in the Canvas has at least one the specified
   * motivation(s), then a message is displayed to the user.
   */
  const hasDisplayAnnotations = useMemo(() => {
    // AbortController for timeout function to toggle 'isLoading'
    let abortController;
    if (displayedAnnotations?.length > 0 && displayedAnnotations[0] != undefined) {
      // If annotations are read before executing the timeout in the else condition,
      // abort the timeout
      abortController?.abort();
      // Once annotations are present remove the Spinner
      setIsLoading(false);
      const motivations = displayedAnnotations.map((a) => a.motivation);
      // Check if any of the annotations have the specified motivation(s) or default motivations
      return displayMotivations?.length > 0
        ? displayMotivations.some(m => motivations.flat().includes(m))
        : SUPPORTED_MOTIVATIONS.some(m => motivations.flat().includes(m));
    } else {
      // Abort existing abortControll before creating a new one
      abortController?.abort();
      /**
       * Initiate a delayed call to toggle 'isLoading' with an abortController.
       * This allows the UI to wait for annotations from any linked resources before 
       * displaying a no annotations message while the fetch requests are in progress.
       */
      abortController = new AbortController();
      if (hasExternalAnnotations) {
        setTimeoutWithAbort(() => {
          setIsLoading(false);
        }, 500, abortController.signal);
      }
      return false;
    }
  }, [displayedAnnotations]);

  const annotationSetSelect = useMemo(() => {
    return (<AnnotationSetSelect
      key={canvasIndex}
      canvasAnnotationSets={canvasAnnotationSets}
      duration={duration}
      setDisplayedAnnotationSets={setDisplayedAnnotationSets}
      setAutoScrollEnabled={setAutoScrollEnabled}
      autoScrollEnabled={autoScrollEnabled}
    />);
  }, [autoScrollEnabled, canvasAnnotationSets]);

  /**
   * Handle keyboard accessibility within the annotations component using
   * roving tabindex strategy.
   * All annotation rows are given 'tabIndex' -1 except for the first annotation row
   * in the list, which is set to 0.
   * Then as the user uses 'ArrowDown' and 'ArrowDown' keys move up and down through
   * the annotation rows the focus is moved enabling activation of each focused cue
   * in the AnnotationRow component using keyboard.
   * @param {Event} e keydown event
   */
  const handleKeyDown = (e) => {
    // Get all annotation rows by the click-able element className
    const annotationRows = annotationRowContainerRef.current.querySelectorAll('.ramp--annotations__annotation-row-time-tags');
    if (annotationRows?.length > 0) {
      let nextIndex = currentIndex.current;
      if (e.key === 'ArrowDown') {
        // Wraps focus back to first cue when the end of annotations list is reached
        nextIndex = (currentIndex.current + 1) % annotationRows.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex.current - 1 + annotationRows.length) % annotationRows.length;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex.current) {
        annotationRows[currentIndex.current].tabIndex = -1;
        annotationRows[nextIndex].tabIndex = 0;
        annotationRows[nextIndex].focus();
        // Scroll the focused annotation row into view
        autoScroll(annotationRows[nextIndex], annotationDisplayRef, true);
        setCurrentIndex(nextIndex);
      }
    }
  };

  const annotationRows = useMemo(() => {
    if (isLoading) {
      return <Spinner />;
    } else {
      if (hasDisplayAnnotations && displayedAnnotations?.length > 0) {
        return (
          <div onKeyDown={handleKeyDown}
            ref={annotationRowContainerRef}
            aria-label='Scrollable time-synced annotations list'
          >
            {displayedAnnotations.map((annotation, index) => {
              return (
                <AnnotationRow
                  key={index}
                  annotation={annotation}
                  displayMotivations={displayMotivations}
                  autoScrollEnabled={autoScrollEnabled}
                  containerRef={annotationDisplayRef}
                  displayedAnnotations={displayedAnnotations}
                  showMoreSettings={showMoreSettings}
                  index={index}
                />
              );
            })}
          </div>
        );
      } else {
        return (
          <p data-testid="no-annotations-message">
            {displayMotivations?.length > 0
              ? `No Annotations were found with ${displayMotivations.join('/')} motivation.`
              : 'No Annotations were found for the selected set(s).'}
          </p>
        );
      }
    }
  }, [hasDisplayAnnotations, displayedAnnotations, isLoading, autoScrollEnabled]);

  if (canvasAnnotationSets?.length > 0) {
    return (
      <div className="ramp--annotations__list"
        data-testid="annotations-list">
        {annotationSetSelect}
        <div className="ramp--annotations__content"
          data-testid="annotations-content" tabIndex={-1}
          ref={annotationDisplayRef}
        >
          {annotationRows}
        </div>
      </div>
    );
  } else {
    return (
      <p data-testid="no-annotation-sets-message">
        No Annotations sets were found for the Canvas.
      </p>
    );
  }
};

AnnotationList.propTypes = {
  annotations: PropTypes.array.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  displayMotivations: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  showMoreSettings: PropTypes.object.isRequired,
};

export default AnnotationList;
