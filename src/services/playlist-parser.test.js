import manifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';
import lunchroomManifest from '@TestData/lunchroom-manners';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import * as playlistParser from './playlist-parser';

describe('playlist-parser', () => {
  describe('getAnnotationService()', () => {
    it('returns annotations service when specified', () => {
      const serviceId = playlistParser.getAnnotationService(playlistManifest.service);
      expect(serviceId).toEqual('http://example.com/playlists/1/marker');
    });

    it('returns null when not specified', () => {
      const serviceId = playlistParser.getAnnotationService(lunchroomManifest.service);
      expect(serviceId).toBeNull();
    });

    it('returns null when type is not AnnotationService0', () => {
      const serviceId = playlistParser.getAnnotationService(autoAdvanceManifest.service);
      expect(serviceId).toBeNull();
    });
  });

  describe('getIsPlaylist()', () => {
    it('returns false for non-playlist manifest', () => {
      const isPlaylist = playlistParser.getIsPlaylist(manifest.label);
      expect(isPlaylist).toBeFalsy();
    });

    it('returns true for playlist manifest', () => {
      const isPlaylist = playlistParser.getIsPlaylist(playlistManifest.label);
      expect(isPlaylist).toBeTruthy();
    });

    it('returns false for unrecognized input', () => {
      const originalWarn = console.warn;
      console.warn = jest.fn();

      const isPlaylist = playlistParser.getIsPlaylist(undefined);
      expect(isPlaylist).toBeFalsy();
      expect(console.warn).toHaveBeenCalledTimes(1);

      console.warn = originalWarn;
    });
  });

  describe('parseMarkerAnnotation()', () => {
    it('returns marker json object', () => {
      const annotation = {
        id: "https://example.com/marker/1",
        type: "Annotation",
        motivation: "highlighting",
        body: {
          type: "TextualBody",
          value: "Test Marker"
        },
        target: "http://example.com/manifest/canvas/1#t=55.0"
      };
      const marker = playlistParser.parseMarkerAnnotation(annotation);
      expect(marker.value).toEqual('Test Marker');
      expect(marker.timeStr).toEqual('00:00:55.000');
      expect(marker.canvasId).toEqual('http://example.com/manifest/canvas/1');
      expect(marker.time).toEqual(55);
    });

    it('returns null for undefined', () => {
      const marker = playlistParser.parseMarkerAnnotation();
      expect(marker).toBeNull();
    });
  });
});
