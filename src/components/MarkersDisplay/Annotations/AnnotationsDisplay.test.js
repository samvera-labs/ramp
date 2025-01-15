import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import AnnotationsDisplay from './AnnotationsDisplay';
import * as hooks from '@Services/ramp-hooks';

const linkedAnnotationLayers = [
  {
    canvasIndex: 0,
    annotationSets: [
      {
        canvasId: 'http://example.com/manifestcanvas/1',
        format: 'text/vtt',
        id: 'http://example.com/manifestcanvas/1/annotation-page/1/annotation/1',
        label: 'Captions in English.vtt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifestfiles/captions-in-english.vtt',
        items: [],
      },
      {
        canvasId: 'http://example.com/manifestcanvas/1',
        format: 'text/srt',
        id: 'http://example.com/manifestcanvas/1/annotation-page/1/annotation/2',
        label: 'Subtitle in English.srt',
        linkedResource: true,
        motivation: ['supplementing'],
        url: 'http://example.com/manifestfiles/subtitles-in-english.srt',
      },
    ]
  },
  {
    canvasIndex: 1,
    annotationSets: []
  }
];

const annotationLayers = [
  {
    canvasIndex: 0,
    annotationSets: [
      {
        label: 'Unknown',
        format: 'application/json',
        url: 'http://example.com/manifestannotation-page/unknown.json',
      },
      {
        label: 'Songs',
        format: 'application/json',
        url: 'http://example.com/manifestannotation-page/songs.json',
        items: [],
      },
      {
        label: 'Texts',
        format: 'application/json',
        url: 'http://example.com/manifestannotation-page/texts.json',
        items: [],
      }
    ]
  }
];

const annotationPageResponse = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "http://example.com/manifestannotations/unknown.json",
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

describe('AnnotationsDisplay component', () => {
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

  test('displays nothing when annotations list is empty', () => {
    render(<AnnotationsDisplay
      annotations={[]}
      canvasIndex={0}
      duration={0}
      displayMotivations={[]}
    />);

    expect(screen.queryByTestId('annotations-display')).not.toBeInTheDocument();
  });

  test('displays nothing when there are no annotation layers for the current Canvas', () => {
    render(<AnnotationsDisplay
      annotations={linkedAnnotationLayers}
      canvasIndex={1}
      duration={0}
      displayMotivations={[]}
    />);

    expect(screen.queryByTestId('annotations-display')).not.toBeInTheDocument();
  });

  test('displays annotation selection when there are annotation layers for the current Canvas', () => {
    render(<AnnotationsDisplay
      annotations={linkedAnnotationLayers}
      canvasIndex={0}
      duration={572.34}
      displayMotivations={[]}
    />);

    expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
    expect(screen.queryByText('Annotation layers:')).toBeInTheDocument();
    expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
    expect(screen.getByTestId('annotation-multi-select').childNodes[0])
      .toHaveTextContent('1 of 2 layers selected▼');
    expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
  });

  describe('for a selected annotation layer', () => {
    test('displays annotations with same motivation as \'displayMotivations\'', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: jest.fn(() => { return annotationPageResponse; })
      });

      render(<AnnotationsDisplay
        annotations={annotationLayers}
        canvasIndex={0}
        duration={572.34}
        displayMotivations={['supplementing']}
      />);

      const multiSelect = screen.queryByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Only one annotation layer is selected initially
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      // Open the annotation layers list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the second annotation layer is not selected
      expect(annotationLlist.childNodes[3]).toHaveTextContent('Unknown');
      expect(within(annotationLlist.childNodes[3]).getByRole('checkbox')).not.toBeChecked();

      // Select the 'Unknown' annotation layer
      const checkBox = screen.queryAllByRole('checkbox')[3];
      // Wrap in act() to ensure all state updates are processed before assertions are run.
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 3 layers selected▼');
      expect(screen.queryAllByTestId('annotation-row').length).toEqual(2);
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
      render(<AnnotationsDisplay
        annotations={linkedAnnotationLayers}
        canvasIndex={0}
        duration={572.34}
        displayMotivations={[]}
      />);

      const multiSelect = screen.queryByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Only one annotation layer is selected initially
      expect(multiSelectHeader).toHaveTextContent('1 of 2 layers selected▼');

      // Open the annotation layers list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the second annotation layer is not selected
      expect(annotationLlist.childNodes[2]).toHaveTextContent('Subtitle in English.srt');
      expect(within(annotationLlist.childNodes[2]).getByRole('checkbox')).not.toBeChecked();

      // Select the 'Subtitle in English.srt' annotation layer
      const checkBox = screen.queryAllByRole('checkbox')[2];
      // Wrap in act() to ensure all state updates are processed before assertions are run.
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 2 layers selected▼');
      expect(screen.queryAllByTestId('annotation-row').length).toEqual(5);
    });
  });

  describe('displays a message when there are no annotations', () => {
    test('for filtered motivations', () => {
      render(<AnnotationsDisplay
        annotations={linkedAnnotationLayers}
        canvasIndex={0}
        duration={572.34}
        displayMotivations={['commenting']}
      />);

      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByText('Annotation layers:')).toBeInTheDocument();
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
      expect(screen.queryByTestId('no-annotations-message')).toBeInTheDocument();
      expect(screen.queryByText('No Annotations were found with commenting motivation.'));
    });

    test('for empty list of displayMotivations', () => {
      render(<AnnotationsDisplay
        annotations={annotationLayers}
        canvasIndex={0}
        duration={572.34}
        displayMotivations={[]}
      />);

      expect(screen.queryByTestId('annotations-display')).toBeInTheDocument();
      expect(screen.queryByText('Annotation layers:')).toBeInTheDocument();
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      expect(screen.queryByTestId('annotations-content')).toBeInTheDocument();
      expect(screen.queryByTestId('no-annotations-message')).toBeInTheDocument();
      expect(screen.queryByText('No Annotations were found for the selected layer(s).'));
    });
  });
});
