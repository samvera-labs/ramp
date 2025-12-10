import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AnnotationList from './AnnotationList';
import * as hooks from '@Services/ramp-hooks';
import * as annotationParser from '@Services/annotations-parser';

/**
 * Value for prop 'annotations' with linked resources for annotation sets. 
 * The first annotationSet is populated with the 'items' list to mimic the 
 * behavior in the interface, since the initial 'useEffect' doesn't get 
 * invoked in test environment.
 */
const linkedAnnotationSets = [
  {
    canvasIndex: 0,
    annotationSets: [
      {
        canvasId: 'http://example.com/manifest/canvas/1',
        format: 'text/vtt',
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
        label: 'Captions in English.vtt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifest/files/captions-in-english.vtt',
        timed: true,
        items: [
          {
            id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
            canvasId: 'http://example.com/manifest/canvas/1',
            motivation: ['supplementing'],
            time: { start: 7, end: undefined },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
          },
          {
            id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
            canvasId: 'http://example.com/manifest/canvas/1',
            motivation: ['supplementing'],
            time: { start: 25.32, end: 27.65 },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'The Yale Glee Club singing "Mother of Men"' }]
          },
          {
            id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
            canvasId: 'http://example.com/manifest/canvas/1',
            motivation: ['supplementing'],
            time: { start: 29.54, end: 45.32 },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: '<strong>Subjects</strong>: Singing' }]
          }
        ],
      },
      {
        canvasId: 'http://example.com/manifest/canvas/1',
        format: 'text/srt',
        id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/2',
        label: 'Subtitle in English.srt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifest/files/subtitles-in-english.srt',
        timed: true,
      },
    ]
  },
  {
    canvasIndex: 1,
    annotationSets: []
  },
  {
    canvasIndex: 2,
    annotationSets: [
      {
        canvasId: 'http://example.com/manifestcanvas/3',
        format: 'text/vtt',
        id: 'http://example.com/manifest/canvas/3/annotation-page/1/annotation/1',
        label: 'Captions in English - Canvas 2.vtt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifest/files/captions-in-english.vtt',
        items: [],
        timed: true,
      },
      {
        canvasId: 'http://example.com/manifest/canvas/3',
        format: 'text/srt',
        id: 'http://example.com/manifest/canvas/3/annotation-page/1/annotation/2',
        label: 'Subtitle in English - Canvas 2.srt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifestfiles/subtitles-in-english.srt',
        timed: true,
      },
    ]
  },
];

/**
 * Value for prop 'annotations' with a mix of external AnnotationPage resources and
 * AnnotationPage with inline annotations for annotation sets. 
 * The first annotationSet (Songs) in the list alphabetically, is setup as an 
 * annotationSet with inline annotations for easier testing.
 */
const annotationSets = [
  {
    canvasIndex: 0,
    annotationSets: [
      {
        label: 'Unknown',
        format: 'application/json',
        url: 'http://example.com/manifestannotation-page/unknown.json',
        timed: true,
      },
      {
        label: 'Songs',
        timed: true,
        items: [{
          id: 'songs-annotation-0',
          canvasId: 'http://example.com/manifest/canvas/1',
          motivation: ['supplementing', 'tagging'],
          time: { start: 7, end: undefined },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Songs' }]
        },
        {
          id: 'songs-annotation-1',
          canvasId: 'http://example.com/manifest/canvas/1',
          motivation: ['supplementing', 'tagging'],
          time: { start: 25.32, end: 27.65 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'The Yale Glee Club singing "Mother of Men"' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Songs' }]
        },
        {
          id: 'songs-annotation-2',
          canvasId: 'http://example.com/manifest/canvas/1',
          motivation: ['supplementing', 'tagging'],
          time: { start: 29.54, end: 45.32 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '<strong>Subjects</strong>: Singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Songs' }]
        }],
      },
      {
        label: 'Texts',
        format: 'application/json',
        url: 'http://example.com/manifestannotation-page/texts.json',
        timed: true,
      }
    ]
  }
];

/**
 * Sample response for a fetch request for a linked AnnotationPage with annotations.
 */
const annotationPageResponse = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "http://example.com/manifest/annotations/unknown.json",
  "type": "AnnotationPage", "label": "Unknown",
  "items": [
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": "unknown-annotation-1.json",
      "type": "Annotation",
      "motivation": ["commenting"],
      "body": [
        { "type": "TextualBody", "value": "Savannah, GA", "format": "text/plain", "purpose": "commenting" },
        { "type": "TextualBody", "value": "Unknown", "format": "text/plain", "purpose": "tagging" }
      ],
      "target": {
        "source": {
          "id": "http://example.com/manifest/canvas-1/canvas",
          "type": "Canvas",
        },
        "selector": { "type": "PointSelector", "t": "2766.438533" }
      }
    },
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": "unknown-annotation-2.json",
      "type": "Annotation",
      "motivation": ["supplementing", "commenting"],
      "body": [
        { "type": "TextualBody", "value": "A play that we used to play when we were children in Savannah.", "format": "text/plain", "purpose": "commenting" },
        { "type": "TextualBody", "value": "Unknown", "format": "text/plain", "purpose": "tagging" }
      ],
      "target": {
        "source": {
          "id": "http://example.com/manifest/canvas-1/canvas",
          "type": "Canvas",
        },
        "selector": {
          "type": "FragmentSelector",
          "conformsTo": "http://www.w3.org/TR/media-frags/",
          "value": "t=2771.900826,2775.619835"
        }
      }
    },
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "id": "unknown-annotation-3.json",
      "type": "Annotation",
      "motivation": ["supplementing", "commenting"],
      "body": [
        { "type": "TextualBody", "value": "A ring play, just a ring play, a children's ring play", "format": "text/plain", "purpose": "commenting" },
        { "type": "TextualBody", "value": "Unknown", "format": "text/plain", "purpose": "tagging" }
      ],
      "target": {
        "source": {
          "id": "http://example.com/manifest/canvas-1/canvas",
          "type": "Canvas",
        },
        "selector": {
          "type": "FragmentSelector",
          "conformsTo": "http://www.w3.org/TR/media-frags/",
          "value": "t=2779.493802,2782.438017"
        }
      }
    }
  ]
};

describe('AnnotationList component', () => {
  const props = {
    annotations: [],
    canvasIndex: 0,
    duration: 0,
    displayMotivations: [],
    showMoreSettings: { enableShowMore: true, textLineLimit: 6 },
  };
  const checkCanvasMock = jest.fn();
  const psetCurrentTimeMock = jest.fn((time) => { return time; });

  // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
  const ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock custom hook output
    jest.spyOn(hooks, 'useMediaPlayer').mockImplementation(() => ({
      currentTime: 0,
      pset: { currentTime: psetCurrentTimeMock, targets: [{ start: 10.23, end: 100.34 }] }
    }));
    jest.spyOn(hooks, 'useAnnotationRow').mockImplementation(() => ({
      checkCanvas: checkCanvasMock
    }));
    const syncPlaybackMock = jest.fn();
    jest.spyOn(hooks, 'useSyncPlayback').mockImplementation(() => ({ syncPlayback: syncPlaybackMock }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays a message when annotation layers list is empty', () => {
    render(<AnnotationList {...props} />);

    expect(screen.queryByTestId('annotations-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('no-annotation-sets-message')).toBeInTheDocument();
    expect(screen.queryByText('No Annotations sets were found for the Canvas.')).toBeInTheDocument();
  });

  test('displays a message when there are no annotation sets for the current Canvas', () => {
    render(<AnnotationList
      {...props}
      annotations={linkedAnnotationSets}
      canvasIndex={1}
    />);

    expect(screen.queryByTestId('annotations-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('no-annotation-sets-message')).toBeInTheDocument();
    expect(screen.queryByText('No Annotations sets were found for the Canvas.')).toBeInTheDocument();
  });

  test('displays annotation selection when there are annotation sets for the current Canvas', async () => {
    jest
      .spyOn(annotationParser, 'parseExternalAnnotationResource')
      .mockResolvedValueOnce([
        {
          canvasId: 'http://example.com/manifest/canvas/1',
          id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
          motivation: ['supplementing'],
          time: { start: 1.20, end: 21 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '[music]' }],
        }
      ]);
    render(<AnnotationList
      {...props}
      annotations={linkedAnnotationSets}
      duration={572.34}
    />);
    await act(() => Promise.resolve());

    expect(screen.queryByTestId('annotations-list')).toBeInTheDocument();
    expect(screen.queryByText('Annotation sets:')).toBeInTheDocument();
    expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
    expect(screen.getByTestId('annotation-multi-select').childNodes[0])
      .toHaveTextContent('1 of 2 sets selected▼');
    expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
  });

  describe('for a selected annotation set', () => {
    test('displays annotations with same motivation as \'displayMotivations\'', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: jest.fn(() => { return annotationPageResponse; })
      });

      render(<AnnotationList
        {...props}
        annotations={annotationSets}
        duration={572.34}
        displayMotivations={['supplementing']}
      />);

      await act(() => Promise.resolve());

      const multiSelect = screen.queryByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Only one annotation set is selected initially
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');
      expect(screen.queryAllByTestId('annotation-row').length).toEqual(3);

      // Open the annotation sets list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the second annotation set is not selected
      expect(annotationLlist.childNodes[3]).toHaveTextContent('Unknown');
      expect(within(annotationLlist.childNodes[3]).getByRole('checkbox')).not.toBeChecked();

      // Select the 'Unknown' annotation set
      const checkBox = screen.queryAllByRole('checkbox')[3];
      // Wrap in act() to ensure all state updates are processed before assertions are run.
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 3 sets selected▼');
      expect(screen.queryAllByTestId('annotation-row').length).toEqual(5);
    });

    test('displays all annotations when \'displayMotivations\' is empty', async () => {
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchWebVTT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn(() => 'text/vtt') },
        text: jest.fn(() => mockResponse),
      });

      render(<AnnotationList
        {...props}
        annotations={linkedAnnotationSets}
        duration={572.34}
      />);

      const multiSelect = screen.queryByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Only one annotation set is selected initially
      expect(multiSelectHeader).toHaveTextContent('1 of 2 sets selected▼');

      // Open the annotation sets list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the second annotation set is not selected
      expect(annotationLlist.childNodes[2]).toHaveTextContent('Subtitle in English.srt');
      expect(within(annotationLlist.childNodes[2]).getByRole('checkbox')).not.toBeChecked();

      // Select the 'Subtitle in English.srt' annotation set
      const checkBox = screen.queryAllByRole('checkbox')[2];
      // Wrap in act() to ensure all state updates are processed before assertions are run.
      await act(() => {
        fireEvent.click(checkBox);
      });

      await waitFor(() => {
        expect(multiSelectHeader).toHaveTextContent('2 of 2 sets selected▼');
        expect(screen.queryAllByTestId('annotation-row').length).toEqual(8);
        expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      });
    });

    test('allows keyboard navigation for annotation-rows', async () => {
      render(<AnnotationList
        {...props}
        annotations={annotationSets}
        duration={572.34}
        displayMotivations={['supplementing']}
      />);

      await act(() => Promise.resolve());

      const multiSelect = screen.queryByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Only one annotation set is selected initially
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');
      expect(screen.queryAllByTestId('annotation-row').length).toEqual(3);

      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[0], { key: 'Tab', keyCode: 9 });
      expect(screen.getAllByTestId('annotation-row-button')[0]).toHaveAttribute('tabindex', '0');

      // Press 'ArrowDown' to move to the next annotation row
      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[0], { key: 'ArrowDown', keyCode: 40 });
      expect(screen.getAllByTestId('annotation-row-button')[1]).toHaveFocus();

      // Press 'ArrowDown' to move to the next annotation row
      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[1], { key: 'ArrowDown', keyCode: 40 });
      expect(screen.getAllByTestId('annotation-row-button')[2]).toHaveFocus();

      // Press 'ArrowUp' to move to the previous annotation row
      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[2], { key: 'ArrowUp', keyCode: 38 });
      expect(screen.getAllByTestId('annotation-row-button')[1]).toHaveFocus();

      // Press 'ArrowUp' twice to wrap focus to the last annotation row
      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[1], { key: 'ArrowUp', keyCode: 38 });
      fireEvent.keyDown(screen.getAllByTestId('annotation-row-button')[0], { key: 'ArrowUp', keyCode: 38 });
      expect(screen.getAllByTestId('annotation-row-button')[2]).toHaveFocus();
    });
  });

  describe('displays a message when there are no annotations', () => {
    let parseExternalAnnotationResourceMock;

    beforeEach(() => {
      jest.clearAllMocks();
      parseExternalAnnotationResourceMock = jest
        .spyOn(annotationParser, 'parseExternalAnnotationResource');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('for filtered motivations', async () => {
      parseExternalAnnotationResourceMock.mockResolvedValueOnce([
        {
          canvasId: 'http://example.com/manifestcanvas/1',
          id: 'http://example.com/manifestcanvas/1/annotation-page/1/annotation/1',
          motivation: ['supplementing'],
          time: { start: 1.20, end: 21 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '[music]' }],
        }
      ]);

      render(<AnnotationList
        {...props}
        annotations={linkedAnnotationSets}
        duration={572.34}
        displayMotivations={['commenting']}
      />);

      await act(() => Promise.resolve());

      await waitFor(() => {
        expect(screen.queryByTestId('annotations-list')).toBeInTheDocument();
        expect(screen.queryByText('Annotation sets:')).toBeInTheDocument();
        expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
        expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
        expect(screen.queryByTestId('no-annotations-message')).toBeInTheDocument();
        expect(screen.queryByText(
          'No Annotations were found with commenting motivation.'
        )).toBeInTheDocument();
      });
    });

    test('for empty list of displayMotivations', async () => {
      parseExternalAnnotationResourceMock.mockResolvedValueOnce([]);

      render(<AnnotationList
        {...props}
        annotations={linkedAnnotationSets}
        canvasIndex={2}
        duration={572.34}
      />);

      await act(async () => { Promise.resolve(); });

      await waitFor(() => {
        expect(screen.queryByTestId('annotations-list')).toBeInTheDocument();
        expect(screen.queryByText('Annotation sets:')).toBeInTheDocument();
        expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
        expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
        expect(screen.queryByTestId('no-annotations-message')).toBeInTheDocument();
        expect(screen.queryByText(
          'No Annotations were found for the selected set(s).'
        )).toBeInTheDocument();
      });
    });
  });
});
