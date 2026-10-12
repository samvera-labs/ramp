import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import StructureOnlyToggle from './StructureOnlyToggle';
import { crossRangeWithSwitchBack } from '@TestData/multi-part-ranges';
import { manifestState, withManifestAndPlayerProvider } from '@Services/testing-helpers';

// These test assume 'structurePlayback' is turned ON at the root level
describe('StructureOnlyToggle', () => {
  // Alternating timespans between Canvas 1 & 2, followed by a timespan back on Canvas 1
  const CANVAS_1 = 'http://example.com/multi-part-ranges/canvas/1';
  const CANVAS_2 = 'http://example.com/multi-part-ranges/canvas/2';
  const canvasSegments = [
    { id: `${CANVAS_1}#t=550,575`, label: 'Track spanning both sides', canvasIndex: 1, isCanvas: false, canvasDuration: 600, times: { start: 550, end: 575 } },
    { id: `${CANVAS_2}#t=80,150`, label: 'Track spanning both sides', canvasIndex: 2, isCanvas: false, canvasDuration: 400, times: { start: 80, end: 150 } },
    { id: `${CANVAS_1}#t=575,600`, label: 'Track within Side A after Side B', canvasIndex: 2, isCanvas: false, canvasDuration: 600, times: { start: 575, end: 600 } },
  ];

  // Mock the player functions
  let player;
  beforeEach(() => {
    player = { one: jest.fn(), off: jest.fn(), play: jest.fn(), currentTime: jest.fn() };
  });

  afterEach(() => { jest.clearAllMocks(); });

  // Helper function to load StructureOnlyToggle with state
  const renderToggle = ({ manifestOverrides = {}, props = {} }) => {
    const allProps = { label: 'Play structure only', initStatus: false, show: true, ...props };
    const ToggleWithState = withManifestAndPlayerProvider(StructureOnlyToggle, {
      initialManifestState: {
        ...manifestState(crossRangeWithSwitchBack), canvasSegments,
        ...manifestOverrides,
      },
      initialPlayerState: { player, isClicked: false },
      ...allProps,
    });
    render(<ToggleWithState />);
  };

  describe('with initStatus="false"', () => {
    describe('with show="true" renders the toggle ', () => {
      test('with default label', () => {
        renderToggle({});
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
      });

      test('with a custom label', () => {
        renderToggle({ props: { label: 'Auto-play structure' } });
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Auto-play structure');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
      });

      test('toggled OFF without the structure notice', () => {
        renderToggle({});
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
        expect(screen.queryByText('Structure-only playback is turned on')).not.toBeInTheDocument();
      });

      test('without the structure notice when an alt start time exists', () => {
        renderToggle({ manifestOverrides: { hasResume: true } });
        expect(screen.queryByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      describe('and can be toggled ON by', () => {
        beforeEach(() => {
          renderToggle({});
        });

        test('click', () => {
          fireEvent.click(screen.getByRole('switch'));
          expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });

        test('Space keypress', () => {
          fireEvent.keyDown(screen.getByRole('switch'), { key: ' ', keyCode: 32 });
          expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });

        test('Enter keypress', () => {
          fireEvent.keyDown(screen.getByRole('switch'), { key: 'Enter', keyCode: 13 });
          expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });
      });

      test('and cannot be toggled on using other keypresses', () => {
        renderToggle({});
        fireEvent.keyDown(screen.getByRole('switch'), { key: 'a', keyCode: 65 });
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      });
    });

    test('doesn\'t render the toggle when show="false"', () => {
      renderToggle({ props: { show: false } });
      expect(screen.queryByTestId('structure-only-playback')).not.toBeInTheDocument();
    });
  });

  describe('with initStatus="true"', () => {
    describe('when show="true" renders the toggle', () => {
      test('with the default label', () => {
        renderToggle({ props: { initStatus: true } });
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
      });

      test('with a custom label', () => {
        renderToggle({ props: { initStatus: true, label: 'Auto-play structure' } });
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Auto-play structure');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
      });

      test('toggled ON and has the first timespan info in notice', () => {
        renderToggle({ props: { initStatus: true } });
        expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
        expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
        expect(screen.queryByText('Structure-only playback is turned on')).toBeInTheDocument();
      });

      test('without the notice when an alt start time exists', () => {
        renderToggle({ manifestOverrides: { hasResume: true }, props: { initStatus: true } });
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });

      test('and can be toggled OFF on click and dismisses the notice', () => {
        renderToggle({ props: { initStatus: true } });
        fireEvent.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    test('doesn\'t render the toggle when show="false"', () => {
      renderToggle({ props: { initStatus: true, show: false } });
      expect(screen.queryByTestId('structure-only-playback')).not.toBeInTheDocument();
    });

    test('\'Got it\' action dismisses the notice and keeps structure-only playback ON', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      // Structure-only playback stays ON
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    test('\'Turn off\' action dismisses the notice and turns structure-only playback OFF', () => {
      renderToggle({ props: { initStatus: true } });
      expect(screen.queryByRole('status')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Turn off' }));
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      expect(player.play).not.toHaveBeenCalled();
    });

    test('dismiss "×" button click dismisses the notice and keeps structure-only playback ON', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      fireEvent.click(screen.getByRole('button', { name: '×' }));
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      // Structure-only playback stays ON
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

  });
});
