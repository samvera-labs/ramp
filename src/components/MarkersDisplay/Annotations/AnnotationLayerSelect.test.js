import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import AnnotationLayerSelect from './AnnotationLayerSelect';
import * as annotationParser from '@Services/annotations-parser';

const annotationLayers = [
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
];

const linkedAnnotationLayers = [
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
      "motivation": ["supplementing", "commenting"],
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

describe('AnnotationLayerSelect component', () => {
  const setAutoScrollEnabledMock = jest.fn();
  const setDisplayedAnnotationLayersMock = jest.fn();

  test('displays nothing when there are no annotation layers', () => {
    render(<AnnotationLayerSelect
      annotationLayers={[]}
      duration={0}
      setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
      setAutoScrollEnabled={setAutoScrollEnabledMock}
      autoScrollEnabled={true}
    />);

    expect(screen.queryByTestId('annotation-multi-select')).not.toBeInTheDocument();
  });

  describe('displays', () => {
    beforeEach(() => {
      render(<AnnotationLayerSelect
        annotationLayers={annotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
    });

    test('a multi-select box and a checkbox for auto-scroll on initial load', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      // Displays only multi select box and auto-scroll checkbox on initial load
      expect(multiSelect.childNodes[0]).toHaveClass('ramp--annotations__multi-select-header');
      expect(multiSelect.childNodes[0]).toHaveTextContent('1 of 3 layers selected▼');
      expect(multiSelect.childNodes[1]).toHaveClass('ramp--annotations__scroll');
      expect(multiSelect.childNodes[1]).toHaveTextContent('Auto-scroll with media');
    });

    test('a list of annotation layers on click', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
    });

    test('\'Show all Annotation layers\' option on top', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
      expect(multiSelect.childNodes[1].childNodes[0]).toHaveTextContent('Show all Annotation layers');
    });

    test('list of annotation layers in alphabetical order', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      fireEvent.click(multiSelectHeader);

      const annotationList = multiSelect.childNodes[1];
      expect(annotationList.childNodes.length).toEqual(4);
      expect(annotationList.childNodes[1]).toHaveTextContent('Songs');
      expect(annotationList.childNodes[2]).toHaveTextContent('Texts');
    });

    test('the first annotation layer as selected by default', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      fireEvent.click(multiSelectHeader);

      const annotationList = multiSelect.childNodes[1];
      expect(annotationList.childNodes.length).toEqual(4);
      expect(annotationList.childNodes[1]).toHaveTextContent('Songs');
      expect(within(annotationList.childNodes[1]).getByRole('checkbox')).toBeChecked();

      expect(annotationList.childNodes[2]).toHaveTextContent('Texts');
      expect(within(annotationList.childNodes[2]).getByRole('checkbox')).not.toBeChecked();
    });
  });

  test('displays annotations options for linked resources', () => {
    render(<AnnotationLayerSelect
      annotationLayers={linkedAnnotationLayers}
      duration={572.34}
      setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
      setAutoScrollEnabled={setAutoScrollEnabledMock}
      autoScrollEnabled={true}
    />);

    expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
    const multiSelect = screen.getByTestId('annotation-multi-select');
    const multiSelectHeader = multiSelect.childNodes[0];
    expect(multiSelectHeader).toHaveTextContent('1 of 2 layers selected▼');

    fireEvent.click(multiSelectHeader);

    expect(multiSelect.childNodes[1].tagName).toEqual('UL');
    expect(multiSelect.childNodes[1].childNodes.length).toEqual(3);
  });

  describe('\'Show all Annotation layers\' option', () => {
    test('is displayed when more than 1 annotation layer is present', () => {
      render(<AnnotationLayerSelect
        annotationLayers={annotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
      expect(screen.getByText('Show all Annotation layers')).toBeInTheDocument();
      expect(screen.getByText('Songs')).toBeInTheDocument();
    });

    test('is not displayed when there is one annotation layer', () => {
      render(<AnnotationLayerSelect
        annotationLayers={[{
          label: 'Unknown',
          format: 'application/json',
          url: 'http://example.com/manifestannotation-page/unknown.json',
          items: [],
        }]}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 1 layers selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(1);
      expect(screen.queryByText('Show all Annotation layers')).not.toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('updates the annotation selection when', () => {
    test('an annotation layer representing an external AnnotationPage is selected', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: jest.fn(() => { return annotationPageResponse; })
      });

      render(<AnnotationLayerSelect
        annotationLayers={annotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation layers list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];
      // Check the annotation layer with label 'Texts' is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');
      expect(annotationLlist.childNodes[3]).toHaveTextContent('Unknown');
      expect(within(annotationLlist.childNodes[3]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[3];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Unknown' annotation layer from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 3 layers selected▼');
    });

    test('an annotation layer representing a linked WebVTT resource is selected', async () => {
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchWebVTT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn(() => 'text/vtt') },
        text: jest.fn(() => mockResponse),
      });
      const parseExternalAnnotationResourceMock = jest
        .spyOn(annotationParser, 'parseExternalAnnotationResource');

      render(<AnnotationLayerSelect
        annotationLayers={linkedAnnotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation layers list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the annotation layer with label 'Subtitle in English.srt' is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 2 layers selected▼');
      expect(annotationLlist.childNodes[2]).toHaveTextContent('Subtitle in English.srt');
      expect(within(annotationLlist.childNodes[2]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[2];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Subtitle in English.srt' annotation layer from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(parseExternalAnnotationResourceMock).toHaveBeenCalledTimes(1);
      expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 2 layers selected▼');
    });

    test('\'Show all Annotation layers\' option is selected', async () => {
      render(<AnnotationLayerSelect
        annotationLayers={annotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation layers list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];
      // Check 'Show all Annotation layers' option is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 3 layers selected▼');
      expect(annotationLlist.childNodes[0]).toHaveTextContent('Show all Annotation layers');
      expect(within(annotationLlist.childNodes[0]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[0];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Show all Annotation layers' annotation layer from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      // Dropdown list for annotation layers collapses
      expect(screen.queryByText('Show all Annotation layers')).not.toBeInTheDocument();
      expect(screen.queryByText('Songs')).not.toBeInTheDocument();

      // Text in the select box shows all layers are selected
      expect(multiSelectHeader).toHaveTextContent('3 of 3 layers selected▼');
    });
  });

  describe('\'Auto-scroll with media\' checkbox', () => {
    beforeEach(() => {
      render(<AnnotationLayerSelect
        annotationLayers={annotationLayers}
        duration={572.34}
        setDisplayedAnnotationLayers={setDisplayedAnnotationLayersMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
    });

    test('is displayed checked on initial load', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();

      const checkBox = screen.getByTestId('annotation-multi-select').childNodes[1];
      expect(checkBox).toHaveClass('ramp--annotations__scroll');
      expect(checkBox).toHaveTextContent('Auto-scroll with media');
      expect(within(checkBox).getByRole('checkbox')).toBeChecked();
    });

    test('calls \'setAutoScrollEnabled\' when clicked', () => {
      const checkBox = screen.getByTestId('annotation-multi-select').childNodes[1];
      expect(checkBox).toHaveClass('ramp--annotations__scroll');
      expect(checkBox).toHaveTextContent('Auto-scroll with media');

      fireEvent.click(within(checkBox).getByRole('checkbox'));

      expect(setAutoScrollEnabledMock).toHaveBeenCalledTimes(1);
    });
  });
});
