export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id:
    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/mahler-symphony-3.json',
  type: 'Manifest',
  label: {
    en: ['Symphony no. 3 - Mahler, Gustav, 1860-1911'],
  },
  description:
    'Published by the Indiana University School of Music. Recorded Jan. 17-18, 1995, in the Musical Arts Center, Bloomington, Ind. Compact disc',
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1',
      type: 'Canvas',
      duration: 1985,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/annopage/1',
          type: 'AnnotationPage',
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/annopage/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://dlib.indiana.edu/iiif_av/canvas/1',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/high/320Kbps.mp4',
                      type: 'Audio',
                      format: 'audio/mp4; codec..xxxxx',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD1/medium/128Kbps.mp4',
                      type: 'Audio',
                      format: 'audio/mp4; codec..xxxxx',
                      label: {
                        en: ['Medium'],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'Canvas',
      id:
        'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/2',
      items: [
        {
          type: 'AnnotationPage',
          id:
            'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/2/annotation_page/2',
          items: [
            {
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/2',
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
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3',
      type: 'Canvas',
      duration: 3829,
      width: 1920,
      height: 1080,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/annopage/3',
          type: 'AnnotationPage',
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/annopage/3',
              type: 'Annotation',
              motivation: 'painting',
              target: 'https://dlib.indiana.edu/iiif_av/canvas/3',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD2/high/320Kbps.mp4',
                      type: 'Audio',
                      format: 'audio/mp4; codec..xxxxx',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id:
                        'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/CD2/medium/128Kbps.mp4',
                      type: 'Audio',
                      format: 'audio/mp4; codec..xxxxx',
                      label: {
                        en: ['Medium'],
                      },
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
  seeAlso: [],
  structures: [
    {
      id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/0',
      type: 'Range',
      behavior: 'no-nav',
      label: {
        en: ['Symphony no. 3 - Mahler, Gustav'],
      },
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1',
          type: 'Range',
          label: {
            en: ['CD1 - Mahler, Symphony No.3'],
          },
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-1',
              type: 'Range',
              label: {
                en: ['Track 1. I. Kraftig'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=0,374',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-2',
              type: 'Range',
              label: {
                en: ['Track 2. Langsam. Schwer'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=374,525',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-3',
              type: 'Range',
              label: {
                en: ['Track 3. Tempo I'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=525,711',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-4',
              type: 'Range',
              label: {
                en: ['Track 4. Schwungvoll'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=711,1188',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-5',
              type: 'Range',
              label: {
                en: ['Track 5. Immer dasselbe Tempo'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=1188,1406',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-6',
              type: 'Range',
              label: {
                en: ['Track 6. Wie zu Anfang'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=1406,1693',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/1-7',
              type: 'Range',
              label: {
                en: ['Track 7. Tempo I'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/1#t=01693,1985',
                  type: 'Canvas',
                },
              ],
            },
          ],
        },
        {
          type: 'Range',
          id:
            'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/2',
          label: {
            en: ['Volleyball for Boys'],
          },
          items: [
            {
              type: 'Range',
              id:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/range/2-1',
              label: {
                en: ['Volleyball for Boys'],
              },
              items: [
                {
                  type: 'Canvas',
                  id:
                    'https://dlib.indiana.edu/iiif-av/iiif-player-samples/volleybal-for-boys/manifest/canvas/2#t=0,',
                },
              ],
            },
          ],
        },
        {
          id: 'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3',
          type: 'Range',
          label: {
            en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
          },
          items: [
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-1',
              type: 'Range',
              label: {
                en: ['Track 1. II. Tempo di Menuetto'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=0,566',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-2',
              type: 'Range',
              label: {
                en: ['Track 2. III. Comodo'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=566,1183',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-3',
              type: 'Range',
              label: {
                en: ['Track 3. Tempo I'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=1183,1635',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-4',
              type: 'Range',
              label: {
                en: ['Track 4. IV. Misterioso'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=1635,2204',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-5',
              type: 'Range',
              label: {
                en: ['Track 5. V. Lustig im Tempo'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=2204,2475',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-6',
              type: 'Range',
              label: {
                en: ['Track 6. VI. Langsam'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=2475,3047',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-7',
              type: 'Range',
              label: {
                en: ['Track 7. Nicht mehr so breit'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=3047,3287',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-8',
              type: 'Range',
              label: {
                en: ['Track 8. Tempo I'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=3287,3451',
                  type: 'Canvas',
                },
              ],
            },
            {
              id:
                'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/range/3-9',
              type: 'Range',
              label: {
                en: ['Track 9. Tempo I'],
              },
              items: [
                {
                  id:
                    'https://dlib.indiana.edu/iiif_av/mahler-symphony-3/canvas/3#t=3451,3829',
                  type: 'Canvas',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
