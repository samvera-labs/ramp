import manifest from '../json/test_data/transcript-annotation';
import volleyballManifest from '../json/test_data/volleyball-for-boys';
import lunchroomManifest from '../json/test_data/lunchroom-manners';
import manifestWoStructure from '../json/test_data/transcript-canvas';
import * as iiifParser from './iiif-parser';

describe('iiif-parser', () => {
  it('canvasesInManifest() determines whether canvases exist in the manifest', () => {
    expect(iiifParser.canvasesInManifest(manifest)).toBeTruthy();
  });

  describe('getChildCanvases()', () => {
    it('should return an array of existing child "Canvas" items if they exist for a Range', () => {
      const rangeIdWithChildCanvases =
        'http://example.com/sample/transcript-annotation/range/1-3';
      const rangeIdWithoutChildCanvases =
        'http://example.com/sample/transcript-annotation/range/1';

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
        'http://example.com/sample/transcript-annotation/range/-1';
      iiifParser.getChildCanvases(invalidRangeId);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Error fetching range canvases');
    });
  });

  describe('filterVisibleRangeItem()', () => {
    it('return item when behavior is not equal to no-nav', () => {
      const item = {
        id: 'http://example.com/sample/transcript-annotation/range/2',
        type: 'Range',
        label: {
          en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
        },
        items: [
          {
            id: 'http://example.com/sample/transcript-annotation/range/2-1',
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
        id: 'http://example.com/volleyball-for-boys/manifest/range/1',
        type: 'Range',
        behavior: 'no-nav',
        label: {
          en: ['Volleyball for Boys'],
        },
      };
      expect(
        iiifParser.filterVisibleRangeItem({
          item,
          manifest: volleyballManifest,
        })
      ).toBeNull();
    });
  });

  describe('getMediaInfo()', () => {
    describe('with a valid canvasIndex', () => {
      it('returns sources, mediaType and parsing error (if any)', () => {
        const { sources, mediaType, error } = iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(mediaType).toBe('video');
        expect(error).toBeNull();
        expect(sources[0]).toEqual({
          src: 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4',
          type: 'video/mp4',
          label: 'High',
          kind: 'Video',
          value: '',
        });
      });

      it('resolves quality to auto, when not given', () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(sources[2]).toEqual({
          src: 'https://example.com/manifest/low/lunchroom_manners_256kb.mp4',
          label: 'auto',
          type: 'video/mp4',
          selected: true,
          kind: 'Video',
          value: '',
        });
        expect(sources[2].selected).toBeTruthy();
      });

      it("selects the first source when quality 'auto' is not present", () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: 1,
        });
        expect(sources[0].selected).toBeTruthy();
      });
    });

    it('returns an error when invalid canvas index is given', () => {
      expect(
        iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: -1,
        })
      ).toEqual({ error: 'Error fetching content' });
    });

    it('returns an error when body `prop` is empty', () => {
      expect(
        iiifParser.getMediaInfo({ manifest: manifest, canvasIndex: 1 })
      ).toHaveProperty('error', 'No resources found');
    });

    it('returns tracks when given', () => {
      const expectedObject = {
        src: 'https://example.com/manifest/lunchroom_manners.vtt',
        kind: 'Text',
        type: 'text/vtt',
        label: 'Captions in WebVTT format',
        value: '',
      };
      const { tracks } = iiifParser.getMediaInfo({
        manifest: lunchroomManifest,
        canvasIndex: 0,
      });
      expect(tracks[0]).toEqual(expectedObject);
    });

    it('returns [] for tracks when not given', () => {
      const { tracks } = iiifParser.getMediaInfo({
        manifest: volleyballManifest,
        canvasIndex: 0,
      });
      expect(tracks).toEqual([]);
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
      'http://example.com/sample/transcript-annotation/canvas/1';

    expect(
      iiifParser.getCanvasId(
        'http://example.com/sample/transcript-annotation/canvas/1#t=0,374'
      )
    ).toEqual('http://example.com/sample/transcript-annotation/canvas/1');
  });

  it('hasNextSection() returns whether a next section exists', () => {
    expect(
      iiifParser.hasNextSection({ canvasIndex: 0, manifest: lunchroomManifest })
    ).toBeTruthy();
    expect(iiifParser.hasNextSection({ canvasIndex: 2, manifest: lunchroomManifest })).toBeFalsy();
  });

  describe('getNextItem()', () => {
    describe('when next section does not exist', () => {
      it('retuns the first item in structure', () => {
        const expected = {
          id: 'http://example.com/sample/transcript-annotation/canvas/2#t=0,566',
          label: 'Track 1. II. Tempo di Menuetto',
          isTitleTimespan: true
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
            manifest: volleyballManifest,
          })
        ).toBeNull();
      });
    });
  });

  it('getItemId()', () => {
    const item = {
      id: 'http://example.com/sample/transcript-annotation/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    };
    expect(iiifParser.getItemId(item)).toEqual(
      'http://example.com/sample/transcript-annotation/canvas/2#t=0,566'
    );
  });

  describe('getSegmentMap()', () => {
    it('returns list of media fragments when structure is defined', () => {
      const segmentMap = iiifParser.getSegmentMap({ manifest });
      expect(segmentMap).toHaveLength(16);
      expect(segmentMap[0]['label']).toEqual('Track 1. I. Kraftig');
    });

    it('returns media fragment when structure is not nested', () => {
      const segmentMap = iiifParser.getSegmentMap({
        manifest: volleyballManifest
      });
      expect(segmentMap).toHaveLength(1);
      expect(segmentMap[0]['label']).toEqual('Volleyball for Boys');
    });

    it('returns [] when structure is not present', () => {
      expect(
        iiifParser.getSegmentMap({
          manifest: manifestWoStructure,
        })
      ).toEqual([]);
    });
  });

  describe('getPoster()', () => {
    it('returns url for video manifest', () => {
      const posterUrl = iiifParser.getPoster(lunchroomManifest, 0);
      expect(posterUrl).toEqual(
        'https://example.com/manifest/poster/lunchroom_manners_poster.jpg'
      );
    });

    it('returns null for audio manifest', () => {
      const posterUrl = iiifParser.getPoster(manifest, 0);
      expect(posterUrl).toBeNull();
    });
  });

  describe('getCustomStart()', () => {
    describe('when type="Canvas"', () => {
      it('returns custom start canvas', () => {
        const customStart = iiifParser.getCustomStart(manifest);
        expect(customStart.type).toEqual('C');
        expect(customStart.time).toEqual(0);
        expect(customStart.canvas).toEqual(0);
      });
    });

    describe('when type="SpecificResource"', () => {
      it('returns custom canvas and start time', () => {
        const customStart = iiifParser.getCustomStart(lunchroomManifest);
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(120.5);
        expect(customStart.canvas).toEqual(1);
      });

      it('returns custom start time', () => {
        const customStart = iiifParser.getCustomStart(volleyballManifest);
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(120.5);
        expect(customStart.canvas).toEqual(0);
      });
    });
  });

  describe('getRenderingFiles()', () => {
    it('with `rendering` prop only at manifest level', () => {
      const files = iiifParser.getRenderingFiles(lunchroomManifest, 0);
      expect(files.length).toBe(1);
      expect(files[0].label).toEqual('Transcript file (.vtt)');
      expect(files[0].filename).toEqual('Transcript file');
    });

    it('with `rendering` prop only at canvas level', () => {
      const files = iiifParser.getRenderingFiles(manifest, 0);
      expect(files.length).toBe(1);
      expect(files[0].label).toEqual('Poster image (.jpeg)');
      expect(files[0].filename).toEqual('Poster image');
    });

    it('with `rendering` prop at both canvas and manifest level', () => {
      const files = iiifParser.getRenderingFiles(volleyballManifest, 0);
      expect(files.length).toBe(2);
      expect(files[0].label).toEqual('Transcript file (.txt)');
      expect(files[0].filename).toEqual('Transcript file');
    });
  });
});
