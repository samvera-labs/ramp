export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/transcript-manifest',
  type: 'Manifest',
  label: {
    en: ['Manifest with text transcript at manifest level with rendering'],
  },
  start: {
    id: 'https://example.com/sample/transcript-manifest',
    type: 'SpecificResource',
    source: 'https://example.com/sample/transcript-manifest/canvas/1',
    selector: {
      type: 'PointSelector',
      t: 120.5,
    },
  },
  annotations: [
    {
      id: 'https://example.com/sample/transcript-manifest/canvas/page/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'https://example.com/sample/transcript-manifest/canvas/page/1/annotation',
          type: 'Annotation',
          motivation: 'supplementing',
          body: {
            id: 'https://example.com/transcript.txt',
            type: 'Text',
            label: {
              en: ['Manifest Transcript'],
            },
            format: 'text/txt',
          },
          target: 'https://example.com/sample/transcript-manifest/canvas',
        },
      ],
    },
  ],
  items: [
    {
      id: 'https://example.com/sample/transcript-manifest/canvas/1',
      type: 'Canvas',
      width: 1920,
      height: 1080,
      duration: 662.037,
      items: [
        {
          id: 'https://example.com/sample/transcript-manifest/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-manifest/canvas/1/page/2/annotation',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://example.com/sample/transcript-manifest/canvas/1',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/transcript-manifest/high/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/transcript-manifest/medium/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/transcript-manifest/low/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
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
};
