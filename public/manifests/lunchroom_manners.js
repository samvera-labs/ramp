import config from '../../env';
const url_suffix = config.url;

export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${url_suffix}/manifests/lunchroom_manners.json`,
  type: 'Manifest',
  label: {
    en: ['Beginning Reponsibility: Lunchroom Manners [motion picture] Coronet Films'],
  },
  metadata: [
    {
      label: { en: ["Title"] },
      value: { none: ["This is the <pre>title</pre> of the item!"] }
    },
    {
      label: { none: ["Date"] },
      value: { none: ["2023 (Creation date: 2023)"] }
    },
    {
      label: { none: ["Main contributors"] },
      value: { none: ["The Avalon Media System Team"] }
    },
    {
      label: { none: ["Summary"] },
      value: { none: ["This is the summary field. It may include a summary of the item.\n\nDoes a  pre  tag exist here?\n\n<b>How about some bold?</b>\n\n<i>Or italics?</i>"] }
    },
    {
      label: { none: ["Contributors"] },
      value: { none: ["Mr. Bungle", "Coronet Films"] }
    },
    {
      label: { none: ["Publishers"] },
      value: { none: ["Indiana University", "Avalon"] }
    },
    {
      label: { none: ["Genres"] },
      value: { none: ["Education", "Puppet"] }
    },
    {
      label: { none: ["Subjects"] },
      value: { none: ["Puppets", "Best Practice"] }
    },
    {
      label: { none: ["Time period"] },
      value: { none: ["2020-2021"] }
    },
    {
      label: { none: ["Locations"] },
      value: { none: ["Indiana University", "Indiana"] }
    },
    {
      label: { none: ["Collection"] },
      value: { none: ["<a href=\"https://demo.avalonmediasystem.org/collections/0v838084c\">Testing</a>"] }
    },
    {
      label: { none: ["Unit"] },
      value: { none: ["<a href=\"https://demo.avalonmediasystem.org/collections?filter=Sample+Content\">Default Unit</a>"] }
    },
    {
      label: { none: ["Languages"] },
      value: { none: ["English"] }
    },
    {
      label: { none: ["Rights Statement"] },
      value: { none: ["<a href=\"http://rightsstatements.org/vocab/InC-EDU/1.0/\">In Copyright - Educational Use Permitted</a>"] }
    },
    {
      label: { none: ["Terms of Use"] },
      value: { none: ["These are the terms of use. They are written in this field."] }
    },
    {
      label: { none: ["Physical Descriptions"] },
      value: { none: ["Puppets", "Lunchroom"] }
    },
    {
      label: { none: ["Related Items"] },
      value: { none: ["<a href=\"https://www.imdb.com/title/tt0333842/\">IMDB Record</a>", "<a href=\"https://avalonmediasystem.org\">Avalon Website</a>"] }
    },
    {
      label: { none: ["Notes"] },
      value: { none: ["Here's a general note."] }
    },
    {
      label: { none: ["Local Note"] },
      value: { none: ["Here's a very local note."] }
    },
    {
      label: { none: ["Table of Contents"] },
      value: { none: ["ToC\n--\nFirst Chapter\n--\nSecond Chapter", "This is a second table of contents field.\n\nMore chapters here?"] }
    },
    {
      label: { none: ["Other Identifiers"] },
      value: { none: ["Videorecording Identifier: VA2038", "Issue Number: 77"] }
    }
  ],
  rendering: [
    {
      id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
      type: 'Text',
      label: {
        en: ['Transcript file']
      },
      format: 'text/vtt',
    },
  ],
  start: {
    id: `${url_suffix}/manifests/lunchroom_manners.json`,
    type: 'SpecificResource',
    source: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
    selector: {
      type: 'PointSelector',
      t: 180,
    },
  },
  items: [
    {
      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      placeholderCanvas: {
        id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder`,
        type: "Canvas",
        width: 640,
        height: 360,
        items: [
          {
            id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder/1`,
            type: "AnnotationPage",
            items: [
              {
                id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder/1-image`,
                type: "Annotation",
                motivation: "painting",
                body: {
                  id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
                  type: "Image",
                  format: "image/jpeg",
                  width: 640,
                  height: 360
                },
                target: `${url_suffix}/manifests/lunchroom_manners/canvas/1/placeholder`
              }
            ]
          }
        ]
      },
      items: [
        {
          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page`,
          type: 'AnnotationPage',
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/canvas/1/page/annotation`,
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: `${url_suffix}/lunchroom_manners/high/lunchroom_manners_1024kb.mp4`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/medium/lunchroom_manners_512kb.mp4`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
                      id: `${url_suffix}/lunchroom_manners/low/lunchroom_manners_256kb.mp4`,
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
                  id: `${url_suffix}/lunchroom_manners/lunchroom_manners.vtt`,
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
              target: `${url_suffix}/manifests/lunchroom_manners/canvas/1`,
            },
          ],
        },
      ],
      rendering: [
        {
          id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
          type: 'Image',
          label: {
            en: ['Poster Image']
          },
          format: 'image/jpeg',
        },
      ],
    },
  ],
  structures: [
    {
      id: `${url_suffix}/manifests/lunchroom_manners/range/0`,
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
          id: `${url_suffix}/manifests/lunchroom_manners/range/1`,
          type: 'Range',
          label: { en: ['Lunchroom Manners'] },
          items: [
            {
              id: `${url_suffix}/manifests/lunchroom_manners/range/1-1`,
              type: 'Range',
              label: { en: ['Washing Hands'] },
              items: [
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-1-1`,
                  type: 'Range',
                  label: { en: ['Using Soap'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=157,160`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-1-3`,
                  type: 'Range',
                  label: { en: ['Rinsing Well'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=165,170`,
                      type: 'Canvas',
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/1-2`,
                  type: 'Range',
                  label: { en: ['After Washing Hands'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/1-2-1`,
                      type: 'Range',
                      label: { en: ['Drying Hands'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=170,180`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/1-2-2`,
                      type: 'Range',
                      label: { en: ['Getting Ready'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=180,190`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: `${url_suffix}/manifests/lunchroom_manners/range/2`,
              type: 'Range',
              label: { en: ['In the Lunchroom'] },
              items: [
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-1`,
                  type: 'Range',
                  label: { en: ['At the Counter'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-1`,
                      type: 'Range',
                      label: { en: ['Getting Tray'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=227,245`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-2`,
                      type: 'Range',
                      label: { en: ['Choosing Food'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=258,288`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-1-3`,
                      type: 'Range',
                      label: { en: ['There will be Cake'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=301,308`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-2`,
                  type: 'Range',
                  label: { en: ['At the Table'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-2-1`,
                      type: 'Range',
                      label: { en: ['Sitting Quietly'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=323,333`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-2-2`,
                      type: 'Range',
                      label: { en: ['Eating Neatly'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=362,378`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: `${url_suffix}/manifests/lunchroom_manners/range/2-3`,
                  type: 'Range',
                  label: { en: ['Leaving the Lunchroom'] },
                  items: [
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-3-1`,
                      type: 'Range',
                      label: { en: ['Cleaning Up'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=448,492`,
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
                      id: `${url_suffix}/manifests/lunchroom_manners/range/2-3-2`,
                      type: 'Range',
                      label: { en: ['Putting Things Away'] },
                      items: [
                        {
                          id: `${url_suffix}/manifests/lunchroom_manners/canvas/1#t=511,527`,
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  thumbnail: [
    {
      id: `${url_suffix}/lunchroom_manners/lunchroom_manners_poster.jpg`,
      type: 'Image',
    },
  ],
};
