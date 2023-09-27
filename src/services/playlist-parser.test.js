import manifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';
import lunchroomManifest from '@TestData/lunchroom-manners';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import * as playlistParser from './playlist-parser';

describe('playlist-parser', () => {
  describe('getAnnotationService()', () => {
    it('returns annotations service when specified', () => {
      const serviceId = playlistParser.getAnnotationService(playlistManifest);
      expect(serviceId).toEqual('http://example.com/manifests/playlist/marker');
    });

    it('returns null when not specified', () => {
      const serviceId = playlistParser.getAnnotationService(lunchroomManifest);
      expect(serviceId).toBeNull();
    });

    it('returns null when type is not AnnotationService0', () => {
      const serviceId = playlistParser.getAnnotationService(autoAdvanceManifest);
      expect(serviceId).toBeNull();
    });
  });

  describe('getIsPlaylist()', () => {
    it('returns false for non-playlist manifest', () => {
      const isPlaylist = playlistParser.getIsPlaylist(manifest);
      expect(isPlaylist).toBeFalsy();
    });

    it('returns true for playlist manifest', () => {
      const isPlaylist = playlistParser.getIsPlaylist(playlistManifest);
      expect(isPlaylist).toBeTruthy();
    });

    it('returns false for unrecognized input', () => {
      const originalError = console.error;
      console.error = jest.fn();

      const isPlaylist = playlistParser.getIsPlaylist(undefined);
      expect(isPlaylist).toBeFalsy();
      expect(console.error).toHaveBeenCalledTimes(1);

      console.error = originalError;
    });
  });

  describe('parsePlaylistAnnotations()', () => {
    it('returns empty array for a canvas without markers', () => {
      const { markers, error } = playlistParser.parsePlaylistAnnotations(manifest, 0);
      expect(markers).toHaveLength(0);
      expect(error).toEqual('No markers were found in the Canvas');
    });

    it('returns markers information for a canvas with markers', () => {
      const { markers, error } = playlistParser.parsePlaylistAnnotations(playlistManifest, 1);

      expect(markers).toHaveLength(2);
      expect(error).toEqual('');

      expect(markers[0]).toEqual({
        time: 2.836,
        timeStr: '00:00:02.836',
        value: 'Marker 1',
        id: 'http://example.com/manifests/playlist/canvas/2/marker/3',
        canvasId: 'http://example.com/manifests/playlist/canvas/2'
      });
    });
  });

  describe('parseMarkerAnnotation()', () => {
    it('returns marker json object', () => {
      const annotation = {
        __jsonld: {
          id: "https://example.com/marker/1",
          type: "Annotation",
          motivation: "highlighting",
          body: {
            type: "TextualBody",
            value: "Test Marker"
          },
          target: "http://example.com/manifest/canvas/1#t=55.0"
        },
        getTarget: jest.fn(() => { return annotation.__jsonld.target; }),
        getBody: jest.fn(() => {
          return [{
            "type": "TextualBody",
            "value": "Test Marker",
            getProperty: jest.fn((prop) => {
              return annotation.__jsonld.body[prop];
            }),
          }];
        }),
        id: "https://example.com/marker/1"
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

  describe('createNewAnnotation()', () => {
    const annot = playlistParser.createNewAnnotation(
      {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "id": "https://example.com/marker/1",
        "type": "Annotation",
        "motivation": "highlighting",
        "body": {
          "type": "TextualBody",
          "value": "Test Marker"
        },
        "target": "http://example.com/manifest/canvas/1#t=55.0"
      }
    );
    expect(annot).toEqual({
      "__jsonld": {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "id": "https://example.com/marker/1",
        "type": "Annotation",
        "motivation": "highlighting",
        "body": {
          "type": "TextualBody",
          "value": "Test Marker"
        },
        "target": "http://example.com/manifest/canvas/1#t=55.0"
      },
      "context": "http://www.w3.org/ns/anno.jsonld",
      "id": "https://example.com/marker/1"
    });
  });
});
