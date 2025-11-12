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

// Manifest with linked annotation with formats other than AnnotationPage .json
const linkedExternalAnnotations = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/linked-annotations/manifest.json',
  type: 'Manifest',
  label: { 'en': ['Linked External Annotations'] },
  items: [
    {
      id: 'https://example.com/linked-annotations/canvas-1/canvas',
      type: 'Canvas',
      duration: 3400.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/linked-annotations/canvas-1/annotation-page/1',
          items: [
            {
              id: 'https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/linked-annotations/lunchroom_manners.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format (machine-generated)'],
                  none: ['lunchroom_manners-bot.vtt']
                },
                language: 'en',
              },
              target: 'https://example.com/linked-annotations/canvas-1/canvas/1'
            },
            {
              id: 'https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/2',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/linked-annotations/lunchroom_manners.json',
                type: 'Text',
                format: 'application/json',
                label: {
                  en: ['External AnnotationPage'],
                },
                language: 'en',
              },
              target: 'https://example.com/linked-annotations/canvas-1/canvas/1'
            },
            {
              id: 'https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/3',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/linked-annotations/lunchroom_manners.pdf',
                type: 'Text',
                format: 'application/pdf',
                label: {
                  en: ['Text Sample'],
                },
                language: 'en',
              },
              target: 'https://example.com/linked-annotations/canvas-1/canvas/1'
            }
          ]
        }
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

// Manifest with inline TextualBody annotations with 
// label/value and multiple annotations with same timestamps
const aviaryTextualBodyAnnotations = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/aviary-test/manifest.json',
  type: 'Manifest',
  label: { en: ['Aviary TextualBody Annotations'] },
  items: [
    {
      id: 'https://example.com/aviary-test/canvas-1/canvas',
      type: 'Canvas',
      duration: 809.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/aviary-test/canvas-1/canvas',
          label: { none: ['Aviary Intro'] },
          items: [
            {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/aviary-test/canvas-1/canvas/page/1',
              body: [
                {
                  type: 'TextualBody', value: 'Example Title #1', format: 'text/plain',
                  label: { 'en': ['Title'] },
                }
              ],
              target: 'https://example.com/aviary-test/canvas-1/canvas#t=52,60'
            }, {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/aviary-test/canvas-1/canvas/page/1',
              body: [
                {
                  type: 'TextualBody', value: 'Example Synopsis #1', format: 'text/plain',
                  label: { 'en': ['Synopsis'] },
                }
              ],
              target: 'https://example.com/aviary-test/canvas-1/canvas#t=52,60'
            }, {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/aviary-test/canvas-1/canvas/page/1',
              body: [
                {
                  type: 'TextualBody', value: 'Example Title #2', format: 'text/plain',
                  label: { 'en': ['Title'] }
                }
              ],
              target: 'https://example.com/aviary-test/canvas-1/canvas#t=1231,1232'
            }, {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/aviary-test/canvas-1/canvas/page/1',
              body: [
                {
                  type: 'TextualBody', value: 'Example Synopsis #2', format: 'text/plain',
                  label: { 'en': ['Synopsis'] }
                }
              ],
              target: 'https://example.com/aviary-test/canvas-1/canvas#t=1231,1232'
            }, {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/aviary-test/canvas-1/canvas/page/1',
              body: [
                {
                  type: 'TextualBody', value: 'Parent Title', format: 'text/plain',
                  label: { 'en': ['Title'] }
                }
              ],
              target: 'https://example.com/aviary-test/canvas-1/canvas#t=0,39'
            },
          ]
        }
      ],
      items: [
        {
          id: 'https://example.com/aviary-test/canvas-1/paintings',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/aviary-test/canvas-1/painting',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/aviary-test.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 809.0
              },
              target: 'https://example.com/aviary-test/canvas-1/canvas'
            }
          ]
        }
      ]
    }
  ]
};

// Manifest with Text type annotation without label
const textAnnotationsWoLabels = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/annotation-label/manifest.json',
  type: 'Manifest',
  label: { en: ['Aviary Text Annotations'] },
  items: [
    {
      id: 'https://example.com/annotation-label/canvas-1/canvas',
      type: 'Canvas',
      duration: 809.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/annotation-label/canvas-1/canvas/vtt',
          items: [
            {
              type: 'Annotation',
              motivation: 'supplementing',
              id: 'https://example.com/annotation-label/canvas-1/canvas/vtt/1',
              body: [
                {
                  type: 'Text',
                  format: 'text/vtt',
                  id: 'https://example.com/annotation-label/iiif/caption-file.vtt',
                }
              ],
              target: 'https://example.com/annotation-label/canvas-1/canvas'
            }
          ]
        }
      ],
      items: [
        {
          id: 'https://example.com/annotation-label/canvas-1/paintings',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/annotation-label/canvas-1/painting',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/annotation-label/media.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 809.0
              },
              target: 'https://example.com/annotation-label/canvas-1/canvas'
            }
          ]
        }
      ]
    }
  ]
};

// Playlist Manifest with markers and transcript in annotations list (Avalon specific)
const mixedMotivationAnnotations = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/linked-annotations/manifest.json',
  type: 'Manifest',
  label: { 'en': ['Mixed motivation Annotations'] },
  items: [
    {
      id: 'https://example.com/linked-mixed-annotations/canvas-1/canvas',
      type: 'Canvas',
      duration: 3400.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1',
          items: [
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/linked-mixed-annotations/lunchroom_manners/supplemental/1/transcripts',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Transcript in WebVTT format'],
                },
                language: 'en',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1'
            },
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/2',
              type: 'Annotation',
              motivation: 'highlighting',
              body: {
                id: '',
                type: 'TextualBody',
                format: 'text/html',
                value: 'Test Marker 1',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=76.43'
            },
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/3',
              type: 'Annotation',
              motivation: 'highlighting',
              body: {
                id: '',
                type: 'TextualBody',
                format: 'text/html',
                value: 'Test Marker 2',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=163.85'
            },
          ]
        }
      ],
      items: [
        {
          id: "https://example.com/linked-mixed-annotations/canvas-1/paintings",
          type: "AnnotationPage",
          items: [
            {
              id: "https://example.com/linked-mixed-annotations/canvas-1/painting",
              type: "Annotation",
              motivation: "painting",
              body: {
                id: "https://example.com/linked-mixed-annotations/mahler-symphony.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 3400
              },
              target: "https://example.com/linked-mixed-annotations/canvas-1/canvas"
            }
          ]
        }
      ]
    }
  ]
};

// Playlist Manifest with markers and captions in annotations list (Avalon specific)
const highlightingAnnotationWithCaptions = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/linked-annotations/manifest.json',
  type: 'Manifest',
  label: { 'en': ['Mixed motivation Annotations'] },
  items: [
    {
      id: 'https://example.com/linked-mixed-annotations/canvas-1/canvas',
      type: 'Canvas',
      duration: 3400.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1',
          items: [
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/linked-mixed-annotations/lunchroom_manners/supplemental/1/captions',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format'],
                },
                language: 'en',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1'
            },
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/2',
              type: 'Annotation',
              motivation: 'highlighting',
              body: {
                id: '',
                type: 'TextualBody',
                format: 'text/html',
                value: 'Test Marker 1',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=76.43'
            },
            {
              id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/3',
              type: 'Annotation',
              motivation: 'highlighting',
              body: {
                id: '',
                type: 'TextualBody',
                format: 'text/html',
                value: 'Test Marker 2',
              },
              target: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1#t=163.85'
            },
          ]
        }
      ],
      items: [
        {
          id: "https://example.com/linked-mixed-annotations/canvas-1/paintings",
          type: "AnnotationPage",
          items: [
            {
              id: "https://example.com/linked-mixed-annotations/canvas-1/painting",
              type: "Annotation",
              motivation: "painting",
              body: {
                id: "https://example.com/linked-mixed-annotations/mahler-symphony.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 3400
              },
              target: "https://example.com/linked-mixed-annotations/canvas-1/canvas"
            }
          ]
        }
      ]
    }
  ]
};

describe('annotation-parser', () => {
  describe('parseAnnotationSets()', () => {
    test('returns null when canvasIndex is undefined', () => {
      const annotations = annotationParser.parseAnnotationSets(textualBodyAnnotations);
      expect(annotations).toBeNull();
    });

    describe('parses Annotation with TextualBody type', () => {
      test('with multiple TextualBody objects in a single Annotation', () => {
        // Spy on Math.random() for generating random tag colors
        const mathRandomSpy = jest.spyOn(Math, 'random');
        // Return 3 different values for the 3 different tags
        mathRandomSpy.mockReturnValueOnce(0.1);
        mathRandomSpy.mockReturnValueOnce(0.5);
        mathRandomSpy.mockReturnValueOnce(0.9);

        const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(textualBodyAnnotations, 0);
        expect(canvasIndex).toEqual(0);
        expect(annotationSets.length).toEqual(1);
        const { items, label } = annotationSets[0];
        expect(items.length).toEqual(4);
        expect(label).toEqual('Default');

        expect(items[0].motivation).toEqual(['commenting', 'tagging']);
        expect(items[0].id).toEqual('https://example.com/avannotate-test/canvas-1/canvas/page/1');
        expect(items[0].time).toEqual({ start: 0, end: 39 });
        expect(items[0].canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
        expect(items[0].value.length).toEqual(2);
        expect(items[0].value).toEqual([
          { format: 'text/plain', purpose: ['commenting'], value: 'Men singing' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Unknown', tagColor: 'hsl(324, 80%, 90%)', }]);

        mathRandomSpy.mockRestore();
      });

      test('with label/value into a single value', () => {
        const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(aviaryTextualBodyAnnotations, 0);
        expect(canvasIndex).toEqual(0);
        expect(annotationSets.length).toEqual(1);
        const { items, label } = annotationSets[0];
        expect(items.length).toEqual(3);
        expect(label).toEqual('Aviary Intro');

        expect(items[0].motivation).toEqual(['supplementing']);
        expect(items[0].id).toEqual('https://example.com/aviary-test/canvas-1/canvas/page/1');
        expect(items[0].time).toEqual({ start: 0, end: 39 });
        expect(items[0].canvasId).toEqual('https://example.com/aviary-test/canvas-1/canvas');
        expect(items[0].value.length).toEqual(1);
        expect(items[0].value).toEqual([
          { format: 'text/plain', purpose: ['supplementing'], value: '<strong>Title</strong>: Parent Title' }]);
      });

      test('with multiple annotations for a single time-point combined into one annotation', () => {
        const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(aviaryTextualBodyAnnotations, 0);
        expect(canvasIndex).toEqual(0);
        expect(annotationSets.length).toEqual(1);
        const { items, label } = annotationSets[0];
        expect(items.length).toEqual(3);
        expect(label).toEqual('Aviary Intro');

        expect(items[1].motivation).toEqual(['supplementing']);
        expect(items[1].id).toEqual('https://example.com/aviary-test/canvas-1/canvas/page/1');
        expect(items[1].time).toEqual({ start: 52, end: 60 });
        expect(items[1].canvasId).toEqual('https://example.com/aviary-test/canvas-1/canvas');
        expect(items[1].value.length).toEqual(2);
        expect(items[1].value).toEqual([
          { format: 'text/plain', purpose: ['supplementing'], value: '<strong>Title</strong>: Example Title #1' },
          { format: 'text/plain', purpose: ['supplementing'], value: '<strong>Synopsis</strong>: Example Synopsis #1' }
        ]);
      });
    });

    /**
     * In one of the sample Aviary manifests, a Text typed Annotation was
     * presented without a label in the body. This test-case covers the
     * bug-fix implemented for label parsing in parseAnnotationBody().
    */
    test('parses Text Annotation without label', () => {
      const { canvasIndex, annotationSets } = annotationParser.parseAnnotationSets(textAnnotationsWoLabels, 0);
      expect(canvasIndex).toEqual(0);
      expect(annotationSets.length).toEqual(1);

      const { filename, format, label, url } = annotationSets[0];
      expect(label).toEqual('caption-file');
      expect(format).toEqual('text/vtt');
      expect(filename).toEqual('caption-file.vtt');
      expect(url).toEqual('https://example.com/annotation-label/iiif/caption-file.vtt');
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
      const { canvasIndex, annotationSets }
        = annotationParser.parseAnnotationSets(linkedAnnotationPageAnnotations, 0);
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

    describe('parses AnnotationPage with linked external Annotation with type Text', () => {
      test('returns all linked annotations', () => {
        const { _, annotationSets } = annotationParser.parseAnnotationSets(linkedExternalAnnotations, 0);
        expect(annotationSets.length).toEqual(3);
      });

      test('returns \'application/pdf\' format annotation with timed=false', () => {
        const { _, annotationSets } = annotationParser.parseAnnotationSets(linkedExternalAnnotations, 0);
        expect(annotationSets.length).toEqual(3);
        expect(annotationSets.filter((a) => a.label == 'Text Sample').length).toBe(1);
        const pdfAnnotation = annotationSets.filter((a) => a.label == 'Text Sample')[0];
        expect(pdfAnnotation.motivation).toEqual(['supplementing']);
        expect(pdfAnnotation.id).toEqual('https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/3');
        expect(pdfAnnotation.time).toBeUndefined();
        expect(pdfAnnotation.canvasId).toEqual('https://example.com/linked-annotations/canvas-1/canvas/1');
        expect(pdfAnnotation.format).toEqual('application/pdf');
        expect(pdfAnnotation.linkedResource).toBeTruthy();
        expect(pdfAnnotation.url).toEqual('https://example.com/linked-annotations/lunchroom_manners.pdf');
        expect(pdfAnnotation.label).toEqual('Text Sample');
        expect(pdfAnnotation.filename).toEqual('Text Sample');
        expect(pdfAnnotation.timed).toBeFalsy();
        expect(pdfAnnotation.isMachineGen).toBeFalsy();
      });

      test('returns an annotation set for format \'text/vtt\'', () => {
        const { _, annotationSets } = annotationParser.parseAnnotationSets(linkedExternalAnnotations, 0);
        expect(annotationSets[0].motivation).toEqual(['supplementing']);
        expect(annotationSets[0].id).toEqual('https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/1');
        expect(annotationSets[0].time).toBeUndefined();
        expect(annotationSets[0].canvasId).toEqual('https://example.com/linked-annotations/canvas-1/canvas/1');
        expect(annotationSets[0].format).toEqual('text/vtt');
        expect(annotationSets[0].linkedResource).toBeTruthy();
        expect(annotationSets[0].url).toEqual('https://example.com/linked-annotations/lunchroom_manners.vtt');
        expect(annotationSets[0].label).toEqual('Captions in WebVTT format (machine-generated)');
        expect(annotationSets[0].filename).toEqual('lunchroom_manners-bot.vtt');
        expect(annotationSets[0].timed).toBeTruthy();
        expect(annotationSets[0].isMachineGen).toBeFalsy();
      });

      test('returns an annotation set for format \'application/json\'', () => {
        const { _, annotationSets } = annotationParser.parseAnnotationSets(linkedExternalAnnotations, 0);
        expect(annotationSets[1].motivation).toEqual(['supplementing']);
        expect(annotationSets[1].id).toEqual('https://example.com/linked-annotations/canvas-1/annotation-page/1/annotation/2');
        expect(annotationSets[1].time).toBeUndefined();
        expect(annotationSets[1].canvasId).toEqual('https://example.com/linked-annotations/canvas-1/canvas/1');
        expect(annotationSets[1].format).toEqual('application/json');
        expect(annotationSets[1].linkedResource).toBeFalsy();
        expect(annotationSets[1].url).toEqual('https://example.com/linked-annotations/lunchroom_manners.json');
        expect(annotationSets[1].label).toEqual('External AnnotationPage');
        expect(annotationSets[1].filename).toEqual('External AnnotationPage');
        expect(annotationSets[1].timed).toBeTruthy();
        expect(annotationSets[1].isMachineGen).toBeFalsy();
      });
    });

    describe('parses AnnotationPage with both linked and inline annotations', () => {
      test('returns separate annotationSets for each linked and inline annotations', () => {
        const { canvasIndex, annotationSets }
          = annotationParser.parseAnnotationSets(mixedMotivationAnnotations, 0);
        expect(canvasIndex).toEqual(0);
        expect(annotationSets.length).toEqual(2);

        // For the supplementing transcript annotation
        expect(annotationSets[0].motivation).toEqual(['supplementing']);
        expect(annotationSets[0].items).toBeUndefined();
        expect(annotationSets[0].label).toEqual('Transcript in WebVTT format');

        // For 2 highlight annotations
        expect(annotationSets[1].items.length).toEqual(0);
        expect(annotationSets[1].markers.length).toEqual(2);
        expect(annotationSets[1].markers[0]).toEqual({
          id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/2',
          time: 76.43,
          timeStr: '00:01:16.430',
          canvasId: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1',
          value: 'Test Marker 1',
        });
      });

      // Avalon playlist item with captions
      test('does not return annotationSet for linked annotation as captions (Avalon specific)', () => {
        const { canvasIndex, annotationSets }
          = annotationParser.parseAnnotationSets(highlightingAnnotationWithCaptions, 0);

        expect(canvasIndex).toEqual(0);
        expect(annotationSets.length).toEqual(1);

        // For 2 highlight annotations
        expect(annotationSets[0].items.length).toEqual(0);
        expect(annotationSets[0].markers.length).toEqual(2);
        expect(annotationSets[0].markers[1]).toEqual({
          id: 'https://example.com/linked-mixed-annotations/canvas-1/annotation-page/1/annotation/3',
          time: 163.85,
          timeStr: '00:02:43.850',
          canvasId: 'https://example.com/linked-mixed-annotations/canvas-1/canvas/1',
          value: 'Test Marker 2',
        });
      });
    });
  });

  describe('parseAnnotationItem()', () => {
    test('returns an empty array for undefined/null annotation', () => {
      expect(annotationParser.parseAnnotationItem(undefined, 809.0)).toEqual(undefined);
      expect(annotationParser.parseAnnotationItem(null, 890.0)).toEqual(undefined);
      expect(annotationParser.parseAnnotationItem()).toEqual(undefined);
    });

    test('parses Annotation with TextualBody type', () => {
      const annotation = {
        type: 'Annotation',
        motivation: ['commenting', 'tagging'],
        id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
        body: [
          { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
          { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
        ],
        target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
      };
      // Spy on Math.random() for generating random tag colors
      const mathRandomSpy = jest.spyOn(Math, 'random');
      mathRandomSpy.mockReturnValueOnce(0.1);

      const item = annotationParser.parseAnnotationItem(annotation, 809.0);

      expect(item.motivation).toEqual(['commenting', 'tagging']);
      expect(item.id).toEqual('https://example.com/avannotate-test/canvas-1/canvas/page/1');
      expect(item.time).toEqual({ start: 52, end: 60 });
      expect(item.canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      expect(item.value.length).toEqual(2);
      expect(item.value).toEqual([
        { format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' },
        { format: 'text/plain', purpose: ['tagging'], value: 'Inaudible', tagColor: 'hsl(36, 80%, 90%)', }]);

      mathRandomSpy.mockRestore();
    });

    describe('parses purpose in the body of Annotation', () => {
      test('given as a string', () => {
        const annotation =
        {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        };
        // Spy on Math.random() for generating random tag colors
        const mathRandomSpy = jest.spyOn(Math, 'random');
        mathRandomSpy.mockReturnValueOnce(0.1);

        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.value).toEqual([
          { format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Inaudible', tagColor: 'hsl(36, 80%, 90%)' }]);

        mathRandomSpy.mockRestore();
      });

      test('given as an array', () => {
        const annotation = {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: ['commenting'] },
            { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: ['tagging'] }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.value).toEqual([
          { format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' },
          { format: 'text/plain', purpose: ['tagging'], value: 'Inaudible' }]);
      });

      test('not specified with multiple motivations at Annotation level', () => {
        const annotation = {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain' },
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.value).toEqual(
          [{ format: 'text/plain', purpose: ['commenting'], value: '[Inaudible]' }]
        );
      });

      test('not specified with a single motivations at Annotation level', () => {
        const annotation = {
          type: 'Annotation',
          motivation: 'supplementing',
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain' },
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.value).toEqual(
          [{ format: 'text/plain', purpose: ['supplementing'], value: '[Inaudible]' }]
        );
      });
    });

    describe('parses Annotations with target', () => {
      test('defined as a string', () => {
        const annotation = {
          type: 'Annotation',
          motivation: ['commenting', 'tagging'],
          id: 'https://example.com/avannotate-test/canvas-1/canvas/page/1',
          body: [
            { type: 'TextualBody', value: '[Inaudible]', format: 'text/plain', motivation: 'commenting' },
            { type: 'TextualBody', value: 'Inaudible', format: 'text/plain', motivation: 'tagging' }
          ],
          target: 'https://example.com/avannotate-test/canvas-1/canvas#t=52,60'
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.time).toEqual({ start: 52, end: 60 });
        expect(item.canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });

      test('defined as a FragmentSelctor', () => {
        const annotation = {
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
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.time).toEqual({ start: 52, end: 60 });
        expect(item.canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });

      test('defined as a PointSelector', () => {
        const annotation = {
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
        };
        const item = annotationParser.parseAnnotationItem(annotation, 809.0);

        expect(item.time).toEqual({ start: 52, end: undefined });
        expect(item.canvasId).toEqual('https://example.com/avannotate-test/canvas-1/canvas');
      });
    });
  });

  describe('parseExternalAnnotationPage()', () => {
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
          time: { start: 2761.475, end: 2764.773 },
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
    const annotations = {
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
      const items = await annotationParser.parseExternalAnnotationResource(annotations);

      expect(parseTranscriptDataMock).toHaveBeenCalledTimes(1);
      expect(items.length).toEqual(5);
      expect(items[0]).toEqual({
        canvasId: 'http://example.com/example-manifest/canvas/1',
        id: 'http://example.com/example-manifest/canvas/1/page/annotation-1-0',
        motivation: ['supplementing'],
        time: { start: 1.2, end: 21 },
        value: [{ format: 'text/plain', purpose: ['supplementing'], value: '[music]' }]
      });
    });
  });
});
