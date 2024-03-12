import * as transcriptParser from './transcript-parser';
import manifestTranscript from '@TestData/volleyball-for-boys';
import multipleCanvas from '@TestData/transcript-multiple-canvas';
import annotationTranscript from '@TestData/transcript-annotation';
import mammoth from 'mammoth';
import { cleanup } from '@testing-library/react';
const utils = require('./utility-helpers');

describe('transcript-parser', () => {
  const errorMock = jest.spyOn(utils, 'handleFetchErrors').mockImplementation(
    jest.fn((r) => {
      return r;
    })
  );

  afterEach(() => {
    cleanup();
  });

  describe('readSupplementingAnnotations', () => {
    test('invalid manifestURL', async () => {
      // mock console.error
      console.error = jest.fn();
      const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce({
        status: 500,
      });

      const transcripts = await transcriptParser.readSupplementingAnnotations(
        'htt://example.com/manifest.json'
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('htt://example.com/manifest.json');
      expect(transcripts).toHaveLength(0);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, ",
        'htt://example.com/manifest.json'
      );
    });

    test('valid manifestURL without supplementing annotations', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 200,
        headers: { get: jest.fn(() => 'application/json') },
        json: jest.fn(() => manifestTranscript),
      });

      const transcripts = await transcriptParser.readSupplementingAnnotations(
        'https://example.com/volleyball-for-boys/manifest.json'
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/volleyball-for-boys/manifest.json');
      expect(transcripts).toHaveLength(1);
      expect(transcripts[0].items).toHaveLength(0);
    });

    describe('valid manifestURL with supplementing annotations', () => {
      test('for transcript as a list of annotations', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/json') },
          json: jest.fn(() => annotationTranscript),
        });

        const transcripts = await transcriptParser.readSupplementingAnnotations(
          'https://example.com/annotation-transcript/manifest.json'
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith('https://example.com/annotation-transcript/manifest.json');
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
          'https://example.com/multiple-canvas/manifest.json'
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith('https://example.com/multiple-canvas/manifest.json');
        expect(transcripts).toHaveLength(2);
        expect(transcripts[0].items).toHaveLength(0);
        expect(transcripts[1].items).toEqual([
          {
            title: 'Captions in WebVTT format',
            filename: 'Captions in WebVTT format',
            id: 'Captions in WebVTT format-1-0',
            url: 'https://example.com/sample/subtitles.vtt',
            isMachineGen: false,
            format: 'text/vtt'
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
    });
  });

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

      expect(response.tData.length).toBeGreaterThan(0);
      expect(response.tType).toEqual(2);
      expect(response.tUrl).toEqual('https://example.com/volleyball-for-boys.txt');
      expect(response.tFileExt).toEqual('txt');
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
      ]); expect(response.tFileExt).toEqual('json');
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
      expect(response.tFileExt).toEqual('json');
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
      expect(response.tType).toEqual(2);
      expect(response.tData.length).toBeGreaterThan(0);
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
      expect(response.tFileExt).toEqual('txt');
    });

    test('with word document URL', async () => {
      const mockResponse =
        '<p><strong>Speaker 1:</strong> <em>Lorem ipsum</em> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Etiam non quam lacus suspendisse faucibus interdum posuere. </p>';

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

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.docx',
        0
      );

      expect(fetchDoc).toHaveBeenCalledTimes(1);
      expect(convertSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toHaveLength(1);
      expect(response.tFileExt).toEqual('docx');
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
      expect(response.tFileExt).toEqual('vtt');
    });

    describe('with an SRT file URL', () => {
      test('using fullstop as the decimal separator', async () => {
        const mockResponse =
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSRT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'application/x-subrip') },
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
          'https://example.com/transcript.srt',
          0
        );

        expect(fetchSRT).toHaveBeenCalledTimes(1);
        expect(response.tData).toEqual(parsedData);
        expect(response.tUrl).toEqual('https://example.com/transcript.srt');
        expect(response.tFileExt).toEqual('srt');
      });

      test('using comma as the decimal separator', async () => {
        const mockResponse =
          '1\r\n00:00:01,200 --> 00:00:21,000\n[music]\n2\r\n00:00:22,200 --> 00:00:26,600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26,700 --> 00:00:31,500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31,600 --> 00:00:34,500\nIt was fun to watch.\n\r\n5\r\n00:00:36,100 --> 00:00:41,300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSRT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'text/srt') },
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
          'https://example.com/transcript.srt',
          0
        );

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
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript_image.png',
        0
      );
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
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/section/2/supplemental_files/12',
        0
      );
      expect(fetchDoc).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tFileExt).toEqual(undefined);
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.noSupport);
    });

    test('with an invalid URL', async () => {
      // mock console.error
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch');

      const response = await transcriptParser.parseTranscriptData(
        'htt://example.com/transcript.json',
        0
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual('htt://example.com/transcript.json');
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('with a undefined URL', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const response = await transcriptParser.parseTranscriptData(
        undefined,
        0,
        ''
      );

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual(undefined);
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
    });

    test('with a unsuccessful fetch', async () => {
      // mock console.error
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce({
        status: 500
      });

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/manifest.json',
        0
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response.tData).toEqual([]);
      expect(response.tUrl).toEqual('https://example.com/manifest.json');
      expect(response.tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalid);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('parses transcript data given in a IIIF manifest', () => {
    describe('using annotations with supplementing motivation', () => {
      test('at manifest level', async () => {
        const { tData, tUrl, tType, tFileExt } = await transcriptParser.parseManifestTranscript(
          manifestTranscript,
          'https://example.com/volleyball-for-boys.json',
          0
        );

        expect(tData.length).toBeGreaterThan(1);
        expect(tType).toEqual(2);
        expect(tUrl).toEqual('https://example.com/volleyball-for-boys.txt');
        expect(tFileExt).toEqual('txt');
      });

      describe('at canvas level', () => {
        test('as a linked resource', async () => {
          // mock fetch request
          const mockResponse =
            'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            text: jest.fn().mockResolvedValue(mockResponse),
          });

          const { tData, tUrl, tType, tFileExt } =
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
          expect(tFileExt).toEqual('vtt');
          expect(tType).toEqual(1);
        });

        test('as a list of annotations', () => {
          const { tData, tUrl, tType, tFileExt } = transcriptParser.parseManifestTranscript(
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
          expect(tFileExt).toEqual('json');
          expect(tType).toEqual(1);
        });
      });
    });

    test('using annotations without supplementing motivation', () => {
      const { tData, tUrl, tType } = transcriptParser.parseManifestTranscript(
        multipleCanvas,
        'https://example.com/transcript-canvas.json',
        0
      );
      expect(tData).toEqual([]);
      expect(tUrl).toEqual('https://example.com/transcript-canvas.json');
      expect(tType).toEqual(0);
    });
  });

  describe('parses WebVTT data', () => {
    describe('when valid', () => {
      test('with hh:mm:ss.ms format timestamps', () => {
        // mock fetch request
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseTimedText(mockResponse);

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

        const tData = transcriptParser.parseTimedText(mockResponse);

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

        const tData = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Invalid WebVTT file');
      });

      test('with incorrect timestamp', () => {
        // mock console.error
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const tData = transcriptParser.parseTimedText(mockResponse);

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
