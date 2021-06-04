import * as transcriptParser from './transcript-parser';
import jsonBlobTranscript from '@Json/transcripts/external-transcript';
import renderingManifestTranscript from '@Json/transcripts/transcript-manifest-rendering';
import renderingCanvasTranscript from '@Json/transcripts/transcript-canvas-rendering';
import annotationTranscript from '@Json/transcripts/transcript-annotation';
import { waitFor } from '@testing-library/dom';

describe('transcript-parser', () => {
  it('parses external JSON blob', () => {
    const tData = transcriptParser.parseTranscriptData(
      jsonBlobTranscript,
      'http://example.com/canvas'
    );
    expect(tData).toHaveLength(7);
    expect(tData[0]).toEqual({
      tValue: '[music]',
      tMediaFragment: 'http://example.com/canvas#t=1.2,21',
      tFormat: 'text/plain',
    });
  });

  describe("parses 'rendering' property", () => {
    it('at manifest level', async () => {
      const mockResponse = 'This the sample transcript text';
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        text: jest.fn().mockResolvedValue(mockResponse),
      });
      const tData = await transcriptParser.parseManifestTranscript({
        manifest: renderingManifestTranscript,
        canvasIndex: 0,
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(tData).toHaveLength(1);
      expect(tData[0]['tMediaFragment']).toBeNull();
    });

    it('at canvas level', async () => {
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
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const tData = await transcriptParser.parseManifestTranscript({
        manifest: renderingCanvasTranscript,
        canvasIndex: 0,
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(tData).toHaveLength(2);
      expect(tData[0]).toEqual({
        tValue: 'Sample transcript text 1',
        tFormat: 'text/plain',
        tMediaFragment: 'http://example.com/canvas/1#t=22.2,26.6',
      });
    });
  });

  it('parses IIIF annotations', async () => {
    const tData = await transcriptParser.parseManifestTranscript({
      manifest: annotationTranscript,
      canvasIndex: 0,
    });
    expect(tData).toHaveLength(2);
    expect(tData[0]).toEqual({
      tValue: 'Just before lunch one day, a puppet show was put on at school.',
      tMediaFragment:
        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=22.2,26.6',
      tFormat: 'text/plain',
    });
  });
});
