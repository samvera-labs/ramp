export default {
  '@context': [
    'http://www.w3.org/ns/anno.jsonld',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  type: 'Manifest',
  id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest',
  label: {
    en: ['Beginning Responsibility: Lunchroom Manners'],
  },
  description:
    'The rude, clumsy puppet Mr. Bungle shows kids how to behave in the school cafeteria - the assumption being that kids actually want to behave during lunch. This film has a cult following since it appeared on a Pee Wee Herman HBO special.',
  rendering: [],
  items: [
    {
      id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
      type: 'Canvas',
      width: 480,
      height: 360,
      duration: 660,
      items: [
        {
          id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1/annopage/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1/annopage/1/1',
              type: 'Annotation',
              motivation: 'painting',
              taget:
                'https://dlib.indiana.edu/iiif-av/iiif-player-samples/lunchroom-manners/manifest/canvas/1',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      height: 360,
                      width: 480,
                      duration: 660,
                      label: {
                        en: ['high'],
                      },
                    },
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_512kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      height: 360,
                      width: 480,
                      duration: 660,
                      label: {
                        en: ['medium'],
                      },
                    },
                    {
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_256kb.mp4',
                      type: 'Video',
                      format: 'video/mp4',
                      height: 360,
                      width: 480,
                      duration: 660,
                      label: {
                        en: ['low'],
                      },
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
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
      type: 'Image',
    },
  ],
};
