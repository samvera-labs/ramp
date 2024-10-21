import React, { act, useEffect } from 'react';
import { fireEvent, render } from "@testing-library/react";
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
  let originalError;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
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

  describe('with ListItem type structure item', () => {
    let UIComponent;
    beforeEach(() => {
      UIComponent = renderHook({
        itemId: 'https://example.com/manifest/lunchroom_manners/canvas/1#t=0,160',
        liRef,
        isCanvas: false,
        canvasDuration: 660,
        sectionRef
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

  describe('with SectionHeading type structure item', () => {
    const setSectionIsCollapsedMock = jest.fn();
    let props = {
      isCanvas: true,
      canvasDuration: 660,
      liRef: sectionRef,
      setSectionIsCollapsed: setSectionIsCollapsedMock,
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
