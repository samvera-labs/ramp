import manifest from '@TestData/transcript-annotation';
import volleyballManifest from '@TestData/volleyball-for-boys';
import lunchroomManifest from '@TestData/lunchroom-manners';
import manifestWoStructure from '@TestData/transcript-canvas';
import singleSrcManifest from '@TestData/transcript-multiple-canvas';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import playlistManifest from '@TestData/playlist';
import emptyManifest from '@TestData/empty-manifest';
import * as iiifParser from './iiif-parser';
import * as util from './utility-helpers';

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

    it('returns empty list for empty Manifest', () => {
      const canvases = iiifParser.canvasesInManifest(emptyManifest);
      expect(canvases).toHaveLength(0);
    });
  });

  describe('manifestCanvasesInfo()', () => {
    test('retuns canvas info in manifest', () => {
      const { isMultiCanvas, lastIndex } = iiifParser.manifestCanvasesInfo(manifest);
      expect(isMultiCanvas).toBeTruthy();
      expect(lastIndex).toEqual(1);
    });

    test('returns default values when manifest items is empty', () => {
      let originalError = console.error;
      console.error = jest.fn();
      const { isMultiCanvas, lastIndex } = iiifParser.manifestCanvasesInfo({
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          'http://iiif.io/api/presentation/3/context.json',
        ],
        type: 'Manifest',
        id: 'http://example.com/empty-manifest',
        label: {
          en: ['Empty Manifest'],
        },
        items: []
      });
      expect(isMultiCanvas).toBeFalsy();
      expect(lastIndex).toEqual(0);
      console.error = originalError;
    });
  });

  describe('getCanvasIndex()', () => {
    test('reurns canvas index by id', () => {
      expect(iiifParser.getCanvasIndex(
        manifest, 'https://example.com/sample/transcript-annotation/canvas/2'
      )
      ).toEqual(1);
    });
    test('returns default value when canvas is not found', () => {
      // Mock console.log function
      let originalLogger = console.log;
      console.log = jest.fn();
      expect(iiifParser.getCanvasIndex(
        manifest, 'https://example.com/sample/transcript-annotation/canvas/3'
      )
      ).toEqual(0);
      expect(console.log).toHaveBeenCalledWith(
        'Canvas not found in Manifest, ',
        'https://example.com/sample/transcript-annotation/canvas/3'
      );
      // Cleanup mock
      console.log = originalLogger;
    });
    test('returns default value when manifest is invalid', () => {
      // Mock console.error function
      let originalLogger = console.log;
      console.log = jest.fn();
      expect(iiifParser.getCanvasIndex(
        {
          '@context': [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json',
          ],
          type: 'Manifest',
          id: 'http://example.com/empty-manifest',
          label: {
            en: ['Empty Manifest'],
          },
          items: []
        }, 'https://example.com/sample/transcript-annotation/canvas/3'
      )
      ).toEqual(0);
      // Cleanup mock
      console.log = originalLogger;
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

      it('sets default source when not multisourced', () => {
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
            srclang: 'en',
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
            srclang: 'en',
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
      const posterUrl = iiifParser.getPlaceholderCanvas(lunchroomManifest, 0, true);
      expect(posterUrl).toEqual(
        'https://example.com/manifest/poster/lunchroom_manners_poster.jpg'
      );
    });

    it('returns null for audio manifest', () => {
      const posterUrl = iiifParser.getPlaceholderCanvas(manifest, 0, true);
      expect(posterUrl).toBeNull();
    });

    it('returns placeholderCanvas text and sets timer to given duration', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(manifest, 1);
      expect(itemMessage).toEqual('You do not have permission to playback this item. \nPlease contact support to report this error: <a href="mailto:admin-list@example.com">admin-list@example.com</a>.\n');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(4000);
    });

    it('returns placeholderCanvas text and sets timer to default when duration is not defined', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(playlistManifest, 0);
      expect(itemMessage).toEqual('You do not have permission to playback this item.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('returns hard coded text when placeholderCanvas has no text and sets timer to default', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(lunchroomManifest, 0);
      expect(itemMessage).toEqual('This item cannot be played.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('returns default message when no placeholderCanvas is in the Canvas and sets timer to default', () => {
      const itemMessage = iiifParser.getPlaceholderCanvas(singleSrcManifest, 0);
      expect(console.error).toBeCalledTimes(1);
      expect(itemMessage).toEqual('This item cannot be played.');
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
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

    it('returns default values when start property is not defined in Manifest', () => {
      const customStart = iiifParser.getCustomStart(manifestWoStructure);
      expect(customStart.type).toEqual('C');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
    });

    it('returns values related to given start canvas ID', () => {
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/manifests/playlist/canvas/2'
      );
      expect(customStart.type).toEqual('C');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(1);
    });

    it('returns values related to given start canvas time', () => {
      const customStart = iiifParser.getCustomStart(manifestWoStructure, undefined, 23);
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(23);
      expect(customStart.canvas).toEqual(0);
    });

    it('returns values related to given start canvas ID and time', () => {
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/manifests/playlist/canvas/3', 233
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(233);
      expect(customStart.canvas).toEqual(2);
    });

    it('returns zero as start time when given value is outside of Canvas duration', () => {
      // Mock console.error function
      let originalError = console.error;
      console.error = jest.fn();
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/manifests/playlist/canvas/3', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(2);
      expect(console.error).toBeCalledTimes(1);
      console.error = originalError;
    });

    it('returns zero as current canvas index when given ID is not in the Manifest', () => {
      // Mock console.error function
      let originalError = console.error;
      console.error = jest.fn();
      const customStart = iiifParser.getCustomStart(
        playlistManifest, 'http://example.com/manifests/playlist/canvas/33', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
      expect(console.error).toBeCalledTimes(1);
      console.error = originalError;
    });

    it('return default values with empty manifest', () => {
      // Mock console.error function
      let originalError = console.error;
      console.error = jest.fn();
      const customStart = iiifParser.getCustomStart(
        emptyManifest, 'http://example.com/manifests/playlist/canvas/33', 653
      );
      expect(customStart.type).toEqual('SR');
      expect(customStart.time).toEqual(0);
      expect(customStart.canvas).toEqual(0);
      expect(console.error).toBeCalledTimes(1);
      console.error = originalError;
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

  describe('getMetadata()', () => {
    let originalLogger;
    beforeAll(() => {
      // Mock console.error function
      originalLogger = console.log;
      console.log = jest.fn();
    });
    afterAll(() => {
      // Clen up mock
      console.log = originalLogger;
    });

    describe('reading only manifest-level metadata', () => {
      it('manifest with metadata returns a list of key, value pairs', () => {
        const { manifestMetadata, canvasMetadata } = iiifParser.getMetadata(lunchroomManifest, false);
        expect(manifestMetadata.length).toBeGreaterThan(0);
        expect(canvasMetadata.length).toEqual(0);
        expect(manifestMetadata[0]).toEqual({ label: "Title", value: "This is the title of the item!" });
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
        expect(canvasMetadata.length).toEqual(3);
        expect(canvasMetadata[0].metadata[0]).toEqual({ label: "Title", value: "First Playlist Item" });
        // console.log is called twice for the 2 canvases without metadata
        expect(console.log).toBeCalledTimes(2);
      });


      it('canvas without metadata returns []', () => {
        const { manifestMetadata, canvasMetadata } = iiifParser.getMetadata(playlistManifest, true);
        expect(manifestMetadata.length).toBeGreaterThan(0);
        expect(canvasMetadata.length).toEqual(3);
        expect(canvasMetadata[1].metadata).toEqual([]);
        // console.log is called twice for the 2 canvases without metadata
        expect(console.log).toBeCalledTimes(2);
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
  });

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

  describe('getStructureRanges()', () => {
    it('returns parsed structures and timespans when structure is defined in manifest', () => {
      const { structures, timespans } = iiifParser.getStructureRanges(manifest);
      expect(structures).toHaveLength(2);
      expect(timespans).toHaveLength(16);
      const firstStructCanvas = structures[0];
      expect(firstStructCanvas.label).toEqual('CD1 - Mahler, Symphony No.3');
      expect(firstStructCanvas.items).toHaveLength(7);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeTruthy();
      expect(firstStructCanvas.rangeId).toEqual('https://example.com/sample/transcript-annotation/range/1');
      expect(firstStructCanvas.id).toEqual(undefined);
      expect(firstStructCanvas.isClickable).toBeFalsy();
      expect(firstStructCanvas.duration).toEqual('33:05');

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
    });

    it('returns identical structures and timespans when structure is childless', () => {
      const { structures, timespans } = iiifParser.getStructureRanges(volleyballManifest);
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(1);

      const firstStructCanvas = structures[0];
      expect(firstStructCanvas.label).toEqual('Volleyball for Boys');
      expect(firstStructCanvas.items).toHaveLength(0);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeFalsy();
      expect(firstStructCanvas.rangeId).toEqual('http://example.com/volleyball-for-boys/manifest/range/2');
      expect(firstStructCanvas.id).toEqual('http://example.com/volleyball-for-boys/manifest/canvas/1#t=0,');
      expect(firstStructCanvas.isClickable).toBeTruthy();
      expect(firstStructCanvas.duration).toEqual('11:02');

      const firstTimespan = timespans[0];
      expect(firstTimespan).toEqual(firstStructCanvas);
    });

    it('returns mediafragment with only start time for sections with structure', () => {
      const { structures, timespans } = iiifParser.getStructureRanges(lunchroomManifest);
      expect(structures).toHaveLength(1);
      expect(timespans).toHaveLength(12);

      const firstStructCanvas = structures[0];
      expect(firstStructCanvas.label).toEqual('Lunchroom Manners');
      expect(firstStructCanvas.items).toHaveLength(3);
      expect(firstStructCanvas.isCanvas).toBeTruthy();
      expect(firstStructCanvas.isEmpty).toBeFalsy();
      expect(firstStructCanvas.isTitle).toBeFalsy();
      expect(firstStructCanvas.rangeId).toEqual('https://example.com/manifest/lunchroom_manners/range/1');
      expect(firstStructCanvas.id).toEqual('https://example.com/manifest/lunchroom_manners/canvas/1#t=0,');
      expect(firstStructCanvas.isClickable).toBeTruthy();
      expect(firstStructCanvas.duration).toEqual('11:00');

    });

    it('returns [] when structure is not present', () => {
      const { structures, timespans } = iiifParser.getStructureRanges(manifestWoStructure);
      expect(structures).toEqual([]);
      expect(timespans).toEqual([]);
    });
  });

});
