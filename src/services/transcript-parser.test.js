import * as transcriptParser from './transcript-parser';
import renderingManifestTranscript from '@Json/test_data/transcript-manifest-rendering';
import renderingCanvasTranscript from '@Json/test_data/transcript-canvas-rendering';
import multipleCanvas from '@Json/test_data/transcript-multiple-canvas';
import annotationTranscript from '@Json/test_data/transcript-annotation';
const utils = require('./utility-helpers');

describe('transcript-parser', () => {
  describe('parseTranscriptData()', () => {
    test('with a JSON file URL', async () => {
      const fetchJSON = jest
        .spyOn(utils, 'fetchJSONFile')
        .mockReturnValue(renderingManifestTranscript);

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/manifest.json',
        0
      );

      expect(fetchJSON).toHaveBeenCalledTimes(1);
      expect(response.tData).toBeNull();
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
    });

    test('with a txt file URL', async () => {
      const fetchText = jest
        .spyOn(utils, 'fetchTextFile')
        .mockReturnValue('This is a sample text transcript file');

      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript.txt',
        0
      );

      expect(fetchText).toHaveBeenCalledTimes(1);
      expect(response.tData).toBeNull();
      expect(response.tUrl).toEqual('https://example.com/transcript.txt');
    });

    test('with a WebVTT file URL', async () => {
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchWebVTT = jest.spyOn(global, 'fetch').mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockResponse),
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
      const response = await transcriptParser.parseTranscriptData(
        'https://example.com/transcript',
        0
      );

      expect(response).toBeNull();
    });
  });

  describe('parses transcript data given in a IIIF manifest', () => {
    describe('using annotations with supplementing motivation', () => {
      test('at manifest level', async () => {
        const { tData, tUrl } = await transcriptParser.parseManifestTranscript(
          renderingManifestTranscript,
          'https://example.com/transcript-manifest.json',
          0
        );

        expect(tData).toBeNull();
        expect(tUrl).toEqual('https://example.com/transcript.txt');
      });

      describe('at canvas level', () => {
        test('with a single canvas', async () => {
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
              renderingCanvasTranscript,
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

        test('with multiple canvases', async () => {
          const mockResponse = {
            id: 'http://example.com/transcript.json',
            type: 'AnnotationPage',
            items: [
              {
                id: 'http://example.com/canvas/2/page/annotation/1',
                type: 'Annotation',
                motivation: ['supplementing'],
                body: {
                  type: 'TextualBody',
                  value: 'Sample transcript text 1 in canvas 2',
                  format: 'text/plain',
                },
                target: 'http://example.com/canvas/2#t=22.2,26.6',
              },
              {
                id: 'http://example.com/canvas/2/page/annotation/2',
                type: 'Annotation',
                motivation: ['supplementing'],
                body: {
                  type: 'TextualBody',
                  text: 'Sample transcript text 2 in canvas 2',
                  format: 'text/plain',
                },
                target: 'http://example.com/canvas/2#t=26.7,31.5',
              },
            ],
          };
          // mock transcript json file fetch request
          const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
          });

          const { tData, tUrl } =
            await transcriptParser.parseManifestTranscript(
              multipleCanvas,
              'https://example.com/transcript-canvas.json',
              1
            );
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect(fetchSpy).toHaveBeenCalledWith(
            'https://example.com/sample/transcript-2.json'
          );
          expect(tData).toHaveLength(2);
          expect(tData[0]).toEqual({
            text: 'Sample transcript text 1 in canvas 2',
            format: 'text/plain',
            begin: 22.2,
            end: 26.6,
          });
          expect(tUrl).toEqual('https://example.com/sample/transcript-2.json');
        });
      });

      test('within manifest', async () => {
        const { tData, tUrl } = await transcriptParser.parseManifestTranscript(
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

    describe('using annotations', () => {
      test('without supplementing motivation', async () => {
        const { tData, tUrl } = await transcriptParser.parseManifestTranscript(
          multipleCanvas,
          'https://example.com/transcript-canvas.json',
          0
        );
        expect(tData).toEqual([]);
        expect(tUrl).toEqual('https://example.com/transcript-canvas.json');
      });
    });
  });

  describe('parses WebVTT data', () => {
    test('when valid', async () => {
      // mock fetch request
      const mockResponse =
        'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockResponse),
      });

      const tData = await transcriptParser.parseWebVTT(
        'http://example.com/transcript.vtt'
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
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

    describe('when invalid', () => {
      test('without WEBVTT header', async () => {
        // mock console.error and fetch request
        console.error = jest.fn();
        const mockResponse =
          '1\r\n00:00:01.200 --> 00:00:21.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
          text: jest.fn().mockResolvedValue(mockResponse),
        });

        const tData = await transcriptParser.parseWebVTT(
          'http://example.com/transcript.vtt'
        );
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(tData).toHaveLength(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Invalid WebVTT file');
      });

      test('with incorrect timestamp', async () => {
        // mock console.error and fetch request
        console.error = jest.fn();
        const mockResponse =
          'WEBVTT\r\n\r\n1\r\n00:00:01.200 --> 00:00:.000\n[music]\n2\r\n00:00:22.200 --> 00:00:26.600\nJust before lunch one day, a puppet show \nwas put on at school.\n\r\n3\r\n00:00:26.700 --> 00:00:31.500\nIt was called "Mister Bungle Goes to Lunch".\n\r\n4\r\n00:00:31.600 --> 00:00:34.500\nIt was fun to watch.\r\n\r\n5\r\n00:00:36.100 --> 00:00:41.300\nIn the puppet show, Mr. Bungle came to the \nboys\' room on his way to lunch.\n';
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
          text: jest.fn().mockResolvedValue(mockResponse),
        });

        const tData = await transcriptParser.parseWebVTT(
          'http://example.com/transcript.vtt'
        );
        expect(fetchSpy).toHaveBeenCalledTimes(1);
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
