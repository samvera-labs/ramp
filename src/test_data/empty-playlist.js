export default {
  '@context': [
    "http://www.w3.org/ns/anno.jsonld",
    "http://iiif.io/api/presentation/3/context.json"
  ],
  type: "Manifest",
  id: "https://example.com/manifest/empty-playlist",
  label: {
    none: [
      "Empty playlist [Playlist]"
    ]
  },
  behavior: [
    "auto-advance"
  ],
  metadata: [
    {
      label: {
        none: [
          "Title"
        ]
      },
      value: {
        none: [
          "Empty playlist [Playlist]"
        ]
      }
    }
  ],
  service: [
    {
      id: "https://example.com/avalon_marker",
      type: "AnnotationService0"
    }
  ],
  homepage: [
    {
      id: "https://example.com/playlists/1",
      type: "Text",
      label: {
        none: [
          "View in Repository"
        ]
      },
      format: "text/html"
    }
  ],
  items: [],
  structures: [
    {
      type: "Range",
      id: "https://example.com/playlists/1/manifest/range/1",
      label: null,
      behavior: "top",
      items: []
    }
  ]
};
