export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id:
    'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Video of a 30-minute digital clock'],
  },
  start: {
    id:
      'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/canvas-start/segment1',
    type: 'SpecificResource',
    source:
      'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/canvas/segment1',
    selector: {
      type: 'PointSelector',
      t: 150.5,
    },
  },
  items: [
    {
      id:
        'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/canvas/segment1',
      type: 'Canvas',
      duration: 1801.055,
      items: [
        {
          id:
            'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/annotation/segment1/page',
          type: 'AnnotationPage',
          items: [
            {
              id:
                'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/annotation/segment1-video',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id:
                  'https://fixtures.iiif.io/video/indiana/30-minute-clock/medium/30-minute-clock.mp4',
                type: 'Video',
                duration: 1801.055,
                format: 'video/mp4',
              },
              target:
                'https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/canvas/segment1',
            },
          ],
        },
      ],
    },
  ],
};
