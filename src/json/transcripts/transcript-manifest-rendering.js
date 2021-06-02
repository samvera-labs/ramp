export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://dlib.indiana.edu/iiif-av/volleyball/.json',
  type: 'Manifest',
  label: {
    en: ['Volleyball for Boys'],
  },
  rendering: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/volleyball/volleyball.txt',
      type: 'Text',
      label: {
        en: ['Manifest Transcript'],
      },
      format: 'text/txt',
    },
  ],
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/volleyball/canvas',
      type: 'Canvas',
      width: 1920,
      height: 1080,
      duration: 662.037,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/volleyball/canvas/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/volleyball/canvas/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://dlib.indiana.edu/iiif_av/volleyball/canvas',
              body: {
                id: 'https://dlib.indiana.edu/iiif_av/volleyball/high/volleyball-for-boys.mp4',
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
