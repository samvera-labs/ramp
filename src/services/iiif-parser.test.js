import manifest from '../json/mahler-symphony-audio';
import manifestVideo from '../json/mahler-symphony-video';
import * as iiifParser from './iiif-parser';

describe('iiif-parser', () => {
  it('canvasesInManifest() determines whether canvases exist in the manifest', () => {
    expect(iiifParser.canvasesInManifest(manifest)).toBeTruthy();
  });

  it('should contain a structures[] array which represents structured metadata', () => {
    expect(manifest.structures).toBeDefined();
    expect(Array.isArray(manifest.structures)).toBeTruthy();
  });

  it('getChildCanvases() should return an array of existing child "Canvas" items if they exist for a Range', () => {
    const rangeIdWithChildCanvases =
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-1';
    const rangeIdWithoutChildCanvases =
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1';

    expect(
      iiifParser.getChildCanvases({
        rangeId: rangeIdWithChildCanvases,
        manifest,
      })
    ).toHaveLength(1);
    expect(
      iiifParser.getChildCanvases({
        rangeId: rangeIdWithoutChildCanvases,
        manifest,
      })
    ).toHaveLength(0);
  });

  describe('filterVisibleRangeItem()', () => {
    it('return item when behavior is not equal to no-nav', () => {
      const item = {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2',
        type: 'Range',
        label: {
          en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
        },
        items: [
          {
            id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-1',
            type: 'Range',
            label: {
              en: ['Track 1. II. Tempo di Menuetto'],
            },
          },
        ],
      };
      expect(iiifParser.filterVisibleRangeItem({ item, manifest })).toEqual(
        item
      );
    });
    it('return null when behavior is equal to no-nav', () => {
      const item = {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1',
        type: 'Range',
        behavior: 'no-nav',
        label: {
          en: ['CD1 - Mahler, Symphony No.3'],
        },
      };
      expect(iiifParser.filterVisibleRangeItem({ item, manifest })).toBeNull();
    });
  });

  describe('getMediaFragment()', () => {
    it('returns a start/stop helper object from a uri', () => {
      const expectedObject = { start: '374', stop: '525' };
      expect(
        iiifParser.getMediaFragment(
          'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=374,525'
        )
      ).toEqual(expectedObject);

      const noTime = iiifParser.getMediaFragment(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-4'
      );

      expect(noTime).toBeUndefined();
    });

    it('returns undefined when invalid uri is given', () => {
      expect(iiifParser.getMediaFragment(undefined)).toBeUndefined();
    });
  });

  describe('getMediaInfo()', () => {
    it('should return sources, mediaType and parsing error (if any)', () => {
      const expectedObject = {
        sources: [
          {
            src:
              'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/320Kbps.mp4',
            format: 'video/mp4',
            quality: 'High',
          },
          {
            src:
              'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/medium/128Kbps.mp4',
            format: 'video/mp4',
            quality: 'Medium',
          },
        ],
        mediaType: 'video',
        error: null,
      };
      expect(
        iiifParser.getMediaInfo({ manifest: manifestVideo, canvasIndex: 0 })
      ).toEqual(expectedObject);
    });

    it('should return error when invalid canvas index is given', () => {
      const expectedObject = {
        error: 'No media sources found',
      };
      expect(
        iiifParser.getMediaInfo({ manifest: manifestVideo, canvasIndex: 2 })
      ).toEqual(expectedObject);
    });
  });

  it('getTracks() returns captions related info', () => {
    const expectedObject = [
      {
        id: 'http://localhost:3001/src/json/upc-video-subtitles-en.vtt',
        type: 'Text',
        format: 'application/webvtt',
        label: 'subtitles',
      },
    ];
    expect(iiifParser.getTracks({ manifest })).toEqual(expectedObject);
  });

  describe('getLabelValue()', () => {
    it('returns label when en tag is available', () => {
      const label = {
        en: ['Track 4. Schwungvoll'],
      };
      expect(iiifParser.getLabelValue(label)).toEqual('Track 4. Schwungvoll');
    });
    it('returns label when none tag is available', () => {
      const label = {
        none: ['Track 2. Langsam. Schwer'],
      };
      expect(iiifParser.getLabelValue(label)).toEqual(
        'Track 2. Langsam. Schwer'
      );
    });
    it('returns lable when a string is given', () => {
      const label = 'Track 2. Langsam. Schwer';
      expect(iiifParser.getLabelValue(label)).toEqual(
        'Track 2. Langsam. Schwer'
      );
    });
    it('returns label could not be parsed message when label is not present', () => {
      const label = {};
      expect(iiifParser.getLabelValue(label)).toEqual(
        'Label could not be parsed'
      );
    });
  });

  it('getCanvasId() returns canvas uri', () => {
    const canvasUri =
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1';

    expect(
      iiifParser.getCanvasId(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374'
      )
    ).toEqual(canvasUri);
  });

  it('hasNextSection() returns whether a next section exists', () => {
    expect(iiifParser.hasNextSection({ index: 0, manifest })).toBeTruthy();
    expect(iiifParser.hasNextSection({ index: 1, manifest })).toBeFalsy();
  });

  describe('isAtTop()', () => {
    it('returns true when an item is at the top of the structure', () => {
      const item = {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/0',
        type: 'Range',
        behavior: 'top',
        label: {
          en: ['Symphony no. 3 - Mahler, Gustav'],
        },
        items: [],
      };

      expect(iiifParser.isAtTop({ item, manifest })).toBeTruthy();
    });
    it('returns false when an item is not at the top of the structure', () => {
      const item = {
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1',
        type: 'Range',
        label: {
          en: ['CD1 - Mahler, Symphony No.3'],
        },
        items: [],
      };

      expect(iiifParser.isAtTop({ item, manifest })).toBeFalsy();
    });
  });
});
