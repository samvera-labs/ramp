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
});
