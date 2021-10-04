export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Manifest with text transcript at manifest level with rendering'],
  },
  annotations: [
    {
      id: 'https://example.com/sample/canvas/page/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'https://example.com/sample/canvas/page/1/annotation',
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
          target: 'https://example.com/sample/canvas',
        },
      ],
    },
  ],
  items: [
    {
      id: 'https://example.com/sample/canvas',
      type: 'Canvas',
      width: 1920,
      height: 1080,
      duration: 662.037,
      items: [
        {
          id: 'https://example.com/sample/canvas/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/page/2/annotation',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://example.com/sample/canvas',
              body: {
                id: 'https://example.com/sample/high/media.mp4',
                type: 'Video',
                format: 'video/mp4',
                height: 1080,
                width: 1920,
                duration: 662.037,
              },
            },
          ],
        },
      ],
    },
  ],
};
