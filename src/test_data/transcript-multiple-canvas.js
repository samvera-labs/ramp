export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://example.com/sample/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Manifest with json transcript at canvas level with rendering'],
  },
  rendering: [
    {
      id: 'https://example.com/lunchroom_manners/transcript.vtt',
      type: 'Text',
      label: { en: ['Manifest rendering file'] },
      format: 'text/vtt',
    }
  ],
  items: [
    {
      id: 'https://example.com/sample/canvas/1',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/sample/high/media.mp4',
                type: 'Video',
                format: 'vnd.apple.mpegURL',
                label: {
                  en: ['High'],
                },
              },
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/canvas/1/page/2/annotation',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/1/page/2/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/sample/poster.jpg',
                type: 'Image',
                label: {
                  en: ['Canvas Poster Image'],
                },
              },
              target: 'https://example.com/sample/canvas/1',
            },
          ],
        },
      ],
    },
    {
      id: 'https://example.com/sample/canvas/2',
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
          id: 'https://example.com/sample/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'https://example.com/sample/high/media.m3u8',
                    type: 'Video',
                    format: 'vnd.apple.mpegURL',
                    label: {
                      en: ['High'],
                    },
                  },
                ],
              },
              target: 'https://example.com/sample/canvas/2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/sample/canvas/2/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/sample/canvas/2/page/2/annotation',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/sample/subtitles.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format'], none: ['sample-subtitles.vtt']
                },
              },
              target: 'https://example.com/sample/canvas/2',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      id: "https://example.com/sample/manifest/range/1",
      type: "Range",
      items: [
        {
          id: "http://localhost:4000/recipe/0229-behavior-ranges/range/1.1",
          type: "Range",
          items: [
            {
              id: "http://localhost:4000/recipe/0229-behavior-ranges/canvas/1#t=0,9",
              type: "Canvas"
            }
          ],
          behavior: "no-nav"
        },
        {
          id: "http://localhost:4000/recipe/0229-behavior-ranges/range/2",
          type: "Range",
          items: [
            {
              id: "http://localhost:4000/recipe/0229-behavior-ranges/canvas/1#t=9,305",
              type: "Canvas"
            }
          ],
          label: { en: ["Start – 305s"] },
          thumbnail: [
            {
              id: "https://fixtures.iiif.io/video/indiana/donizetti-elixir/thumbnails/thumb-nav-01.png",
              type: "Image",
              width: "2250",
              format: "image/png",
              height: "1266"
            }
          ]
        }
      ],
      label: { en: ["Behavior Property Test"] },
      behavior: "thumbnail-nav"
    }
  ],
  thumbnail: [
    {
      id: 'https://example.com/sample/thumbnail/poster.jpg',
      type: 'Image',
    },
  ],
};
