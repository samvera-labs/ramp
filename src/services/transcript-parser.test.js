import * as transcriptParser from './transcript-parser';
import renderingManifestTranscript from '@Json/transcript/transcript-manifest-rendering';
import renderingCanvasTranscript from '@Json/transcript/transcript-canvas-rendering';
import annotationTranscript from '@Json/transcript/transcript-annotation';
const utils = require('./utility-helpers');

describe('transcript-parser', () => {
  describe('parses transcript data given in a IIIF manifest', () => {
    describe('using rendering property', () => {
      test('at manifest level', async () => {
        // mock manifest fetch request
        const fetchManifest = jest
          .spyOn(utils, 'fetchManifest')
          .mockReturnValue(renderingManifestTranscript);
        // mock transcript text file fetch request
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
          text: jest.fn().mockResolvedValue('This the sample transcript text'),
        });

        const tData = await transcriptParser.parseManifestTranscript({
          manifestURL: 'https://example.com/transcript-manifest.json',
          canvasIndex: 0,
        });

        expect(fetchManifest).toHaveBeenCalledTimes(1);
        expect(fetchManifest).toHaveBeenCalledWith(
          'https://example.com/transcript-manifest.json'
        );
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(tData).toBeNull();
      });

      test('at canvas level', async () => {
        const mockResponse = {
          id: 'http://example.com/transcript.json',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/canvas/1/page/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing'],
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
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'Sample transcript text 2',
                format: 'text/plain',
              },
              target: 'http://example.com/canvas/1#t=26.7,31.5',
            },
          ],
        };
        // mock manifest fetch request
        const fetchManifestMock = jest
          .spyOn(utils, 'fetchManifest')
          .mockReturnValue(renderingCanvasTranscript);
        // mock transcript json file fetch request
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockResponse),
        });

        const tData = await transcriptParser.parseManifestTranscript({
          manifestURL: 'https://example.com/transcript-canvas.json',
          canvasIndex: 0,
        });

        expect(fetchManifestMock).toHaveBeenCalledTimes(1);
        expect(fetchManifestMock).toHaveBeenCalledWith(
          'https://example.com/transcript-canvas.json'
        );
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(tData).toHaveLength(2);
        expect(tData[0]).toEqual({
          value: 'Sample transcript text 1',
          format: 'text/plain',
          start: '00:00:22.200',
          end: '00:00:26.600',
        });
      });
    });
    test('using annotations', async () => {
      // mock manifest fetch request
      const fetchManifestMock = jest
        .spyOn(utils, 'fetchManifest')
        .mockReturnValue(annotationTranscript);

      const tData = await transcriptParser.parseManifestTranscript({
        manifestURL: 'https://example.com/transcript-annotation.json',
        canvasIndex: 0,
      });

      expect(fetchManifestMock).toHaveBeenCalledTimes(1);
      expect(fetchManifestMock).toHaveBeenCalledWith(
        'https://example.com/transcript-annotation.json'
      );
      expect(tData).toHaveLength(2);
      expect(tData[0]).toEqual({
        value: 'Just before lunch one day, a puppet show was put on at school.',
        format: 'text/plain',
        start: '00:00:22.200',
        end: '00:00:26.600',
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

      let tData = await transcriptParser.parseWebVTT(
        'http://example.com/transcript.vtt'
      );

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(tData).toHaveLength(5);
      expect(tData[0]).toEqual({
        value: '[music]',
        start: '00:00:01.200',
        end: '00:00:21.000',
      });
      expect(tData[4]).toEqual({
        value:
          "In the puppet show, Mr. Bungle came to the boys' room on his way to lunch.",
        start: '00:00:36.100',
        end: '00:00:41.300',
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

        let tData = await transcriptParser.parseWebVTT(
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

        let tData = await transcriptParser.parseWebVTT(
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
