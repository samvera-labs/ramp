export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/lunchroom_manners.json',
  type: 'Manifest',
  label: {
    en: ['Manifest with transcript as annotation'],
  },
  items: [
    {
      id: 'https://example.com/sample/canvas/1',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/high/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/medium/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/low/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
                  id: 'https://example.com/sample/subtitles.vtt',
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/1/page/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'Transcript text line 1',
                format: 'text/plain',
              },
              target: 'https://example.com/sample/canvas/1#t=22.2,26.6',
            },
            {
              id: 'https://example.com/sample/canvas/1/page/2/annotation/2',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'Transcript text line 2',
                format: 'text/plain',
              },
              target: 'https://example.com/sample/canvas/1#t=26.7,31.5',
            },
          ],
        },
      ],
    },
  ],
  thumbnail: [
    {
      id: 'https://example.com/sample/thumbnail/poster.jpg',
      type: 'Image',
    },
  ],
};
