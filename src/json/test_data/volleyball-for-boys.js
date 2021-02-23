export default {
  ' @context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id:
    'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest',
  label: {
    '@none': ['Volley Ball for Boys'],
  },
  summary: {
    '@none': [
      'Presents in detail, through the use of normal and slow motion photography, the fundamentals of volleyball for boys, including serving, rotation, volleying, set-up, spiking, team offense, defense, and drills to develop skill in execution of fundamentals.',
    ],
  },
  metadata: [
    {
      label: {
        '@none': ['Title'],
      },
      value: {
        '@none': ['Volley Ball for Boys'],
      },
    },
    {
      label: {
        '@none': ['Creator'],
      },
      value: {
        '@none': ['See Other Contributors'],
      },
    },
    {
      label: {
        '@none': ['Date Issued'],
      },
      value: {
        '@none': ['1941'],
      },
    },
    {
      label: {
        '@none': ['Contributor'],
      },
      value: {
        '@none': ['Indiana University, Bloomington. Audio-Visual Center'],
      },
    },
  ],
  rendering: [],
  items: [
    {
      type: 'Canvas',
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1',
      items: [
        {
          type: 'AnnotationPage',
          id:
            'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1/annotation_page/1',
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
                    id:
                      'http://dlib.indiana.edu/iiif_av/volleyball/high/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      '@none': ['high'],
                    },
                  },
                  {
                    id:
                      'http://dlib.indiana.edu/iiif_av/volleyball/medium/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      '@none': ['medium'],
                    },
                  },
                  {
                    id:
                      'http://dlib.indiana.edu/iiif_av/volleyball/low/volleyball-for-boys.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    height: 1080,
                    width: 1920,
                    duration: 662.037,
                    label: {
                      '@none': ['low'],
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
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/1',
      label: 'Volleyball for Boys',
      behavior: 'top',
      items: [
        {
          type: 'Range',
          id:
            'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/2',
          label: 'Volleyball for Boys',
          items: [
            {
              type: 'Canvas',
              id:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/1#t=0,',
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
