const url_suffix =
  process.env.NODE_ENV === 'development' ? '' : '/iiif-react-media-player';

export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${url_suffix}/manifests/mahler-symphony-3/manifest.json`,
  type: 'Manifest',
  label: {
    en: ['Stream Media Concat'],
  },
  items: [
    {
      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1`,
      type: 'Canvas',
      duration: 5814,
      items: [
        {
          id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1/page/1`,
          type: 'AnnotationPage',
          items: [
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1/page/1/annotation/1`,
              type: 'Annotation',
              motivation: 'painting',
              target:
                `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=0,1985`,
              body: {
                id: `${url_suffix}/mahler-symphony-3/CD1/320Kbps.mp4`,
                type: 'Audio',
                format: 'audio/mp4',
                duration: 1985,
              },
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1/page/1/annotation/2`,
              type: 'Annotation',
              motivation: 'painting',
              target:
                `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=1985`,
              body: {
                id: `${url_suffix}/mahler-symphony-3/CD2/320Kbps.mp4`,
                type: 'Audio',
                format: 'audio/mp4',
                duration: 3829,
              },
            },
          ],
        },
      ],
      rendering: [
        {
          id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
          type: 'Image',
          label: {
            en: ['Poster Image']
          },
          format: 'image/jpeg',
        },
        {
          id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
          type: 'Text',
          label: {
            en: ['Transcript file']
          },
          format: 'text/vtt',
        }
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
      id: `${url_suffix}/manifests/mahler-symphony-3/range/1`,
      label: {
        en: ['Multi Item - Single Canvas'],
      },
      items: [
        {
          type: 'Range',
          id: `${url_suffix}/manifests/mahler-symphony-3/range/2`,
          label: {
            en: ['First CD'],
          },
          items: [
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/3`,
              type: 'Range',
              label: {
                en: ['Intro'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/4`,
                  type: 'Range',
                  label: {
                    en: ['Track 1. I. Kraftig'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=0,374`,
                      type: 'Canvas',
                    },
                  ],
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/5`,
              type: 'Range',
              label: {
                en: ['Track 3. Tempo I'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=525,711`,
                  type: 'Canvas',
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/6`,
              type: 'Range',
              label: {
                en: ['Track 4. Schwungvoll'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=711,1188`,
                  type: 'Canvas',
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/7`,
              type: 'Range',
              label: {
                en: ['Track 5. Immer dasselbe Tempo'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=1188,1406`,
                  type: 'Canvas',
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/8`,
              type: 'Range',
              label: {
                en: ['Track 6. Wie zu Anfang'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=1406,1693`,
                  type: 'Canvas',
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/mahler-symphony-3/range/9`,
              type: 'Range',
              label: {
                en: ['Track 7. Tempo I'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=1693,1985`,
                  type: 'Canvas',
                },
              ],
            },
            {
              type: 'Range',
              id: `${url_suffix}/manifests/mahler-symphony-3/range/10`,
              label: {
                en: ['Second CD'],
              },
              items: [
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/11`,
                  type: 'Range',
                  label: {
                    en: ['Track 1. II. Tempo di Menuetto'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=1985,2551`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/12`,
                  type: 'Range',
                  label: {
                    en: ['Track 2. III. Comodo'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=2551,3168`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/13`,
                  type: 'Range',
                  label: {
                    en: ['Track 3. Tempo I'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=3168,3620`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/14`,
                  type: 'Range',
                  label: {
                    en: ['Track 4. IV. Misterioso'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=3620,4189`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/15`,
                  type: 'Range',
                  label: {
                    en: ['Track 5. V. Lustig im Tempo'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=4189,4460`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/16`,
                  type: 'Range',
                  label: {
                    en: ['Track 6. VI. Langsam'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=4460,5032`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/17`,
                  type: 'Range',
                  label: {
                    en: ['Track 7. Nicht mehr so breit'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=5032,5272`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/18`,
                  type: 'Range',
                  label: {
                    en: ['Track 8. Tempo I'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=5272,5436`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/mahler-symphony-3/range/19`,
                  type: 'Range',
                  label: {
                    en: ['Track 9. Tempo I'],
                  },
                  items: [
                    {
                      id: `${url_suffix}/manifests/mahler-symphony-3/canvas/1#t=5436,5814`,
                      type: 'Canvas',
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
};
