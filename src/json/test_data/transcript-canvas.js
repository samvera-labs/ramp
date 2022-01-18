export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/transcript-canvas',
  type: 'Manifest',
  label: {
    en: ['Manifest with json transcript at canvas level with rendering'],
  },
  start: {
    id: 'https://example.com/sample/transcript-canvas',
    type: 'SpecificResource',
    source: 'https://example.com/sample/transcript-canvas/canvas/2',
    selector: {
      type: 'PointSelector',
      t: 120.5,
    },
  },
  items: [
    {
      id: 'https://example.com/sample/transcript-canvas/canvas/1',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/transcript-canvas/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-canvas/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/transcript-canvas/high/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/transcript-canvas/medium/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                  ],
                },
                {
                  id: 'https://example.com/sample/transcript-canvas/subtitles.vtt',
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: 'https://example.com/sample/transcript-canvas/canvas/1',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/transcript-canvas/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-canvas/canvas/1/page/2/annotation',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/sample/transcript-canvas/transcript-1.json',
                type: 'AnnotationPage',
                label: {
                  en: ['Canvas JSON Transcript'],
                },
              },
              target: 'https://example.com/sample/transcript-canvas/canvas/1',
            },
          ],
        },
      ],
    },
    {
      id: 'https://example.com/sample/transcript-canvas/canvas/2',
      type: 'Canvas',
      duration: 1985,
      items: [
        {
          id: 'https://example.com/sample/transcript-canvas/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-canvas/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://example.com/sample/transcript-canvas/canvas/2',
              body: [],
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://example.com/sample/transcript-canvas/range/0',
      behavior: 'no-nav',
      label: { en: ['Transcript Canvas'] },
      items: [
        {
          id: 'https://example.com/sample/transcript-canvas/range/1',
          type: 'Range',
          label: { en: ['First item'] },
          items: [
            {
              type: 'Canvas',
              id: 'https://example.com/sample/transcript-canvas/canvas/1#t=0,572',
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
