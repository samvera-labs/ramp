export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Manifest with json transcript at canvas level with rendering'],
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
                  id: 'https://example.com/sample/high/media.mp4',
                  type: 'Video',
                  format: 'video/mp4',
                  label: {
                    en: ['High'],
                  },
                }
              ],
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/canvas/1/page/2/annotation',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/1/page/2/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/sample/poster.jpg',
                type: 'Image',
                label: {
                  en: ['Canvas Poster Image'],
                },
              },
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
      ],
    },
    {
      id: 'https://example.com/sample/canvas/2',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/high/media.m3u8',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
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
              target: 'https://example.com/sample/canvas/2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/canvas/2/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/2/page/2/annotation',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/sample/subtitles.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format'],
                },
              },
              target: 'https://example.com/sample/canvas/2',
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
