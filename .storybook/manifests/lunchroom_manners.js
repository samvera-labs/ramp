import config from '../../env';
const url_suffix = config.url;

export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${url_suffix}/manifests/lunchroom_manners.json`,
  type: 'Manifest',
  label: {
    en: ['Beginning Reponsibility: Lunchroom Manners [motion picture] Coronet Films'],
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
      label: {
        en: ["Lunchroom Manners"]
      },
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
          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page/annotation`,
          type: 'AnnotationPage',
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page/annotation`,
              type: 'Annotation',
              motivation: "painting",
              body: {
                height: 360,
                width: 480,
                duration: 572.034,
                format: "video/mp4",
                id: `${url_suffix}/lunchroom_manners/high/lunchroom_manners_1024kb.mp4`,
                label: {
                  en: ['High'],
                },
                type: 'Video'
              },
              target: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
            }
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
      annotations: [
        {
          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page/2`,
          type: "AnnotationPage",
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/annotation/webvtt`,
              type: "Annotation",
              motivation: "supplementing",
              body: {
                id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
                type: "Text",
                format: "text/vtt",
                label: { en: ["WebVTT Transcript (machine-generated)"] }
              },
              target: `${url_suffix}/manifests/lunchroom_manners/canvas/1`
            },
            {
              id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/annotation/srt`,
              type: "Annotation",
              motivation: "supplementing",
              body: {
                id: `${url_suffix}/lunchroom_manners/lunchroom_manners.srt`,
                type: "Text",
                format: "application/x-subrip",
                label: { en: ["SRT Transcript (machine-generated)"] }
              },
              target: `${url_suffix}/manifests/lunchroom_manners/canvas/1`
            }
          ]
        }
      ]
    },
  ]
};
