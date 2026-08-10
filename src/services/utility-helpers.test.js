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

    test('with format hh:mm:ss,ms', () => {
      const timeStr = '00:09:17,600';
      expect(util.timeToS(timeStr)).toEqual(557.6);
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
          'http://example.com/sample/manifest/canvas/1#t=374,525', 1985
        )
      ).toEqual(expectedObject);
    });

    it('returns undefined when uri without time is passed', () => {
      const noTime = util.getMediaFragment(
        'http://example.com/sample/manifest/range/1-4', 1985
      );

      expect(noTime).toBeUndefined();
    });

    it('returns duration when end time is not defined', () => {
      const expectedObject = { start: 670, end: 1985 };
      expect(
        util.getMediaFragment(
          'http://example.com/sample/manifest/canvas/1#t=670', 1985
        )
      ).toEqual(expectedObject);
    });

    it('returns undefined when invalid uri is given', () => {
      expect(util.getMediaFragment(undefined, 1985)).toBeUndefined();
    });

    it('returns time in seconds when hh:mm:ss.ms format time string is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=00:07:53.900,00:07:56.500'
      )).toEqual({
        start: 473.9, end: 476.5
      });
    });

    it('returns time in seconds when hh:mm:ss,ms format time string is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=00:07:53,900,00:07:56,500'
      )).toEqual({
        start: 473.9, end: 476.5
      });
    });

    it('returns time in seconds when hh:mm:ss format with mixed decimal formating is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=00:07:53.900,00:07:56,500'
      )).toEqual({
        start: 473.9, end: 476.5
      });
    });

    it('returns time in seconds when hh:mm:ss format time string is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=00:07:53,00:07:56'
      )).toEqual({
        start: 473, end: 476
      });
    });

    it('returns time in seconds when mm:ss,ms format time string is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=07:53,900,07:56,500'
      )).toEqual({
        start: 473.9, end: 476.5
      });
    });

    it('returns time in seconds when mm:ss,ms format with mixed decimal formatting is given', () => {
      expect(util.getMediaFragment(
        'http://example.com/sample/manifest/canvas#t=07:53.900,07:56,500'
      )).toEqual({
        start: 473.9, end: 476.5
      });
    });

    it('returns duration when end time is not defined in hh:mm:ss format with a trailing comma', () => {
      const expectedObject = { start: 473, end: 1985 };
      expect(
        util.getMediaFragment(
          'http://example.com/sample/manifest/canvas#t=00:07:53,', 1985
        )
      ).toEqual(expectedObject);
    });
  });

  describe('parseResourceAnnotations()', () => {
    let originalError, originalWarn;
    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn();
      originalError = console.error;
      console.error = jest.fn();
    });

    afterEach(() => {
      console.warn = originalWarn;
      console.error = originalError;
    });

    describe('parses painting annotations', () => {
      beforeEach(() => {
        // Mock canPlayType to always return 'maybe' (truthy value)
        HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'maybe');
      });
      afterEach(() => {
        jest.restoreAllMocks();
      });
      describe('with multiple sources for a single Canvas', () => {
        describe('in a regular Manifest', () => {
          const annotations =
          {
            type: 'Canvas', id: 'http://example.com/manifest/canvas/1',
            items: [
              {
                type: 'AnnotationPage',
                items: [
                  {
                    type: 'Annotation', motivation: 'painting',
                    id: 'http://example.com/manifest/canvas/1/annotation-page/1',
                    target: 'http://example.com/manifest/canvas/1',
                    body: {
                      type: 'Choice',
                      items: [
                        {
                          id: 'http://example.com/manifest/media/low.mp4',
                          label: { en: ['Low'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                        },
                        {
                          id: 'http://example.com/manifest/media/high.mp4',
                          label: { en: ['High'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                        }
                      ]
                    }
                  }
                ],
              }
            ],
          };
          test('without a custom start', () => {
            const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
              { annotation: annotations, duration: 572.32, motivation: 'painting' }
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 0, customStart: 0, end: 572.32, start: 0, duration: 572.32 });
            expect(resources[0]).toEqual({
              src: 'http://example.com/manifest/media/low.mp4',
              key: 'http://example.com/manifest/media/low.mp4',
              type: 'video/mp4', kind: 'Video', label: 'Low',
            });
            expect(resources[1]).toEqual({
              src: 'http://example.com/manifest/media/high.mp4',
              key: 'http://example.com/manifest/media/high.mp4',
              type: 'video/mp4', kind: 'Video', label: 'High',
            });
            expect(isMultiSource).toBeFalsy();
          });

          test('with a custom start', () => {
            const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
              { annotation: annotations, duration: 572.32, motivation: 'painting', start: 120 }
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 0, customStart: 120, end: 572.32, start: 0, duration: 572.32 });
            expect(resources[0]).toEqual({
              src: 'http://example.com/manifest/media/low.mp4#t=120,572.32',
              key: 'http://example.com/manifest/media/low.mp4',
              type: 'video/mp4', kind: 'Video', label: 'Low',
            });
            expect(resources[1]).toEqual({
              src: 'http://example.com/manifest/media/high.mp4#t=120,572.32',
              key: 'http://example.com/manifest/media/high.mp4',
              type: 'video/mp4', kind: 'Video', label: 'High',
            });
            expect(isMultiSource).toBeFalsy();
          });
        });

        test('with invalid MIME types', () => {
          const annotations =
          {
            type: 'Canvas', id: 'http://example.com/manifest/canvas/1',
            items: [
              {
                type: 'AnnotationPage',
                items: [
                  {
                    type: 'Annotation', motivation: 'painting',
                    id: 'http://example.com/manifest/canvas/1/annotation-page/1',
                    target: 'http://example.com/manifest/canvas/1',
                    body: {
                      type: 'Choice',
                      items: [
                        {
                          id: 'http://example.com/manifest/media/mpeg-video.mp4',
                          label: { en: ['MPEG'] }, type: 'Video', format: 'video/mpeg', duration: 572.32,
                        },
                        {
                          id: 'http://example.com/manifest/media/ogg-video.ogv',
                          label: { en: ['OGG'] }, type: 'Video', format: 'audio/ogg', duration: 572.32,
                        },
                        {
                          id: 'http://example.com/manifest/media/webm-video.webm',
                          label: { en: ['WEBM'] }, type: 'Video', format: 'application/octet-stream', duration: 572.32,
                        }
                      ]
                    }
                  }
                ],
              }
            ],
          };
          const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
            { annotation: annotations, duration: 572.32, motivation: 'painting' }
          );
          expect(resources).toHaveLength(3);
          expect(canvasTargets).toHaveLength(1);
          expect(canvasTargets[0]).toEqual({ altStart: 0, customStart: 0, end: 572.32, start: 0, duration: 572.32 });
          expect(resources[0]).toEqual({
            src: 'http://example.com/manifest/media/mpeg-video.mp4',
            key: 'http://example.com/manifest/media/mpeg-video.mp4',
            type: 'video/mp4', kind: 'Video', label: 'MPEG',
          });
          expect(resources[1]).toEqual({
            src: 'http://example.com/manifest/media/ogg-video.ogv',
            key: 'http://example.com/manifest/media/ogg-video.ogv',
            type: 'video/ogg', kind: 'Video', label: 'OGG',
          });
          expect(resources[2]).toEqual({
            src: 'http://example.com/manifest/media/webm-video.webm',
            key: 'http://example.com/manifest/media/webm-video.webm',
            type: 'video/webm', kind: 'Video', label: 'WEBM',
          });
          expect(isMultiSource).toBeFalsy();
          // 3 warnings: video/mpeg -> video/mp4, application/octet-stream -> video/webm, video/ogg -> audio/ogg
          expect(console.warn).toHaveBeenCalledTimes(3);
        });

        describe('in a playlist Manifest', () => {
          test('Canvas with a full length playlist item', () => {
            const annotations =
            {
              type: 'Canvas',
              id: 'http://example.com/manifest/canvas/1',
              items: [
                {
                  type: 'AnnotationPage',
                  items: [
                    {
                      type: 'Annotation', motivation: 'painting',
                      id: 'http://example.com/manifest/canvas/1/annotation-page/1',
                      target: 'http://example.com/manifest/canvas/1',
                      body: {
                        type: 'Choice',
                        items: [
                          {
                            id: 'http://example.com/manifest/media/low.mp4',
                            label: { en: ['Low'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                          },
                          {
                            id: 'http://example.com/manifest/media/high.mp4',
                            label: { en: ['High'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                          }
                        ]
                      }
                    }
                  ],
                }
              ],
            };
            const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
              { annotation: annotations, duration: 572.32, motivation: 'painting', isPlaylist: true }
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 0, end: 572.32, start: 0, duration: 572.32 });
            expect(resources[0]).toEqual({
              src: 'http://example.com/manifest/media/low.mp4',
              key: 'http://example.com/manifest/media/low.mp4',
              type: 'video/mp4',
              kind: 'Video',
              label: 'Low',
            });
            expect(resources[1]).toEqual({
              src: 'http://example.com/manifest/media/high.mp4',
              key: 'http://example.com/manifest/media/high.mp4',
              type: 'video/mp4',
              kind: 'Video',
              label: 'High',
            });
            expect(isMultiSource).toBeFalsy();
          });
          test('Canvas with a clipped playlist item', () => {
            const annotations =
            {
              type: 'Canvas',
              id: 'http://example.com/manifest/canvas/1',
              items: [
                {
                  type: 'AnnotationPage',
                  items: [
                    {
                      type: 'Annotation', motivation: 'painting',
                      id: 'http://example.com/manifest/canvas/1/annotation-page/1',
                      target: 'http://example.com/manifest/canvas/1',
                      body: {
                        type: 'Choice',
                        items: [
                          {
                            id: 'http://example.com/manifest/media/low.mp4#t=120,150.32',
                            label: { en: ['Low'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                          },
                          {
                            id: 'http://example.com/manifest/media/high.mp4#t=120,150.32',
                            label: { en: ['High'] }, type: 'Video', format: 'video/mp4', duration: 572.32,
                          }
                        ]
                      }
                    }
                  ],
                }
              ],
            };
            const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
              { annotation: annotations, duration: 572.32, motivation: 'painting', isPlaylist: true }
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 120, end: 150.32, start: 120, duration: 572.32 });
            expect(resources[0]).toEqual({
              src: 'http://example.com/manifest/media/low.mp4#t=120,150.32',
              key: 'http://example.com/manifest/media/low.mp4#t=120,150.32',
              type: 'video/mp4',
              kind: 'Video',
              label: 'Low',
            });
            expect(resources[1]).toEqual({
              src: 'http://example.com/manifest/media/high.mp4#t=120,150.32',
              key: 'http://example.com/manifest/media/high.mp4#t=120,150.32',
              type: 'video/mp4',
              kind: 'Video',
              label: 'High',
            });
            expect(isMultiSource).toBeFalsy();
          });
        });
      });

      test('with multiple resources in a single Canvas', () => {
        const annotations =
        {
          type: 'Canvas',
          id: 'http://example.com/manifest/canvas/1',
          duration: 896.55,
          items: [
            {
              id: 'http://example.com/manifest/canvas/1/annotation-page/1',
              type: 'AnnotationPage',
              items: [
                {
                  type: 'Annotation', motivation: 'painting',
                  id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
                  target: 'http://example.com/manifest/canvas/1#t=0,572.32',
                  body: {
                    id: 'http://example.com/manifest/media_part1.mp4',
                    type: 'Video',
                    label: { none: ['Part 1'] },
                    format: 'video/mp4',
                    duration: 572.32,
                    height: 1080,
                    width: 1920,
                  },
                },
                {
                  type: 'Annotation', motivation: 'painting',
                  id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/2',
                  target: 'http://example.com/manifest/canvas/1#t=572.32',
                  body: {
                    id: 'http://example.com/manifest/media_part2.mp4',
                    type: 'Video',
                    label: { none: ['Part 2'] },
                    format: 'video/mp4',
                    duration: 324.23,
                    height: 1080,
                    width: 1920,
                  }
                }
              ],
            }
          ],
        };
        const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
          { annotation: annotations, duration: 896.55, motivation: 'painting' }
        );
        expect(resources).toHaveLength(2);
        expect(canvasTargets).toHaveLength(2);
        expect(resources[0]).toEqual({
          src: 'http://example.com/manifest/media_part1.mp4',
          key: 'http://example.com/manifest/media_part1.mp4',
          type: 'video/mp4',
          kind: 'Video',
          label: 'Part 1',
        });
        expect(resources[1]).toEqual({
          src: 'http://example.com/manifest/media_part2.mp4',
          key: 'http://example.com/manifest/media_part2.mp4',
          type: 'video/mp4',
          kind: 'Video',
          label: 'Part 2',
        });
        expect(canvasTargets[0]).toEqual({
          duration: 572.32, id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
          end: 572.32, start: 0, altStart: 0, sIndex: 0
        });
        expect(canvasTargets[1]).toEqual({
          duration: 324.23, id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/2',
          end: 324.23, start: 0, altStart: 572.32, sIndex: 1
        });
        expect(isMultiSource).toBeTruthy();
      });
    });

    test('does not parse painting annotations with no browser supported resources', () => {
      // Mock canPlayType to return '' (falsy value) to mock browser unsupported MIME types
      HTMLMediaElement.prototype.canPlayType = jest.fn(() => '');
      const annotations =
      {
        type: 'Canvas',
        id: 'http://example.com/manifest/canvas/1',
        duration: 896.55,
        items: [
          {
            id: 'http://example.com/manifest/canvas/1/annotation-page/1',
            type: 'AnnotationPage',
            items: [
              {
                type: 'Annotation', motivation: 'painting',
                id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/1',
                target: 'http://example.com/manifest/canvas/1#t=0,572.32',
                body: {
                  id: 'http://example.com/manifest/media_part1.ogv',
                  type: 'Video', label: { none: ['Part 1'] },
                  format: 'video/ogg', duration: 572.32, height: 1080, width: 1920,
                },
              },
              {
                type: 'Annotation', motivation: 'painting',
                id: 'http://example.com/manifest/canvas/1/annotation-page/1/annotation/2',
                target: 'http://example.com/manifest/canvas/1#t=572.32',
                body: {
                  id: 'http://example.com/manifest/media_part2.ogv',
                  type: 'Video', label: { none: ['Part 2'] },
                  format: 'video/ogg', duration: 324.23, height: 1080, width: 1920,
                }
              }
            ],
          }
        ],
      };
      const { resources } = util.parseResourceAnnotations({ annotation: annotations, duration: 896.55, motivation: 'painting' });
      expect(resources).toHaveLength(0);
      jest.restoreAllMocks();
    });

    test('parses supplementin annotations', () => {
      const annotations = [
        {
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/manifest/canvas/1/page/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'http://example.com/manifest/English.vtt',
                label: { en: ['Captions in WebVTT format'] },
                language: 'en',
                type: 'Text',
                format: 'text/vtt',
              },
              target: 'http://example.com/manifest/canvas/1',
            },
            {
              id: 'http://example.com/manifest/canvas/1/page/annotation/2',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'http://example.com/manifest/Italian.vtt',
                label: { it: ['Sottotitoli in formato WebVTT'] },
                language: 'it',
                type: 'Text',
                format: 'text/vtt',
              },
              target: 'http://example.com/manifest/canvas/1',
            }
          ]
        }
      ];
      const { resources, _, isMultiResource } = util.parseResourceAnnotations(
        { annotation: annotations, duration: 896.55, motivation: 'supplementing' }
      );
      expect(resources).toHaveLength(2);
      expect(resources[0]).toEqual({
        src: 'http://example.com/manifest/English.vtt',
        key: 'http://example.com/manifest/English.vtt',
        type: 'text/vtt',
        kind: 'subtitles',
        srclang: 'en',
        label: 'Captions in WebVTT format',
      });
      expect(resources[1]).toEqual({
        src: 'http://example.com/manifest/Italian.vtt',
        key: 'http://example.com/manifest/Italian.vtt',
        type: 'text/vtt',
        kind: 'subtitles',
        srclang: 'it',
        label: 'Sottotitoli in formato WebVTT',
      });
      expect(isMultiResource).toBeFalsy();
    });

    test('parses forced caption annotation from label and sets forced flag', () => {
      const annotations = [
        {
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/manifest/canvas/1/page/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'http://example.com/manifest/lunchroom_manners.vtt',
                label: { eng: ['lunchroom_manners.vtt [forced]'], none: ['lunchroom_manners.vtt'] },
                language: 'eng',
                type: 'Text',
                format: 'text/vtt',
              },
              target: 'http://example.com/manifest/canvas/1',
            }
          ]
        }
      ];
      const { resources } = util.parseResourceAnnotations({ annotation: annotations, duration: 896.55, motivation: 'supplementing' });
      expect(resources).toHaveLength(1);
      expect(resources[0].label).toEqual('lunchroom_manners.vtt [forced]');
      expect(resources[0].forced).toBe(true);
    });

    test('with annotations undefined', () => {
      expect(util.parseResourceAnnotations({ annotation: undefined, duration: 572.32, motivation: 'supplementing' })).toEqual({
        resources: [], error: 'No resources found in Canvas', poster: '',
        canvasTargets: [], isMultiSource: false
      });
    });

    describe('for empty Canvas', () => {
      /** Use-case: Avalon's empty Canvas representation for restricted/deleted resources */
      test('with zero annotations', () => {
        expect(util.parseResourceAnnotations({ annotation: [], duration: NaN, motivation: 'painting' })).toEqual({
          resources: [],
          canvasTargets: [],
          isMultiSource: false,
          poster: 'This item cannot be played.'
        });
      });

      /** Use-case: AudiAnnotate's empty Canvas representation for unavailable resources */
      test('with annotations without resource information', () => {
        const annotations =
        {
          id: 'https://example.com/audi-annotate-test/canvas-2/canvas',
          type: 'Canvas',
          duration: 3204.0,
          items: [
            {
              id: 'https://example.com/audi-annotate-test/canvas-2/paintings',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://example.com/audi-annotate-test/canvas-2/painting',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    id: '',
                    duration: 3204.0
                  },
                  target: 'https://example.com/audi-annotate-test/canvas-2/canvas'
                }
              ]
            }
          ]
        };
        const { resources, canvasTargets, isMultiResource, poster } = util.parseResourceAnnotations(
          { annotation: annotations, duration: 3204.0, motivation: 'painting' }
        );
        expect(resources).toHaveLength(0);
        expect(canvasTargets).toHaveLength(0);
        expect(isMultiResource).toBeFalsy();
        expect(poster).toEqual('This item cannot be played.');
      });
    });
  });

  describe('timeToHHmmss()', () => {
    test('with milli-seconds', () => {
      expect(util.timeToHHmmss(0.34)).toEqual('00:00');
    });

    test('with seconds', () => {
      expect(util.timeToHHmmss(30.04)).toEqual('00:30');
    });

    test('with minutes', () => {
      expect(util.timeToHHmmss(65.94,)).toEqual('01:05');
    });

    test('with hours', () => {
      expect(util.timeToHHmmss(3675)).toEqual('01:01:15');
      expect(util.timeToHHmmss(475.93)).toEqual('07:55');
    });

    test('with showHrs=true', () => {
      expect(util.timeToHHmmss(557.65, true)).toEqual('00:09:17');
    });

    test('with showMs=true', () => {
      expect(util.timeToHHmmss(557.65, false, true)).toEqual('09:17.650');
    });
  });

  // NOTE: only able to test download with link not blob
  describe('fileDownload()', () => {
    let originalConsole, link, createElementSpy;
    beforeEach(() => {
      originalConsole = console.log;
      console.log = jest.fn();

      link = {
        click: jest.fn(),
        href: '',
        download: '',
        style: { display: '' },
        setAttribute: jest.fn(),
      };
      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValueOnce(link);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    });
    afterEach(() => {
      console.log = originalConsole;
    });
    test('successful download', () => {
      util.fileDownload('https://example.com/transcript', 'Transcript test.json');

      expect(createElementSpy).toBeCalledWith('a');
      expect(link.setAttribute.mock.calls.length).toBe(2);
      expect(link.setAttribute.mock.calls[0]).toEqual(['href', 'https://example.com/transcript']);
      expect(link.setAttribute.mock.calls[1]).toEqual(['download', 'Transcript test.json']);
      expect(link.style.display).toBe('none');
      expect(document.body.appendChild).toBeCalledWith(link);
      expect(link.click).toBeCalled();
      expect(document.body.removeChild).toBeCalledWith(link);
    });

    describe('for machine-generated transcripts', () => {
      test('adds "(machine generated)" text to file name', () => {
        util.fileDownload('https://example.com/transcript', 'Transcript test', 'json', true);

        expect(createElementSpy).toBeCalledWith('a');
        expect(link.setAttribute.mock.calls.length).toBe(2);
        expect(link.setAttribute.mock.calls[0]).toEqual(['href', 'https://example.com/transcript']);
        expect(link.setAttribute.mock.calls[1]).toEqual(['download', 'Transcript test (machine generated).json']);
        expect(link.style.display).toBe('none');
        expect(document.body.appendChild).toBeCalledWith(link);
        expect(link.click).toBeCalled();
        expect(document.body.removeChild).toBeCalledWith(link);
      });
    });
  });

  describe('identifyMachineGen()', () => {
    test('\"Transcript file (machine-generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (machine-generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });

    test('\"Transcript file (machine generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (machine generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });

    test('\"Transcript machine file\" as not machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript machine file');
      expect(isMachineGen).toBeFalsy();
      expect(labelText).toEqual('Transcript machine file');
    });

    test('\"Transcript machine-generated file\" as not machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript machine-generated file');
      expect(isMachineGen).toBeFalsy();
      expect(labelText).toEqual('Transcript machine-generated file');
    });

    test('\"Transcript file (Machine generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (Machine generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });

    test('\"Transcript file (Machine-generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (Machine-generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });


    test('\"Machine generated Transcript file\" as not machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Machine generated Transcript file');
      expect(isMachineGen).toBeFalsy();
      expect(labelText).toEqual('Machine generated Transcript file');
    });

    test('\"Machine-generated Transcript file\" as not machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Machine-generated Transcript file');
      expect(isMachineGen).toBeFalsy();
      expect(labelText).toEqual('Machine-generated Transcript file');
    });

    test('\"Transcript file (Machine Generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (Machine Generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });

    test('\"Transcript file (Machine-Generated)\" as machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Transcript file (Machine-Generated)');
      expect(isMachineGen).toBeTruthy();
      expect(labelText).toEqual('Transcript file');
    });

    test('\"Machine Generated Transcript file\" as not machine generated', () => {
      const { isMachineGen, labelText } = util.identifyMachineGen('Machine Generated Transcript file');
      expect(isMachineGen).toBeFalsy();
      expect(labelText).toEqual('Machine Generated Transcript file');
    });
  });

  describe('identifySupplementingAnnotation()', () => {
    test('with transcripts at the end of URI', () => {
      const value = util.identifySupplementingAnnotation('https://example.com/lunchroom-manners/transcripts');
      expect(value).toEqual(1);
    });

    test('with captions at the end of URI', () => {
      const value = util.identifySupplementingAnnotation('https://example.com/lunchroom-manners/captions');
      expect(value).toEqual(2);
    });

    test('with descriptions at the end of URI', () => {
      const value = util.identifySupplementingAnnotation('https://example.com/lunchroom-manners/descriptions');
      expect(value).toEqual(4);
    });

    test('with generic URI', () => {
      const value = util.identifySupplementingAnnotation('https://example.com/lunchroom-manners/lunchroom-manners.vtt');
      expect(value).toEqual(3);
    });
  });

  describe('getLabelValue()', () => {
    it('returns label when en tag is available', () => {
      const label = {
        en: ['Track 4. Schwungvoll'],
      };
      expect(util.getLabelValue(label)).toEqual('Track 4. Schwungvoll');
    });
    it('returns label when none tag is available', () => {
      const label = {
        none: ['Track 2. Langsam. Schwer'],
      };
      expect(util.getLabelValue(label)).toEqual(
        'Track 2. Langsam. Schwer'
      );
    });
    it('returns lable when a string is given', () => {
      const label = 'Track 2. Langsam. Schwer';
      expect(util.getLabelValue(label)).toEqual(
        'Track 2. Langsam. Schwer'
      );
    });
    it('returns empty string when label is not present', () => {
      const label = {};
      expect(util.getLabelValue(label)).toEqual(
        ''
      );
    });
    it('returns first value when readAll == false', () => {
      const label = {
        en: ['Jane Doe', 'Avalon Media System'],
      };
      expect(util.getLabelValue(label)).toEqual('Jane Doe');
    });
    it('returns values seperated by \n when readAll == true', () => {
      const label = {
        en: ['Jane Doe', 'Avalon Media System'],
      };
      expect(util.getLabelValue(label, true)).toEqual('Jane Doe\nAvalon Media System');
    });
  });

  describe('setCanvasMessageTimeout()', () => {
    it('sets default value when param is undefined', () => {
      util.setCanvasMessageTimeout(undefined);
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('sets default value when param is null', () => {
      util.setCanvasMessageTimeout(null);
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(10000);
    });

    it('sets the given value', () => {
      util.setCanvasMessageTimeout(3000);
      expect(util.CANVAS_MESSAGE_TIMEOUT).toEqual(3000);
    });
  });

  describe('setAppErrorMessage()', () => {
    it('sets default value when param is undefined', () => {
      util.setAppErrorMessage(undefined);
      expect(util.GENERIC_ERROR_MESSAGE).toEqual("Error encountered. Please check your Manifest.");
    });

    it('sets default value when param is null', () => {
      util.setAppErrorMessage(null);
      expect(util.GENERIC_ERROR_MESSAGE).toEqual("Error encountered. Please check your Manifest.");
    });

    it('sets the given value', () => {
      util.setAppErrorMessage("Error occurred. Please try again later.");
      expect(util.GENERIC_ERROR_MESSAGE).toEqual("Error occurred. Please try again later.");
    });
  });

  describe('sortAnnotations()', () => {
    test('return empty array when annotations list is empty', () => {
      expect(util.sortAnnotations([])).toEqual([]);
    });

    test('returns annotations sorted by start time', () => {
      const annotations = [
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 10, end: undefined },
          value: [
            { format: 'text/plain', value: '[Inaudible]', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Inaudible', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 23.4, end: 29.1 },
          value: [
            { format: 'text/plain', value: 'Title of the film "Suspense".', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 6.42, end: 14.23 },
          value: [
            { format: 'text/plain', value: 'Cast for the file: Lois Weber as the wife; Valentine Paul as the husband;', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Cast Card', purpose: ['tagging'] }, { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 15.32, end: undefined },
          value: [
            { format: 'text/plain', value: 'Letter from the maid to their owners.', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
            { format: 'text/plain', value: 'Inser Shot', purpose: ['tagging'] },
          ]
        },
      ];

      expect(util.sortAnnotations(annotations)).toEqual([
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 6.42, end: 14.23 },
          value: [
            { format: 'text/plain', value: 'Cast for the file: Lois Weber as the wife; Valentine Paul as the husband;', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Cast Card', purpose: ['tagging'] }, { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 10, end: undefined },
          value: [
            { format: 'text/plain', value: '[Inaudible]', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Inaudible', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 15.32, end: undefined },
          value: [
            { format: 'text/plain', value: 'Letter from the maid to their owners.', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
            { format: 'text/plain', value: 'Inser Shot', purpose: ['tagging'] },
          ]
        },
        {
          canvasId: 'http://example.com/manifest-example/canvas/1',
          id: 'http://example.com/manifest-example/canvas/1/page/annotation/1',
          motivation: ['supplementing', 'tagging'],
          tagColor: 'hls(24, 80%. 90%)',
          time: { start: 23.4, end: 29.1 },
          value: [
            { format: 'text/plain', value: 'Title of the film "Suspense".', purpose: ['supplementing'] },
            { format: 'text/plain', value: 'Titles', purpose: ['tagging'] },
          ]
        },
      ]);
    });
  });

  describe('screenReaderFriendlyTime()', () => {
    test('returns time for time with hours, minutes, and seconds', () => {
      // 1 hour, 1 minute, 15 seconds
      expect(util.screenReaderFriendlyTime(3675)).toEqual('1 hour 1 minute 15 seconds');
      // 1 hour, 1 minute, 1 second
      expect(util.screenReaderFriendlyTime(3661)).toEqual('1 hour 1 minute 1 second');
    });

    test('returns time for time with hours and seconds', () => {
      // 1 hour, 0 minutes, 1 second
      expect(util.screenReaderFriendlyTime(3601)).toEqual('1 hour 0 minutes 1 second');
    });


    test('returns time for time with minutes and seconds', () => {
      // 2 minutes, 5 seconds
      expect(util.screenReaderFriendlyTime(125)).toEqual('2 minutes 5 seconds');
    });

    test('returns time for time with only seconds', () => {
      expect(util.screenReaderFriendlyTime(45)).toEqual('45 seconds');
    });

    test('returns 0 seconds for milliseconds', () => {
      expect(util.screenReaderFriendlyTime(0.34)).toEqual('0 seconds');
    });

    test('returns empty string for invalid time', () => {
      expect(util.screenReaderFriendlyTime(NaN)).toEqual('');
    });
  });

  describe('truncateText()', () => {
    test('returns original text with HTML if it is shorter than maxLength', () => {
      const html = '<p>Short text</p>';
      const { isTruncated, truncated } = util.truncateText(html, 20);
      expect(truncated).toBe(html);
      expect(isTruncated).toBe(false);
    });

    test('returns truncated plain text', () => {
      const html = 'This is a longer text that needs truncation';
      const { isTruncated, truncated } = util.truncateText(html, 10);
      expect(truncated).toBe('This is a...');
      expect(isTruncated).toBe(true);
    });

    test('returns original text without counting length of ellipsis (3 characters)', () => {
      // Original text length is 23, which is 3 characters longer than maxLength of 20
      const html = 'No need for truncation.';
      const { isTruncated, truncated } = util.truncateText(html, 20);
      expect(truncated).toBe('No need for truncation.');
      expect(isTruncated).toBe(false);
    });

    test('returns truncated text with original HTML tags intact', () => {
      const html = '<p>This is a <strong>bold statement</strong> with some text.</p>';
      const { isTruncated, truncated } = util.truncateText(html, 20);
      expect(truncated).toBe('<p>This is a <strong>bold...</strong></p>');
      expect(isTruncated).toBe(true);
    });

    test('returns original text when text without HTML tags is shorter than maxLength', () => {
      // Character count for text with HTML tags is 58, without HTML tags 41 
      const html = 'Text that <strong>without the need</strong> for truncation';
      const { isTruncated, truncated } = util.truncateText(html, 50);
      expect(truncated).toBe('Text that <strong>without the need</strong> for truncation');
      expect(isTruncated).toBe(false);
    });

    test('returns truncated text without counting HTML tags towards character limit', () => {
      // Character count for text "Bold and superscript text" is 25
      const html = '<p><strong>Bold</strong> and <sup><a href="http://example.com">superscript</a></sup> text</p>';
      const { isTruncated, truncated } = util.truncateText(html, 15);
      expect(truncated).toBe('<p><strong>Bold</strong> and <sup><a href="http://example.com">supers...</a></sup></p>');
      expect(isTruncated).toBe(true);
    });
  });

  describe('roundToPrecision()', () => {
    test('returns number rounded to 3 decimal places (default value)', () => {
      expect(util.roundToPrecision(3.14159)).toEqual(3.142);
      expect(util.roundToPrecision(2.71828)).toEqual(2.718);
      expect(util.roundToPrecision(1.41421)).toEqual(1.414);
    });

    test('returns input time when invalid', () => {
      expect(util.roundToPrecision(NaN)).toEqual(NaN);
      expect(util.roundToPrecision('3.14159')).toEqual('3.14159');
    });

    test('returns number rounded to 2 decimal places', () => {
      expect(util.roundToPrecision(3.14159, 100)).toEqual(3.14);
      expect(util.roundToPrecision(2.71828, 100)).toEqual(2.72);
      expect(util.roundToPrecision(1.41421, 100)).toEqual(1.41);
    });

    test('returns number rounded to 0 decimal places', () => {
      expect(util.roundToPrecision(3.14159, 1)).toEqual(3);
      expect(util.roundToPrecision(2.71828, 1)).toEqual(3);
      expect(util.roundToPrecision(1.41421, 1)).toEqual(1);
    });
  });

  describe('checkSrcRange()', () => {
    test('returns true for valid src range', () => {
      expect(util.checkSrcRange({ start: 1.32, end: 4.53 }, { start: 0, end: 9.32 })).toBeTruthy();
    });

    test('returns true for segment range with only end > duration', () => {
      expect(util.checkSrcRange({ start: 8.32, end: 10.32 }, { start: 0, end: 9.32 })).toBeTruthy();
    });

    test('returns false for invalid src range', () => {
      expect(util.checkSrcRange({ start: 9.43, end: 10.32 }, { start: 0, end: 9.32 })).toBeFalsy();
    });

    test('returns false for undefined segment', () => {
      expect(util.checkSrcRange(undefined, { start: 0, end: 9.32 })).toBeFalsy();
    });

    test('returns true for undefined src range', () => {
      expect(util.checkSrcRange({ start: 1.32, end: 4.53 }, undefined)).toBeTruthy();
    });
  });

  describe('offsetTextTrackCues()', () => {
    let player, subtitleTrack;
    let subtitleCues = [];

    beforeEach(() => {
      subtitleCues = [
        { startTime: 10, endTime: 20, text: 'Intro' },
        { startTime: 70, endTime: 80, text: 'Alabama Singleton. I am 33-years-old.' },
        { startTime: 120, endTime: 125, text: 'Savannah, GA' },
        { startTime: 130, endTime: 135, text: 'A play that we used to play when we were children in Savannah.' },
        { startTime: 200, endTime: 220, text: 'A ring play, just a ring play, a children\'s ring play' }
      ];
      subtitleTrack = { kind: 'subtitles', cues: subtitleCues, oncuechange: null };
      player = {
        textTracks: () => [subtitleTrack]
      };
    });

    describe('in generic browser environment', () => {
      test('offsets cues in play range using altStart', () => {
        util.offsetTextTrackCues(player, 60, 60);
        expect(subtitleCues[1].startTime).toBeCloseTo(10);
        expect(subtitleCues[1].endTime).toBeCloseTo(20);
      });

      test('preserves original times for offset cues', () => {
        util.offsetTextTrackCues(player, 120, 60);
        expect(subtitleCues[2]._originalStartTime).toBe(120);
        expect(subtitleCues[2]._originalEndTime).toBe(125);
        expect(subtitleCues[3]._originalStartTime).toBeCloseTo(130);
        expect(subtitleCues[3]._originalEndTime).toBeCloseTo(135);
      });

      test('handles negative times correctly', () => {
        util.offsetTextTrackCues(player, 130, 60);
        // Cue at 120-125 becomes -10 -> -5, gets hidden by VideoJS by default
        expect(subtitleCues[2]).toEqual({
          text: 'Savannah, GA', startTime: -10, endTime: -5, _originalStartTime: 120, _originalEndTime: 125
        });
        // Cue at 130 - 135 becomes 0 to 5 -> in current range
        expect(subtitleCues[3]).toEqual({
          text: 'A play that we used to play when we were children in Savannah.', startTime: 0, endTime: 5,
          _originalStartTime: 130, _originalEndTime: 135
        });
      });

      test('preserves original times across source switches', () => {
        /**
         * For play range 60-120,
         * - first cue is out of range and hidden by VideoJS
         * - second cue is offset
         * - fourth cue is out of range and hidden by VideoJS
         */
        util.offsetTextTrackCues(player, 60, 60);
        expect(subtitleCues[0]).toEqual({
          text: 'Intro', startTime: -50, endTime: -40, _originalStartTime: 10, _originalEndTime: 20
        });
        expect(subtitleCues[1]).toEqual({
          text: 'Alabama Singleton. I am 33-years-old.', startTime: 10, endTime: 20, _originalStartTime: 70, _originalEndTime: 80
        });
        expect(subtitleCues[3]).toEqual({
          text: 'A play that we used to play when we were children in Savannah.', startTime: 70, endTime: 75,
          _originalStartTime: 130, _originalEndTime: 135
        });

        /**
         * For play range 120-180,
         * - first 2 cues are out of range and hidden by VideoJS
         * - third cue is offset
         * - last cue is out of range and hidden by VideoJS
         */
        util.offsetTextTrackCues(player, 120, 60);
        expect(subtitleCues[0]).toEqual({
          text: 'Intro', startTime: -110, endTime: -100, _originalStartTime: 10, _originalEndTime: 20
        });
        expect(subtitleCues[1]).toEqual({
          text: 'Alabama Singleton. I am 33-years-old.', startTime: -50, endTime: -40, _originalStartTime: 70, _originalEndTime: 80
        });
        expect(subtitleCues[2]).toEqual({
          text: 'Savannah, GA', startTime: 0, endTime: 5, _originalStartTime: 120, _originalEndTime: 125
        });
        expect(subtitleCues[4]).toEqual({
          text: 'A ring play, just a ring play, a children\'s ring play', startTime: 80, endTime: 100,
          _originalStartTime: 200, _originalEndTime: 220,
        });
      });

      test('handles captions track same as subtitles', () => {
        const captionCues = [
          { startTime: 120, endTime: 125, text: 'Savannah, GA' },
          { startTime: 130, endTime: 135, text: 'A play that we used to play when we were children in Savannah.' },
          { startTime: 200, endTime: 220, text: 'A ring play, just a ring play, a children\'s ring play' }
        ];
        const captionTrack = { kind: 'captions', cues: captionCues, oncuechange: null };
        player = { textTracks: () => [captionTrack] };

        util.offsetTextTrackCues(player, 120, 60);
        expect(captionCues[0]).toEqual({
          startTime: 0, endTime: 5, text: 'Savannah, GA', _originalStartTime: 120, _originalEndTime: 125
        });
        expect(captionCues[0]._originalText).toBeUndefined();
      });
    });

    /**
     * Mock window.navigator.userAgent and window.navigator.userAgentData to simulate
     * Safari/iOS environments, then re-import the modules to pick up the mocked values.
     */
    describe('in iOS/MacOS browser environment', () => {
      let originalNavigator, originalMatchMedia;
      let utilModule;

      // Helper to trigger the 'oncuechange' handler
      const triggerOncuechange = () => {
        if (subtitleTrack.oncuechange) {
          subtitleTrack.oncuechange();
        }
      };

      beforeAll(() => {
        // Save original navigator and matchMedia
        originalNavigator = window.navigator;
        originalMatchMedia = window.matchMedia;
      });

      afterAll(() => {
        // Restore original navigator
        Object.defineProperty(window, 'navigator', {
          value: originalNavigator,
          writable: true,
          configurable: true
        });
        window.matchMedia = originalMatchMedia;
      });

      describe('for Safari desktop browser', () => {
        beforeEach(() => {
          jest.resetModules();

          // Mock Safari desktop user agent
          Object.defineProperty(window, 'navigator', {
            value: {
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
              userAgentData: null,
              maxTouchPoints: 0
            },
            writable: true,
            configurable: true
          });
          window.matchMedia = jest.fn().mockReturnValue({ matches: true });

          // Re-import modules to pick up mocked navigator
          utilModule = require('./utility-helpers');
        });

        test('sets the \'oncuechange\' handler for subtitle tracks', () => {
          // Play range: 60-120
          utilModule.offsetTextTrackCues(player, 60, 60);

          expect(subtitleTrack.oncuechange).not.toBeNull();
          expect(typeof subtitleTrack.oncuechange).toBe('function');
        });

        test('offsets cues within play range using oncuechange handler', () => {
          // Play range: 120-180
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();

          // Cues in range are offset by -60
          expect(subtitleCues[2].startTime).toBe(0);
          expect(subtitleCues[2].endTime).toBe(5);
          expect(subtitleCues[3].startTime).toBe(10);
          expect(subtitleCues[3].endTime).toBe(15);
        });

        test('hides cues outside play range using oncuechange handler', () => {
          // Play range: 60-120
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();

          // Cues before range are hidden, i.e. 'text' property is cleared
          expect(subtitleCues[0].text).toBe('');
          expect(subtitleCues[1].text).toBe('');
          // Cues in range are visible and offset
          expect(subtitleCues[2]).toEqual({
            text: 'Savannah, GA', startTime: 0, endTime: 5, _originalStartTime: 120, _originalEndTime: 125
          });
          expect(subtitleCues[2]._originalText).toBeUndefined();
          expect(subtitleCues[3]).toEqual({
            text: 'A play that we used to play when we were children in Savannah.', startTime: 10, endTime: 15,
            _originalStartTime: 130, _originalEndTime: 135
          });
          expect(subtitleCues[3]._originalText).toBeUndefined();
          // Cues after range are hidden
          expect(subtitleCues[4].text).toBe('');
        });

        test('preserves original times across source switches', () => {
          /**
           * For play range 60-120,
           * - first cue is out of range and hidden
           * - second cue is offset
           * - fourth cue is out of range and hidden
           */
          utilModule.offsetTextTrackCues(player, 60, 60);
          triggerOncuechange();
          expect(subtitleCues[0]).toEqual({
            text: '', startTime: 10, endTime: 20, _originalText: 'Intro', _originalStartTime: 10, _originalEndTime: 20
          });
          expect(subtitleCues[1]).toEqual({
            text: 'Alabama Singleton. I am 33-years-old.', startTime: 10, endTime: 20, _originalStartTime: 70, _originalEndTime: 80
          });
          expect(subtitleCues[3]).toEqual({
            text: '', startTime: 130, endTime: 135, _originalText: 'A play that we used to play when we were children in Savannah.',
            _originalStartTime: 130, _originalEndTime: 135
          });

          /**
           * For play range 120-180,
           * - first 2 cues are out of range and hidden
           * - third cue is offset
           * - last cue is out of range and hidden
           */
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();
          expect(subtitleCues[0]).toEqual({
            text: '', startTime: 10, endTime: 20, _originalText: 'Intro', _originalStartTime: 10, _originalEndTime: 20
          });
          expect(subtitleCues[1]).toEqual({
            text: '', startTime: 10, endTime: 20, _originalStartTime: 70, _originalEndTime: 80,
            _originalText: 'Alabama Singleton. I am 33-years-old.'
          });
          expect(subtitleCues[2]).toEqual({
            text: 'Savannah, GA', startTime: 0, endTime: 5, _originalStartTime: 120, _originalEndTime: 125
          });
          expect(subtitleCues[4]).toEqual({
            text: '', startTime: 200, endTime: 220, _originalStartTime: 200, _originalEndTime: 220,
            _originalText: 'A ring play, just a ring play, a children\'s ring play'
          });
        });

        test('saves and restores text when a cue comes back into range', () => {
          // Hides the last cue for play range 120-180
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();

          expect(subtitleCues[4].text).toBe('');
          expect(subtitleCues[4]._originalText).toBe('A ring play, just a ring play, a children\'s ring play');

          // Restores the last cue for play range 120-180
          utilModule.offsetTextTrackCues(player, 180, 60);
          triggerOncuechange();

          expect(subtitleCues[4].text).toBe('A ring play, just a ring play, a children\'s ring play');
          expect(subtitleCues[4]._originalText).toBe('A ring play, just a ring play, a children\'s ring play');
        });
      });

      describe('for iOS mobile browser', () => {
        beforeEach(() => {
          jest.resetModules();

          // Mock iOS iPhone user agent
          Object.defineProperty(window, 'navigator', {
            value: {
              userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
              userAgentData: null,
              maxTouchPoints: 5
            },
            writable: true,
            configurable: true
          });
          window.matchMedia = jest.fn().mockReturnValue({ matches: false });

          utilModule = require('./utility-helpers');
        });

        test('sets \'oncuechange\' handler for subtitle tracks', () => {
          // Play range: 60-120
          utilModule.offsetTextTrackCues(player, 60, 60);

          expect(subtitleTrack.oncuechange).not.toBeNull();
          expect(typeof subtitleTrack.oncuechange).toBe('function');
        });

        test('offsets cues within play range using oncuechange handler', () => {
          // Play range: 120-180
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();

          // Cues in range are offset by -60
          expect(subtitleCues[2].startTime).toBe(0);
          expect(subtitleCues[2].endTime).toBe(5);
          expect(subtitleCues[3].startTime).toBe(10);
          expect(subtitleCues[3].endTime).toBe(15);
        });

        test('hides cues outside play range using oncuechange handler', () => {
          // Play range: 60-120
          utilModule.offsetTextTrackCues(player, 120, 60);
          triggerOncuechange();

          // Cues before range are hidden, i.e. 'text' property is cleared
          expect(subtitleCues[0].text).toBe('');
          expect(subtitleCues[1].text).toBe('');
          // Cues in range are visible and offset
          expect(subtitleCues[2]).toEqual({
            text: 'Savannah, GA', startTime: 0, endTime: 5, _originalStartTime: 120, _originalEndTime: 125
          });
          expect(subtitleCues[2]._originalText).toBeUndefined();
          expect(subtitleCues[3]).toEqual({
            text: 'A play that we used to play when we were children in Savannah.', startTime: 10, endTime: 15,
            _originalStartTime: 130, _originalEndTime: 135
          });
          expect(subtitleCues[3]._originalText).toBeUndefined();
          // Cues after range are hidden
          expect(subtitleCues[4].text).toBe('');
        });
      });

      describe('for both desktop/mobile', () => {
        beforeEach(() => {
          jest.resetModules();

          // Mock Safari desktop
          Object.defineProperty(window, 'navigator', {
            value: {
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
              userAgentData: null,
              maxTouchPoints: 0
            },
            writable: true,
            configurable: true
          });
          window.matchMedia = jest.fn().mockReturnValue({ matches: true });

          utilModule = require('./utility-helpers');
        });

        test('handles null cues gracefully', () => {
          subtitleTrack = {
            kind: 'subtitles',
            cues: null,
            oncuechange: null
          };
          player = { textTracks: () => [subtitleTrack] };

          utilModule.offsetTextTrackCues(player, 60, 60);
          expect(() => triggerOncuechange()).not.toThrow();
        });

        test('skips offsetting when altStart=0', () => {
          utilModule.offsetTextTrackCues(player, 0, 60);
          triggerOncuechange();

          // Cues are not modified when altStart is 0
          expect(subtitleCues[0].startTime).toBe(10);
          expect(subtitleCues[0].endTime).toBe(20);
          expect(subtitleCues[0]._originalStartTime).toBeUndefined();
        });

        test('handles cue spanning across 2 sources', () => {
          const cues = [{ startTime: 55, endTime: 65, text: 'Boundary cue' }];
          subtitleTrack = { kind: 'subtitles', cues, oncuechange: null };
          player = { textTracks: () => [subtitleTrack] };

          utilModule.offsetTextTrackCues(player, 60, 60);
          triggerOncuechange();

          // Cue ends at 65 > altStart 60, so it's in range
          expect(cues[0].text).toBe('Boundary cue');
          expect(cues[0].startTime).toBe(-5);
          expect(cues[0].endTime).toBe(5);
        });

        test('skips non-subtitle/caption cues in tracks', () => {
          const metadataTrack = {
            kind: 'metadata',
            cues: [{ startTime: 70, endTime: 80, text: 'Metadata' }],
            oncuechange: null
          };
          player = { textTracks: () => [metadataTrack] };

          utilModule.offsetTextTrackCues(player, 60, 60);

          // Metadata track doesn't have a 'oncuechange' handler
          expect(metadataTrack.oncuechange).toBeNull();
        });

        test('handles captions track similar to subtitles', () => {
          const captionCues = [
            { startTime: 120, endTime: 125, text: 'Savannah, GA' },
            { startTime: 130, endTime: 135, text: 'A play that we used to play when we were children in Savannah.' },
            { startTime: 200, endTime: 220, text: 'A ring play, just a ring play, a children\'s ring play' }
          ];
          const captionTrack = { kind: 'captions', cues: captionCues, oncuechange: null };
          player = { textTracks: () => [captionTrack] };

          utilModule.offsetTextTrackCues(player, 120, 60);

          expect(captionTrack.oncuechange).not.toBeNull();
          captionTrack.oncuechange();
          expect(captionCues[0]).toEqual({
            startTime: 0, endTime: 5, text: 'Savannah, GA', _originalStartTime: 120, _originalEndTime: 125
          });
          expect(captionCues[0]._originalText).toBeUndefined();
        });
      });
    });
  });

  describe('playerHotKeys()', () => {
    let player, playerInst, mockEvent;

    beforeEach(() => {
      playerInst = {
        paused: jest.fn(),
        play: jest.fn(),
        pause: jest.fn(),
        isFullscreen: jest.fn(),
        audioOnlyMode: jest.fn().mockReturnValue(false),
        requestFullscreen: jest.fn(),
        exitFullscreen: jest.fn(),
        volume: jest.fn(),
        lastVolume_: jest.fn(),
        muted: jest.fn(),
        currentTime: jest.fn(),
      };
      player = { player: jest.fn().mockReturnValue(playerInst) };
      mockEvent = {
        which: 0,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };

      // Set the activeElement to be the player by default
      Object.defineProperty(document, 'activeElement', {
        value: {
          className: 'video-js vjs-big-play-centered vjs-theme-ramp',
          matches: jest.fn().mockReturnValue(false),
          tagName: 'DIV'
        },
        configurable: true,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('returns undefined without triggering hotkeys', () => {
      test('when Canvas is empty', () => {
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player, true);
        expect(result).toBeUndefined();
        expect(playerInst.play).not.toHaveBeenCalled();
      });

      test('when player instance is null', () => {
        player.player = jest.fn().mockReturnValue(null);
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player);
        expect(result).toBeUndefined();
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });

      test('when player instance is undefined', () => {
        player.player = jest.fn().mockReturnValue(undefined);
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player);
        expect(result).toBeUndefined();
      });

      describe('when modifier key', () => {
        test('"ctrl" is pressed', () => {
          mockEvent.which = 32;
          mockEvent.ctrlKey = true;
          const result = util.playerHotKeys(mockEvent, player);
          expect(result).toBeUndefined();
          expect(playerInst.play).not.toHaveBeenCalled();
        });

        test('"meta" is pressed', () => {
          mockEvent.which = 32;
          mockEvent.metaKey = true;
          const result = util.playerHotKeys(mockEvent, player);
          expect(result).toBeUndefined();
        });

        test('"alt" is pressed', () => {
          mockEvent.which = 32;
          mockEvent.altKey = true;
          const result = util.playerHotKeys(mockEvent, player);
          expect(result).toBeUndefined();
        });

        test('"shift" is pressed', () => {
          mockEvent.which = 32;
          mockEvent.shiftKey = true;
          const result = util.playerHotKeys(mockEvent, player);
          expect(result).toBeUndefined();
        });
      });

      test('when focus is on an interactive element outside the player', () => {
        Object.defineProperty(document, 'activeElement', {
          value: { className: 'some-button', matches: jest.fn().mockReturnValue(true), tagName: 'INPUT' },
          configurable: true,
        });
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player);
        expect(result).toBeUndefined();
        expect(playerInst.play).not.toHaveBeenCalled();
      });

      test('when a unrecognized key is pressed', () => {
        // 'a' key -> does nothing
        mockEvent.which = 65;
        const result = util.playerHotKeys(mockEvent, player);
        expect(result).toBeUndefined();
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });
    });

    test('returns hotkeys action when focus is on an interactive element inside player', () => {
      Object.defineProperty(document, 'activeElement', {
        value: {
          className: 'vjs-play-button',
          matches: jest.fn().mockReturnValue(true),
          tagName: 'BUTTON'
        },
        configurable: true,
      });
      playerInst.paused.mockReturnValue(true);
      mockEvent.which = 32;
      const result = util.playerHotKeys(mockEvent, player);
      expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.play);
    });

    describe('when space key (32) is pressed', () => {
      test('returns play action when player is paused', () => {
        playerInst.paused.mockReturnValue(true);
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.play).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.play);
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
      });

      test('returns pause action when player is playing', () => {
        playerInst.paused.mockReturnValue(false);
        mockEvent.which = 32;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.pause).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.pause);
      });
    });

    describe('when k key (75) is pressed', () => {
      test('returns play action when player is paused', () => {
        playerInst.paused.mockReturnValue(true);
        mockEvent.which = 75;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.play).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.play);
      });

      test('returns pause action when player is playing', () => {
        playerInst.paused.mockReturnValue(false);
        mockEvent.which = 75;
        const result = util.playerHotKeys(mockEvent, player);
        expect(playerInst.pause).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.pause);
      });
    });

    describe('when f key (70) is pressed', () => {
      test('returns enterFullscreen action for video when not in fullscreen', () => {
        playerInst.isFullscreen.mockReturnValue(false);
        mockEvent.which = 70;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.requestFullscreen).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.enterFullscreen);
      });

      test('returns exitFullscreen action when already in fullscreen', () => {
        playerInst.isFullscreen.mockReturnValue(true);
        mockEvent.which = 70;
        const result = util.playerHotKeys(mockEvent, player);
        expect(playerInst.exitFullscreen).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.exitFullscreen);
      });

      test('doesn\'t return an action for audio-only mode', () => {
        playerInst.audioOnlyMode.mockReturnValue(true);
        mockEvent.which = 70;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.requestFullscreen).not.toHaveBeenCalled();
        expect(playerInst.exitFullscreen).not.toHaveBeenCalled();

        expect(result).toBe('');
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
      });
    });

    describe('when m key (77) is pressed', () => {
      test('returns mute action when volume is above 0', () => {
        playerInst.volume.mockReturnValue(0.5);
        playerInst.muted.mockReturnValue(false);
        mockEvent.which = 77;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.muted).toHaveBeenCalledWith(true);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.mute);
      });

      test('returns unmute action and restores volume when volume is 0 and lastVolume >= 0.1', () => {
        playerInst.volume.mockReturnValue(0);
        playerInst.lastVolume_.mockReturnValue(0.5);
        mockEvent.which = 77;
        const result = util.playerHotKeys(mockEvent, player);
        expect(playerInst.volume).toHaveBeenCalledWith(0.5);
        expect(playerInst.muted).toHaveBeenCalledWith(false);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.unmute);
      });

      test('returns unmute action and sets volume to 0.1 when lastVolume was below 0.1', () => {
        playerInst.volume.mockReturnValue(0);
        playerInst.lastVolume_.mockReturnValue(0.05);
        mockEvent.which = 77;
        const result = util.playerHotKeys(mockEvent, player);
        expect(playerInst.volume).toHaveBeenCalledWith(0.1);
        expect(playerInst.muted).toHaveBeenCalledWith(false);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.unmute);
      });
    });

    test('when left arrow key (37) is pressed; returns leftArrow action to seek 5 seconds backward', () => {
      playerInst.currentTime.mockReturnValue(30);
      mockEvent.which = 37;
      const result = util.playerHotKeys(mockEvent, player);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(playerInst.currentTime).toHaveBeenCalledWith(25);
      expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.leftArrow);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    test('when right arrow key (39) is pressed; returns rightArrow action to seek 5 seconds forward', () => {
      playerInst.currentTime.mockReturnValue(30);
      mockEvent.which = 39;
      const result = util.playerHotKeys(mockEvent, player);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(playerInst.currentTime).toHaveBeenCalledWith(35);
      expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.rightArrow);
    });

    describe('when up arrow key (38) is pressed', () => {
      test('returns upArrow to increase volume by 0.1', () => {
        playerInst.volume.mockReturnValue(0.5);
        playerInst.muted.mockReturnValue(false);
        mockEvent.which = 38;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.volume).toHaveBeenCalledWith(0.6);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.upArrow);
      });

      test('when player was muted, returns upArrow to increase volume and unmutes the player', () => {
        playerInst.volume.mockReturnValue(0.5);
        playerInst.muted.mockReturnValue(true);
        mockEvent.which = 38;
        const result = util.playerHotKeys(mockEvent, player);
        expect(playerInst.muted).toHaveBeenCalledWith(false);
        expect(playerInst.volume).toHaveBeenCalledWith(0.6);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.upArrow);
      });
    });

    describe('when down arrow key (40) is pressed', () => {
      test('returns downArrow action to decrease volume by 0.1', () => {
        playerInst.volume.mockReturnValue(0.5);
        mockEvent.which = 40;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(playerInst.volume).toHaveBeenCalledWith(0.4);
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.downArrow);
      });

      test('when volume is at minimum (0.1), returns downArrow action to set volume to 0 and mutes the player', () => {
        playerInst.volume.mockReturnValue(0.1);
        playerInst.muted.mockReturnValue(false);
        mockEvent.which = 40;
        const result = util.playerHotKeys(mockEvent, player);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(result).toBe(util.HOTKEY_ACTION_OUTPUT.downArrow);
        expect(playerInst.volume).toHaveBeenCalledWith(0);
        playerInst.muted.mockReturnValue(true);
      });
    });

    describe('stopPropagation is called for all valid hotkeys', () => {
      const validKeys = [32, 75, 70, 77, 37, 39, 38, 40];
      validKeys.forEach((keyCode) => {
        test(`stopPropagation called for key ${keyCode}`, () => {
          mockEvent.which = keyCode;
          util.playerHotKeys(mockEvent, player);
          expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
      });
    });
  });
  describe('getAnnotations()', () => {
    describe('for a Presentation 3 Manifest, returns annotation content', () => {
      test('with a motivation array for a painting annotation', () => {
        const canvas = { type: 'Canvas', items: [{ items: [{ motivation: 'painting' }] }] };
        expect(util.getAnnotations(canvas)).toEqual([{ motivation: ['painting'] }]);
      });

      test('with a motivation array for a supplementing annotation', () => {
        const canvas = { type: 'Canvas', items: [{ items: [{ motivation: 'supplementing' }] }] };
        expect(util.getAnnotations(canvas)).toEqual([{ motivation: ['supplementing'] }]);
      });
    });

    describe('for a Presentation 4 Manifest, returns annotation content', () => {
      test('for a painting timeline annotation', () => {
        const timeline = { type: 'Timeline', items: [{ items: [{ motivation: ['painting'] }] }] };
        const content = util.getAnnotations(timeline, 'painting', '4');
        expect(content).toHaveLength(1);
        expect(content[0].motivation).toEqual(['painting']);
      });

      test('for a painting canvas annotation with a duration (video)', () => {
        const canvas = {
          type: 'Canvas', width: 1920, height: 1080, duration: 572.034,
          items: [{ items: [{ motivation: ['painting'] }] }]
        };
        const content = util.getAnnotations(canvas, 'painting', '4');
        expect(content[0].motivation).toEqual(['painting']);
      });

      test('as an empty array for a painting canvas annotation without a duration (image)', () => {
        const canvas = {
          type: 'Canvas', width: 1920, height: 1080, items: [{ items: [{ motivation: ['painting'] }] }]
        };
        const content = util.getAnnotations(canvas, 'painting', '4');
        expect(content).toEqual([]);
      });
    });
  });
});
