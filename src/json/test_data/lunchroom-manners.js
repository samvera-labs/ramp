export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id:
    'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  rendering: [],
  items: [
    {
      type: 'Canvas',
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
      width: 480,
      height: 360,
      duration: 660,
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/medium/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/low/lunchroom_manners_256kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                    },
                  ],
                },
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
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
    },
    {
      type: 'Canvas',
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/2',
      width: 480,
      height: 360,
      duration: 660,
      items: [
        {
          id:
            'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/2/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/medium/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                  ],
                },
              ],
              target:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/2',
            },
          ],
        },
      ],
    },
  ],
  thumbnail: [
    {
      id:
        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
