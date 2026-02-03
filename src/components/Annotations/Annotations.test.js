import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import Annotations from './Annotations';
import manifest from '@TestData/playlist';
import manifestWoMarkers from '@TestData/lunchroom-manners';
import { manifestState, withManifestAndPlayerProvider } from '../../services/testing-helpers';
import * as hooks from '@Services/ramp-hooks';
import * as annotationParser from '@Services/annotations-parser';


describe('Annotations component', () => {
  // Mock custom hook output
  jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({}));

  describe('with manifest with markers', () => {
    beforeEach(() => {
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(manifest, 2),
          playlist: {
            hasAnnotationService: true,
            isEditing: false,
            annotationServiceId: 'http://example.com/marker',
            markers: [],
            isPlaylist: true,
          },
          annotations: [annotationParser.parseAnnotationSets(manifest, 2)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
    });

    test('renders successfully', () => {
      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).toBeInTheDocument();
    });

    test('renders all marker information in chronological order', () => {
      const markerRows = screen.queryAllByTestId('marker-row');
      expect(markerRows).toHaveLength(3);

      expect(within(markerRows[0]).queryByText('Marker 1')).toBeInTheDocument();
      expect(within(markerRows[0]).queryByText('00:00:02.836')).toBeInTheDocument();
      expect(within(markerRows[1]).queryByText('Marker 2')).toBeInTheDocument();
      expect(within(markerRows[1]).queryByText('00:00:25.941')).toBeInTheDocument();
      expect(within(markerRows[2]).queryByText('Marker 0')).toBeInTheDocument();
      expect(within(markerRows[2]).queryByText('00:00:31.941')).toBeInTheDocument();
    });

    test('renders edit/delete buttons for each marker', () => {
      expect(screen.queryAllByTestId('edit-button')).toHaveLength(3);
      expect(screen.queryAllByTestId('delete-button')).toHaveLength(3);
    });

    describe('editing markers', () => {
      /** Reference: https://dev.to/pyyding/comment/mk2n  */
      const abortCall = jest.fn();
      global.AbortController = class {
        signal = 'test-signal';
        abort = abortCall;
      };
      let firstEditButton, secondEditButton, firstDeleteButton, secondDeleteButton;
      beforeEach(() => {
        firstEditButton = screen.queryAllByTestId('edit-button')[0];
        secondEditButton = screen.queryAllByTestId('edit-button')[1];
        firstDeleteButton = screen.queryAllByTestId('delete-button')[0];
        secondDeleteButton = screen.queryAllByTestId('delete-button')[1];
      });

      test('renders edit form on edit button click', () => {
        expect(screen.queryByTestId('edit-label')).not.toBeInTheDocument();

        fireEvent.click(firstEditButton);

        expect(screen.queryByTestId('edit-label')).toBeInTheDocument();
        expect(screen.queryByTestId('edit-timestamp')).toBeInTheDocument();
        expect(screen.queryByTestId('edit-save-button')).toBeInTheDocument();
      });

      test('disables other marker edit actions on click', () => {
        fireEvent.click(firstEditButton);

        expect(secondEditButton).toBeDisabled();
        expect(secondDeleteButton).toBeDisabled();
      });

      test('validates timestamp', () => {
        fireEvent.click(firstEditButton);

        const timestampInput = screen.getByTestId('edit-timestamp');
        expect(timestampInput).toHaveDisplayValue('00:00:02.836');

        fireEvent.change(timestampInput, { target: { value: '00' } });
        expect(timestampInput).toHaveClass('time-invalid');

        fireEvent.change(timestampInput, { target: { value: '00:01' } });
        expect(timestampInput).toHaveClass('time-valid');

        fireEvent.change(timestampInput, { target: { value: '00:01:02.' } });
        expect(timestampInput).toHaveClass('time-invalid');

        fireEvent.change(timestampInput, { target: { value: '00:01:02.42' } });
        expect(timestampInput).toHaveClass('time-valid');
      });

      test('saving updates the markers table', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 201,
        });
        fireEvent.click(firstEditButton);
        const labelInput = screen.getByTestId('edit-label');
        expect(labelInput).toHaveDisplayValue('Marker 1');

        fireEvent.change(labelInput, { target: { value: 'Test Marker' } });
        act(() => fireEvent.click(screen.getByTestId('edit-save-button')));

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(screen.queryByText('Test Marker')).toBeInTheDocument();
        });
      });

      test('saving edited marker re-renders markers in chronological order', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 201,
        });
        const markerRows = screen.queryAllByTestId('marker-row');
        expect(markerRows).toHaveLength(3);

        // Marker with label 'Marker 2' is initially the second row
        expect(within(markerRows[1]).queryByText('Marker 2')).toBeInTheDocument();
        expect(within(markerRows[1]).queryByText('00:00:25.941')).toBeInTheDocument();

        fireEvent.click(secondEditButton);

        const timestampInput = screen.getByTestId('edit-timestamp');
        expect(timestampInput).toHaveDisplayValue('00:00:25.941');

        // Update 'Marker 2' timestamp to be earlier than 'Marker 1'
        fireEvent.change(timestampInput, { target: { value: '00:00:00.422' } });
        expect(timestampInput).toHaveClass('time-valid');

        act(() => fireEvent.click(screen.getByTestId('edit-save-button')));

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          // After updating 'Marker 2' is now the first row
          expect(within(markerRows[0]).queryByText('Marker 2')).toBeInTheDocument();
          expect(within(markerRows[0]).queryByText('00:00:00.422')).toBeInTheDocument();
        });
      });

      test('delete action removes the marker from table', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
        });
        fireEvent.click(secondDeleteButton);

        expect(screen.queryByTestId('delete-confirm-button')).toBeInTheDocument();
        act(() => fireEvent.click(screen.getByTestId('delete-confirm-button')));

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(screen.queryByText('Marker 2')).not.toBeInTheDocument();
        });
      });

      test('user actions do not have csrf token in header when it is not present in DOM', async () => {
        const deleteFetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
        });
        const deleteOptions = {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
          },
        };

        fireEvent.click(secondDeleteButton);
        act(() => fireEvent.click(screen.queryByTestId('delete-confirm-button')));

        await waitFor(() => {
          expect(deleteFetchSpy).toHaveBeenCalled();
          expect(deleteFetchSpy).toHaveBeenCalledWith(
            "http://example.com/playlists/1/canvas/3/marker/4",
            deleteOptions,
            { signal: 'test-signal' },
          );
        });
      });
    });
  });

  describe('with csrf token in DOM', () => {
    /** Reference: https://dev.to/pyyding/comment/mk2n  */
    const abortCall = jest.fn();
    global.AbortController = class {
      signal = 'test-signal';
      abort = abortCall;
    };

    beforeEach(() => {
      // Set up CSRF token before rendering the component
      document.head.innerHTML = '<meta name="csrf-token" content="csrftoken">';
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(manifest, 2),
          playlist: {
            hasAnnotationService: true,
            isEditing: false,
            annotationServiceId: 'http://example.com/marker',
            markers: [],
            isPlaylist: true,
          },
          annotations: [annotationParser.parseAnnotationSets(manifest, 2)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
    });

    afterEach(() => {
      // Clean up the CSRF meta tag
      document.head.innerHTML = '';
    });

    test('user actions have csrf token in header when it is present in DOM', async () => {
      const deleteFetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
      });
      const deleteOptions = {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': 'csrftoken',
        },
      };

      const secondDeleteButton = screen.queryAllByTestId('delete-button')[1];
      fireEvent.click(secondDeleteButton);
      fireEvent.click(screen.getByTestId('delete-confirm-button'));

      await waitFor(() => {
        expect(deleteFetchSpy).toHaveBeenCalled();
        expect(deleteFetchSpy).toHaveBeenCalledWith(
          "http://example.com/playlists/1/canvas/3/marker/4",
          deleteOptions,
          { signal: 'test-signal' },
        );
      });
    });
  });

  describe('with manifest without markers', () => {
    test('renders successfully', () => {
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(manifestWoMarkers),
          playlist: { isPlaylist: true }
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).not.toBeInTheDocument();
    });
  });

  describe('renders markers display', () => {
    test('without create new marker button for a manifest without annotation service', () => {
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(manifest, 2),
          playlist: { isPlaylist: true, hasAnnotationService: false, markers: [] },
          annotations: [annotationParser.parseAnnotationSets(manifest, 2)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).toBeInTheDocument();
      expect(screen.queryByTestId('create-new-marker')).not.toBeInTheDocument();
    });

    test('with create new marker button for a manifest with annotation service', () => {
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(manifest, 2),
          playlist: {
            isPlaylist: true, hasAnnotationService: true,
            annotationServiceId: 'http://example.com/marker',
            markers: []
          },
          annotations: [annotationParser.parseAnnotationSets(manifest, 2)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).toBeInTheDocument();
      expect(screen.queryByTestId('create-new-marker')).toBeInTheDocument();
    });
  });

  // Annotations list with both 'supplementing' and 'highlighting' motivation
  describe('with manifest with mixed annotations', () => {
    // Manifest with markers and transcript in annotations list (Avalon specific)
    const mixedMotivationAnnotations = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://example.com/linked-annotations/manifest.json',
      type: 'Manifest',
      label: { 'en': ['Mixed motivation Annotations'] },
      items: [
        {
          id: 'https://example.com/linked-mixed-annotations/canvas-1/canvas',
          type: 'Canvas',
          duration: 3400.0,
          annotations: [
            {
              type: 'AnnotationPage',
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1',
              items: [
                {
                  id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/1',
                  type: 'Annotation',
                  motivation: 'supplementing',
                  body: {
                    id: 'https://example.com/linked-mixed-annotations/lunchroom_manners/supplemental/1/transcripts',
                    type: 'Text',
                    format: 'text/vtt',
                    label: { en: ['Transcript in WebVTT format'], },
                  },
                  target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1'
                },
                {
                  id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/2',
                  type: 'Annotation',
                  motivation: 'highlighting',
                  body: {
                    id: '',
                    type: 'TextualBody',
                    format: 'text/html',
                    value: 'Test Marker 1',
                  },
                  target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=76.43'
                },
                {
                  id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/3',
                  type: 'Annotation',
                  motivation: 'highlighting',
                  body: {
                    id: '',
                    type: 'TextualBody',
                    format: 'text/html',
                    value: 'Test Marker 2',
                  },
                  target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=163.85'
                },
              ]
            }
          ],
          items: [
            {
              id: "https://example.com/linked-mixed-annotations/canvas-1/paintings",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://example.com/linked-mixed-annotations/canvas-1/painting",
                  type: "Annotation",
                  motivation: "painting",
                  body: {
                    id: "https://example.com/linked-mixed-annotations/mahler-symphony.mp3",
                    type: "Sound",
                    format: "audio/mp3",
                    duration: 3400
                  },
                  target: "https://example.com/linked-mixed-annotations/canvas-1/canvas"
                }
              ]
            }
          ]
        }
      ]
    };

    test('renders AnnotationList for non-playlist context', async () => {
      // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
      const ResizeObserver = jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
      window.ResizeObserver = ResizeObserver;

      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(mixedMotivationAnnotations),
          canvasDuration: 3400,
          annotations: [annotationParser.parseAnnotationSets(mixedMotivationAnnotations, 0)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
      await act(() => Promise.resolve());

      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).not.toBeInTheDocument();
      expect(screen.queryByTestId('annotations-list')).toBeInTheDocument();
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      expect(screen.queryAllByTestId('annotation-row')).toHaveLength(0);
    });

    test('does not render AnnotationList for playlist context', async () => {
      const AnnotationsWrapped = withManifestAndPlayerProvider(Annotations, {
        initialManifestState: {
          ...manifestState(mixedMotivationAnnotations, 0, true),
          canvasDuration: 3400,
          annotations: [annotationParser.parseAnnotationSets(mixedMotivationAnnotations, 0)],
        },
        initialPlayerState: { player: { currentTime: jest.fn() } },
      });
      render(
        <ErrorBoundary>
          <AnnotationsWrapped />
        </ErrorBoundary>
      );
      await act(() => Promise.resolve());

      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).toBeInTheDocument();
      expect(screen.queryByTestId('annotations-list')).not.toBeInTheDocument();
    });
  });
});
