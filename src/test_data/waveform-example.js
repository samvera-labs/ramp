export default {
  '@context': "http://iiif.io/api/presentation/3/context.json",
  id: "http://example.com/waveform-example/manifest.json",
  type: "Manifest",
  label: {
    it: [
      "L'Elisir D'Amore"
    ],
    en: [
      "The Elixir of Love"
    ]
  },
  items: [
    {
      id: "http://example.com/waveform-example/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 7278.422,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/waveform-example/canvas/1",
              body: {
                id: "http://example.com/donizetti-elixir/low.mp4",
                type: "Video",
                format: "video/mp4",
                height: 1080,
                width: 1920,
                duration: 7278.422
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset",
          format: "application/json",
          id: "http://example.com/waveform.json",
          label: { en: ["waveform.json"] }
        }
      ]
    },
    {
      id: 'https://example.com/waveform-example/canvas/2',
      type: 'Canvas',
      height: 1080,
      width: 1920,
      duration: 7278.422,
      items: [
        {
          id: 'https://example.com/waveform-example/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/waveform-example/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: "https://example.com/high/media.mp4",
                type: "Video",
                format: "video/mp4",
                height: 1080,
                width: 1920,
                duration: 7278.422
              },
              target: 'https://example.com/waveform-example/canvas/2',
            },
          ],
        }
      ],
      accompanyingCanvas: {
        height: 200, width: 800, type: "Canvas", label: { en: ["Waveform"] },
        id: "http://example.com/waveform-example/canvas/2/accompanying",
        items: [
          {
            id: "http://example.com/waveform-example/canvas/2/accompanying/page",
            items: [
              {
                body: {
                  format: "image/jpeg", height: 200, width: 800,
                  id: "http://example.com/waveform.jpg", type: "Image"
                },
                id: "http://example.com/waveform-example/canvas/2/accompanying/page/annotation",
                motivation: "painting",
                target: "http://example.com/waveform-example/canvas/2/accompanying",
                type: "Annotation"
              }
            ],
            "type": "AnnotationPage"
          }
        ],
      },
    },
    {
      id: "http://example.com/waveform-example/canvas/3",
      type: "Canvas",
      duration: 300.0,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/3/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/3/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/waveform-example/canvas/3",
              body: {
                id: "http://example.com/waveform-example/audio.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 300.0
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset",
          format: "application/json",
          id: "http://example.com/waveform.json",
          label: { en: ["waveform.json"] }
        }
      ]
    },
    {
      id: "http://example.com/waveform-example/canvas/4",
      type: "Canvas",
      duration: 300.0,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/4/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/4/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/waveform-example/canvas/4",
              body: {
                id: "http://example.com/waveform-example/audio.mp3",
                type: "Sound",
                format: "audio/mp3",
                duration: 300.0
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset",
          format: "text/xml",
          id: "http://example.com/waveform.xml",
          label: { en: ["not a waveform"] }
        }
      ]
    }
  ]
};
