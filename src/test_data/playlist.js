export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'http://example.com/playlists/1',
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
  service: [
    {
      id: 'http://example.com/playlists/1/marker',
      type: 'AnnotationService0'
    }
  ],
  rights: "http://creativecommons.org/licenses/by-sa/3.0/",
  items: [
    {
      id: 'http://example.com/playlists/1/canvas/1',
      type: 'Canvas',
      label: {
        en: ["Restricted Item"]
      },
      summary: {
        none: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"]
      },
      homepage: [
        {
          id: 'https://example.com/playlists/1?position=1',
          type: 'Text',
          label: { none: ['View in Repository'] },
          format: 'text/html'
        }
      ],
      placeholderCanvas: {
        id: 'http://example.com/playlists/1/canvas/1/placeholder',
        type: "Canvas",
        items: [
          {
            id: 'http://example.com/playlists/1/canvas/1/placeholder/1',
            type: "AnnotationPage",
            items: [
              {
                id: 'http://example.com/playlists/1/canvas/2/placeholder/1-image',
                type: "Annotation",
                motivation: "painting",
                body: {
                  type: "Text",
                  format: "text/plain",
                  label: { en: ['You do not have permission to playback this item.'] }
                },
                target: 'http://example.com/playlists/1/canvas/1/placeholder'
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'http://example.com/playlists/1/canvas/1/page',
          type: 'AnnotationPage',
        },
      ],
      annotations: [],
    },
    {
      id: 'http://example.com/playlists/1/canvas/2',
      type: 'Canvas',
      duration: 572.034,
      label: {
        en: ["Volleyball for boys"]
      },
      summary: {
        en: ['Clip from Volleyball for boys']
      },
      homepage: [
        {
          id: 'https://example.com/playlists/1?position=2',
          type: 'Text',
          label: { none: ['View in Repository'] },
          format: 'text/html'
        }
      ],
      metadata: [
        {
          label: { en: ["Title"] },
          value: { none: ["Second Playlist Item"] }
        }, {
          label: { en: ["Date"] },
          value: { none: ["2023"] }
        }, {
          label: { en: ["Main Contributor"] },
          value: { none: ["Coronet Films"] }
        }
      ],
      requiredStatement: {
        label: { en: ["Attribution"] },
        value: {
          none: ["<span>Creative commons <a href=\"https://creativecommons.org/licenses/by-sa/3.0\">CC BY-SA 3.0</a></span>"]
        }
      },
      placeholderCanvas: {
        id: 'http://example.com/playlists/1/canvas/2/placeholder',
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: 'http://example.com/playlists/1/canvas/2/placeholder/1',
            type: "AnnotationPage",
            items: [
              {
                id: 'http://example.com/playlists/1/canvas/2/placeholder/1-image',
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: 'http://example.com/volleyball/volleyball_poster.jpg',
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: 'http://example.com/playlists/1/canvas/2/placeholder'
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'http://example.com/playlists/1/canvas/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/playlists/1/canvas/2/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'http://example.com/volleyball/high/volleyball-for-boys.m3u8#t=0,32.0',
                type: 'Video',
                format: 'application/x-mpegURL',
                label: {
                  en: ['High'],
                },
                height: 360,
                width: 480,
                duration: 32.0
              },
              target: 'http://example.com/playlists/1/canvas/2',
            },
          ],
        },
      ],
      annotations: [
        {
          type: "AnnotationPage",
          id: 'http://example.com/playlists/1/canvas/2/annotation_page/1',
          items: [
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 1"
              },
              id: 'http://example.com/playlists/1/canvas/2/marker/3',
              target: 'http://example.com/playlists/1/canvas/2#t=2.836',
            },
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 2"
              },
              id: 'http://example.com/playlists/1/canvas/2/marker/4',
              target: 'http://example.com/playlists/1/canvas/2#t=25.941'
            }
          ]
        }
      ],
    },
    {
      id: 'http://example.com/playlists/1/canvas/3',
      type: 'Canvas',
      duration: 572.034,
      label: {
        en: ["Lunchroom Manners"]
      },
      homepage: [
        {
          id: 'https://example.com/playlists/1?position=3',
          type: 'Text',
          label: { none: ['View in Repository'] },
          format: 'text/html'
        }
      ],
      placeholderCanvas: {
        id: 'http://example.com/playlists/1/canvas/3/placeholder',
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: 'http://example.com/playlists/1/canvas/3/placeholder/1',
            type: "AnnotationPage",
            items: [
              {
                id: 'http://example.com/playlists/1/canvas/3/placeholder/1-image',
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: 'http://example.com/lunchroom_manners/lunchroom_manners_poster.jpg',
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: 'http://example.com/playlists/1/canvas/3/placeholder'
              }
            ]
          }
        ]
      },
      items: [
        {
          id: 'http://example.com/playlists/1/canvas/3/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/playlists/1/canvas/3/page/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'http://example.com/lunchroom_manners/high/lunchroom_manners_1024kb.mp4#t=0,572.0',
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
                      id: 'http://example.com/lunchroom_manners/medium/lunchroom_manners_512kb.mp4#t=0,572.0',
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
                      id: 'http://example.com/lunchroom_manners/low/lunchroom_manners_256kb.mp4#t=0,572.0',
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
              target: 'http://example.com/playlists/1/canvas/3',
            },
          ],
        },
      ],
      annotations: [
        {
          type: "AnnotationPage",
          id: 'http://example.com/playlists/1/canvas/3/annotation_page/1',
          items: [
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 1"
              },
              id: 'http://example.com/playlists/1/canvas/3/marker/1',
              target: 'http://example.com/playlists/1/canvas/3#t=2.836',
            },
            {
              type: "Annotation",
              motivation: "highlighting",
              body: {
                type: "TextualBody",
                format: "text/html",
                value: "Marker 2"
              },
              id: 'http://example.com/playlists/1/canvas/3/marker/2',
              target: 'http://example.com/playlists/1/canvas/3#t=369.811'
            }
          ]
        }
      ],
    },
  ],
  structures: [
    {
      id: 'http://example.com/playlists/1/range/0',
      type: 'Range',
      behavior: 'top',
      label: null,
      items: [
        {
          id: 'http://example.com/playlists/1/range/1',
          type: 'Range',
          label: { en: ['Restricted Item'] },
          items: [
            {
              type: "Canvas",
              id: 'http://example.com/playlists/1/canvas/1#t=0,'
            }
          ]
        },
        {
          id: 'http://example.com/playlists/1/range/2',
          type: 'Range',
          label: { en: ['Playlist Item 1'] },
          items: [
            {
              type: "Canvas",
              id: 'http://example.com/playlists/1/canvas/2#t=0,'
            }
          ]
        },
        {
          id: 'http://example.com/playlists/1/range/3',
          type: 'Range',
          label: { en: ['Playlist Item 2'] },
          items: [
            {
              type: "Canvas",
              id: 'http://example.com/playlists/1/canvas/3#t=0,'
            }
          ]
        },
      ]
    }
  ]
};
