export default {
  '@context': [
    "http://www.w3.org/ns/anno.jsonld",
    "http://iiif.io/api/auth/2/context.json",
    "http://iiif.io/api/presentation/3/context.json"
  ],
  id: 'http://example.com/auth-manifest/manifest.json',
  type: 'Manifest',
  label: { en: ['Auth Test Manifest'] },
  items: [
    {
      id: 'http://example.com/auth-manifest/canvas/1',
      type: 'Canvas',
      duration: 300,
      label: { en: ['Protected Video'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/1/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/1/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/1',
              body: {
                id: 'http://example.com/auth-manifest/video/protected.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 300,
                service: [
                  {
                    id: 'http://example.com/auth/probe?id=protected.mp4',
                    type: 'AuthProbeService2',
                    errorHeading: { en: ['No access'] },
                    errorNote: { en: ['You do not have permission to access this resource'] },
                    service: [
                      {
                        id: 'http://example.com/auth/login',
                        type: 'AuthAccessService2',
                        profile: 'active',
                        label: { en: ['Login to access restricted content'] },
                        heading: { en: ['Authentication Required'] },
                        note: { en: ['Please log in with your institution credentials'] },
                        confirmLabel: { en: ['Log in'] },
                        service: [
                          {
                            id: 'http://example.com/auth/token',
                            type: 'AuthAccessTokenService2',
                            errorHeading: { en: ['Something went wrong with the token service'] },
                            errorNote: { en: ['Could not get a token. Please contact support.'] }
                          },
                          {
                            id: 'http://example.com/auth/logout',
                            type: 'AuthLogoutService2',
                            label: { en: ['Log out from service'] }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/auth-manifest/canvas/2',
      type: 'Canvas',
      duration: 120,
      label: { en: ['Open Access Video'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/2/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/2/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/2',
              body: {
                id: 'http://example.com/auth-manifest/video/open.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 120
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/auth-manifest/canvas/3',
      type: 'Canvas',
      duration: 120,
      label: { en: ['Multi Quality Video'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/3/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/3/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/3',
              body: {
                type: 'Choice',
                choiceHint: 'user',
                items: [
                  {
                    id: 'http://example.com/auth-manifest/video/high.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    duration: 300,
                    label: { en: ['High Quality'] },
                    service: [
                      {
                        id: 'http://example.com/auth/probe?id=high.mp4',
                        type: 'AuthProbeService2',
                        errorHeading: { en: ['No access'] },
                        errorNote: { en: ['You do not have permission to access this resource'] },
                        service: [
                          {
                            id: 'http://example.com/auth/login',
                            type: 'AuthAccessService2',
                            profile: 'active',
                            label: { en: ['Login to access restricted content'] },
                            heading: { en: ['Authentication Required'] },
                            note: { en: ['Please log in with your institution credentials'] },
                            confirmLabel: { en: ['Log in'] },
                            service: [
                              { id: 'http://example.com/auth/token', type: 'AuthAccessTokenService2' },
                              { id: 'http://example.com/auth/logout', type: 'AuthLogoutService2' }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'http://example.com/auth-manifest/video/medium.mp4',
                    type: 'Video',
                    format: 'video/mp4',
                    duration: 300,
                    label: { en: ['Medium Quality'] },
                    service: [
                      {
                        id: 'http://example.com/auth/probe?id=medium.mp4',
                        type: 'AuthProbeService2',
                        errorHeading: { en: ['No access'] },
                        errorNote: { en: ['You do not have permission to access this resource'] },
                        service: [
                          {
                            id: 'http://example.com/auth/login',
                            type: 'AuthAccessService2',
                            profile: 'active',
                            label: { en: ['Login to access restricted content'] },
                            heading: { en: ['Authentication Required'] },
                            note: { en: ['Please log in with your institution credentials'] },
                            confirmLabel: { en: ['Log in'] },
                            service: [
                              { id: 'http://example.com/auth/token', type: 'AuthAccessTokenService2' },
                              { id: 'http://example.com/auth/logout', type: 'AuthLogoutService2' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/auth-manifest/canvas/4',
      type: 'Canvas',
      duration: 120,
      label: { en: ['Probe w/o Access Service'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/4/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/4/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/4',
              body: {
                id: 'http://example.com/auth-manifest/video/restricted.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 120,
                service: [
                  {
                    id: 'http://example.com/auth/probe?id=restricted.mp4',
                    type: 'AuthProbeService2',
                    errorHeading: { en: ['Access restricted'] },
                    errorNote: { en: ['This resource is not accessible.'] }
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/auth-manifest/canvas/5',
      type: 'Canvas',
      duration: 120,
      label: { en: ['Access Service w/o Token Service'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/5/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/5/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/5',
              body: {
                id: 'http://example.com/auth-manifest/video/restricted2.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 120,
                service: [
                  {
                    id: 'http://example.com/auth/probe?id=restricted2.mp4',
                    type: 'AuthProbeService2',
                    service: [
                      {
                        id: 'http://example.com/auth/login',
                        type: 'AuthAccessService2',
                        profile: 'active',
                        label: { en: ['Login'] },
                        service: [
                          {
                            id: 'http://example.com/auth/logout',
                            type: 'AuthLogoutService2',
                            label: { en: ['Log out'] }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'http://example.com/auth-manifest/canvas/6',
      type: 'Canvas',
      duration: 56.6,
      label: { en: ['Other Service Canvas'] },
      items: [
        {
          id: 'http://example.com/auth-manifest/canvas/6/page/1',
          type: 'AnnotationPage',
          items: [
            {
              id: 'http://example.com/auth-manifest/canvas/6/page/1/annotation/1',
              type: 'Annotation',
              motivation: 'painting',
              target: 'http://example.com/auth-manifest/canvas/6',
              body: {
                id: 'http://example.com/auth-manifest/video/other.mp4',
                type: 'Video',
                format: 'video/mp4',
                duration: 56.6,
                service: [{ id: 'http://example.com/other', type: 'OtherService' }]
              }
            }
          ]
        }
      ]
    },
  ]
};
