import { getIIIFAPIVersion, getPlaceholderProp, resolveMotivation } from './iiif-version-parser';

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

  describe('resolveMotivation()', () => {
    describe('when expected param is null', () => {
      test('converts a string motivation into an array', () => {
        expect(resolveMotivation('painting')).toEqual(['painting']);
      });

      test('returns an array-like motivation unchanged', () => {
        expect(resolveMotivation(['painting'])).toEqual(['painting']);
      });

      test('returns an empty array when motivation is missing', () => {
        expect(resolveMotivation(undefined)).toEqual([]);
      });
    });

    describe('when expected param is provided', () => {
      describe('and it is included in the given motivation', () => {
        test('returns true for a string motivation', () => {
          expect(resolveMotivation('painting', 'painting')).toBeTruthy();
        });

        test('returns true for an array-like motivation', () => {
          expect(resolveMotivation(['painting', 'timeline'], 'painting')).toBeTruthy();
        });
      });

      describe('and it is not included in the given motivation', () => {
        test('returns false for a string motivation', () => {
          expect(resolveMotivation('painting', 'commenting')).toBeFalsy();
        });

        test('returns false for an array-like motivation', () => {
          expect(resolveMotivation(['painting', 'timeline'], 'commenting')).toBeFalsy();
        });
      });
    });
  });
});
