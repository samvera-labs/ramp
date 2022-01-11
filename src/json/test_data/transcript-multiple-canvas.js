export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/transcript-multiple-canvas',
  type: 'Manifest',
  label: {
    en: ['Manifest with json transcript at canvas level with rendering'],
  },
  start: {
    id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2',
    type: 'Canvas',
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
      id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2',
      type: 'Canvas',
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/transcript-multiple-canvas/high/media.mp4',
                      type: 'Audio',
                      format: 'audio/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                  ],
                },
              ],
              target:
                'https://example.com/sample/transcript-multiple-canvas/canvas/2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2/page/2/annotation',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/sample/transcript-multiple-canvas/subtitles.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format'],
                },
              },
              target:
                'https://example.com/sample/transcript-multiple-canvas/canvas/2',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://example.com/sample/transcript-multiple-canvas/range/0',
      label: { en: ['Transcript Canvas'] },
      items: [
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/range/1',
          type: 'Range',
          label: { en: ['First title'] },
          items: [
            {
              type: 'Range',
              id: 'https://example.com/sample/transcript-multiple-canvas/range/1-1',
              label: { en: ['First item - 1'] },
              items: [
                {
                  type: 'Canvas',
                  id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=0,123',
                },
              ],
            },
            {
              type: 'Range',
              id: 'https://example.com/sample/transcript-multiple-canvas/range/1-2',
              label: { en: ['Second item - 1'] },
              items: [
                {
                  type: 'Canvas',
                  id: 'https://example.com/sample/transcript-multiple-canvas/canvas/1#t=123,345',
                },
              ],
            },
          ],
        },
        {
          id: 'https://example.com/sample/transcript-multiple-canvas/range/2',
          type: 'Range',
          label: {
            en: ['Second title'],
          },
          items: [
            {
              type: 'Range',
              id: 'https://example.com/sample/transcript-multiple-canvas/range/2-1',
              label: { en: ['First item - 2'] },
              items: [
                {
                  type: 'Canvas',
                  id: 'https://example.com/sample/transcript-multiple-canvas/canvas/2#t=0,210',
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
      id: 'https://example.com/sample/thumbnail/poster.jpg',
      type: 'Image',
    },
  ],
};
