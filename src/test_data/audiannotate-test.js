export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/audiannotate-test/manifest.json',
  type: 'Manifest',
  label: { en: ['AudiAnnotate Test Manifest'] },
  homepage: [
    {
      id: 'archive.org',
      type: 'Text',
      label: { en: ['AudiAnnotate Test'] },
      format: 'text/html'
    }
  ],
  provider: [
    {
      id: 'archive.org',
      type: 'Agent',
      label: { en: ['Internet Archive'] }
    }
  ],
  items: [
    {
      id: 'https://example.com/audiannotate-test/canvas-1/canvas',
      type: 'Canvas',
      duration: 809.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/audiannotate-test/annotations/audiannotate-test-canvas-1-shadow.json',
          label: { none: ['Shadow'] }
        }
      ],
      items: [
        {
          id: 'https://example.com/audiannotate-test/canvas-1/paintings',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/audiannotate-test/canvas-1/painting',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/audiannotate-test.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 809.0
              },
              target: 'https://example.com/audiannotate-test/canvas-1/canvas'
            }
          ]
        }
      ]
    },
    {
      id: 'https://example.com/audiannotate-test/canvas-2/canvas',
      type: 'Canvas',
      duration: 3204.0,
      annotations: [
        {
          type: 'AnnotationPage',
          id: 'https://example.com/audiannotate-test/annotations/audiannotate-test-canvas-2-carvel-collins.json',
          label: { none: ['Carvel Collins'] }
        },
        {
          type: 'AnnotationPage',
          id: 'https://example.com/audiannotate-test/annotations/audiannotate-test-canvas-2-audience.json',
          label: { none: ['Audience'] }
        }
      ],
      items: [
        {
          id: 'https://example.com/audiannotate-test/canvas-2/paintings',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/audiannotate-test/canvas-2/painting',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: '',
                duration: 3204.0
              },
              target: 'https://example.com/audiannotate-test/canvas-2/canvas'
            }
          ]
        }
      ]
    }
  ]
};