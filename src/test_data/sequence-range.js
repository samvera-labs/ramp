export default {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "https://example.com/alternate-sequence-video/manifest.json",
  "type": "Manifest",
  "label": {
    "it": [
      "L'Elisir D'Amore"
    ],
    "en": [
      "The Elixir of Love"
    ]
  },
  "items": [
    {
      "id": "https://example.com/alternate-sequence-video/canvas/1",
      "type": "Canvas",
      "width": 1920,
      "height": 1080,
      "duration": 3971.24,
      "label": {
        "en": [
          "Atto Primo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-video/canvas/1/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/alternate-sequence-video/canvas/1/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/alternate-sequence-video/canvas/1",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_1.mp4",
                "type": "Video",
                "format": "video/mp4",
                "height": 1080,
                "width": 1920,
                "duration": 3971.24
              }
            }
          ]
        }
      ],
      "thumbnail": [
        {
          "id": "https://example.com/act1-thumbnail.png",
          "type": "Image"
        }
      ]
    },
    {
      "id": "https://example.com/alternate-sequence-video/canvas/2",
      "type": "Canvas",
      "width": 1920,
      "height": 1080,
      "duration": 3307.22,
      "label": {
        "en": [
          "Atto Secondo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-video/canvas/2/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/alternate-sequence-video/canvas/2/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/alternate-sequence-video/canvas/2",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_2.mp4",
                "type": "Video",
                "format": "video/mp4",
                "height": 1080,
                "width": 1920,
                "duration": 3307.22
              }
            }
          ]
        }
      ],
      "thumbnail": [
        {
          "id": "https://example.com/act2-thumbnail.png",
          "type": "Image"
        }
      ]
    }
  ],
  "structures": [
    {
      "id": "https://example.com/alternate-sequence-video/range/s1",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Physical sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-video/canvas/2",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/alternate-sequence-video/canvas/1",
          "type": "Canvas"
        }
      ]
    },
    {
      "id": "https://example.com/alternate-sequence-video/range/s2",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Author-intended sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-video/canvas/1",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/alternate-sequence-video/canvas/2",
          "type": "Canvas"
        }
      ]
    },
    {
      "type": "Range",
      "id": "https://example.com/alternate-sequence-video/range/1",
      "label": {
        "it": [
          "Gaetano Donizetti, L'Elisir D'Amore"
        ]
      },
      "items": [
        {
          "type": "Range",
          "id": "https://example.com/alternate-sequence-video/range/2",
          "label": {
            "en": [
              "Atto Primo"
            ]
          },
          "items": [
            {
              "type": "Range",
              "id": "https://example.com/alternate-sequence-video/range/3",
              "label": {
                "it": [
                  "Preludio e Coro d'introduzione – Bel conforto al mietitore"
                ]
              },
              "items": [
                {
                  "type": "Canvas",
                  "id": "https://example.com/alternate-sequence-video/canvas/1#t=0,302.05"
                }
              ]
            },
            {
              "type": "Range",
              "id": "https://example.com/alternate-sequence-video/range/4",
              "label": {
                "en": [
                  "Remainder of Atto Primo"
                ]
              },
              "items": [
                {
                  "type": "Canvas",
                  "id": "https://example.com/alternate-sequence-video/canvas/1#t=302.05,3971.24"
                }
              ]
            }
          ]
        },
        {
          "type": "Range",
          "id": "https://example.com/alternate-sequence-video/range/5",
          "label": {
            "en": [
              "Atto Secondo"
            ]
          },
          "items": [
            {
              "type": "Canvas",
              "id": "https://example.com/alternate-sequence-video/canvas/2#t=0,3307.22"
            }
          ]
        }
      ]
    }
  ]
};

export const audioSequenceRange = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "https://example.com/alternate-sequence-audio/manifest.json",
  "type": "Manifest",
  "label": {
    "it": [
      "L'Elisir D'Amore"
    ],
    "en": [
      "The Elixir of Love"
    ]
  },
  "items": [
    {
      "id": "https://example.com/alternate-sequence-audio/canvas/1",
      "type": "Canvas",
      "width": 1920,
      "height": 1080,
      "duration": 3971.24,
      "label": {
        "en": [
          "Atto Primo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/1/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/alternate-sequence-audio/canvas/1/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/alternate-sequence-audio/canvas/1",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_1.mp4",
                "type": "Sound",
                "format": "audio/mp4",
                "height": 1080,
                "width": 1920,
                "duration": 3971.24
              }
            }
          ]
        }
      ]
    },
    {
      "id": "https://example.com/alternate-sequence-audio/canvas/2",
      "type": "Canvas",
      "width": 1920,
      "height": 1080,
      "duration": 3307.22,
      "label": {
        "en": [
          "Atto Secondo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/2/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/alternate-sequence-audio/canvas/2/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/alternate-sequence-audio/canvas/2",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_2.mp4",
                "type": "Sound",
                "format": "audio/mp4",
                "height": 1080,
                "width": 1920,
                "duration": 3307.22
              }
            }
          ]
        }
      ]
    }
  ],
  "structures": [
    {
      "id": "https://example.com/alternate-sequence-audio/range/s1",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Physical sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/2",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/1",
          "type": "Canvas"
        }
      ]
    },
    {
      "id": "https://example.com/alternate-sequence-audio/range/s2",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Author-intended sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/1",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/alternate-sequence-audio/canvas/2",
          "type": "Canvas"
        }
      ]
    }
  ]
};

export const nestedSequenceRange = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "https://example.com/nested-sequence-range/manifest.json",
  "type": "Manifest",
  "label": {
    "en": [
      "The Elixir of Love"
    ]
  },
  "items": [
    {
      "id": "https://example.com/nested-sequence-range/canvas/1",
      "type": "Canvas", "width": 1920, "height": 1080, "duration": 3971.24,
      "label": {
        "en": [
          "Atto Primo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/nested-sequence-range/canvas/1/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/nested-sequence-range/canvas/1/annotation_page/1/annotation/1",
              "type": "Annotation", "motivation": "painting",
              "target": "https://example.com/nested-sequence-range/canvas/1",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_1.mp4",
                "type": "Sound", "format": "audio/mp4", "height": 1080, "width": 1920, "duration": 3971.24
              }
            }
          ]
        }
      ]
    },
    {
      "id": "https://example.com/nested-sequence-range/canvas/2",
      "type": "Canvas", "width": 1920, "height": 1080, "duration": 3307.22,
      "label": {
        "en": [
          "Atto Secondo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/nested-sequence-range/canvas/2/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/nested-sequence-range/canvas/2/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/nested-sequence-range/canvas/2",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_2.mp4",
                "type": "Sound", "format": "audio/mp4", "height": 1080, "width": 1920, "duration": 3307.22
              }
            }
          ]
        }
      ]
    }
  ],
  "structures": [
    {
      "id": "https://example.com/nested-sequence-range/range/s1",
      "type": "Range",
      "items": [
        {
          "id": "https://example.com/nested-sequence-range/range/s1/1",
          "type": "Range",
          "behavior": [
            "sequence"
          ],
          "label": {
            "en": [
              "Test order"
            ]
          },
          "items": [
            {
              "id": "https://example.com/nested-sequence-range/canvas/2",
              "type": "Canvas"
            },
            {
              "id": "https://example.com/nested-sequence-range/canvas/1",
              "type": "Canvas"
            }
          ]
        }
      ]
    }
  ]
};

export const invalidSequenceRanges = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "https://example.com/invalid-sequence-range/manifest.json",
  "type": "Manifest",
  "label": {
    "en": [
      "The Elixir of Love"
    ]
  },
  "items": [
    {
      "id": "https://example.com/invalid-sequence-range/canvas/1",
      "type": "Canvas", "width": 1920, "height": 1080, "duration": 3971.24,
      "label": {
        "en": [
          "Atto Primo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/invalid-sequence-range/canvas/1/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/invalid-sequence-range/canvas/1/annotation_page/1/annotation/1",
              "type": "Annotation", "motivation": "painting",
              "target": "https://example.com/invalid-sequence-range/canvas/1",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_1.mp4",
                "type": "Sound", "format": "audio/mp4", "height": 1080, "width": 1920, "duration": 3971.24
              }
            }
          ]
        }
      ]
    },
    {
      "id": "https://example.com/invalid-sequence-range/canvas/2",
      "type": "Canvas", "width": 1920, "height": 1080, "duration": 3307.22,
      "label": {
        "en": [
          "Atto Secondo"
        ]
      },
      "items": [
        {
          "id": "https://example.com/invalid-sequence-range/canvas/2/annotation_page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/invalid-sequence-range/canvas/2/annotation_page/1/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://example.com/invalid-sequence-range/canvas/2",
              "body": {
                "id": "https://example.com/vae0637_accessH264_low_act_2.mp4",
                "type": "Sound", "format": "audio/mp4", "height": 1080, "width": 1920, "duration": 3307.22
              }
            }
          ]
        }
      ]
    }
  ],
  "structures": [
    {
      "id": "https://example.com/invalid-sequence-range/range/s1",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Physical sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/invalid-sequence-range/canvas/2",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/invalid-sequence-range/canvas/1",
          "type": "Canvas"
        }
      ]
    },
    {
      "id": "https://example.com/invalid-sequence-range/range/s2",
      "type": "Range",
      "behavior": [
        "sequence"
      ],
      "label": {
        "en": [
          "Author-intended sequence"
        ]
      },
      "items": [
        {
          "id": "https://example.com/invalid-sequence-range/canvas/1",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/invalid-sequence-range/canvas/2",
          "type": "Canvas"
        },
        {
          "id": "https://example.com/invalid-sequence-range/canvas/3",
          "type": "Canvas"
        }
      ]
    }
  ]
};
