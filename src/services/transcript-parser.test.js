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
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
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
          text: 'Just before lunch one day, a puppet show was put on at school.',
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
          text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
          tag: 'TIMED_CUE'
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
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
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
            text: 'Just before lunch one day, a puppet show was put on at school.',
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
            text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
            tag: 'TIMED_CUE'
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
          '1\r\n00:00:01,200 --> 00:00:21,000\n[music]\n\r\n2\r\n00:00:22,200 --> 00:00:26,600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26,700 --> 00:00:31,500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31,600 --> 00:00:34,500\nIt was fun to watch.\n\r\n5\r\n00:00:36,100 --> 00:00:41,300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSRT = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 200,
          headers: { get: jest.fn(() => 'text/srt') },
          text: jest.fn(() => mockResponse),
        });

        const parsedData = [
          { end: 21, begin: 1.2, text: '[music]', tag: 'TIMED_CUE' },
          {
            end: 26.6,
            begin: 22.2,
            text: 'Just before lunch one day, a puppet show was put on at school.',
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
            text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
            tag: 'TIMED_CUE'
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
            'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
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
            tag: 'TIMED_CUE'
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
            tag: 'TIMED_CUE'
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
            text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
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
            text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
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
            text: "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
            begin: 36.1,
            end: 41.3,
            tag: 'TIMED_CUE'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });
      });


      test('with comment in same line as NOTE keyword', () => {
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\nNOTE This is a comment\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(6);
        expect(tData[1]).toEqual({
          tag: 'NOTE',
          begin: 0,
          end: 0,
          text: 'NOTE This is a comment'
        });
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
      });

      test('with multi-line comment', () => {
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\nNOTE\nThis is a multi-\nline comment\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(6);
        expect(tData[1]).toEqual({
          tag: 'NOTE',
          begin: 0,
          end: 0,
          text: 'NOTE This is a multi-line comment'
        });
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
      });

      test('with cue text line starting with note', () => {
        // mock fetch request
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:01.200 --> 00:21.000\n[music]\n\r\n2\r\n00:22.200 --> 00:26.600\nNOTE: Just before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:26.700 --> 00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:31.600 --> 00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:36.100 --> 00:41.300\nIn the puppet show, Mr. Bungle had a \nnote to go to the boys\' room on his way to lunch.\n';

        const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

        expect(tData).toHaveLength(5);
        expect(tData[1]).toEqual({
          text: 'NOTE: Just before lunch one day, a puppet show was put on at school.',
          begin: 22.2,
          end: 26.6,
          tag: 'TIMED_CUE'
        });
        expect(tData[4]).toEqual({
          text: 'In the puppet show, Mr. Bungle had a note to go to the boys\' room on his way to lunch.',
          begin: 36.1,
          end: 41.3,
          tag: 'TIMED_CUE'
        });
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
      });

      describe('text in the header block', () => {
        test('with comment followed by NOTE keyword in the header', () => {
          const mockResponse =
            'WEBVTT\r\n\r\nNOTE\nThis is a webvtt file\n\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n\r\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';

          const { tData, tType } = transcriptParser.parseTimedText(mockResponse);

          expect(tData).toHaveLength(6);
          expect(tData[0]).toEqual({
            tag: 'NOTE',
            begin: 0,
            end: 0,
            text: 'NOTE<br />This is a webvtt file'
          });
          expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.timedText);
        });

        test('with header block for REGION', () => {
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

        test('with header block for STYLE', () => {
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
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalidVTT);
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
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalidVTT);
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
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalidTimestamp);
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
        expect(tType).toEqual(transcriptParser.TRANSCRIPT_TYPES.invalidTimestamp);
      });
    });
  });

  describe('getMatchedTranscriptLines()', () => {
    const transcripts = [
      {
        id: 0, begin: 71.9, end: 82, tag: "TIMED_CUE",
        text: 'Then, in the lunchroom, Mr. Bungle was so \rclumsy and impolite that he knocked over \reverything. And no one wanted to sit next \rto him.\r'
      },
      {
        id: 1, begin: 83.5, end: 89, tag: "TIMED_CUE",
        text: 'And when he finally knocked his own tray \roff the table, that was the end of the puppet \rshow.\r'
      },
      {
        id: 2, begin: 90.3, end: 96.3, tag: "TIMED_CUE",
        text: 'The children knew that even though Mr. Bungle \rwas funny to watch, he wouldn\'t be much fun \rto eat with.\r'
      },
      {
        id: 3, begin: 96.4, end: 102.5, tag: "TIMED_CUE",
        text: 'Phil knew that a Mr. Bungle wouldn\'t have \rmany friends. He wouldn\'t want to be like \rMr. Bungle.\r'
      },
      {
        id: 4, begin: 103.9, end: 109.1, tag: "TIMED_CUE",
        text: 'Later Miss Brown said it was time to for \rthe children who ate in the cafeteria to \rgo to lunch.\r'
      },
      {
        id: 5, begin: 109.2, end: 112.5, tag: "TIMED_CUE",
        text: 'She hoped there weren\'t any Mr. Bungles in \rthis room.\r'
      },
      {
        id: 6, begin: 118.5, end: 123.2, tag: "TIMED_CUE",
        text: 'Phil stopped to return a book to Miss Brown \rwhile his friends went on to the lunchroom.\r'
      },
    ];

    test('with a single match in a cue', () => {
      const searchHits = [
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:36.400,00:01:42.500",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 1,
          value: "<em>Phil</em> knew that a Mr. Bungle wouldn't have many friends. He wouldn't want to be like Mr. Bungle."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:58.500,00:02:03.200",
          targetURI: "http://example.com/canvas/1/transcrip/1/transcripts",
          hitCount: 1,
          value: "<em>Phil</em> stopped to return a book to Miss Brown while his friends went on to the lunchroom."
        },
      ];
      const matchedTranscriptLines = transcriptParser.getMatchedTranscriptLines(searchHits, 'phil', transcripts);
      expect(matchedTranscriptLines).toHaveLength(2);
      expect(matchedTranscriptLines[0]).toEqual({
        id: 3,
        begin: 96.4,
        end: 102.5,
        tag: "TIMED_CUE",
        text: "<em>Phil</em> knew that a Mr. Bungle wouldn't have many friends. He wouldn't want to be like Mr. Bungle.",
        match: "<span class=\"ramp--transcript_highlight\">Phil</span> knew that a Mr. Bungle wouldn't have many friends. He wouldn't want to be like Mr. Bungle.",
        matchCount: 1,
      });
    });

    test('with multiple matches in a cue', () => {
      const searchHits = [
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:11.900,00:01:22.000",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 1,
          value: "Then, in the lunchroom, Mr. <em>Bungle</em> was so clumsy and impolite that he knocked over everything. And no one wanted to sit next to him."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:30.300,00:01:36.300",
          targetURI: "http://example.com/canvas/1/transcrip/1/transcripts",
          hitCount: 1,
          value: "The children knew that even though Mr. <em>Bungle</em> was funny to watch, he wouldn\'t be much fun to eat with."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:36.400,00:01:42.500",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 2,
          value: "Phil knew that a Mr. <em>Bungle</em> wouldn't have many friends. He wouldn't want to be like Mr. <em>Bungle</em>."
        },
      ];
      const matchedTranscriptLines = transcriptParser.getMatchedTranscriptLines(searchHits, 'bungle', transcripts);
      expect(matchedTranscriptLines).toHaveLength(3);
      expect(matchedTranscriptLines[0]).toEqual({
        id: 0,
        begin: 71.9, end: 82,
        tag: "TIMED_CUE",
        text: "Then, in the lunchroom, Mr. <em>Bungle</em> was so clumsy and impolite that he knocked over everything. And no one wanted to sit next to him.",
        match: "Then, in the lunchroom, Mr. <span class=\"ramp--transcript_highlight\">Bungle</span> was so clumsy and impolite that he knocked over everything. And no one wanted to sit next to him.",
        matchCount: 1,
      });
      expect(matchedTranscriptLines[2]).toEqual({
        id: 3,
        begin: 96.4,
        end: 102.5,
        tag: "TIMED_CUE",
        text: "Phil knew that a Mr. <em>Bungle</em> wouldn't have many friends. He wouldn't want to be like Mr. <em>Bungle</em>.",
        match: "Phil knew that a Mr. <span class=\"ramp--transcript_highlight\">Bungle</span> wouldn't have many friends. He wouldn't want to be like Mr. <span class=\"ramp--transcript_highlight\">Bungle</span>.",
        matchCount: 2,
      });
    });
  });
});
