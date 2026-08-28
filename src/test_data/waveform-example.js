export default {
  '@context': "http://iiif.io/api/presentation/3/context.json",
  id: "http://example.com/waveform-example/manifest.json",
  type: "Manifest",
  label: {
    it: ["L'Elisir D'Amore"],
    en: ["The Elixir of Love"]
  },
  items: [
    {
      id: "http://example.com/waveform-example/canvas/1",
      type: "Canvas", width: 1920, height: 1080, duration: 7278.422,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation", motivation: "painting", target: "http://example.com/waveform-example/canvas/1",
              body: {
                id: "http://example.com/donizetti-elixir/low.mp4",
                type: "Video", format: "video/mp4", height: 1080, width: 1920, duration: 7278.422
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset", format: "application/json", id: "http://example.com/waveform.json",
          label: { en: ["waveform.json"] }
        }
      ]
    },
    {
      id: 'https://example.com/waveform-example/canvas/2',
      type: 'Canvas', height: 1080, width: 1920, duration: 7278.422,
      items: [
        {
          id: 'https://example.com/waveform-example/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/waveform-example/canvas/2/page/1/annotation/1',
              type: 'Annotation', motivation: 'painting', target: 'https://example.com/waveform-example/canvas/2',
              body: {
                id: "https://example.com/high/media.mp4",
                type: "Video", format: "video/mp4", height: 1080, width: 1920, duration: 7278.422
              }
            }
          ]
        }
      ],
      accompanyingCanvas: {
        height: 200, width: 800, type: "Canvas", label: { en: ["Waveform"] },
        id: "http://example.com/waveform-example/canvas/2/accompanying",
        items: [
          {
            id: "http://example.com/waveform-example/canvas/2/accompanying/page",
            type: "AnnotationPage",
            items: [
              {
                id: "http://example.com/waveform-example/canvas/2/accompanying/page/annotation",
                motivation: "painting", type: "Annotation", target: "http://example.com/waveform-example/canvas/2/accompanying",
                body: {
                  format: "image/jpeg", height: 200, width: 800, id: "http://example.com/waveform.jpg", type: "Image"
                }
              }
            ]
          }
        ]
      }
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
              type: "Annotation", motivation: "painting", target: "http://example.com/waveform-example/canvas/3",
              body: {
                id: "http://example.com/waveform-example/audio.mp3",
                type: "Sound", format: "audio/mp3", duration: 300.0
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset", format: "application/octet-stream", id: "http://example.com/waveform.dat",
          label: { en: ["waveform.dat"] }
        }
      ]
    },
    {
      id: "http://example.com/waveform-example/canvas/4",
      type: "Canvas", duration: 300.0,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/4/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/4/annotation_page/1/annotation/1",
              type: "Annotation", motivation: "painting", target: "http://example.com/waveform-example/canvas/4",
              body: {
                id: "http://example.com/waveform-example/audio.mp3",
                type: "Sound", format: "audio/mp3", duration: 300.0
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset", format: "text/xml", id: "http://example.com/waveform.xml",
          label: { en: ["not a waveform"] }
        }
      ]
    },
    {
      id: "http://example.com/waveform-example/canvas/5",
      type: "Canvas", duration: 300.0,
      items: [
        {
          id: "http://example.com/waveform-example/canvas/5/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/waveform-example/canvas/5/annotation_page/1/annotation/1",
              type: "Annotation", motivation: "painting", target: "http://example.com/waveform-example/canvas/5",
              body: {
                id: "http://example.com/waveform-example/audio.mp3",
                type: "Sound", format: "audio/mp3", duration: 300.0
              }
            }
          ]
        }
      ],
      seeAlso: [
        {
          type: "Dataset", format: "application/json", id: "http://example.com/waveform.json",
          label: { en: ["waveform.json"] }
        }
      ],
      accompanyingCanvas: {
        height: 200, width: 800, type: "Canvas", label: { en: ["Waveform"] },
        id: "http://example.com/waveform-example/canvas/5/accompanying",
        items: [
          {
            id: "http://example.com/waveform-example/canvas/5/accompanying/page",
            type: "AnnotationPage",
            items: [
              {
                body: {
                  format: "image/jpeg", height: 200, width: 800,
                  id: "http://example.com/waveform.jpg", type: "Image"
                },
                id: "http://example.com/waveform-example/canvas/5/accompanying/page/annotation",
                motivation: "painting", type: "Annotation", target: "http://example.com/waveform-example/canvas/5/accompanying"
              }
            ]
          }
        ]
      }
    },
    {
      id: 'https://example.com/waveform-example/canvas/6',
      type: 'Canvas', height: 1080, width: 1920, duration: 7278.422,
      items: [
        {
          id: 'https://example.com/waveform-example/canvas/6/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/waveform-example/canvas/6/page/1/annotation/1',
              type: 'Annotation', motivation: 'painting', target: 'https://example.com/waveform-example/canvas/6',
              body: {
                id: "https://example.com/high/media.mp4",
                type: "Video", format: "video/mp4", height: 1080, width: 1920, duration: 7278.422
              }
            },
          ],
        }
      ],
      seeAlso: [
        {
          type: "Image", format: "image/png", id: "http://example.com/waveform.png",
          label: { en: ["waveform.png"] }
        }
      ]
    },
    {
      id: 'https://example.com/waveform-example/canvas/7',
      type: 'Canvas', height: 1080, width: 1920, duration: 7278.422,
      items: [
        {
          id: 'https://example.com/waveform-example/canvas/7/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/waveform-example/canvas/7/page/1/annotation/1',
              type: 'Annotation', motivation: 'painting', target: 'https://example.com/waveform-example/canvas/7',
              body: {
                id: "https://example.com/high/media.mp4",
                type: "Video", format: "video/mp4", height: 1080, width: 1920, duration: 7278.422
              }
            },
          ],
        }
      ],
      seeAlso: [
        {
          type: "Image", format: "image/png", id: "http://example.com/waveform.png",
          label: { en: ["waveform.png"] }
        },
        {
          type: "Dataset", format: "application/json", id: "http://example.com/waveform.json",
          label: { en: ["waveform.json"] }
        }
      ]
    },
    {
      id: 'https://example.com/waveform-example/canvas/8',
      type: 'Canvas', height: 40, width: 1280, duration: 550.32,
      items: [
        {
          id: 'https://example.com/waveform-example/canvas/8/page/1',
          type: 'AnnotationPage',
          items: [
            {
              type: 'Annotation', motivation: 'painting', id: "https://example.com/waveform-example/canvas/8/page/1/annotation/1",
              target: 'https://example.com/waveform-example/canvas/8#t=0,100',
              body: { id: 'https://example.com/side-1.mp3', type: 'Sound', height: 40, width: 1280, duration: 100 },
              seeAlso: [{ id: 'https://example.com/waveform-side-1.json', type: 'Dataset', format: 'application/json' }],
            },
            {
              type: 'Annotation', motivation: 'painting', id: "https://example.com/waveform-example/canvas/8/page/1/annotation/2",
              target: 'https://example.com/waveform-example/canvas/8#t=100,300',
              body: { id: 'https://example.com/side-2.mp3', type: 'Sound', height: 40, width: 1280, duration: 200 },
              seeAlso: [{ id: 'https://example.com/waveform-side-2.dat', type: 'Dataset', format: 'application/octet-stream' }],
            },
            {
              type: 'Annotation', motivation: 'painting', id: "https://example.com/waveform-example/canvas/8/page/1/annotation/3",
              target: 'https://example.com/waveform-example/canvas/8#t=300',
              body: { id: 'https://example.com/side-2.mp3', type: 'Sound', height: 40, width: 1280, duration: 250.32 },
              seeAlso: [{ id: 'https://example.com/waveform-side-3.png', type: 'Image', format: 'image/png' }],
            }
          ],
        }
      ]
    }
  ]
};
