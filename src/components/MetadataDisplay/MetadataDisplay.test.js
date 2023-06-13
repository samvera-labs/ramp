import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataDisplay from './MetadataDisplay';
import manifest from '@Json/test_data/lunchroom-manners';
import manfiestWoMetadata from '@Json/test_data/volleyball-for-boys';
import { withManifestProvider } from '../../services/testing-helpers';

describe('MetadataDisplay component', () => {
  describe('with manifest with metadata', () => {
    describe('with default prop, displayTitle=true', () => {
      beforeEach(() => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest },
        });
        render(<MetadataDisp />);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
      });

      test('displays title in metadata', () => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
    });

    describe('with displayTitle=false', () => {
      beforeEach(() => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest },
          displayTitle: false,
        });
        render(<MetadataDisp />);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
      });

      test('doesn\'t display title in metadata', () => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
      });
    });

    it('with showHeading=false doesn\'t display Details heading', () => {
      const MetadataDisp = withManifestProvider(MetadataDisplay, {
        initialState: { manifest },
        showHeading: false,
      });
      render(<MetadataDisp />);
      expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
      expect(screen.queryByTestId('metadata-display-title')).not.toBeInTheDocument();
    });
  });

  it('with manifest without metadata renders a message', () => {
    const MetadataDisp = withManifestProvider(MetadataDisplay, {
      initialState: { manifest: manfiestWoMetadata },
    });
    render(<MetadataDisp />);
    expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
    expect(screen.getByText('No valid Metadata is in the Manifest'));
  });
});
