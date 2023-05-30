import * as transcriptParser from './transcript-parser';
import manifestTranscript from '@Json/test_data/volleyball-for-boys';
import canvasTranscript from '@Json/test_data/transcript-canvas';
import multipleCanvas from '@Json/test_data/transcript-multiple-canvas';
import annotationTranscript from '@Json/test_data/transcript-annotation';
import mammoth from 'mammoth';
const utils = require('./utility-helpers');

describe('transcript-parser', () => {
  const errorMock = jest.spyOn(utils, 'handleFetchErrors').mockImplementation(
    jest.fn((r) => {
      return r;
    })
  );
  describe('parseTranscriptData()', () => {
    test('with a manifest file URL', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => manifestTranscript),
      });

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/volleyball-for-boys.json',
        0
      );

      expect(response.tData).toBeNull();
      expect(response.tUrl).toEqual('https://example.com/volleyball-for-boys.txt');
    });

    test('with a JSON file URL', async () => {
      const parsedJSON = [
        {
          spans: [
            {
              begin: 1.2,
              end: 9,
              text: '[music]',
            },
          ],
        },
        {
          spans: [
            {
              begin: 10,
              end: 21,
              text: '<b>Hello</b> world!',
            },
          ],
        },
      ];

      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => parsedJSON),
      });

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.json',
        0
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([
        { begin: 1.2, end: 9, text: '[music]' },
        { begin: 10, end: 21, text: '<b>Hello</b> world!' },
      ]);
    });

    test('with empty JSON file URL', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => []),
      });
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.json',
        0
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toBeNull();
    });

    test('with valid JSON file with speaker', async () => {
      const jsonResponse = [
        {
          speaker: 'Speaker 1',
          spans: [
            { begin: '00:00:01.200', end: '00:00:21.000', text: '[music]' },
            {
              begin: '00:00:22.200',
              end: '00:00:26.600',
              text: 'Just before lunch one day, a puppet show\nwas put on at school.',
            },
          ],
        },
      ];
      const parsedJSON = [
        {
          speaker: 'Speaker 1',
          begin: '00:00:01.200',
          end: '00:00:21.000',
          text: '[music]',
        },
        {
          speaker: 'Speaker 1',
          begin: '00:00:22.200',
          end: '00:00:26.600',
          text: 'Just before lunch one day, a puppet show\nwas put on at school.',
        },
      ];
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => jsonResponse),
      });

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.json',
        0
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toHaveLength(2);
      expect(response.tData).toEqual(parsedJSON);
    });

    test('with a text file URL', async () => {
      const fetchText = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/plain') },
        text: jest.fn(() => 'This is a sample text transcript file'),
      });
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.txt',
        0
      );

      expect(fetchText).toHaveBeenCalledTimes(1);
      expect(response.tData).toBeNull();
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
    });

    test('with word document URL', async () => {
      const mockResponse =
        '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>';

      const fetchDoc = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: {
          get: jest.fn(() => 'application/msword'),
        },
        blob: jest.fn(() => {
          size: 11064;
          type: 'application/msword';
        }),
      });

      const convertSpy = jest
        .spyOn(mammoth, 'convertToHtml')
        .mockImplementation(() => {
          return Promise.resolve({ value: mockResponse });
        });

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.doc',
        0
      );

      expect(fetchDoc).toHaveBeenCalledTimes(1);
      expect(convertSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toHaveLength(1);
    });

    test('with a WebVTT file URL', async () => {
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchWebVTT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'text/vtt') },
        text: jest.fn(() => mockResponse),
      });

      const parsedData = [
        { end: 21, begin: 1.2, text: '[music]' },
        {
          end: 26.6,
          begin: 22.2,
          text: 'Just before lunch one day, a puppet show was put on at school.',
        },
        {
          end: 31.5,
          begin: 26.7,
          text: 'It was called "Mister Bungle Goes to Lunch".',
        },
        {
          end: 34.5,
          begin: 31.6,
          text: 'It was fun to watch.',
        },
        {
          end: 41.3,
          begin: 36.1,
          text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
        },
      ];

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.vtt',
        0
      );

      expect(fetchWebVTT).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual(parsedData);
      expect(response.tUrl).toEqual('https://example.com/transcript.vtt');
    });

    test('with an invalid URL', async () => {
      // mock console.log
      console.log = jest.fn();
      const response = await transcriptParser.parseTranscriptData(
        'example.com/transcript',
        0
      );
      expect(response).toBeNull();
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Invalid transcript URL');
    });

    test('with an undefined URL', async () => {
      const response = await transcriptParser.parseTranscriptData(undefined, 0);
      expect(response).toBeNull();
    });

    test('with invalid transcript file type: .png', async () => {
      const fetchImage = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'image/png') },
      });
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript_image.png',
        0
      );
      expect(fetchImage).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
    });
  });

  describe('parses transcript data given in a IIIF manifest', () => {
    describe('using annotations with supplementing motivation', () => {
      test('at manifest level', async () => {
        const { tData, tUrl } = await transcriptParser.parseManifestTranscript(
          manifestTranscript,
          'https://example.com/volleyball-for-boys.json',
          0
        );

        expect(tData).toBeNull();
        expect(tUrl).toEqual('https://example.com/volleyball-for-boys.txt');
      });

      describe('at canvas level', () => {
        test('with a single canvas - as a linked resource', async () => {
          const mockResponse = {
            id: 'http://example.com/transcript.json',
            type: 'AnnotationPage',
            items: [
              {
                id: 'http://example.com/canvas/1/page/annotation/1',
                type: 'Annotation',
                motivation: 'supplementing',
                body: {
                  type: 'TextualBody',
                  value: 'Sample transcript text 1',
                  format: 'text/plain',
                },
                target: 'http://example.com/canvas/1#t=22.2,26.6',
              },
              {
                id: 'http://example.com/canvas/1/page/annotation/2',
                type: 'Annotation',
                motivation: 'supplementing',
                body: {
                  type: 'TextualBody',
                  text: 'Sample transcript text 2',
                  format: 'text/plain',
                },
                target: 'http://example.com/canvas/1#t=26.7,31.5',
              },
            ],
          };

          // mock transcript json file fetch request
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
          });

          const { tData, tUrl } =
            await transcriptParser.parseManifestTranscript(
              canvasTranscript,
              'https://example.com/transcript-canvas.json',
              0
            );
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy).toHaveBeenCalledWith(
            'https://example.com/sample/transcript-1.json'
          );
          expect(tData).toHaveLength(2);
          expect(tData[0]).toEqual({
            text: 'Sample transcript text 1',
            format: 'text/plain',
            begin: 22.2,
            end: 26.6,
          });
          expect(tUrl).toEqual('https://example.com/sample/transcript-1.json');
        });

        test('with multiple canvases - as a linked resource', async () => {
          // mock fetch request
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            text: jest.fn().mockResolvedValue(mockResponse),
          });

          const { tData, tUrl } =
            await transcriptParser.parseManifestTranscript(
              multipleCanvas,
              'https://example.com/transcript-canvas.json',
              1
            );
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy).toHaveBeenCalledWith(
            'https://example.com/sample/subtitles.vtt'
          );
          expect(tData).toHaveLength(5);
          expect(tData[0]).toEqual({
            text: '[music]',
            begin: 1.2,
            end: 21.0,
          });
          expect(tUrl).toEqual('https://example.com/sample/subtitles.vtt');
        });

        test('as a list of annotations', () => {
          const { tData, tUrl } = transcriptParser.parseManifestTranscript(
            annotationTranscript,
            'https://example.com/transcript-annotation.json',
            0
          );

          expect(tData).toHaveLength(2);
          expect(tData[0]).toEqual({
            text: 'Transcript text line 1',
            format: 'text/plain',
            begin: 22.2,
            end: 26.6,
          });
          expect(tUrl).toEqual('https://example.com/transcript-annotation.json');
        });
      });
    });

    test('using annotations without supplementing motivation', () => {
      const { tData, tUrl } = transcriptParser.parseManifestTranscript(
        multipleCanvas,
        'https://example.com/transcript-canvas.json',
        0
      );
      expect(tData).toEqual([]);
      expect(tUrl).toEqual('https://example.com/transcript-canvas.json');
    });
  });

  describe('parses WebVTT data', () => {
    describe('when valid', () => {
      test('with hh:mm:ss.ms format timestamps', () => {
        // mock fetch request
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseWebVTT(mockResponse);

        expect(tData).toHaveLength(5);
        expect(tData[0]).toEqual({
          text: '[music]',
          begin: 1.2,
          end: 21,
        });
        expect(tData[4]).toEqual({
          text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
          begin: 36.1,
          end: 41.3,
        });
      });

      test('with mm:ss.ms format timestamps', () => {
        // mock fetch request
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:01.200 --> 00:21.000\n[music]\n2\r\n00:22.200 --> 00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:26.700 --> 00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:31.600 --> 00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:36.100 --> 00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseWebVTT(mockResponse);

        expect(tData).toHaveLength(5);
        expect(tData[0]).toEqual({
          text: '[music]',
          begin: 1.2,
          end: 21,
        });
        expect(tData[4]).toEqual({
          text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
          begin: 36.1,
          end: 41.3,
        });
      });
    });

    describe('when invalid', () => {
      test('without WEBVTT header', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseWebVTT(mockResponse);

        expect(tData).toHaveLength(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Invalid WebVTT file');
      });

      test('with incorrect timestamp', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseWebVTT(mockResponse);

        expect(tData).toHaveLength(4);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'Invalid timestamp in line with text; ',
          '[music]'
        );
      });
    });
  });
});
