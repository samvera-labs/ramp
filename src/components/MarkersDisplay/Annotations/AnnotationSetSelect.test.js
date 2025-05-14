import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AnnotationSetSelect from './AnnotationSetSelect';
import * as annotationParser from '@Services/annotations-parser';

const annotationSets = [
  {
    label: 'Unknown',
    format: 'application/json',
    url: 'http://example.com/manifestannotation-page/unknown.json',
  },
  {
    label: 'Songs',
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
    items: [],
  }
];

const linkedAnnotationSets = [
  {
    canvasId: 'http://example.com/manifestcanvas/1',
    format: 'text/vtt',
    id: 'http://example.com/manifestcanvas/1/annotation-page/1/annotation/1',
    label: 'Captions in English.vtt',
    linkedResource: true,
    motivation: ['supplementing'],
    url: 'http://example.com/manifestfiles/captions-in-english.vtt',
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

describe('AnnotationSetSelect component', () => {
  const setAutoScrollEnabledMock = jest.fn();
  const setDisplayedAnnotationSetsMock = jest.fn();

  test('displays nothing when there are no annotation sets', () => {
    render(<AnnotationSetSelect
      canvasAnnotationSets={[]}
      duration={0}
      setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
      setAutoScrollEnabled={setAutoScrollEnabledMock}
      autoScrollEnabled={true}
    />);

    expect(screen.queryByTestId('annotation-multi-select')).not.toBeInTheDocument();
  });

  describe('displays', () => {
    beforeEach(() => {
      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
    });

    test('a multi-select box and a checkbox for auto-scroll on initial load', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      // Displays only multi select box and auto-scroll checkbox on initial load
      expect(multiSelect.childNodes[0]).toHaveClass('ramp--annotations__multi-select-header');
      expect(multiSelect.childNodes[0]).toHaveTextContent('1 of 3 sets selected▼');
      expect(multiSelect.childNodes[1]).toHaveClass('ramp--annotations__scroll');
      expect(multiSelect.childNodes[1]).toHaveTextContent('Auto-scroll with media');
    });

    test('a list of annotation sets on click', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
    });

    test('\'Show all Annotation sets\' option on top', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
      expect(multiSelect.childNodes[1].childNodes[0]).toHaveTextContent('Show all Annotation sets');
    });

    test('list of annotation sets in alphabetical order', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');

      fireEvent.click(multiSelectHeader);

      const annotationList = multiSelect.childNodes[1];
      expect(annotationList.childNodes.length).toEqual(4);
      expect(annotationList.childNodes[1]).toHaveTextContent('Songs');
      expect(annotationList.childNodes[2]).toHaveTextContent('Texts');
    });

    test('the first annotation set as selected by default', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');

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
    render(<AnnotationSetSelect
      canvasAnnotationSets={linkedAnnotationSets}
      duration={572.34}
      setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
      setAutoScrollEnabled={setAutoScrollEnabledMock}
      autoScrollEnabled={true}
    />);

    expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
    const multiSelect = screen.getByTestId('annotation-multi-select');
    const multiSelectHeader = multiSelect.childNodes[0];
    expect(multiSelectHeader).toHaveTextContent('1 of 2 sets selected▼');

    fireEvent.click(multiSelectHeader);

    expect(multiSelect.childNodes[1].tagName).toEqual('UL');
    expect(multiSelect.childNodes[1].childNodes.length).toEqual(3);
  });

  describe('\'Show all Annotation sets\' option', () => {
    test('is displayed when more than 1 annotation set is present', () => {
      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(4);
      expect(screen.getByText('Show all Annotation sets')).toBeInTheDocument();
      expect(screen.getByText('Songs')).toBeInTheDocument();
    });

    test('is not displayed when there is one annotation set', () => {
      render(<AnnotationSetSelect
        canvasAnnotationSets={[{
          label: 'Songs',
          items: [{
            id: 'songs-annotation-0',
            canvasId: 'http://example.com/manifest/canvas/1',
            motivation: ['supplementing', 'tagging'],
            time: { start: 7, end: undefined },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' },
            { format: 'text/plain', purpose: ['tagging'], value: 'Songs' }]
          }],
        },]}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];
      expect(multiSelectHeader).toHaveTextContent('1 of 1 sets selected▼');

      fireEvent.click(multiSelectHeader);

      expect(multiSelect.childNodes[1].tagName).toEqual('UL');
      expect(multiSelect.childNodes[1].childNodes.length).toEqual(1);
      expect(screen.queryByText('Show all Annotation sets')).not.toBeInTheDocument();
      expect(screen.getByText('Songs')).toBeInTheDocument();
    });
  });

  describe('updates the annotation selection when', () => {
    test('an annotation set representing an external AnnotationPage is selected', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: jest.fn(() => { return annotationPageResponse; })
      });

      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation sets list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];
      // Check the annotation set with label 'Texts' is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');
      expect(annotationLlist.childNodes[3]).toHaveTextContent('Unknown');
      expect(within(annotationLlist.childNodes[3]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[3];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Unknown' annotation set from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 3 sets selected▼');
    });

    test('an annotation set representing a linked WebVTT resource is selected', async () => {
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

      render(<AnnotationSetSelect
        canvasAnnotationSets={linkedAnnotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation sets list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];

      // Check the annotation set with label 'Subtitle in English.srt' is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 2 sets selected▼');
      expect(annotationLlist.childNodes[2]).toHaveTextContent('Subtitle in English.srt');
      expect(within(annotationLlist.childNodes[2]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[2];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Subtitle in English.srt' annotation set from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      expect(parseExternalAnnotationResourceMock).toHaveBeenCalledTimes(1);
      expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      expect(multiSelectHeader).toHaveTextContent('2 of 2 sets selected▼');
    });

    test('\'Show all Annotation sets\' option is selected', async () => {
      jest.spyOn(annotationParser, 'parseExternalAnnotationPage')
        .mockResolvedValue([{}]);

      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);

      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      const multiSelect = screen.getByTestId('annotation-multi-select');
      const multiSelectHeader = multiSelect.childNodes[0];

      // Open the annotation sets list dropdown
      fireEvent.click(multiSelectHeader);

      const annotationLlist = multiSelect.childNodes[1];
      // Check 'Show all Annotation sets' option is not selected
      expect(multiSelectHeader).toHaveTextContent('1 of 3 sets selected▼');
      expect(annotationLlist.childNodes[0]).toHaveTextContent('Show all Annotation sets');
      expect(within(annotationLlist.childNodes[0]).getByRole('checkbox')).not.toBeChecked();

      const checkBox = screen.queryAllByRole('checkbox')[0];

      // Wrap in act() to ensure all state updates are processed before assertions are run.
      // Select the 'Show all Annotation sets' annotation set from list
      await act(() => {
        fireEvent.click(checkBox);
      });

      // Dropdown list for annotation sets collapses
      expect(screen.queryByText('Show all Annotation sets')).not.toBeInTheDocument();
      expect(screen.queryByText('Songs')).not.toBeInTheDocument();
      // Text in the select box shows all sets are selected
      expect(multiSelectHeader).toHaveTextContent('3 of 3 sets selected▼');
    });
  });

  describe('\'Auto-scroll with media\' checkbox', () => {
    beforeEach(() => {
      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
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

  test('closes the dropdown when clicking outside', () => {
    render(<AnnotationSetSelect
      canvasAnnotationSets={annotationSets}
      duration={572.34}
      setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
      setAutoScrollEnabled={setAutoScrollEnabledMock}
      autoScrollEnabled={true}
    />);

    expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
    const multiSelect = screen.getByTestId('annotation-multi-select');

    expect(multiSelect.children).toHaveLength(2);
    expect(multiSelect.children[0]).toHaveClass('ramp--annotations__multi-select-header');
    expect(multiSelect.children[1]).toHaveClass('ramp--annotations__scroll');

    // Open the annotation sets list dropdown
    fireEvent.click(multiSelect.children[0]);

    // Shows the dropdown list
    expect(multiSelect.children).toHaveLength(3);
    expect(multiSelect.childNodes[1].tagName).toEqual('UL');

    // Click outside the dropdown
    fireEvent.click(document.body);

    // Hides the dropdown list
    expect(multiSelect.children).toHaveLength(2);
  });

  describe('dropdown menu with keyboard navigation', () => {
    beforeEach(() => {
      render(<AnnotationSetSelect
        canvasAnnotationSets={annotationSets}
        duration={572.34}
        setDisplayedAnnotationSets={setDisplayedAnnotationSetsMock}
        setAutoScrollEnabled={setAutoScrollEnabledMock}
        autoScrollEnabled={true}
      />);
    });

    test('renders successfully', () => {
      expect(screen.queryByTestId('annotation-multi-select')).toBeInTheDocument();
      expect(screen.getByTestId('annotation-multi-select').children).toHaveLength(2);
      expect(screen.queryByTestId('annotations-scroll')).toBeInTheDocument();
      expect(screen.getByTestId('annotations-scroll')).toHaveTextContent('Auto-scroll with media');
    });

    describe('when focused on dropwdown menu', () => {
      let dropdownMenu, multiSelectHeader;
      beforeEach(() => {
        multiSelectHeader = screen.getByTestId('annotation-multi-select');
        dropdownMenu = multiSelectHeader.children[0];
        dropdownMenu.focus();
      });

      test('allows ArrowDown keypress to expand and navigate the dropdown', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'ArrowDown' key again
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        // Focus is moved from the dropdown menu to its first option
        expect(dropdownMenu).not.toHaveFocus();
        expect(multiSelectHeader.childNodes[1].children[0]).toHaveFocus();
      });

      test('allows ArrowUp keypress to expand and navigate the dropdown', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: 'ArrowUp', keyCode: 38 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'ArrowUp' key again
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowUp', keyCode: 38 });

        // Focus is moved from the dropdown menu to its first option
        expect(dropdownMenu).not.toHaveFocus();
        expect(multiSelectHeader.childNodes[1].children[0]).toHaveFocus();
      });

      test('allows Enter keypress to expand dropdown and ArrowDown to navigate options', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: 'Enter', keyCode: 13 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'ArrowDown' key
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        // Focus is moved from the dropdown menu to its first option
        expect(dropdownMenu).not.toHaveFocus();
        expect(multiSelectHeader.childNodes[1].children[0]).toHaveFocus();
      });

      test('allows Space keypress to expand dropdown and ArrowDown to navigate options', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: ' ', keyCode: 32 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'ArrowDown' key
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        // Focus is moved from the dropdown menu to its first option
        expect(dropdownMenu).not.toHaveFocus();
        expect(multiSelectHeader.childNodes[1].children[0]).toHaveFocus();
      });

      test('allows Escape keypress to collapse the dropdown', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: ' ', keyCode: 32 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'Escape' key
        fireEvent.keyDown(dropdownMenu, { key: 'Escape', keyCode: 47 });

        // Collapses the dropdown
        expect(dropdownMenu).toHaveFocus();
        expect(dropdownMenu.children[0]).not.toHaveClass('open');
      });

      test('allows Tab keypress to collapse the dropdown', () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu.children[0]).not.toHaveClass('open');

        fireEvent.keyDown(dropdownMenu, { key: ' ', keyCode: 32 });

        // Opens the dropdown menu
        expect(dropdownMenu.children[0]).toHaveClass('open');
        expect(multiSelectHeader.childNodes[1].tagName).toEqual('UL');
        expect(multiSelectHeader.childNodes[1].childNodes.length).toEqual(4);

        // Press 'ArrowDown' key to move focus to options dropdown
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        // Press 'Tab' key when focused on the first option in the dropdown
        fireEvent.keyDown(multiSelectHeader.childNodes[1].childNodes[0], { key: 'Tab', keyCode: 9 });

        // Collapses the dropdown
        expect(dropdownMenu.children[0]).not.toHaveClass('open');
      });

      test('allows a printable character to focus an option starts with it', async () => {
        // Dropdown menu is collapsed initially
        expect(dropdownMenu).toHaveClass('ramp--annotations__multi-select-header');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');
        expect(dropdownMenu).toHaveFocus();

        fireEvent.keyDown(dropdownMenu, { key: 't', keyCode: 84 });

        await waitFor(() => {
          expect(dropdownMenu).not.toHaveFocus();
          expect(dropdownMenu.children[0]).toHaveClass('open');
          expect(multiSelectHeader.childNodes[1].children).toHaveLength(4);
          const focusedOption = multiSelectHeader.childNodes[1].children[2];
          expect(focusedOption).toHaveFocus();
          expect(focusedOption.textContent.toLowerCase().startsWith('t')).toBeTruthy();
        });
      });

      describe('and expanded', () => {
        beforeEach(() => {
          // Expand the dropdown list
          fireEvent.keyDown(dropdownMenu, { key: 'Enter', keyCode: 13 });
        });

        test('allows Home keypress to focus the first option', () => {
          // Dropdown menu is expanded initially
          expect(dropdownMenu.children[0]).toHaveClass('open');
          expect(dropdownMenu).toHaveFocus();

          fireEvent.keyDown(dropdownMenu, { key: 'Home', keyCode: 36 });

          // Focus is moved from the dropdown menu to its first option
          expect(dropdownMenu).not.toHaveFocus();
          expect(multiSelectHeader.childNodes[1].children[0]).toHaveFocus();
        });

        test('allows End keypress to focus the last option', () => {
          // Dropdown menu is expanded initially
          expect(dropdownMenu.children[0]).toHaveClass('open');
          expect(dropdownMenu).toHaveFocus();
          expect(multiSelectHeader.childNodes[1].children).toHaveLength(4);

          fireEvent.keyDown(dropdownMenu, { key: 'End', keyCode: 35 });

          // Focus is moved from the dropdown menu to its last option
          expect(dropdownMenu).not.toHaveFocus();
          expect(multiSelectHeader.childNodes[1].children[3]).toHaveFocus();
        });
      });
    });

    describe('when focused on an annotation set', () => {
      let dropdownMenu, allOptions, multiSelectHeader;
      beforeEach(() => {
        multiSelectHeader = screen.getByTestId('annotation-multi-select');
        dropdownMenu = multiSelectHeader.children[0];
        dropdownMenu.focus();

        // Press ArrowDown key twice to move focus to the first option
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(dropdownMenu, { key: 'ArrowDown', keyCode: 40 });

        allOptions = multiSelectHeader.childNodes[1].childNodes;
      });

      test('allows Enter keypress to select the focused annotation set', async () => {
        // The first option in the dropdown has focus initially
        expect(allOptions).toHaveLength(4);
        expect(allOptions[0]).toHaveFocus();
        expect(allOptions[0]).toHaveAttribute('aria-selected', 'false');

        await act(() => {
          fireEvent.keyDown(allOptions[0], { key: 'Enter', keyCode: 13 });
        });

        // The first option for select all is checked
        expect(allOptions[0]).toHaveAttribute('aria-selected', 'true');
      });

      test('allows Space keypress to select the focused annotation set', async () => {
        // The first option in the dropdown has focus and is unchecked initially
        expect(allOptions).toHaveLength(4);
        expect(allOptions[0]).toHaveFocus();

        // Press 'ArrowDown' key to select the next annotation set
        fireEvent.keyDown(allOptions[0], { key: 'ArrowDown', keyCode: 40 });
        fireEvent.keyDown(allOptions[0], { key: 'ArrowDown', keyCode: 40 });

        expect(allOptions[0]).not.toHaveFocus();
        expect(allOptions[2]).toHaveFocus();
        expect(allOptions[2]).toHaveAttribute('aria-selected', 'false');

        await act(() => {
          fireEvent.keyDown(allOptions[2], { key: ' ', keyCode: 32 });
        });

        // Second option in the list is selected
        expect(allOptions[2]).toHaveAttribute('aria-selected', 'true');
      });

      test('allows ArrowDown keypress to move focus to next option', () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        fireEvent.keyDown(allOptions[0], { key: 'ArrowDown', keyCode: 40 });

        // The second option in the dropdown has focus
        expect(allOptions[0]).not.toHaveFocus();
        expect(allOptions[1]).toHaveFocus();
      });

      test('allows ArrowUp keypress to move focus to last option', () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        fireEvent.keyDown(allOptions[0], { key: 'ArrowUp', keyCode: 38 });

        // The last option in the dropdown has focus
        expect(allOptions[0]).not.toHaveFocus();
        expect(allOptions[3]).toHaveFocus();
      });

      test('allows Escape keypress to collapse the dropdown', () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        fireEvent.keyDown(allOptions[0], { key: 'Escape', keyCode: 47 });

        // Dropdown UL element with options are not displayed
        expect(multiSelectHeader.childNodes).toHaveLength(2);
        expect(multiSelectHeader.childNodes[0]).toHaveClass('ramp--annotations__multi-select-header');
        expect(multiSelectHeader.childNodes[1]).toHaveClass('ramp--annotations__scroll');
        expect(dropdownMenu.children[0]).not.toHaveClass('open');
      });

      test('allows a printable character to focus an option starts with it', async () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        fireEvent.keyDown(dropdownMenu, { key: 't', keyCode: 84 });

        await waitFor(() => {
          expect(allOptions[0]).not.toHaveFocus();
          const focusedOption = allOptions[2];
          expect(focusedOption).toHaveFocus();
          expect(focusedOption.textContent.toLowerCase().startsWith('t')).toBeTruthy();
        });
      });

      test('allows PageUp keypress to focus the first option', () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        // Move focus to next option in the list
        fireEvent.keyDown(allOptions[0], { key: 'ArrowDown', keyCode: 40 });
        expect(allOptions[0]).not.toHaveFocus();
        expect(allOptions[1]).toHaveFocus();

        fireEvent.keyDown(dropdownMenu, { key: 'PageUp', keyCode: 33 });

        // Focus is moved from second option to first option
        expect(allOptions[0]).toHaveFocus();
        expect(allOptions[1]).not.toHaveFocus();
      });

      test('allows PageDown keypress to focus the last option', () => {
        // The first option in the dropdown has focus initially
        expect(allOptions[0]).toHaveFocus();

        fireEvent.keyDown(dropdownMenu, { key: 'PageDown', keyCode: 34 });

        // Focus is moved from first option to last option
        expect(allOptions[0]).not.toHaveFocus();
        expect(allOptions[3]).toHaveFocus();

      });
    });
  });
});
