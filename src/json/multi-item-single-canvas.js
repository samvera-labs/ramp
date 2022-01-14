export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Stream Media Concat'],
  },
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/canvas/1',
      type: 'Canvas',
      duration: 5814,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,1985',
              body: {
                id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/320Kbps.mp4',
                type: 'Audio',
                format: 'audio/mp4',
                duration: 1985,
              },
            },
            {
              id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1/page/1/annotation/2',
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=1985',
              body: {
                id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD2/high/320Kbps.mp4',
                type: 'Audio',
                format: 'audio/mp4',
                duration: 3829,
              },
            },
          ],
        },
      ],
      thumbnail: [
        {
          id: 'https://fixtures.iiif.io/video/indiana/donizetti-elixir/act1-thumbnail.png',
          type: 'Image',
        },
      ],
    },
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1',
      label: {
        en: ['Multi Item - Single Canvas'],
      },
      items: [
        {
          type: 'Range',
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/2',
          label: {
            en: ['First CD'],
          },
          items: [
            {
              type: 'Canvas',
              id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,1985',
            },
          ],
        },
        {
          type: 'Range',
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/4',
          label: {
            en: ['Second CD'],
          },
          items: [
            {
              type: 'Canvas',
              id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=1985,5814',
            },
          ],
        },
      ],
    },
  ],
};
