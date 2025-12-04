import React, { act, useEffect } from 'react';
import { render } from "@testing-library/react";
import * as hooks from "./ramp-hooks";
import { manifestState, withManifestAndPlayerProvider } from "./testing-helpers";
import playlist from "@TestData/playlist";
import singleCanvas from '@TestData/single-canvas';
import multiSourceManifest from '@TestData/multi-source-manifest';
import lunchroomManners from '@TestData/lunchroom-manners';
import audioManifest from '@TestData/transcript-canvas';

describe('useMarkers', () => {
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  let UIComponent;
  beforeEach(() => {
    UIComponent = () => {
      const results = hooks.useMarkers();
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
  });

  test('returns isDisabled = false by default', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isDisabled).toBeFalsy();
  });

  test('returns isDisabled = false when editing a marker', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        playlist: {
          ...manifestState(playlist),
          isEditing: true
        },
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isDisabled).toBeTruthy();
  });
});

describe('useMediaPlayer', () => {
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  let UIComponent;
  beforeEach(() => {
    UIComponent = () => {
      const results = hooks.useMediaPlayer();
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
  });

  test('returns isMultiCanvased = true for multi-canvas Manifest', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isMultiCanvased).toBeTruthy();
  });

  test('returns isMultiCanvased = false for single-canvas Manifest', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(singleCanvas)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isMultiCanvased).toBeFalsy();
  });

  test('returns lastCanvasIndex', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.lastCanvasIndex).toEqual(5);
  });
});

describe('useSetupPlayer', () => {
  let originalError, originalWarn;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    originalWarn = console.warn;
    console.warn = jest.fn();
    // Mock canPlayType to always return 'maybe' (truthy value)
    // This prevents tests from failing due to unsupported MIME types in test environment
    HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'maybe');
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
    jest.restoreAllMocks();
  });

  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = hooks.useSetupPlayer({
        ...props
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
    return UIComponent;
  };

  test('returns isVideo = true for video Canvas', () => {
    const UIComponent = renderHook({});
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(lunchroomManners)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isVideo).toBeTruthy();
  });

  test('returns isVideo = false for audio Canvas', () => {
    const UIComponent = renderHook({});
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(audioManifest)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isVideo).toBeFalsy();
  });

  test('returns isMultiSourced = true for multi-source Canvas', () => {
    const UIComponent = renderHook({});
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(multiSourceManifest)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isMultiSourced).toBeTruthy();
  });

  test('returns isMultiSourced = false for multi-source Canvas', () => {
    const UIComponent = renderHook({});
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(lunchroomManners)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.isMultiSourced).toBeFalsy();
  });

  test('returns renderingFiles is empty when enableFileDownload = false (default)', () => {
    const UIComponent = renderHook({});
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(lunchroomManners)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.renderingFiles).toEqual([]);
  });

  test('returns renderingFiles when enableFileDownload = true', () => {
    const UIComponent = renderHook({ enableFileDownload: true });
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(lunchroomManners)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.renderingFiles.length).toEqual(2);
    const files = resultRef.current.renderingFiles;
    expect(files[0].label).toEqual('Transcript rendering file (.vtt)');
  });

  test('returns placeholderCanvas text for inaccessible Canvas', () => {
    const UIComponent = renderHook();
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist, 5, true), autoAdvance: true
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.playerConfig.error)
      .toEqual('You do not have permission to playback this item.');
    expect(resultRef.current.playerConfig.sources).toEqual([]);
  });
});

describe('useShowInaccessibleMessage', () => {
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  let UIComponent;
  beforeEach(() => {
    // Fake timers using Jest
    jest.useFakeTimers('modern');
    UIComponent = () => {
      const results = hooks.useShowInaccessibleMessage({
        lastCanvasIndex: 5
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
  });

  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('returns messageTime = 10 when autoAdvance = false (default)', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist, 1, true)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.messageTime).toEqual(10);
  });

  // FIXME:: cannot return updated messageTime, 
  // eventhough the state variable messageTime is updated in the hook
  test.skip('returns messageTime to change when autoAdvance = true', () => {
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(playlist, 1, true),
        autoAdvance: true, canvasIsEmpty: true
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);

    act(() => {
      // Fast-forward time by 2.5 second
      jest.advanceTimersByTime(2500);

      expect(resultRef.current.messageTime).toEqual(7);
    });
  });
});

describe('useActiveStructure', () => {
  const liRef = { current: '' };
  const sectionRef = { current: '' };
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = hooks.useActiveStructure({
        ...props
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
    return UIComponent;
  };

  describe('with TreeNode type structure item', () => {
    let UIComponent;
    beforeEach(() => {
      UIComponent = renderHook({
        itemId: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=0,160',
        liRef,
        isCanvas: false,
        canvasDuration: 660,
        sectionRef,
        times: { start: 0, end: 60 }
      });
    });
    test('returns isActiveLi = false when currentNavItem = null', () => {
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.isActiveLi).toBeFalsy();
    });

    test('returns isActiveLi = true when currentNavItem is current structure item', () => {
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners),
          currentNavItem: {
            canvasDuration: 660,
            canvasIndex: 1,
            duration: '00:16',
            homepage: '',
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=0,160',
            isCanvas: false,
            isClickable: true,
            isEmpty: false,
            isRoot: false,
            isTitle: false,
            itemIndex: 1,
            items: [],
            label: 'Using Soap',
            rangeId: 'https://example.com/manifest/lunchroom_manners/range/1-1-1',
            summary: undefined
          }
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.isActiveLi).toBeTruthy();
    });
  });

  describe('with section type structure item', () => {
    const setSectionIsCollapsedMock = jest.fn();
    let props = {
      isCanvas: true,
      canvasDuration: 660,
      liRef: sectionRef,
      setSectionIsCollapsed: setSectionIsCollapsedMock,
      times: { start: 0, end: 0 }
    };

    test('returns isActiveSection = true when Canvas is selected', () => {
      const UIComponent = renderHook({
        ...props,
        itemIndex: 1, // itemIndex = canvasIndex + 1
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.isActiveSection).toBeTruthy();
    });

    test('returns isActiveSection = false when another Canvas is selected', () => {
      const UIComponent = renderHook({
        ...props,
        itemIndex: 2, // itemIndex = canvasIndex + 1
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.isActiveSection).toBeFalsy();
    });

    test('returns isActiveSection = false when structure item has isRoot = true', () => {
      const UIComponent = renderHook({
        ...props,
        itemIndex: 1, // itemIndex = canvasIndex + 1
        isRoot: true
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.isActiveSection).toBeFalsy();
    });
  });

});

describe('useAnnotationRow', () => {
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = hooks.useAnnotationRow({
        ...props
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
    return UIComponent;
  };

  test('returns checkCanvas function', () => {
    const UIComponent = renderHook({
      canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1'
    });
    const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
      initialManifestState: {
        ...manifestState(lunchroomManners)
      },
      initialPlayerState: {},
    });
    render(<CustomComponent />);
    expect(resultRef.current.checkCanvas).toBeDefined();
    expect(typeof resultRef.current.checkCanvas).toBe('function');
  });
});


describe('useSyncPlayback', () => {
  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  const playerRef = { current: { targets: [{ start: 10.23, end: 100.34 }] } };
  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = hooks.useSyncPlayback({
        ...props
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
    return UIComponent;
  };

  describe('for time range annotations, when player\'s currentTime is', () => {
    let props = {
      displayedAnnotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 7, end: 44 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/2',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 24.32, end: 25.33 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '<strong>Subjects</strong>: Singing' }]
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/3',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 28.43, end: 29.35 },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'The Yale Glee Club singing "Mother of Men"' }]
        },
      ],
      playerRef,
    };

    test('not within annotation\'s start and end times; returns inPlayerRange=false', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 7, endTime: 44, currentTime: 5 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      expect(resultRef.current.inPlayerRange).toBeFalsy();
    });

    describe('within annotation\'s start and end times', () => {
      test('without other overlapping annotations; returns inPlayerRange = true', () => {
        const UIComponent = renderHook({
          ...props,
          times: { startTime: 7, endTime: 44, currentTime: 10 }
        });
        const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
          initialManifestState: {
            ...manifestState(lunchroomManners)
          },
          initialPlayerState: {},
        });
        render(<CustomComponent />);

        expect(resultRef.current.inPlayerRange).toBeTruthy();
      });

      test('with overlapping annotations; returns inPlayerRange = false', () => {
        const UIComponent = renderHook({
          ...props,
          times: { startTime: 7, endTime: 44, currentTime: 24.35 }
        });
        const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
          initialManifestState: {
            ...manifestState(lunchroomManners)
          },
          initialPlayerState: {},
        });
        render(<CustomComponent />);

        expect(resultRef.current.inPlayerRange).toBeFalsy();
      });
    });

    test('within annotation\'s range; returns inPlayerRange=true', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 28.43, endTime: 29.35, currentTime: 28.45 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      expect(resultRef.current.inPlayerRange).toBeTruthy();
    });
  });

  describe('for time-point annotations, when player\'s currentTime is', () => {
    let props = {
      displayedAnnotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 7, end: undefined },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/2',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 24.32, end: undefined },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '<strong>Subjects</strong>: Singing' }]
        },
      ],
      playerRef,
    };

    test('before first annotation; returns inPlayerRange=false ', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 7, endTime: undefined, currentTime: 5 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      expect(resultRef.current.inPlayerRange).toBeFalsy();
    });

    test('between first and second annotations; returns inPlayerRange=true for first annotation ', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 7, endTime: undefined, currentTime: 10.34 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      expect(resultRef.current.inPlayerRange).toBeTruthy();
    });

    test('between first and second annotation; returns inPlayerRange=false for second annotation ', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 24.32, endTime: undefined, currentTime: 10.34 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      expect(resultRef.current.inPlayerRange).toBeFalsy();
    });
  });

  describe('with a clicked annotation', () => {
    let props = {
      annotationId: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
      displayedAnnotations: [
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 7, end: undefined },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
        },
        {
          id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/2',
          canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
          motivation: ['supplementing'],
          time: { start: 24.32, end: undefined },
          value: [{ format: 'text/plain', purpose: ['supplementing'], value: '<strong>Subjects</strong>: Singing' }]
        },
      ],
      playerRef,
    };
    test('returns inPlayerRange=true when clickedAnnotation is the current annotation', () => {
      const UIComponent = renderHook({
        ...props,
        times: { startTime: 7, endTime: undefined, currentTime: 5 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners),
          clickedAnnotation: {
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
            canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
            motivation: ['supplementing'],
            time: { start: 7, end: undefined },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
          }
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.inPlayerRange).toBeTruthy();
    });

    test('returns inPlayerRange=false when clickedAnnotation is not the current annotation', () => {
      const UIComponent = renderHook({
        ...props,
        annotationId: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/2',
        times: { startTime: 24.32, endTime: undefined, currentTime: 5 }
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners),
          clickedAnnotation: {
            id: 'https://example.com/manifest/lunchroom_manners/canvas/1/annotation-page/1/annotation/1',
            canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
            motivation: ['supplementing'],
            time: { start: 7, end: undefined },
            value: [{ format: 'text/plain', purpose: ['supplementing'], value: 'Men singing' }]
          }
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.inPlayerRange).toBeFalsy();
    });
  });

  describe('on player\'s timeupdate event', () => {
    describe('calls setCurrentTime when enableTimeupdate=true', () => {
      test('with actual currentTime for first source', () => {
        const setCurrentTimeMock = jest.fn();
        let timeupdateHandler;

        const UIComponent = renderHook({
          enableTimeupdate: true,
          setCurrentTime: setCurrentTimeMock,
          playerRef: {
            current: {
              targets: [{ start: 0, end: 10.56 }],
              srcIndex: 0,
              currentTime: jest.fn(() => { return 10.23; }),
              on: jest.fn((event, handler) => {
                if (event === 'timeupdate') {
                  timeupdateHandler = handler;
                }
              })
            }
          },
        });
        const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
          initialManifestState: {
            ...manifestState(lunchroomManners)
          },
          initialPlayerState: {},
        });
        render(<CustomComponent />);

        // Manually trigger the timeupdate event
        act(() => { timeupdateHandler(); });

        expect(setCurrentTimeMock).toHaveBeenCalledWith(10.23);
      });

      test('with relative currentTime for second source', () => {
        const setCurrentTimeMock = jest.fn();
        let timeupdateHandler;

        const UIComponent = renderHook({
          enableTimeupdate: true,
          setCurrentTime: setCurrentTimeMock,
          playerRef: {
            current: {
              targets: [{ start: 0, end: 10.56, altStart: 0 }, { start: 0, end: 15.05, altStart: 10.56 },],
              srcIndex: 1,
              currentTime: jest.fn(() => { return 10.23; }),
              on: jest.fn((event, handler) => {
                if (event === 'timeupdate') {
                  timeupdateHandler = handler;
                }
              })
            }
          },
        });
        const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
          initialManifestState: {
            ...manifestState(lunchroomManners)
          },
          initialPlayerState: {},
        });
        render(<CustomComponent />);

        // Manually trigger the timeupdate event
        act(() => { timeupdateHandler(); });

        expect(setCurrentTimeMock).toHaveBeenCalledWith(20.79);
      });
    });

    test('doesn\'t register event listener when enableTimeupdate=false', () => {
      const setCurrentTimeMock = jest.fn();
      const onMock = jest.fn();

      const UIComponent = renderHook({
        canvasId: 'https://example.com/manifest/lunchroom_manners/canvas/1',
        displayedAnnotations: [],
        enableTimeupdate: false,
        setCurrentTime: setCurrentTimeMock,
        playerRef: {
          current: {
            targets: [{ start: 0, end: 10.56 }],
            currentTime: jest.fn(() => { return 10.23; }),
            on: onMock
          }
        },
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: {
          ...manifestState(lunchroomManners)
        },
        initialPlayerState: {},
      });
      render(<CustomComponent />);

      // Verify that the event listener was not registered
      expect(onMock).not.toHaveBeenCalled();
      expect(setCurrentTimeMock).not.toHaveBeenCalled();
    });
  });
});

describe('useShowMoreOrLess', () => {
  const annotationRef = { current: '' };
  const annotationTagsRef = { current: '' };
  const annotationTextsRef = { current: { clientWidth: 500 } };
  const annotationTimesRef = { current: '' };
  const containerRef = { current: '' };
  const setIsShowMoreRefMock = jest.fn();
  const setIsActiveMock = jest.fn();

  const refs = {
    annotationRef, annotationTagsRef, annotationTextsRef, annotationTimesRef, containerRef,
  };
  const props = {
    autoScrollEnabled: true,
    enableShowMore: true,
    MAX_LINES: 6,
    refs,
    setIsActive: setIsActiveMock,
    setIsShowMoreRef: setIsShowMoreRefMock,
  };

  // not a real ref because react throws warning if we use outside a component
  const resultRef = { current: null };
  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = hooks.useShowMoreOrLess({
        ...props
      });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (
        <div></div>
      );
    };
    return UIComponent;
  };
  beforeEach(() => {
    // Mock Canvas, getComputedStyle, and clientWidth of annotationTextRef for a controlled test
    jest.spyOn(window, 'getComputedStyle').mockImplementation((ele) => ({
      lineHeight: '24px',
      fontSize: '16px',
      font: '16px / 24px "Open Sans", sans-serif',
    }));
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: jest.fn(() => ({
        measureText: jest.fn((texts) => ({ width: texts.length * 10 })),
      })),
    });

    // Jest does not support the ResizeObserver API so mock it here to allow tests to run.
    const ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    window.ResizeObserver = ResizeObserver;
  });

  describe('when enableShowMore=true', () => {
    test('returns hasLongerText=true when a long text is present', () => {
      const UIComponent = renderHook({
        ...props,
        texts: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt \
  mollit anim id est laborum.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerText).toBeTruthy();
    });

    test('returns hasLongerText=false when a short text is present', () => {
      const UIComponent = renderHook({
        ...props,
        texts: 'Lorem ipsum dolor sit amet.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerText).toBeFalsy();
    });

    test('returns hasLongerTags=false when no tags are provided', () => {
      const UIComponent = renderHook({
        ...props,
        texts: 'Lorem ipsum dolor sit amet.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerTags).toBeFalsy();
    });

    test('returns hasLongerTags=true when a long list of tags are provided', () => {
      const UIComponent = renderHook({
        ...props,
        texts: 'Lorem ipsum dolor sit amet.',
        tags: [
          { format: 'text/plain', purpose: ['tagging'], tagColor: 'hsl(209, 80%, 90%)', value: 'Test' },
          { format: 'text/plain', purpose: ['tagging'], tagColor: 'hsl(210, 80%, 90%)', value: 'Song' },
          { format: 'text/plain', purpose: ['tagging'], tagColor: 'hsl(211, 80%, 90%)', value: 'Title:Congress' },
          { format: 'text/plain', purpose: ['tagging'], tagColor: 'hsl(212, 80%, 90%)', value: 'Insert Shot' },
          { format: 'text/plain', purpose: ['tagging'], tagColor: 'hsl(213, 80%, 90%)', value: 'Card' },
        ]
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerTags).toBeFalsy();
    });
  });

  describe('when enableShowMore=false', () => {
    test('returns hasLongerText=false when a long text is present', () => {
      const UIComponent = renderHook({
        ...props,
        enableShowMore: false,
        texts: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit \
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt \
mollit anim id est laborum.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerText).toBeFalsy();
    });

    test('returns hasLongerText=false when a short text is present', () => {
      const UIComponent = renderHook({
        ...props,
        enableShowMore: false,
        texts: 'Lorem ipsum dolor sit amet.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerText).toBeFalsy();
    });

    test('returns hasLongerTags=false when no tags are provided', () => {
      const UIComponent = renderHook({
        ...props,
        texts: 'Lorem ipsum dolor sit amet.'
      });
      const CustomComponent = withManifestAndPlayerProvider(UIComponent, {
        initialManifestState: { ...manifestState(lunchroomManners, 0) },
        initialPlayerState: {},
      });
      render(<CustomComponent />);
      expect(resultRef.current.hasLongerTags).toBeFalsy();
    });
  });
});
