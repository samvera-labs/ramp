export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://example.com/manifest/lunchroom_manners',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  service: [
    {
      type: "SearchService2",
      id: "http://example.com/manifest/search"
    }
  ],
  metadata: [
    {
      label: { none: ["Title"] },
      value: { none: ["This is the <pre>title</pre> of the item!"] }
    },
    {
      label: { en: ["Date"] },
      value: { en: ["2023 (Creation date: 2023)"] }
    },
    {
      label: { en: ["Main contributors"] },
      value: { en: ["John Doe", "The <nav>Avalon</nav> Media System Team"] }
    },
    {
      label: { en: ["Summary"] },
      value: { en: ["This is the summary field. It may include a summary of the item.\n\nDoes a  pre  tag exist here?\n\n\u003cb\u003eHow about some bold?\u003c/b\u003e\n\n\u003ci\u003eOr italics?\u003c/i\u003e"] }
    },
    {
      label: { en: ["Contributors"] },
      value: { en: ["Jon's Cats", "Adorable Dogs"] }
    },
    {
      label: { en: ["Collection"] },
      value: { en: ["<a href=\"https://example.com/collections/fb4948403\">Testing</a>"] }
    },
    {
      label: { none: ["Related Items"] },
      value: { none: ["<a href=\"https://iu.edu\" src=\"www.example.com\">IU</a>", "<a href=\"https://avalonmediasystem.org\">Avalon Website</a>"] }
    },
    {
      label: { none: ["Notes"] },
      value: { none: ["<a href=\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\" />"] }
    },
    {
      label: { en: ["Table of Contents"] },
      value: { en: ["ToC\n--\nFirst Chapter\n--\nSecond Chapter", "This is a second table of contents field.\n\nMore chapters here?"] }
    },
    {
      label: { en: ["Notes"] },
      value: null
    }
  ],
  rendering: [
    {
      id: 'https://example.com/lunchroom_manners/transcript.vtt',
      type: 'Text',
      label: { en: ['Transcript rendering file'] },
      format: 'text/vtt',
    }
  ],
  rights: "http://creativecommons.org/licenses/by-sa/3.0/",
  start: {
    id: 'https://example.com/manifest/lunchroom_manners',
    type: 'SpecificResource',
    source: 'https://example.com/manifest/lunchroom_manners/canvas/2',
    selector: {
      type: 'PointSelector',
      t: 120.5,
    },
  },
  items: [
    {
      type: 'Canvas',
      id: 'https://example.com/manifest/lunchroom_manners/canvas/1',
      width: 480,
      height: 360,
      duration: 660,
      label: { en: ['Lunchroom Manners'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1/page/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/manifest/high/lunchroom_manners_1024kb.mp4',
                type: "Video",
                format: "video/mp4",
                width: 480,
                height: 360,
                duration: 660,
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/1',
            },
          ]
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/lunchroom_manners.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format [forced]'], none: ['lunchroom-manners.vtt']
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/1'
            }
          ]
        },
      ],
    },
    {
      type: 'Canvas',
      id: 'https://example.com/manifest/lunchroom_manners/canvas/2',
      width: 480,
      height: 360,
      duration: 660,
      label: { en: ['Lunchroom Manners 2'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/2/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/2/page/1',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/manifest/high/lunchroom_manners_512kb.mp4',
                type: "Video",
                format: "video/mp4",
                width: 480,
                height: 360,
                duration: 660,
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/2/page/2',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/2/annotation/1',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/lunchroom_manners/captions',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format']
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/2'
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/2/annotation/2',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/lunchroom_manners/transcripts',
                type: 'Text',
                format: 'text/vtt',
                label: {
                  en: ['Captions in WebVTT format.txt (machine-generated)'],
                },
                language: 'en',
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/2'
            },
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/2/annotation/2',
              type: 'Annotation',
              motivation: 'supplementing',
              body: {
                id: 'https://example.com/manifest/lunchroom_manners_forced.vtt',
                type: 'Text',
                format: 'text/vtt',
                label: { en: ['French captions [forced]'], none: ['lunchroom-manners-fr.vtt'] },
                language: 'fr',
              },
              target: 'https://example.com/manifest/lunchroom_manners/canvas/2',
            }
          ]
        },
      ]
    },
  ],
  structures: [
    {
      id: 'https://example.com/manifest/lunchroom_manners/range/0',
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/range/1',
          type: 'Range',
          label: { en: ['Lunchroom Manners'] },
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=0,660',
              type: 'Canvas',
            }
          ]
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/range/1',
          type: 'Range',
          label: { en: ['Lunchroom Manners 2'] },
          items: [
            {
              id: 'https://example.com/manifest/lunchroom_manners/canvas/2#t=0,660',
              type: 'Canvas',
            }
          ]
        }
      ],
    },
  ],
  thumbnail: [
    {
      id: 'https://example.com/manifest/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
