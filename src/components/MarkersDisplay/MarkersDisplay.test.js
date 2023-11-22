import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import MarkersDisplay from './MarkersDisplay';
import manifest from '@TestData/playlist';
import manifestWoMarkers from '@TestData/lunchroom-manners';
import { withManifestAndPlayerProvider } from '../../services/testing-helpers';

describe('MarkersDisplay component', () => {
  describe('with manifest with markers', () => {
    beforeEach(() => {
      const MarkersDisplayWrapped = withManifestAndPlayerProvider(MarkersDisplay, {
        initialManifestState: {
          manifest,
          canvasIndex: 1,
          playlist: {
            hasAnnotationService: true,
            isEditing: false,
            annotationServiceId: 'http://example.com/marker'
          }
        },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <MarkersDisplayWrapped />
        </ErrorBoundary>
      );
    });

    test('renders successfully', () => {
      expect(screen.queryByTestId('markers-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-empty')).not.toBeInTheDocument();
    });

    test('renders all marker information properly', () => {
      expect(screen.queryByText('Marker 1')).toBeInTheDocument();
      expect(screen.queryByText('00:00:02.836')).toBeInTheDocument();
      expect(screen.queryByText('Marker 2')).toBeInTheDocument();
      expect(screen.queryByText('00:00:25.941')).toBeInTheDocument();
    });

    test('renders edit/delete buttons for each marker', () => {
      expect(screen.queryAllByTestId('edit-button')).toHaveLength(2);
      expect(screen.queryAllByTestId('delete-button')).toHaveLength(2);
    });

    describe('editing markers', () => {
      let firstEditButton, secondEditButton,
        firstDeleteButton, secondDeleteButton;
      beforeEach(() => {
        const MarkersDisplayWrapped = withManifestAndPlayerProvider(MarkersDisplay, {
          initialManifestState: {
            manifest,
            canvasIndex: 1,
            playlist: {
              hasAnnotationService: true,
              isEditing: false,
              annotationServiceId: 'http://example.com/marker'
            }
          },
          initialPlayerState: {},
        });
        render(
          <ErrorBoundary>
            <MarkersDisplayWrapped />
          </ErrorBoundary>
        );
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

      test('saving updates the markers table', () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 201,
        });
        fireEvent.click(firstEditButton);
        const labelInput = screen.getByTestId('edit-label');
        expect(labelInput).toHaveDisplayValue('Marker 1');

        fireEvent.change(labelInput, { target: { value: 'Test Marker' } });
        fireEvent.click(screen.getByTestId('edit-save-button'));

        waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(screen.queryByText('Test Marker')).toBeInTheDocument();
        });
      });

      test('delete action removes the marker from table', () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
        });
        fireEvent.click(secondDeleteButton);

        expect(screen.queryByTestId('delete-confirm-button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('delete-confirm-button'));

        waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(screen.queryByText('Marker 2')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('with manifest without markers', () => {
    test('renders successfully', () => {
      const MarkersDisplayWrapped = withManifestAndPlayerProvider(MarkersDisplay, {
        initialManifestState: {
          manifest: manifestWoMarkers,
          canvasIndex: 0,
          playlist: {}
        },
        initialPlayerState: {},
      });
      render(
        <ErrorBoundary>
          <MarkersDisplayWrapped />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId('markers-display')).toBeInTheDocument();
      expect(screen.queryByTestId('markers-display-table')).not.toBeInTheDocument();
      expect(screen.queryByTestId('markers-empty')).toBeInTheDocument();
      waitFor(() => {
        expect(screen.queryByText('No markers were found in the Canvas')).toBeInTheDocument();
      });
    });
  });
});
