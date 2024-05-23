export default {
  '@context': "http://iiif.io/api/presentation/3/context.json",
  id: "http://example.com/single-canvas-manifest/manifest.json",
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
      id: "http://example.com/single-canvas-manifest/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 7278.422,
      items: [
        {
          id: "http://example.com/single-canvas-manifest/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "http://example.com/single-canvas-manifest/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "http://example.com/single-canvas-manifest/canvas/1",
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
      ]
    }
  ],
  structures: [
    {
      type: "Range",
      id: "http://example.com/single-canvas-manifest/range/1",
      label: {
        it: [
          "Gaetano Donizetti, L'Elisir D'Amore"
        ]
      },
      items: [
        {
          type: "Range",
          id: "http://example.com/single-canvas-manifest/range/2",
          label: {
            it: [
              "Atto Primo"
            ]
          },
          items: [
            {
              type: "Range",
              id: "http://example.com/single-canvas-manifest/range/3",
              label: {
                it: [
                  "Preludio e Coro d'introduzione – Bel conforto al mietitore"
                ]
              },
              items: [
                {
                  type: "Canvas",
                  id: "http://example.com/single-canvas-manifest/canvas/1#t=0,302.05"
                }
              ]
            },
            {
              type: "Range",
              id: "http://example.com/single-canvas-manifest/range/4",
              label: {
                en: [
                  "Remainder of Atto Primo"
                ]
              },
              items: [
                {
                  type: "Canvas",
                  id: "http://example.com/single-canvas-manifest/canvas/1#t=302.05,3971.24"
                }
              ]
            }
          ]
        },
        {
          type: "Range",
          id: "http://example.com/single-canvas-manifest/range/5",
          label: {
            it: [
              "Atto Secondo"
            ]
          },
          items: [
            {
              type: "Canvas",
              id: "http://example.com/single-canvas-manifest/canvas/1#t=3971.24"
            }
          ]
        }
      ]
    }
  ]
};
