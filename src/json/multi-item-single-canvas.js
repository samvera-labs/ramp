export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif.io/multi-item-single-canvas/canvas/manifest.json',
  type: 'Manifest',
  label: {
    en: ['Stream Media Concat'],
  },
  items: [
    {
      id: 'https://iiif.io/multi-item-single-canvas/canvas/canvas/1',
      type: 'Canvas',
      width: 1920,
      height: 1080,
      duration: 1484,
      items: [
        {
          id: 'https://iiif.io/multi-item-single-canvas/canvas/1/annotation_page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.io/multi-item-single-canvas/canvas/1/annotation_page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://iiif.io/multi-item-single-canvas/canvas/1#t=0,886',
              body: {
                id: 'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8',
                type: 'Video',
                format: 'application/x-mpegURL',
                height: 1080,
                width: 1920,
                duration: 886,
              },
            },
            {
              id: 'https://iiif.io/multi-item-single-canvas/canvas/1/annotation_page/1/annotation/2',
              type: 'Annotation',
              motivation: 'painting',
              target:
                'https://iiif.io/multi-item-single-canvas/canvas/1#t=886,1484',
              body: {
                id: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
                type: 'Video',
                format: 'application/x-mpegURL',
                height: 1080,
                width: 1920,
                duration: 598,
              },
            },
          ],
        },
      ],
      thumbnail: [
        {
          id: 'https://fixtures.iiif.io/video/indiana/donizetti-elixir/act1-thumbnail.png',
          type: 'Image',
        },
      ],
    },
  ],
  structures: [
    {
      type: 'Range',
      id: 'https://iiif.io/multi-item-single-canvas/range/1',
      label: {
        en: ['Multi Item - Single Canvas'],
      },
      items: [
        {
          type: 'Range',
          id: 'https://iiif.io/multi-item-single-canvas/range/2',
          label: {
            en: ['First Video'],
          },
          items: [
            {
              type: 'Canvas',
              id: 'https://iiif.io/multi-item-single-canvas/canvas/1#t=0,886',
            },
          ],
        },
        {
          type: 'Range',
          id: 'https://iiif.io/multi-item-single-canvas/range/4',
          label: {
            en: ['Second Video'],
          },
          items: [
            {
              type: 'Canvas',
              id: 'https://iiif.io/multi-item-single-canvas/canvas/1#t=886,1484',
            },
          ],
        },
      ],
    },
  ],
};
