export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://example.com/lunchroom-manners/manifest',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  rendering: [
    {
      id: 'https://example.com/lunchroom_manners/transcript.vtt',
      type: 'Text',
      label: { en: ['Transcript file'] },
      format: 'text/vtt',
    }
  ],
  start: {
    id: 'https://example.com/lunchroom-manners/manifest',
    type: 'SpecificResource',
    source: 'https://example.com/lunchroom-manners/manifest/canvas/2',
    selector: {
      type: 'PointSelector',
      t: 120.5,
    },
  },
  items: [
    {
      type: 'Canvas',
      id: 'https://example.com/lunchroom-manners/manifest/canvas/1',
      width: 480,
      height: 360,
      duration: 660,
      placeholderCanvas: {
        id: "https://example.com/lunchroom_manners/canvas/1/placeholder",
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: "https://example.com/lunchroom_manners/canvas/1/placeholder/1",
            type: "AnnotationPage",
            items: [
              {
                id: "https://example.com/lunchroom_manners/canvas/1/placeholder/1-image",
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: "https://example.com/manifest/poster/lunchroom_manners_poster.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: "https://example.com/lunchroom_manners/canvas/1/placeholder"
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'https://example.com/manifest/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/canvas/1/page/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/manifest/medium/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: 'https://example.com/manifest/low/lunchroom_manners_256kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                    },
                  ],
                },
              ],
              target: 'https://example.com/manifest/canvas/1',
            },
          ]
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
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
          ]
        },
      ]
    },
    {
      type: 'Canvas',
      id: 'https://example.com/lunchroom-manners/manifest/canvas/2',
      width: 480,
      height: 360,
      duration: 660,
      items: [
        {
          id: 'https://example.com/manifest/canvas/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/canvas/2/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/manifest/medium/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                  ],
                },
              ],
              target: 'https://example.com/manifest/canvas/2',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      id: 'https://example.com/manifest/lunchroom_manners/range/0',
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/range/1',
          type: 'Range',
          label: { en: ['Lunchroom Manners'] },
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/range/1-1',
              type: 'Range',
              label: { en: ['Washing Hands'] },
              items: [
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
                  type: 'Range',
                  label: { en: ['Using Soap'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=157,160',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/1-1-3',
                  type: 'Range',
                  label: { en: ['Rinsing Well'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=165,170',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/1-2',
                  type: 'Range',
                  label: { en: ['After Washing Hands'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/1-2-1',
                      type: 'Range',
                      label: { en: ['Drying Hands'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=170,180',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/1-2-2',
                      type: 'Range',
                      label: { en: ['Getting Ready'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=180,190',
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/range/2',
              type: 'Range',
              label: { en: ['In the Lunchroom'] },
              items: [
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/2-1',
                  type: 'Range',
                  label: { en: ['At the Counter'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-1-1',
                      type: 'Range',
                      label: { en: ['Getting Tray'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=227,245',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-1-2',
                      type: 'Range',
                      label: { en: ['Choosing Food'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=258,288',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-1-3',
                      type: 'Range',
                      label: { en: ['There will be Cake'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=301,308',
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/2-2',
                  type: 'Range',
                  label: { en: ['At the Table'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-2-1',
                      type: 'Range',
                      label: { en: ['Sitting Quietly'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=323,333',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-2-2',
                      type: 'Range',
                      label: { en: ['Eating Neatly'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=362,378',
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'https://example.com/manifest/lunchroom_manners/range/2-3',
                  type: 'Range',
                  label: { en: ['Leaving the Lunchroom'] },
                  items: [
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-3-1',
                      type: 'Range',
                      label: { en: ['Cleaning Up'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=448,492',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://example.com/manifest/lunchroom_manners/range/2-3-2',
                      type: 'Range',
                      label: { en: ['Putting Things Away'] },
                      items: [
                        {
                          id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=511,527',
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  thumbnail: [
    {
      id: 'https://example.com/manifest/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
