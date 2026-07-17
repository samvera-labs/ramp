export default {
  '@context': "http://iiif.io/api/presentation/4/context.json",
  id: "http://example.com/multi-canvas-manifest-v4/manifest.json",
  type: "Manifest",
  label: { en: ["Multi-Canvas V4 Manifest"], it: ["Manifeste Multi-Canvas V4"] },
  items: [
    {
      id: "http://example.com/multi-canvas-manifest-v4/canvas/1",
      type: "Canvas", width: 1920, height: 1080, duration: 7278.422,
      placeholderContainer: {
        id: "http://example.com/multi-canvas-manifest-v4/canvas/1/placeholder",
        type: "Canvas", width: 640, height: 360,
        items: [
          {
            id: "http://example.com/multi-canvas-manifest-v4/canvas/1/placeholder/1",
            type: "AnnotationPage",
            items: [
              {
                id: "http://example.com/multi-canvas-manifest-v4/canvas/1/placeholder/1-image",
                type: "Annotation",
                motivation: ["painting"],
                body: {
                  id: "http://example.com/multi-canvas-manifest-v4/poster/poster.jpg",
                  type: "Image", format: "image/jpeg", width: 640, height: 360
                },
                target: { id: "http://example.com/multi-canvas-manifest-v4/canvas/1/placeholder", type: 'Canvas' }
              }
            ]
          }
        ]
      },
      items: [
        {
          id: "http://example.com/multi-canvas-manifest-v4/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-canvas-manifest-v4/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: ["painting"],
              target: { id: "http://example.com/multi-canvas-manifest-v4/canvas/1", type: 'Canvas' },
              body: {
                id: "http://example.com/low.mp4", type: "Video", format: "video/mp4",
                height: 1080, width: 1920, duration: 7278.422, label: { en: ['Low'] },
              }
            }
          ]
        }
      ]
    },
    {
      id: "http://example.com/multi-canvas-manifest-v4/canvas/2",
      type: "Canvas", width: 1920, height: 1080,
      items: [
        {
          id: "http://example.com/multi-canvas-manifest-v4/canvas/2/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-canvas-manifest-v4/canvas/2/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: ["painting"],
              target: { id: "http://example.com/multi-canvas-manifest-v4/canvas/2", type: 'Canvas' },
              body: {
                id: "http://example.com/image.jpeg", type: "Image", format: "image/jpeg", height: 1080, width: 1920
              }
            }
          ]
        }
      ]
    },
    {
      id: "http://example.com/multi-canvas-manifest-v4/timeline/1",
      type: "Timeline",
      duration: 98.25,
      items: [
        {
          id: "http://example.com/multi-canvas-manifest-v4/timeline/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/multi-canvas-manifest-v4/timeline/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: ["painting"],
              target: { id: 'http://example.com/multi-canvas-manifest-v4/timeline/1', type: 'Timeline' },
              body: {
                id: "http://example.com/audio-canvas.mp3", type: "Sound", format: "audio/mpeg", duration: 98.25
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/multi-canvas-manifest-v4/timeline/2',
      type: 'Timeline',
      width: 480,
      height: 360,
      duration: 660,
      label: { en: ['Multi-src Audio Timeline'] },
      items: [
        {
          id: 'http://example.com/multi-canvas-manifest-v4/timeline/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/multi-canvas-manifest-v4/timeline/2/page/1',
              type: 'Annotation',
              motivation: ['painting'],
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'https://example.com/manifest/high/audio_1024kb.mp3',
                    type: 'Sound', format: 'audio/mpeg', label: { en: ['High'] },
                  },
                  {
                    id: 'https://example.com/manifest/medium/audio_512kb.mp3',
                    type: 'Sound', format: 'audio/mpeg', label: { en: ['Medium'] },
                  },
                  {
                    id: 'https://example.com/manifest/low/audio_256kb.mp3',
                    type: 'Sound', format: 'audio/mpeg',
                  },
                ],
              },
              target: { id: 'http://example.com/multi-canvas-manifest-v4/timeline/2', type: 'Timeline' }
            },
          ]
        },
      ],
      annotations: [
        {
          id: 'http://example.com/multi-canvas-manifest-v4/timeline/2/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/multi-canvas-manifest-v4/timeline/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing'],
              body: {
                id: 'https://example.com/audio-transcript.vtt', type: 'Text', format: 'text/vtt', language: ['en'],
                label: { en: ['Captions in WebVTT format'], none: ['audio-transcript.vtt'] }
              },
              target: { id: 'http://example.com/multi-canvas-manifest-v4/timeline/2', type: 'Timeline' }
            }
          ]
        },
      ],
      rendering: [
        {
          id: 'https://example.com/lunchroom_manners/transcript.vtt',
          type: 'Text', label: { en: ['Canvas - Supplement file'] }, format: 'text/vtt',
        }
      ],
    },
  ]
};
