export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  items: [
    {
      type: 'Canvas',
      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
      label: {
        en: ['Lunchroom 1'],
      },
      items: [
        {
          type: 'AnnotationPage',
          id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1/annotation_page/1',
          items: [
            {
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/stream/master.m3u8',
                type: 'Video',
                format: 'video/mp4',
                height: 360,
                width: 480,
                duration: 660,
                label: {
                  en: ['high'],
                },
              },
              target:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
            },
          ],
        },
      ],
      width: 480,
      height: 360,
      duration: 660,
    },
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/1',
      label: null,
      behavior: 'top',
      items: [
        {
          type: 'Range',
          id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/2',
          label: {
            en: ['Lunchroom 1'],
          },
          items: [
            {
              type: 'Range',
              id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/3',
              label: {
                en: ['Part I'],
              },
              items: [
                {
                  type: 'Canvas',
                  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=0.0,2.0',
                },
              ],
            },
            {
              type: 'Range',
              id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/4',
              label: {
                en: ['Lunchroom'],
              },
              items: [
                {
                  type: 'Range',
                  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/5',
                  label: {
                    en: ['Part III &amp; Part 333'],
                  },
                  items: [
                    {
                      type: 'Canvas',
                      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=120.0,180.0',
                    },
                  ],
                },
                {
                  type: 'Range',
                  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/6',
                  label: {
                    en: ['Part IV'],
                  },
                  items: [
                    {
                      type: 'Canvas',
                      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=180.0,240.0',
                    },
                  ],
                },
                {
                  type: 'Range',
                  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/7',
                  label: {
                    en: ['Part V'],
                  },
                  items: [
                    {
                      type: 'Canvas',
                      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=240.0,300.0',
                    },
                  ],
                },
              ],
            },
            {
              type: 'Range',
              id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/8',
              label: {
                en: ['Lunchroom Reprise'],
              },
              items: [
                {
                  type: 'Range',
                  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/range/9',
                  label: {
                    en: ['Part VI'],
                  },
                  items: [
                    {
                      type: 'Canvas',
                      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1#t=300.0,360.0',
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
  thumbnail: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
