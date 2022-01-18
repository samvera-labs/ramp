import sampleManifest1 from '@Json/test_data/transcript-canvas';
import sampleManifest2 from '@Json/test_data/transcript-manifest';
import sampleManifest3 from '@Json/test_data/transcript-multiple-canvas';
import * as iiifParser from './iiif-parser';

describe('iiif-parser', () => {
  it('canvasesInManifest() determines whether canvases exist in the manifest', () => {
    expect(iiifParser.canvasesInManifest(sampleManifest2)).toBeTruthy();
  });

  it('should contain a structures[] array which represents structured metadata', () => {
    expect(sampleManifest1.structures).toBeDefined();
    expect(Array.isArray(sampleManifest1.structures)).toBeTruthy();
  });

  describe('getChildCanvases()', () => {
    it('should return an array of existing child "Canvas" items if they exist for a Range', () => {
      const rangeIdWithChildCanvases =
        'https://example.com/sample/transcript-multiple-canvas/range/1-1';
      const rangeIdWithoutChildCanvases =
        'https://example.com/sample/transcript-multiple-canvas/range/1';

      expect(
        iiifParser.getChildCanvases({
          rangeId: rangeIdWithChildCanvases,
          manifest: sampleManifest3,
        })
      ).toHaveLength(1);
      expect(
        iiifParser.getChildCanvases({
          rangeId: rangeIdWithoutChildCanvases,
          manifest: sampleManifest3,
        })
      ).toHaveLength(0);
    });

    it('logs and error for invalid id', () => {
      console.log = jest.fn();
      const invalidRangeId =
        'https://example.com/sample/transcript-manifest/range/-1';
      iiifParser.getChildCanvases({
        rangeId: invalidRangeId,
        manifest: sampleManifest3,
      });
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('error fetching range canvases');
    });
  });

  describe('filterVisibleRangeItem()', () => {
    it('return item when behavior is not equal to no-nav', () => {
      const item = {
        id: 'https://example.com/sample/transcript-multiple-canvas/range/1',
        type: 'Range',
        label: { en: ['First title'] },
        items: [
          {
            type: 'Range',
            id: 'https://example.com/sample/transcript-multiple-canvas/range/1-1',
            label: { en: ['First item - 1'] },
            items: [
              {
                type: 'Canvas',
                id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=0,572',
              },
            ],
          },
        ],
      };
      expect(
        iiifParser.filterVisibleRangeItem({ item, manifest: sampleManifest3 })
      ).toEqual(item);
    });

    it('return null when behavior is equal to no-nav', () => {
      const item = {
        type: 'Range',
        id: 'https://example.com/sample/transcript-canvas/range/0',
        behavior: 'no-nav',
        label: { en: ['Transcript Canvas'] },
      };
      expect(
        iiifParser.filterVisibleRangeItem({
          item,
          manifest: sampleManifest1,
        })
      ).toBeNull();
    });
  });

  describe('getMediaFragment()', () => {
    it('returns a start/stop helper object from a uri', () => {
      const expectedObject = { start: '374', stop: '525' };
      expect(
        iiifParser.getMediaFragment(
          'https://example.com/sample/transcript-manifest/canvas/1#t=374,525'
        )
      ).toEqual(expectedObject);

      const noTime = iiifParser.getMediaFragment(
        'https://example.com/sample/transcript-manifest/range/1-1'
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
          manifest: sampleManifest2,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(mediaType).toBe('video');
        expect(error).toBeNull();
        expect(sources[0]).toEqual({
          src: 'https://example.com/sample/transcript-manifest/high/media.mp4',
          type: 'video/mp4',
          label: 'High',
        });
      });

      it('resolves quality to auto, when not given', () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: sampleManifest2,
          canvasIndex: 0,
        });
        expect(sources).toHaveLength(3);
        expect(sources[2]).toEqual({
          src: 'https://example.com/sample/transcript-manifest/low/media.mp4',
          label: 'auto',
          type: 'video/mp4',
          selected: true,
        });
        expect(sources[2].selected).toBeTruthy();
      });

      it("selects the first source when quality 'auto' is not present", () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: sampleManifest1,
          canvasIndex: 0,
        });
        expect(sources[0].selected).toBeTruthy();
      });
    });

    it('returns an error when invalid canvas index is given', () => {
      const expectedObject = {
        error: 'Error fetching content',
      };
      expect(
        iiifParser.getMediaInfo({
          manifest: sampleManifest1,
          canvasIndex: -1,
        })
      ).toEqual(expectedObject);
    });

    it('returns an error when body `prop` is empty', () => {
      const expectedObject = { error: 'No media sources found' };
      expect(
        iiifParser.getMediaInfo({ manifest: sampleManifest1, canvasIndex: 1 })
      ).toEqual(expectedObject);
    });

    it('returns tracks when given', () => {
      const expectedObject = {
        src: 'https://example.com/sample/transcript-canvas/subtitles.vtt',
        kind: 'text/vtt',
        label: 'Captions in WebVTT format',
        srclang: 'en',
      };
      const { tracks } = iiifParser.getMediaInfo({
        manifest: sampleManifest1,
        canvasIndex: 0,
      });
      expect(tracks[0]).toEqual(expectedObject);
    });

    it('returns [] for tracks when not given', () => {
      const { tracks } = iiifParser.getMediaInfo({
        manifest: sampleManifest2,
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
    expect(
      iiifParser.getCanvasId(
        'https://example.com/sample/transcript-manifest/canvas/1#t=0,374'
      )
    ).toEqual('1');
  });

  it('hasNextSection() returns whether a next section exists', () => {
    expect(
      iiifParser.hasNextSection({ canvasIndex: 0, manifest: sampleManifest3 })
    ).toBeTruthy();
    expect(
      iiifParser.hasNextSection({ canvasIndex: 0, manifest: sampleManifest2 })
    ).toBeFalsy();
  });

  describe('getNextItem()', () => {
    describe('when next section does not exist', () => {
      it('retuns the first item in structure', () => {
        const expected = {
          type: 'Range',
          id: 'https://example.com/sample/transcript-multiple-canvas/range/2-1',
          label: { en: ['First item - 2'] },
          items: [
            {
              type: 'Canvas',
              id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2#t=0,210',
            },
          ],
        };
        expect(
          iiifParser.getNextItem({ canvasIndex: 0, manifest: sampleManifest3 })
        ).toEqual(expected);
      });
    });

    describe('when next section exists', () => {
      it('returns nothing', () => {
        expect(
          iiifParser.getNextItem({
            canvasIndex: 0,
            manifest: sampleManifest2,
          })
        ).toBeNull();
      });
    });
  });

  it('getItemId()', () => {
    const item = {
      id: 'https://example.com/sample/transcript-canvas/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id: 'https://example.com/sample/transcript-canvas/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    };
    expect(iiifParser.getItemId(item)).toEqual(
      'https://example.com/sample/transcript-canvas/canvas/2#t=0,566'
    );
  });

  describe('getSegmentMap()', () => {
    it('returns list of media fragments when structure is defined', () => {
      const segmentMap = iiifParser.getSegmentMap({
        manifest: sampleManifest3,
        canvasIndex: 0,
      });
      expect(segmentMap).toHaveLength(2);
      expect(segmentMap[0]['label']).toEqual({
        en: ['First item - 1'],
      });
    });

    it('returns media fragment when structure is not nested', () => {
      const segmentMap = iiifParser.getSegmentMap({
        manifest: sampleManifest1,
        canvasIndex: 0,
      });
      expect(segmentMap).toHaveLength(1);
      expect(segmentMap[0]['label']).toEqual({ en: ['First item'] });
      expect(segmentMap[0]['id']).toEqual(
        'https://example.com/sample/transcript-canvas/range/1'
      );
      expect(segmentMap[0]['items']).toHaveLength(1);
    });

    it('returns [] when structure is not present', () => {
      expect(
        iiifParser.getSegmentMap({
          manifest: sampleManifest2,
          canvasIndex: 0,
        })
      ).toEqual([]);
    });
  });

  describe('getPoster()', () => {
    it('returns url for video manifest', () => {
      const posterUrl = iiifParser.getPoster(sampleManifest3);
      expect(posterUrl).toEqual(
        'https://example.com/sample/thumbnail/poster.jpg'
      );
    });

    it('returns null for audio manifest', () => {
      const posterUrl = iiifParser.getPoster(sampleManifest2);
      expect(posterUrl).toBeNull();
    });
  });

  describe('getCustomStart()', () => {
    describe('when type="Canvas"', () => {
      it('returns custom start canvas', () => {
        const customStart = iiifParser.getCustomStart(sampleManifest3);
        expect(customStart.type).toEqual('C');
        expect(customStart.time).toEqual(0);
        expect(customStart.canvas).toEqual(1);
      });
    });

    describe('when type="SpecificResource"', () => {
      it('returns custom canvas and start time', () => {
        const customStart = iiifParser.getCustomStart(sampleManifest1);
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(120.5);
        expect(customStart.canvas).toEqual(1);
      });

      it('returns custom start time', () => {
        const customStart = iiifParser.getCustomStart(sampleManifest2);
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(120.5);
        expect(customStart.canvas).toEqual(0);
      });
    });
  });
});
