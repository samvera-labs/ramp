export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.json',
  type: 'Manifest',
  label: {
    en: [
      'Beginning Reponsibility: Lunchroom Manners [motion picture] Coronet Films',
    ],
  },
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/medium/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/low/lunchroom_manners_256kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value:
                  'Just before lunch one day, a puppet show was put on at school.',
                format: 'text/plain',
              },
              target:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=22.2,26.6',
            },
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/2/annotation/2',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'It was called "Mister Bungle Goes to Lunch".',
                format: 'text/plain',
              },
              target:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=26.7,31.5',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/0',
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1',
          type: 'Range',
          label: { en: ['Getting Ready for Lunch'] },
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1',
              type: 'Range',
              label: { en: ['Washing Hands'] },
              items: [
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1-1',
                  type: 'Range',
                  label: { en: ['Using Soap'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=157,160',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1-2',
                  type: 'Range',
                  label: '',
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=160,165',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1-3',
                  type: 'Range',
                  label: { en: ['Rinsing Well'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=165,170',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2',
                  type: 'Range',
                  label: { en: ['After Washing Hands'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2-1',
                      type: 'Range',
                      label: { en: ['Drying Hands'] },
                      items: [
                        {
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=170,180',
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2-2',
                      type: 'Range',
                      label: { en: ['Getting Ready'] },
                      items: [
                        {
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=180,190',
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
        {
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2',
          type: 'Range',
          label: { en: ['In the Lunchroom'] },
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1',
              type: 'Range',
              label: { en: ['At the Counter'] },
              items: [
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-1',
                  type: 'Range',
                  label: { en: ['Getting Tray'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=227,245',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-2',
                  type: 'Range',
                  label: { en: ['Choosing Food'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=258,288',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-3',
                  type: 'Range',
                  label: { en: ['There will be Cake'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=301,308',
                      type: 'Canvas',
                    },
                  ],
                },
              ],
            },
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2',
              type: 'Range',
              label: { en: ['At the Table'] },
              items: [
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2-1',
                  type: 'Range',
                  label: { en: ['Sitting Quietly'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=323,333',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2-2',
                  type: 'Range',
                  label: { en: ['Eating Neatly'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=362,378',
                      type: 'Canvas',
                    },
                  ],
                },
              ],
            },
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3',
              type: 'Range',
              label: { en: ['Leavning the Lunchroom'] },
              items: [
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3-1',
                  type: 'Range',
                  label: { en: ['Cleaning Up'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=448,492',
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3-2',
                  type: 'Range',
                  label: { en: ['Putting Things Away'] },
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=511,527',
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
  thumbnail: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
