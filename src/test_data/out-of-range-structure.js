export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'http://example.com/out-of-range-structure/manifest.json',
  type: 'Manifest',
  label: { en: ['Out of Range Structure'] },
  items: [
    {
      id: 'http://example.com/out-of-range-structure/canvas/1',
      type: 'Canvas', width: 480, height: 360, duration: 660,
      items: [
        {
          id: 'http://example.com/out-of-range-structure/canvas/1/annotation_page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/out-of-range-structure/canvas/1/annotation_page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/out-of-range-structure/canvas/1',
              body: {
                id: 'http://example.com/out-of-range-structure/low.mp4',
                type: 'Video', format: 'video/mp4', width: 480, height: 360, duration: 660,
              }
            }
          ]
        }
      ]
    }
  ],
  structures: [
    {
      type: 'Range',
      id: 'http://example.com/out-of-range-structure/range/1',
      label: { en: ['Out of Range Structure'] },
      items: [
        {
          type: 'Range',
          id: 'http://example.com/out-of-range-structure/range/2',
          label: { en: ['In Range Timespan'] },
          items: [
            {
              type: 'Canvas',
              id: 'http://example.com/out-of-range-structure/canvas/1#t=0,150'
            }
          ]
        },
        {
          type: 'Range',
          id: 'http://example.com/out-of-range-structure/range/3',
          label: { en: ['Out of Range Timespan'] },
          items: [
            {
              type: 'Canvas',
              id: 'http://example.com/out-of-range-structure/canvas/1#t=670,700'
            }
          ]
        }
      ]
    }
  ]
};
