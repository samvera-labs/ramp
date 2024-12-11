import * as annotationParser from './annotations-parser';
import lunchroomManners from '@TestData/lunchroom-manners';

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

const externalAnnotationPage = {
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
          id: 'https://example.com/annotations/avannotate-annotations-canvas-1-library-of-congress.json',
          label: { 'none': ['Library of Congress'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/avannotate-annotations-canvas-1-rolla-southworth.json',
          label: { 'none': ['Rolla Southworth'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/avannotate-annotations-canvas-1-zora-neale-hurston.json',
          label: { 'none': ['Zora Neale Hurston'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotations/avannotate-annotations-canvas-1-herbert-halpert.json',
          label: { 'none': ['Herbert Halpert'] }
        },
      ]
    }
  ]
};

describe('annotation-parser', () => {
  describe('parseAnnotationSets', () => {
    test('returns null when canvasIndex is undefined', () => {
      const annotations = annotationParser.parseAnnotationSets(textualBodyAnnotations);
      expect(annotations).toBeNull();
    });
    test('returns annotations for AnnotationPage with TextualBody annotations', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(textualBodyAnnotations, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(1);
      const { items, label } = annotationSets[0];
      expect(items.length).toEqual(4);
      expect(label).toEqual('Default');
    });

    test('returns annotations for AnnotationPage without TextualBody annotations', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(lunchroomManners, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(1);

      const { items, label } = annotationSets[0];
      expect(items.length).toEqual(1);
      expect(label).toEqual('');
    });

    test('returns AnnotationPage info for AnnotationPage without items property', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(externalAnnotationPage, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(4);

      const { items, label, url } = annotationSets[0];
      expect(items).toBeUndefined();
      expect(url).toEqual('https://example.com/annotations/avannotate-annotations-canvas-1-library-of-congress.json');
      expect(label).toEqual('Library of Congress');
    });
  });

  describe('parseAnnotationItems', () => {
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
      const items = annotationParser.parseAnnotationItems(annotations, 809.0);

      expect(items.length).toEqual(4);
      expect(items[0].motivation).toEqual(['commenting', 'tagging']);
      expect(items[0].id).toEqual('https://example.com/avannotate-test/canvas-1/canvas/page/1');
      expect(items[0].times).toEqual({ start: 0, end: 39 });
      expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      expect(items[0].body).toEqual([
        { format: 'text/plain', purpose: ['commenting'], value: 'Men singing' },
        { format: 'text/plain', purpose: ['tagging'], value: 'Unknown' }]);
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
      expect(items[0].times).toBeUndefined();
      expect(items[0].canvasId).toEqual('https://example.com/manifest/lunchroom_manners/canvas/1');
      expect(items[0].body).toEqual([{
        format: 'text/vtt',
        value: 'Captions in WebVTT format',
        url: 'https://example.com/manifest/lunchroom_manners.vtt',
        isExternal: true,
      }]);
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

        expect(items[0].times).toEqual({ start: 52, end: 60 });
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

        expect(items[0].times).toEqual({ start: 52, end: 60 });
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

        expect(items[0].times).toEqual({ start: 52, end: undefined });
        expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });
    });
  });
});
