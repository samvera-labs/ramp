export default {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  id: "https://example.com/multi-source-manifest/manifest.json",
  type: "Manifest",
  label: { "en": ["The Elixir of Love"] },
  items: [
    {
      id: "https://example.com/multi-source-manifest/canvas/1",
      type: "Canvas",
      width: 1920,
      height: 1080,
      duration: 7278.422,
      items: [
        {
          id: "https://example.com/multi-source-manifest/canvas/1/annotation_page/1",
          type: "AnnotationPage",
          items: [
            {
              id: "https://example.com/multi-source-manifest/canvas/1/annotation_page/1/annotation/1",
              type: "Annotation",
              motivation: "painting",
              target: "https://example.com/multi-source-manifest/canvas/1#t=0,3971.24",
              body: {
                id: "https://example.com/video/donizetti-elixir/low_act_1.mp4",
                type: "Video",
                format: "video/mp4",
                height: 1080,
                width: 1920,
                duration: 3971.24
              }
            },
            {
              id: "https://example.com/multi-source-manifest/canvas/1/annotation_page/1/annotation/2",
              type: "Annotation",
              motivation: "painting",
              target: "https://example.com/multi-source-manifest/canvas/1#t=3971.24",
              body: {
                id: "https://example.com/video/donizetti-elixir/low_act_2.mp4",
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
    },
    {
      id: 'https://example.com/multi-source-manifest/canvas/2',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      label: { en: ['Aviary Annotation Style Canvas'] },
      items: [
        {
          id: 'https://example.com/multi-source-manifest/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'https://example.com/sample/transcript-annotation/high/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['High'] },
                  },
                  {
                    id: 'https://example.com/sample/transcript-annotation/medium/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['Medium'] },
                  },
                  {
                    id: 'https://example.com/sample/transcript-annotation/low/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['Low'] },
                  },
                ],
              },
              target: 'https://example.com/sample/transcript-annotation/canvas/2',
            },
          ],
        }
      ],
      annotations: [
        {
          id: 'https://example.com/multi-source-manifest/canvas/2/page/2',
          type: 'AnnotationPage',
          label: { en: ['Aviary Supplementing Annotations'] },
          items: [
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing', 'tagging'],
              body: [
                {
                  type: 'TextualBody',
                  value: 'Transcript text line 1',
                  format: 'text/plain',
                },
                {
                  tyep: 'TextualBody',
                  value: 'Song',
                  purpose: 'tagging',
                }
              ],
              target: 'https://example.com/multi-source-manifest/canvas/2#t=22.2,26.6',
            },
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/2/annotation/2',
              type: 'Annotation',
              motivation: 'supplementing',
              body: [
                {
                  type: 'TextualBody',
                  value: 'Transcript text line 2',
                  format: 'text/plain',
                },
                {
                  type: 'TextualBody',
                  value: 'Transcript text line 3',
                  format: 'text/plain',
                }
              ],
              target: 'https://example.com/multi-source-manifest/canvas/2#t=26.7,31.5',
            },
          ],
        },
      ]
    },
    {
      id: 'https://example.com/multi-source-manifest/canvas/3',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      label: { en: ['Mixed Motivation Inline Annotations Canvas'] },
      items: [
        {
          id: 'https://example.com/multi-source-manifest/canvas/3/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/multi-source-manifest/canvas/3/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'https://example.com/sample/transcript-annotation/high/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['High'] },
                  },
                  {
                    id: 'https://example.com/sample/transcript-annotation/medium/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['Medium'] },
                  },
                  {
                    id: 'https://example.com/sample/transcript-annotation/low/media.mp4',
                    type: 'Video', format: 'video/mp4', label: { en: ['Low'] },
                  },
                ],
              },
              target: 'https://example.com/sample/transcript-annotation/canvas/3',
            },
          ],
        }
      ],
      annotations: [
        {
          id: 'https://example.com/multi-source-manifest/canvas/3/page/2',
          type: 'AnnotationPage',
          label: { en: ['Aviary Supplementing Annotations'] },
          items: [
            {
              id: 'https://example.com/multi-source-manifest/canvas/3/page/2/annotation/1',
              type: 'Annotation',
              motivation: ['supplementing', 'commenting'],
              body: [
                {
                  type: 'TextualBody', value: 'Transcript text line 1', format: 'text/plain', purpose: 'commenting',
                },
                {
                  tyep: 'TextualBody', value: 'Song', purpose: 'tagging',
                }
              ],
              target: 'https://example.com/multi-source-manifest/canvas/2#t=22.2,26.6',
            },
            {
              id: 'https://example.com/multi-source-manifest/canvas/2/page/2/annotation/2',
              type: 'Annotation',
              motivation: ['supplementing', 'commenting'],
              body: [
                {
                  type: 'TextualBody', value: 'Transcript text line 2', format: 'text/plain', purpose: 'commenting',
                }
              ],
              target: 'https://example.com/multi-source-manifest/canvas/2#t=26.7,31.5',
            },
          ],
        },
      ]
    }
  ],
  structures: [
    {
      type: "Range",
      id: "https://example.com/multi-source-manifest/range/1",
      label: { "it": ["Gaetano Donizetti, L'Elisir D'Amore"] },
      items: [
        {
          type: "Range",
          id: "https://example.com/multi-source-manifest/range/2",
          label: { "it": ["Atto Primo"] },
          items: [
            {
              type: "Range",
              id: "https://example.com/multi-source-manifest/range/3",
              label: { "it": ["Preludio e Coro d'introduzione – Bel conforto al mietitore"] },
              items: [
                {
                  type: "Canvas",
                  id: "https://example.com/multi-source-manifest/canvas/1#t=0,302.05"
                }
              ]
            },
            {
              type: "Range",
              id: "https://example.com/multi-source-manifest/range/4",
              label: { "en": ["Remainder of Atto Primo"] },
              items: [
                {
                  type: "Canvas",
                  id: "https://example.com/multi-source-manifest/canvas/1#t=302.05,3971.24"
                }
              ]
            }
          ]
        },
        {
          type: "Range",
          id: "https://example.com/multi-source-manifest/range/5",
          label: {
            "it": ["Atto Secondo"]
          },
          items: [
            {
              type: "Canvas",
              id: "https://example.com/multi-source-manifest/canvas/1#t=3971.24,7278.422"
            }
          ]
        }
      ]
    }
  ]
};
