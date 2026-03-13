export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://example.com/manifest/ad-annotation',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  items: [
    {
      type: 'Canvas',
      id: 'https://example.com/manifest/ad-annotation/canvas/1',
      width: 480,
      height: 360,
      duration: 660,
      label: { en: ['Lunchroom Manners'] },
      placeholderCanvas: {
        id: "https://example.com/manifest/ad-annotation/canvas/1/placeholder",
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: "https://example.com/manifest/ad-annotation/canvas/1/placeholder/1",
            type: "AnnotationPage",
            items: [
              {
                id: "https://example.com/manifest/ad-annotation/canvas/1/placeholder/1-image",
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: "https://example.com/manifest/poster/ad-annotation_poster.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: "https://example.com/manifest/ad-annotation/canvas/1/placeholder"
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/manifest/ad-annotation_hd.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 660,
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/1'
            }
          ]
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/1/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/ad-annotation/descriptions',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['AD in WebVTT format'], none: ['lunchroom-manners.vtt']
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/1'
            }
          ]
        },
      ]
    },
    {
      type: 'Canvas',
      id: 'https://example.com/manifest/ad-annotation/canvas/2',
      duration: 1985.024,
      label: {
        en: ['Sample Audio Example']
      },
      items: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/2/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/manifest/ad-annotation_audio.mp3',
                type: 'Video',
                format: 'audio/mp3',
                duration: 1985.024,
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/2'
            }
          ]
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/2/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/ad-annotation/descriptions',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['AD in WebVTT format']
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/2'
            }
          ]
        },
      ]
    },
    {
      type: 'Canvas',
      id: 'https://example.com/manifest/ad-annotation/canvas/3',
      width: 480,
      height: 360,
      duration: 572.034,
      label: {
        en: ['Sample Video Example']
      },
      placeholderCanvas: {
        id: "https://example.com/manifest/ad-annotation/canvas/3/placeholder",
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: "https://example.com/manifest/ad-annotation/canvas/3/placeholder/1",
            type: "AnnotationPage",
            items: [
              {
                id: "https://example.com/manifest/ad-annotation/canvas/3/placeholder/1-image",
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: "https://example.com/manifest/poster/ad-annotation_poster.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360,
                },
                target: "https://example.com/manifest/ad-annotation/canvas/3/placeholder"
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/3/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/3/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/manifest/ad-annotation_hd_1.mp4',
                type: 'Video',
                format: 'video/mp4',
                "height": 360,
                "width": 480,
                "duration": 572.034,
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/3',
            }
          ]
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/ad-annotation/canvas/3/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/ad-annotation/canvas/3/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/captions.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions'], none: ['lunchroom-manners.vtt']
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/ad-annotation/canvas/3'
            }
          ]
        },
      ]
    },
  ],
  thumbnail: [
    {
      id: 'https://example.com/manifest/thumbnail/ad-annotation_poster.jpg',
      type: 'Image',
    },
  ],
};
