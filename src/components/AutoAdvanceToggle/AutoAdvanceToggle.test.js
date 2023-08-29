import React from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import AutoAdvanceToggle from "./AutoAdvanceToggle";
import manifest from '@TestData/lunchroom-manners';
import autoAdvanceManifest from '@TestData/multiple-canvas-auto-advance';
import { withManifestProvider } from '../../services/testing-helpers';

describe('AutoAdvanceToggle', () => {
  describe('with manifest without auto-advance behavior', () => {
    beforeEach(() => {
      const NonAutoManifest = withManifestProvider(AutoAdvanceToggle, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<NonAutoManifest />);
    });
    test('renders auto advance toggle successfully', () => {
      expect(screen.queryByTestId('auto-advance')).toBeInTheDocument();
      expect(screen.queryByTestId('auto-advance-label')).toBeInTheDocument();
      expect(screen.queryByTestId('auto-advance-toggle')).toBeInTheDocument();
    });
    test('auto advance is disabled by defulat', () => {
      const toggle = screen.queryByTestId('auto-advance-toggle');
      expect(toggle.checked).toEqual(false);
    });
    test('auto advance is toggled on click', () => {
      const toggle = screen.queryByTestId('auto-advance-toggle');
      fireEvent.click(toggle);
      expect(toggle.checked).toEqual(true);
    });
  });
  describe('with manifest with auto-advance behavior', () => {
    beforeEach(() => {
      const AutoAdvanceWithManifest = withManifestProvider(AutoAdvanceToggle, {
        initialState: { manifest: autoAdvanceManifest, canvasIndex: 0 },
      });
      render(<AutoAdvanceWithManifest />);
    });
    test('renders auto advance toggle successfully', () => {
      expect(screen.queryByTestId('auto-advance')).toBeInTheDocument();
      expect(screen.queryByTestId('auto-advance-label')).toBeInTheDocument();
      expect(screen.queryByTestId('auto-advance-toggle')).toBeInTheDocument();
    });
    test('auto advance is enabled', () => {
      const toggle = screen.queryByTestId('auto-advance-toggle');
      expect(toggle.checked).toEqual(true);
    });
    test('auto advance is toggled on click', () => {
      const toggle = screen.queryByTestId('auto-advance-toggle');
      fireEvent.click(toggle);
      expect(toggle.checked).toEqual(false);
    });
  });
});
