export default {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/manifest.json",
  type: "Manifest",
  label: {
    it: [
      "L'Elisir D'Amore"
    ],
    en: [
      "The Elixir of Love"
    ]
  },
  behavior: [
    "auto-advance"
  ],
  metadata: [
    {
      label: {
        en: [
          "Date Issued"
        ]
      },
      value: {
        en: [
          "2019"
        ]
      }
    },
    {
      label: {
        en: [
          "Publisher"
        ]
      },
      value: {
        en: [
          "Indiana University Jacobs School of Music"
        ]
      }
    }
  ],
  items: [
    {
      id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 3971.24,
      label: {
        en: [
          "Atto Primo"
        ]
      },
      items: [
        {
          id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1",
              body: {
                id: "https://fixtures.iiif.io/video/indiana/donizetti-elixir/vae0637_accessH264_low_act_1.mp4",
                type: "Video",
                format: "video/mp4",
                height: 1080,
                width: 1920,
                duration: 3971.24
              }
            }
          ]
        }
      ],
      thumbnail: [
        {
          id: "https://fixtures.iiif.io/video/indiana/donizetti-elixir/act1-thumbnail.png",
          type: "Image"
        }
      ]
    },
    {
      id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 3307.22,
      label: {
        en: [
          "Atto Secondo"
        ]
      },
      items: [
        {
          id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2",
              body: {
                id: "https://fixtures.iiif.io/video/indiana/donizetti-elixir/vae0637_accessH264_low_act_2.mp4",
                type: "Video",
                format: "video/mp4",
                height: 1080,
                width: 1920,
                duration: 3307.22
              }
            }
          ]
        }
      ],
      thumbnail: [
        {
          id: "https://fixtures.iiif.io/video/indiana/donizetti-elixir/act2-thumbnail.png",
          type: "Image"
        }
      ]
    }
  ],
  service: [
    {
      id: 'http://example.com/manifests/playlist/auth',
      type: 'AuthService0'
    }
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/range/1',
      label: { it: ["Gaetano Donizetti, L'Elisir D'Amore"] },
      items: [
        {
          type: 'Range',
          id: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/range/2',
          label: { it: ['Atto Primo'] },
          items: [
            {
              type: 'Canvas',
              id: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/1#t=0,',
            },
          ],
        },
        {
          type: 'Range',
          id: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/range/3',
          label: { it: ['Atto Secondo'] },
          items: [
            {
              type: 'Canvas',
              id: 'https://iiif.io/api/cookbook/recipe/0065-opera-multiple-canvases/canvas/2#t=0,',
            },
          ],
        },
      ],
    },
  ]
};
