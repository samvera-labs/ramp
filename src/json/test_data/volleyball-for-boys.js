export default {
  ' @context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest',
  label: {
    en: ['Volley Ball for Boys'],
  },
  rendering: [],
  start: {
    id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest',
    type: 'SpecificResource',
    source:
      'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1',
    selector: {
      type: 'PointSelector',
      t: 120.5,
    },
  },
  items: [
    {
      type: 'Canvas',
      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1',
      items: [
        {
          type: 'AnnotationPage',
          id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1/annotation_page/1',
          items: [
            {
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/#t=44.53,100.403',
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'http://dlib.indiana.edu/iiif_av/volleyball/high/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      en: ['high'],
                    },
                  },
                  {
                    id: 'http://dlib.indiana.edu/iiif_av/volleyball/medium/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      en: ['medium'],
                    },
                  },
                  {
                    id: 'http://dlib.indiana.edu/iiif_av/volleyball/low/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      en: ['low'],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
      width: 1920,
      height: 1080,
      duration: 662.037,
    },
  ],
  structures: [
    {
      type: 'Range',
      behavior: 'no-nav',
      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/1',
      label: { en: ['Volleyball for Boys'] },
      items: [
        {
          type: 'Range',
          id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/2',
          label: { en: ['Volleyball for Boys'] },
          items: [
            {
              type: 'Canvas',
              id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1#t=0,',
            },
          ],
        },
      ],
    },
  ],
  thumbnail: [
    {
      id: 'http://dlib.indiana.edu/iiif_av/volleyball/thumbnail.jpg',
      type: 'Image',
    },
  ],
};
