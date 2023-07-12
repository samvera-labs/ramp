import React from "react";
import { render, screen } from '@testing-library/react';
import SupplementalFiles from "./SupplementalFiles";
import manifest from '@TestData/lunchroom-manners';
import { withManifestProvider } from '../../services/testing-helpers';

describe('SupplementalFiles', () => {
  beforeEach(() => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { manifest, canvasIndex: 0 },
    });
    render(<SupplementalFileWrapped />);
  });

  test('renders successfully', () => {
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
  });
})

