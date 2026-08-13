import {
  getIIIFAPIVersion, getPlaceholderProp, getAccompanyingProp,
  hasMotivation, normalizeMotivation
} from './iiif-version-parser';

describe('iiif-version-parser', () => {
  describe('getIIIFAPIVersion()', () => {
    describe('resutrns "3" when "@context"', () => {
      test('is a Presentation 3 context', () => {
        expect(getIIIFAPIVersion({
          '@context': 'http://iiif.io/api/presentation/3/context.json',
        })).toEqual('3');
      });

      test('is an array containing the Presentation 3 context', () => {
        expect(getIIIFAPIVersion({
          '@context': [
            'http://iiif.io/api/presentation/3/context.json',
            'http://example.com/extension/context.json',
          ],
        })).toEqual('3');
      });

      test('is missing', () => {
        expect(getIIIFAPIVersion({})).toEqual('3');
      });

      test('is an unrecognized value', () => {
        expect(getIIIFAPIVersion({
          '@context': 'http://iiif.io/api/presentation/2/context.json',
        })).toEqual('3');
      });
    });

    describe('resutrns "4" when "@context"', () => {
      test('is a Presentation 4 context', () => {
        expect(getIIIFAPIVersion({
          '@context': 'http://iiif.io/api/presentation/4/context.json',
        })).toEqual('4');
      });

      test('is an array containing the Presentation 4 context', () => {
        expect(getIIIFAPIVersion({
          '@context': [
            'http://iiif.io/api/presentation/4/context.json',
            'http://example.com/extension/context.json',
          ],
        })).toEqual('4');
      });
    });
  });

  describe('getPlaceholderProp()', () => {
    test('returns "placeholderCanvas" for version "3"', () => {
      expect(getPlaceholderProp('3')).toEqual('placeholderCanvas');
    });

    test('returns "placeholderContainer" for version "4"', () => {
      expect(getPlaceholderProp('4')).toEqual('placeholderContainer');
    });

    test('defaults to "placeholderCanvas" for an unrecognized version', () => {
      expect(getPlaceholderProp('5')).toEqual('placeholderCanvas');
    });
  });

  describe('hasMotivation()', () => {
    describe('when the motivation is a string value', () => {
      test('returns true when it is equal to expected value', () => {
        expect(hasMotivation('painting', 'painting')).toBeTruthy();
      });

      test('returns false when it is not equal to expected value', () => {
        expect(hasMotivation('painting', 'commenting')).toBeFalsy();
      });
    });

    describe('when the motivation is an array value', () => {
      test('returns true when expected value is included', () => {
        expect(hasMotivation(['painting', 'timeline'], 'painting')).toBeTruthy();
      });

      test('returns true when expected value is not included', () => {
        expect(hasMotivation(['painting', 'timeline'], 'commenting')).toBeFalsy();
      });
    });
  });

  describe('normalizeMotivation()', () => {
    test('converts a string motivation into an array', () => {
      expect(normalizeMotivation('painting')).toEqual(['painting']);
    });

    test('returns an array motivation unchanged', () => {
      expect(normalizeMotivation(['painting'])).toEqual(['painting']);
    });

    test('returns an empty array when motivation is undefined', () => {
      expect(normalizeMotivation(undefined)).toEqual([]);
    });

    test('returns an empty array when motivation is null', () => {
      expect(normalizeMotivation(null)).toEqual([]);
    });
  });

  describe('getAccompanyingProp()', () => {
    test('returns "AccompanyingCanvas" for version "3"', () => {
      expect(getAccompanyingProp('3')).toEqual('accompanyingCanvas');
    });

    test('returns "accompanyingContainer" for version "4"', () => {
      expect(getAccompanyingProp('4')).toEqual('accompanyingContainer');
    });

    test('defaults to "accompanyingCanvas" for an unrecognized version', () => {
      expect(getAccompanyingProp('5')).toEqual('accompanyingCanvas');
    });
  });
});
