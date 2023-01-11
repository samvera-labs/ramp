import * as util from './utility-helpers';

describe('util helper', () => {
  describe('timeToS()', () => {
    test('with format hh:mm:ss.ms', () => {
      const timeStr = '00:09:17.600';
      expect(util.timeToS(timeStr)).toEqual(557.6);
    });

    test('with format mm:ss.ms', () => {
      const timeStr = '09:12.100';
      expect(util.timeToS(timeStr)).toEqual(552.1);
    });
  });

  describe('createTimestamp()', () => {
    test('with hours', () => {
      expect(util.createTimestamp(557.65, true)).toEqual('00:09:17');
    });

    test('without hours', () => {
      expect(util.createTimestamp(557.65, false)).toEqual('09:17');
    });
  });


  describe('getCanvasTarget()', () => {
    const targets = [
      { start: 0, end: 2455, altStart: 0, duration: 2455, sIndex: 0 },
      { start: 0, end: 3131, altStart: 2455, duration: 3131, sIndex: 1 }];

    it('when timefragment is within first range', () => {
      const { srcIndex, fragmentStart } = util.getCanvasTarget(targets, { start: 231, end: 345 }, 2455);
      expect(srcIndex).toEqual(0);
      expect(fragmentStart).toEqual(231);
    });

    it('when timefragment is within second range', () => {
      const { srcIndex, fragmentStart } = util.getCanvasTarget(targets, { start: 3455, end: 4000 }, 3131);
      expect(srcIndex).toEqual(1);
      expect(fragmentStart).toEqual(1000);
    });
  });



  describe('getMediaFragment()', () => {
    it('returns a start/end helper object from a uri', () => {
      const expectedObject = { start: 374, end: 525 };
      expect(
        util.getMediaFragment(
          'http://example.com/mahler-symphony-3/canvas/1#t=374,525', 1985
        )
      ).toEqual(expectedObject);
    });

    it('returns undefined when uri without time is passed', () => {
      const noTime = util.getMediaFragment(
        'http://example.com/mahler-symphony-3/range/1-4', 1985
      );

      expect(noTime).toBeUndefined();
    });

    it('returns duration when end time is not defined', () => {
      const expectedObject = { start: 670, end: 1985 };
      expect(
        util.getMediaFragment(
          'http://example.com/mahler-symphony-3/canvas/1#t=670', 1985
        )
      ).toEqual(expectedObject);
    });

    it('returns undefined when invalid uri is given', () => {
      expect(util.getMediaFragment(undefined, 1985)).toBeUndefined();
    });
  });

});
