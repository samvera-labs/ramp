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

    test('with format hhLmm:ss,ms', () => {
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
  });

  describe('parseResourceAnnotations()', () => {
    describe('parses painting annotations', () => {
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
              annotations, 572.32, 'painting'
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 0, customStart: 0, end: 572.32, start: 0, duration: 572.32 });
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

          test('with a custom start', () => {
            const { resources, canvasTargets, isMultiSource } = util.parseResourceAnnotations(
              annotations, 572.32, 'painting', 120
            );
            expect(resources).toHaveLength(2);
            expect(canvasTargets).toHaveLength(1);
            expect(canvasTargets[0]).toEqual({ altStart: 0, customStart: 120, end: 572.32, start: 0, duration: 572.32 });
            expect(resources[0]).toEqual({
              src: 'http://example.com/manifest/media/low.mp4#t=120,572.32',
              key: 'http://example.com/manifest/media/low.mp4',
              type: 'video/mp4',
              kind: 'Video',
              label: 'Low',
            });
            expect(resources[1]).toEqual({
              src: 'http://example.com/manifest/media/high.mp4#t=120,572.32',
              key: 'http://example.com/manifest/media/high.mp4',
              type: 'video/mp4',
              kind: 'Video',
              label: 'High',
            });
            expect(isMultiSource).toBeFalsy();
          });
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
              annotations, 572.32, 'painting', 0, true
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
              annotations, 572.32, 'painting', 0, true
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
          annotations, 896.55, 'painting'
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
        annotations, 896.55, 'supplementing'
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

    test('with annotations undefined', () => {
      expect(util.parseResourceAnnotations(undefined, 572.32, 'supplementing')).toEqual({
        resources: [], error: 'No resources found in Canvas', poster: '',
        canvasTargets: [], isMultiSource: false
      });
    });

    describe('for empty Canvas', () => {
      /** Use-case: Avalon's empty Canvas representation for restricted/deleted resources */
      test('with zero annotations', () => {
        let originalError = console.error;
        console.error = jest.fn();
        expect(util.parseResourceAnnotations([], NaN, 'painting')).toEqual({
          resources: [],
          canvasTargets: [],
          isMultiSource: false,
          poster: 'This item cannot be played.'
        });
        console.error = originalError;
      });

      /** Use-case: AudiAnnotate's empty Canvas representation for unavailable resources */
      test('with annotations without resource information', () => {
        let originalError = console.error;
        console.error = jest.fn();
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
          annotations, 3204.0, 'painting'
        );
        expect(resources).toHaveLength(0);
        expect(canvasTargets).toHaveLength(0);
        expect(isMultiResource).toBeFalsy();
        expect(poster).toEqual('This item cannot be played.');
        console.error = originalError;
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
});
