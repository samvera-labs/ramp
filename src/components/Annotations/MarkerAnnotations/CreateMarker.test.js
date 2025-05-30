import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateMarker from './CreateMarker';
import * as hooks from '@Services/ramp-hooks';

describe('CreateMarker component', () => {
  const handleCreateMock = jest.fn();
  const getCurrentTimeMock = jest.fn(() => { return 44.3; });
  // Mock custom hook output
  jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({
    getCurrentTime: getCurrentTimeMock
  }));
  beforeEach(() => {
    render(<CreateMarker
      newMarkerEndpoint={'http://example.com/marker'}
      canvasId={'http://example.com/manifest/canvas/1'}
      handleCreate={handleCreateMock} />);
  });

  test('renders successfully', () => {
    expect(screen.queryByTestId('create-new-marker-button')).toBeInTheDocument();
    expect(screen.queryByTestId('create-new-marker-form')).not.toBeInTheDocument();
  });

  test('add new marker button click opens form', () => {
    fireEvent.click(screen.getByTestId('create-new-marker-button'));
    expect(screen.queryByTestId('create-new-marker-form')).toBeInTheDocument();
    expect(screen.getByTestId('create-marker-title')).toBeInTheDocument();
    expect(screen.getByTestId('create-marker-timestamp')).toBeInTheDocument();
  });

  test('form opens with empty title and current time of playhead', () => {
    fireEvent.click(screen.getByTestId('create-new-marker-button'));
    waitFor(() => {
      expect(screen.getByTestId('create-marker-title')).toHaveTextContent('');
      expect(getCurrentTimeMock).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('create-marker-timestamp')).toHaveTextContent('00:00:44.300');
      expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-valid');
    });
  });

  test('validates time input and enable/disable save button', () => {
    fireEvent.click(screen.getByTestId('create-new-marker-button'));
    fireEvent.change(screen.getByTestId('create-marker-timestamp'), { target: { value: '00' } });
    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-invalid');
    expect(screen.getByTestId('edit-save-button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('create-marker-timestamp'), { target: { value: '00:00' } });
    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-valid');
    expect(screen.getByTestId('edit-save-button')).not.toBeDisabled();

    fireEvent.change(screen.getByTestId('create-marker-timestamp'), { target: { value: '00:00:' } });
    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-invalid');
    expect(screen.getByTestId('edit-save-button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('create-marker-timestamp'), { target: { value: '00:00:32.' } });
    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-invalid');
    expect(screen.getByTestId('edit-save-button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('create-marker-timestamp'), { target: { value: '00:00:32.543' } });
    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-valid');
    expect(screen.getByTestId('edit-save-button')).not.toBeDisabled();
  });

  test('saves marker on save button click', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 201,
      json: jest.fn(() => {
        return {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          "id": "http://example.com/marker/1",
          "type": "Annotation",
          "motivation": "highlighting",
          "body": {
            "type": "TextualBody",
            "value": "Test Marker"
          },
          "target": "http://example.com/manifest/canvas/1#t=44.3"
        };
      })
    });

    fireEvent.click(screen.getByTestId('create-new-marker-button'));
    fireEvent.change(screen.getByTestId('create-marker-title'), { target: { value: 'Test Marker' } });

    expect(screen.getByTestId('create-marker-timestamp')).toHaveClass('time-valid');
    expect(screen.getByTestId('edit-save-button')).not.toBeDisabled();

    fireEvent.click(screen.getByTestId('edit-save-button'));
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(handleCreateMock).toHaveBeenCalledTimes(1);
    });
  });
});
