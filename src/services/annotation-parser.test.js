import * as annotationParser from './annotations-parser';
import lunchroomManners from '@TestData/lunchroom-manners';
import emptyManifest from '@TestData/empty-manifest';
import * as transcriptParser from './transcript-parser';

// Manifest with inline TextualBody annotations
const textualBodyAnnotations = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/avannotate-test/manifest.json',
  type: 'Manifest',
  label: { en: ['AVAnnotate TextualBody Annotations'] },
  items: [
    {
      id: 'https://example.com/avannotate-test/canvas-1/canvas',
      type: 'Canvas',
      duration: 809.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/avannotate-test/canvas-1/canvas',
          label: { none: ['Default'] },
          items: [
            {
              type: 'Annotation',
              motivation: ['commenting', 'tagging'],
              id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
              body: [
                { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
                { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
              ],
              target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
            }, {
              type: 'Annotation',
              motivation: ['commenting', 'tagging'],
              id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
              body: [
                { type: 'TextualBody', value: 'Alright.', format: 'text/plain', motivation: 'commenting' },
                { type: 'TextualBody', value: 'Herbert Halpert', format: 'text/plain', motivation: 'tagging' }
              ],
              target: 'https://example.com/avannotate-test/canvas-1/canvas#t=1085,1085'
            }, {
              type: 'Annotation',
              motivation: ['commenting', 'tagging'],
              id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
              body: [
                { type: 'TextualBody', value: 'Alright. Let\'s play.', format: 'text/plain', motivation: 'commenting' },
                { type: 'TextualBody', value: 'Herbert Halpert', format: 'text/plain', motivation: 'tagging' }
              ],
              target: 'https://example.com/avannotate-test/canvas-1/canvas#t=1231,1232'
            }, {
              type: 'Annotation',
              motivation: ['commenting', 'tagging'],
              id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
              body: [
                { type: 'TextualBody', value: 'Men singing', format: 'text/plain', motivation: 'commenting' },
                { type: 'TextualBody', value: 'Unknown', format: 'text/plain', motivation: 'tagging' }
              ],
              target: 'https://example.com/avannotate-test/canvas-1/canvas#t=0,39'
            },
          ]
        }
      ],
      items: [
        {
          id: 'https://example.com/avannotate-test/canvas-1/paintings',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/avannotate-test/canvas-1/painting',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/avannotate-test.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 809.0
              },
              target: 'https://example.com/avannotate-test/canvas-1/canvas'
            }
          ]
        }
      ]
    }
  ]
};

// Manifest with linked AnnotationPage resources
const linkedAnnotationPageAnnotations = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/avannotate-annotations/manifest.json',
  type: 'Manifest',
  label: { 'en': ['S1576 , T86-244'] },
  items: [
    {
      id: 'https://example.com/avannotate-annotations/canvas-1/canvas',
      type: 'Canvas',
      duration: 3400.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/library-of-congress.json',
          label: { 'none': ['Library of Congress'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/rolla-southworth.json',
          label: { 'none': ['Rolla Southworth'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/zora-neale-hurston.json',
          label: { 'none': ['Zora Neale Hurston'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/default.json',
          label: { 'none': ['Default'] }
        },
      ],
      items: [
        {
          id: "https://example.com/avannotate-annotations/canvas-1/paintings",
          type: "AnnotationPage",
          items: [
            {
              id: "https://example.com/avannotate-annotations/canvas-1/painting",
              type: "Annotation",
              motivation: "painting",
              body: {
                id: "https://ia601304.us.archive.org/11/items/WPA_1939_Jacksonville_Halpert/T86-244.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 3400
              },
              target: "https://example.com/avannotate-annotations/canvas-1/canvas"
            }
          ]
        }
      ]
    }
  ]
};

// Content in a linked AnnotationPage resource
const annotationPageAnnotations = {
  '@context': "http://iiif.io/api/presentation/3/context.json",
  id: "https://example.com/annotations/default.json",
  type: "AnnotationPage",
  label: "Default",
  items: [
    {
      '@context': "http://www.w3.org/ns/anno.jsonld",
      id: "default-annotation-0.json",
      type: "Annotation",
      motivation: [
        "supplementing",
        "commenting"
      ],
      body: [
        {
          type: "TextualBody",
          value: "Alabama Singleton. I am 33-years-old.",
          format: "text/plain",
          purpose: "commenting"
        },
        {
          type: "TextualBody",
          value: "Default",
          format: "text/plain",
          purpose: "tagging"
        }
      ],
      target: {
        source: {
          id: "http://example.com/s1576-t86-244/canvas-1/canvas",
          type: "Canvas",
          partOf: [
            {
              id: "http://example.com/s1576-t86-244/manifest.json",
              type: "Manifest"
            }
          ]
        },
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value: "t=2761.474609,2764.772727",
        }
      }
    },
    {
      '@context': "http://www.w3.org/ns/anno.jsonld",
      id: "default-annotation-1.json",
      type: "Annotation",
      motivation: [
        "supplementing",
        "commenting"
      ],
      body: [
        {
          type: "TextualBody",
          value: "Savannah, GA",
          format: "text/plain",
          purpose: "commenting"
        },
        {
          type: "TextualBody",
          value: "Default",
          format: "text/plain",
          purpose: "tagging"
        }
      ],
      target: {
        source: {
          id: "http://example.com/s1576-t86-244/canvas-1/canvas",
          type: "Canvas",
          partOf: [
            {
              id: "http://example.com/s1576-t86-244/manifest.json",
              type: "Manifest"
            }
          ]
        },
        selector: {
          type: "PointSelector",
          t: "2766.438533"
        }
      }
    },
    {
      '@context': "http://www.w3.org/ns/anno.jsonld",
      id: "default-annotation-2.json",
      type: "Annotation",
      motivation: [
        "supplementing",
        "commenting"
      ],
      body: [
        {
          type: "TextualBody",
          value: "A play that we used to play when we were children in Savannah.",
          format: "text/plain",
          purpose: "commenting"
        },
        {
          type: "TextualBody",
          value: "Default",
          format: "text/plain",
          purpose: "tagging"
        }
      ],
      target: {
        source: {
          id: "http://example.com/s1576-t86-244/canvas-1/canvas",
          type: "Canvas",
          partOf: [
            {
              id: "http://example.com/s1576-t86-244/manifest.json",
              type: "Manifest"
            }
          ]
        },
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value: "t=2771.900826,2775.619835",
        }
      }
    },
    {
      '@context': "http://www.w3.org/ns/anno.jsonld",
      id: "default-annotation-3.json",
      type: "Annotation",
      motivation: [
        "supplementing",
        "commenting"
      ],
      body: [
        {
          type: "TextualBody",
          value: "A ring play, just a ring play, a children's ring play",
          format: "text/plain",
          purpose: "commenting"
        },
        {
          type: "TextualBody",
          value: "Default",
          format: "text/plain",
          purpose: "tagging"
        }
      ],
      target: {
        source: {
          id: "http://example.com/s1576-t86-244/canvas-1/canvas",
          type: "Canvas",
          partOf: [
            {
              id: "http://example.com/s1576-t86-244/manifest.json",
              type: "Manifest"
            }
          ]
        },
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value: "t=2779.493802,2782.438017",
        }
      }
    },
    {
      '@context': "http://www.w3.org/ns/anno.jsonld",
      id: "default-annotation-4.json",
      type: "Annotation",
      motivation: [
        "supplementing",
        "commenting"
      ],
      body: [
        {
          type: "TextualBody",
          value: "A ring play, yes. When you say 'go all around the maypole' you'll join hands and be going around the ring and then you're showing your emotion and doing a little dance.",
          format: "text/plain",
          purpose: "commenting"
        },
        {
          type: "TextualBody",
          value: "Default",
          format: "text/plain",
          purpose: "tagging"
        }
      ],
      target: {
        source: {
          id: "http://example.com/s1576-t86-244/canvas-1/canvas",
          type: "Canvas",
          partOf: [
            {
              id: "http://example.com/s1576-t86-244/manifest.json",
              type: "Manifest"
            }
          ]
        },
        selector: {
          type: "PointSelector",
          t: "2835.743802"
        }
      }
    }
  ]
};

describe('annotation-parser', () => {
  describe('parseAnnotationSets()', () => {
    test('returns null when canvasIndex is undefined', () => {
      const annotations = annotationParser.parseAnnotationSets(textualBodyAnnotations);
      expect(annotations).toBeNull();
    });
    test('returns annotations for AnnotationPage with TextualBody annotations', () => {
      // Spy on Math.random() for generating random tag colors
      const spy = jest.spyOn(global.Math, 'random');
      // Return 3 different values for the 3 different tags
      spy.mockReturnValueOnce(0.1);
      spy.mockReturnValueOnce(0.5);
      spy.mockReturnValueOnce(0.9);

      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(textualBodyAnnotations, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(1);
      const { items, label } = annotationSets[0];
      expect(items.length).toEqual(4);
      expect(label).toEqual('Default');

      spy.mockRestore();
    });

    test('returns linked annotations for AnnotationPage without TextualBody annotations', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(lunchroomManners, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(1);

      const { format, label, url } = annotationSets[0];
      expect(label).toEqual('Captions in WebVTT format');
      expect(format).toEqual('text/vtt');
      expect(url).toEqual('https://example.com/manifest/lunchroom_manners.vtt');
    });

    test('returns AnnotationPage info for AnnotationPage without items property', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(linkedAnnotationPageAnnotations, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(4);

      const { items, label, url } = annotationSets[0];
      expect(items).toBeUndefined();
      expect(url).toEqual('https://example.com/annotations/library-of-congress.json');
      expect(label).toEqual('Library of Congress');
    });

    test('returns null for empty Manifest', () => {
      const annotations = annotationParser.parseAnnotationSets(emptyManifest, 0);
      expect(annotations).toBeNull();
    });
  });

  describe('parseAnnotationItems()', () => {
    test('returns an empty array for empty list of undefined annotaitons', () => {
      expect(annotationParser.parseAnnotationItems([], 809.0)).toEqual([]);
      expect(annotationParser.parseAnnotationItems()).toEqual([]);
    });

    test('parses Annotation with TextualBody type', () => {
      const annotations = [
        {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        }, {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: 'Alright.', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Herbert Halpert', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=1085,1085'
        }, {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: 'Alright. Let\'s play.', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Herbert Halpert', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=1231,1232'
        }, {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: 'Men singing', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Unknown', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=0,39'
        },
      ];
      // Spy on Math.random() for generating random tag colors
      const spy = jest.spyOn(global.Math, 'random');
      // Return 3 different values for the 3 different tags
      spy.mockReturnValueOnce(0.1);
      spy.mockReturnValueOnce(0.5);
      spy.mockReturnValueOnce(0.9);

      const items = annotationParser.parseAnnotationItems(annotations, 809.0);

      expect(items.length).toEqual(4);
      expect(items[0].motivation).toEqual(['commenting', 'tagging']);
      expect(items[0].id).toEqual('https://example.com/avannotate-test/canvas-1/canvas/page/1');
      expect(items[0].time).toEqual({ start: 0, end: 39 });
      expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      expect(items[0].value.length).toEqual(2);
      expect(items[0].value).toEqual([
        { format: 'text/plain', purpose: ['commenting'], value: 'Men singing' },
        { format: 'text/plain', purpose: ['tagging'], value: 'Unknown', tagColor: 'hsl(324, 80%, 90%)', }]);

      spy.mockRestore();
    });

    test('parses Annotation with Text type', () => {
      const annotations = [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation/1',
          type: 'Annotation',
          motivation: 'supplementing',
          body: {
            id: 'https://example.com/manifest/lunchroom_manners.vtt',
            type: 'Text',
            format: 'text/vtt',
            label: {
              en: ['Captions in WebVTT format'],
            },
            language: 'en',
          },
          target: 'https://example.com/manifest/lunchroom_manners/canvas/1'
        }
      ];
      const items = annotationParser.parseAnnotationItems(annotations, 572.34);
      expect(items[0].motivation).toEqual(['supplementing']);
      expect(items[0].id).toEqual('https://example.com/manifest/lunchroom_manners/canvas/1/annotation/1');
      expect(items[0].time).toBeUndefined();
      expect(items[0].canvasId).toEqual('https://example.com/manifest/lunchroom_manners/canvas/1');
      expect(items[0].value).toEqual([{
        format: 'text/vtt',
        label: 'Captions in WebVTT format',
        url: 'https://example.com/manifest/lunchroom_manners.vtt',
      }]);
    });

    describe('parses purpose in the body of Annotation', () => {
      test('given as a string', () => {
        // Spy on Math.random() for generating random tag colors
        const spy = jest.spyOn(global.Math, 'random');
        spy.mockReturnValueOnce(0.1);

        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: [
              { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
              { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
            ],
            target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items.length).toEqual(1);
        expect(items[0].value).toEqual([
          { format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Inaudible', tagColor: 'hsl(36, 80%, 90%)' }]);

        spy.mockRestore();
      });

      test('given as an array', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: [
              { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: ['commenting'] },
              { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: ['tagging'] }
            ],
            target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items.length).toEqual(1);
        expect(items[0].value).toEqual([
          { format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Inaudible' }]);
      });

      test('not specified with multiple motivations at Annotation level', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain' },
            target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items.length).toEqual(1);
        expect(items[0].value).toEqual([{ format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' }]);
      });

      test('not specified with a single motivations at Annotation level', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: 'supplementing',
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain' },
            target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items.length).toEqual(1);
        expect(items[0].value).toEqual([{ format: 'text/plain', purpose: ['supplementing'], value: '[Inaudible]' }]);
      });
    });

    describe('parses Annotations with target', () => {
      test('defined as a string', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: [
              { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
              { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
            ],
            target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items[0].time).toEqual({ start: 52, end: 60 });
        expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });

      test('defined as a FragmentSelctor', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: [
              { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
              { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
            ],
            target: {
              type: 'SpecificResource',
              source: {
                id: 'https://example.com/avannotate-test/canvas-1/canvas',
                type: 'Canvas',
                partOf: [{
                  id: 'https://example.com/avannotate-test/manifest.json',
                  type: 'Manifest',
                }],
              },
              selector: {
                type: 'FragmentSelector',
                conformsTo: 'http://www.w3.org/TR/media-frags',
                value: 't=52,60'
              }
            }
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items[0].time).toEqual({ start: 52, end: 60 });
        expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });

      test('defined as a PointSelector', () => {
        const annotations = [
          {
            type: 'Annotation',
            motivation: ['commenting', 'tagging'],
            id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
            body: [
              { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
              { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
            ],
            target: {
              type: 'SpecificResource',
              source: {
                id: 'https://example.com/avannotate-test/canvas-1/canvas',
                type: 'Canvas',
                partOf: [{
                  id: 'https://example.com/avannotate-test/manifest.json',
                  type: 'Manifest',
                }],
              },
              selector: {
                type: 'PointSelector',
                t: 52
              }
            }
          }
        ];
        const items = annotationParser.parseAnnotationItems(annotations, 809.0);

        expect(items[0].time).toEqual({ start: 52, end: undefined });
        expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });
    });
  });

  describe('parseExternalAnnotationPage', () => {
    describe('parses annotations for valid linked AnnotationPage', () => {
      let fetchSpy, annotations, spy;
      beforeEach(async () => {
        // Spy on Math.random() for generating random tag colors
        spy = jest.spyOn(global.Math, 'random');
        spy.mockReturnValueOnce(0.2);

        fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
          status: 201,
          ok: true,
          json: jest.fn(() => { return annotationPageAnnotations; })
        });

        annotations = await annotationParser.parseExternalAnnotationPage(
          'https://example.com/annotations/default.json', 3400
        );
      });

      afterEach(() => {
        spy.mockRestore();
      });

      test('returns range Annotation', () => {
        const { _, items } = annotations[0];
        expect(items[0]).toEqual({
          motivation: ['supplementing', 'commenting'],
          id: 'default-annotation-0.json',
          time: { start: 2761.474609, end: 2764.772727 },
          canvasId: 'http://example.com/s1576-t86-244/canvas-1/canvas',
          value: [
            { format: 'text/plain', purpose: ['commenting'], value: 'Alabama Singleton. I am 33-years-old.' },
            { format: 'text/plain', purpose: ['tagging'], value: 'Default', tagColor: 'hsl(72, 80%, 90%)', }
          ]
        });
      });

      test('returns a list Annotation from the AnnotationPage', () => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith('https://example.com/annotations/default.json');
        expect(annotations.length).toEqual(1);

        const { label, items } = annotations[0];
        expect(label).toEqual('Default');
        expect(items).toHaveLength(5);
      });

      test('returns time-point Annotation', () => {
        const { _, items } = annotations[0];
        expect(items[1]).toEqual({
          motivation: ['supplementing', 'commenting'],
          id: 'default-annotation-1.json',
          time: { start: 2766.438533, end: undefined },
          canvasId: 'http://example.com/s1576-t86-244/canvas-1/canvas',
          value: [
            { format: 'text/plain', purpose: ['commenting'], value: 'Savannah, GA' },
            { format: 'text/plain', purpose: ['tagging'], value: 'Default', tagColor: 'hsl(72, 80%, 90%)', }
          ]
        });
      });
    });

    test('returns an empty array for invalid AnnotationPage link', async () => {
      expect(await annotationParser.parseExternalAnnotationPage(
        'http://example.com/lunchroom_manners/annotations/caption.vtt', 572.34
      )).toEqual([]);

      expect(await annotationParser.parseExternalAnnotationPage()).toEqual([]);
    });

    test('returns an empty array for failed fetch request', async () => {
      // Mock console.error function
      const originalError = console.error;
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 404,
      });

      expect(await annotationParser.parseExternalAnnotationPage(
        'http://example.com/lunchroom_manners/annotations/default.json', 572.34
      )).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);

      // Cleanup: restore console.error
      console.error = originalError;
    });

    test('returns an empty array for invalid response body', async () => {
      // Mock console.error function
      const originalError = console.error;
      console.error = jest.fn();

      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: jest.fn(() => { return Promise.reject(new Error()); })
      });

      expect(await annotationParser.parseExternalAnnotationPage(
        'http://example.com/lunchroom_manners/annotations/default.json', 572.34
      )).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);

      // Cleanup: restore console.error
      console.error = originalError;
    });
  });

  describe('parseExternalAnnotationResource()', () => {
    const annoations = {
      canvasId: 'http://example.com/example-manifest/canvas/1',
      format: 'text/vtt',
      id: 'http://example.com/example-manifest/canvas/1/page/annotation-1',
      items: undefined,
      label: 'Captions in WebVTT format',
      linkedResource: true,
      motivation: ['supplementing'],
      url: 'http://example.com/example/captions.vtt',
    };

    test('returns VTT cues as annotations', async () => {
      const parsedTranscript = [
        { end: 21, begin: 1.2, tag: 'TIMED_CUE', text: '[music]' },
        {
          end: 26.6, begin: 22.2, tag: 'TIMED_CUE',
          text: 'Just before lunch one day, a puppet show <br>was put on at school.'
        },
        {
          end: 31.5, begin: 26.7, tag: 'TIMED_CUE',
          text: 'It was called "Mister Bungle Goes to Lunch".'
        },
        {
          end: 34.5, begin: 31.6, tag: 'TIMED_CUE', text: 'It was fun to watch.'
        },
        {
          end: 41.3, begin: 36.1, tag: 'TIMED_CUE',
          text: "In the puppet show, Mr. Bungle came to the <br>boys' room on his way to lunch.",
        }];
      const parseTranscriptDataMock = jest.spyOn(transcriptParser, 'parseTranscriptData')
        .mockResolvedValueOnce({
          tData: parsedTranscript,
        });
      const items = await annotationParser.parseExternalAnnotationResource(annoations);

      expect(parseTranscriptDataMock).toHaveBeenCalledTimes(1);
      expect(items.length).toEqual(5);
      expect(items[0]).toEqual({
        canvasId: 'http://example.com/example-manifest/canvas/1',
        id: 'http://example.com/example-manifest/canvas/1/page/annotation-1',
        motivation: ['supplementing'],
        time: { start: 1.2, end: 21 },
        value: [{ format: 'text/plain', purpose: ['supplementing'], value: '[music]' }]
      });
    });
  });
});
