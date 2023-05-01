const url_suffix =
  process.env.NODE_ENV === 'development' ? '' : '/ramp';

export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${url_suffix}/manifests/lunchroom_manners.json`,
  type: 'Manifest',
  label: {
    en: [
      'Beginning Reponsibility: Lunchroom Manners [motion picture] Coronet Films',
    ],
  },
  rendering: [
    {
      id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
      type: 'Text',
      label: {
        en: ['Transcript file']
      },
      format: 'text/vtt',
    },
  ],
  start: {
    id: `${url_suffix}/manifests/lunchroom_manners.json`,
    type: 'SpecificResource',
    source: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
    selector: {
      type: 'PointSelector',
      t: 180,
    },
  },
  items: [
    {
      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      placeholderCanvas: {
        id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder`,
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder/1`,
            type: "AnnotationPage",
            items: [
              {
                id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder/1-image`,
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder`
              }
            ]
          }
        ]
      },
      items: [
        {
          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page`,
          type: 'AnnotationPage',
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page/annotation`,
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: `${url_suffix}/lunchroom_manners/high/lunchroom_manners_1024kb.mp4#t=23.5,400`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/medium/lunchroom_manners_512kb.mp4#t=23.5,400`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/low/lunchroom_manners_256kb.mp4#t=23.5,400`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
                  id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
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
      ],
    },
  ],
  structures: [
    {
      id: `${url_suffix}/manifests/lunchroom_manners/range/0`,
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
          id: `${url_suffix}/manifests/lunchroom_manners/range/1`,
          type: 'Range',
          label: { en: ['Lunchroom Manners'] },
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/range/1-1`,
              type: 'Range',
              label: { en: ['Washing Hands'] },
              items: [
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-1-1`,
                  type: 'Range',
                  label: { en: ['Using Soap'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=157,160`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-1-3`,
                  type: 'Range',
                  label: { en: ['Rinsing Well'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=165,170`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-2`,
                  type: 'Range',
                  label: { en: ['After Washing Hands'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/1-2-1`,
                      type: 'Range',
                      label: { en: ['Drying Hands'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=170,180`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/1-2-2`,
                      type: 'Range',
                      label: { en: ['Getting Ready'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=180,190`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/lunchroom_manners/range/2`,
              type: 'Range',
              label: { en: ['In the Lunchroom'] },
              items: [
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-1`,
                  type: 'Range',
                  label: { en: ['At the Counter'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-1`,
                      type: 'Range',
                      label: { en: ['Getting Tray'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=227,245`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-2`,
                      type: 'Range',
                      label: { en: ['Choosing Food'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=258,288`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-3`,
                      type: 'Range',
                      label: { en: ['There will be Cake'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=301,308`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-2`,
                  type: 'Range',
                  label: { en: ['At the Table'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-2-1`,
                      type: 'Range',
                      label: { en: ['Sitting Quietly'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=323,333`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-2-2`,
                      type: 'Range',
                      label: { en: ['Eating Neatly'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=362,378`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-3`,
                  type: 'Range',
                  label: { en: ['Leaving the Lunchroom'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-3-1`,
                      type: 'Range',
                      label: { en: ['Cleaning Up'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=448,492`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-3-2`,
                      type: 'Range',
                      label: { en: ['Putting Things Away'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=511,527`,
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
    },
  ],
  thumbnail: [
    {
      id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
      type: 'Image',
    },
  ],
};
