import React, { useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { useStructurePlayback } from './useStructurePlayback';
import { manifestState, withManifestAndPlayerProvider } from '@Services/testing-helpers';
import lunchroomManners from '@TestData/lunchroom-manners';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';

describe('useStructurePlayback', () => {
  // not a real ref because react throws a warning if we use useRef outside a component
  const resultRef = { current: null };

  // Minimal VideoJS player with mocked event handling
  const mockPlayer = () => {
    const listeners = {};
    return {
      one: jest.fn((event, cb) => { listeners[event] = cb; }),
      off: jest.fn((event, cb) => { if (listeners[event] === cb) delete listeners[event]; }),
      play: jest.fn(),
      currentTime: jest.fn(),
      trigger: (event) => {
        const callback = listeners[event];
        delete listeners[event];
        callback?.();
      },
    };
  };

  const renderHook = (props = {}) => {
    const UIComponent = () => {
      const results = useStructurePlayback({ ...props });
      useEffect(() => {
        resultRef.current = results;
      }, [results]);
      return (<div></div>);
    };
    return UIComponent;
  };

  let player, originalError;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    player = mockPlayer();
    resultRef.current = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    console.error = originalError;
  });

  // canvasSegements to populated in ManifestState for each test-case
  const canvasSegments = [
    { canvasIndex: 1, isCanvas: true, label: 'Canvas 1', times: { start: 0, end: 600 } },
    { canvasIndex: 1, isCanvas: false, label: 'Segment 2', times: { start: 120, end: 200 } },
    { canvasIndex: 1, isCanvas: false, label: 'Segment 1', times: { start: 30, end: 100 } },
    { canvasIndex: 2, isCanvas: false, label: 'Segment 3', times: { start: 50, end: 90 } },
    { canvasIndex: 3, isCanvas: false, label: 'Segment 4', times: { start: 20, end: 54 } },
  ];

  describe('firstTimespan', () => {
    describe('with toggleState="true"', () => {
      test('is the first timespan on the current Canvas', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toEqual(canvasSegments[2]);
        expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
      });

      test('is null when the current Canvas has no structure timespans', () => {
        // canvasIndex=3 in manifestState refers to the forth Canvas in canvasSegments
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners, 3), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toBeNull();
      });

      test('is null when there is a resume state', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toBeNull();
      });

      test('is the first timespan for the current Canvas when the Canvas changes', async () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        const { rerender } = render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toEqual(canvasSegments[2]);

        // Re-render the component with Canvas 2
        const CustomComponent1 = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners, 2), canvasSegments },
          initialPlayerState: { player },
        });
        rerender(<CustomComponent1 />);

        act(() => expect(resultRef.current.firstTimespan).toEqual(canvasSegments[4]));
      });
    });

    test('with toggleState="false" is null', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.firstTimespan).toBeNull();
    });

    describe('with toggleState="undefined"', () => {
      test('is null when Manifest "behavior" is not defined (defaults to "no-auto-advance")', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toBeNull();
      });

      test('is the first timespan for the current Canvas when Manifest behavior="auto-advance"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(autoAdvanceManifest), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.firstTimespan).toEqual(canvasSegments[2]);
      });
    });
  });

  describe('showNotice', () => {
    describe('with toggleState="true"', () => {
      test('is set to "true"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeTruthy();
      });

      test('is set to "false" when the current Canvas has no structure timespans', () => {
        // canvasIndex=3 in manifestState refers to the forth Canvas in canvasSegments
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners, 3), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeFalsy();
      });

      test('is set to "false" when there is a resume state', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeFalsy();
      });
    });

    test('with toggleState="false" is set to "false"', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.showNotice).toBeFalsy();
    });

    describe('with toggleState="undefined"', () => {
      test('is set to "false" when Manifest "behavior" is not defined (defaults to "no-auto-advance")', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeFalsy();
      });

      test('is set to "true" when Manifest behavior="auto-advance"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(autoAdvanceManifest), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeTruthy();
      });
    });
  });

  describe('structureOnlyPlayback', () => {
    describe('with toggleState="true"', () => {
      test('is set to "true"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
      });

      test('is set to "true" when the current Canvas has no structure timespans', () => {
        // canvasIndex=3 in manifestState refers to the forth Canvas in canvasSegments
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners, 3), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
      });

      test('is set to "true" regardles of the resume state', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
      });
    });

    test('with toggleState="false" is set to "false"', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.structureOnlyPlayback).toBeFalsy();
    });

    describe('with toggleState="undefined"', () => {
      test('is set to "false" when Manifest "behavior" is not defined (defaults to "no-auto-advance")', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.structureOnlyPlayback).toBeFalsy();
      });

      test('is set to "true" when Manifest behavior="auto-advance"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(autoAdvanceManifest), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
      });
    });
  });

  describe('showStaticStructNotice', () => {
    describe('with toggleState="true" and hasUI="false"', () => {
      test('is set to "true"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true, hasUI: false }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showStaticStructNotice).toBeTruthy();
      });

      test('is set to "false" when there is a resume state', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true, hasUI: false }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showStaticStructNotice).toBeFalsy();
      });
    });

    test('is set to "false" with toggleState="false" and hasUI="false"', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false, hasUI: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      expect(resultRef.current.showStaticStructNotice).toBeFalsy();
    });
  });

  describe('initial play event', () => {
    describe('is registered as a one-time play handler for the player instance', () => {
      test('when toggleState="true"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(player.one).toHaveBeenCalledTimes(1);
        expect(player.one).toHaveBeenCalledWith('play', expect.any(Function));
      });

      test('when toggleState="false"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(player.one).toHaveBeenCalledTimes(1);
        expect(player.one).toHaveBeenCalledWith('play', expect.any(Function));
      });
    });

    describe('with toggleState="true"', () => {
      test('seeks to the start of first timespan', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        act(() => { player.trigger('play'); });

        expect(player.currentTime).toHaveBeenCalledWith(30);
        expect(resultRef.current.showNotice).toBeFalsy();
      });

      test('does not seek when there is a saved playback position', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        act(() => { player.trigger('play'); });

        expect(player.currentTime).not.toHaveBeenCalled();
      });

      test('does not seek when the current Canvas has no structure timespans', () => {
        // canvasIndex=3 in manifestState refers to the forth Canvas in canvasSegments
        const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
          initialManifestState: { ...manifestState(lunchroomManners, 3), canvasSegments, hasResume: true },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        act(() => { player.trigger('play'); });

        expect(player.currentTime).not.toHaveBeenCalled();
        expect(resultRef.current.showNotice).toBeFalsy();
      });
    });

    test('with toggleState="false" does not seek', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      act(() => { player.trigger('play'); });

      expect(player.currentTime).not.toHaveBeenCalled();
    });

    describe('with toggleState="undefined"', () => {
      test('does not seek when Manifest "behavior" is not defined (defaults to "no-auto-advance")', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeFalsy();

        act(() => { player.trigger('play'); });

        expect(player.currentTime).not.toHaveBeenCalled();
        expect(resultRef.current.showNotice).toBeFalsy();
      });

      test('seeks to the start of first timespan when Manifest behavior="auto-advance"', () => {
        const CustomComponent = withManifestAndPlayerProvider(renderHook({}), {
          initialManifestState: { ...manifestState(autoAdvanceManifest), canvasSegments },
          initialPlayerState: { player },
        });
        render(<CustomComponent />);

        expect(resultRef.current.showNotice).toBeTruthy();

        act(() => { player.trigger('play'); });

        expect(player.currentTime).toHaveBeenCalledWith(30);
        expect(resultRef.current.showNotice).toBeFalsy();
      });
    });

    test('handler is removed when a structure item is clicked', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      const { rerender } = render(<CustomComponent />);

      // Registers the play handler callback once
      expect(player.one).toHaveBeenCalledTimes(1);
      // Displays the structure notice
      expect(resultRef.current.showNotice).toBeTruthy();

      // Re-render the component with a isClicked state to simulate timespan click in UI
      const CustomComponent1 = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
        initialManifestState: { ...manifestState(lunchroomManners, 2), canvasSegments },
        initialPlayerState: { player, isClicked: true },
      });
      rerender(<CustomComponent1 />);

      // Removes the play handler callback
      expect(player.off).toHaveBeenCalledWith('play', player.one.mock.calls[0][1]);
      // Dismisses the structure notice
      expect(resultRef.current.showNotice).toBeFalsy();

      act(() => { player.trigger('play'); });
      expect(player.currentTime).not.toHaveBeenCalled();
    });
  });

  test('onAcknowledge() dismisses the notice and keeps structure-only playback on', () => {
    const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
      initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
      initialPlayerState: { player },
    });
    render(<CustomComponent />);

    act(() => { resultRef.current.onAcknowledge(); });

    expect(resultRef.current.showNotice).toBeFalsy();
    expect(player.play).not.toHaveBeenCalled();
    expect(resultRef.current.structureOnlyPlayback).toBeTruthy();
  });

  test('onTurnOff() dismisses the notice and turns off structure-only playback', () => {
    const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
      initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
      initialPlayerState: { player },
    });
    render(<CustomComponent />);

    act(() => { resultRef.current.onTurnOff(); });

    expect(resultRef.current.showNotice).toBeFalsy();
    expect(resultRef.current.structureOnlyPlayback).toBeFalsy();
  });

  describe('handleChange', () => {
    test('turns structure-only playback OFF when it is ON', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: true }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      const target = document.createElement('div');

      act(() => { resultRef.current.handleChange({ target }); });

      // Structure-only playback is turned OFF
      expect(target).toHaveAttribute('aria-checked', 'false');
      expect(resultRef.current.structureOnlyPlayback).toBeFalsy();

      expect(resultRef.current.showNotice).toBeFalsy();
      expect(resultRef.current.firstTimespan).toBeNull();
    });

    test('turns structure-only playback ON when it is OFF', () => {
      const CustomComponent = withManifestAndPlayerProvider(renderHook({ toggleState: false }), {
        initialManifestState: { ...manifestState(lunchroomManners), canvasSegments },
        initialPlayerState: { player },
      });
      render(<CustomComponent />);

      const target = document.createElement('div');

      act(() => { resultRef.current.handleChange({ target }); });

      // Structure-only playback is turned ON
      expect(target).toHaveAttribute('aria-checked', 'true');
      expect(resultRef.current.structureOnlyPlayback).toBeTruthy();

      expect(resultRef.current.showNotice).toBeTruthy();
      expect(resultRef.current.firstTimespan).toEqual(canvasSegments[2]);
    });
  });
});


