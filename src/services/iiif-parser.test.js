import manifest from '../json/test_data/mahler-symphony-audio';
import singleCanvasManifest from '../json/test_data/volleyball-for-boys';
import structurelessManifest from '../json/test_data/lunchroom-manners';
import manifestVideo from '../json/test_data/mahler-symphony-video';
import startTimeManifest from '../json/test-start-option';
import manifestWithSimpleStruct from '../json/volleyball-for-boys-video';
import * as iiifParser from './iiif-parser';

describe('iiif-parser', () => {
  it('canvasesInManifest() determines whether canvases exist in the manifest', () => {
    expect(iiifParser.canvasesInManifest(manifest)).toBeTruthy();
  });

  it('should contain a structures[] array which represents structured metadata', () => {
    expect(manifest.structures).toBeDefined();
    expect(Array.isArray(manifest.structures)).toBeTruthy();
  });

  describe('getChildCanvases()', () => {
    it('should return an array of existing child "Canvas" items if they exist for a Range', () => {
      const rangeIdWithChildCanvases =
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-3';
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
    it('logs and error for invalid id', () => {
      console.log = jest.fn();
      const invalidRangeId =
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/-1';
      iiifParser.getChildCanvases(invalidRangeId);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('error fetching range canvases');
    });
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
        id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/0',
        type: 'Range',
        behavior: 'no-nav',
        label: {
          en: ['CD1 - Mahler, Symphony No.3'],
        },
      };
      expect(
        iiifParser.filterVisibleRangeItem({ item, manifest: manifestVideo })
      ).toBeNull();
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
    describe('with a valid canvasIndex', () => {
      it('returns sources, mediaType and parsing error (if any)', () => {
        const { sources, mediaType, error } = iiifParser.getMediaInfo({
          manifest: manifestVideo,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(mediaType).toBe('video');
        expect(error).toBeNull();
        expect(sources[0]).toEqual({
          src:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/320Kbps.mp4',
          type: 'video/mp4',
          label: 'High',
        });
      });

      it('when quality is not given, resolves to auto', () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: manifestVideo,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(sources[2]).toEqual({
          src:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/320Kbps.mp4',
          label: 'auto',
          type: 'video/mp4',
          selected: true,
        });
        expect(sources[2].selected).toBeTruthy();
      });

      it("selects the first source when quality 'auto' is not present", () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: manifestVideo,
          canvasIndex: 1,
        });
        expect(sources[0].selected).toBeTruthy();
      });
    });

    it('should return an error when invalid canvas index is given', () => {
      const expectedObject = {
        error: 'Error fetching content',
      };
      expect(
        iiifParser.getMediaInfo({ manifest: manifestVideo, canvasIndex: -1 })
      ).toEqual(expectedObject);
    });

    it('should return an error when body prop is empty', () => {
      const expectedObject = { error: 'No media sources found' };
      expect(
        iiifParser.getMediaInfo({ manifest: manifest, canvasIndex: 2 })
      ).toEqual(expectedObject);
    });
  });

  describe('getTracks()', () => {
    it('returns captions related info', () => {
      const expectedObject = [
        {
          id: 'http://localhost:3001/src/json/upc-video-subtitles-en.vtt',
          type: 'Text',
          format: 'application/webvtt',
          label: 'subtitles',
        },
      ];
      expect(iiifParser.getTracks({ manifest: manifestVideo })).toEqual(
        expectedObject
      );
    });

    it('returns [] when `seeAlso` prop is not present', () => {
      expect(iiifParser.getTracks({ manifest })).toEqual([]);
    });
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

  it('getCanvasId() returns canvas ID', () => {
    const canvasUri =
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1';

    expect(
      iiifParser.getCanvasId(
        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374'
      )
    ).toEqual('1');
  });

  describe('getStartTime()', () => {
    it('returns startTime if start prop is present', () => {
      expect(iiifParser.getStartTime(startTimeManifest)).toEqual(150.5);
    });

    it('returns null if start prop is absent', () => {
      expect(iiifParser.getStartTime(manifest)).toBeNull();
    });
  });

  it('hasNextSection() returns whether a next section exists', () => {
    expect(
      iiifParser.hasNextSection({ canvasIndex: 0, manifest })
    ).toBeTruthy();
    expect(iiifParser.hasNextSection({ canvasIndex: 2, manifest })).toBeFalsy();
  });

  describe('getNextItem()', () => {
    describe('when next section does not exist', () => {
      it('retuns the first item in structure', () => {
        const expected = {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-1',
          type: 'Range',
          label: {
            en: ['Track 1. II. Tempo di Menuetto'],
          },
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566',
              type: 'Canvas',
            },
          ],
        };
        expect(iiifParser.getNextItem({ canvasIndex: 0, manifest })).toEqual(
          expected
        );
      });
    });
    describe('when next section exists', () => {
      it('returns nothing', () => {
        expect(
          iiifParser.getNextItem({
            canvasIndex: 0,
            manifest: singleCanvasManifest,
          })
        ).toBeNull();
      });
    });
  });

  it('getItemId()', () => {
    const item = {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    };
    expect(iiifParser.getItemId(item)).toEqual(
      'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/2#t=0,566'
    );
  });

  describe('getSegmentMap()', () => {
    it('returns list of media fragments when structure is defined', () => {
      const segmentMap = iiifParser.getSegmentMap({ manifest, canvasIndex: 0 });
      expect(segmentMap).toHaveLength(7);
      expect(segmentMap[0]['label']).toEqual({
        en: ['Track 1. I. Kraftig'],
      });
    });

    it('returns media fragment when structure is not nested', () => {
      const segmentMap = iiifParser.getSegmentMap({
        manifest: manifestWithSimpleStruct,
        canvasIndex: 0,
      });
      expect(segmentMap).toHaveLength(1);
      expect(segmentMap[0]['label']).toEqual({ en: ['Volleyball for Boys'] });
    });

    it('returns [] when structure is not present', () => {
      expect(
        iiifParser.getSegmentMap({
          manifest: structurelessManifest,
          canvasIndex: 0,
        })
      ).toEqual([]);
    });
  });
});
