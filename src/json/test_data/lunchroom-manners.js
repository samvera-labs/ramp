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
      items: [
        {
          id: 'https://example.com/manifest/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/canvas/1/page/annotation',
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
                {
                  id: 'https://example.com/manifest/lunchroom_manners.vtt',
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: 'https://example.com/manifest/canvas/1',
            },
          ],
        },
      ],
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
  thumbnail: [
    {
      id: 'https://example.com/manifest/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
