import manifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';
import volleyballManifest from '@TestData/volleyball-for-boys';
import lunchroomManifest from '@TestData/lunchroom-manners';
import manifestWoStructure from '@TestData/transcript-canvas';
import singleSrcManifest from '@TestData/transcript-multiple-canvas';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import * as iiifParser from './iiif-parser';

describe('iiif-parser', () => {
  describe('canvasesInManifest()', () => {
    it('returns a list canvases in the manifest', () => {
      const canvases = iiifParser.canvasesInManifest(lunchroomManifest);
      expect(canvases).toHaveLength(2);
    });

    it('returns each canvas is empty or not', () => {
      const canvases = iiifParser.canvasesInManifest(manifest);
      expect(canvases).toHaveLength(2);
      expect(canvases[0]).toHaveProperty('canvasId');
      expect(canvases[0].canvasId).toEqual('https://example.com/sample/transcript-annotation/canvas/1');
      expect(canvases[0]).toHaveProperty('isEmpty');
      expect(canvases[0].isEmpty).toBeFalsy();
      expect(canvases[1].canvasId).toEqual('https://example.com/sample/transcript-annotation/canvas/2');
      expect(canvases[1].isEmpty).toBeTruthy();
    });
  });

  describe('getChildCanvases()', () => {
    it('should return an array of existing child "Canvas" items if they exist for a Range', () => {
      const rangeIdWithChildCanvases =
        'https://example.com/sample/transcript-annotation/range/1-3';
      const rangeIdWithoutChildCanvases =
        'https://example.com/sample/transcript-annotation/range/1';

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
        'https://example.com/sample/transcript-annotation/range/-1';
      iiifParser.getChildCanvases(invalidRangeId);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Error fetching range canvases');
    });
  });

  describe('filterVisibleRangeItem()', () => {
    it('return item when behavior is not equal to no-nav', () => {
      const item = {
        id: 'https://example.com/sample/transcript-annotation/range/2',
        type: 'Range',
        label: {
          en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
        },
        items: [
          {
            id: 'https://example.com/sample/transcript-annotation/range/2-1',
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

      if ('sets default source when not multisourced', () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: singleSrcManifest,
          canvasIndex: 0
        });
        expect(sources).toHaveLength(1);
        expect(sources[0].src).toEqual('https://example.com/sample/high/media.mp4');
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

    describe('resolves tracks', () => {
      describe('in supplementing annotations', () => {
        it('with generic ids', () => {
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

        it('with captions in the id', () => { // Avalon-specific
          const expectedObject = {
            src: 'https://example.com/manifest/lunchroom_manners/captions',
            kind: 'Text',
            type: 'text/vtt',
            label: 'Captions in WebVTT format',
            value: '',
          };
          const { tracks } = iiifParser.getMediaInfo({
            manifest: lunchroomManifest,
            canvasIndex: 1,
          });
          expect(tracks).toHaveLength(1);
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
          id: 'https://example.com/sample/transcript-annotation/canvas/2#t=0,566',
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
      id: 'https://example.com/sample/transcript-annotation/range/2-1',
      type: 'Range',
      label: {
        en: ['Track 1. II. Tempo di Menuetto'],
      },
      items: [
        {
          id: 'https://example.com/sample/transcript-annotation/canvas/2#t=0,566',
          type: 'Canvas',
        },
      ],
    };
    expect(iiifParser.getItemId(item)).toEqual(
      'https://example.com/sample/transcript-annotation/canvas/2#t=0,566'
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
      expect(files.manifest.length).toBe(1);
      expect(files.manifest[0].label).toEqual('Transcript file (.vtt)');
      expect(files.manifest[0].filename).toEqual('Transcript file');
    });

    it('with `rendering` prop only at canvas level', () => {
      const files = iiifParser.getRenderingFiles(manifest, 0);
      expect(files.canvas.length).toBe(2);
      expect(files.canvas[0].label).toBe('Section 1');
      expect(files.canvas[0].files.length).toBe(1);
      expect(files.canvas[0].files[0].label).toEqual('Poster image (.jpeg)');
      expect(files.canvas[0].files[0].filename).toEqual('Poster image');
    });

    it('with `rendering` prop at both canvas and manifest level', () => {
      const files = iiifParser.getRenderingFiles(volleyballManifest, 0);
      expect(files.manifest.length).toBe(1);
      expect(files.canvas.length).toBe(1);
      expect(files.manifest[0].label).toEqual('Transcript file (.txt)');
      expect(files.manifest[0].filename).toEqual('Transcript file');
      expect(files.canvas[0].label).toBe('Section 1');
      expect(files.canvas[0].files.length).toBe(1);
      expect(files.canvas[0].files[0].label).toEqual('Poster image (.jpeg)');
      expect(files.canvas[0].files[0].filename).toEqual('Poster image');
    });
  });

  describe('getSupplementingFiles()', () => {
    it('with `TextualBody` supplementing annotations', () => {
      const files = iiifParser.getSupplementingFiles(manifest);
      expect(files.length).toBe(2);
      expect(files[0].label).toBe('Section 1');
      expect(files[0].files.length).toBe(0);
      expect(files[1].label).toBe('Section 2');
      expect(files[1].files.length).toBe(0);
    });

    it('with supplementing annotations', () => {
      const files = iiifParser.getSupplementingFiles(lunchroomManifest);
      expect(files.length).toBe(2);
      expect(files[0].label).toBe('Lunchroom Manners');
      expect(files[0].files.length).toBe(1);
      expect(files[0].files[0].label).toEqual('Captions in WebVTT format (.vtt)');
      expect(files[0].files[0].filename).toEqual('Captions in WebVTT format');
      expect(files[1].label).toBe('Section 2');
      expect(files[1].files.length).toBe(2);
    });
  });

  describe('parseMetadata()', () => {
    it('manifest with metadata property returns a list of key, value pairs', () => {
      const metadata = iiifParser.parseMetadata(lunchroomManifest);
      expect(metadata.length).toBeGreaterThan(0);
      expect(metadata[0]).toEqual({ label: "Title", value: "This is the title of the item!" });
    });

    it('manifest without metadata property returns []', () => {
      const metadata = iiifParser.parseMetadata(volleyballManifest);
      expect(metadata).toEqual([]);
    });

    it('replaces new line characters with <br/> tags', () => {
      const metadata = iiifParser.parseMetadata(lunchroomManifest);
      expect(metadata[3]).toEqual({
        label: "Summary",
        value: "This is the summary field. It may include a summary of the item.<br /><br />Does a  pre  tag exist here?<br /><br /><b>How about some bold?</b><br /><br /><i>Or italics?</i>"
      });
    });

    it('sanitize HTML in value for each metadata item', () => {
      const metadata = iiifParser.parseMetadata(lunchroomManifest);
      expect(metadata[0]).toEqual({
        label: "Title",
        value: "This is the title of the item!"
      });
      expect(metadata[2]).toEqual({
        label: "Main contributors",
        value: "John Doe<br />The Avalon Media System Team"
      });
      expect(metadata[5]).toEqual({
        label: "Collection",
        value: "<a href=\"https://example.com/collections/fb4948403\">Testing</a>"
      });
      expect(metadata[6]).toEqual({
        label: "Related Items",
        value: "<a href=\"https://iu.edu\">IU</a><br /><a href=\"https://avalonmediasystem.org\">Avalon Website</a>"
      });
      expect(metadata[7]).toEqual({
        label: "Notes", value: "<a></a>"
      });
    });
  });

<<<<<<< HEAD
  describe('parseAutoAdvance()', () => {
    describe('with manifest without auto-advance behavior', () => {
      it('should return true', () => {
        expect(iiifParser.parseAutoAdvance(manifest)).toBe(false);
      });
    });

    describe('with manifest with auto-advance behavior', () => {
      it('should return true', () => {
        expect(iiifParser.parseAutoAdvance(autoAdvanceManifest)).toBe(true);
      });
    });
  });

  describe('getIsPlaylist()', () => {
    it('returns false for non-playlist manifest', () => {
      const isPlaylist = iiifParser.getIsPlaylist(manifest);
      expect(isPlaylist).toBeFalsy();
    });

    it('returns true for playlist manifest', () => {
      const isPlaylist = iiifParser.getIsPlaylist(playlistManifest);
      expect(isPlaylist).toBeTruthy();
    });

    it('returns false for unrecognized input', () => {
      const originalError = console.error;
      console.error = jest.fn();

      const isPlaylist = iiifParser.getIsPlaylist(undefined);
      expect(isPlaylist).toBeFalsy();
      expect(console.error).toHaveBeenCalledTimes(1);

      console.error = originalError;
    });
  });

  describe('parsePlaylistAnnotations()', () => {
    it('returns empty array for a canvas without markers', () => {
      const { markers, error } = iiifParser.parsePlaylistAnnotations(manifest, 0);
      expect(markers).toHaveLength(0);
      expect(error).toEqual('No markers were found in the Canvas');
    });

    it('returns markers information for a canvas with markers', () => {
      const { markers, error } = iiifParser.parsePlaylistAnnotations(playlistManifest, 1);

      expect(markers).toHaveLength(2);
      expect(error).toEqual('');

      expect(markers[0]).toEqual({
        time: 2.836,
        timeStr: '00:00:02.836',
        value: 'Marker 1',
        id: 'http://example.com/manifests/playlist/canvas/2/marker/3',
        canvasId: 'http://example.com/manifests/playlist/canvas/2'
      });
=======
  describe('inaccessibleItemMessage()', () => {
    it('returns text under placeholderCanvas', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(manifest, 1);
      expect(itemMessage).toEqual('You do not have permission to playback this item.');
    });

    it('returns hard coded text when placeholderCanvas has no text', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(lunchroomManifest, 0);
      expect(itemMessage).toEqual('No associated media source(s) in the Canvas');
    });

    if ('returns null when no placeholderCanvas is in the Canvas', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(singleSrcManifest, 0);
      expect(itemMessage).toBeNull();
>>>>>>> 9aafd36 (Fix broken tests)
    });
  });

  describe('inaccessibleItemMessage()', () => {
    it('returns text under placeholderCanvas', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(manifest, 1);
      expect(itemMessage).toEqual('You do not have permission to playback this item.');
    });

    it('returns hard coded text when placeholderCanvas has no text', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(lunchroomManifest, 0);
      expect(itemMessage).toEqual('No associated media source(s) in the Canvas');
    });

    if ('returns null when no placeholderCanvas is in the Canvas', () => {
      const itemMessage = iiifParser.inaccessibleItemMessage(singleSrcManifest, 0);
      expect(itemMessage).toBeNull();
    });
  });
});
