export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/transcript-annotation.json',
  type: 'Manifest',
  label: {
    en: ['Manifest with transcript as annotation'],
  },
  start: {
    id: 'https://example.com/sample/transcript-annotation/canvas/1',
    type: 'Canvas',
  },
  items: [
    {
      id: 'https://example.com/sample/transcript-annotation/canvas/1',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/transcript-annotation/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-annotation/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://example.com/sample/transcript-annotation/high/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/transcript-annotation/medium/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: 'https://example.com/sample/transcript-annotation/low/media.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
                  id: 'https://example.com/sample/transcript-annotation/subtitles.vtt',
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: 'https://example.com/sample/transcript-annotation/canvas/1',
            },
          ],
        }
      ],
      rendering: [
        {
          id: 'http://example.com/transcript-annotation/posetr-image.jpg',
          type: 'Image',
          format: 'image/jpeg',
          label: {
            en: ['Poster image']
          }
        }
      ],
      annotations: [
        {
          id: 'https://example.com/sample/transcript-annotation/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/transcript-annotation/canvas/1/page/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'Transcript text line 1',
                format: 'text/plain',
              },
              target: 'https://example.com/sample/transcript-annotation/canvas/1#t=22.2,26.6',
            },
            {
              id: 'https://example.com/sample/transcript-annotation/canvas/1/page/2/annotation/2',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                type: 'TextualBody',
                value: 'Transcript text line 2',
                format: 'text/plain',
              },
              target: 'https://example.com/sample/transcript-annotation/canvas/1#t=26.7,31.5',
            },
          ],
        },
      ],
    },
    {
      id: 'http://example.com/sample/transcript-annotation/canvas/2',
      type: 'Canvas',
      duration: 1985,
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/annopage/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/sample/transcript-annotation/annopage/2/2',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/sample/transcript-annotation/canvas/2',
              body: [],
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      id: 'http://example.com/sample/transcript-annotation/range/0',
      type: 'Range',
      label: {
        en: ['Symphony no. 3 - Mahler, Gustav'],
      },
      items: [
        {
          id: 'http://example.com/sample/transcript-annotation/range/1',
          type: 'Range',
          label: {
            en: ['CD1 - Mahler, Symphony No.3'],
          },
          items: [
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-1',
              type: 'Range',
              label: {
                en: ['Track 1. I. Kraftig'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=0,374',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-2',
              type: 'Range',
              label: {
                en: ['Track 2. Langsam. Schwer'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=374,525',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-3',
              type: 'Range',
              label: {
                en: ['Track 3. Tempo I'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=525,711',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-4',
              type: 'Range',
              label: {
                en: ['Track 4. Schwungvoll'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=711,1188',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-5',
              type: 'Range',
              label: {
                en: ['Track 5. Immer dasselbe Tempo'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=1188,1406',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-6',
              type: 'Range',
              label: {
                en: ['Track 6. Wie zu Anfang'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=1406,1693',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/1-7',
              type: 'Range',
              label: {
                en: ['Track 7. Tempo I'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/1#t=01693,1985',
                  type: 'Canvas',
                },
              ],
            },
          ],
        },
        {
          id: 'http://example.com/sample/transcript-annotation/range/2',
          type: 'Range',
          label: {
            en: ['CD2 - Mahler, Symphony No.3 (cont.)'],
          },
          items: [
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-1',
              type: 'Range',
              label: {
                en: ['Track 1. II. Tempo di Menuetto'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=0,566',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-2',
              type: 'Range',
              label: {
                en: ['Track 2. III. Comodo'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=566,1183',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-3',
              type: 'Range',
              label: {
                en: ['Track 3. Tempo I'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=1183,1635',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-4',
              type: 'Range',
              label: {
                en: ['Track 4. IV. Misterioso'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=1635,2204',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-5',
              type: 'Range',
              label: {
                en: ['Track 5. V. Lustig im Tempo'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=2204,2475',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-6',
              type: 'Range',
              label: {
                en: ['Track 6. VI. Langsam'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=2475,3047',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-7',
              type: 'Range',
              label: {
                en: ['Track 7. Nicht mehr so breit'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=3047,3287',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-8',
              type: 'Range',
              label: {
                en: ['Track 8. Tempo I'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=3287,3451',
                  type: 'Canvas',
                },
              ],
            },
            {
              id: 'http://example.com/sample/transcript-annotation/range/2-9',
              type: 'Range',
              label: {
                en: ['Track 9. Tempo I'],
              },
              items: [
                {
                  id: 'http://example.com/sample/transcript-annotation/canvas/2#t=3451,3829',
                  type: 'Canvas',
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
      id: 'https://example.com/sample/transcript-annotation/thumbnail/poster.jpg',
      type: 'Image',
    },
  ],
};
