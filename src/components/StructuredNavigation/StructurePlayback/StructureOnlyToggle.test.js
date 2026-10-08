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
    const ToggleWithState = withManifestAndPlayerProvider(StructureOnlyToggle, {
      initialManifestState: {
        ...manifestState(crossRangeWithSwitchBack), canvasSegments, hasResume: false, structureOnlyPlayback: false,
        ...manifestOverrides,
      },
      initialPlayerState: { player, isClicked: false },
      ...props,
    });
    render(<ToggleWithState />);
  };

  describe('with "structureOnlyPlayback" in state OFF', () => {
    test('renders the toggle with the default label', () => {
      renderToggle({});
      expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
      expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
      expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
    });

    test('renders the toggle with a custom label', () => {
      renderToggle({ props: { label: 'Auto-play structure' } });
      expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Auto-play structure');
    });

    test('is unchecked and does not show the structure notice', () => {
      renderToggle({});
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    describe('can be toggled ON by', () => {
      test('click', () => {
        renderToggle({});
        fireEvent.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      });

      test('Space keypress', () => {
        renderToggle({});
        fireEvent.keyDown(screen.getByRole('switch'), { key: ' ', keyCode: 32 });
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      });

      test('Enter keypress', () => {
        renderToggle({});
        fireEvent.keyDown(screen.getByRole('switch'), { key: 'Enter', keyCode: 13 });
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      });
    });

    test('cannot be toggled on using other keypresses', () => {
      renderToggle({});
      fireEvent.keyDown(screen.getByRole('switch'), { key: 'a', keyCode: 65 });
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('with "structureOnlyPlayback" in state ON', () => {
    test('renders the toggle with the default label', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
      expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Play structure only');
      expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
    });

    test('renders the toggle with a custom label', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true }, props: { label: 'Auto-play structure' } });
      expect(screen.getByTestId('structure-only-playback')).toBeInTheDocument();
      expect(screen.getByTestId('structure-only-playback-label')).toHaveTextContent('Auto-play structure');
      expect(screen.getByText('Skip unstructured portions of the media')).toBeInTheDocument();
    });

    test('is checked and shows the notice for the first timespan', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Structure-only playback is turned on')).toBeInTheDocument();
      expect(screen.getByText('Playback will begin at 09:10 with "Track spanning both sides"')).toBeInTheDocument();
    });

    test('does not show the notice when an alt start time exists', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true, hasResume: true } });
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('can be toggled OFF on click and dismisses the notice', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      fireEvent.click(screen.getByRole('switch'));
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('\'Play from beginning\' action dismisses the notice and plays the media', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      fireEvent.click(screen.getByRole('button', { name: 'Play from beginning' }));
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(player.play).toHaveBeenCalledTimes(1);
      // Structure-only playback stays ON
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    test('\'Turn off\' action dismisses the notice and turns structure-only playback OFF', () => {
      renderToggle({ manifestOverrides: { structureOnlyPlayback: true } });
      fireEvent.click(screen.getByRole('button', { name: 'Turn off' }));
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
      expect(player.play).not.toHaveBeenCalled();
    });
  });
});
