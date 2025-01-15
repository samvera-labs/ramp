import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AnnotationRow from './AnnotationRow';
import * as hooks from '@Services/ramp-hooks';

describe('AnnotationRow component', () => {
  const checkCanvasMock = jest.fn();
  const playerCurrentTimeMock = jest.fn((time) => { return time; });
  // Mock custom hook output
  jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({
    currentTime: 0,
    player: { currentTime: playerCurrentTimeMock, targets: [{ start: 10.23, end: 100.34 }] }
  }));
  jest.spyOn(hooks, 'useAnnotations').mockImplementation(() => ({
    checkCanvas: checkCanvasMock
  }));
  const containerRef = { current: document.createElement('div') };
  const props = { displayMotivations: [], autoScrollEnabled: true, containerRef };

  describe('with displayMotivations=[] (default)', () => {
    test('displays annotation with \'supplementing\' motivation', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing'],
        time: { start: 0, end: 10 },
        value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
      };
      render(<AnnotationRow {...props} annotation={annotation} />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByText('Men singing')).toBeInTheDocument();
      expect(screen.queryAllByTestId(/annotation-tag-*/).length).toBe(0);
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
      expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');
    });

    test('displays annotation with \'commenting\' motivation', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['commenting'],
        time: { start: 10, end: undefined },
        value: [{ format: 'text/plain', purpose: ['commenting'], value: 'Men singing' }]
      };
      render(<AnnotationRow {...props} annotation={annotation} />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByText('Men singing')).toBeInTheDocument();
      expect(screen.queryAllByTestId(/annotation-tag-*/).length).toBe(0);
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:10.000');
      expect(screen.queryByTestId('annotation-end-time')).not.toBeInTheDocument();
    });

    describe('displays annotation tags for annotation with \'tagging\'', () => {
      test('and \'supplementing\' motivations', () => {
        const annotation = {
          id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
          canvasId: 'http://example.com/manifest/canvas/1',
          motivation: ['supplementing', 'tagging'],
          time: { start: 0, end: 10 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
        };
        render(<AnnotationRow {...props} annotation={annotation} />);

        expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
        expect(screen.getByText('Men singing')).toBeInTheDocument();
        expect(screen.queryAllByTestId(/annotation-tag-*/).length).toBe(1);
        expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
        expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
        expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');
      });

      test('and \'commenting\' motivations', () => {
        const annotation = {
          id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
          canvasId: 'http://example.com/manifest/canvas/1',
          motivation: ['commenting', 'tagging'],
          time: { start: 10, end: undefined },
          value: [{ format: 'text/plain', purpose: ['commenting'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
        };
        render(<AnnotationRow {...props} annotation={annotation} />);

        expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
        expect(screen.getByText('Men singing')).toBeInTheDocument();
        expect(screen.queryAllByTestId(/annotation-tag-*/).length).toBe(1);
        expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
        expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:10.000');
        expect(screen.queryByTestId('annotation-end-time')).not.toBeInTheDocument();
      });
    });
  });

  test('displays HTML tags in the annotation textual body', () => {
    const annotation = {
      id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
      canvasId: 'http://example.com/manifest/canvas/1',
      motivation: ['commenting', 'tagging'],
      time: { start: 10, end: undefined },
      value: [{ format: 'text/plain', purpose: ['commenting'], value: '<strong>Men</strong> singing' },
      { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
    };
    render(<AnnotationRow {...props} annotation={annotation} />);

    expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
    // Do not display only plain text
    expect(screen.queryByText('Men singing')).not.toBeInTheDocument();
    // Displays text with inline HTML
    expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();
    expect(screen.getByTestId('annotation-text-0').childNodes[0].tagName).toBe('STRONG');
    expect(screen.getByTestId('annotation-text-0')).toHaveTextContent('Men singing');
  });

  describe('with displayMotivations=[\'supplementing\']', () => {
    test('displays annotation with \'supplementing\' motivation', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing', 'tagging'],
        time: { start: 0, end: 10 },
        value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
        { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
      };
      render(<AnnotationRow {...props}
        annotation={annotation}
        displayMotivations={['supplementing']}
      />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByText('Men singing')).toBeInTheDocument();
      expect(screen.queryAllByTestId(/annotation-tag-*/).length).toBe(1);
      expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
      expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');
    });

    test('does not display annotation with \'commenting\' motivation', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['commenting'],
        time: { start: 10, end: undefined },
        value: [{ format: 'text/plain', purpose: ['commenting'], value: 'Men singing' }]
      };
      render(<AnnotationRow
        {...props}
        annotation={annotation} displayMotivations={['supplementing']}
      />);
      expect(screen.queryByTestId('annotation-row')).not.toBeInTheDocument();
    });
  });

  describe('clicking an annotation row', () => {
    const annotation = {
      id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
      canvasId: 'http://example.com/manifest/canvas/1',
      motivation: ['supplementing', 'tagging'],
      time: { start: 25.32, end: 45.65 },
      value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
      { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
    };
    test('sets player\'s currentTime when time is within the duration of the media', () => {
      render(<AnnotationRow
        {...props}
        annotation={{ ...annotation, time: { start: 25.32, end: 45.65 } }}
      />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByTestId('annotation-text-0')).toHaveTextContent('Men singing');
      expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:25.32');
      expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:00:45.65');

      fireEvent.click(screen.getByTestId('annotation-row'));

      expect(playerCurrentTimeMock).toHaveBeenCalledTimes(1);
      expect(playerCurrentTimeMock).toHaveBeenCalledWith(25.32);
    });

    test('sets player to start of the media when annotation start time < media start time', () => {
      render(<AnnotationRow
        {...props}
        annotation={{ ...annotation, time: { start: 0, end: 10 } }}
      />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByTestId('annotation-text-0')).toHaveTextContent('Men singing');
      expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
      expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');

      fireEvent.click(screen.getByTestId('annotation-row'));

      expect(playerCurrentTimeMock).toHaveBeenCalledTimes(1);
      expect(playerCurrentTimeMock).toHaveBeenCalledWith(10.23);
    });

    test('sets player to end of the media when annotation start time > media duration', () => {
      render(<AnnotationRow
        {...props}
        annotation={{ ...annotation, time: { start: 101.32, end: 110.56 } }}
      />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.getByTestId('annotation-text-0')).toHaveTextContent('Men singing');
      expect(screen.getByTestId('annotation-tag-0')).toHaveTextContent('Music');
      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:01:41.32');
      expect(screen.getByTestId('annotation-end-time')).toHaveTextContent('00:01:50.56');

      fireEvent.click(screen.getByTestId('annotation-row'));

      expect(playerCurrentTimeMock).toHaveBeenCalledTimes(1);
      expect(playerCurrentTimeMock).toHaveBeenCalledWith(100.34);
    });
  });
});
