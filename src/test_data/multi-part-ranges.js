export default {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  id: "http://example.com/multi-part-ranges/manifest.json",
  type: "Manifest",
  label: {
    en: [
      "Cross-canvas Range Test"
    ]
  },
  items: [
    {
      id: "http://example.com/multi-part-ranges/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 600,
      label: {
        en: [
          "Side A"
        ]
      },
      items: [
        {
          id: "http://example.com/multi-part-ranges/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-part-ranges/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/multi-part-ranges/canvas/1",
              body: {
                id: "https://fixtures.iiif.io/audio/indiana/cross-range/side-a.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 600
              }
            }
          ]
        }
      ]
    },
    {
      id: "http://example.com/multi-part-ranges/canvas/2",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 400,
      label: {
        en: [
          "Side B"
        ]
      },
      items: [
        {
          id: "http://example.com/multi-part-ranges/canvas/2/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-part-ranges/canvas/2/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/multi-part-ranges/canvas/2",
              body: {
                id: "https://fixtures.iiif.io/audio/indiana/cross-range/side-b.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 400
              }
            }
          ]
        }
      ]
    }
  ],
  structures: [
    {
      type: 'Range',
      id: 'http://example.com/multi-part-ranges/range/1',
      label: { en: ['Table of Contents'] },
      items: [
        {
          type: 'Range',
          id: 'http://example.com/multi-part-ranges/range/2',
          label: { en: ['Side A'] },
          items: [
            {
              type: 'Range',
              id: 'http://example.com/multi-part-ranges/range/2-1',
              label: { en: ['Track within Side A'] },
              items: [
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/1#t=0,60' },
              ],
            },
            {
              type: 'Range',
              id: 'http://example.com/multi-part-ranges/range/2-2',
              label: { en: ['Track spanning both sides'] },
              items: [
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/1#t=550,600' },
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/2#t=0,100' },
              ],
            },
          ],
        },
        {
          type: 'Range',
          id: 'http://example.com/multi-part-ranges/range/3',
          label: { en: ['Side B'] },
          items: [
            {
              type: 'Range',
              id: 'http://example.com/multi-part-ranges/range/3-1',
              label: { en: ['Track within Side B'] },
              items: [
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/2#t=100,400' },
              ],
            },
          ],
        },
      ],
    },
  ]
};

/* Same Canvases as above, but Canvas 2 only appears as the second part of the spanning
Range, with no top-level section of its own (unlike the "Side A"/"Side B" shape above) --
reproduces a real StructuredNavigation crash where the Canvas-level section list used
for the empty-Canvas check doesn't have an entry per Canvas. */
export const crossRangeNoSectionForSecondCanvas = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  id: "http://example.com/multi-part-ranges/manifest.json",
  type: "Manifest",
  label: { en: ["Cross-canvas Range Test (single top-level section)"] },
  items: [
    {
      id: "http://example.com/multi-part-ranges/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 600,
      label: { en: ["Side A"] },
      items: [
        {
          id: "http://example.com/multi-part-ranges/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-part-ranges/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/multi-part-ranges/canvas/1",
              body: {
                id: "https://fixtures.iiif.io/audio/indiana/cross-range/side-a.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 600
              }
            }
          ]
        }
      ]
    },
    {
      id: "http://example.com/multi-part-ranges/canvas/2",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 400,
      label: { en: ["Side B"] },
      items: [
        {
          id: "http://example.com/multi-part-ranges/canvas/2/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-part-ranges/canvas/2/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/multi-part-ranges/canvas/2",
              body: {
                id: "https://fixtures.iiif.io/audio/indiana/cross-range/side-b.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 400
              }
            }
          ]
        }
      ]
    }
  ],
  structures: [
    {
      type: 'Range',
      id: 'http://example.com/multi-part-ranges/range/1',
      label: { en: ['Table of Contents'] },
      items: [
        {
          type: 'Range',
          id: 'http://example.com/multi-part-ranges/range/2',
          label: { en: ['All tracks'] },
          items: [
            {
              type: 'Range',
              id: 'http://example.com/multi-part-ranges/range/2-1',
              label: { en: ['Track within Side A'] },
              items: [
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/1#t=0,60' },
              ],
            },
            {
              type: 'Range',
              id: 'http://example.com/multi-part-ranges/range/2-2',
              label: { en: ['Track spanning both sides'] },
              items: [
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/1#t=550,600' },
                { type: 'Canvas', id: 'http://example.com/multi-part-ranges/canvas/2#t=0,100' },
              ],
            },
          ],
        },
      ],
    },
  ]
};
