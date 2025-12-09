import * as transcriptParser from './transcript-parser';
import manifestTranscript from '@TestData/volleyball-for-boys';
import noAnnotationManifest from '@TestData/multiple-canvas-auto-advance';
import multipleCanvas from '@TestData/transcript-multiple-canvas';
import annotationTranscript from '@TestData/transcript-annotation';
import multiSourceManifest from '@TestData/multi-source-manifest';
import paintingAnnotationManifest from '@TestData/transcript-multiple-canvas';
import noSupplementingManifest from '@TestData/single-canvas';
import mammoth from 'mammoth';
import { cleanup } from '@testing-library/react';
import * as utils from '@Services/utility-helpers';
import * as annotationsParser from '@Services/annotations-parser';

describe('transcript-parser', () => {
  jest.spyOn(utils, 'handleFetchErrors').mockImplementation(
    jest.fn((r) => {
      return r;
    })
  );

  afterEach(() => {
    cleanup();
  });

  describe('readSupplementingAnnotations', () => {
    let controller, signal;
    beforeEach(() => {
      controller = new AbortController();
      signal = controller.signal;
    });

    test('invalid manifestURL', async () => {
      // mock console.error
      console.error = jest.fn();
      const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce({
        status: 500,
      });

      const transcripts = await transcriptParser.readSupplementingAnnotations(
        'htt://example.com/manifest.json', '', signal
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        'htt://example.com/manifest.json', { signal }
      );
      expect(transcripts).toHaveLength(0);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, ",
        'htt://example.com/manifest.json'
      );
    });

    test('undefined manifestURL', async () => {
      // mock console.error
      console.error = jest.fn();
      const fetchSpy = jest.spyOn(global, 'fetch');

      const transcripts = await transcriptParser.readSupplementingAnnotations(undefined, '', signal);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(transcripts).toHaveLength(0);
    });

    test('valid manifestURL without supplementing annotations', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => noAnnotationManifest),
      });

      const transcripts = await transcriptParser.readSupplementingAnnotations(
        'https://example.com/multiple-canvas-auto-advance/manifest.json', '', signal
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://example.com/multiple-canvas-auto-advance/manifest.json', { signal }
      );
      expect(transcripts).toHaveLength(2);
      expect(transcripts[0].items).toHaveLength(0);
      expect(transcripts[1].items).toHaveLength(0);
    });

    describe('valid manifestURL with supplementing annotations', () => {
      test('for transcript as a list of annotations', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => annotationTranscript),
        });

        const transcripts = await transcriptParser.readSupplementingAnnotations(
          'https://example.com/annotation-transcript/manifest.json', '', signal
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/annotation-transcript/manifest.json', { signal }
        );
        expect(transcripts).toHaveLength(2);
        expect(transcripts[0].items).toHaveLength(1);
        expect(transcripts[0].items).toEqual([
          {
            title: 'Canvas-0',
            id: 'Canvas-0-0',
            url: 'https://example.com/annotation-transcript/manifest.json',
            isMachineGen: false,
            format: ''
          }
        ]);
      });

      test('for transcripts as an external resource', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => multipleCanvas),
        });

        const transcripts = await transcriptParser.readSupplementingAnnotations(
          'https://example.com/multiple-canvas/manifest.json', '', signal
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/multiple-canvas/manifest.json', { signal }
        );
        expect(transcripts).toHaveLength(2);
        expect(transcripts[0].items).toHaveLength(0);
        expect(transcripts[1].items).toEqual([
          {
            title: 'Captions in WebVTT format',
            filename: 'sample-subtitles.vtt',
            id: 'Captions in WebVTT format-1-0',
            url: 'https://example.com/sample/subtitles.vtt',
            isMachineGen: false,
            format: 'text/vtt'
          }
        ]);
      });

      test('for transcript as an AnnotationPage (Aviary)', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => multiSourceManifest),
        });

        const transcripts = await transcriptParser.readSupplementingAnnotations(
          'https://example.com/multi-source/manifest.json', '', signal
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/multi-source/manifest.json', { signal });
        expect(transcripts).toHaveLength(3);
        expect(transcripts[0].items).toHaveLength(0);
        expect(transcripts[1].items).toHaveLength(1);
        expect(transcripts[1].items).toEqual([
          {
            title: 'Aviary Supplementing Annotations',
            id: 'Aviary Supplementing Annotations-1',
            url: 'https://example.com/multi-source/manifest.json',
            isMachineGen: false,
            format: ''
          }
        ]);
      });
    });
  });

  describe('sanitizeTranscripts()', () => {
    test('when transcripts is empty', async () => {
      // mock console.error
      console.error = jest.fn();

      const transcripts = await transcriptParser.sanitizeTranscripts([]);

      expect(transcripts).toHaveLength(0);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('No transcripts given as input');
    });

    test('when transcripts is undefined', async () => {
      // mock console.error
      console.error = jest.fn();

      const transcripts = await transcriptParser.sanitizeTranscripts(undefined);

      expect(transcripts).toHaveLength(0);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('No transcripts given as input');
    });

    test('when transcripts list is not empty', async () => {
      // Mock fetch to prevent actual network calls
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        status: 404,
        headers: { get: jest.fn(() => 'text/plain') },
        text: jest.fn(() => ''),
      });

      const transcripts = await transcriptParser.sanitizeTranscripts(
        [
          {
            canvasId: 0,
            items: [
              { title: 'Transcript 1', url: 'http://example.com/transcript-1.vtt' },
              { title: 'Transcript 2 (machine-generated)', url: 'http://example.com/transcript-2.json' }
            ]
          },
          {
            canvasId: 1,
            items: [
              { title: 'Transcript 1', url: 'https://example.com/transcrip-1.vtt' }
            ]
          }
        ]
      );

      expect(transcripts).toHaveLength(2);
      expect(transcripts[0]).toEqual({
        canvasId: 0,
        items: [
          {
            title: 'Transcript 1',
            filename: 'Transcript 1',
            id: 'Transcript 1-0-0',
            url: 'http://example.com/transcript-1.vtt',
            isMachineGen: false,
            format: '',
          },
          {
            title: 'Transcript 2',
            filename: 'Transcript 2',
            id: 'Transcript 2-0-1',
            url: 'http://example.com/transcript-2.json',
            isMachineGen: true,
            format: '',
          }
        ]
      });

      fetchSpy.mockRestore();
    });

    describe('parses annotations from a Manifest URL in transcripts list', () => {
      test('with supplementing annotations at Manifest level', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => manifestTranscript),
        });
        const transcripts = await transcriptParser.sanitizeTranscripts(
          [
            {
              canvasId: 0,
              items: [
                {
                  title: 'Manifest with transcripts',
                  url: 'https://example.com/volleyball-for-boys.json'
                },
              ]
            },
          ]
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/volleyball-for-boys.json', { signal: undefined }
        );
        expect(transcripts).toHaveLength(1);
        expect(transcripts.filter(c => c.canvasId === 0)[0].items).toEqual([
          {
            filename: 'Captions in WebVTT format',
            format: 'text/plain',
            id: 'Captions in WebVTT format-0-0',
            isMachineGen: false,
            title: 'Captions in WebVTT format',
            url: 'https://example.com/volleyball-for-boys.txt'
          }
        ]);
      });

      test('with supplementing annotations at Canvas level', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => multipleCanvas),
        });
        const transcripts = await transcriptParser.sanitizeTranscripts(
          [
            {
              canvasId: 1,
              items: [
                {
                  title: 'Manifest with transcripts',
                  url: 'https://example.com/transcript-canvas.json'
                },
              ]
            },
          ]
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/transcript-canvas.json', { signal: undefined }
        );
        expect(transcripts).toHaveLength(2);
        expect(transcripts.filter(c => c.canvasId === 1)[0].items).toEqual([
          {
            filename: 'sample-subtitles.vtt',
            format: 'text/vtt',
            id: 'Captions in WebVTT format-1-0',
            isMachineGen: false,
            title: 'Captions in WebVTT format',
            url: 'https://example.com/sample/subtitles.vtt'
          }
        ]);
      });

      test('without supplementing annotations at Canvas level', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => multipleCanvas),
        });
        const transcripts = await transcriptParser.sanitizeTranscripts(
          [
            {
              canvasId: 0,
              items: [
                {
                  title: 'Manifest with transcripts',
                  url: 'https://example.com/transcript-canvas.json'
                },
              ]
            },
          ]
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(
          'https://example.com/transcript-canvas.json', { signal: undefined }
        );
        expect(transcripts).toHaveLength(2);
        expect(transcripts.filter(c => c.canvasId === 0)[0].items).toHaveLength(0);
      });
    });
  });

  describe('parseTranscriptData()', () => {
    describe('with a JSON file URL', () => {
      test('with defined JSON format for transcript', async () => {
        const parsedJSON = [
          { spans: [{ begin: 1.2, end: 9, text: '[music]' }] },
          { spans: [{ begin: 10, end: 21, text: '<b>Hello</b> world!' }] },
        ];

        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => parsedJSON),
        });

        const response = await transcriptParser
          .parseTranscriptData({ url: 'https://example.com/transcript.json', format: 'application/json' });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(response.tData).toEqual([
          { begin: 1.2, end: 9, format: 'text/plain', tag: 'TIMED_CUE', text: '[music]' },
          { begin: 10, end: 21, format: 'text/plain', tag: 'TIMED_CUE', text: '<b>Hello</b> world!' },
        ]); expect(response.tFileExt).toEqual('json');
      });

      test('with an empty JSON', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => []),
        });
        const response = await transcriptParser
          .parseTranscriptData({ url: 'https://example.com/transcript.json', format: 'application/json' });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(response.tData).toEqual([]);
        expect(response.tType).toEqual(0);
        expect(response.tFileExt).toEqual('json');
      });

      test('with valid JSON file with speaker', async () => {
        const jsonResponse = [
          {
            speaker: 'Speaker 1',
            spans: [
              { begin: '00:00:01.200', end: '00:00:21.000', text: '[music]' },
              {
                begin: '00:00:22.200', end: '00:00:26.600',
                text: 'Just before lunch one day, a puppet show\nwas put on at school.',
              },
            ],
          },
        ];
        const parsedJSON = [
          { speaker: 'Speaker 1', begin: '00:00:01.200', end: '00:00:21.000', text: '[music]' },
          {
            speaker: 'Speaker 1', begin: '00:00:22.200', end: '00:00:26.600',
            text: 'Just before lunch one day, a puppet show\nwas put on at school.',
          },
        ];
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => jsonResponse),
        });

        const response = await transcriptParser
          .parseTranscriptData({ url: 'https://example.com/transcript.json', format: 'application/json' });

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(response.tData).toHaveLength(2);
        expect(response.tData).toEqual(parsedJSON);
        expect(response.tFileExt).toEqual('json');
      });

      describe('with a Manifest JSON', () => {
        test('with a supplementing external annotation', async () => {
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a \
puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> \
00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
          const fetchSpy = jest.spyOn(global, 'fetch')
            .mockResolvedValueOnce({
              status: 200,
              headers: { get: jest.fn(() => 'application/json') },
              json: jest.fn(() => multipleCanvas),
            })
            .mockResolvedValueOnce({
              status: 200,
              headers: { get: jest.fn(() => 'text/vtt') },
              text: jest.fn(() => mockResponse),
            });

          const parsedData = [
            { end: 21, begin: 1.2, text: '[music]', tag: 'TIMED_CUE' },
            { end: 26.6, begin: 22.2, text: 'Just before lunch one day, a puppet show <br>was put on at school.', tag: 'TIMED_CUE' },
            { end: 31.5, begin: 26.7, text: 'It was called "Mister Bungle Goes to Lunch".', tag: 'TIMED_CUE' },
            { end: 34.5, begin: 31.6, text: 'It was fun to watch.', tag: 'TIMED_CUE' },
            { end: 41.3, begin: 36.1, text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.", tag: 'TIMED_CUE' }
          ];

          const response = await transcriptParser
            .parseTranscriptData({
              url: 'https://example.com/transcript-multiple-canvas.json', format: 'application/json', canvasIndex: 1
            });

          expect(fetchSpy).toHaveBeenCalledTimes(2);
          expect(fetchSpy).toHaveBeenCalledWith('https://example.com/transcript-multiple-canvas.json');
          expect(fetchSpy).toHaveBeenCalledWith('https://example.com/sample/subtitles.vtt');
          expect(response.tData).toEqual(parsedData);
          expect(response.tUrl).toEqual('https://example.com/sample/subtitles.vtt');
          expect(response.tFileExt).toEqual('vtt');
        });

        test('without annotations', async () => {
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            status: 200,
            headers: { get: jest.fn(() => 'application/json') },
            json: jest.fn(() => noSupplementingManifest),
          });
          const parseAnnotationSetsMock = jest.spyOn(annotationsParser, 'parseAnnotationSets').mockReturnValue({
            canvasIndex: 0,
            annotationSets: [],
          });
          const response = await transcriptParser
            .parseTranscriptData({ url: 'https://example.com/single-canvas.json', format: 'application/json' });

          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(parseAnnotationSetsMock).toHaveBeenCalledTimes(1);
          expect(response.tData.length).toEqual(0);
          expect(response.tData).toEqual([]);
          expect(response.tUrl).toEqual('https://example.com/single-canvas.json');
          expect(response.tFileExt).toEqual('json');
        });

        test('without supplementing annotaitons', async () => {
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            status: 200,
            headers: { get: jest.fn(() => 'application/json') },
            json: jest.fn(() => paintingAnnotationManifest),
          });
          const response = await transcriptParser
            .parseTranscriptData({ url: 'https://example.com/transcript-multiple-canvas.json', format: 'application/json' });

          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(response.tData.length).toEqual(0);
          expect(response.tData).toEqual([]);
          expect(response.tUrl).toEqual('https://example.com/transcript-multiple-canvas.json');
          expect(response.tFileExt).toEqual('json');
        });

        test('with inline supplementing annotations', async () => {
          const fetchSpy = jest.spyOn(global, 'fetch');
          const inlineAnnotations = [
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/2/annotation/1',
              canvasId: 'https://example.com/multi-source-manifest/canvas/2',
              motivation: ['supplementing'],
              time: { start: 22.2, end: 26.6 },
              value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Transcript text line 1' },
              { format: 'text/plain', purpose: ['tagging'], value: 'Song' }]
            },
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/2/annotation/2',
              canvasId: 'https://example.com/multi-source-manifest/canvas/2',
              motivation: ['supplementing'],
              time: { start: 26.7, end: 31.5 },
              value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Transcript text line 2' },
              { format: 'text/plain', purpose: ['supplementing'], value: 'Transcript text line 3' },]
            },
          ];
          const response = await transcriptParser
            .parseTranscriptData({ url: 'https://example.com/multi-source-manifest.json', format: 'application/json', canvasIndex: 1, inlineAnnotations });

          expect(fetchSpy).not.toHaveBeenCalled();
          expect(response.tData.length).toEqual(2);
          expect(response.tData[0]).toEqual({ begin: 22.2, end: 26.6, tag: 'TIMED_CUE', text: 'Transcript text line 1', format: 'text/plain' });
          expect(response.tData[1]).toEqual({
            begin: 26.7, end: 31.5, tag: 'TIMED_CUE', text: 'Transcript text line 2<br>Transcript text line 3',
            format: 'text/plain'
          });
          expect(response.tType).toEqual(1);
          expect(response.tFileExt).toEqual('json');
        });

        test('with inline annotations with mixed motivations', async () => {
          const fetchSpy = jest.spyOn(global, 'fetch');
          const inlineAnnotations = [
            {
              id: 'https://example.com/multi-source-manifest/canvas/3/page/2/annotation/1',
              canvasId: 'https://example.com/multi-source-manifest/canvas/3',
              motivation: ['supplementing', 'commenting'],
              time: { start: 22.2, end: 26.6 },
              value: [{ format: 'text/plain', purpose: ['commenting'], value: 'Transcript text line 1' },
              { format: 'text/plain', purpose: ['tagging'], value: 'Song' }]
            },
            {
              id: 'https://example.com/multi-source-manifest/canvas/3/page/2/annotation/2',
              canvasId: 'https://example.com/multi-source-manifest/canvas/3',
              motivation: ['supplementing', 'commenting'],
              time: { start: 26.7, end: 31.5 },
              value: [{ format: 'text/plain', purpose: ['commenting'], value: 'Transcript text line 2' }]
            },
          ];
          const response = await transcriptParser
            .parseTranscriptData({ url: 'https://example.com/multi-source-manifest.json', format: 'application/json', canvasIndex: 3, inlineAnnotations });

          expect(fetchSpy).not.toHaveBeenCalled();
          expect(response.tData.length).toEqual(0);
          expect(response.tType).toEqual(0);
          expect(response.tFileExt).toEqual('json');
        });
      });
    });

    test('with a text file URL', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/plain') },
        text: jest.fn(() => 'This is a sample text transcript file'),
      });
      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/transcript.txt', format: 'text/plain' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tType).toEqual(2);
      expect(response.tData.length).toBeGreaterThan(0);
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
      expect(response.tFileExt).toEqual('txt');
    });

    test('with an empty text file', async () => {
      const fetchText = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/plain') },
        text: jest.fn(() => { return ''; })
      });
      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/transcript.txt', format: 'text/plain' });

      expect(fetchText).toHaveBeenCalledTimes(1);
      expect(response.tType).toEqual(0);
      expect(response.tData.length).toBe(0);
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
    });

    describe('with a word document URL', () => {
      test('without any errors in mammoth', async () => {
        const mockResponse =
          '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt \
ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>';

        const fetchDoc = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: {
            get: jest.fn(() => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
          },
          blob: jest.fn(() => {
            size: 11064;
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }),
        });

        const convertSpy = jest
          .spyOn(mammoth, 'convertToHtml')
          .mockImplementation(() => {
            return Promise.resolve({ value: mockResponse });
          });

        const response = await transcriptParser.parseTranscriptData({
          url: 'https://example.com/transcript.docx',
          format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        expect(fetchDoc).toHaveBeenCalledTimes(1);
        expect(convertSpy).toHaveBeenCalledTimes(1);
        expect(response.tData).toHaveLength(1);
        expect(response.tFileExt).toEqual('docx');
      });

      test('with errors in mammoth', async () => {
        // Mock console.error
        const originalError = console.error;
        console.error = jest.fn();

        const fetchDoc = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: {
            get: jest.fn(() => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
          },
          blob: jest.fn(() => {
            size: 11064;
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }),
        });

        const convertSpy = jest
          .spyOn(mammoth, 'convertToHtml')
          .mockImplementation(() => {
            return Promise.reject({ message: 'Error in mammoth' });
          });

        const response = await transcriptParser.parseTranscriptData({
          url: 'https://example.com/transcript.docx',
          format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        expect(fetchDoc).toHaveBeenCalledTimes(1);
        expect(convertSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalled();
        expect(response.tData).toHaveLength(0);
        expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
        // Reset console.error
        console.error = originalError;
      });
    });

    test('with a WebVTT file URL', async () => {
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a \
puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> \
00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchWebVTT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/vtt') },
        text: jest.fn(() => mockResponse),
      });

      const parsedData = [
        { end: 21, begin: 1.2, text: '[music]', tag: 'TIMED_CUE' },
        {
          end: 26.6,
          begin: 22.2,
          text: 'Just before lunch one day, a puppet show <br>was put on at school.',
          tag: 'TIMED_CUE'
        },
        {
          end: 31.5,
          begin: 26.7,
          text: 'It was called "Mister Bungle Goes to Lunch".',
          tag: 'TIMED_CUE'
        },
        {
          end: 34.5,
          begin: 31.6,
          text: 'It was fun to watch.',
          tag: 'TIMED_CUE'
        },
        {
          end: 41.3,
          begin: 36.1,
          text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
          tag: 'TIMED_CUE'
        },
      ];

      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/transcript.vtt', format: 'text/vtt' });

      expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual(parsedData);
      expect(response.tUrl).toEqual('https://example.com/transcript.vtt');
      expect(response.tFileExt).toEqual('vtt');
    });

    test('with an empty vtt file', async () => {
      const fetchText = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/vtt') },
        text: jest.fn(() => { return ''; })
      });
      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/transcript.vtt', format: 'text/vtt' });

      expect(fetchText).toHaveBeenCalledTimes(1);
      expect(response.tType).toEqual(0);
      expect(response.tData.length).toBe(0);
      expect(response.tUrl).toEqual('https://example.com/transcript.vtt');
    });

    describe('with an SRT file URL', () => {
      test('using fullstop as the decimal separator', async () => {
        const mockResponse =
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas \
put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt \
was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSRT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/x-subrip') },
          text: jest.fn(() => mockResponse),
        });

        const parsedData = [
          { end: 21, begin: 1.2, text: '[music]', tag: 'TIMED_CUE' },
          {
            end: 26.6,
            begin: 22.2,
            text: 'Just before lunch one day, a puppet show <br>was put on at school.',
            tag: 'TIMED_CUE'
          },
          {
            end: 31.5,
            begin: 26.7,
            text: 'It was called "Mister Bungle Goes to Lunch".',
            tag: 'TIMED_CUE'
          },
          {
            end: 34.5,
            begin: 31.6,
            text: 'It was fun to watch.',
            tag: 'TIMED_CUE'
          },
          {
            end: 41.3,
            begin: 36.1,
            text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
            tag: 'TIMED_CUE'
          },
        ];

        const response = await transcriptParser
          .parseTranscriptData({ url: 'https://example.com/transcript.srt', format: 'text/srt' });

        expect(fetchSRT).toHaveBeenCalledTimes(1);
        expect(response.tData).toEqual(parsedData);
        expect(response.tUrl).toEqual('https://example.com/transcript.srt');
        expect(response.tFileExt).toEqual('srt');
      });

      test('using comma as the decimal separator', async () => {
        const mockResponse =
          '1\r\n00:00:01,200 --> 00:00:21,000\n[music]\n\r\n2\r\n00:00:22,200 --> 00:00:26,600\nJust before lunch one day, a puppet show \nwas put \
on at school.\n\r\n3\r\n00:00:26,700 --> 00:00:31,500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31,600 --> 00:00:34,\
500\nIt was fun to watch.\n\r\n5\r\n00:00:36,100 --> 00:00:41,300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSRT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'text/srt') },
          text: jest.fn(() => mockResponse),
        });

        const parsedData = [
          { end: 21, begin: 1.2, text: '[music]', tag: 'TIMED_CUE' },
          { end: 26.6, begin: 22.2, tag: 'TIMED_CUE', text: 'Just before lunch one day, a puppet show <br>was put on at school.' },
          { end: 31.5, begin: 26.7, tag: 'TIMED_CUE', text: 'It was called "Mister Bungle Goes to Lunch".' },
          { end: 34.5, begin: 31.6, tag: 'TIMED_CUE', text: 'It was fun to watch.' },
          {
            end: 41.3, begin: 36.1, tag: 'TIMED_CUE',
            text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch."
          },
        ];

        const response = await transcriptParser
          .parseTranscriptData({ url: 'https://example.com/transcript.srt', format: 'text/srt' });

        expect(fetchSRT).toHaveBeenCalledTimes(1);
        expect(response.tData).toEqual(parsedData);
        expect(response.tUrl).toEqual('https://example.com/transcript.srt');
        expect(response.tFileExt).toEqual('srt');
      });
    });

    test('with unsupported transcript file type in URL: .png', async () => {
      const fetchImage = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'image/png') },
      });
      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/transcript_image.png', format: 'image' });
      expect(fetchImage).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tFileExt).toEqual(undefined);
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.noSupport);
    });

    test('with unsupported transcript file content-type: text/html', async () => {
      const fetchDoc = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/html') }
      });
      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/section/2/supplemental_files/12', format: '' });
      expect(fetchDoc).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tFileExt).toEqual(undefined);
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.noSupport);
    });

    test('with an invalid URL', async () => {
      // Mock console.error
      const originalError = console.error;
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch');
      const response = await transcriptParser
        .parseTranscriptData({ url: 'htt://example.com/transcript.json', format: 'application/json' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual('htt://example.com/transcript.json');
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
      expect(console.error).toHaveBeenCalledTimes(1);
      // Reset console.error
      console.error = originalError;
    });

    test('with a undefined URL', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const response = await transcriptParser.parseTranscriptData({ url: undefined, format: '' });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual(undefined);
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
    });

    test('with a unsuccessful fetch', async () => {
      // Mock console.error
      const originalError = console.error;
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce({
        status: 500
      });

      const response = await transcriptParser
        .parseTranscriptData({ url: 'https://example.com/manifest.json', format: 'application/json' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual('https://example.com/manifest.json');
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
      expect(console.error).toHaveBeenCalledTimes(1);
      // Reset console.error
      console.error = originalError;
    });
  });

  describe('parses WebVTT data', () => {
    describe('with valid', () => {
      describe('timestamps in cues', () => {
        test('with hh:mm:ss.ms format timestamps', () => {
          // mock fetch request
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tData[4]).toEqual({
            text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
            begin: 36.1,
            end: 41.3,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });

        test('with mm:ss.ms format timestamps', () => {
          // mock fetch request
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:01.200 --> 00:21.000\n[music]\n\r\n2\r\n00:22.200 --> 00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:26.700 --> 00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:31.600 --> 00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:36.100 --> 00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tData[4]).toEqual({
            text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
            begin: 36.1,
            end: 41.3,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });

        test('with missing trailing spaces', () => {
          // mock fetch request
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:01.200 --> 00:21.000\n[music]\n\r\n2\r\n00:22.200 --> 00:26.600\nJust before lunch one day, a puppet show\nwas put on at school.\n\r\n3\r\n00:26.700 --> 00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:31.600 --> 00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:36.100 --> 00:41.300\nIn the puppet show, Mr. Bungle came to the\nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tData[4]).toEqual({
            text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
            begin: 36.1,
            end: 41.3,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });
      });

      test('with cue text line starting with note', () => {
        // mock fetch request
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:01.200 --> 00:21.000\n[music]\n\r\n2\r\n00:22.200 --> 00:26.600\nNOTE: Just before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:26.700 --> 00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:31.600 --> 00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:36.100 --> 00:41.300\nIn the puppet show, Mr. Bungle had a \nnote to go to the boys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(5);
        expect(tData[1]).toEqual({
          text: 'NOTE: Just before lunch one day, a puppet show <br>was put on at school.',
          begin: 22.2,
          end: 26.6,
          tag: 'TIMED_CUE'
        });
        expect(tData[4]).toEqual({
          text: 'In the puppet show, Mr. Bungle had a <br>note to go to the boys\' room on his way to lunch.',
          begin: 36.1,
          end: 41.3,
          tag: 'TIMED_CUE'
        });
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
      });

      describe('metadata blocks in the header are', () => {
        test('parsed when showMetadata = true', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nType: caption\r\nLanguage: eng\r\nResponsible Party: Example.com\r\nFile Creation Date: 2025-06-20 10:56:44.00\r\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse, true, false);
          expect(tData).toHaveLength(6);
          expect(tData[0]).toEqual({
            text: 'Type: caption<br />Language: eng<br />Responsible Party: Example.com<br />File Creation Date: 2025-06-20 10:56:44.00<br />',
            begin: 0,
            end: 0,
            tag: 'METADATA'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });

        test('parsed when showMetadata = false (default)', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nType: caption\r\nLanguage: eng\r\nResponsible Party: Example.com\r\nFile Creation Date: 2025-06-20 10:56:44.00\r\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);
          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });
      });

      describe('NOTE blocks are', () => {
        describe('parsed with showNotes = true', () => {
          test('when comment followed by NOTE keyword in the header', () => {
            const mockResponse =
              'WEBVTT\r\n\r\nNOTE\nThis is a webvtt file\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

            const { tData, tType } = transcriptParser.parseTimedText(mockResponse, false, true);

            expect(tData).toHaveLength(6);
            expect(tData[0]).toEqual({
              tag: 'NOTE',
              begin: 0,
              end: 0,
              text: 'NOTE<br />This is a webvtt file<br />'
            });
            expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
          });

          test('when comment is in same line as NOTE keyword', () => {
            const mockResponse =
              'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\nNOTE This is a comment\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

            const { tData, tType } = transcriptParser.parseTimedText(mockResponse, false, true);

            expect(tData).toHaveLength(6);
            expect(tData[1]).toEqual({
              tag: 'NOTE',
              begin: 0,
              end: 0,
              text: 'NOTE This is a comment'
            });
            expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
          });

          test('when NOTE has multi-line comment', () => {
            const mockResponse =
              'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\nNOTE\nThis is a multi-\nline comment\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

            const { tData, tType } = transcriptParser.parseTimedText(mockResponse, false, true);

            expect(tData).toHaveLength(6);
            expect(tData[1]).toEqual({
              tag: 'NOTE',
              begin: 0,
              end: 0,
              text: 'NOTE This is a multi-<br>line comment'
            });
            expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
          });
        });

        test('not parsed with showNotes = false (default)', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nNOTE\nThis is a webvtt file\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            tag: 'TIMED_CUE',
            begin: 1.2,
            end: 21,
            text: '[music]'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });
      });

      describe('header block text for', () => {
        test('REGION is skipped', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nregion\nid:bill\nwidth:40%\nlines:3\nregionanchor:100%,100%\nviewportanchor:90%,90%\nscroll:up\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });

        test('STYLE is skipped', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nSTYLE\n::cue {\nbackground-image: linear-gradient(to bottom, dimgray, lightgray);\ncolor: papayawhip;\n}\n/* Style blocks cannot use blank lines nor "dash dash greater than" */\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });
      });
    });

    describe('with invalid file', () => {
      test('without WEBVTT in the header', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Invalid WebVTT file');
        expect(tType).toEqual(-3);
      });

      test('with random text in the header', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\nThis is a webvtt file1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Invalid WebVTT file');
        expect(tType).toEqual(-3);
      });

      test('with incorrect timestamp with missing seconds group in hh:mm:ss format', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toBeNull();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'Invalid timestamp in line with text; ',
          '[music]'
        );
        expect(tType).toEqual(-4);
      });

      test('with incorrect timestamp with a single digit for hour in hh:mm:ss format', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n0:00:01.200 --> 0:00:00.000\n[music]\n\r\n2\r\n0:00:22.200 --> 0:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n0:00:26.700 --> 0:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n0:00:31.600 --> 0:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n0:00:36.100 --> 0:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toBeNull();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'Invalid timestamp in line with text; ',
          '[music]'
        );
        expect(tType).toEqual(-4);
      });
    });
  });
});
