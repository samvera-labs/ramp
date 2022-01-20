export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
<<<<<<< HEAD
  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.json',
=======
  id: '/manifests/lunchroom_manners.json',
>>>>>>> Fix urls for dev and prod
  type: 'Manifest',
  label: {
    en: [
      'Beginning Reponsibility: Lunchroom Manners [motion picture] Coronet Films',
    ],
  },
  start: {
<<<<<<< HEAD
    id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.json',
    type: 'SpecificResource',
    source: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1',
=======
    id: '/manifests/lunchroom_manners.json',
    type: 'SpecificResource',
    source: '/manifests/lunchroom_manners/canvas/1',
>>>>>>> Fix urls for dev and prod
    selector: {
      type: 'PointSelector',
      t: 180,
    },
  },
  items: [
    {
<<<<<<< HEAD
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1',
=======
      id: '/manifests/lunchroom_manners/canvas/1',
>>>>>>> Fix urls for dev and prod
      type: 'Canvas',
      height: 360,
      width: 480,
      duration: 572.034,
      items: [
        {
<<<<<<< HEAD
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1/page/annotation',
=======
          id: '/manifests/lunchroom_manners/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: '/manifests/lunchroom_manners/canvas/1/page/annotation',
>>>>>>> Fix urls for dev and prod
              type: 'Annotation',
              motivation: 'painting',
              body: [
                {
                  type: 'Choice',
                  choiceHint: 'user',
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
=======
                      id: '/assets/lunchroom_manners/high/lunchroom_manners_1024kb.mp4',
>>>>>>> Fix urls for dev and prod
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['High'],
                      },
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/medium/lunchroom_manners_512kb.mp4',
=======
                      id: '/assets/lunchroom_manners/medium/lunchroom_manners_512kb.mp4',
>>>>>>> Fix urls for dev and prod
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Medium'],
                      },
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/low/lunchroom_manners_256kb.mp4',
=======
                      id: '/assets/lunchroom_manners/low/lunchroom_manners_256kb.mp4',
>>>>>>> Fix urls for dev and prod
                      type: 'Video',
                      format: 'video/mp4',
                      label: {
                        en: ['Low'],
                      },
                    },
                  ],
                },
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt',
=======
                  id: '/assets/lunchroom_manners/lunchroom_manners.vtt',
>>>>>>> Fix urls for dev and prod
                  type: 'Text',
                  format: 'text/vtt',
                  label: {
                    en: ['Captions in WebVTT format'],
                  },
                  language: 'en',
                },
              ],
<<<<<<< HEAD
              target:
                'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1',
=======
              target: '/manifests/lunchroom_manners/canvas/1',
>>>>>>> Fix urls for dev and prod
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
<<<<<<< HEAD
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/0',
=======
      id: '/manifests/lunchroom_manners/range/0',
>>>>>>> Fix urls for dev and prod
      type: 'Range',
      label: { en: ['Table of Contents'] },
      items: [
        {
<<<<<<< HEAD
          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1',
=======
          id: '/manifests/lunchroom_manners/range/1',
>>>>>>> Fix urls for dev and prod
          type: 'Range',
          label: { en: ['Lunchroom Manners'] },
          items: [
            {
<<<<<<< HEAD
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1',
=======
              id: '/manifests/lunchroom_manners/range/1-1',
>>>>>>> Fix urls for dev and prod
              type: 'Range',
              label: { en: ['Washing Hands'] },
              items: [
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1-1',
=======
                  id: '/manifests/lunchroom_manners/range/1-1-1',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['Using Soap'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=157,160',
=======
                      id: '/manifests/lunchroom_manners/canvas/1#t=157,160',
>>>>>>> Fix urls for dev and prod
                      type: 'Canvas',
                    },
                  ],
                },
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-1-3',
=======
                  id: '/manifests/lunchroom_manners/range/1-1-3',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['Rinsing Well'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=165,170',
=======
                      id: '/manifests/lunchroom_manners/canvas/1#t=165,170',
>>>>>>> Fix urls for dev and prod
                      type: 'Canvas',
                    },
                  ],
                },
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2',
=======
                  id: '/manifests/lunchroom_manners/range/1-2',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['After Washing Hands'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2-1',
=======
                      id: '/manifests/lunchroom_manners/range/1-2-1',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Drying Hands'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=170,180',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=170,180',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/1-2-2',
=======
                      id: '/manifests/lunchroom_manners/range/1-2-2',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Getting Ready'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=180,190',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=180,190',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
<<<<<<< HEAD
              id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2',
=======
              id: '/manifests/lunchroom_manners/range/2',
>>>>>>> Fix urls for dev and prod
              type: 'Range',
              label: { en: ['In the Lunchroom'] },
              items: [
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1',
=======
                  id: '/manifests/lunchroom_manners/range/2-1',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['At the Counter'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-1',
=======
                      id: '/manifests/lunchroom_manners/range/2-1-1',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Getting Tray'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=227,245',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=227,245',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-2',
=======
                      id: '/manifests/lunchroom_manners/range/2-1-2',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Choosing Food'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=258,288',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=258,288',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-1-3',
=======
                      id: '/manifests/lunchroom_manners/range/2-1-3',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['There will be Cake'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=301,308',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=301,308',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2',
=======
                  id: '/manifests/lunchroom_manners/range/2-2',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['At the Table'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2-1',
=======
                      id: '/manifests/lunchroom_manners/range/2-2-1',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Sitting Quietly'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=323,333',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=323,333',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-2-2',
=======
                      id: '/manifests/lunchroom_manners/range/2-2-2',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Eating Neatly'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=362,378',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=362,378',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                  ],
                },
                {
<<<<<<< HEAD
                  id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3',
=======
                  id: '/manifests/lunchroom_manners/range/2-3',
>>>>>>> Fix urls for dev and prod
                  type: 'Range',
                  label: { en: ['Leavning the Lunchroom'] },
                  items: [
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3-1',
=======
                      id: '/manifests/lunchroom_manners/range/2-3-1',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Cleaning Up'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=448,492',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=448,492',
>>>>>>> Fix urls for dev and prod
                          type: 'Canvas',
                        },
                      ],
                    },
                    {
<<<<<<< HEAD
                      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/range/2-3-2',
=======
                      id: '/manifests/lunchroom_manners/range/2-3-2',
>>>>>>> Fix urls for dev and prod
                      type: 'Range',
                      label: { en: ['Putting Things Away'] },
                      items: [
                        {
<<<<<<< HEAD
                          id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas/1#t=511,527',
=======
                          id: '/manifests/lunchroom_manners/canvas/1#t=511,527',
>>>>>>> Fix urls for dev and prod
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
<<<<<<< HEAD
      id: 'https://dlib.indiana.edu/iiif_av/lunchroom_manners/thumbnail/lunchroom_manners_poster.jpg',
=======
      id: '/assets/lunchroom_manners/lunchroom_manners_poster.jpg',
>>>>>>> Fix urls for dev and prod
      type: 'Image',
    },
  ],
};
