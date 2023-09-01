import config from '../../env';
const url_suffix = config.url;

export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${url_suffix}/manifests/playlist.js`,
  type: 'Manifest',
  label: {
    en: ['Playlist Manifest [Playlist]'],
  },
  behavior: [
    "auto-advance"
  ],
  metadata: [
    {
      label: { en: ["Title"] },
      value: { none: ["Playlist Manifest [Playlist]"] }
    }
  ],
  items: [
    {
      id: `${url_suffix}/manifests/playlist/canvas/1`,
      type: 'Canvas',
      duration: 572.034,
      label: {
        en: ["Lunchroom Manners"]
      },
      placeholderCanvas: {
        id: `${url_suffix}/manifests/playlist/canvas/1/placeholder`,
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: `${url_suffix}/manifests/playlist/canvas/1/placeholder/1`,
            type: "AnnotationPage",
            items: [
              {
                id: `${url_suffix}/manifests/playlist/canvas/1/placeholder/1-image`,
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: `${url_suffix}/manifests/playlist/canvas/1/placeholder`
              }
            ]
          }
        ]
      },
      items: [
        {
          id: `${url_suffix}/manifests/playlist/canvas/1/page`,
          type: 'AnnotationPage',
          items: [
            {
              id: `${url_suffix}/manifests/playlist/canvas/1/page/annotation`,
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: `${url_suffix}/lunchroom_manners/high/lunchroom_manners_1024kb.mp4#t=0,572.0`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                      height: 360,
                      width: 480,
                      duration: 572.0
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/medium/lunchroom_manners_512kb.mp4#t=0,572.0`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                      height: 360,
                      width: 480,
                      duration: 572.0
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/low/lunchroom_manners_256kb.mp4#t=0,572.0`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                      height: 360,
                      width: 480,
                      duration: 572.0
                    },
                  ],
                },
              ],
              target: `${url_suffix}/manifests/playlist/canvas/1`,
            },
          ],
        },
      ],
      annotations: [
        {
          type: "AnnotationPage",
          id: `${url_suffix}/manifests/playlist/canvas/1/annotation_page/1`,
          items: [
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 1"
              },
              id: `${url_suffix}/manifests/playlist/canvas/1/marker/1`,
              target: `${url_suffix}/manifests/playlist/canvas/1#t=2.836`,
            },
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 2"
              },
              id: `${url_suffix}/manifests/playlist/canvas/1/marker/2`,
              target: `${url_suffix}/manifests/playlist/canvas/1#t=369.811`
            }
          ]
        }
      ],
    },
  ],
  structures: [
    {
      id: `${url_suffix}/manifests/playlist/range/0`,
      type: 'Range',
      label: { en: ['Playlist Item'] },
      items: [
        {
          type: "Canvas",
          id: `${url_suffix}/manifests/playlist/canvas/1#t=0,`
        }
      ]
    },
  ]
};
