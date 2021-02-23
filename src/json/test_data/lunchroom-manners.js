export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id:
    'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest',
  label: {
    '@none': ['Beginning Responsibility: Lunchroom Manners'],
  },
  summary: {
    '@none': [
      'The rude, clumsy puppet Mr. Bungle shows kids how to behave in the school cafeteria - the assumption being that kids actually want to behave during lunch. This film has a cult following since it appeared on a Pee Wee Herman HBO special.',
    ],
  },
  metadata: [
    {
      label: {
        '@none': ['Title'],
      },
      value: {
        '@none': ['Beginning Responsibility: Lunchroom Manners'],
      },
    },
    {
      label: {
        '@none': ['Creator'],
      },
      value: {
        '@none': ['Coronet Films'],
      },
    },
    {
      label: {
        '@none': ['Date Issued'],
      },
      value: {
        '@none': ['1959'],
      },
    },
    {
      label: {
        '@none': ['Note'],
      },
      value: null,
    },
    {
      label: {
        '@none': ['Publisher'],
      },
      value: {
        '@none': ['Coronet Films'],
      },
    },
    {
      label: {
        '@none': ['Subject'],
      },
      value: {
        '@none': ['Social engineering', 'Puppet theater'],
      },
    },
    {
      label: {
        '@none': ['Topical Subject'],
      },
      value: {
        '@none': ['Social engineering', 'Puppet theater'],
      },
    },
  ],
  rendering: [],
  items: [
    {
      type: 'Canvas',
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
      width: 480,
      height: 360,
      duration: 660,
      label: {
        '@none': ['Lunchroom 1'],
      },
      items: [
        {
          type: 'AnnotationPage',
          id:
            'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1/annotation_page/1',
          items: [
            {
              type: 'Annotation',
              motivation: 'painting',
              taget:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=12,32.30',
              body: {
                id:
                  'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
                type: 'Video',
                format: 'video/mp4',
                height: 360,
                width: 480,
                duration: 660,
                label: {
                  '@none': ['high'],
                },
              },
            },
          ],
        },
      ],
    },
  ],
  seeAlso: [
    {
      id:
        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
      type: 'Text',
      format: 'application/webvtt',
      label: 'subtitles',
    },
  ],
  thumbnail: [
    {
      id:
        'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
