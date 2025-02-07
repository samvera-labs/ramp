import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AnnotationRow from './AnnotationRow';
import * as hooks from '@Services/ramp-hooks';
import *  as utils from '@Services/utility-helpers';

describe('AnnotationRow component', () => {
  const checkCanvasMock = jest.fn();
  const playerCurrentTimeMock = jest.fn((time) => { return time; });
  // Mock custom hook output
  jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({
    currentTime: 0,
    player: { currentTime: playerCurrentTimeMock, targets: [{ start: 10.23, end: 100.34 }] }
  }));
  jest.spyOn(hooks, 'useAnnotations').mockImplementation(() => ({
    checkCanvas: checkCanvasMock,
  }));

  // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
  const ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));
  window.ResizeObserver = ResizeObserver;

  const containerRef = { current: document.createElement('div') };
  const props = {
    displayMotivations: [],
    autoScrollEnabled: true,
    containerRef,
    showMoreSettings: { enableShowMore: false, textLineLimit: 6 },
    index: 0,
  };

  // Cleanup all Jest mocks after tests are run
  afterAll(() => { jest.resetAllMocks(); });

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
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(0);
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
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(0);
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
        expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);
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
        expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);
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
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);
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
      // Mock imported autoScroll function
      const autoScrollMock = jest.spyOn(utils, 'autoScroll').mockImplementationOnce(jest.fn());
      // Mock useAnnotation hook to inPlayerRange=true
      jest.spyOn(hooks, 'useAnnotations').mockImplementation(() => ({
        checkCanvas: checkCanvasMock,
        inPlayerRange: true,
      }));

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
      expect(autoScrollMock).toHaveBeenCalledTimes(1);
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

  describe('with default showMoreSettings={enableShowMore: false, textLineLimit: 6}', () => {
    test('displays longer texts without \'Show more\' button', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing'],
        time: { start: 0, end: 10 },
        value: [
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
          },
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
          },
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
          },
        ]
      };
      render(<AnnotationRow {...props} annotation={annotation} />);
      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(0);

      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
      expect(screen.queryByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');

      expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();

      expect(screen.queryAllByTestId('annotation-show-more-0').length).toBe(0);
      expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });

    test('displays multiple shorter text count > MAX_LINES without \'Show more\' button', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing', 'tagging'],
        time: { start: 25.32, end: 45.65 },
        value: [
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
      };
      render(<AnnotationRow {...props} annotation={annotation} />);
      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);

      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:25.32');
      expect(screen.queryByTestId('annotation-end-time')).toHaveTextContent('00:00:45.65');

      expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();

      expect(screen.queryAllByTestId('annotation-show-more-0').length).toBe(0);
      expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });
  });

  describe('with showMoreSettings={enableShowMore: true, textLineLimit: 6}', () => {
    describe('displays longer texts truncated', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing'],
        time: { start: 0, end: 10 },
        value: [
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
          },
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
          },
          {
            format: 'text/plain',
            purpose: ['supplementing'],
            value: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
          },
        ]
      };

      beforeEach(() => {
        // Mock Canvas, getComputedStyle, and clientWidth of annotationTextRef for a controlled test
        jest.spyOn(window, 'getComputedStyle').mockImplementation((ele) => ({
          lineHeight: '24px',
          fontSize: '16px',
          font: '16px / 24px "Open Sans", sans-serif',
        }));
        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
          value: jest.fn(() => ({
            measureText: jest.fn((texts) => ({ width: texts.length * 10 })),
          })),
        });
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
          configurable: true,
          get: jest.fn(() => 800),
        });

        render(<AnnotationRow
          {...props}
          showMoreSettings={{ enableShowMore: true, textLineLimit: 6 }}
          annotation={annotation}
        />);
      });

      test('with a \'Show more\' button', () => {
        expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
        expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(0);

        expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:00.000');
        expect(screen.queryByTestId('annotation-end-time')).toHaveTextContent('00:00:10.000');

        expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();
        expect(screen.getByTestId('annotation-text-0').textContent.length).toBeGreaterThan(0);

        expect(screen.queryAllByTestId('annotation-show-more-0').length).toBe(1);
        expect(screen.queryByText('Show more')).toBeInTheDocument();
      });

      test('and can be expanded and collapsed', () => {
        expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();

        // maxCharactersToShow += (. characters) x 3
        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBe(443);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).toBeTruthy();

        expect(screen.queryByText('Show more')).toBeInTheDocument();

        // Click 'Show more' button
        fireEvent.click(screen.getByTestId('annotation-show-more-0'));

        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBe(997);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).not.toBeTruthy();

        // Text on the button is toggled
        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
        expect(screen.queryByText('Show less')).toBeInTheDocument();

        // Click 'Show less' button
        fireEvent.click(screen.getByTestId('annotation-show-more-0'));

        // maxCharactersToShow += (. characters) x 3
        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBe(443);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).toBeTruthy();

        // Text on the button is toggled
        expect(screen.queryByText('Show more')).toBeInTheDocument();
        expect(screen.queryByText('Show less')).not.toBeInTheDocument();
      });
    });

    describe('displays annotation with multiple shorter text count > MAX_LINES', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['supplementing', 'tagging'],
        time: { start: 25.32, end: 45.65 },
        value: [
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Music' }]
      };

      beforeEach(() => {
        // Mock Canvas, getComputedStyle, and clientWidth of annotationTextRef for a controlled test
        jest.spyOn(window, 'getComputedStyle').mockImplementation((ele) => ({
          lineHeight: '24px',
          fontSize: '16px',
          font: '16px / 24px "Open Sans", sans-serif',
        }));
        Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
          value: jest.fn(() => ({
            measureText: jest.fn((texts) => ({ width: texts.length * 10 })),
          })),
        });
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
          configurable: true,
          get: jest.fn(() => 800),
        });

        render(<AnnotationRow
          {...props}
          showMoreSettings={{ enableShowMore: true, textLineLimit: 6 }}
          annotation={annotation}
        />);
      });

      test('with a \'Show more\' button', () => {
        expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
        expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);

        expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:25.32');
        expect(screen.queryByTestId('annotation-end-time')).toHaveTextContent('00:00:45.65');

        expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();
        expect(screen.getByTestId('annotation-text-0').textContent.length).toBeGreaterThan(0);

        expect(screen.queryAllByTestId('annotation-show-more-0').length).toBe(1);
        expect(screen.queryByText('Show more')).toBeInTheDocument();
      });

      test('and can be expanded and collapsed', () => {
        expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();

        // maxCharactersToShow += (. characters) x 3
        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBe(443);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).toBeTruthy();

        expect(screen.queryByText('Show more')).toBeInTheDocument();

        // Click 'Show more' button
        fireEvent.click(screen.getByTestId('annotation-show-more-0'));

        // Displayed text length
        expect(screen.getByTestId('annotation-text-0').textContent.length).toBe(77);
        // Padded text length
        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBeGreaterThan(77);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).not.toBeTruthy();

        // Text on the button is toggled
        expect(screen.queryByText('Show more')).not.toBeInTheDocument();
        expect(screen.queryByText('Show less')).toBeInTheDocument();

        // Click 'Show less' button
        fireEvent.click(screen.getByTestId('annotation-show-more-0'));

        // maxCharactersToShow += (. characters) x 3
        expect(screen.getByTestId('annotation-text-0').innerHTML.length).toBe(443);
        expect(screen.getByTestId('annotation-text-0').textContent.endsWith('...')).toBeTruthy();

        // Text on the button is toggled
        expect(screen.queryByText('Show more')).toBeInTheDocument();
        expect(screen.queryByText('Show less')).not.toBeInTheDocument();
      });
    });

    test('does not display \'Show more\' button for shorter text', () => {
      const annotation = {
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        canvasId: 'http://example.com/manifest/canvas/1',
        motivation: ['commenting', 'tagging'],
        time: { start: 10, end: undefined },
        value: [
          { format: 'text/plain', purpose: ['commenting'], value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Music' }
        ]
      };
      render(<AnnotationRow
        {...props}
        showMoreSettings={{ enableShowMore: true, textLineLimit: 6 }}
        annotation={annotation}
      />);

      expect(screen.getByTestId('annotation-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('annotation-tag-0').length).toBe(1);

      expect(screen.getByTestId('annotation-start-time')).toHaveTextContent('00:00:10.000');
      expect(screen.queryByTestId('annotation-end-time')).not.toBeInTheDocument();

      expect(screen.queryByTestId('annotation-text-0')).toBeInTheDocument();
      expect(screen.queryByTestId('annotation-text-0').innerHTML.length).toBeGreaterThan(0);

      expect(screen.queryAllByTestId('annotation-show-more-0').length).toBe(0);
      expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });
  });
});
