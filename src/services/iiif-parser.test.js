import manifest from '@TestData/transcript-annotation';
import volleyballManifest from '@TestData/volleyball-for-boys';
import lunchroomManifest from '@TestData/lunchroom-manners';
import manifestWoStructure from '@TestData/transcript-canvas';
import singleSrcManifest from '@TestData/transcript-multiple-canvas';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import playlistManifest from '@TestData/playlist';
import emptyManifest from '@TestData/empty-manifest';
import singleCanvasManifest from '@TestData/single-canvas';
import audiannotateTest from '@TestData/audiannotate-test';
import * as iiifParser from './iiif-parser';
import * as util from './utility-helpers';

describe('iiif-parser', () => {
  describe('canvasesInManifest()', () => {
    it('returns a list canvases in the manifest', () => {
      const canvases = iiifParser.canvasesInManifest(lunchroomManifest);
      expect(canvases).toHaveLength(2);
    });

    it('returns information related to each canvas', () => {
      const canvases = iiifParser.canvasesInManifest(manifest);
      expect(canvases).toHaveLength(2);
      expect(canvases[0].canvasId).toEqual('https://example.com/sample/transcript-annotation/canvas/1');
      expect(canvases[0].duration).toEqual(572.034);
      expect(canvases[0].range).toEqual({ start: 0, end: 572.034 });
      expect(canvases[0].isEmpty).toBeFalsy();
      expect(canvases[0].summary).toBeUndefined();
      expect(canvases[0].homepage).toEqual('');
      expect(canvases[0].searchService).toEqual('http://example.com/sample/transcript-annotation/canvas/1/search');
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

    it('returns empty list for empty Manifest', () => {
      const canvases = iiifParser.canvasesInManifest(emptyManifest);
      expect(canvases).toHaveLength(0);
    });

    it('throws an error when items list in not present in the Manifest', () => {
      // Mock console.error function
      const originalError = console.error;
      console.error = jest.fn();
      const manifestWoItems = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          'http://iiif.io/api/presentation/3/context.json',
        ],
        type: 'Manifest',
        id: 'https://example.com/manifest/empty-manifest',
        label: {
          en: ['No items Manifest'],
        },
        metadata: [],
      };
      expect(() => { iiifParser.canvasesInManifest(manifestWoItems); })
        .toThrowError('Error encountered. Please check your Manifest.');
      // Re-set console.error to original function
      console.error = originalError;
    });

    describe('with a playlist manifest', () => {
      it('returns summary for all canvases', () => {
        const canvases = iiifParser.canvasesInManifest(playlistManifest);
        expect(canvases).toHaveLength(6);
        // Empty Canvas => for inaccessible items
        expect(canvases[0]).toHaveProperty('summary');
        expect(canvases[0].summary).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua');
        // Canvas with items
        expect(canvases[2]).toHaveProperty('summary');
        expect(canvases[2].summary).toEqual('Clip from Volleyball for boys');
        // Returns undefined when summary is not present in the Canvas
        expect(canvases[3]).toHaveProperty('summary');
        expect(canvases[3].summary).toEqual(undefined);
      });

      test('returns positional homepage for all canvases', () => {
        const canvases = iiifParser.canvasesInManifest(playlistManifest);
        expect(canvases).toHaveLength(6);
        // Empty Canvas => for inaccessible items
        expect(canvases[0]).toHaveProperty('homepage');
        expect(canvases[0].homepage).toEqual('https://example.com/playlists/1?position=1');
        // Canvas with items
        expect(canvases[2]).toHaveProperty('homepage');
        expect(canvases[2].homepage).toEqual('https://example.com/playlists/1?position=3');
        // Returns undefined when summary is not present in the Canvas
        expect(canvases[3]).toHaveProperty('homepage');
        expect(canvases[3].homepage).toEqual('https://example.com/playlists/1?position=4');
      });

      it('returns information related to each Canvas', () => {
        const canvases = iiifParser.canvasesInManifest(playlistManifest);
        expect(canvases).toHaveLength(6);
        // For an inaccessible item
        expect(canvases[0].canvasId).toEqual('http://example.com/playlists/1/canvas/1');
        expect(canvases[0].duration).toBeNaN();
        expect(canvases[0].range).toEqual({ start: 0, end: NaN });
        expect(canvases[0].isEmpty).toBeTruthy();
        expect(canvases[0].summary).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua');
        expect(canvases[0].homepage).toEqual('https://example.com/playlists/1?position=1');
        expect(canvases[0].searchService).toBeNull();
        // For a clipped item
        expect(canvases[4].canvasId).toEqual('http://example.com/playlists/1/canvas/5');
        expect(canvases[4].duration).toEqual(662.037);
        expect(canvases[4].range).toEqual({ start: 35, end: 40 });
        expect(canvases[4].isEmpty).toBeFalsy();
        expect(canvases[4].summary).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod \
          tempor incididunt ut labore et dolore magna aliqua');
        expect(canvases[4].homepage).toEqual('https://example.com/playlists/1?position=5');
        expect(canvases[4].searchService).toBeNull();
      });
    });
  });

  describe('getMediaInfo()', () => {
    beforeEach(() => {
      // Mock canPlayType to always return 'maybe' (truthy value)
      HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'maybe');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
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
          key: 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4',
          type: 'video/mp4',
          label: 'High',
          kind: 'Video',
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
          key: 'https://example.com/manifest/low/lunchroom_manners_256kb.mp4',
          label: 'auto',
          type: 'video/mp4',
          selected: true,
          kind: 'Video',
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

      it('sets default source when not multisourced', () => {
        const originalWarn = console.warn;
        console.warn = jest.fn();
        const { sources } = iiifParser.getMediaInfo({
          manifest: singleSrcManifest,
          canvasIndex: 0
        });
        expect(sources).toHaveLength(1);
        expect(sources[0].src).toEqual('https://example.com/sample/high/media.mp4');
        console.warn = originalWarn;
      });

      it("appends start time to src when there is a manifest start", () => {
        const { sources } = iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: 1,
          startTime: 120.5
        });
        expect(sources[0].src).toEqual('https://example.com/manifest/high/lunchroom_manners_1024kb.mp4#t=120.5,660');
      });
    });

    it('returns an error when invalid canvas index is given', () => {
      expect(
        iiifParser.getMediaInfo({
          manifest: lunchroomManifest,
          canvasIndex: -1,
        })
      ).toEqual({
        error: 'Error fetching content',
        sources: [],
        tracks: [],
        canvasTargets: []
      });
    });

    it('returns an error when given Manifest has no items (canvases)', () => {
      expect(
        iiifParser.getMediaInfo({
          manifest: emptyManifest,
          canvasIndex: 0
        })
      ).toEqual({
        sources: [],
        tracks: [],
        poster: 'No media resource(s). Please check your Manifest.',
        canvasTargets: [],
      });
    });

    it('returns an error when body `prop` is empty', () => {
      expect(
        iiifParser.getMediaInfo({ manifest: manifest, canvasIndex: 1 })
      ).toHaveProperty('error', 'No resources found in Canvas');
    });

    describe('resolves tracks', () => {
      describe('in supplementing annotations', () => {
        it('with generic ids', () => {
          const expectedObject = {
            src: 'https://example.com/manifest/lunchroom_manners.vtt',
            key: 'https://example.com/manifest/lunchroom_manners.vtt',
            kind: 'subtitles',
            type: 'text/vtt',
            srclang: 'en',
            label: 'Captions in WebVTT format',
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
            key: 'https://example.com/manifest/lunchroom_manners/captions',
            kind: 'subtitles',
            type: 'text/vtt',
            srclang: 'en',
            label: 'Captions in WebVTT format',
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
    expect(
      iiifParser.getCanvasId(
        'http://example.com/sample/transcript-annotation/canvas/1#t=0,374'
      )
    ).toEqual('http://example.com/sample/transcript-annotation/canvas/1');
  });

  describe('getPlaceholderCanvas()', () => {
    let originalError;
    beforeAll(() => {
      // Mock console.error function
      originalError = console.error;
      console.error = jest.fn();
    });
    afterAll(() => {
      console.error = originalError;
    });
    it('returns url for video manifest', () => {
      const posterUrl = iiifParser.getPlaceholderCanvas(lunchroomManifest.items[0], true);
      expect(posterUrl).toEqual(
        'https://example.com/manifest/poster/lunchroom_manners_poster.jpg'
      );
    });

    it('returns null for audio manifest', () => {
      const posterUrl = iiifParser.getPlaceholderCanvas(manifest.items[0], true);
      expect(posterUrl).toBeNull();
    });

    it('returns placeholderCanvas text and sets timer to given duration', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(manifest.items[1]);
      expect(itemMessage).toEqual('You do not have permission to playback this item. \nPlease contact support to report this error: <a href="mailto:admin-list@example.com">admin-list@example.com</a>.\n');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(4000);
    });

    it('returns placeholderCanvas text and sets timer to default when duration is not defined', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(playlistManifest.items[0]);
      expect(itemMessage).toEqual('You do not have permission to playback this item.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('returns hard coded text when placeholderCanvas has no text and sets timer to default', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(lunchroomManifest.items[0]);
      expect(itemMessage).toEqual('This item cannot be played.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('returns default message when no placeholderCanvas is in the Canvas and sets timer to default', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(singleSrcManifest.items[0]);
      expect(console.error).toBeCalledTimes(1);
      expect(itemMessage).toEqual('This item cannot be played.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });
  });

  describe('getCustomStart()', () => {
    let originalWarn;
    beforeAll(() => {
      // Mock console.warn function
      originalWarn = console.warn;
      console.warn = jest.fn();
    });
    afterAll(() => { console.warn = originalWarn; });

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

    describe('with user props', () => {
      it('startCanvasId overrides start canvas in Manifest', () => {
        const customStart = iiifParser.getCustomStart(
          manifest,
          'https://example.com/sample/transcript-annotation/canvas/2'
        );
        expect(customStart.type).toEqual('C');
        expect(customStart.time).toEqual(0);
        expect(customStart.canvas).toEqual(1);
      });

      it('startCanvasTime overrides start time in Manifest', () => {
        const customStart = iiifParser.getCustomStart(lunchroomManifest, undefined, 130);
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(130);
        expect(customStart.canvas).toEqual(0);
      });

      it('both startCanvasId and startCanvasTime override start prop in Manifest', () => {
        const customStart = iiifParser.getCustomStart(
          manifest,
          'https://example.com/sample/transcript-annotation/canvas/2',
          120
        );
        expect(customStart.type).toEqual('SR');
        expect(customStart.time).toEqual(120);
        expect(customStart.canvas).toEqual(1);
      });
    });

    it('returns default values when start property is not defined in Manifest', () => {
      const customStart = iiifParser.getCustomStart(manifestWoStructure);
      expect(customStart.type).toEqual('C');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
    });

    it('returns values related to given start canvas ID', () => {
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/playlists/1/canvas/3'
      );
      expect(customStart.type).toEqual('C');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(2);
    });

    it('returns values related to given start canvas time', () => {
      const customStart = iiifParser.getCustomStart(manifestWoStructure, undefined, 23);
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(23);
      expect(customStart.canvas).toEqual(0);
    });

    it('returns values related to given start canvas ID and time', () => {
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/playlists/1/canvas/4', 233
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(233);
      expect(customStart.canvas).toEqual(3);
    });

    it('returns zero as start time when given value is outside of Canvas duration', () => {
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/playlists/1/canvas/4', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(3);
      expect(console.warn).toBeCalledTimes(1);
    });

    it('returns zero as current canvas index when given ID is not in the Manifest', () => {
      console.warn = jest.fn();
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/playlists/1/canvas/33', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
      expect(console.warn).toBeCalledTimes(1);
    });

    it('return default values with empty manifest', () => {
      const customStart = iiifParser.getCustomStart(
        emptyManifest, 'http://example.com/playlists/1/canvas/33', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
      expect(console.warn).toBeCalledTimes(1);
    });
  });

  describe('getRenderingFiles()', () => {
    it('with `rendering` prop only at manifest level', () => {
      const files = iiifParser.getRenderingFiles(lunchroomManifest, 0);
      expect(files.manifest.length).toBe(1);
      expect(files.manifest[0].label).toEqual('Transcript rendering file (.vtt)');
      expect(files.manifest[0].filename).toEqual('Transcript rendering file');
    });

    it('with `rendering` prop only at canvas level', () => {
      const files = iiifParser.getRenderingFiles(manifest, 0);
      expect(files.canvas.length).toBe(2);
      expect(files.canvas[0].label).toBe('Section 1');
      expect(files.canvas[0].files.length).toBe(1);
      expect(files.canvas[0].files[0].label).toEqual('Poster image (.jpg)');
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
      expect(files.canvas[0].files[0].label).toEqual('Poster image (.jpg)');
      expect(files.canvas[0].files[0].filename).toEqual('Poster image');
    });

    it('without `rendering` prop at both canvas and manifest level', () => {
      const files = iiifParser.getRenderingFiles(audiannotateTest, 0);
      expect(files).toHaveProperty('manifest');
      expect(files).toHaveProperty('canvas');
      expect(files.canvas.length).toBe(2);
      expect(files.canvas[0].label).toBe('Section 1');
      expect(files.canvas[0].files.length).toBe(0);
      expect(files.canvas[1].label).toBe('Section 2');
      expect(files.canvas[1].files.length).toBe(0);
      expect(files.manifest.length).toBe(0);
    });
  });

  describe('getMetadata()', () => {
    let originalLogger;
    beforeAll(() => {
      // Mock console.error function
      originalLogger = console.log;
      console.log = jest.fn();
    });
    afterAll(() => {
      // Clean up mock
      console.log = originalLogger;
    });

    describe('reading only manifest-level metadata', () => {
      it('manifest with metadata returns a list of key, value pairs', () => {
        const { manifestMetadata, canvasMetadata, rights } = iiifParser.getMetadata(lunchroomManifest, false);
        expect(manifestMetadata.length).toBeGreaterThan(0);
        expect(canvasMetadata.length).toEqual(0);
        expect(manifestMetadata[0]).toEqual({ label: "Title", value: "This is the title of the item!" });
        expect(rights).toEqual([{
          label: 'License',
          value: "<a href=http://creativecommons.org/licenses/by-sa/3.0/>http://creativecommons.org/licenses/by-sa/3.0/</a>"
        }]);
      });

      it('manifest without metadata returns []', () => {
        const { manifestMetadata, canvasMetadata } = iiifParser.getMetadata(volleyballManifest, false);
        expect(manifestMetadata).toEqual([]);
        expect(canvasMetadata.length).toEqual(0);
        expect(console.log).toBeCalledTimes(1);
      });
    });

    describe('reading canvas-level metadata', () => {
      it('canvas with metadata returns a list of key, value pairs', () => {
        const { manifestMetadata, canvasMetadata } = iiifParser.getMetadata(playlistManifest, true);
        expect(manifestMetadata.length).toBeGreaterThan(0);
        expect(canvasMetadata.length).toEqual(6);
        expect(canvasMetadata[2].metadata[0]).toEqual({ label: "Title", value: "Second Playlist Item" });
        expect(canvasMetadata[2]).toHaveProperty('rights');
        expect(canvasMetadata[2].rights[0]).toEqual(
          {
            label: "Attribution",
            value: "<span>Creative commons <a href=\"https://creativecommons.org/licenses/by-sa/3.0\">CC BY-SA 3.0</a></span>"
          });
        // console.log is called twice for the 5 canvases without metadata
        expect(console.log).toBeCalledTimes(5);
      });


      it('canvas without metadata returns []', () => {
        const { manifestMetadata, canvasMetadata } = iiifParser.getMetadata(playlistManifest, true);
        expect(manifestMetadata.length).toBeGreaterThan(0);
        expect(canvasMetadata.length).toEqual(6);
        expect(canvasMetadata[0].metadata).toEqual([]);
        // console.log is called twice for the 5 canvases without metadata
        expect(console.log).toBeCalledTimes(5);
      });
    });

    it('replaces new line characters with <br/> tags', () => {
      const { manifestMetadata, _ } = iiifParser.getMetadata(lunchroomManifest, false);
      expect(manifestMetadata[3]).toEqual({
        label: "Summary",
        value: "This is the summary field. It may include a summary of the item.<br /><br />Does a  pre  tag exist here?<br /><br /><b>How about some bold?</b><br /><br /><i>Or italics?</i>"
      });
    });

    it('sanitize HTML in value for each metadata item', () => {
      const { manifestMetadata, _ } = iiifParser.getMetadata(lunchroomManifest);
      expect(manifestMetadata[0]).toEqual({
        label: "Title",
        value: "This is the title of the item!"
      });
      expect(manifestMetadata[2]).toEqual({
        label: "Main contributors",
        value: "John Doe<br />The Avalon Media System Team"
      });
      expect(manifestMetadata[5]).toEqual({
        label: "Collection",
        value: "<a href=\"https://example.com/collections/fb4948403\">Testing</a>"
      });
      expect(manifestMetadata[6]).toEqual({
        label: "Related Items",
        value: "<a href=\"https://iu.edu\">IU</a><br /><a href=\"https://avalonmediasystem.org\">Avalon Website</a>"
      });
      expect(manifestMetadata[7]).toEqual({
        label: "Notes", value: "<a></a>"
      });
    });

    it('interprets null value as an empty string', () => {
      const { manifestMetadata, _ } = iiifParser.getMetadata(lunchroomManifest, false);
      expect(manifestMetadata.length).toBeGreaterThan(0);
      expect(manifestMetadata[9]).toEqual({ label: "Notes", value: "" });
    });
  });

  describe('parseAutoAdvance()', () => {
    describe('with manifest without auto-advance behavior', () => {
      it('should return true', () => {
        expect(iiifParser.parseAutoAdvance(manifest.behavior)).toBe(false);
      });
    });

    describe('with manifest with auto-advance behavior', () => {
      it('should return true', () => {
        expect(iiifParser.parseAutoAdvance(autoAdvanceManifest.behavior)).toBe(true);
      });
    });
  });

  describe('getStructureRanges()', () => {
    it('returns parsed structures and timespans when structure is defined in manifest', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        manifest, iiifParser.canvasesInManifest(manifest)
      );
      expect(structures).toHaveLength(2);
      expect(timespans).toHaveLength(12);
      expect(markRoot).toBeFalsy();
      expect(hasCollapsibleStructure).toBeTruthy();

      const firstStructCanvas = structures[0];
      expect(firstStructCanvas.label).toEqual('CD1 - Mahler, Symphony No.3');
      expect(firstStructCanvas.items).toHaveLength(3);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeTruthy();
      expect(firstStructCanvas.rangeId).toEqual('https://example.com/sample/transcript-annotation/range/1');
      expect(firstStructCanvas.id).toEqual(undefined);
      expect(firstStructCanvas.isClickable).toBeFalsy();
      expect(firstStructCanvas.duration).toEqual('09:32');
      expect(firstStructCanvas.canvasDuration).toEqual(572.034);
      expect(firstStructCanvas.times).toEqual({ start: 0, end: 0 });

      const firstTimespan = timespans[0];
      expect(firstTimespan.label).toEqual('Track 1. I. Kraftig');
      expect(firstTimespan.items).toHaveLength(0);
      expect(firstTimespan.isCanvas).toBeFalsy();
      expect(firstTimespan.isEmpty).toBeFalsy();
      expect(firstTimespan.isTitle).toBeFalsy();
      expect(firstTimespan.rangeId).toEqual('https://example.com/sample/transcript-annotation/range/1-1');
      expect(firstTimespan.id).toEqual('https://example.com/sample/transcript-annotation/canvas/1#t=0,374');
      expect(firstTimespan.isClickable).toBeTruthy();
      expect(firstTimespan.duration).toEqual('06:14');
      expect(firstTimespan.canvasDuration).toEqual(572.034);
      expect(firstTimespan.times).toEqual({ start: 0, end: 374 });
    });

    it('returns empty structures and timespans when behavior is set to no-nav', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        volleyballManifest, iiifParser.canvasesInManifest(volleyballManifest)
      );
      expect(structures).toHaveLength(0);
      expect(timespans).toHaveLength(0);
      expect(markRoot).toBeFalsy();
      expect(hasCollapsibleStructure).toBeFalsy();
    });

    it('returns identical structures and timespans when structure is childless', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        autoAdvanceManifest, iiifParser.canvasesInManifest(autoAdvanceManifest)
      );
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(2);
      expect(markRoot).toBeTruthy();
      expect(hasCollapsibleStructure).toBeFalsy();

      const firstStructCanvas = structures[0].items[0];
      expect(firstStructCanvas.label).toEqual('Atto Primo');
      expect(firstStructCanvas.items).toHaveLength(0);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeFalsy();
      expect(firstStructCanvas.rangeId).toEqual('https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/range/2');
      expect(firstStructCanvas.id).toEqual('https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1#t=0,');
      expect(firstStructCanvas.isClickable).toBeTruthy();
      expect(firstStructCanvas.duration).toEqual('01:06:11');
      expect(firstStructCanvas.canvasDuration).toEqual(3971.24);
      expect(firstStructCanvas.times).toEqual({ start: 0, end: 0 });

      const firstTimespan = timespans[0];
      expect(firstTimespan).toEqual(firstStructCanvas);
    });

    it('returns identical structures when Canvas id is not a mediafragment', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        autoAdvanceManifest, iiifParser.canvasesInManifest(autoAdvanceManifest)
      );
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(2);
      expect(markRoot).toBeTruthy();
      expect(hasCollapsibleStructure).toBeFalsy();

      const secondStructCanvas = structures[0].items[1];
      expect(secondStructCanvas.label).toEqual('Atto Secondo');
      expect(secondStructCanvas.items).toHaveLength(0);
      expect(secondStructCanvas.isCanvas).toBeTruthy();
      expect(secondStructCanvas.isEmpty).toBeFalsy();
      expect(secondStructCanvas.isTitle).toBeFalsy();
      expect(secondStructCanvas.rangeId).toEqual('https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/range/3');
      expect(secondStructCanvas.id).toEqual('https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2#t=0,');
      expect(secondStructCanvas.isClickable).toBeTruthy();
      expect(secondStructCanvas.duration).toEqual('55:07');
      expect(secondStructCanvas.canvasDuration).toEqual(3307.22);
      expect(secondStructCanvas.times).toEqual({ start: 0, end: 0 });
    });

    it('returns mediafragment with only start time for structure item relevant to Canvas', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        lunchroomManifest, iiifParser.canvasesInManifest(lunchroomManifest)
      );
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(13);
      expect(markRoot).toBeTruthy();
      expect(hasCollapsibleStructure).toBeTruthy();

      const firstStructCanvas = structures[0].items[0];
      expect(firstStructCanvas.label).toEqual('Lunchroom Manners');
      expect(firstStructCanvas.items).toHaveLength(3);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeFalsy();
      expect(firstStructCanvas.rangeId).toEqual('https://example.com/manifest/lunchroom_manners/range/1');
      expect(firstStructCanvas.id).toEqual('https://example.com/manifest/lunchroom_manners/canvas/1#t=0,');
      expect(firstStructCanvas.isClickable).toBeTruthy();
      expect(firstStructCanvas.duration).toEqual('11:00');
      expect(firstStructCanvas.canvasDuration).toEqual(660);
      expect(firstStructCanvas.times).toEqual({ start: 0, end: 0 });
    });

    it('returns structure with root for a single canvas manifest', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        singleCanvasManifest, iiifParser.canvasesInManifest(singleCanvasManifest)
      );
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(3);
      expect(markRoot).toBeFalsy();
      expect(hasCollapsibleStructure).toBeFalsy();

      const firstStructCanvas = structures[0].items[0];
      expect(firstStructCanvas.label).toEqual('Atto Primo');
      expect(firstStructCanvas.items).toHaveLength(2);
      expect(firstStructCanvas.isCanvas).toBeFalsy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeTruthy();
      expect(firstStructCanvas.rangeId).toEqual('http://example.com/single-canvas-manifest/range/2');
      expect(firstStructCanvas.id).toBeUndefined();
      expect(firstStructCanvas.isClickable).toBeFalsy();
      expect(firstStructCanvas.canvasDuration).toEqual(7278.422);
      expect(firstStructCanvas.times).toEqual({ start: 0, end: 0 });
    });

    it('returns [] when structure is not present', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        manifestWoStructure, iiifParser.canvasesInManifest(manifestWoStructure)
      );
      expect(structures).toEqual([]);
      expect(timespans).toEqual([]);
      expect(markRoot).toBeFalsy();
      expect(hasCollapsibleStructure).toBeFalsy();
    });

    it('returns canvas summary with structure for playlist manifests', () => {
      const { structures, timespans } = iiifParser.getStructureRanges(
        playlistManifest, iiifParser.canvasesInManifest(playlistManifest), true
      );
      expect(structures).toHaveLength(6);
      expect(timespans).toHaveLength(6);

      const firstStructCanvas = structures[2];
      expect(firstStructCanvas.label).toEqual('Playlist Item 1');
      expect(firstStructCanvas.summary).toEqual('Clip from Volleyball for boys');
      expect(firstStructCanvas.homepage).toEqual('https://example.com/playlists/1?position=3');
      expect(firstStructCanvas.items).toHaveLength(0);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeFalsy();
      expect(firstStructCanvas.rangeId).toEqual('http://example.com/playlists/1/range/2');
      expect(firstStructCanvas.id).toEqual('http://example.com/playlists/1/canvas/3#t=0,');
      expect(firstStructCanvas.isClickable).toBeTruthy();
      expect(firstStructCanvas.duration).toEqual('00:32');
      expect(firstStructCanvas.canvasDuration).toEqual(32);
      expect(firstStructCanvas.times).toEqual({ start: 0, end: 0 });
    });

    it('return empty structures and timespans when behavior is set to thumbnail-nav', () => {
      const { structures, timespans, markRoot, hasCollapsibleStructure } = iiifParser.getStructureRanges(
        singleSrcManifest, iiifParser.canvasesInManifest(singleSrcManifest)
      );
      expect(structures).toHaveLength(0);
      expect(timespans).toHaveLength(0);
      expect(markRoot).toBeFalsy();
      expect(hasCollapsibleStructure).toBeFalsy();
    });
  });

  describe('getSearchService()', () => {
    test('returns null for a manifest without services', () => {
      expect(iiifParser.getSearchService(singleCanvasManifest)).toBeNull();
    });

    test('returns an id for a manifest with manifest-level search service', () => {
      expect(iiifParser.getSearchService(lunchroomManifest)).toEqual(
        'http://example.com/manifest/search'
      );
    });

    test('returns an id for a manifest with canvas-level search service', () => {
      expect(iiifParser.getSearchService(manifest.items[0])).toEqual(
        'http://example.com/sample/transcript-annotation/canvas/1/search'
      );
    });

    test('returns null when service type is not equal to SearchService2', () => {
      expect(iiifParser.getSearchService(manifest.items[1])).toBeNull();
    });
  });
});
