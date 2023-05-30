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
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/high/media.mp3',
                      type: 'Audio',
                      format: 'audio/mp3',
                      label: {
                        en: ['High'],
                      },
                    },
                  ],
                },
              ],
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
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
                      id: 'https://example.com/sample/CD-2/high/media.mp3',
                      type: 'Audio',
                      format: 'audio/mp3',
                      label: {
                        en: ['High'],
                      },
                    },
                  ],
                },
              ],
              target: 'https://example.com/sample/canvas/2',
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
              id: 'https://example.com/sample/canvas/1/page/2/annotation',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/sample/transcript-1.json',
                type: 'AnnotationPage',
                label: {
                  en: ['Canvas JSON Transcript'],
                },
              },
              target: 'https://example.com/sample/canvas/1',
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
