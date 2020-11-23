export default {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  '@type': 'sc:Collection',
  id: 'https://dlib.indiana.edu/iiif_av/iiif-player-samples/iu-collection.json',
  label: ['IU Collection'],
  metadata: [
    {
      label: 'Exhibit',
      value: ['puo'],
    },
  ],
  manifests: [
    {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      '@type': 'sc:Manifest',
      '@id':
        'https://dlib.indiana.edu/iiif_av/iiif-player-samples/mahler-symphony-audio.json',
      label: ['Mahler Symphony'],
      description: ['PUO', 'Compact discs.'],
    },
    {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      '@type': 'sc:Manifest',
      '@id':
        'https://dlib.indiana.edu/iiif_av/iiif-player-samples/volleyball-for-boys.json',
      label: ['Volleyball for Boys'],
      description: ['PUO', 'Compact discs.'],
    },
    {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      '@type': 'sc:Manifest',
      '@id':
        'https://dlib.indiana.edu/iiif_av/iiif-player-samples/lunchroom-manners.json',
      label: ['Lunchroom Manners'],
      description: ['Compact discs.'],
    },
  ],
};
